package com.sysaccessos.backend.area;

import com.sysaccessos.backend.area.dto.AccessAreaDto;
import com.sysaccessos.backend.area.dto.AccessAreaRequest;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AccessAreaService {

    private final AccessAreaRepository areaRepository;

    public AccessAreaService(AccessAreaRepository areaRepository) {
        this.areaRepository = areaRepository;
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

    private AccessAreaDto toDto(AccessArea area) {
        AccessAreaDto dto = new AccessAreaDto();
        dto.setId(area.getId());
        dto.setName(area.getName());
        dto.setDescription(area.getDescription());
        dto.setLocation(area.getLocation());
        dto.setSecurityLevel(area.getSecurityLevel());
        dto.setNotes(area.getNotes());
        dto.setActive(area.isActive());
        dto.setCreatedAt(area.getCreatedAt());
        dto.setUpdatedAt(area.getUpdatedAt());
        return dto;
    }
}

