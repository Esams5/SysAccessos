package com.sysaccessos.backend.user;

import com.sysaccessos.backend.auth.dto.RegisterRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserManagementService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserManagementService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public User createUser(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UserValidationException("Email já está em uso.");
        }
        if (userRepository.existsByRegistrationCode(request.getRegistrationCode())) {
            throw new UserValidationException("Código de registro já cadastrado.");
        }
        if (userRepository.existsByCardIdentifier(request.getCardIdentifier())) {
            throw new UserValidationException("Identificador de cartão já cadastrado.");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setRegistrationCode(request.getRegistrationCode());
        user.setRole(request.getRole());
        user.setCardIdentifier(request.getCardIdentifier());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        return userRepository.save(user);
    }
}
