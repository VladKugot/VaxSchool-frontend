import React, { useState, useEffect } from 'react';
import cn from 'classnames';
import './InformationBlock.scss';
import { useSearchParams } from 'react-router-dom';
import { Spinner } from '../../../../Spinner';
import { Vaccine, VaccineType } from '../../../../../type/vaccination';
import { API_URL } from '../../../../../utils/config';

type Props = {
    format: string;
};

export const InformationBlock: React.FC<Props> = ({ format }) => {

    const [vaccineOptions, setVaccineOptions] = useState<VaccineType[]>([]);
    const [vaccines, setVaccines] = useState<Vaccine[]>([]);
    const [activeVaccineType, setActiveVaccineType] = useState<string>('');
    const [activeVaccine, setActiveVaccine] = useState<Vaccine | null>(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const [isLoadingType, setIsLoadingType] = useState(true);
    const [isLoadingOne, setIsLoadingOne] = useState(false);
    const [closestDate, setClosestDate] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const pageId = localStorage.getItem('pageId');

    useEffect(() => {
        fetch(`${API_URL}api/vaccines/types`)
            .then(response => response.json())
            .then(data => {
                const options = data.map((item: string) => ({
                    value: item.toLowerCase(),
                    name: item
                }));
                setVaccineOptions(options);
                const vaccineTypeFromUrl = searchParams.get('vaccineType') || options[0].value;
                setActiveVaccineType(vaccineTypeFromUrl);
                // Завантаження завершено
                setTimeout(() => {
                    setIsLoadingType(false);
                }, 500);
            });
    }, [searchParams]);

    useEffect(() => {
        if (activeVaccineType) {
            setIsLoadingType(true);
            fetch(`${API_URL}api/vaccines/?type=${activeVaccineType}`)

                .then(response => response.json())
                .then(data => {
                    setVaccines(data);
                });
            setTimeout(() => {
                setIsLoadingType(false);
            }, 500);
        }
        fetchClosestVaccinationDate(activeVaccineType);
    }, [activeVaccineType]);

    useEffect(() => {
        const vaccineIdFromUrl = searchParams.get('vaccine');
        if (vaccineIdFromUrl) {
            const vaccine = vaccines.find(v => v.id === parseInt(vaccineIdFromUrl));
            setActiveVaccine(vaccine || null);
            setIsLoadingOne(true);
            setTimeout(() => {
                setIsLoadingOne(false);
            }, 500);
        }
    }, [vaccines, searchParams]);

    const handleVaccineClick = (vaccineId: number | null) => {
        const selectedVaccine = vaccines.find(v => v.id === vaccineId);
        setIsLoadingOne(true);

        if (selectedVaccine) {
            setActiveVaccine(selectedVaccine);
            setTimeout(() => {
                setIsLoadingOne(false);
            }, 500);

            setSearchParams(prev => {
                const newParams = new URLSearchParams(prev);
                newParams.set('vaccine', String(vaccineId));
                return newParams;
            });
        }
    };

    const handleVaccineTypeChange = (value: string) => {
        setIsLoadingType(true);

        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev);
            newParams.set('vaccineType', value);
            return newParams;
        });

        setActiveVaccineType(value);
        setActiveVaccine(null);

        setTimeout(() => {
            setIsLoadingType(false);
        }, 500);
    };

    const fetchClosestVaccinationDate = async (vaccinationName: string) => {
        try {
            const response = await fetch(`${API_URL}api/vaccines/closest-date/${vaccinationName}/${pageId}`);
            if (response.ok) {
                const data = await response.json();
                setClosestDate(data.closestDate);
                setError(null);
            } else {
                setError('Найближчий запис не знайдено');
                setClosestDate(null);
            }
        } catch (error) {
            setError('Сталася помилка при отриманні даних');
            setClosestDate(null);
        }
    };

    return (
        <div className="vaccination__content">
            <div className="vaccination vaccination--item-1">
                <div className="vaccination__select--block">
                    <p className="vaccination__select--title">Види вакцин:</p>
                    <select
                        className="vaccination__select"
                        id="vaccine-type"
                        name="vaccine-type"
                        value={activeVaccineType}
                        onChange={(e) => handleVaccineTypeChange(e.target.value)}
                    >
                        {vaccineOptions.map((vaccine) => (
                            <option key={vaccine.value} value={vaccine.value}>
                                {vaccine.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="vaccination__list">
                    {isLoadingType ? (
                        <Spinner />
                    ) : (
                        vaccines.map((vaccine) => (
                            <h2
                                key={vaccine.id}
                                className={cn('vaccination__list__item', {
                                    'vaccination__list__item--active': vaccine.id === activeVaccine?.id
                                })}
                                onClick={() => handleVaccineClick(vaccine.id)}
                            >
                                {vaccine.name}
                            </h2>
                        ))
                    )}
                </div>
            </div>

            <div className="vaccination vaccination--item-2">
                <div className="vaccination__information">
                    {isLoadingOne || isLoadingType ? (<Spinner />) : (


                        activeVaccine ? (
                            <>
                                <h3>{activeVaccine.name}</h3>
                                <p>{activeVaccine.description}</p>
                            </>
                        ) : (
                            <p>Оберіть вакцину зі списку</p>
                        ))}
                </div>

                {format === 'normal' && (
                    <div className="vaccination__contact">
                        {isLoadingType ? (<Spinner size={32} />) : (
                            <>  {error ? (
                                    <h2 className="vaccination__contact__date">{error}</h2>)
                                : (
                                    <h2 className="vaccination__contact__date">Планова вакцинація:  {closestDate}</h2>)

                            }

                                <div className="vaccination__contact__btn">Записатися</div>
                            </>
                        )
                        }
                    </div>
                )}
            </div >
        </div >
    );
};
