package com.sysaccessos.backend.area;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccessAreaRepository extends JpaRepository<AccessArea, Long> {

    Optional<AccessArea> findByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCase(String name);
}

