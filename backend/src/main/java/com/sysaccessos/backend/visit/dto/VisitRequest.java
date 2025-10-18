package com.sysaccessos.backend.visit.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.time.LocalTime;

public class VisitRequest {

    @NotNull(message = "O visitante é obrigatório.")
    @Min(value = 1, message = "Visitante inválido.")
    private Long visitorId;

    @NotBlank(message = "O anfitrião é obrigatório.")
    @Size(max = 120, message = "O anfitrião deve ter no máximo 120 caracteres.")
    private String hostName;

    @NotBlank(message = "O propósito é obrigatório.")
    @Size(max = 150, message = "O propósito deve ter no máximo 150 caracteres.")
    private String purpose;

    @NotNull(message = "A data da visita é obrigatória.")
    @FutureOrPresent(message = "A data da visita não pode estar no passado.")
    private LocalDate visitDate;

    @NotNull(message = "O horário inicial é obrigatório.")
    private LocalTime startTime;

    @NotNull(message = "O horário final é obrigatório.")
    private LocalTime endTime;

    @NotBlank(message = "O status é obrigatório.")
    @Size(max = 30, message = "O status deve ter no máximo 30 caracteres.")
    private String status;

    @Size(max = 255, message = "As observações devem ter no máximo 255 caracteres.")
    private String notes;

    public Long getVisitorId() {
        return visitorId;
    }

    public void setVisitorId(Long visitorId) {
        this.visitorId = visitorId;
    }

    public String getHostName() {
        return hostName;
    }

    public void setHostName(String hostName) {
        this.hostName = hostName;
    }

    public String getPurpose() {
        return purpose;
    }

    public void setPurpose(String purpose) {
        this.purpose = purpose;
    }

    public LocalDate getVisitDate() {
        return visitDate;
    }

    public void setVisitDate(LocalDate visitDate) {
        this.visitDate = visitDate;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}

