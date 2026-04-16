import { z } from "zod";

export const funcionarioSchema = z.object({
  name: z
    .string({ error: "Nome é obrigatório" })
    .trim()
    .min(3, "Nome deve ter ao menos 3 caracteres"),

  email: z
    .string({ error: "E-mail é obrigatório" })
    .trim()
    .email("Formato de e-mail inválido"),

  cpf: z
    .string({ error: "CPF é obrigatório" })
    .trim()
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF inválido (ex: 123.456.789-00)"),

  phone: z
    .string({ error: "Celular é obrigatório" })
    .trim()
    .regex(
      /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
      "Celular inválido (ex: (11) 99999-9999)",
    ),

  dateOfBith: z
    .string({ error: "Data de nascimento é obrigatória" })
    .min(10, "Data de nascimento é obrigatória")
    // Validação real de data (rejeita datas inexistentes como 31/02/2020, além de validar anos bissextos)
    .refine((val) => {
      if (val.length < 10) return false;
      const [day, month, year] = val.split("/").map(Number);
      const date = new Date(year, month - 1, day);
      return (
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day &&
        year >= 1900 &&
        date <= new Date()
      );
    }, "Data inválida"),

  typeOfHiring: z.enum(["CLT", "PJ"], {
    error: "Selecione o tipo de contratação",
  }),

  status: z.boolean({ error: "O status deve ser definido" }),
});

export type FuncionarioFormValues = z.infer<typeof funcionarioSchema>;
