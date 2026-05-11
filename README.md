# FE Horus

Frontend da aplicação Horus, desenvolvido com React, TypeScript e Vite.

## Requisitos

- Node.js 20 ou superior
- npm 10 ou superior

## Como executar localmente

1. Instale as dependências:

```bash
npm install
```

2. Configure as variáveis de ambiente no arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=http://localhost:8080
```

Se essa variável não for definida, o frontend usará `http://localhost:8080` por padrão.

3. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

4. Abra no navegador o endereço exibido no terminal.
Em geral, no Vite ele roda em `http://localhost:5173`.

## Scripts disponíveis

- `npm run dev`: inicia o ambiente de desenvolvimento
- `npm run build`: gera a build de produção
- `npm run preview`: sobe uma prévia local da build gerada
- `npm run lint`: executa o ESLint

## Observações

- Este frontend espera uma API disponível, por padrão, em `http://localhost:8080`.
- Caso o backend esteja em outra porta ou host, ajuste `VITE_API_URL` no `.env`.
