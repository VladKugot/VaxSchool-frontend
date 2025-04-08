import classNames from "classnames";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../table.scss";
import { Student } from "../../../../type/people";
import { Vaccination } from "../../../../type/vaccination";
import { useStudentToken } from "../../../../utils/createToken";
import { API_URL } from "../../../../utils/config";

interface Props {
    schoolName: string;
    className: string[];
}

export const LastNews: React.FC<Props> = ({ schoolName, className }) => {
    const [students, setStudents] = useState<Student[]>([]);
    const [vaccinations, setVaccinations] = useState<Vaccination[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    const { getTokenForId } = useStudentToken(); // Використання хука
  
    const handleStudentClick = async (id: number) => {
        const token = await getTokenForId(id);
        if (token) {
            navigate(`/card/${token}`);
        }
    };

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                setLoading(true);
                let allStudents: Student[] = [];

                for (let cls of className) {
                    const classPath = encodeURIComponent(cls);
                    const res = await fetch(
                        `${API_URL}api/patients/school/${encodeURIComponent(schoolName)}/class/${classPath}/student`
                    );
                    const data = await res.json();

                    console.log("Fetched students for class:", cls, data);

                    if (Array.isArray(data)) {
                        allStudents = [...allStudents, ...data];
                    } else {
                        console.error("Unexpected response format for class:", cls, data);
                    }
                }

                setStudents(allStudents);

                const patientIds = allStudents.map(student => student.pageNumber).join(",");
                console.log("Patient IDs for vaccination request:", patientIds);

                if (!patientIds) return;

                const vacRes = await fetch(
                    `${API_URL}api/records/users/recent-and-upcoming-vaccinations?userIds=${patientIds}`
                );
                const vacData = await vacRes.json();

                console.log("Fetched vaccination data:", vacData);

                if (Array.isArray(vacData)) {
                    setVaccinations(vacData);
                } else {
                    console.error("Unexpected vaccination data:", vacData);
                    setVaccinations([]);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                setStudents([]);
                setVaccinations([]);
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, [schoolName, className]);


    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <>
            <table className="table">
                <thead className="table__head">
                    <tr className="table__title">
                        <th></th>
                        <th className="table__title--item">Ім'я</th>
                        <th className="table__title--item">Клас</th>
                        <th className="table__title--item">Подія</th>
                        <th className="table__title--item">Дата</th>
                    </tr>
                </thead>
                <tbody className="table__body">
                    {students.length > 0 &&
                        students.map((student) => {
                            const studentVaccinations = vaccinations.filter(
                                (v) => v.patientId === Number(student.pageNumber)
                            );

                            return (
                                <>
                                    {studentVaccinations.length > 0 && studentVaccinations[0] !== null && (
                                        studentVaccinations.map((vaccination, i) => (
                                            <tr
                                                className={classNames("table__line", {
                                                    "table__line--good": vaccination.status === "completed",
                                                    "table__line--warning": vaccination.status === "overdue",
                                                    "table__line--prog": vaccination.status === "pending",
                                                })}
                                                key={`${student.id}-${i}`}
                                            >
                                                <td></td>
                                                <td
                                                    className="table__line--item"
                                                    onClick={() => handleStudentClick(Number(student.pageNumber))}
                                                >
                                                    {student.firstName} {student.lastName}
                                                </td>
                                                <td className="table__line--item">
                                                    {student.studentClass}
                                                </td>
                                                {vaccination.status === "overdue" ? (
                                                    <td className="table__line--item">Відсторонення від навчання</td>
                                                ) : (
                                                    <td className="table__line--item">{vaccination.vaccinationName}</td>
                                                )}
                                                <td className="table__line--item">{vaccination.date}</td>
                                            </tr>
                                        ))
                                    )}
                                </>
                            );
                        })}
                </tbody>
            </table>
        </>
    );
};
