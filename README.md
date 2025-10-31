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
- `POST /api/users` — cadastro administrativo de usuários/cartões
- `GET|POST|PUT|DELETE /api/areas` — CRUD de áreas controladas
- `GET|POST|PUT|DELETE /api/permissions` — CRUD de permissões usuário × área
- `GET|POST /api/history` — consulta (com filtro opcional por período) e registro de eventos de acesso
- `POST /api/access/simulate` — simulação de passagem de cartão (gera registro no histórico)

## Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

O site ficará disponível em `http://localhost:5173`. O frontend já aponta para `http://localhost:8080/api`.

### Fluxo após iniciar as aplicações

1. **Criar administradores**: use `POST /api/auth/register` ou a própria tela de “Criar conta” para cadastrar pelo menos um usuário com `role = ADMIN`.
2. **Login**: faça login com um usuário `ADMIN`. O painel exibirá abas administrativas.
3. **Usuários e Cartões**: cadastre novos usuários/cartões (matrícula e cartão aceitam apenas números).
4. **Áreas**: defina os ambientes controlados e seus níveis de segurança.
5. **Permissões**: vincule cartões/usuários às áreas com nível de acesso, vigência e status.
6. **Simulação de acesso**: informe o número do cartão e a área para simular uma passagem. O sistema valida permissões e grava o evento.
7. **Histórico**: acompanhe a tabela com nome do usuário, número do cartão, local, tipo de evento e resultado (autorizado/negado).

## Funcionalidades atuais

- **Autenticação de usuários** com senha criptografada (`BCrypt`), guardando matrícula, função e identificador numérico do cartão.
- **Gestão administrativa**: painel pós-login para perfis `ADMIN` com cadastro de usuários/cartões, áreas, permissões e simulação de acesso.
- **Áreas de acesso**: CRUD completo com status ativo/inativo.
- **Permissões**: relação usuário × área com controle de nível, vigência e status.
- **Histórico**: registro e consulta de eventos (entrada/saída, autorizado/negado) exibindo nome e número do cartão utilizado.

## Notas

- Senhas são armazenadas com hash `BCrypt`.
- O fluxo retorna mensagens de sucesso ou erro para facilitar feedback ao operador.
- Ajuste as configurações de CORS nos controladores (`@CrossOrigin`) caso altere a URL do frontend.
- O endpoint de simulação grava automaticamente eventos no histórico para auditoria.
