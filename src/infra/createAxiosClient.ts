import axios, { type AxiosError, type AxiosInstance } from "axios";
import { HttpErrorApi, HttpStatusCode } from "./HttpErrorApi";

/**
 * Dicionário de mensagens amigáveis para o usuário final.
 * Utilizado como fallback quando o servidor não envia um detalhe específico do erro.
 */
const defaultMessages: Record<number, string> = {
  400: "Requisição inválida. Verifique os dados enviados.",
  401: "Você não está autenticado para realizar esta ação.",
  403: "Você não tem permissão para acessar este recurso.",
  404: "O recurso solicitado não foi encontrado.",
  500: "Ocorreu um erro inesperado no servidor. Tente novamente mais tarde.",
};

/**
 * Factory Function para criar instâncias pré-configuradas do Axios.
 * @param baseUrl - A URL base da API (ex: vinda do .env)
 * @returns Uma instância do Axios com interceptores de erro acoplados.
 */
export default function createAxiosClient(baseUrl: string): AxiosInstance {
  const instance = axios.create({
    baseURL: baseUrl,
    headers: {
      // ATENÇÃO: Havia um erro de digitação em "application" (faltava um 'p')
      "Content-Type": "application/json",
    },
  });

  /**
   * Interceptor de Resposta:
   * Atua globalmente em todas as respostas recebidas por esta instância.
   */
  instance.interceptors.response.use(
    (response) => {
      // Em caso de sucesso (status 2xx), apenas repassa a resposta adiante
      return response;
    },
    (error: AxiosError) => {
      // 1. Extrai o status code ou define 503 (Serviço Indisponível) se o servidor estiver fora
      const statusCode = (error.response?.status as HttpStatusCode) ?? 503;

      // 2. Tenta capturar os dados brutos do erro vindos da API
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const responseData = error.response?.data as any;

      /**
       * 3. Lógica de Resolução de Mensagem:
       * Prioridade 1: 'detail' enviado pelo backend (muito comum em APIs Python/FastAPI)
       * Prioridade 2: Nossa mensagem mapeada no 'defaultMessages'
       * Prioridade 3: A mensagem de erro genérica do próprio Axios/Browser
       */
      const message =
        responseData?.message ||
        responseData?.detail ||
        defaultMessages[statusCode] ||
        error.message;

      // 4. Encapsula tudo na nossa classe customizada HttpErrorApi
      const httpError = new HttpErrorApi(
        message,
        statusCode,
        responseData || null,
      );

      /**
       * 5. Rejeição da Promise:
       * CRITICAL: Retornar Promise.reject garante que bibliotecas como TanStack Query
       * ou blocos try/catch identifiquem isso como uma falha (catch).
       */
      return Promise.reject(httpError);
    },
  );

  return instance;
}
