# TASKS Futuras — MELVIN RevOps (REBUILD 7)

Documento de backlog para retomadas. Atualizado em **27/07/2026**.

---

## Páginas ocultas do menu (atalho por URL)

Estas páginas **não aparecem no menu lateral**, mas abrem se você digitar o hash na barra de endereços:

| Página | Atalho (barra de endereços) |
|---|---|
| **Plano de Ação** | `index.html#plano-acao` |
| *(ex.) Central de Comando antiga* | conteúdo substituído pela landing `#home-dashboard` |

**Como usar:** abra o site e acrescente `#plano-acao` ao final da URL, ex.:

```
.../Melvin/index.html#plano-acao
```

O roteador SPA (`app.js`) continua reconhecendo o hash — só o item de menu foi removido.

---

## Landing atual (🏠)

- **ID:** `#home-dashboard`
- **Conteúdo:** Playbook Comercial MELVIN (hero + pills)
- **Default** ao abrir o site / botão 🏠

---

## Gaps de conteúdo no documento-mor

| Prioridade | Item | ID / Local | Nota |
|---|---|---|---|
| P0 | Feedback de Call Outbound | `#feedback-reuniao-out` | Único `dot-pending` no menu. Espelhar `#feedback-reuniao-in` |
| P1 | Matriz de Objeções — cards Em construção | `#gim-objecoes` | Sensores / negociação (~8 stubs) |
| P2 | Glossário GIM | `#gim-glossario` | Página Em construção (fora do menu) |
| P2 | Produto M&A EAD — descrição | `#gim-produtos` | “Descrição pendente” |

---

## Go-live operacional

Ver **Plano de Ação** (`#plano-acao` via URL) Fases B–D:

- **B** Inbound: SLA &lt;15 min, Filtro SPN, D1–D15, réguas agenda
- **C** Outbound: Copilot → Bitrix, Tier 1, D1–D35, réguas Out
- **D** Governança: Lost obrigatório, Feedback Closer 2h, CS

---

## Ideias / melhorias futuras

- [ ] Reexibir Plano de Ação no menu Comando (se a operação pedir)
- [ ] Dashboard vivo com métricas Bitrix
- [ ] Completar Feedback Out + Objeções GIM
- [ ] Publicar `#gim-glossario` no menu GIM quando preenchido

---

## Como reexibir o Plano de Ação no menu

```
[ ] Reinserir <a href="#plano-acao"> em Comando (sidebar)
[ ] Remover data-hidden-nav da section (opcional)
[ ] Atualizar este arquivo
```
