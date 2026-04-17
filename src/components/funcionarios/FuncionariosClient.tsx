"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FuncionariosTable } from "@/components/funcionarios/FuncionariosTable";
import { useFuncionarios } from "@/hooks/useFuncionarios";
import { Employee } from "@/types/funcionario";
import { Navbar } from "../layout/Navbar";
import { IconPlus } from "../icons/IconPlus";

interface Props {
  initialEmployees: Employee[];
}

export function FuncionariosClient({ initialEmployees }: Props) {
  const router = useRouter();
  const { employees, isLoading, search, setSearch, deleteEmployee } =
    useFuncionarios(initialEmployees);

  return (
    <main className="min-h-screen bg-[#13131f]">
      <div className="bg-background mx-auto min-h-screen max-w-[1440px]">
        <Navbar />
        <div className="px-8 lg:px-[130px] pb-12">
          <div className="mt-8 mb-8">
            <h1 className="text-foreground">Controle de Funcionários</h1>
            <p className="text-xl font-bold text-foreground/70 mt-1">
              Empresa DoQR Tecnologia
            </p>
          </div>
          <div className="flex items-center justify-between mb-3 gap-4">
            <Input
              placeholder="Buscar Funcionário..."
              className="h-9 w-full max-w-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button
              onClick={() => router.push("/funcionarios/novo")}
              className="h-9 px-4 gap-2 font-bold text-base shrink-0"
            >
              <IconPlus />
              Novo Funcionário
            </Button>
          </div>
          <FuncionariosTable
            employees={employees}
            isLoading={isLoading}
            onDelete={deleteEmployee}
          />
        </div>
      </div>
    </main>
  );
}
