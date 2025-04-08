import './Footer.scss';
import { NavLink } from 'react-router-dom';

export const Footer = () => {

  return (
    <div className='footer'>
      <NavLink className='footer__logo' to={`/`}></NavLink>
      <div className="footer__content">
        <ul className='footer__nav'>
          <li className='nav__obj'>
            <NavLink className='nav__link' to={`/`}>
              Github
            </NavLink>
          </li>
          <li className='nav__obj'>
            <NavLink className='nav__link' to={`/`}>
              Contacts
            </NavLink>
          </li>
          <li className='nav__obj'>
            <NavLink className='nav__link' to={`/`}>
              Rights
            </NavLink>
          </li>
        </ul>
        <div className="back-top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <p className="back-top__title">Повернутися</p>
          <div className='back-top__img' />
        </div>
      </div>
    </div>
  );
}