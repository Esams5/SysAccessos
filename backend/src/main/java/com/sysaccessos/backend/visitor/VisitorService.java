package com.sysaccessos.backend.visitor;

import com.sysaccessos.backend.visitor.dto.VisitorDto;
import com.sysaccessos.backend.visitor.dto.VisitorRequest;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class VisitorService {

    private final VisitorRepository visitorRepository;

    public VisitorService(VisitorRepository visitorRepository) {
        this.visitorRepository = visitorRepository;
    }

    @Transactional(readOnly = true)
    public List<VisitorDto> findAll() {
        return visitorRepository.findAll().stream()
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public VisitorDto findById(Long id) {
        Visitor visitor = visitorRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Visitante não encontrado."));
        return toDto(visitor);
    }

    @Transactional
    public VisitorDto create(VisitorRequest request) {
        if (visitorRepository.existsByDocumentId(request.getDocumentId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Documento já cadastrado.");
        }

        Visitor visitor = new Visitor();
        copyToEntity(request, visitor);
        Visitor saved = visitorRepository.save(visitor);
        return toDto(saved);
    }

    @Transactional
    public VisitorDto update(Long id, VisitorRequest request) {
        Visitor visitor = visitorRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Visitante não encontrado."));

        boolean documentChanged = !visitor.getDocumentId().equals(request.getDocumentId());
        if (documentChanged && visitorRepository.existsByDocumentId(request.getDocumentId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Documento já cadastrado.");
        }

        copyToEntity(request, visitor);
        Visitor updated = visitorRepository.save(visitor);
        return toDto(updated);
    }

    @Transactional
    public void delete(Long id) {
        Visitor visitor = visitorRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Visitante não encontrado."));
        visitorRepository.delete(visitor);
    }

    private void copyToEntity(VisitorRequest request, Visitor visitor) {
        visitor.setFullName(request.getFullName());
        visitor.setDocumentId(request.getDocumentId());
        visitor.setEmail(request.getEmail());
        visitor.setPhone(request.getPhone());
        visitor.setCompany(request.getCompany());
        visitor.setNotes(request.getNotes());
        visitor.setActive(request.isActive());
    }

    private VisitorDto toDto(Visitor visitor) {
        VisitorDto dto = new VisitorDto();
        dto.setId(visitor.getId());
        dto.setFullName(visitor.getFullName());
        dto.setDocumentId(visitor.getDocumentId());
        dto.setEmail(visitor.getEmail());
        dto.setPhone(visitor.getPhone());
        dto.setCompany(visitor.getCompany());
        dto.setNotes(visitor.getNotes());
        dto.setActive(visitor.isActive());
        dto.setCreatedAt(visitor.getCreatedAt());
        dto.setUpdatedAt(visitor.getUpdatedAt());
        return dto;
    }
}

