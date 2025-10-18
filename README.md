# SysAccessos

Projeto full-stack em **Spring Boot**, **React** e **MySQL** para controle de acesso em ambientes corporativos/escolares, com cadastro de usuários, permissões por área e histórico de eventos.

## Requisitos

- Java 17+
- Maven 3.9+ (ou utilize o wrapper adicionando `mvn wrapper:wrapper`)
- Node.js 18+ e npm
- Servidor MySQL em execução

> Credenciais padrão configuradas em `backend/src/main/resources/application.properties`:  
> usuário `root`, senha `Samuel57@`, banco `sysaccessos_db` (criado automaticamente).  
> Ajuste conforme necessário ou sobreponha com variáveis `SPRING_DATASOURCE_*`.


## Backend (Spring Boot)

```bash
cd backend
mvn clean install      # primeira vez para baixar dependências
mvn spring-boot:run
```

A API ficará disponível em `http://localhost:8080/api`. Endpoints principais:

- `POST /api/auth/register` — cadastro de usuários com nome, email, matrícula, função e identificador do cartão
- `POST /api/auth/login`
- `GET /api/users` — lista resumida de usuários cadastrados
- `GET|POST|PUT|DELETE /api/areas` — CRUD de áreas controladas
- `GET|POST|PUT|DELETE /api/permissions` — CRUD de permissões usuário × área
- `GET|POST /api/history` — consulta (com filtro opcional por período) e registro de eventos de acesso

## Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

O site ficará disponível em `http://localhost:5173`. O frontend já aponta para `http://localhost:8080/api`.

### Fluxo após iniciar as aplicações

1. **Cadastro/Login**: registre usuários informando nome, email, matrícula, função e identificador do cartão; após o cadastro, faça login para testar.
2. **Áreas**: defina as áreas controladas, níveis de segurança e observações.
3. **Permissões**: relacione cada usuário a uma área, definindo nível de acesso, período de validade e status.
4. **Histórico**: registre manualmente entradas/saídas (ou consulte os eventos gravados) para montar a trilha de auditoria.

## Funcionalidades atuais

- **Autenticação de usuários** com senha criptografada (`BCrypt`), guardando também matrícula, função e identificador de cartão.
- **Áreas de acesso**: CRUD com nome, descrição, localização, nível de segurança, observações e status ativo/inativo.
- **Permissões**: CRUD relacionando usuário × área, com nível de acesso, período de validade, status e observações. Impede duplicidades ativas.
- **Histórico**: registro consulta de eventos (entrada/saída, autorizado/negado) vinculados a usuário e área, com captura do cartão utilizado.
- **API para listagem de usuários** para alimentar os cadastros de permissões e histórico no frontend.

## Notas

- Senhas são armazenadas com hash `BCrypt`.
- O fluxo retorna mensagens de sucesso ou erro para facilitar feedback ao operador.
- Ajuste as configurações de CORS nos controladores (`@CrossOrigin`) caso altere a URL do frontend.
