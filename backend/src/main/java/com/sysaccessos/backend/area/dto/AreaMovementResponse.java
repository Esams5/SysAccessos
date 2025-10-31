package com.sysaccessos.backend.area.dto;

import java.time.OffsetDateTime;

public class AreaMovementResponse {

    private Long areaId;
    private String areaName;
    private String movementType;
    private String message;
    private String status;
    private boolean inUse;
    private String occupantName;
    private String occupantCardIdentifier;
    private OffsetDateTime lastMovementAt;
    private OffsetDateTime usageDeadline;

    public AreaMovementResponse() {
    }

    public AreaMovementResponse(Long areaId, String movementType, String message, AccessAreaDto area) {
        this.areaId = areaId;
        this.movementType = movementType;
        this.message = message;
        this.areaName = area.getName();
        this.status = area.getStatus();
        this.inUse = area.isInUse();
        this.occupantName = area.getOccupantName();
        this.occupantCardIdentifier = area.getOccupantCardIdentifier();
        this.lastMovementAt = area.getLastMovementAt();
        this.usageDeadline = area.getUsageDeadline();
    }

    public Long getAreaId() {
        return areaId;
    }

    public void setAreaId(Long areaId) {
        this.areaId = areaId;
    }

    public String getMovementType() {
        return movementType;
    }

    public void setMovementType(String movementType) {
        this.movementType = movementType;
    }

    public String getAreaName() {
        return areaName;
    }

    public void setAreaName(String areaName) {
        this.areaName = areaName;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
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
}
