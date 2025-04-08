import React from "react";
import "./VaccinePage.scss";
import { InformationBlock } from "../OfficePage/SwitchesBlock/InformationBlock/InformationBlock";

export const VaccinePage = () => {

    return (
        <div className="vaccine-page page">
            <h1 className="page__title">Доступні вакцини України</h1>
            <div className="vaccine-page__container">
                <InformationBlock format={'shoot'} />
            </div>
        </div>
    );
} 