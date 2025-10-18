package com.sysaccessos.backend.visitor;

import com.sysaccessos.backend.visitor.dto.VisitorDto;
import com.sysaccessos.backend.visitor.dto.VisitorRequest;
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
@RequestMapping("/api/visitors")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class VisitorController {

    private final VisitorService visitorService;

    public VisitorController(VisitorService visitorService) {
        this.visitorService = visitorService;
    }

    @GetMapping
    public List<VisitorDto> list() {
        return visitorService.findAll();
    }

    @GetMapping("/{id}")
    public VisitorDto getById(@PathVariable Long id) {
        return visitorService.findById(id);
    }

    @PostMapping
    public ResponseEntity<VisitorDto> create(@Valid @RequestBody VisitorRequest request) {
        VisitorDto created = visitorService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public VisitorDto update(@PathVariable Long id, @Valid @RequestBody VisitorRequest request) {
        return visitorService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        visitorService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

