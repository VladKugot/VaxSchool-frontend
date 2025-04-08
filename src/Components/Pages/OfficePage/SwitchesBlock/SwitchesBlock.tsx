import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { MapBlock } from "./MapBlock";
import "./SwitchesBlock.scss";
import classNames from "classnames";
import { Spinner } from "../../../Spinner";
import { CalendarBlock } from "./CalendarBlock";
import { InformationBlock } from "./InformationBlock/InformationBlock";

export const SwitchesBlock = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeParam = Number(searchParams.get("tab")) || null;
    const [switchIsActive, setSwitchIsActive] = useState(activeParam);
    const [isLoading, setIsLoading] = useState(false);
    const userId = localStorage.getItem('userId') || '';

    useEffect(() => {
        setSwitchIsActive(activeParam);
    }, [activeParam]);

    const handleSwitch = (switchId: number) => {
        if (switchIsActive !== switchId) {
            setIsLoading(true);
            setTimeout(() => {
                const newParams = new URLSearchParams(searchParams.toString());
                newParams.set("tab", switchId.toString());
                setSearchParams(newParams);
                setIsLoading(false);
            }, 500);
        }
    };

    const renderContent = () => {
        if (isLoading) {
            return <Spinner />;
        }

        switch (switchIsActive) {
            case 1:
                return <CalendarBlock userID={Number(userId)} btnActive={true} />;
            case 2:
                return <MapBlock />;
            case 3:
                return <InformationBlock format={'normal'} />;
            default:
                return null;
        }
    };

    return (
        <>
            <div className="switch__container">
                <div
                    className={classNames("switch", { "switch--active": switchIsActive === 1 })}
                    onClick={() => handleSwitch(1)}
                >
                    <div className="switch__title">Календар щеплень</div>
                    <div className="switch__icon switch__icon--1"></div>
                </div>
                <div
                    className={classNames("switch", { "switch--active": switchIsActive === 2 })}
                    onClick={() => handleSwitch(2)}
                >
                    <div className="switch__title">Центри вакцинації</div>
                    <div className="switch__icon switch__icon--2"></div>
                </div>
                <div
                    className={classNames("switch", { "switch--active": switchIsActive === 3 })}
                    onClick={() => handleSwitch(3)}
                >
                    <div className="switch__title">Інформація про вакцину</div>
                    <div className="switch__icon switch__icon--3"></div>
                </div>
            </div>
            <div className="switch__content-container">
                {renderContent()}
            </div>
        </>
    );
};
