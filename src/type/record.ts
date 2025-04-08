export type Record = {
    id: number;
    patientId: number;
    status: string;
    date: string;
    vaccinationName: string;
    vaccineName: string | null;
    manufacturer: string | null;
    batchNumber: string | null;
    expirationDate: string | null;
    injectionSite: string | null;
    medicalFacility: string | null;
    doctor: string | null;
    certificateNumber: string | null;
    sideEffects: string | null;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
};

export type VaccineRecord = {
    id: number;
    date: string;
    vaccinationName: string;
};

export type VaccinationRecord = {
    id: string;
    vaccinationName: string;
    date: string;
    status: string;
};