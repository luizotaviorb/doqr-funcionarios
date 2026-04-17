import { employeeApi } from "@/lib/api";
import { FuncionariosClient } from "@/components/funcionarios/FuncionariosClient";

// Uso o servidor para buscar os dados e o client component para cuidar das interações com o usuário (filtros, cliques, etc).
export default async function FuncionariosPage() {
  const employees = await employeeApi.getAll();
  return <FuncionariosClient initialEmployees={employees ?? []} />;
}
