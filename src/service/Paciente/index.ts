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

export type UpdatePacientePayload = CreatePacientePayload;

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

export async function getPaciente(id: string | number): Promise<Paciente> {
  const response = await api.get<Paciente>(`/pacientes/${id}`);
  return response.data;
}

export async function updatePaciente(
  id: string | number,
  payload: UpdatePacientePayload,
): Promise<Paciente> {
  const response = await api.put<Paciente>(`/pacientes/${id}`, payload);
  return response.data;
}

export async function deletePaciente(id: string | number): Promise<void> {
  await api.delete(`/pacientes/${id}`);
}
