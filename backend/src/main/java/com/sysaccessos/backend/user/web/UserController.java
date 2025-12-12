package com.sysaccessos.backend.user.web;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sysaccessos.backend.auth.dto.RegisterRequest;
import com.sysaccessos.backend.user.User;
import com.sysaccessos.backend.user.UserManagementService;
import com.sysaccessos.backend.user.UserRepository;
import com.sysaccessos.backend.user.dto.UserSummaryDto;
import com.sysaccessos.backend.user.dto.UserUpdateRequest;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserRepository userRepository;
    private final UserManagementService userManagementService;

    public UserController(UserRepository userRepository, UserManagementService userManagementService) {
        this.userRepository = userRepository;
        this.userManagementService = userManagementService;
    }

    @GetMapping
    public List<UserSummaryDto> list() {
        return userRepository.findAll()
                .stream()
                .map(this::toDto)
                .collect(java.util.stream.Collectors.toList());
    }

    @PostMapping
    public ResponseEntity<UserSummaryDto> create(@Valid @RequestBody RegisterRequest request) {
        User user = userManagementService.createUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(toDto(user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserSummaryDto> update(@PathVariable Long id, @Valid @RequestBody UserUpdateRequest request) {
        User user = userManagementService.updateUser(id, request);
        return ResponseEntity.ok(toDto(user));
    }

    private UserSummaryDto toDto(User user) {
        UserSummaryDto dto = new UserSummaryDto();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setRegistrationCode(user.getRegistrationCode());
        dto.setRole(user.getRole().name());
        dto.setCardIdentifier(user.getCardIdentifier());
        dto.setCreatedAt(user.getCreatedAt());
        return dto;
    }
}
