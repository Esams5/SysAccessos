package com.sysaccessos.backend.area;

import com.sysaccessos.backend.area.dto.AreaMovementRequest;
import com.sysaccessos.backend.area.dto.AreaMovementResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/areas/movements")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AccessAreaMovementController {

    private final AccessAreaMovementService movementService;

    public AccessAreaMovementController(AccessAreaMovementService movementService) {
        this.movementService = movementService;
    }

    @PostMapping
    public ResponseEntity<AreaMovementResponse> move(@Valid @RequestBody AreaMovementRequest request) {
        AreaMovementResponse response = movementService.move(request);
        return ResponseEntity.ok(response);
    }
}

