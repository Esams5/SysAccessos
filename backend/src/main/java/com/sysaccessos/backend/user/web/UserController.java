package com.sysaccessos.backend.user.web;

import com.sysaccessos.backend.user.User;
import com.sysaccessos.backend.user.UserRepository;
import com.sysaccessos.backend.user.dto.UserSummaryDto;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<UserSummaryDto> list() {
        return userRepository.findAll().stream()
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    private UserSummaryDto toDto(User user) {
        UserSummaryDto dto = new UserSummaryDto();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setRegistrationCode(user.getRegistrationCode());
        dto.setRole(user.getRole());
        dto.setCardIdentifier(user.getCardIdentifier());
        dto.setCreatedAt(user.getCreatedAt());
        return dto;
    }
}

