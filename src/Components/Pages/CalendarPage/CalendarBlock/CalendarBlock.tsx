import React, { useState, useEffect } from 'react';
import './CalendarBlock.scss';
import classNames from 'classnames';
import { useNavigate, useLocation } from 'react-router-dom';
import { Spinner } from '../../../Spinner';
import { VaccinationRecord } from '../../../../type/record';
import { months } from '../../../../utils/months';
import { useStudentToken } from '../../../../utils/createToken';
import { API_URL } from '../../../../utils/config';

type StructuredData = {
    [key: string]: VaccinationRecord[];
};

type Props = {
    userId: string;
}

export const CalendarBlock:React.FC<Props> = ({userId}) => {
    const nowYear = new Date().getFullYear();
    const location = useLocation();
    const navigate = useNavigate();

    const urlParams = new URLSearchParams(location.search);
    const initialYear = urlParams.has('year') ? parseInt(urlParams.get('year')!, 10) : nowYear;
    const [statusFilter, setStatusFilter] = useState<string | null>(urlParams.get('status') || null);

    const [selectYear, setSelectYear] = useState(initialYear);
    const [startYear, setStartYear] = useState(nowYear - 3);
    const [vaccinationData, setVaccinationData] = useState<VaccinationRecord[]>([]);
    const [loading, setLoading] = useState(false);
    const yearsToShow = 7;
    const shiftAmount = 7;

    const { getTokenForId } = useStudentToken();

    const handleRecordClick = async (id: number, type: string, year: string) => {
        console.log("year", year)
        const token = await getTokenForId(id);

        if (token && type) {
            if (type === 'completed'){
                navigate(`/details/${token}?last=${year}`);
            } else {
                navigate(`/signup/${token}`);
            }
                
        }
    };

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        params.set('year', selectYear.toString());
        navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    }, [selectYear]);

    const fetchVaccinationData = async (userId: string, year: number) => {
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}api/records/user/${userId}/year/${year}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();

            setTimeout(() => {
                setVaccinationData(data);
            }, 1000);
        } catch (error) {
            console.error('Error fetching vaccination data:', error);
        } finally {
            setTimeout(() => setLoading(false), 1000);
        }
    };

    const handleNext = () => {
        setSelectYear((prev) => {
            const newYear = prev + 1;
            setStartYear((prevStart) =>
                newYear >= prevStart + yearsToShow ? prevStart + shiftAmount : prevStart
            );
            return newYear;
        });
    };

    const handlePrev = () => {
        setSelectYear((prev) => {
            const newYear = prev - 1;
            setStartYear((prevStart) =>
                newYear < prevStart ? prevStart - shiftAmount : prevStart
            );
            return newYear;
        });
    };

    const structuredData: StructuredData = months.reduce((acc, month) => {
        acc[month] = [];
        return acc;
    }, {} as StructuredData);

    vaccinationData.forEach((record) => {
        const recordDate = new Date(record.date);
        const monthName = months[recordDate.getMonth()];
        if (structuredData[monthName]) {
            structuredData[monthName].push(record);
        }
    });

    const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedStatus = event.target.value;
        setStatusFilter(selectedStatus);

        const params = new URLSearchParams(location.search);
        if (selectedStatus) {
            params.set('status', selectedStatus);
        } else {
            params.delete('status');
        }
        navigate(`${location.pathname}?${params.toString()}`);
    };

    const filteredData = vaccinationData.filter((record) => {
        if (statusFilter === '0') return true;
        return record.status === statusFilter;
    });

    useEffect(() => {
        if (userId) {
            setLoading(true);
            setVaccinationData([]);
            fetchVaccinationData(userId, selectYear);
        }
    }, [selectYear, statusFilter, userId]);

    return (
        <div className="calendar-block">
            <div className="calendar-block__title">
                <div className="calendar-block__title__select">
                    <select className="calendar-block__title__select--one">
                        <option value="" disabled selected>Виберіть опцію</option>
                        <option value="1">Опція 1</option>
                        <option value="2">Опція 2</option>
                        <option value="3">Опція 3</option>
                    </select>

                    <select className="calendar-block__title__select--one" value={statusFilter || ''} onChange={handleStatusChange}>
                        <option value="" disabled>Виберіть опцію</option>
                        <option value="completed">Зроблені</option>
                        <option value="overdue">Незроблені</option>
                        <option value="Pending">Майбутні</option>
                        <option value="0">Усі</option>
                    </select>
                </div>

                <div className="years__block">
                    <button className="years years__btn years__btn--left" onClick={handlePrev}></button>
                    {Array.from({ length: yearsToShow }, (_, i) => (
                        <div
                            key={startYear + i}
                            className={classNames("years", { "years--selected": (startYear + i) === selectYear })}
                            onClick={() => setSelectYear(startYear + i)}
                        >
                            {startYear + i}
                        </div>
                    ))}
                    <button className="years years__btn years__btn--right" onClick={handleNext}></button>
                </div>
            </div>

            <div className="calendar-block__main">
                {loading ? (
                    <div className="calendar-block__main__loader"><Spinner /></div>
                ) : (
                    months.map((month) => (
                        <div
                            key={month}
                            className={classNames("calendar-block__block", {
                                "calendar-block__block--empty": filteredData.filter(record => months[new Date(record.date).getMonth()] === month).length === 0
                            })}
                        >
                            <h2 className={classNames('calendar-block__block__title', {
                                'calendar-block__block__title--completed': filteredData.some(record => record.status === 'completed' && months[new Date(record.date).getMonth()] === month),
                                'calendar-block__block__title--future': filteredData.some(record => record.status === 'pending' && months[new Date(record.date).getMonth()] === month),
                                'calendar-block__block__title--not-done': filteredData.some(record => record.status === 'overdue' && months[new Date(record.date).getMonth()] === month)
                            })}>
                                {month}
                            </h2>
                            {filteredData.filter(record => months[new Date(record.date).getMonth()] === month).length > 0 ? (
                                filteredData.filter(record => months[new Date(record.date).getMonth()] === month).map((record) => (
                                    <>
                                        <div className="calendar-block__block__info">
                                            {record.status === 'completed' && <p className='calendar-block__block__info--text'>Вакцинація: <span className='calendar-block__block__info--text--black'>{record.vaccinationName}</span></p>}
                                            {record.status === 'pending' && <p className='calendar-block__block__info--text'>Очікує на запис: <span className='calendar-block__block__info--text--black'>{record.vaccinationName}</span></p>}
                                            {record.status === 'overdue' && <p className='calendar-block__block__info--text'>Пропущено вакцинацію: <span className='calendar-block__block__info--text--black'>{record.vaccinationName}</span></p>}
                                            <p className='calendar-block__block__info--text'>Дата: <span className='calendar-block__block__info--text--black'>{record.date}</span></p>
                                        </div>
                                        <div
                                            className="calendar-block__block__btn"
                                            onClick={() => handleRecordClick(Number(record.id), record.status, String(selectYear))}
                                        >
                                            {record.status === 'completed' ? 'Дізнатися більше' : 'Записатися'}
                                        </div>
                                    </>
                                ))
                            ) : (
                                <div className="calendar-block__block__info">
                                    <p className='calendar-block__block__info--text'>Активних подій немає</p>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
