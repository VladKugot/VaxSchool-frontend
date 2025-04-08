import './UpdateUserPage.scss';
import '../page.scss';
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useSchoolName } from '../../../utils/getSchoolName';
import { Patient } from '../../../type/patient';
import { API_URL } from '../../../utils/config';

type Props = {
    type: string[];
};

export const UpdateUserPage: React.FC<Props> = ({ type }) => {
    const userType = localStorage.getItem('userType');
    const userId = localStorage.getItem('userId');
    const [searchTerm, setSearchTerm] = useState("");
    const [students, setStudents] = useState<Patient[]>([]);
    const [filteredStudents, setFilteredStudents] = useState<Patient[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<Patient | null>(null);
    const [editedStudent, setEditedStudent] = useState<Partial<Patient>>({});

    const { schoolName, error } = useSchoolName(userId);

    useEffect(() => {
        async function fetchStudents() {
            try {
                const response = await fetch(`${API_URL}api/patients`);
                if (!response.ok) {
                    throw new Error("Помилка отримання учнів");
                }
                const data = await response.json();

                const filteredData = schoolName
                    ? data.filter((student: { institution: string }) => student.institution === schoolName)
                    : data;

                setStudents(filteredData);
                setFilteredStudents(filteredData);
            } catch (error) {
                console.error("Помилка завантаження студентів:", error);
            }
        }

        if (schoolName && !error) {
            fetchStudents();
        }
    }, [schoolName]);

    useEffect(() => {
        const filtered = students.filter(student =>
            student.lastName.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredStudents(filtered);
    }, [searchTerm, students]);

    const handleStudentClick = (student: Patient) => {
        setSelectedStudent(student);
        setEditedStudent(student);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditedStudent(prev => ({ ...prev, [name]: value }));
    };

    const handleCancel = () => {
        setEditedStudent({});
        setSelectedStudent(null);
    };

    const handleSave = async () => {
        if (!selectedStudent) return;

        try {
            const response = await fetch(`${API_URL}api/patients/${selectedStudent.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editedStudent)
            });

            if (!response.ok) {
                throw new Error("Помилка оновлення даних студента");
            }

            setStudents(prev => prev.map(s => s.id === selectedStudent.id ? { ...s, ...editedStudent } : s));
            setFilteredStudents(prev => prev.map(s => s.id === selectedStudent.id ? { ...s, ...editedStudent } : s));
            setSelectedStudent(null);
            setEditedStudent({});
        } catch (error) {
            console.error("Помилка збереження студента:", error);
        }
    };

    if (!userType || !type.includes(userType)) {
        return <Navigate to="/" />;
    }

    return (
        <div className="update-user-page page">
            <h1 className="page__title">Зміна даних пацієнта</h1>
            <div className="update-user-page__content">
                <div className="update-user-page__block">
                    <input
                        type="text"
                        className="update-user-page__input"
                        placeholder="Пошук за прізвищем..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {filteredStudents.length > 0 ? (
                        <table className="update-user-page__table table">
                            <thead>
                                <tr className="table__title">
                                    <th className="table__title--item">Прізвище та ім’я</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.map(student => (
                                    <tr key={student.id} className="table__line" onClick={() => handleStudentClick(student)}>
                                        <td className="table__line--item">
                                            {student.firstName} {student.lastName}
                                        </td>
                                        <td></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <h3 className="update-user-page__error-message">Учнів не знайдено</h3>
                    )}
                </div>

                <div className="update-user-page__block">
                    <h2 className="update-user-page__title">Редагування {editedStudent.personType === "student" ? 'учня': 'працівника'}</h2>
                    <input className='update-user-page__input' type="text" name="firstName" value={editedStudent.firstName || ''} onChange={handleInputChange} placeholder="Ім'я" />
                    <input className='update-user-page__input' type="text" name="lastName" value={editedStudent.lastName || ''} onChange={handleInputChange} placeholder="Прізвище" />
                    {editedStudent.personType === 'student'
                        && <input className='update-user-page__input' type="text" name="studentClass" value={editedStudent.studentClass || ''} onChange={handleInputChange} placeholder="Клас" />}
                    <input className='update-user-page__input' type="text" name="institution" value={editedStudent.institution || ''} onChange={handleInputChange} placeholder="Школа" />
                    <input className='update-user-page__input' type="text" name="phone" value={editedStudent.phone || ''} onChange={handleInputChange} placeholder="Телефон" />
                    <input className='update-user-page__input' type="text" name="familyDoctor" value={editedStudent.familyDoctor || ''} onChange={handleInputChange} placeholder="Сімейний лікар" />
                    {editedStudent.personType === 'student' &&
                        <input className='update-user-page__input' type="text" name="classTeacher" value={editedStudent.classTeacher || ''} onChange={handleInputChange} placeholder="Класний керівник" />}
                    <div className="update-user-page__button__block">
                        <button className='update-user-page__button' onClick={handleSave}>Зберегти</button>
                        <button className='update-user-page__button' onClick={handleCancel}>Скасувати</button>
                    </div>
                </div>

            </div>
        </div>
    );
};
