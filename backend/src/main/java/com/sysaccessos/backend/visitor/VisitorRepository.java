package com.sysaccessos.backend.visitor;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VisitorRepository extends JpaRepository<Visitor, Long> {

    boolean existsByDocumentId(String documentId);

    Optional<Visitor> findByDocumentId(String documentId);
}

