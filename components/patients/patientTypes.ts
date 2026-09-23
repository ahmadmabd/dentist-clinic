export type Treatment = {
  id?: number;
  name: string;
  before: string;
  after: string;
};

export type Payment = {
  id: number;
  amount: number | string;
  createdAt: string;
};

export type Patient = {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  totalPrice: number | string;
  address: string;
  treatments: Treatment[];
  payments: Payment[];
};

export const emptyTreatment: Treatment = {
  name: "",
  before: "",
  after: "",
};

export type PatientFormData = {
  firstName: string;
  lastName: string;
  phone: string;
  totalPrice: string;
  address: string;
  treatments: Treatment[];
};
