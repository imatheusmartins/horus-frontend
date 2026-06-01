import { api } from "@/infra/axios.config";
import { HttpErrorApi, HttpStatusCode } from "@/infra/HttpErrorApi";

export interface Prediction {
  label: string;
  confidence: number;
  description?: string;
  descricao?: string;
}

export interface Detection {
  label: string;
  confidence: number;
  bbox?: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  };
}

export interface AnaliseIA {
  task?: string;
  model_source?: string;
  top_prediction?: Prediction;
  predictions?: Prediction[];
  detections?: Detection[];
}

export interface Exame {
  id: number;
  pacienteId: number;
  nomePaciente?: string;
  urlImagemOriginal?: string;
  urlImagemAnotada?: string;
  analiseIA?: AnaliseIA;
  dataExame: string;
}

const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";

interface ApiErrorResponse {
  status?: number;
  statusCode?: number;
  error?: string;
  message?: string;
  timestamp?: string;
  details?: string[];
}

async function parseApiError(response: Response): Promise<HttpErrorApi> {
  const data = (await response.json().catch(() => null)) as
    | ApiErrorResponse
    | null;

  const statusCode =
    data?.statusCode ?? data?.status ?? response.status ?? HttpStatusCode.BAD_REQUEST;

  return new HttpErrorApi(
    data?.message || "Não foi possível criar a análise.",
    statusCode,
    data
      ? {
          message: data.message || "Não foi possível criar a análise.",
          statusCode,
          details: data.details,
        }
      : null,
  );
}

async function isBackendOnline() {
  try {
    const response = await fetch(`${apiBaseUrl}/health`);
    return response.ok;
  } catch {
    return false;
  }
}

export async function getExamesByPaciente(
  pacienteId: string | number,
): Promise<Exame[]> {
  const response = await api.get<Exame[]>(`/exames/paciente/${pacienteId}`);
  return Array.isArray(response.data) ? response.data : [];
}

export async function getExame(id: string | number): Promise<Exame> {
  const response = await api.get<Exame>(`/exames/${id}`);
  return response.data;
}

export async function createExame(
  pacienteId: string | number,
  imagem: File,
): Promise<Exame> {
  const formData = new FormData();

  formData.append(
    "dados",
    new Blob([JSON.stringify({ pacienteId })], {
      type: "application/json",
    }),
  );
  formData.append("imagem", imagem);

  let response: Response;

  try {
    response = await fetch(`${apiBaseUrl}/exames`, {
      method: "POST",
      body: formData,
    });
  } catch {
    const backendOnline = await isBackendOnline();
    const currentOrigin =
      typeof window !== "undefined" ? window.location.origin : "origem atual";

    if (backendOnline) {
      throw new HttpErrorApi(
        `O backend está online, mas o upload para /exames foi bloqueado ou interrompido. Verifique se o CORS permite ${currentOrigin}, se a URL VITE_API_URL está correta e se o endpoint aceita multipart/form-data.`,
        HttpStatusCode.SERVICE_UNAVAILABLE,
        null,
      );
    }

    throw new HttpErrorApi(
      "Não foi possível conectar ao backend. Verifique se a API está ativa e se o CORS permite o frontend.",
      HttpStatusCode.SERVICE_UNAVAILABLE,
      null,
    );
  }

  if (!response.ok) {
    throw await parseApiError(response);
  }

  return response.json() as Promise<Exame>;
}

export async function deleteExame(id: string | number): Promise<void> {
  await api.delete(`/exames/${id}`);
}
