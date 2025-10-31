package com.sysaccessos.backend.area.dto;

import java.time.OffsetDateTime;

public class AccessAreaDto {

    private Long id;
    private boolean active;
    private String name;
    private String description;
    private String location;
    private String securityLevel;
    private String notes;
    private boolean inUse;
    private String status;
    private String occupantName;
    private String occupantCardIdentifier;
    private Long occupantUserId;
    private OffsetDateTime lastMovementAt;
    private OffsetDateTime usageDeadline;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
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

    public boolean isInUse() {
        return inUse;
    }

    public void setInUse(boolean inUse) {
        this.inUse = inUse;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
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

    public OffsetDateTime getUsageDeadline() {
        return usageDeadline;
    }

    public void setUsageDeadline(OffsetDateTime usageDeadline) {
        this.usageDeadline = usageDeadline;
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
}
