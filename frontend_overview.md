# Guia do Frontend SysAccessos

## Visão Geral
- SPA em React 18 criada com Vite (`npm run dev` abre em `http://localhost:5173`).
- Consome o backend via `axios` pré-configurado (`src/services/api.js`) apontando para `http://localhost:8080/api`.
- Interface única com abas que mudam conforme autenticação/role (`App.jsx`).

## Estrutura Principal (`frontend/src`)
```
src/
 ├─ App.jsx                 (roteamento por abas e estado global simples)
 ├─ main.jsx               (montagem da aplicação)
 ├─ styles.css             (estilização global, design responsivo)
 ├─ components/
 │   ├─ AuthForm.jsx
 │   ├─ UserManager.jsx
 │   ├─ AreaManager.jsx
 │   ├─ PermissionManager.jsx
 │   ├─ AccessSimulation.jsx
 │   └─ HistoryViewer.jsx
 └─ services/
     ├─ api.js
     ├─ userService.js
     ├─ areaService.js
     ├─ permissionService.js
     ├─ historyService.js
     └─ accessService.js
```

## Fluxo da Aplicação (`App.jsx`)
- Estado local controla:
  - `activeView`: aba atual (`auth-login`, `auth-register`, `users`, `areas`, `permissions`, `simulate`, `history`).
  - `feedback`: mensagens de sucesso/erro exibidas em caixas padrão.
  - `loading`: indicador das ações em `AuthForm`.
  - `authenticatedUser`: guarda usuário retornado pelo login; avalia `role` para liberar abas administrativas.
- Após `login` bem-sucedido, admins são redirecionados para a aba `users`; outros perfis só enxergam `HistoryViewer`.
- `handleLogout` reseta estados e volta para a tela de login.

## Componentes
- **AuthForm**: formulário versátil para login/registro. Reseta campos quando o modo muda, aplica máscaras numéricas (`registrationCode`, `cardIdentifier`) e chama `onSubmit`.
- **UserManager**: CRUD administrativo de usuários/cartões. Consome `userService`; exibe feedback, tabela responsiva e edição inline com validação imediata. Observações:
  - Força números para matrícula/cartão.
  - Permite atualizar lista com botão `Atualizar lista`.
  - A edição inline atualiza campos diretamente na linha e bloqueia o envio enquanto houver erros de preenchimento.
- **AreaManager**: CRUD de áreas.
  - `securityLevel` pré-definido com opções (`RESTRITA`, `CONFIDENCIAL`, `GERAL`, `CRITICA`).
  - Trabalha com `active/inUse`, mostra status legível (`Disponível`, `Em uso`, `Não devolvida`) e dados do ocupante.
  - Implementa confirmação `window.confirm` antes de deletar.
  - A atualização ocorre inline na tabela (nome, descrição, localização, nível, observações, status ativo), com preview instantâneo de erros.
- **PermissionManager**: CRUD de permissões.
  - Carrega usuários, áreas e permissões em paralelo (`Promise.all`).
  - Monta selects com `useMemo` para evitar recalcular opções.
  - Converte `userId`/`areaId` para `Number` antes de enviar ao backend.
- **AccessSimulation**: fluxo para listar áreas autorizadas e simular movimentações.
  - Primeiro busca áreas liberadas para o cartão (`fetchAuthorizedAreas`).
  - Ao registrar movimentação, atualiza a tabela local com o retorno de `moveArea`.
- **HistoryViewer**: consulta e registro manual de histórico.
  - Carrega usuários/áreas para selects.
  - Permite filtrar por intervalo de datas (enviando `start/end` em `YYYY-MM-DDT00:00:00Z`).
  - Permite inserir eventos manuais (`createHistoryEntry`).

## Camada de Serviços (`src/services`)
- `api.js`: instancia `axios` com `baseURL` e `timeout`.
- `userService`: GET/POST `/users`.
- `userService.updateUser(id, payload)`: PUT `/users/{id}` para suportar edição inline.
- `areaService`: GET/POST/PUT/DELETE `/areas`, GET `/areas/authorized`, POST `/areas/movements`.
- `permissionService`: CRUD de `/permissions`.
- `historyService`: GET `/history` com filtros e POST `/history`.
- `accessService`: POST `/access/simulate` (não utilizado diretamente; lógica principal usa `areaService.moveArea`).

## Estilização (`styles.css`)
- Define layout centralizado com cartões (`.card`), abas (`.nav-tabs`), tabelas responsivas (`.table-wrapper`), estados de feedback (`.feedback.success|error`) e grid adaptável (`.crud-form .grid`).
- Usa tipografia `Inter` e cores azuis/cinzas para coerência com tema corporativo.
- Classes reusáveis: `.crud-section`, `.crud-header`, `.form-actions`, `.table-actions`, `.stacked`, `.empty`.

## Scripts NPM
- `npm run dev`: ambiente de desenvolvimento com Hot Module Replacement.
- `npm run build`: gera artefatos estáticos em `dist/`.
- `npm run preview`: serve o build para testes locais.

## Pontos de Atenção / Próximos Passos
- Implementar persistência do token/usuário (atualmente apenas em memória).
- Sincronizar feedback visual com respostas do backend (ex.: mostrar mensagens de conflito específicas para permissões e áreas).
- Adicionar tratamento global de erros `axios` (interceptors) e indicador loading por seção.
- Considerar um gerenciador de estado (Zustand/Redux) se a aplicação crescer.
- Avaliar testes de componentes com `Vitest`/`Testing Library` para fluxos críticos (cadastro, movimentação).
