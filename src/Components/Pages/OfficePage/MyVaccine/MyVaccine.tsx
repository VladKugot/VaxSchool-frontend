import React, { useEffect, useState } from 'react';
import './MyVaccine.scss';
import { Patient } from '../../../../type/patient';
import { API_URL } from '../../../../utils/config';

type Props = {
    patient: Patient;
}

export const MyVaccine: React.FC<Props> = ({ patient }) => {

    const calculateAge = (birthDate: string) => {
        const birthYear = new Date(birthDate).getFullYear();
        const currentYear = new Date().getFullYear();
        return currentYear - birthYear;
    };

    const [futureEvent, setFutureEvent] = useState<{
        overdue: { date: string; vaccinationName: string }[] | undefined;
        upcoming: { date: string; vaccinationName: string }[] | undefined;
    }>({
        overdue: undefined,
        upcoming: undefined,
    });

    useEffect(() => {
        const fetchFutureEvents = async () => {
            try {
                const response = await fetch(`${API_URL}api/records/user/${patient.id}/future-event`);
                const data = await response.json();
                setFutureEvent(data);
            } catch (error) {
                console.error('Error fetching future events:', error);
            }
        };

        fetchFutureEvents();
    }, []);

    return (
        <div className="my-vaccine">
            <div className="my-vaccine__block">
                <h2 className='my-vaccine__title'>Персональні дані</h2>
                <ul className='my-vaccine__about-me__list'>

                    <li className='my-vaccine__about-me__item'>
                        <p className='my-vaccine__about-me__item--text'>
                            Прізвище та ім’я:
                        </p>
                        <p className='my-vaccine__about-me__item--text'>
                            {patient.lastName} {patient.firstName}
                        </p>
                    </li>

                    <li className='my-vaccine__about-me__item'>
                        <p className='my-vaccine__about-me__item--text'>
                            Стать:
                        </p>
                        <p className='my-vaccine__about-me__item--text'>
                            {patient.gender === 'female' ? ('Жіноча') : ('Чоловіча')}
                        </p>
                    </li>

                    <li className='my-vaccine__about-me__item'>
                        <p className='my-vaccine__about-me__item--text'>
                            Вік:
                        </p>
                        <p className='my-vaccine__about-me__item--text'>
                            {calculateAge(patient.birthDate)} років
                        </p>
                    </li>

                    {patient.studentClass && (
                        <li className='my-vaccine__about-me__item'>
                            <p className='my-vaccine__about-me__item--text'>
                                Клас:
                            </p>
                            <p className='my-vaccine__about-me__item--text'>
                                {patient.studentClass}
                            </p>
                        </li>
                    )}

                    {patient.classTeacher && (
                        <li className='my-vaccine__about-me__item'>
                            <p className='my-vaccine__about-me__item--text'>
                                Класний керівник:
                            </p>
                            <p className='my-vaccine__about-me__item--text'>
                                {patient.classTeacher}
                            </p>
                        </li>
                    )}

                    {patient.position && (
                        <li className='my-vaccine__about-me__item'>
                            <p className='my-vaccine__about-me__item--text'>
                                Посада:
                            </p>
                            <p className='my-vaccine__about-me__item--text'>
                                {patient.position}
                            </p>
                        </li>
                    )}

                    <li className='my-vaccine__about-me__item'>
                        <p className='my-vaccine__about-me__item--text'>
                            Адреса:
                        </p>
                        <p className='my-vaccine__about-me__item--text'>
                            {patient.address}
                        </p>
                    </li>

                    <li className='my-vaccine__about-me__item'>
                        <p className='my-vaccine__about-me__item--text'>
                            Сімейний лікар:
                        </p>
                        <p className='my-vaccine__about-me__item--text'>
                            {patient.familyDoctor}
                        </p>
                    </li>
                </ul>
            </div>

            <div className="my-vaccine__block">
                <h2 className="my-vaccine__title">Майбутні події</h2>

                {futureEvent.overdue && futureEvent.overdue.length > 0 && (
                    <ul className='my-vaccine__list'>
                        {futureEvent.overdue.map((vaccine, index) => (
                            <div className='my-vaccine__item--block'>
                                <li className='my-vaccine__item my-vaccine__item--oredue' key={index}>
                                    <span className='my-vaccine__item--text'
                                    >
                                        {vaccine.vaccinationName}:
                                    </span>
                                    <span className='my-vaccine__item--text'
                                    >
                                        {vaccine.date}
                                    </span>
                                </li>
                                <button className='my-vaccine__item--btn'>Записатися</button>
                            </div>
                        ))}
                    </ul >
                )}
                {futureEvent.upcoming && futureEvent.upcoming.length > 0 && (
                    <ul className='my-vaccine__list'>
                        {futureEvent.upcoming.map((vaccine, index) => (
                            <div className="my-vaccine__item--block">
                                <li className='my-vaccine__item my-vaccine__item--upcoming' key={index}>
                                    <span className='my-vaccine__item--text'
                                    >
                                        {vaccine.vaccinationName}:
                                    </span>
                                    <span className='my-vaccine__item--text'
                                    >
                                        {vaccine.date}
                                    </span>
                                </li>
                                <button className='my-vaccine__item--btn'>Записатися</button>
                            </div>
                        ))}
                    </ul>
                )}

                {(!futureEvent.overdue || futureEvent.overdue.length === 0) &&
                    (!futureEvent.upcoming || futureEvent.upcoming.length === 0) && (
                        <p className='my-vaccine__item my-vaccine__item--good'
                        >
                            Майбутні подій не заплановані.
                        </p>
                    )}
            </div>
        </div>
    );
}