export type TypeHiring = "CLT" | "PJ";

export interface Employee {
  id: number;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  dateOfBith: string;
  typeOfHiring: TypeHiring;
  status: boolean;
}

export interface CreateEmployeeRequest {
  name: string;
  email: string;
  cpf: string;
  phone: string;
  dateOfBith: string;
  typeOfHiring: TypeHiring;
  status: boolean;
}

export type UpdateEmployeeRequest = CreateEmployeeRequest;
