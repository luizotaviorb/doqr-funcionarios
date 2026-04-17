"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  funcionarioSchema,
  FuncionarioFormValues,
} from "@/schemas/funcionario.schema";
import { employeeApi } from "@/lib/api";
import { formatCPF, formatPhone, formatDate, formatISODate } from "@/lib/utils";
import { Navbar } from "@/components/layout/Navbar";
import { IconArrowLeft } from "@/components/icons/IconArrowLeft";

function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <Label className="text-base font-medium text-foreground">{label}</Label>
      {children}
      {error && <span className="text-xs text-destructive">{error}</span>}
    </div>
  );
}

export default function EditarFuncionarioPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const [isDeleting, setIsDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FuncionarioFormValues>({
    resolver: zodResolver(funcionarioSchema),
    mode: "onTouched",
  });

  const cpf = useWatch({ control, name: "cpf" });
  const phone = useWatch({ control, name: "phone" });
  const dateOfBith = useWatch({ control, name: "dateOfBith" });
  const typeOfHiring = useWatch({ control, name: "typeOfHiring" });
  const status = useWatch({ control, name: "status" });
  const name = useWatch({ control, name: "name" });

  useEffect(() => {
    const load = async () => {
      try {
        const emp = await employeeApi.getById(id);
        reset({
          name: emp.name ?? "",
          email: emp.email ?? "",
          cpf: formatCPF(emp.cpf ?? ""),
          phone: formatPhone(emp.phone ?? ""),
          dateOfBith: emp.dateOfBith ? formatISODate(emp.dateOfBith) : "",
          typeOfHiring: emp.typeOfHiring as "CLT" | "PJ",
          status: emp.status,
        });
      } catch {
        toast.error("Erro ao carregar funcionário");
        router.push("/funcionarios");
      }
    };

    load();
  }, [id, reset, router]);

  const onSubmit = async (data: FuncionarioFormValues) => {
    try {
      const [day, month, year] = data.dateOfBith.split("/");
      await employeeApi.update(id, {
        name: data.name,
        email: data.email,
        cpf: data.cpf,
        phone: data.phone,
        dateOfBith: new Date(
          `${year}-${month}-${day}T00:00:00.000Z`,
        ).toISOString(),
        typeOfHiring: data.typeOfHiring,
        status: data.status,
      });
      toast.success("Funcionário atualizado com sucesso!");
      router.push("/funcionarios");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Erro ao atualizar funcionário";
      toast.error(message);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await employeeApi.delete(id);
      toast.success("Funcionário excluído com sucesso!");
      router.push("/funcionarios");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Erro ao excluir funcionário";
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <main className="min-h-screen bg-brand-dark">
      <div className="bg-background mx-auto min-h-screen max-w-[1440px]">
        <Navbar />
        <div className="px-8 lg:px-32 pb-12">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 mt-8 text-base font-bold text-foreground hover:opacity-70 transition-opacity"
          >
            <IconArrowLeft />
            Voltar
          </button>
          <div className="mt-4 mb-8">
            <h1 className="text-3xl font-bold text-foreground">
              Editar Funcionário
            </h1>
            <p className="text-xl font-bold text-foreground/70 mt-1">
              Empresa DoQR Tecnologia
            </p>
          </div>
          <div className="form-card">
            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="flex flex-col gap-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormField label="Nome" error={errors.name?.message}>
                  <Input
                    placeholder="Nome"
                    className="h-9 border-input"
                    {...register("name")}
                  />
                </FormField>

                <FormField label="E-mail" error={errors.email?.message}>
                  <Input
                    placeholder="e-mail"
                    type="email"
                    className="h-9 border-input"
                    {...register("email")}
                  />
                </FormField>

                <FormField label="CPF" error={errors.cpf?.message}>
                  <Input
                    placeholder="000.000.000-00"
                    className="h-9 border-input"
                    value={cpf ?? ""}
                    onChange={(e) =>
                      setValue(
                        "cpf",
                        formatCPF(e.target.value, getValues("cpf") ?? ""),
                        { shouldValidate: true },
                      )
                    }
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormField label="Celular" error={errors.phone?.message}>
                  <Input
                    placeholder="(99) 99999-9999"
                    className="h-9 border-input"
                    value={phone ?? ""}
                    onChange={(e) =>
                      setValue(
                        "phone",
                        formatPhone(e.target.value, getValues("phone") ?? ""),
                        { shouldValidate: true },
                      )
                    }
                  />
                </FormField>

                <FormField
                  label="Data de Nascimento"
                  error={errors.dateOfBith?.message}
                >
                  <Input
                    type="text"
                    placeholder="00/00/0000"
                    className="h-9 border-input"
                    value={dateOfBith ?? ""}
                    onChange={(e) =>
                      setValue(
                        "dateOfBith",
                        formatDate(
                          e.target.value,
                          getValues("dateOfBith") ?? "",
                        ),
                        { shouldValidate: true },
                      )
                    }
                  />
                </FormField>

                <FormField
                  label="Tipo de Contratação"
                  error={errors.typeOfHiring?.message}
                >
                  <Select
                    value={typeOfHiring ?? ""}
                    onValueChange={(val) =>
                      setValue("typeOfHiring", val as "CLT" | "PJ", {
                        shouldValidate: true,
                      })
                    }
                  >
                    <SelectTrigger className="h-9 w-full border-input">
                      <SelectValue placeholder="Selecione uma opção..." />
                    </SelectTrigger>
                    <SelectContent side="bottom" sideOffset={4}>
                      <SelectItem value="CLT">CLT</SelectItem>
                      <SelectItem value="PJ">PJ</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormField label="Status" error={errors.status?.message}>
                  <Select
                    value={status !== undefined ? String(status) : ""}
                    onValueChange={(val) =>
                      setValue("status", val === "true", {
                        shouldValidate: true,
                      })
                    }
                  >
                    <SelectTrigger className="h-9 w-full border-input">
                      <SelectValue placeholder="Selecione uma opção..." />
                    </SelectTrigger>
                    <SelectContent side="bottom" sideOffset={4}>
                      <SelectItem value="true">Ativo</SelectItem>
                      <SelectItem value="false">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      type="button"
                      disabled={isDeleting}
                      className="bg-destructive hover:bg-destructive/90 text-white font-bold text-base h-9 px-6 disabled:opacity-50"
                    >
                      {isDeleting ? "Excluindo..." : "Excluir"}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Excluir funcionário</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja excluir{" "}
                        <strong className="text-foreground">{name}</strong>?
                        Essa ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-destructive hover:bg-destructive/90 text-white"
                        onClick={handleDelete}
                      >
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-primary hover:bg-primary/90 text-white font-bold text-base h-9 px-6 disabled:opacity-50"
                >
                  {isSubmitting ? "Salvando..." : "Salvar"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
