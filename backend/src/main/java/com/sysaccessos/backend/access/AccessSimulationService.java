package com.sysaccessos.backend.access;

import com.sysaccessos.backend.access.dto.AccessSimulationRequest;
import com.sysaccessos.backend.access.dto.AccessSimulationResponse;
import com.sysaccessos.backend.area.AccessArea;
import com.sysaccessos.backend.area.AccessAreaRepository;
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
public class AccessSimulationService {

    private final UserRepository userRepository;
    private final AccessAreaRepository areaRepository;
    private final UserPermissionRepository permissionRepository;
    private final AccessHistoryRepository historyRepository;

    public AccessSimulationService(UserRepository userRepository, AccessAreaRepository areaRepository,
                                   UserPermissionRepository permissionRepository, AccessHistoryRepository historyRepository) {
        this.userRepository = userRepository;
        this.areaRepository = areaRepository;
        this.permissionRepository = permissionRepository;
        this.historyRepository = historyRepository;
    }

    @Transactional
    public AccessSimulationResponse simulate(AccessSimulationRequest request) {
        AccessArea area = areaRepository.findById(request.getAreaId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Área informada não existe."));

        User user = userRepository.findByCardIdentifier(request.getCardIdentifier()).orElse(null);

        if (user == null) {
            return new AccessSimulationResponse(false, "NEGADO", "Cartão não identificado.", null, null,
                request.getCardIdentifier(), area.getName());
        }

        boolean authorized = hasActivePermission(user.getId(), area.getId());
        String result = authorized ? "AUTORIZADO" : "NEGADO";
        String message = authorized
            ? "Acesso autorizado para a área selecionada."
            : "Permissão não encontrada ou fora da vigência.";

        AccessHistory history = new AccessHistory();
        history.setUser(user);
        history.setArea(area);
        history.setEventType(request.getEventType() == null ? "ENTRADA" : request.getEventType());
        history.setResult(result);
        history.setCardIdentifier(request.getCardIdentifier());
        history.setNotes(request.getNotes());
        historyRepository.save(history);

        return new AccessSimulationResponse(authorized, result, message, user.getName(), user.getId(),
            request.getCardIdentifier(), area.getName());
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

