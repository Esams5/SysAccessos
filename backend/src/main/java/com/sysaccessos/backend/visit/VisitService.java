package com.sysaccessos.backend.visit;

import com.sysaccessos.backend.visit.dto.VisitDto;
import com.sysaccessos.backend.visit.dto.VisitRequest;
import com.sysaccessos.backend.visitor.Visitor;
import com.sysaccessos.backend.visitor.VisitorRepository;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class VisitService {

    private final VisitRepository visitRepository;
    private final VisitorRepository visitorRepository;

    public VisitService(VisitRepository visitRepository, VisitorRepository visitorRepository) {
        this.visitRepository = visitRepository;
        this.visitorRepository = visitorRepository;
    }

    @Transactional(readOnly = true)
    public List<VisitDto> findAll() {
        return visitRepository.findAll().stream()
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public VisitDto findById(Long id) {
        Visit visit = visitRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Registro de visita não encontrado."));
        return toDto(visit);
    }

    @Transactional
    public VisitDto create(VisitRequest request) {
        Visit visit = new Visit();
        copyToEntity(request, visit);
        Visit saved = visitRepository.save(visit);
        return toDto(saved);
    }

    @Transactional
    public VisitDto update(Long id, VisitRequest request) {
        Visit visit = visitRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Registro de visita não encontrado."));
        copyToEntity(request, visit);
        Visit saved = visitRepository.save(visit);
        return toDto(saved);
    }

    @Transactional
    public void delete(Long id) {
        Visit visit = visitRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Registro de visita não encontrado."));
        visitRepository.delete(visit);
    }

    private void copyToEntity(VisitRequest request, Visit visit) {
        if (request.getEndTime().isBefore(request.getStartTime())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Horário final não pode ser anterior ao inicial.");
        }

        Visitor visitor = visitorRepository.findById(request.getVisitorId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Visitante informado não existe."));

        visit.setVisitor(visitor);
        visit.setHostName(request.getHostName());
        visit.setPurpose(request.getPurpose());
        visit.setVisitDate(request.getVisitDate());
        visit.setStartTime(request.getStartTime());
        visit.setEndTime(request.getEndTime());
        visit.setStatus(request.getStatus());
        visit.setNotes(request.getNotes());
    }

    private VisitDto toDto(Visit visit) {
        VisitDto dto = new VisitDto();
        dto.setId(visit.getId());
        dto.setVisitorId(visit.getVisitor().getId());
        dto.setVisitorName(visit.getVisitor().getFullName());
        dto.setHostName(visit.getHostName());
        dto.setPurpose(visit.getPurpose());
        dto.setVisitDate(visit.getVisitDate());
        dto.setStartTime(visit.getStartTime());
        dto.setEndTime(visit.getEndTime());
        dto.setStatus(visit.getStatus());
        dto.setNotes(visit.getNotes());
        dto.setCreatedAt(visit.getCreatedAt());
        dto.setUpdatedAt(visit.getUpdatedAt());
        return dto;
    }
}

