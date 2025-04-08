import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MyTeacher.scss';
import classNames from 'classnames';
import '../table.scss';
import { Spinner } from '../../../Spinner';
import { useNavigate } from 'react-router-dom';
import { Teacher } from '../../../../type/people';
import { Vaccination } from '../../../../type/vaccination';
import { useStudentToken } from '../../../../utils/createToken';
import { API_URL } from '../../../../utils/config';

type Props = {
    schoolName: string;
};

export const MyTeacher: React.FC<Props> = ({ schoolName }) => {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [vaccinationData, setVaccinationData] = useState<Record<number, { last?: Vaccination; next?: Vaccination }>>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [lastName, setLastName] = useState<string>('');
    const [position, setPosition] = useState<string>('');

    const navigate = useNavigate();

    const { getTokenForId } = useStudentToken();

    const handleTeacherClick = async (id: number) => {
        const token = await getTokenForId(id);
        if (token) {
            navigate(`/card/${token}`);
        }
    };


    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await axios.get<Teacher[]>(
                    `${API_URL}api/patients/teachers/${encodeURIComponent(schoolName)}`,
                    { params: { lastName, position } }
                );

                setTeachers(response.data);
            } catch (err) {
                setError('Помилка при завантаженні вчителів');
            } finally {
                setTimeout(() => setLoading(false), 500);
            }
        };

        const timeoutId = setTimeout(fetchTeachers, 500);
        return () => clearTimeout(timeoutId);
    }, [schoolName, lastName, position]);

    useEffect(() => {
        const fetchVaccinationData = async () => {
            const newVaccinationData: Record<number, { last?: Vaccination; next?: Vaccination }> = {};

            for (const teacher of teachers) {
                try {
                    const [lastRes, nextRes] = await Promise.all([
                        fetch(`${API_URL}api/records/user/${teacher.pageNumber}/last`).then((res) =>
                            res.ok ? res.json() : null
                        ),
                        fetch(`${API_URL}api/records/user/${teacher.pageNumber}/first-future`).then((res) =>
                            res.ok ? res.json() : null
                        ),
                    ]);

                    newVaccinationData[teacher.id] = {
                        last: lastRes,
                        next: nextRes,
                    };
                } catch (error) {
                    console.error(`Failed to fetch vaccination data for teacher ${teacher.pageNumber}`, error);
                }
            }

            setVaccinationData(newVaccinationData);
        };

        if (teachers.length > 0) {
            fetchVaccinationData();
        }
    }, [teachers]);

    return (
        <div className="my-teacher">
            <div className="my-teacher__filters">
                <input
                    className='my-teacher__filters--input'
                    type="text"
                    placeholder="Пошук за прізвищем"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                />
                <input
                    className='my-teacher__filters--input'
                    type="text"
                    placeholder="Пошук за професією"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                />
            </div>

            {error && <p className="my-teacher__error">{error}</p>}
            {loading ? (
                <div className="my-teacher__spinner">
                    <Spinner />
                </div>
            ) : (
                teachers.length > 0 ? (
                    <table className="table">
                        <thead className="table__head">
                            <tr className="table__title">
                                <th></th>
                                <th className="table__title--item">Ім'я</th>
                                <th className="table__title--item">Посада</th>
                                <th className="table__title--item">Дата останнього щеплення</th>
                                <th className="table__title--item">Дата наступного щеплення</th>
                            </tr>
                        </thead>
                        <tbody className="table__body">
                            {teachers.map((teacher) => {
                                const teacherVaccinations = vaccinationData[teacher.id];

                                return (
                                    <tr
                                        className={classNames("table__line", {
                                            "table__line--good": teacherVaccinations?.last?.status === "completed",
                                            "table__line--warning": teacherVaccinations?.last?.status === "overdue",
                                            "table__line--prog": teacherVaccinations?.last?.status === "Pending",
                                        })}
                                        key={teacher.id}
                                    >
                                        <td></td>
                                        <td
                                            className="table__line--item"
                                            onClick={() => handleTeacherClick(Number(teacher.pageNumber))}
                                        >
                                            {teacher.firstName} {teacher.lastName}
                                        </td>
                                        <td className="table__line--item">{teacher.position}</td>
                                        <td className="table__line--item">
                                            {teacherVaccinations?.last?.lastVaccination?.date || "Немає даних"}
                                        </td>
                                        <td className="table__line--item">
                                            {teacherVaccinations?.next?.lastVaccination?.date || "Немає даних"}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                ) : (
                    <div className="my-teacher__error">Записи не знайдено</div>
                )
            )}
        </div>
    );
};
