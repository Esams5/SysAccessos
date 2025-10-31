package com.sysaccessos.backend.area;

import com.sysaccessos.backend.area.dto.AccessAreaDto;
import com.sysaccessos.backend.area.dto.AreaMovementRequest;
import com.sysaccessos.backend.area.dto.AreaMovementResponse;
import com.sysaccessos.backend.history.AccessHistory;
import com.sysaccessos.backend.history.AccessHistoryRepository;
import com.sysaccessos.backend.permission.UserPermission;
import com.sysaccessos.backend.permission.UserPermissionRepository;
import com.sysaccessos.backend.user.User;
import com.sysaccessos.backend.user.UserRepository;
import java.time.LocalDate;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AccessAreaMovementService {

    private final AccessAreaRepository areaRepository;
    private final UserRepository userRepository;
    private final UserPermissionRepository permissionRepository;
    private final AccessHistoryRepository historyRepository;
    private final AccessAreaService accessAreaService;

    public AccessAreaMovementService(AccessAreaRepository areaRepository, UserRepository userRepository,
                                     UserPermissionRepository permissionRepository,
                                     AccessHistoryRepository historyRepository,
                                     AccessAreaService accessAreaService) {
        this.areaRepository = areaRepository;
        this.userRepository = userRepository;
        this.permissionRepository = permissionRepository;
        this.historyRepository = historyRepository;
        this.accessAreaService = accessAreaService;
    }

    @Transactional
    public AreaMovementResponse move(AreaMovementRequest request) {
        String cardIdentifier = request.getCardIdentifier() == null ? "" : request.getCardIdentifier().trim();
        if (cardIdentifier.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O identificador do cartão é obrigatório.");
        }

        AccessArea area = areaRepository.findById(request.getAreaId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Área informada não existe."));

        if (!area.isActive()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Área informada está inativa.");
        }

        User user = userRepository.findByCardIdentifier(cardIdentifier)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cartão não identificado."));

        if (!hasActivePermission(user.getId(), area.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Usuário sem permissão ativa para a área informada.");
        }

        String movementType;
        String message;

        if (!area.isInUse()) {
            area.startUsage(user, cardIdentifier);
            movementType = "ENTRADA";
            message = "Uso da sala iniciado.";
        } else {
            if (!cardIdentifier.equals(area.getOccupantCardIdentifier())) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Sala em uso por outro cartão.");
            }
            area.finishUsage();
            movementType = "SAIDA";
            message = "Uso da sala finalizado.";
        }

        AccessHistory history = new AccessHistory();
        history.setUser(user);
        history.setArea(area);
        history.setEventType(movementType);
        history.setResult("AUTORIZADO");
        history.setCardIdentifier(cardIdentifier);
        history.setNotes(request.getNotes());
        historyRepository.save(history);

        areaRepository.save(area);

        AccessAreaDto dto = accessAreaService.toDto(area);
        return new AreaMovementResponse(area.getId(), movementType, message, dto);
    }

    private boolean hasActivePermission(Long userId, Long areaId) {
        LocalDate today = LocalDate.now();
        List<UserPermission> permissions = permissionRepository.findByUserIdAndAreaId(userId, areaId);
        return permissions.stream().anyMatch(permission ->
            !permission.getValidFrom().isAfter(today)
                && !permission.getValidUntil().isBefore(today)
                && "ATIVA".equalsIgnoreCase(permission.getStatus())
        );
    }
}
