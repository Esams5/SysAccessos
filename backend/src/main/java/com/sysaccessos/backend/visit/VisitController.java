package com.sysaccessos.backend.visit;

import com.sysaccessos.backend.visit.dto.VisitDto;
import com.sysaccessos.backend.visit.dto.VisitRequest;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/visits")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class VisitController {

    private final VisitService visitService;

    public VisitController(VisitService visitService) {
        this.visitService = visitService;
    }

    @GetMapping
    public List<VisitDto> list() {
        return visitService.findAll();
    }

    @GetMapping("/{id}")
    public VisitDto getById(@PathVariable Long id) {
        return visitService.findById(id);
    }

    @PostMapping
    public ResponseEntity<VisitDto> create(@Valid @RequestBody VisitRequest request) {
        VisitDto created = visitService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public VisitDto update(@PathVariable Long id, @Valid @RequestBody VisitRequest request) {
        return visitService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        visitService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

