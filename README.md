# SysAccessos

Projeto full-stack em **Spring Boot**, **React** e **MySQL** para autenticação básica com cadastro e login de usuários.

## Requisitos

- Java 17+
- Maven 3.9+ (ou utilize o wrapper adicionando `mvn wrapper:wrapper`)
- Node.js 18+ e npm
- Servidor MySQL em execução

> Credenciais padrão configuradas em `backend/src/main/resources/application.properties`:   


## Backend (Spring Boot)

```bash
cd backend
mvn clean install      # primeira vez para baixar dependências
mvn spring-boot:run
```

A API ficará disponível em `http://localhost:8080/api`. Endpoints principais:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET|POST|PUT|DELETE /api/visitors`
- `GET|POST|PUT|DELETE /api/visits`

## Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

O site ficará disponível em `http://localhost:5173`. O frontend já aponta para `http://localhost:8080/api`.

## Funcionalidades atuais

- **Autenticação**: criação de conta e login simples. Após o cadastro o usuário é levado para a aba de login.
- **Gestão de visitantes** (`Visitor`): campos `fullName`, `documentId`, `email`, `phone`, `company`, `notes`, `active`. Permite criar, listar, editar e remover visitantes. Documento é único.
- **Agendamento de visitas** (`Visit`): relaciona um visitante a uma visita com `hostName`, `purpose`, `visitDate`, `startTime`, `endTime`, `status`, `notes`. Valida horários e exige visitante existente.
- Ambas as entidades estão relacionadas (`Visit` referencia `Visitor`) e persistem no MySQL via JPA.

## Notas

- Senhas são armazenadas com hash `BCrypt`.
- O fluxo retorna mensagens de sucesso ou erro; os próximos passos podem incluir emissão de JWT para sessões.
- Ajuste as configurações de CORS em `backend/src/main/java/com/sysaccessos/backend/auth/AuthController.java` se usar outra origem.
