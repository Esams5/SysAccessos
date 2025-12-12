package com.sysaccessos.backend.auth;

import com.sysaccessos.backend.auth.dto.AuthResponse;
import com.sysaccessos.backend.auth.dto.LoginRequest;
import com.sysaccessos.backend.auth.dto.RegisterRequest;
import com.sysaccessos.backend.auth.dto.UserDto;
import com.sysaccessos.backend.user.User;
import com.sysaccessos.backend.user.UserManagementService;
import com.sysaccessos.backend.user.UserValidationException;
import com.sysaccessos.backend.user.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final UserManagementService userManagementService;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, UserManagementService userManagementService,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.userManagementService = userManagementService;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        try {
            User saved = userManagementService.createUser(request);
            return new AuthResponse(true, "Usuário registrado com sucesso.", toUserDto(saved));
        } catch (UserValidationException ex) {
            return new AuthResponse(false, ex.getMessage(), null);
        }
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        return userRepository.findByEmail(request.getEmail())
            .map(user -> {
                if (passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                    return new AuthResponse(true, "Autenticação realizada com sucesso.", toUserDto(user));
                }
                return new AuthResponse(false, "Senha inválida.", null);
            })
            .orElseGet(() -> new AuthResponse(false, "Usuário não encontrado.", null));
    }

    private UserDto toUserDto(User user) {
        return new UserDto(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getRegistrationCode(),
            user.getRole().name(),
            user.getCardIdentifier()
        );
    }
}
