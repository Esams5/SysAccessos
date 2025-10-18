package com.sysaccessos.backend.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class RegisterRequest {

    @NotBlank(message = "O nome é obrigatório.")
    @Size(max = 120, message = "O nome deve ter no máximo 120 caracteres.")
    private String name;

    @NotBlank(message = "O email é obrigatório.")
    @Email(message = "Formato de email inválido.")
    @Size(max = 80, message = "O email deve ter no máximo 80 caracteres.")
    private String email;

    @NotBlank(message = "O registro é obrigatório.")
    @Size(max = 40, message = "O registro deve ter no máximo 40 caracteres.")
    @Pattern(regexp = "\\d+", message = "O registro deve conter apenas números.")
    private String registrationCode;

    @NotBlank(message = "O cargo/função é obrigatório.")
    @Size(max = 40, message = "O cargo/função deve ter no máximo 40 caracteres.")
    private String role;

    @NotBlank(message = "O identificador de cartão é obrigatório.")
    @Size(max = 80, message = "O identificador deve ter no máximo 80 caracteres.")
    @Pattern(regexp = "\\d+", message = "O identificador do cartão deve conter apenas números.")
    private String cardIdentifier;

    @NotBlank(message = "A senha é obrigatória.")
    @Size(min = 6, message = "A senha deve ter pelo menos 6 caracteres.")
    private String password;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRegistrationCode() {
        return registrationCode;
    }

    public void setRegistrationCode(String registrationCode) {
        this.registrationCode = registrationCode;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getCardIdentifier() {
        return cardIdentifier;
    }

    public void setCardIdentifier(String cardIdentifier) {
        this.cardIdentifier = cardIdentifier;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
