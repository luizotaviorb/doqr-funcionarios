"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SquarePen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "./StatusBadge";
import { DeleteDialog } from "./DeleteDialog";
import { formatISODate, formatCPF, formatPhone } from "@/lib/utils";
import { Employee } from "@/types/funcionario";

interface Props {
  employees: Employee[];
  isLoading: boolean;
  onDelete: (id: number) => Promise<void>;
}

const TABLE_HEADERS = [
  { label: "Nome", width: "w-[10%]" },
  { label: "E-mail", width: "w-[14%]" },
  { label: "CPF", width: "w-[13%]" },
  { label: "Celular", width: "w-[12%]" },
  { label: "Data de Nascimento", width: "w-[18%]" },
  { label: "Tipo Contratação", width: "w-[16%]" },
  { label: "Status", width: "w-[9%]" },
  { label: "Ação", width: "w-[8%]" },
];

export function FuncionariosTable({ employees, isLoading, onDelete }: Props) {
  const router = useRouter();

  const handleDelete = async (id: number, name: string) => {
    try {
      await onDelete(id);
      toast.success("Funcionário excluído com sucesso!");
    } catch {
      toast.error("Erro ao excluir funcionário");
    }
  };

  if (isLoading) {
    return (
      <div className="w-full overflow-hidden rounded-lg border border-border bg-background">
        <table className="table-fixed w-full">
          <thead>
            <tr className="bg-table-header-bg border-b border-border">
              {TABLE_HEADERS.map((h) => (
                <th key={h.label} className={`${h.width} table-header-cell`}>
                  <Skeleton className="h-4 w-full" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="border-b border-border">
                {Array.from({ length: 8 }).map((_, j) => (
                  <td key={j} className="table-cell px-4 py-4">
                    <Skeleton className="h-4 w-full" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (employees.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground text-sm border border-border rounded-lg">
        Nenhum funcionário encontrado.
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-lg border border-border">
      <Table className="table-fixed w-full">
        <TableHeader>
          <TableRow
            className="hover:bg-table-header-bg border-b border-border"
            style={{
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
            }}
          >
            {TABLE_HEADERS.map((header) => (
              <TableHead
                key={header.label}
                className={`${header.width} table-header-cell`}
              >
                {header.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((emp) => (
            <TableRow
              key={emp.id}
              className="border-b border-border hover:bg-muted/40 transition-colors"
            >
              <TableCell className="table-cell">{emp.name}</TableCell>
              <TableCell className="table-cell">{emp.email}</TableCell>
              <TableCell className="table-cell">
                {formatCPF(emp.cpf ?? "")}
              </TableCell>
              <TableCell className="table-cell">
                {formatPhone(emp.phone ?? "")}
              </TableCell>
              <TableCell className="table-cell">
                {formatISODate(emp.dateOfBith)}
              </TableCell>
              <TableCell className="table-cell">{emp.typeOfHiring}</TableCell>
              <TableCell className="table-cell">
                <StatusBadge ativo={emp.status} />
              </TableCell>
              <TableCell className="table-cell cell-action">
                <div className="flex items-center gap-action opacity-70">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-transparent p-0 text-foreground hover:opacity-100 transition-opacity"
                    onClick={() => router.push(`/funcionarios/${emp.id}`)}
                  >
                    <SquarePen className="icon-edit" />
                  </Button>
                  <DeleteDialog
                    employeeName={emp.name ?? ""}
                    onConfirm={() => handleDelete(emp.id, emp.name ?? "")}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
