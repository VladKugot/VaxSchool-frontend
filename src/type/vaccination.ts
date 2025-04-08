export interface Vaccination {
    patientId: number;
    vaccinationName: string;
    date: string;
    status: "completed" | "overdue" | "Pending" | "pending";
}

export type Vaccine = {
    id: number;
    name: string;
    description: string;
};

export type VaccineType = {
    value: string;
    name: string;
};

interface VaccinationDetails {
    status: "pending" | "overdue" | "done";
    date: string;
    vaccinationName: string;
}

export interface Vaccination {
    status: "completed" | "overdue" | "Pending" | "pending";
    lastVaccination?: VaccinationDetails;
}