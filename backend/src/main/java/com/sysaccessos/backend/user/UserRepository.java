package com.sysaccessos.backend.user;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

    boolean existsByEmail(String email);

    boolean existsByRegistrationCode(String registrationCode);

    boolean existsByCardIdentifier(String cardIdentifier);

    Optional<User> findByCardIdentifier(String cardIdentifier);

    Optional<User> findByEmail(String email);
}
