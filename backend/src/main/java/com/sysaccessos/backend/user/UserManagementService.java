package com.sysaccessos.backend.user;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.sysaccessos.backend.auth.dto.RegisterRequest;
import com.sysaccessos.backend.user.dto.UserUpdateRequest;

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
        String email = request.getEmail().trim();
        String registrationCode = request.getRegistrationCode().trim();
        String cardIdentifier = request.getCardIdentifier().trim();

        if (userRepository.existsByEmail(email)) {
            throw new UserValidationException("Email já está em uso.");
        }
        if (userRepository.existsByRegistrationCode(registrationCode)) {
            throw new UserValidationException("Código de registro já cadastrado.");
        }
        if (userRepository.existsByCardIdentifier(cardIdentifier)) {
            throw new UserValidationException("Identificador de cartão já cadastrado.");
        }

        User user = new User();
        user.setName(request.getName().trim());
        user.setEmail(email);
        user.setRegistrationCode(registrationCode);
        user.setRole(request.getRole().trim());
        user.setCardIdentifier(cardIdentifier);
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        return userRepository.save(user);
    }

    @Transactional
    public User updateUser(Long id, UserUpdateRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado."));

        String email = request.getEmail().trim();
        String registrationCode = request.getRegistrationCode().trim();
        String cardIdentifier = request.getCardIdentifier().trim();

        if (userRepository.existsByEmailAndIdNot(email, id)) {
            throw new UserValidationException("Email já está em uso.");
        }
        if (userRepository.existsByRegistrationCodeAndIdNot(registrationCode, id)) {
            throw new UserValidationException("Código de registro já cadastrado.");
        }
        if (userRepository.existsByCardIdentifierAndIdNot(cardIdentifier, id)) {
            throw new UserValidationException("Identificador de cartão já cadastrado.");
        }

        user.setName(request.getName().trim());
        user.setEmail(email);
        user.setRegistrationCode(registrationCode);
        user.setRole(request.getRole().trim());
        user.setCardIdentifier(cardIdentifier);

        return userRepository.save(user);
    }

}
