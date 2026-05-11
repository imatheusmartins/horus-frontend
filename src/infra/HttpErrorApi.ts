/**
 * Dicionário de códigos de status HTTP padrão.
 * O uso de 'as const' transforma as propriedades em literais de leitura exclusiva (readonly),
 * impedindo modificações em tempo de execução e permitindo tipagem estrita.
 */
export const HttpStatusCode = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

/**
 * Tipo Utilitário: Extrai os valores numéricos do objeto HttpStatusCode.
 * Isso cria uma união (Union Type) que valida se um número é um status HTTP mapeado.
 * Ex: const status: HttpStatusCode = 200; // Válido
 */
export type HttpStatusCode =
  (typeof HttpStatusCode)[keyof typeof HttpStatusCode];

/**
 * Interface que define a estrutura de dados esperada em caso de falha na API.
 * Útil para tipar o corpo (body) das respostas de erro enviadas pelo backend.
 */
export interface IErrorDetails {
  message: string; // Mensagem amigável para o usuário
  statusCode: number; // Código HTTP da falha
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  details?: any | null; // Dados adicionais (ex: erros de validação de campos)
}

/**
 * Custom Error Class: HttpErrorApi
 * Especialização da classe Error nativa do JavaScript para o domínio de requisições HTTP.
 * * Benefícios:
 * 1. Permite o uso de 'instanceof' para capturar erros de API especificamente.
 * 2. Centraliza os metadados da falha (status e detalhes) em um único objeto.
 */
export class HttpErrorApi extends Error {
  // 'readonly' impede que os dados do erro sejam alterados após a criação
  readonly statusCode: number;
  readonly details: IErrorDetails | null;

  constructor(
    message: string,
    statusCode: number,
    details: IErrorDetails | null = null,
  ) {
    // Passa a mensagem para a classe base Error (permite usar error.message)
    super(message);

    // Define o nome da classe para facilitar identificação em logs e debugs
    this.name = "HttpErrorApi";

    this.statusCode = statusCode;
    this.details = details;

    // Necessário em algumas versões de TS para manter a cadeia de protótipos correta
    Object.setPrototypeOf(this, HttpErrorApi.prototype);
  }
}
