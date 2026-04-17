"use client";

import { useCallback, useEffect, useState } from "react";
import { employeeApi } from "@/lib/api";
import { Employee } from "@/types/funcionario";

// Hook que trás os dados iniciais através do SSR (pra evitar loading state na primeira chamada)
export function useFuncionarios(initialEmployees: Employee[] = []) {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");

  const fetchEmployees = useCallback(async (name?: string) => {
    setIsLoading(true);
    try {
      const data = await employeeApi.getAll(name || undefined);
      setEmployees(data ?? []);
    } catch {
      setEmployees([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Evita travar o site ou sobrecarregar o servidor com buscas a cada tecla pressionada.
    const timer = setTimeout(
      () => {
        fetchEmployees(search || undefined);
      },
      search ? 400 : 0,
    );
    return () => clearTimeout(timer);
  }, [search, fetchEmployees]);

  const deleteEmployee = async (id: number) => {
    await employeeApi.delete(id);
    await fetchEmployees(search);
  };

  return {
    employees,
    isLoading,
    search,
    setSearch,
    deleteEmployee,
  };
}
