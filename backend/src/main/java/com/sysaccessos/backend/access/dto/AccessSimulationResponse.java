package com.sysaccessos.backend.access.dto;

public class AccessSimulationResponse {

    private boolean authorized;
    private String result;
    private String message;
    private String userName;
    private Long userId;
    private String cardIdentifier;
    private String areaName;

    public AccessSimulationResponse() {
    }

    public AccessSimulationResponse(boolean authorized, String result, String message,
                                    String userName, Long userId, String cardIdentifier, String areaName) {
        this.authorized = authorized;
        this.result = result;
        this.message = message;
        this.userName = userName;
        this.userId = userId;
        this.cardIdentifier = cardIdentifier;
        this.areaName = areaName;
    }

    public boolean isAuthorized() {
        return authorized;
    }

    public void setAuthorized(boolean authorized) {
        this.authorized = authorized;
    }

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getCardIdentifier() {
        return cardIdentifier;
    }

    public void setCardIdentifier(String cardIdentifier) {
        this.cardIdentifier = cardIdentifier;
    }

    public String getAreaName() {
        return areaName;
    }

    public void setAreaName(String areaName) {
        this.areaName = areaName;
    }
}

