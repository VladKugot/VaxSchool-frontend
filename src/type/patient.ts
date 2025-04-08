export interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: 'male' | 'female' | 'other';
  address: string;
  familyDoctor?: string;
  idUser: number;
  personType: 'teacher' | 'nurse' | 'student';
  institution: string;
  phone: string;
  pageNumber?: string;
  position?: string;
  myClasses?: string[];
  studentClass?: string;
  classTeacher?: string;
  parents?: string[];
  parentsPhone?: string[];
}