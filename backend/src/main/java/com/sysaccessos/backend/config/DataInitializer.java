package com.sysaccessos.backend.config;

import com.sysaccessos.backend.user.User;
import com.sysaccessos.backend.user.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger LOGGER = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        String defaultEmail = "admin@sysaccessos.local";
        if (userRepository.existsByEmail(defaultEmail)) {
            return;
        }

        User user = new User();
        user.setName("Administrador Padrão");
        user.setEmail(defaultEmail);
        user.setRegistrationCode("00000001");
        user.setRole("ADMIN");
        user.setCardIdentifier("99999999");
        user.setPassword(passwordEncoder.encode("admin123"));

        userRepository.save(user);
        LOGGER.info("Usuário padrão criado: {}", defaultEmail);
    }
}

