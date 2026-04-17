import { redirect } from "next/navigation";
import { employeeApi } from "@/lib/api";
import { EditarFuncionarioForm } from "@/components/funcionarios/EditarFuncionarioForm";

interface EditarFuncionarioPageProps {
  params: Promise<{ id: string }>;
}

// Busco os dados do funcionário no servidor e repasso ao client component.
// Se caso não encontrar, redireciona para a listagem.
export default async function EditarFuncionarioPage({
  params,
}: EditarFuncionarioPageProps) {
  const { id } = await params;

  let employee;
  try {
    employee = await employeeApi.getById(Number(id));
  } catch {
    redirect("/funcionarios");
  }

  return <EditarFuncionarioForm employee={employee} />;
}
