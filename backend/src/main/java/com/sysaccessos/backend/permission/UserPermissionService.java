package com.sysaccessos.backend.permission;

import com.sysaccessos.backend.area.AccessArea;
import com.sysaccessos.backend.area.AccessAreaRepository;
import com.sysaccessos.backend.permission.dto.UserPermissionDto;
import com.sysaccessos.backend.permission.dto.UserPermissionRequest;
import com.sysaccessos.backend.user.User;
import com.sysaccessos.backend.user.UserRepository;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserPermissionService {

    private final UserPermissionRepository permissionRepository;
    private final UserRepository userRepository;
    private final AccessAreaRepository areaRepository;

    public UserPermissionService(UserPermissionRepository permissionRepository, UserRepository userRepository,
                                 AccessAreaRepository areaRepository) {
        this.permissionRepository = permissionRepository;
        this.userRepository = userRepository;
        this.areaRepository = areaRepository;
    }

    @Transactional(readOnly = true)
    public List<UserPermissionDto> findAll() {
        return permissionRepository.findAll().stream()
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public UserPermissionDto findById(Long id) {
        UserPermission permission = permissionRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Permissão não encontrada."));
        return toDto(permission);
    }

    @Transactional
    public UserPermissionDto create(UserPermissionRequest request) {
        validateDates(request);
        User user = userRepository.findById(request.getUserId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Usuário informado não existe."));
        AccessArea area = areaRepository.findById(request.getAreaId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Área informada não existe."));

        if (permissionRepository.existsByUserIdAndAreaIdAndStatus(user.getId(), area.getId(), request.getStatus())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Já existe uma permissão ativa semelhante.");
        }

        UserPermission permission = new UserPermission();
        copyToEntity(request, user, area, permission);
        UserPermission saved = permissionRepository.save(permission);
        return toDto(saved);
    }

    @Transactional
    public UserPermissionDto update(Long id, UserPermissionRequest request) {
        validateDates(request);
        UserPermission permission = permissionRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Permissão não encontrada."));

        User user = userRepository.findById(request.getUserId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Usuário informado não existe."));
        AccessArea area = areaRepository.findById(request.getAreaId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Área informada não existe."));

        boolean statusChanged = !permission.getStatus().equalsIgnoreCase(request.getStatus())
            || !permission.getUser().getId().equals(user.getId())
            || !permission.getArea().getId().equals(area.getId());

        if (statusChanged && permissionRepository.existsByUserIdAndAreaIdAndStatus(user.getId(), area.getId(), request.getStatus())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Já existe uma permissão ativa semelhante.");
        }

        copyToEntity(request, user, area, permission);
        UserPermission saved = permissionRepository.save(permission);
        return toDto(saved);
    }

    @Transactional
    public void delete(Long id) {
        UserPermission permission = permissionRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Permissão não encontrada."));
        permissionRepository.delete(permission);
    }

    private void validateDates(UserPermissionRequest request) {
        if (request.getValidUntil().isBefore(request.getValidFrom())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Data final não pode ser anterior à data inicial.");
        }
    }

    private void copyToEntity(UserPermissionRequest request, User user, AccessArea area, UserPermission permission) {
        permission.setUser(user);
        permission.setArea(area);
        permission.setAccessLevel(request.getAccessLevel());
        permission.setValidFrom(request.getValidFrom());
        permission.setValidUntil(request.getValidUntil());
        permission.setStatus(request.getStatus());
        permission.setNotes(request.getNotes());
    }

    private UserPermissionDto toDto(UserPermission permission) {
        UserPermissionDto dto = new UserPermissionDto();
        dto.setId(permission.getId());
        dto.setUserId(permission.getUser().getId());
        dto.setUserName(permission.getUser().getName());
        dto.setUserEmail(permission.getUser().getEmail());
        dto.setAreaId(permission.getArea().getId());
        dto.setAreaName(permission.getArea().getName());
        dto.setAccessLevel(permission.getAccessLevel());
        dto.setValidFrom(permission.getValidFrom());
        dto.setValidUntil(permission.getValidUntil());
        dto.setStatus(permission.getStatus());
        dto.setNotes(permission.getNotes());
        dto.setCreatedAt(permission.getCreatedAt());
        dto.setUpdatedAt(permission.getUpdatedAt());
        return dto;
    }
}

