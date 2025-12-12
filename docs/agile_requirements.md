# Documento de Requisitos Ágeis — SysAccessos

> Este documento foi elaborado antes da construção do produto para orientar o desenvolvimento do SysAccessos, uma solução completa de controle de acesso físico com apoio de Inteligência Artificial.

## 1. Visão do Produto

- **Objetivo SMART**: Até dezembro de 2024, entregar uma plataforma web responsiva que centralize cadastro de usuários, gerenciamento de áreas restritas, concessão de permissões e auditoria de movimentações, reduzindo em 40% os incidentes de uso indevido de salas em instituições corporativas e de ensino por meio de automação e recursos de IA.
- **Público-alvo**: Coordenadores administrativos, equipes de segurança patrimonial, profissionais de TI responsáveis por carteiras de acesso e colaboradores/professores que utilizam laboratórios ou ambientes críticos.
- **Problema resolvido**: Falta de rastreabilidade sobre quem está em cada área, demora para criar permissões temporárias e inexistência de alertas quando um cartão usa ambientes fora da vigência autorizada.
- **Benefício esperado**: Operação única para todo o ciclo (cadastro → permissão → uso → histórico) com insights de IA que recomendam permissões, justificam decisões e disparam alertas proativos.

## 2. Personas

| Nome | Papel | Objetivo ao usar | Problema / Dor |
| --- | --- | --- | --- |
| **Carla Menezes** | Coordenadora Administrativa | Criar usuários/cartões e definir áreas sem depender de planilhas | Gasta horas validando duplicidades de matrícula/cartão e não consegue auditar rapidamente |
| **Rafael Costa** | Analista de Segurança | Monitorar ocupação das salas e bloquear acessos suspeitos | Não possui visão em tempo real das áreas ou alertas automáticos de permanência irregular |
| **Luana Prado** | Professora/Colaboradora | Garantir que seu cartão esteja liberado antes de se deslocar ao laboratório | Precisa enviar e-mails/ligar para confirmar permissões e perde tempo quando o acesso falha |

## 3. Estrutura de Requisitos

- **Épico 1 – Governança de Identidades e Cartões**
  - Funcionalidade 1.1: Cadastro e manutenção de usuários
    - User Stories: US01, US02
  - Funcionalidade 1.2: Autenticação e perfis
    - User Stories: US03, US04
- **Épico 2 – Gestão de Áreas e Auditoria**
  - Funcionalidade 2.1: Cadastro e monitoramento de áreas
    - User Stories: US05, US06
  - Funcionalidade 2.2: Movimentações e histórico
    - User Stories: US07, US08
- **Épico 3 – Inteligência Assistiva**
  - Funcionalidade 3.1: Recomendações e explicabilidade
    - User Stories: US09, US10
  - Funcionalidade 3.2: Alertas preventivos
    - User Story: US11
- **Épico 4 – Experiência e Validação**
  - Funcionalidade 4.1: Prototipação de telas
    - User Story: US12

## 4. User Stories

| ID | Título | Descrição |
| --- | --- | --- |
| US01 | Cadastro de usuários | Como **administrador**, quero cadastrar usuários com matrícula, função e cartão para controlar quem pode acessar os ambientes. |
| US02 | Edição e consulta de usuários | Como **administrador**, quero editar e listar usuários rapidamente para manter o cadastro atualizado. |
| US03 | Login/autenticação | Como **usuário**, quero acessar o sistema com email e senha para visualizar minhas permissões. |
| US04 | Sessão segura | Como **usuário**, quero encerrar minha sessão e ter expiração automática para proteger o sistema. |
| US05 | CRUD de áreas | Como **coordenador**, quero criar, atualizar e excluir áreas com níveis de segurança para manter o inventário confiável. |
| US06 | Monitoramento de ocupação | Como **analista de segurança**, quero ver em tempo real quais áreas estão ocupadas e por quais cartões para agir rapidamente. |
| US07 | Registro de movimentação | Como **analista**, quero registrar entrada/saída de um cartão em determinada área para gerar auditoria. |
| US08 | Histórico filtrado | Como **coordenador**, quero filtrar o histórico por período e área para responder auditorias e gerar relatórios. |
| US09 | Recomendação de permissões com IA | Como **coordenador**, quero receber recomendações automáticas de permissões com base em padrões de uso para acelerar liberações. |
| US10 | Explicação das recomendações de IA | Como **coordenador**, quero visualizar o motivo pelo qual a IA sugeriu determinada permissão para confiar na decisão. |
| US11 | Alerta inteligente de uso irregular | Como **analista de segurança**, quero receber alertas quando uma sala ficar em uso além da vigência autorizada para tomar ações preventivas. |
| US12 | Prototipação de telas | Como **product owner**, quero prototipar as telas principais (login, dashboard, CRUD, IA) para validar o fluxo antes da implementação. |

## 5. Product Backlog Prioritário (MoSCoW)

- **Must**: US01, US03, US05, US06, US07, US08, US09
- **Should**: US02, US04, US10, US11
- **Could**: US12
- **Won’t (versão inicial)**: Integração com catracas físicas, autenticação por biometria.

**Ordem sugerida**:
1. US03 – Login/autenticação (Must)
2. US01 – Cadastro de usuários (Must)
3. US05 – CRUD de áreas (Must)
4. US06 – Monitoramento de ocupação (Must)
5. US07 – Registro de movimentação (Must)
6. US08 – Histórico filtrado (Must)
7. US09 – Recomendação de permissões com IA (Must)
8. US02 – Edição e consulta de usuários (Should)
9. US04 – Sessão segura (Should)
10. US10 – Explicação das recomendações de IA (Should)
11. US11 – Alerta inteligente de uso irregular (Should)
12. US12 – Prototipação de telas (Could)

## 6. Análise de Riscos e Desafios

| Risco | Descrição | Impacto | Mitigação |
| --- | --- | --- | --- |
| R1 – Dados insuficientes para IA | Recomendador e alertas podem falhar sem histórico inicial. | Alto | Usar dados simulados e validar com especialistas até acumular histórico real. |
| R2 – Resistência à mudança | Usuários habituados ao processo manual podem não adotar o sistema. | Médio | Investir em protótipos (US12), treinamentos e coleta de feedback desde o MVP. |
| R3 – Segurança e privacidade | Vazamento de dados (nome, matrícula, cartão) compromete compliance. | Alto | Aplicar criptografia, autenticação forte e políticas de acesso desde o início. |
| R4 – Dependência de infraestrutura local | Falhas no servidor ou banco podem indisponibilizar a solução. | Médio | Planejar deploy em nuvem ou uso de containers, com backups automatizados. |
| R5 – Complexidade de regras de negócio | Permissões envolvem vigências, níveis e exceções temporárias. | Médio | Documentar regras detalhadas com stakeholders e usar testes automatizados para garantir consistência. |

