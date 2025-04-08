import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import './CardPage.scss';
import '../page.scss';
import { CalendarBlock } from "../CalendarPage/CalendarBlock";
import { Patient } from "../../../type/patient";
import { useVerifyToken } from "../../../utils/useToken";
import { NotFoundPage } from "../NotFoundPage";
import { API_URL } from "../../../utils/config";

export const CardPage = () => {
  const { id } = useParams<{ id: string }>();
  const { userId, error, isLoading } = useVerifyToken(id);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchPatient = async () => {
      try {
        const response = await fetch(`${API_URL}api/patients/page-number/${userId}`);
        if (!response.ok) {
          throw new Error("Не вдалося отримати дані пацієнта");
        }

        const data: Patient = await response.json();
        setPatient(data);
      } catch (err) {
        setFetchError((err as Error).message);
      }
    };

    fetchPatient();
  }, [userId]);

  if (isLoading) return <p>Перевірка токена...</p>;
  if (error) return <NotFoundPage />;
  if (fetchError) return <p>Помилка: {fetchError}</p>;
  if (!patient) return <p>Завантаження...</p>;

  return (
    <div className="card-page page">
      <ul className="content__list">
        <h1 className="content__title">Сторінка {patient.pageNumber}</h1>

        <li className="content__item--name">
          {patient.firstName} {patient.lastName}
        </li>

        {patient.studentClass && (
          <li className="content__item">
            <span className="content__label">Клас:</span> {patient.studentClass}
          </li>
        )}

        <li className="content__item">
          <span className="content__label">Дата народження:</span> {patient.birthDate}
        </li>

        <li className="content__item">
          <span className="content__label">Номер телефону:</span> {patient.phone}
        </li>

        <li className="content__item">
          <span className="content__label">Адреса:</span> {patient.address}
        </li>

        {patient.personType === "student" ? (
          <>
            <li className="content__item">
              <span className="content__label">Класний керівник:</span> {patient.classTeacher}
            </li>

            <li className="content__item">
              <span className="content__label">Батько:</span> {patient.parents?.[0] ?? "Немає даних"}, тел: {patient.parentsPhone?.[0] ?? "Немає даних"}
            </li>

            <li className="content__item">
              <span className="content__label">Мати:</span> {patient.parents?.[1] ?? "Немає даних"}, тел: {patient.parentsPhone?.[1] ?? "Немає даних"}
            </li>
          </>
        ) : (
          <>
            <li className="content__item">
              <span className="content__label">Посада:</span> {patient.position}
            </li>

            <li className="content__item">
              <span className="content__label">Мій клас:</span>
              <ul className="content__list--form">
                {Array.isArray(patient.myClasses) && patient.myClasses.length > 0 ? (
                  patient.myClasses.map((classItem, index) => (
                    <li key={index} className="content__item">
                      {classItem}
                    </li>
                  ))
                ) : (
                  <li className="content__item">Немає даних</li>
                )}
              </ul>
            </li>
          </>
        )}

        <li className="content__item">
          <span className="content__label">Сімейний лікар:</span> {patient.familyDoctor}
        </li>
      </ul>

      {userId && <CalendarBlock userId={userId} />}
    </div>
  );
};