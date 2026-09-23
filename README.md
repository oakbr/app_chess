# App Chess

Aplicacao web em React + TypeScript para consultar e filtrar streamers de xadrez usando a API publica do Chess.com.

## Funcionalidades

- Lista de streamers carregada pela API do Chess.com.
- Cards com avatar, username, canal da Twitch e status da transmissao.
- Fallback de avatar com imagem relacionada a xadrez.
- Filtros por status: `Todos`, `Somente Online` e `Somente Offline`.
- Busca por parte do username, aplicada pelo botao `Aplicar` ou pela tecla Enter.
- Tema claro e escuro.
- Estados de carregamento, erro, lista vazia e filtro sem resultados.
- Layout responsivo para desktop e dispositivos moveis.
- Interface em portugues do Brasil.

## Tecnologias

- React 19
- TypeScript
- Vite
- ESLint
- API REST do Chess.com

## Requisitos

- Node.js instalado.
- npm instalado.
- Acesso a internet para consultar a API do Chess.com.

## Instalacao

Clone o repositorio e entre na pasta do projeto:

```bash
git clone https://github.com/SEU_USUARIO/app_chess.git
cd app_chess
```

Instale as dependencias:

```bash
npm install
```

## Desenvolvimento

Inicie o servidor local:

```bash
npm run dev
```

Abra a URL exibida pelo Vite, normalmente `http://localhost:5173`.

## Scripts disponiveis

| Comando | Descricao |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento com HMR. |
| `npm run lint` | Executa o ESLint no projeto. |
| `npm run build` | Executa o type-check e gera o build de producao. |
| `npm run preview` | Pre-visualiza o build de producao localmente. |

## API utilizada

Endpoint:

```text
https://api.chess.com/pub/streamers
```

Campos utilizados:

- `username`
- `avatar`
- `twitch_url`
- `is_live`

A aplicacao faz a requisicao na primeira renderizacao e utiliza `AbortController` para cancelar a requisicao quando o componente e desmontado.

## Estrutura principal

```text
src/
  App.tsx       # Busca, estados, filtros e renderizacao
  cards.css     # Temas, cards, filtros e responsividade
  index.css     # Estilos globais do projeto
public/
  chess-avatar.svg  # Avatar alternativo
.docs/
  app_chess.prd                     # Requisitos e criterios de aceite
  app_chess-implementation.prd      # Documentacao da implementacao
  github-publish-guide.md           # Guia para publicar no GitHub
```

## Acessibilidade

- Botoes de filtro e tema possuem estados de foco visiveis.
- Filtros e tema utilizam `aria-pressed`.
- A navegacao dos filtros possui rotulo acessivel.
- Avatares possuem texto alternativo.
- Links da Twitch abrem em nova aba com `rel="noreferrer"`.
- O status do streamer possui descricao acessivel.

## Validacao local

Antes de enviar alteracoes, execute:

```bash
npm run lint
npm run build
```

## Documentacao adicional

- [PRD do projeto](.docs/app_chess.prd)
- [Documentacao da implementacao](.docs/app_chess-implementation.prd)
- [Guia para publicar no GitHub](.docs/github-publish-guide.md)

## Licenca

Este projeto e destinado a fins de estudo e demonstracao.
