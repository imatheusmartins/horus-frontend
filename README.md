# FE Horus

Frontend da aplicacao Horus, desenvolvido com React, TypeScript e Vite.

## Objetivo

Este projeto concentra a interface web da aplicacao Horus. A proposta e disponibilizar uma base simples para desenvolvimento local, validacao automatizada no GitHub e publicacao continua na Vercel.

## Tecnologias utilizadas

- React
- TypeScript
- Vite
- TanStack Router
- Sass
- ESLint

## Requisitos

- Node.js 20 ou superior
- npm 10 ou superior

## Execucao local

1. Instale as dependencias:

```bash
npm install
```

2. Crie o arquivo `.env` na raiz do projeto com a variavel abaixo:

```env
VITE_API_URL=http://localhost:8080
```

Se a variavel nao for definida, o frontend utiliza `http://localhost:8080` como valor padrao.

3. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

4. Acesse o endereco exibido no terminal. No ambiente padrao do Vite, a aplicacao costuma ficar disponivel em `http://localhost:5173`.

## Scripts disponiveis

- `npm run dev`: inicia o servidor de desenvolvimento
- `npm run build`: gera a build de producao
- `npm run preview`: publica localmente a versao gerada em `dist`
- `npm run lint`: executa a verificacao de padrao de codigo com ESLint

## Variaveis de ambiente

### Desenvolvimento local

```env
VITE_API_URL=http://localhost:8080
```

### Producao

Na Vercel, a variavel `VITE_API_URL` deve apontar para a URL publica da API.

Exemplo:

```env
VITE_API_URL=https://api-exemplo.com
```

Se o backend ainda nao estiver publicado, o frontend pode ser hospedado normalmente para demonstracao da parte estatica. Nesse caso, telas que dependem da API devem ser evitadas, adaptadas ou alimentadas com dados simulados.

## CI/CD

O projeto utiliza um fluxo simples de integracao e entrega continua.

### CI no GitHub Actions

O workflow esta definido em `.github/workflows/ci.yml`.

Ele e executado nas seguintes situacoes:

- `push` nas branches `main` e `develop`
- `pull request` para `main` e `develop`

As etapas executadas sao:

1. Instalar dependencias com `npm ci`
2. Executar o lint com `npm run lint`
3. Gerar a build com `npm run build`

Com isso, cada alteracao relevante passa por uma validacao automatica antes de seguir para deploy.

### CD na Vercel

A publicacao do frontend e feita pela Vercel a partir do repositorio no GitHub.

Fluxo esperado:

1. O repositorio e conectado a um projeto na Vercel
2. A branch `main` e definida como branch de producao
3. Cada novo `push` na `main` gera um deploy de producao
4. Branches auxiliares podem gerar deploys de preview para validacao

## Configuracao da Vercel

Ao importar o projeto na Vercel, utilizar as configuracoes abaixo:

- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`

Tambem e necessario cadastrar a variavel de ambiente `VITE_API_URL` no painel da Vercel.

## Estrategia recomendada de uso

Para manter o fluxo de entrega simples e organizado:

1. Desenvolver novas alteracoes em branch separada
2. Abrir `pull request` para revisao ou validacao
3. Confirmar que o workflow do GitHub Actions passou com sucesso
4. Realizar o merge na `main`
5. Acompanhar o deploy automatico na Vercel

## Observacoes

- O frontend espera uma API disponivel, por padrao, em `http://localhost:8080`
- Caso o backend utilize outro host ou porta, ajuste `VITE_API_URL`
- O diretorio `dist` contem apenas os arquivos gerados pela build e nao deve ser editado manualmente
