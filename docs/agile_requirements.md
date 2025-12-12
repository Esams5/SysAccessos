# Documento de Requisitos Ágeis — SysAccessos

## 1. Visão do Produto

- **Objetivo SMART**: Desenvolver até dezembro de 2024 uma plataforma web de controle de acesso físico para instituições de ensino médio/técnico, capaz de reduzir em 40% as ocorrências de uso irregular de laboratórios por meio do registro automatizado de cartões, auditoria em tempo real e recomendações assistidas por IA sobre permissões.
- **Público-alvo**: Equipes administrativas (coordenação, secretaria) e profissionais de segurança ou TI responsáveis por liberar áreas restritas, além de colaboradores/docentes que precisam acessar os ambientes.
- **Problema resolvido**: Falta de visibilidade sobre quem está utilizando salas críticas, processos manuais e lentos para criar permissões e riscos de ocupação indevida fora da vigência.
- **Benefício esperado**: Operação centralizada de cartões/áreas, auditoria completa do histórico e insights de IA que auxiliem ajustes de permissões e detecção de desvios.

## 2. Personas

| Nome | Papel | Objetivo ao usar | Problema / Dor |
| --- | --- | --- | --- |
| **Carla Menezes** | Coordenadora administrativa | Cadastrar usuários, definir áreas e aprovar permissões rapidamente | Processos atuais em planilhas geram erros, duplicidades de cartão e pouca rastreabilidade |
| **Rafael Costa** | Analista de segurança | Monitorar em tempo real as salas em uso e bloquear acessos indevidos | Falta de alertas quando uma sala permanece ocupada além do prazo, dificultando auditoria |
| **Luana Prado** | Professora responsável por laboratório | Solicitar e acompanhar permissões temporárias para aulas práticas | Depende de ligações/emails para saber se o cartão foi liberado, causando atrasos de aula |

## 3. Estrutura de Requisitos (Épico → Funcionalidade → User Story)

- **Épico 1 – Governança de Identidades de Acesso**
  - Funcionalidade 1.1: Administração de usuários e cartões
    - US01: Cadastro completo de usuários administrativos
    - US02: Atualização inline de dados cadastrais
  - Funcionalidade 1.2: Autenticação e perfis
    - US03: Login seguro diferenciado por perfil
    - US04: Sessão autenticada com expiração e logout
- **Épico 2 – Gestão de Áreas Controladas**
  - Funcionalidade 2.1: Cadastro de áreas e estados
    - US05: CRUD de áreas com status ativo/inativo
    - US06: Painel de monitoramento de ocupação
  - Funcionalidade 2.2: Movimentação e histórico
    - US07: Registrar entradas/saídas via cartão
    - US08: Visualizar histórico filtrado por período
- **Épico 3 – Inteligência Assistiva para Permissões**
  - Funcionalidade 3.1: Recomendações de IA
    - US09: IA recomenda permissões baseadas em padrões
    - US10: IA explica motivos das recomendações
  - Funcionalidade 3.2: Alertas inteligentes
    - US11: IA detecta uso fora da vigência e sugere ação
- **Épico 4 – Experiência do Usuário e Prototipação**
  - Funcionalidade 4.1: Prototipação validada com stakeholders
    - US12: Criar protótipos navegáveis das principais telas

## 4. User Stories

| ID | Título | Descrição |
| --- | --- | --- |
| US01 | Cadastro de usuários | Como **administrador**, quero cadastrar usuários com matrícula, função e cartão para controlar quem pode acessar os ambientes. |
| US02 | Edição inline de usuários | Como **administrador**, quero atualizar dados de usuários diretamente na tabela para corrigir erros rapidamente. |
| US03 | Login/autenticação | Como **usuário**, quero acessar o sistema com email e senha para visualizar minhas permissões e painel. |
| US04 | Sessão autenticada | Como **usuário**, quero encerrar minha sessão manualmente e ter expiração automática para manter o ambiente seguro. |
| US05 | CRUD de áreas | Como **coordenador**, quero cadastrar, editar e excluir áreas com níveis de segurança para manter o inventário atualizado. |
| US06 | Monitoramento de ocupação | Como **analista de segurança**, quero visualizar quais salas estão em uso e por quem, para agir em caso de uso irregular. |
| US07 | Registro de movimentação | Como **analista**, quero registrar entradas e saídas com o cartão para gerar auditoria rastreável. |
| US08 | Histórico filtrado | Como **coordenador**, quero filtrar o histórico por período para responder auditorias e relatórios. |
| US09 | Recomendação de permissões com IA | Como **coordenador**, quero receber sugestões automáticas de permissões com base nas aulas agendadas e padrões históricos para acelerar liberações. |
| US10 | Explicação das recomendações de IA | Como **coordenador**, quero entender por que a IA sugeriu determinada permissão para confiar e auditar as decisões (explicabilidade). |
| US11 | Alerta inteligente de uso irregular | Como **analista de segurança**, quero que a IA identifique quando uma sala está ocupada além da vigência permitida e sugira bloqueio temporário. |
| US12 | Prototipação de telas | Como **product owner**, quero prototipar as telas-chave (login, dashboard, CRUDs, IA) para validar fluxos com stakeholders antes da implementação. |

> Cobertura das instruções: US03 lida com login/autenticação; US05 cobre CRUD; US09 e US10/US11 são histórias específicas de IA (recomendação, explicabilidade, detecção); US12 trata de prototipação de telas; US06–US08 abordam funcionalidades core de negócio.

## 5. Product Backlog Prioritário (MoSCoW)

- **Must**: US01, US03, US05, US06, US07, US08, US09
- **Should**: US02, US04, US10, US11
- **Could**: US12
- **Won’t (primeira versão)**: Integração com catracas físicas, Single Sign-On corporativo.

**Backlog ordenado**:
1. US03 – Login/autenticação (Must)
2. US01 – Cadastro de usuários (Must)
3. US05 – CRUD de áreas (Must)
4. US06 – Monitoramento de ocupação (Must)
5. US07 – Registro de movimentação (Must)
6. US08 – Histórico filtrado (Must)
7. US09 – Recomendação de permissões com IA (Must)
8. US02 – Edição inline de usuários (Should)
9. US04 – Sessão autenticada (Should)
10. US10 – Explicação das recomendações de IA (Should)
11. US11 – Alerta inteligente de uso irregular (Should)
12. US12 – Prototipação de telas (Could)

## 6. Análise de Riscos e Desafios

| Risco | Descrição | Impacto | Mitigação |
| --- | --- | --- | --- |
| R1 – Dependência de dados para IA | Recomendações podem ser imprecisas por escassez de dados históricos reais. | Alto | Iniciar com dados sintéticos validados por especialistas e ajustar modelos após piloto. |
| R2 – Falhas de integração com hardware de controle de acesso | Se houver necessidade futura de integrar catracas/leitores, a ausência de APIs padronizadas pode atrasar a entrega. | Médio | Definir contrato de integração desde o início e manter camada adaptadora para APIs externas. |
| R3 – Segurança e privacidade | Vazamento de dados de usuários/cartões ou uso indevido das recomendações. | Alto | Implementar autenticação robusta, criptografia de senhas (BCrypt), auditoria e LGPD compliance com perfis de acesso. |
| R4 – Resistência dos usuários | Equipes acostumadas ao processo manual podem não adotar o sistema. | Médio | Conduzir sessões de prototipação (US12), treinar usuários e coletar feedback contínuo. |
| R5 – Dependência do MySQL local | Ambiente escolar pode ter infraestrutura limitada, causando indisponibilidade. | Médio | Prever scripts de implantação em nuvem e backups automatizados; considerar containers para simplificar setup. |

