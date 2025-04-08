import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import classNames from "classnames";
import "./MyClass.scss";
import "../table.scss";
import { Spinner } from "../../../Spinner";
import { NavLink } from "react-router-dom";
import { Patient } from "../../../../type/patient";
import { Vaccination } from "../../../../type/vaccination";
import { useStudentToken } from "../../../../utils/createToken";
import { API_URL } from "../../../../utils/config";

interface Props {
  classArray: string[];
  schoolName: string;
}

export const MyClass: React.FC<Props> = ({ classArray, schoolName }) => {
  const [patientsByClass, setPatientsByClass] = useState<Record<string, Patient[]>>({});
  const [vaccinationData, setVaccinationData] = useState<Record<number, { last?: Vaccination; next?: Vaccination }>>({});
  const [loadingVaccination, setLoadingVaccination] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeClass = searchParams.get("class") || "";

  const navigate = useNavigate();

  const { getTokenForId } = useStudentToken();

  const handleStudentClick = async (id: number) => {
    const token = await getTokenForId(id);
    if (token) {
      navigate(`/card/${token}`);
    }
  };


  useEffect(() => {
    const fetchPatients = async () => {
      setError(null);

      try {
        const results: Record<string, Patient[]> = {};

        for (const className of classArray) {
          const response = await fetch(
            `${API_URL}api/patients/school/${schoolName}/class/${className}/student`
          );

          if (!response.ok) {
            throw new Error(`Failed to fetch patients for class ${className}`);
          }

          const data: Patient[] = await response.json();
          results[className] = data;
        }

        setPatientsByClass(results);
      } catch (err) {
        setError((err as Error).message);
      }
    };

    fetchPatients();
  }, [schoolName, classArray]);

  useEffect(() => {
    if (!activeClass) return;

    setLoadingVaccination(true);

    const fetchVaccinationData = async () => {
      const newVaccinationData: Record<number, { last?: Vaccination; next?: Vaccination }> = {};
      const allPatients = patientsByClass[activeClass] || [];

      for (const patient of allPatients) {
        try {
          const [lastRes, nextRes] = await Promise.all([
            fetch(`${API_URL}api/records/user/${patient.pageNumber}/last`).then((res) =>
              res.ok ? res.json() : null
            ),
            fetch(`${API_URL}api/records/user/${patient.pageNumber}/first-future`).then((res) =>
              res.ok ? res.json() : null
            ),
          ]);

          newVaccinationData[patient.id] = {
            last: lastRes,
            next: nextRes,
          };
        } catch (error) {
          console.error(`Failed to fetch vaccination data for patient ${patient.id}`, error);
        }
      }

      setVaccinationData(newVaccinationData);
      setTimeout(() => setLoadingVaccination(false), 500);
    };

    fetchVaccinationData();
  }, [activeClass, patientsByClass]);

  const toggleClass = (className: string) => {
    setSearchParams(prevParams => {
      const newParams = new URLSearchParams(prevParams);
      if (newParams.get("class") === className) {
        newParams.delete("class");
      } else {
        newParams.set("class", className);
      }
      return newParams;
    });
  };

  if (error) return <p>Помилка: {error}</p>;

  return (
    <div className="table__block">
      {classArray.map((className) => (
        <div key={className} className="class__section">
          <div
            className="table__class-name"
            onClick={() => toggleClass(className)}
          >
            {className}
            <div className={classNames("table__class-name--img", {
              "table__class-name--img--active": activeClass === className,
            })}></div>
          </div>
          {activeClass === className && (
            loadingVaccination ? <Spinner /> : (
              <table className="table">
                <thead>
                  <tr className="table__title">
                    <th className="table__title--item">Прізвище та ім’я</th>
                    <th className="table__title--item">Клас</th>
                    <th className="table__title--item">Дата народження</th>
                    <th className="table__title--item">Дата останнього щеплення</th>
                    <th className="table__title--item">Дата наступного щеплення</th>
                  </tr>
                </thead>
                <tbody>
                  {patientsByClass[className]?.map((student) => (
                    <tr
                      key={student.id}
                      className={classNames("table__line", {
                        "table__line--good": vaccinationData[student.id]?.last?.status ||
                          vaccinationData[student.id]?.next?.status === "completed",
                        "table__line--warning": vaccinationData[student.id]?.last?.status === "overdue",
                        "table__line--prog": vaccinationData[student.id]?.next?.status === 'Pending'
                      })}
                    >
                      <td
                        className="table__line--item"
                        onClick={() => handleStudentClick(Number(student.pageNumber))}
                      >
                        {student.firstName} {student.lastName}
                      </td>
                      <td className="table__line--item">{className}</td>
                      <td className="table__line--item">{student.birthDate}</td>
                      <td className="table__line--item">
                        {vaccinationData[student.id]?.last?.lastVaccination?.date ?? "—"}
                      </td>
                      <td className="table__line--item">
                        {vaccinationData[student.id]?.next?.lastVaccination?.date ?? "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          )}
        </div>
      ))}
    </div>
  );
};
