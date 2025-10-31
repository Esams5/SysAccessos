package com.sysaccessos.backend.access;

import com.sysaccessos.backend.access.dto.AccessSimulationRequest;
import com.sysaccessos.backend.access.dto.AccessSimulationResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/access")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AccessSimulationController {

    private final AccessSimulationService simulationService;

    public AccessSimulationController(AccessSimulationService simulationService) {
        this.simulationService = simulationService;
    }

    @PostMapping("/simulate")
    public ResponseEntity<AccessSimulationResponse> simulate(@Valid @RequestBody AccessSimulationRequest request) {
        AccessSimulationResponse response = simulationService.simulate(request);
        return ResponseEntity.ok(response);
    }
}
