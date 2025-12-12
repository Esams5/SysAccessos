package com.sysaccessos.backend.user;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

    boolean existsByEmail(String email);

    boolean existsByEmailAndIdNot(String email, Long id);

    boolean existsByRegistrationCode(String registrationCode);

    boolean existsByRegistrationCodeAndIdNot(String registrationCode, Long id);

    boolean existsByCardIdentifier(String cardIdentifier);

    boolean existsByCardIdentifierAndIdNot(String cardIdentifier, Long id);

    Optional<User> findByCardIdentifier(String cardIdentifier);

    Optional<User> findByEmail(String email);
}
