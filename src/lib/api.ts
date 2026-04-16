import {
  CreateEmployeeRequest,
  Employee,
  UpdateEmployeeRequest,
} from "@/types/funcionario";

const BASE_URL = "https://api-testefrontend.qforms.com.br";

// Função genérica para centralizar o tratamento de erros, evitando repetição de código.
async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const config: RequestInit = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (response.status === 204) return null as T;

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMessage =
      data?.message || data?.error || "Erro na comunicação com o servidor";
    throw new Error(
      Array.isArray(errorMessage) ? errorMessage.join(", ") : errorMessage,
    );
  }

  return data as T;
}

export const employeeApi = {
  getAll: async (name?: string): Promise<Employee[]> => {
    const query = name ? `?name=${encodeURIComponent(name)}` : "";
    return request<Employee[]>(`/employees${query}`, {
      method: "GET",
      cache: "no-store",
    });
  },

  getById: async (id: number): Promise<Employee> => {
    return request<Employee>(`/employees/${id}`, { method: "GET" });
  },

  create: async (payload: CreateEmployeeRequest): Promise<{ id: number }> => {
    return request<{ id: number }>("/employees", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  update: async (id: number, payload: UpdateEmployeeRequest): Promise<void> => {
    return request<void>(`/employees/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  delete: async (id: number): Promise<void> => {
    return request<void>(`/employees/${id}`, { method: "DELETE" });
  },
};
