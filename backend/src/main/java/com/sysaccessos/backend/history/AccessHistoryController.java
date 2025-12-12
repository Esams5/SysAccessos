package com.sysaccessos.backend.history;

import com.sysaccessos.backend.history.dto.AccessHistoryDto;
import com.sysaccessos.backend.history.dto.AccessHistoryRequest;
import jakarta.validation.Valid;
import java.time.OffsetDateTime;
import java.util.List;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/history")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AccessHistoryController {

    private final AccessHistoryService historyService;

    public AccessHistoryController(AccessHistoryService historyService) {
        this.historyService = historyService;
    }

    @GetMapping
    public List<AccessHistoryDto> list(
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) OffsetDateTime start,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) OffsetDateTime end
    ) {
        if (start != null && end != null) {
            return historyService.findBetween(start, end);
        }
        return historyService.findAll();
    }

    @GetMapping("/user/{userId}")
    public List<AccessHistoryDto> listByUser(@PathVariable Long userId) {
        return historyService.findByUser(userId);
    }

    @PostMapping
    public ResponseEntity<AccessHistoryDto> create(@Valid @RequestBody AccessHistoryRequest request) {
        AccessHistoryDto created = historyService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
}
