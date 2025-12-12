package com.sysaccessos.backend.ai.dto;

import java.time.OffsetDateTime;

public class AreaRecommendationDto {

    private Long areaId;
    private String areaName;
    private long accessCount;
    private OffsetDateTime lastAccessAt;
    private String recommendationReason;

    public Long getAreaId() {
        return areaId;
    }

    public void setAreaId(Long areaId) {
        this.areaId = areaId;
    }

    public String getAreaName() {
        return areaName;
    }

    public void setAreaName(String areaName) {
        this.areaName = areaName;
    }

    public long getAccessCount() {
        return accessCount;
    }

    public void setAccessCount(long accessCount) {
        this.accessCount = accessCount;
    }

    public OffsetDateTime getLastAccessAt() {
        return lastAccessAt;
    }

    public void setLastAccessAt(OffsetDateTime lastAccessAt) {
        this.lastAccessAt = lastAccessAt;
    }

    public String getRecommendationReason() {
        return recommendationReason;
    }

    public void setRecommendationReason(String recommendationReason) {
        this.recommendationReason = recommendationReason;
    }
}
