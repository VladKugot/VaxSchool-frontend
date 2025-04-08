import React, { useEffect, useState } from 'react';
import './CalendarBlock.scss';
import { FuturePastBlock } from './FuturePastBlock/FuturePastBlock';
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';
import { useStudentToken } from '../../../../../utils/createToken';

type Props = {
    btnActive: boolean;
    userID: number;
};

export const CalendarBlock: React.FC<Props> = ({ btnActive, userID }) => {
    const [isTablet, setIsTablet] = useState(false);
    const { getTokenForId } = useStudentToken();
    const navigate = useNavigate();


    const checkScreenSize = () => {
        const width = window.innerWidth;
        if (width >= 640 && width <= 1199) {
            setIsTablet(true);
        } else {
            setIsTablet(false);
        }
    };

    const handleRecordClick = async (id: number) => {
        const token = await getTokenForId(id);
        if (token) {
            navigate(`/details/${token}`);
        }
    };


    useEffect(() => {
        checkScreenSize();
        window.addEventListener("resize", checkScreenSize);

        return () => {
            window.removeEventListener("resize", checkScreenSize);
        };
    }, []);

    return (
        <div className="calendar">
            {isTablet ? (
                <>
                    <div className={classNames("calendar__content", { "calendar__content--vaccine-info": !btnActive })}>
                        <FuturePastBlock userID={Number(userID)} typeModule={true} searchPar='last' title="Ваші зробленні щеплення:" />
                        <FuturePastBlock userID={Number(userID)} typeModule={false} searchPar='future' title="Майбутні щеплення:" />
                    </div>

                    {btnActive &&
                        <div
                            className="calendar__btn calendar__btn__link"
                            onClick={() => handleRecordClick(Number(0))}
                        >
                            Дізнатися більше
                        </div>
                    }

                </>
            ) : (
                btnActive ?
                    <>
                        <FuturePastBlock userID={Number(userID)} typeModule={true} searchPar='last' title="Ваші зробленні щеплення:" />

                        {btnActive &&
                            <div
                                className="calendar__btn calendar__btn__link"
                                onClick={() => handleRecordClick(Number(0))}
                            >
                                Дізнатися більше
                            </div>
                        }

                        <FuturePastBlock userID={Number(userID)} typeModule={false} searchPar='future' title="Майбутні щеплення:" />
                    </>
                    :
                    <div className={classNames({ "calendar__content--vaccine-info": !btnActive })}>

                        <FuturePastBlock userID={Number(userID)} typeModule={true} searchPar='last' title="Ваші зробленні щеплення:" />

                        {btnActive &&
                            <div
                                className="calendar__btn calendar__btn__link"
                                onClick={() => handleRecordClick(Number(0))}
                            >
                                Дізнатися більше
                            </div>
                        }

                        <FuturePastBlock userID={Number(userID)} typeModule={false} searchPar='future' title="Майбутні щеплення:" />
                    </div>
            )
            }
        </div >
    );
};
