import React, { useEffect, useState } from 'react';
import './VaccineInfo.scss';
import { Spinner } from '../../../Spinner';
import { Record } from '../../../../type/record';
import { Student } from '../../../../type/people';
import { API_URL } from '../../../../utils/config';

type Props = {
    recordId: string;
}

export const VaccineInfo: React.FC<Props> = ({ recordId }) => {
    const [record, setRecord] = useState<Record | null>(null);
    const [student, setStudent] = useState<Student | null>(null);
    const [loading, setLoading] = useState(true);
    const [messege, setMessege] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (recordId === "0") {
            setMessege("Оберіть щеплення для перегляду");
            setLoading(false);
            return;
        }
        setMessege(null);
        setLoading(true);
        setTimeout(async () => {
            try {
                const response = await fetch(`${API_URL}api/records/${recordId}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                const data = await response.json();
                setRecord(data);
            } catch (err) {
                setError('Failed to fetch data');
            } finally {
                setLoading(false);
            }
        }, 500);
    }, [recordId]);

    useEffect(() => {
        if (!record?.patientId) return;

        setLoading(true);
        setTimeout(async () => {
            try {
                const response = await fetch(`${API_URL}api/patients/page-number/${record.patientId}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch student data");
                }
                const data = await response.json();
                setStudent(data);
            } catch (err) {
                setError("Failed to fetch student data");
            } finally {
                setLoading(false);
            }
        }, 500);
    }, [record]);

    if (loading) return <div className="vaccine-info__spinner"><Spinner /></div>;
    if (error) return <p className='vaccine-info__title--main'>Помилка: {error}</p>;
    if (messege) return <p className='vaccine-info__title--main'>{messege}</p>;
    if (!record) return <p className='vaccine-info__title--main'>Запис не знайдено</p>;

    return (
        record.status === 'completed' ? (
            <div className="vaccine-info">
                <h2 className='vaccine-info__title--main'>
                    Назва щеплення:<>&nbsp;</>
                    <span className='vaccine-info__title--black'>{record.vaccinationName}</span>
                </h2>
                <div className="vaccine-info__block--main">
                    <div className="vaccine-info__block--big">
                        <div className="vaccine-info__block">
                            <h2 className='vaccine-info__title'>Дані пацієнта</h2>
                            <p className='vaccine-info__item'>Прізвище та ім'я:  <span className='vaccine-info__item--black'>{student?.lastName} {student?.firstName}</span></p>
                            <p className='vaccine-info__item'>Дата народження: <span className='vaccine-info__item--black'>{student?.birthDate}</span></p>
                        </div>

                        <div className="vaccine-info__block">
                            <h2 className='vaccine-info__title'>Інформація про вакцину</h2>
                            <p className='vaccine-info__item'>Назва вакцини: <span className='vaccine-info__item--black'>{record.vaccineName}</span></p>
                            <p className='vaccine-info__item'>Виробник: <span className='vaccine-info__item--black'>{record.manufacturer}</span></p>
                            <p className='vaccine-info__item'>Серія вакцини: <span className='vaccine-info__item--black'>{record.batchNumber}</span></p>
                            <p className='vaccine-info__item'>Термін придатності: <span className='vaccine-info__item--black'>{record.expirationDate}</span></p>
                        </div>
                    </div>

                    <div className="vaccine-info__block--big vaccine-info__block--big--reverse">
                        <div className="vaccine-info__block">
                            <h2 className='vaccine-info__title'>Інформація про щеплення</h2>
                            <p className='vaccine-info__item'>Дата проведення: <span className='vaccine-info__item--black'>{record.expirationDate}</span></p>
                            <p className='vaccine-info__item'>Місце ін'єкції: <span className='vaccine-info__item--black'>{record.injectionSite}</span></p>
                            <p className='vaccine-info__item'>Назва медичного закладу: <span className='vaccine-info__item--black'>{record.medicalFacility}</span></p>
                            <p className='vaccine-info__item'>ПІБ працівника, що виконав щеплення: <span className='vaccine-info__item--black'>{record.doctor}</span></p>
                        </div>

                        <div className="vaccine-info__block">
                            <h2 className='vaccine-info__title'>Додаткова інформація</h2>
                            <p className='vaccine-info__item'>Номер сертифікату: <span className='vaccine-info__item--black'>{record.certificateNumber}</span></p>
                            {record.sideEffects ? (
                                <p className='vaccine-info__item'>Відомості про побічну реакцію: <span className='vaccine-info__item--black'>{record.sideEffects}</span></p>
                            ) : (
                                <p className='vaccine-info__item'>Відомості про побічну реакцію: <span className='vaccine-info__item--black'>-</span></p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        ) : (
            <div className="vaccine-info__empty">
                <h2 className='vaccine-info__title--main'>
                    Назва щеплення:<>&nbsp;</>
                    <span className='vaccine-info__title--black'>{record.vaccinationName}</span>
                </h2>

                {record.status === 'Pending' ? (
                    <p className='vaccine-info__title--main'>Вакцинація запланована на<>&nbsp;</><span className='vaccine-info__title--black'>{record.date}</span></p>
                ) : (
                    <p className='vaccine-info__title--main'>Пропущена вакцинація:<>&nbsp;</><span className='vaccine-info__title--black'>{record.date}</span></p>
                )}
            </div>
        )
    );
}
