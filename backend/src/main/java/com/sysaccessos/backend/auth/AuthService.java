package com.sysaccessos.backend.auth;

import com.sysaccessos.backend.auth.dto.AuthResponse;
import com.sysaccessos.backend.auth.dto.LoginRequest;
import com.sysaccessos.backend.auth.dto.RegisterRequest;
import com.sysaccessos.backend.auth.dto.UserDto;
import com.sysaccessos.backend.user.User;
import com.sysaccessos.backend.user.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return new AuthResponse(false, "Email já está em uso.", null);
        }
        if (userRepository.existsByRegistrationCode(request.getRegistrationCode())) {
            return new AuthResponse(false, "Código de registro já cadastrado.", null);
        }
        if (userRepository.existsByCardIdentifier(request.getCardIdentifier())) {
            return new AuthResponse(false, "Identificador de cartão já cadastrado.", null);
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setRegistrationCode(request.getRegistrationCode());
        user.setRole(request.getRole());
        user.setCardIdentifier(request.getCardIdentifier());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        User saved = userRepository.save(user);
        return new AuthResponse(true, "Usuário registrado com sucesso.", toUserDto(saved));
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
            user.getRole(),
            user.getCardIdentifier()
        );
    }
}
