import { Link } from 'react-router-dom';
import '../page.scss';
import './NotFoundPage.scss'

export const NotFoundPage = () => {
    return (
        <div className="not-found-page page">
            <div className="not-found-page__container">
                <h1 className='page__title'></h1>
                <p>На жаль, такої сторінки не існує.</p>
                <Link className='not-found-page__btn' to="/">Повернутися на головну</Link>
            </div>
        </div>
    );
}