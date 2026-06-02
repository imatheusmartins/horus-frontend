# FE Horus

Frontend da aplicacao Horus, desenvolvido em React, TypeScript e Vite.

Este repositorio faz parte do prototipo desenvolvido para o Trabalho de Conclusao de Curso. A aplicacao compoe a camada de interface do sistema Horus, consumindo os servicos expostos pelo backend e apresentando ao usuario as funcionalidades relacionadas ao cadastro, consulta e acompanhamento de pacientes e exames.

## Contexto do projeto

O Horus foi estruturado em mais de um componente de software:

- Backend em Java com Spring Boot, responsavel pelas regras de negocio e persistencia dos dados
- Frontend em React, responsavel pela interface web utilizada pelo usuario
- Servico de API em Python, responsavel pela integracao com o modelo de inteligencia artificial

Este repositorio trata exclusivamente do frontend. A comunicacao com os demais servicos e feita por meio de requisicoes HTTP, utilizando a URL configurada na variavel de ambiente `VITE_API_URL`.

## Objetivo

O objetivo deste frontend e disponibilizar uma interface web funcional para validacao do prototipo, permitindo a navegacao entre as telas principais do sistema e a integracao com a API do backend.

Alem da execucao local, o projeto tambem esta preparado para validacao automatizada em ambiente de CI e publicacao continua por meio da Vercel.

## Tecnologias utilizadas

- React
- TypeScript
- Vite
- TanStack Router
- Sass
- ESLint
- Axios
- Vercel
- GitHub Actions

## Requisitos

- Node.js 20 ou superior
- npm 10 ou superior

## Configuracao do ambiente

Antes de executar o projeto, crie um arquivo `.env` na raiz do repositorio com a URL da API utilizada pelo frontend:

```env
VITE_API_URL=http://localhost:8081
```

Quando a variavel nao e informada, a aplicacao utiliza uma URL padrao definida no codigo. Ainda assim, recomenda-se manter o arquivo `.env` configurado para evitar divergencias entre os ambientes de desenvolvimento, homologacao e producao.

O arquivo `.env.example` deve ser usado como referencia para as variaveis esperadas pelo projeto.

## Execucao local

Instale as dependencias do projeto:

```bash
npm install
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Por padrao, o Vite disponibiliza a aplicacao em:

```text
http://localhost:5173
```

Caso a porta esteja em uso, o proprio Vite indicara outro endereco no terminal.

## Scripts disponiveis

- `npm run dev`: inicia o ambiente local de desenvolvimento
- `npm run build`: executa a verificacao TypeScript e gera a build de producao
- `npm run lint`: executa a analise estatica do codigo com ESLint
- `npm run preview`: executa localmente a versao gerada em `dist`

## Build de producao

Para gerar os arquivos finais da aplicacao, execute:

```bash
npm run build
```

O resultado e gravado no diretorio `dist`. Esse diretorio contem apenas artefatos gerados pela build e nao deve ser editado manualmente.

Para validar localmente a versao de producao, execute:

```bash
npm run preview
```

## Variaveis de ambiente

### Desenvolvimento

```env
VITE_API_URL=http://localhost:8081
```

### Producao

Em producao, a variavel `VITE_API_URL` deve apontar para a URL publica da API:

```env
VITE_API_URL=https://api.seu-dominio.com
```

Na Vercel, essa variavel deve ser cadastrada no painel do projeto antes do deploy de producao.

## CI/CD

O fluxo de integracao e entrega continua foi definido com foco no escopo do prototipo. A proposta e garantir que cada alteracao enviada ao repositorio passe por validacoes basicas antes de chegar ao ambiente publicado.

### Integracao continua

O workflow de CI esta definido em:

```text
.github/workflows/ci.yml
```

Ele e executado automaticamente nas seguintes situacoes:

- `push` nas branches `main` e `dev`
- `pull_request` direcionado para `main` ou `dev`

As etapas executadas pelo workflow sao:

1. Checkout do repositorio
2. Configuracao do Node.js
3. Instalacao das dependencias com `npm ci`
4. Execucao do lint com `npm run lint`
5. Geracao da build com `npm run build`

Esse processo reduz o risco de publicar alteracoes com erros de sintaxe, problemas de padrao de codigo ou falhas na compilacao TypeScript.

### Entrega continua

A entrega continua do frontend e realizada pela Vercel, integrada ao repositorio GitHub.

O fluxo adotado e:

1. Alteracoes sao desenvolvidas em branch separada
2. Um pull request e aberto para a branch principal de desenvolvimento
3. O GitHub Actions valida a alteracao
4. Apos o merge na branch `main`, a Vercel executa o deploy de producao
5. Branches auxiliares podem gerar deploys de preview para validacao antes da publicacao final

Essa abordagem mantem o pipeline simples, adequado ao contexto academico do projeto, mas ainda representa um fluxo real de CI/CD utilizado em aplicacoes web modernas.

## Configuracao da Vercel

Ao importar o projeto na Vercel, utilize as seguintes configuracoes:

- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`

Tambem e necessario cadastrar a variavel `VITE_API_URL` no ambiente da Vercel.

O arquivo `vercel.json` contem a regra de redirecionamento necessaria para que as rotas da aplicacao React funcionem corretamente em acessos diretos pelo navegador.

## Estrutura geral

```text
src/
  assets/       Arquivos estaticos utilizados pela interface
  components/   Componentes reutilizaveis da aplicacao
  infra/        Configuracoes de comunicacao HTTP
  pages/        Telas principais do sistema
  routes/       Definicao das rotas com TanStack Router
  service/      Servicos responsaveis pelas chamadas para a API
  theme/        Estilos globais
  types/        Tipagens compartilhadas
  utils/        Funcoes auxiliares
```

## Observacoes

- O frontend depende da API do backend para executar as funcionalidades completas
- A URL da API deve ser configurada por ambiente por meio de `VITE_API_URL`
- O diretorio `node_modules` nao deve ser versionado
- O diretorio `dist` e gerado automaticamente durante a build
- O pipeline atual prioriza validacoes essenciais para o prototipo: lint, compilacao TypeScript e build de producao
