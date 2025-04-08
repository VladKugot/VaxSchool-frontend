import { useEffect, useState } from 'react';
import { LastNews } from './LastNews/LastNews';
import './OfficePage.scss';
import { SwitchesBlock } from './SwitchesBlock';
import { Patient } from '../../../type/patient';
import { MyVaccine } from './MyVaccine';
import { MyClass } from './MyClass';
import { MyTeacher } from './MyTeacher';
import { NavLink } from 'react-router-dom';
import { API_URL } from '../../../utils/config';

export const OfficePage = () => {


    const UserType = {
        Teacher: 'teacher',
        Student: 'student',
        Nurse: 'nurse',
    }

    const [patient, setPatient] = useState<Patient | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [classArray, setClassArray] = useState<string[]>([]);

    useEffect(() => {
        const userId = localStorage.getItem('userId');

        if (userId) {
            fetch(`${API_URL}api/patients/${userId}`)
                .then(response => response.json())
                .then(data => {
                    setPatient(data);
                    setLoading(false);
                })
                .catch(error => {
                    setError(error);
                    setLoading(false);
                });
        } else {
            setError('User ID not found');
            setLoading(false);
        }
    }, []);

    const myClass = async () => {
        if (patient?.personType === UserType.Nurse) {
            const response = await fetch(`${API_URL}api/patients/school/${patient.institution}/class`);
            const nurseClass = await response.json();
            return nurseClass;
        }
        else { return (patient?.myClasses || []) }

    }

    useEffect(() => {
        const fetchClasses = async () => {
            const classes = await myClass();
            setClassArray(classes);
        };

        fetchClasses();
    }, [patient]);

    return (
        patient && (
            <div className="office-page">
                <h1 className='office-page__title'>Вітаємо, {patient.lastName} {patient.firstName}!</h1>
                {(patient.personType === UserType.Teacher || patient.personType === UserType.Nurse) && <>
                    <div className="office-page__block">
                        {patient.personType === UserType.Teacher ? (
                            <section className='office-page__section'>
                                <div className="office-page__section__main">
                                    <h2 className="office-page__section__title">Останні оновлення</h2>
                                    <div className="office-page__section__img office-page__section__img--last-news"></div>
                                </div>
                                <LastNews
                                    schoolName={patient.institution}
                                    className={patient.myClasses || []}
                                />
                            </section>
                        ) : (
                            <section className='office-page__section'>
                                <div className="office-page__section__main">
                                    <h2 className="office-page__section__title">Мої колеги</h2>
                                    <div className="office-page__section__img  office-page__section__img--my-forms"></div>
                                </div>
                                <MyTeacher schoolName={patient.institution} />
                            </section>
                        )}
                        <section className='office-page__section'>
                            <div className="office-page__section__main">
                                <h2 className="office-page__section__title">Мої класи</h2>
                                <div className="office-page__section__img office-page__section__img--my-forms"></div>
                            </div>
                            <MyClass classArray={classArray}
                                schoolName={patient.institution} />
                        </section>
                    </div>
                    {patient.personType === UserType.Nurse &&
                        <div className="office-page__block">
                            <section className='office-page__section'>
                                <div className="office-page__section__main">
                                    <h2 className="office-page__section__title">Останні оновлення</h2>
                                    <div className="office-page__section__img office-page__section__img--last-news"></div>
                                </div>
                                <LastNews
                                    schoolName={patient.institution}
                                    className={patient.myClasses || []}
                                />
                            </section>
                            <section className='office-page__section'>
                                <div className="office-page__section__main">
                                    <h2 className="office-page__section__title">Налаштування користувачів</h2>
                                    <div className="office-page__section__img office-page__section__img--setting"></div>
                                </div>
                                <div className="office-page__block-link">
                                    <NavLink className="office-page__block-link__link"  to="/registration-user">
                                        Реєстрація користувача
                                    </NavLink>

                                    <NavLink className="office-page__block-link__link" to="/delete-user">
                                        Видалити користувача
                                    </NavLink>

                                    <NavLink className="office-page__block-link__link" to="/update-user">
                                        Оновити користувача
                                    </NavLink>
                                </div>
                            </section>
                        </div>}
                </>
                }


                <section className='office-page__section office-page__section'>
                    <div className="office-page__section__main">
                        <h2 className="office-page__section__title">Моя вакцинація</h2>
                        <div className="office-page__section__img office-page__section__img--my-vaccination"></div>
                    </div>
                    <MyVaccine patient={patient} />
                </section>
                <section className='office-page__section office-page__section--switches'>
                    <SwitchesBlock />
                </section>
            </div>
        )
    )
}