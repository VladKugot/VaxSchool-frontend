import { CalendarBlock } from "./CalendarBlock";
import './CalendarPage.scss';
import '../page.scss';

export const CalendarPage = () => {

    const userId = localStorage.getItem('userId');


    return (
        <div className="calendar-page page">
            {userId != null ? (
                <>
                    <h1 className="page__title">Вітаємо, Ваш персональний календар щеплень </h1>
                    <CalendarBlock userId={userId} />
                </>
            ) : (
                <>
                    <h1 className="page__title">Обов'язковий календар щеплень.<br/>Авторизуйтеся для більших можливостей.</h1>
                    <CalendarBlock userId={'0'} />
                </>
            )
            }
        </div>
    );
}