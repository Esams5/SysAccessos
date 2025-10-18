package com.sysaccessos.backend.permission;

import com.sysaccessos.backend.permission.dto.UserPermissionDto;
import com.sysaccessos.backend.permission.dto.UserPermissionRequest;
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
@RequestMapping("/api/permissions")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class UserPermissionController {

    private final UserPermissionService permissionService;

    public UserPermissionController(UserPermissionService permissionService) {
        this.permissionService = permissionService;
    }

    @GetMapping
    public List<UserPermissionDto> list() {
        return permissionService.findAll();
    }

    @GetMapping("/{id}")
    public UserPermissionDto getById(@PathVariable Long id) {
        return permissionService.findById(id);
    }

    @PostMapping
    public ResponseEntity<UserPermissionDto> create(@Valid @RequestBody UserPermissionRequest request) {
        UserPermissionDto created = permissionService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public UserPermissionDto update(@PathVariable Long id, @Valid @RequestBody UserPermissionRequest request) {
        return permissionService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        permissionService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

