package com.sysaccessos.backend.area;

import com.sysaccessos.backend.user.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import java.time.OffsetDateTime;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "access_areas")
public class AccessArea {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 80, unique = true)
    private String name;

    @Column(nullable = false, length = 160)
    private String description;

    @Column(nullable = false, length = 120)
    private String location;

    @Column(nullable = false, length = 40)
    private String securityLevel;

    @Column(length = 255)
    private String notes;

    @Column(nullable = false)
    private boolean active = true;

    @Column(nullable = false)
    private boolean inUse = false;

    @Column(length = 120)
    private String occupantName;

    @Column(length = 80)
    private String occupantCardIdentifier;

    @Column
    private Long occupantUserId;

    @Column
    private OffsetDateTime lastMovementAt;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private OffsetDateTime updatedAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getSecurityLevel() {
        return securityLevel;
    }

    public void setSecurityLevel(String securityLevel) {
        this.securityLevel = securityLevel;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public boolean isInUse() {
        return inUse;
    }

    public void setInUse(boolean inUse) {
        this.inUse = inUse;
    }

    public String getOccupantName() {
        return occupantName;
    }

    public void setOccupantName(String occupantName) {
        this.occupantName = occupantName;
    }

    public String getOccupantCardIdentifier() {
        return occupantCardIdentifier;
    }

    public void setOccupantCardIdentifier(String occupantCardIdentifier) {
        this.occupantCardIdentifier = occupantCardIdentifier;
    }

    public Long getOccupantUserId() {
        return occupantUserId;
    }

    public void setOccupantUserId(Long occupantUserId) {
        this.occupantUserId = occupantUserId;
    }

    public OffsetDateTime getLastMovementAt() {
        return lastMovementAt;
    }

    public void setLastMovementAt(OffsetDateTime lastMovementAt) {
        this.lastMovementAt = lastMovementAt;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public OffsetDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(OffsetDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public void startUsage(User user, String cardIdentifier) {
        this.inUse = true;
        this.occupantName = user.getName();
        this.occupantCardIdentifier = cardIdentifier;
        this.occupantUserId = user.getId();
        this.lastMovementAt = OffsetDateTime.now();
    }

    public void finishUsage() {
        this.inUse = false;
        this.occupantName = null;
        this.occupantCardIdentifier = null;
        this.occupantUserId = null;
        this.lastMovementAt = OffsetDateTime.now();
    }

    @Transient
    public String getStatus() {
        if (!inUse) {
            return "Disponivel";
        }
        OffsetDateTime deadline = getUsageDeadline();
        if (deadline != null && OffsetDateTime.now().isAfter(deadline)) {
            return "NaoDevolvida";
        }
        return "EmUso";
    }

    @Transient
    public OffsetDateTime getUsageDeadline() {
        if (!inUse || lastMovementAt == null) {
            return null;
        }
        return lastMovementAt
            .plusDays(1)
            .withHour(5)
            .withMinute(0)
            .withSecond(0)
            .withNano(0);
    }
}
