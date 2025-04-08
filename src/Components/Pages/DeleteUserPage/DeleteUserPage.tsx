import { useEffect, useState } from "react";
import "../OfficePage/table.scss";
import "./DeleteUserPage.scss";
import "../page.scss";
import { Patient } from "../../../type/patient";
import { Navigate, NavLink } from "react-router-dom";
import { useSchoolName } from "../../../utils/getSchoolName";
import { API_URL } from "../../../utils/config";

type Props = {
    type: string[];
}

export const DeleteUserPage: React.FC<Props> = ({ type }) => {
    const [errorMessage, setErrorMessage] = useState("");
    const [students, setStudents] = useState<Partial<Patient>[]>([]);
    const [filteredStudents, setFilteredStudents] = useState<Partial<Patient>[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const userId = localStorage.getItem('userId');
    const userType = localStorage.getItem('userType');

    const { schoolName, loading, error, refetch } = useSchoolName(userId);

    async function fetchStudentsBySchool(school: string) {
        try {
            const response = await fetch(`${API_URL}api/patients/school/${school}/class/all/student`);
            if (!response.ok) {
                throw new Error('Failed to fetch students');
            }
            const data = await response.json();
            setStudents(data);
            setFilteredStudents(data);
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    }

    useEffect(() => {
        if (userId) {
            if (schoolName && !error) {
                fetchStudentsBySchool(schoolName);
            }
        }
    }, [userId]);

    useEffect(() => {
        const filtered = students.filter(student =>
            student.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredStudents(filtered);
    }, [searchTerm, students]);

    const handleDelete = async (deleteUserId: string) => {
        try {
            console.log(`Отримання пацієнта з ID: ${deleteUserId}`);

            const response = await fetch(`${API_URL}api/patients/${deleteUserId}`);

            if (response.status === 404) {
                setErrorMessage("Пацієнта з таким ID не знайдено!");
                return;
            }

            const patientData = await response.json();
            const userIdToDelete = patientData.idUser;

            if (userIdToDelete) {
                console.log(`Видалення користувача з ID: ${userIdToDelete}`);

                const deleteUserResponse = await fetch(`${API_URL}api/users/${userIdToDelete}`, {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                });

                if (!deleteUserResponse.ok) throw new Error("Помилка при видаленні користувача");
            } else {
                console.log("idUser відсутній, пропускаємо видалення користувача.");
            }

            console.log(`Видалення пацієнта з ID: ${deleteUserId}`);

            const deletePatientResponse = await fetch(`${API_URL}api/patients/${deleteUserId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });

            if (!deletePatientResponse.ok) throw new Error("Помилка при видаленні пацієнта");

            setErrorMessage("Користувач і пацієнт успішно видалені!");

            if (schoolName) {
                fetchStudentsBySchool(schoolName);
            }
        } catch (error) {
            console.error("Помилка:", error);
            setErrorMessage(error instanceof Error ? error.message : "Сталася помилка");
        }
    };

    if (!userType || !type.includes(userType)) {
        return <Navigate to="/" />;
    }

    return (
        <div className="delete-user-page page">
            <h1 className="page__title">Видалення користувача</h1>
            <div className="delete-user-page__conteiner">
                <input
                    type="text"
                    className="delete-user-page__input"
                    placeholder="Пошук за прізвищем..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                {filteredStudents.length !== 0 ? (

                    <table className="delete-user-page__table table">
                        <thead>
                            <tr className="table__title">
                                <th className="table__title--item">Прізвище та ім’я</th>
                                <th className="table__title--item">Клас</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.map(student => (
                                <tr key={student.id} className="table__line">
                                    <td className="table__line--item">
                                        <NavLink to={`/card/${student.id}`} className="table__line--item">
                                            {student.firstName} {student.lastName}
                                        </NavLink>
                                    </td>
                                    <td className="table__line--item">{student.studentClass}</td>
                                    <td
                                        className="table__line--item"
                                        onClick={() => student.id && handleDelete(student.id.toString())}
                                    >
                                        <p className="table__line--delete"></p>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <h3 className="delete-user-page__error-message" >Учнів не знайдено</h3>
                )}
            </div>
            {errorMessage && <h3 className="delete-user-page__error-message">{errorMessage}</h3>}
        </div>
    );
};
