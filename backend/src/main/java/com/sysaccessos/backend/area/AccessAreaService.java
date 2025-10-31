package com.sysaccessos.backend.area;

import com.sysaccessos.backend.area.dto.AccessAreaDto;
import com.sysaccessos.backend.area.dto.AccessAreaRequest;
import com.sysaccessos.backend.permission.UserPermission;
import com.sysaccessos.backend.permission.UserPermissionRepository;
import com.sysaccessos.backend.user.User;
import com.sysaccessos.backend.user.UserRepository;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AccessAreaService {

    private final AccessAreaRepository areaRepository;
    private final UserRepository userRepository;
    private final UserPermissionRepository permissionRepository;

    public AccessAreaService(AccessAreaRepository areaRepository, UserRepository userRepository,
                             UserPermissionRepository permissionRepository) {
        this.areaRepository = areaRepository;
        this.userRepository = userRepository;
        this.permissionRepository = permissionRepository;
    }

    @Transactional(readOnly = true)
    public List<AccessAreaDto> findAll() {
        return areaRepository.findAll().stream()
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AccessAreaDto findById(Long id) {
        AccessArea area = areaRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Área de acesso não encontrada."));
        return toDto(area);
    }

    @Transactional
    public AccessAreaDto create(AccessAreaRequest request) {
        if (areaRepository.existsByNameIgnoreCase(request.getName())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Já existe uma área com esse nome.");
        }

        AccessArea area = new AccessArea();
        copyToEntity(request, area);
        AccessArea saved = areaRepository.save(area);
        return toDto(saved);
    }

    @Transactional
    public AccessAreaDto update(Long id, AccessAreaRequest request) {
        AccessArea area = areaRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Área de acesso não encontrada."));

        boolean nameChanged = !area.getName().equalsIgnoreCase(request.getName());
        if (nameChanged && areaRepository.existsByNameIgnoreCase(request.getName())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Já existe uma área com esse nome.");
        }

        copyToEntity(request, area);
        AccessArea saved = areaRepository.save(area);
        return toDto(saved);
    }

    @Transactional
    public void delete(Long id) {
        AccessArea area = areaRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Área de acesso não encontrada."));
        try {
            areaRepository.delete(area);
        } catch (DataIntegrityViolationException ex) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Área vinculada a permissões ou históricos.");
        }
    }

    private void copyToEntity(AccessAreaRequest request, AccessArea area) {
        area.setName(request.getName());
        area.setDescription(request.getDescription());
        area.setLocation(request.getLocation());
        area.setSecurityLevel(request.getSecurityLevel());
        area.setNotes(request.getNotes());
        area.setActive(request.isActive());
    }

    AccessAreaDto toDto(AccessArea area) {
        AccessAreaDto dto = new AccessAreaDto();
        dto.setId(area.getId());
        dto.setName(area.getName());
        dto.setDescription(area.getDescription());
        dto.setLocation(area.getLocation());
        dto.setSecurityLevel(area.getSecurityLevel());
        dto.setNotes(area.getNotes());
        dto.setInUse(area.isInUse());
        dto.setStatus(area.getStatus());
        dto.setOccupantName(area.getOccupantName());
        dto.setOccupantCardIdentifier(area.getOccupantCardIdentifier());
        dto.setOccupantUserId(area.getOccupantUserId());
        dto.setActive(area.isActive());
        dto.setLastMovementAt(area.getLastMovementAt());
        dto.setUsageDeadline(area.getUsageDeadline());
        dto.setCreatedAt(area.getCreatedAt());
        dto.setUpdatedAt(area.getUpdatedAt());
        return dto;
    }

    @Transactional(readOnly = true)
    public List<AccessAreaDto> findAuthorizedByCard(String cardIdentifier) {
        if (cardIdentifier == null || cardIdentifier.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O identificador do cartão é obrigatório.");
        }

        String trimmedIdentifier = cardIdentifier.trim();
        if (trimmedIdentifier.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O identificador do cartão é obrigatório.");
        }

        User user = userRepository.findByCardIdentifier(trimmedIdentifier)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cartão não identificado."));

        List<UserPermission> permissions = permissionRepository.findByUserId(user.getId()).stream()
            .filter(this::isPermissionActive)
            .collect(Collectors.toList());

        if (permissions.isEmpty()) {
            return List.of();
        }

        List<Long> areaIds = permissions.stream()
            .map(permission -> permission.getArea().getId())
            .filter(Objects::nonNull)
            .distinct()
            .collect(Collectors.toList());

        if (areaIds.isEmpty()) {
            return List.of();
        }

        return areaRepository.findAllById(areaIds).stream()
            .filter(AccessArea::isActive)
            .sorted(Comparator.comparing(AccessArea::getName, String.CASE_INSENSITIVE_ORDER))
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    private boolean isPermissionActive(UserPermission permission) {
        LocalDate today = LocalDate.now();
        return !permission.getValidFrom().isAfter(today)
            && !permission.getValidUntil().isBefore(today)
            && "ATIVA".equalsIgnoreCase(permission.getStatus());
    }
}
