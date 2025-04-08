import { useState, useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import "./FuturePastBlock.scss";
import { Spinner } from "../../../../../Spinner";
import { VaccineRecord } from "../../../../../../type/record";
import { useStudentToken } from "../../../../../../utils/createToken";
import { API_URL } from "../../../../../../utils/config";

type Props = {
    title: string;
    searchPar: string;
    typeModule: boolean;
    userID: number;
};


export const FuturePastBlock: React.FC<Props> = ({ title, searchPar, typeModule, userID }) => {
    const CURRENT_YEAR = new Date().getFullYear();
    const [birthYear, setBirthYear] = useState<number | null>(null);
    const [vaccines, setVaccines] = useState<VaccineRecord[]>([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const [pageNumber, setPageNumber] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    const urlYear = Number(searchParams.get(searchPar)) || CURRENT_YEAR;

    const [selectedYear, setSelectedYear] = useState(urlYear);
    const [selectedAge, setSelectedAge] = useState<number | null>(null);

    const location = useLocation();
    const { getTokenForId } = useStudentToken();
    const navigate = useNavigate();

    useEffect(() => {
        if (userID) {
            console.log('ID: ', userID)
            fetch(`${API_URL}api/patients/year/${userID}`)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Не вдалося отримати дані пацієнта");
                    }
                    return response.json();
                })
                .then((data) => {
                    if (data) {
                        setPageNumber(data.pageNumber); 
                        setBirthYear(data.year);
                        setSelectedAge(urlYear - data.year);
                        setSelectedYear(urlYear);
                    }
                })
                .catch((error) => console.error("Помилка при отриманні даних пацієнта:", error));
        }
    }, [userID]);

    useEffect(() => {
        if (userID && birthYear !== null) {
            setLoading(true);
            
            fetch(`${API_URL}api/records/user/${pageNumber}/year/${selectedYear}`)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Помилка отримання записів");
                    }
                    return response.json();
                })
                .then((data: VaccineRecord[]) => {
                    setVaccines(data);
                })
                .catch((error) => {
                    console.error("Error fetching vaccine records:", error);
                    setVaccines([]);
                })
                .finally(() => setLoading(false));
        }
    }, [userID, selectedYear, birthYear, pageNumber]);

    useEffect(() => {
        if (searchParams.get(searchPar)) {
            const newYear = Number(searchParams.get(searchPar));

            if (!isNaN(newYear) && newYear !== selectedYear) {
                setSelectedYear(newYear);
                if (birthYear !== null) {
                    setSelectedAge(newYear - birthYear);
                }
            }
        }
    }, [searchParams, searchPar, birthYear]);

    const updateSearchParams = (newYear: number) => {
        const params = new URLSearchParams(searchParams);
        params.set(searchPar, newYear.toString());
        setSearchParams(params);
    };

    const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newYear = Number(event.target.value);
        setSelectedYear(newYear);
        if (birthYear !== null) {
            setSelectedAge(newYear - birthYear);
        }
        updateSearchParams(newYear);
    };

    const handleAgeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newAge = Number(event.target.value);
        setSelectedAge(newAge);
        if (birthYear !== null) {
            const newYear = birthYear + newAge;
            setSelectedYear(newYear);
            updateSearchParams(newYear);
        }
    };

    const handleRecordClick = async (id: number, year: string) => {
        const token = await getTokenForId(id);
        if (token) {
            navigate(`/details/${token}${year}`);
        }
    };

    if (birthYear === null || selectedAge === null) {
        return <Spinner />;
    }

    console.log('ID: ', userID)
    console.log('pageNumber: ', pageNumber)
    console.log(birthYear)

    return (
        <div className="future-past-block">
            <h1 className="future-past-block__title">{title}</h1>

            <div className="future-past-block__select__container">
                <div className="future-past-block__select__container--one">
                    <label className="future-past-block__select--title" htmlFor="year">
                        Рік вакцинації:
                    </label>
                    <select
                        className="future-past-block__select"
                        id="year"
                        name="year-type"
                        value={selectedYear}
                        onChange={handleYearChange}
                    >
                        {Array.from({ length: ((birthYear + 100) - CURRENT_YEAR) * Number(!typeModule) + (CURRENT_YEAR - birthYear) * Number(typeModule) + 1 }, (_, index) => (
                            <option key={index} value={birthYear * Number(typeModule) + CURRENT_YEAR * Number(!typeModule) + index}>
                                {birthYear * Number(typeModule) + CURRENT_YEAR * Number(!typeModule) + index}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="future-past-block__select__container--one">
                    <label className="future-past-block__select--title" htmlFor="age">
                        Вік на момент щеплення:
                    </label>
                    <select
                        className="future-past-block__select"
                        id="age"
                        name="age-type"
                        value={selectedAge}
                        onChange={handleAgeChange}
                    >
                        {Array.from({ length: ((birthYear + 100) - CURRENT_YEAR) * Number(!typeModule) + ((CURRENT_YEAR - birthYear) * Number(typeModule)) + 1 }, (_, index) => (
                            <option key={index} value={index + (CURRENT_YEAR - birthYear) * Number(!typeModule)}>
                                {index + (CURRENT_YEAR - birthYear) * Number(!typeModule)}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <ul className="future-past-block__list">
                {loading ? <Spinner /> : (
                    vaccines.length > 0 ? (
                        vaccines.map((vaccine) => (
                            <li
                                className="future-past-block__item future-past-block__link" key={vaccine.id}
                                onClick={() => handleRecordClick(Number(vaccine.id), location.search)}
                            >
                                {vaccine.vaccinationName} - {new Date(vaccine.date).toLocaleDateString()}
                            </li>
                        ))
                    ) : (
                        <li className="future-past-block__item">Даних про щеплення немає</li>
                    )
                )}
            </ul>
        </div>
    );
};
