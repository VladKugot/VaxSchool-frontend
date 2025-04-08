import React from 'react';
import './ParentsSection.scss';
import { NavLink } from 'react-router-dom';

export const ParentsSection = () => {
    return (
        <div className="parents">
            <h1 className='parents__title'>Корисні ресурси для батьків та вчителів</h1>
            <div className="parents__content">

                <div className="parents__block">
                    <p className="parents__text parents__text--contacts">Контакти для консультацій</p>
                    <NavLink className='parents__img  parents__img--contacts' to={`/contacts`}></NavLink>
                </div>

                <div className="parents__block">
                    <p className="parents__text parents__text--calendar">Рекомендований календар щеплень</p>
                    <NavLink className='parents__img parents__img--calendar' to={`/calendar`}></NavLink>
                </div>

                <div className="parents__block">
                    <p className="parents__text parents__text--info">Інформація про вакцини</p>
                    <NavLink className='parents__img parents__img--info' to={`/vaccines`}></NavLink>
                </div>
            </div>
        </div>
    )
}