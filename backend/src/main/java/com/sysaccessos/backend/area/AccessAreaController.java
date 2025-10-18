package com.sysaccessos.backend.area;

import com.sysaccessos.backend.area.dto.AccessAreaDto;
import com.sysaccessos.backend.area.dto.AccessAreaRequest;
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
@RequestMapping("/api/areas")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AccessAreaController {

    private final AccessAreaService areaService;

    public AccessAreaController(AccessAreaService areaService) {
        this.areaService = areaService;
    }

    @GetMapping
    public List<AccessAreaDto> list() {
        return areaService.findAll();
    }

    @GetMapping("/{id}")
    public AccessAreaDto getById(@PathVariable Long id) {
        return areaService.findById(id);
    }

    @PostMapping
    public ResponseEntity<AccessAreaDto> create(@Valid @RequestBody AccessAreaRequest request) {
        AccessAreaDto created = areaService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public AccessAreaDto update(@PathVariable Long id, @Valid @RequestBody AccessAreaRequest request) {
        return areaService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        areaService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

