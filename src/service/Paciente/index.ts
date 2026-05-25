import { api } from "@/infra/axios.config";

export interface Paciente {
  id: number;
  nome: string;
  dataNascimento: string;
  cpf: string;
}

export interface CreatePacientePayload {
  nome: string;
  cpf: string;
  dataNascimento: string;
  usuarioId: string | number;
}

export async function getPacientesByUsuario(
  usuarioId: string | number,
): Promise<Paciente[]> {
  const response = await api.get<Paciente[]>(`/pacientes/usuario/${usuarioId}`);
  return Array.isArray(response.data) ? response.data : [];
}

export async function createPaciente(
  payload: CreatePacientePayload,
): Promise<Paciente> {
  const response = await api.post<Paciente>("/pacientes", payload);
  return response.data;
}
