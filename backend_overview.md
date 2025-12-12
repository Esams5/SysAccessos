# Guia do Backend SysAccessos

## Visão Geral da Arquitetura
- Aplicação Spring Boot 3.2 (Java 17) exposta em `/api`, persistindo em MySQL via Spring Data JPA.
- Domínio voltado a controle de acesso: usuários com cartões, áreas controladas, permissões, simulação de movimentação e histórico de eventos.
- Estrutura em camadas: controladores REST → serviços → repositórios JPA → entidades.

## Estrutura de Código (pacote `com.sysaccessos.backend`)
- `auth`: fluxo de autenticação e DTOs (`AuthController`, `AuthService`, `AuthResponse`).
- `user`: entidade `User`, regras de criação (`UserManagementService`), repositório e controller administrativo.
- `area`: entidade `AccessArea`, CRUD (`AccessAreaService/Controller`) e engine de movimentação (`AccessAreaMovementService` + DTOs).
- `permission`: entidade `UserPermission`, serviço para concessão de acesso, controller REST e DTOs.
- `history`: entidade `AccessHistory`, serviço para consultas/registro de eventos e endpoints públicos.
- `access`: simulação de passagem de cartão sem alterar estado da área (`AccessSimulationService/Controller`).
- `config`: segurança básica (`SecurityConfig`) e carga de dados (`DataInitializer`).
- `exception`: `GlobalExceptionHandler` com respostas padronizadas para validação/erros de negócio.

```
src/
 └─ main/java/com/sysaccessos/backend/
    ├─ auth/…                      (login, registro e DTOs)
    ├─ user/…                      (entidade, serviços e controller administrativo)
    ├─ area/…                      (áreas, movimentações e DTOs)
    ├─ permission/…                (permissões usuário × área)
    ├─ history/…                   (histórico de acessos)
    ├─ access/…                    (simulações sem efeito colateral)
    └─ config/, exception/…        (infra e cross-cutting)
```

## Entidades Principais
| Entidade | Campos chave | Observações |
| --- | --- | --- |
| `User` | `name`, `email`, `registrationCode`, `role`, `cardIdentifier`, `password`, `createdAt` | Senhas com `BCrypt`. Valida duplicidade (email, matrícula, cartão). |
| `AccessArea` | `name`, `location`, `securityLevel`, `active`, `inUse`, `occupant*`, `lastMovementAt` | Métodos utilitários `startUsage/finishUsage`, status calculado (`Disponivel`, `EmUso`, `NaoDevolvida`) e prazo (`usageDeadline`) estimado para devolução. |
| `UserPermission` | `user`, `area`, `accessLevel`, `validFrom/validUntil`, `status`, `notes` | Consultas por usuário/área para validar cartões e evitar permissões duplicadas ativas. |
| `AccessHistory` | `user`, `area`, `eventType`, `result`, `cardIdentifier`, `notes`, `recordedAt` | Persistido em toda movimentação autorizada e via endpoints administrativos. |

## Serviços e Regras de Negócio
- `AuthService`: registra usuários (reaproveitando `UserManagementService`) e autentica via email/senha retornando `AuthResponse` com dados resumidos.
- `UserManagementService`: cria usuários aplicando validações de unicidade e hash da senha e agora também atualiza perfis existentes (`updateUser`) respeitando as mesmas regras.
- `UserPermissionService`: CRUD com validação de datas (impede `validUntil` < `validFrom`) e mensagens claras para ausência de usuário/área ou permissão inexistente; converte entidades em DTO enriquecidos com nomes/e-mails.
- `AccessAreaService`: CRUD das áreas, evita nomes duplicados e trata exclusão com `DataIntegrityViolationException` (áreas vinculadas a permissões/histórico). Também resolve lista de áreas autorizadas a partir de um cartão, cruzando permissões ativas com status da área.
- `AccessAreaMovementService`: orquestra entrada/saída efetiva de uma área. Garante:
  - área existe e está ativa;
  - cartão pertence a um usuário válido;
  - há permissão ativa (`status = ATIVA` e dentro da vigência);
  - impede uso simultâneo por cartões distintos.
  Atualiza o estado da área (`startUsage`/`finishUsage`), calcula mensagem, grava histórico com resultado `AUTORIZADO` e retorna `AreaMovementResponse`.
- `AccessSimulationService`: valida cartão e permissão sem alterar o estado da área; sempre retorna `AccessSimulationResponse` com indicador `AUTORIZADO/NEGADO`.
- `AccessHistoryService`: converte filtros de data (`OffsetDateTime`) em consultas ordenadas, além de registrar manualmente eventos (validando existência de usuário e área).
- `DataInitializer`: cria automaticamente usuário admin (`admin@sysaccessos.local`, senha `admin123`) caso ainda não exista.

## Controladores e Endpoints (todos sob `/api`)
| Rota | Método(s) | Resumo |
| --- | --- | --- |
| `/auth/register`, `/auth/login` | POST | Registro/autenticação, retornando `AuthResponse` com mensagens amigáveis e usuário logado. |
| `/users` | GET, POST | Listagem resumida (`UserSummaryDto`) e criação administrativa. |
| `/users/{id}` | PUT | Atualização inline de dados cadastrais (nome, email, registro, função, cartão). |
| `/areas` | GET, POST, PUT `/areas/{id}`, DELETE `/areas/{id}` | CRUD completo. Conflitos e vínculos tratados com mensagens específicas. |
| `/areas/authorized?cardIdentifier=` | GET | Filtra áreas em que o cartão possui permissão ativa. |
| `/areas/movements` | POST | Registra entrada/saída efetiva, atualizando ocupação e gerando histórico. |
| `/permissions` | GET, POST, PUT `/permissions/{id}`, DELETE | Gestão de permissões com validações de usuário/área e período. |
| `/history` | GET (opcional `start`, `end` em ISO) | Lista todos os eventos ou filtra por intervalo. |
| `/history` | POST | Registra evento manual (p. ex. auditorias). |
| `/access/simulate` | POST | Simula passagem de cartão retornando status sem alterar ocupação. |

## Segurança, Erros e Configuração
- `SecurityConfig` desabilita CSRF e libera todos os endpoints (`permitAll`). Para produção, recomenda-se incluir autenticação com tokens/roles.
- `PasswordEncoder` configurado como `BCryptPasswordEncoder`.
- `GlobalExceptionHandler` padroniza respostas JSON com `success`, `message` e mapa de `errors` quando cabível.
- `application.properties` define conexão MySQL (`spring.datasource.*`) e porta `8080`. Cuidado ao distribuir: a senha padrão (`Samuel57@`) está em texto plano.
- Hibernate roda em `update`, criando/alterando tabelas automaticamente; logs SQL desabilitados.

## Fluxo de Execução
1. Banco MySQL deve estar acessível (credenciais em variáveis de ambiente ou arquivo).
2. Executar `mvn spring-boot:run` em `backend/`.
3. Na primeira execução, `DataInitializer` garante um usuário administrador padrão.
4. Endpoints podem ser testados via Swagger manual (não incluído) ou REST client; respostas seguem JSON homogêneo.


