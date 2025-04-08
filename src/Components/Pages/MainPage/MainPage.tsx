import React, { useState } from 'react';
import './MainPage.scss';
import { NavLink } from 'react-router-dom';
import { ParentsSection } from './ParentsSection';
import { InfoBlock } from './InfoBlock';
import { EnterBlock } from './EnterBlock';

interface Props {
  setEnterActive: React.Dispatch<React.SetStateAction<boolean>>;
  enterActive: boolean;
}

export const MainPage: React.FC<Props> = ({ setEnterActive, enterActive }) => {

  const handleEnterClick = () => {
    setEnterActive(true);
  }

  return (
    <div className="content">
      <section className='section__main'>
        <div className="main">
          <div className="main__content">
            <h1 className='main__title'>Вакцинація - це просто!</h1>
            <h2 className='main__h2'>Турбота про здоров’я починається з маленького кроку</h2>
            {enterActive === false ?
              <div className="main__block block">
                <p className='block__btn block__btn--name'
                  onClick={() => handleEnterClick()}
                >Увійти
                </p>
                <p className="block__title">Ще не маєте облікового запису?</p>

                <NavLink className='block__title' to={`/registration`}>
                  <p className='block__title block__title--reg'>Зареєструватися</p>
                </NavLink>

              </div> : <div className="main__block block">
                <EnterBlock />
              </div>
            }
          </div>
          <div className="main__photo"></div>
        </div>
      </section>

      <section className='section__info'>
        <h2 className='section__info__title'>Вакцинація — це турбота про здоров’я дитини та безпеку всього колективу. Щеплення захищають від небезпечних хвороб і допомагають запобігти їхньому поширенню. Дотримуючись календаря щеплень, ви забезпечуєте надійний захист своїй дитині та оточуючим.</h2>
      </section>

      <section className='section'>
        <ParentsSection />

        <div className='section__small'>
          <InfoBlock
            title='Актуальні новини та рекомендації'
            start={false}
          />
        </div>
        <div className="section__small">
          <InfoBlock
            title='Відповіді на питання'
            start={true}
          />
        </div>
      </section>
    </div>
  );
} 