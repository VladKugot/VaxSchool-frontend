import React, { useEffect, useState } from 'react';
import './Header.scss';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useStudentToken } from '../../utils/createToken';
import { API_URL } from '../../utils/config';

interface Props {
  setEnterActive: (active: boolean) => void;
}

export const Header: React.FC<Props> = ({ setEnterActive }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [userName, setUserName] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const { getTokenForId } = useStudentToken();

  const handleUserClick = async (id: number) => {
    const token = await getTokenForId(id);
    if (token) {
      navigate(`/card/${token}`);
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const updateUserData = () => {
      const userID = localStorage.getItem('userId');
      setUserId(userID);

      if (userID) {
        fetch(`${API_URL}api/patients/${userID}`)
          .then(response => response.json())
          .then(data => {
            setUserName(`${data.firstName} ${data.lastName}`);
          })
          .catch(() => {
            setUserName(null);
          });
      } else {
        setUserName(null);
      }
    };

    updateUserData();

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'userId') {
        updateUserData();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [])

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('pageNumber');
    localStorage.removeItem('userType');
    setUserName(null);

    navigate('/');
    window.location.reload();
  };

  const pageNumber = localStorage.getItem('pageNumber');
  console.log(pageNumber);

  return (

    <div className="header">
      <div className="header__nav">
        <NavLink className='nav__link header__logo' to={`/`}></NavLink>
        {windowWidth > 639 && (
          <ul className='nav'>
            <li className='nav__obj'>
              <NavLink className='nav__link' to={`/calendar`}>Календар</NavLink>
            </li>
            <li className='nav__obj'>
              <NavLink className='nav__link' to={`/vaccines`}>Вакцини</NavLink>
            </li>
            <li className='nav__obj'>
              <NavLink className='nav__link' to={`/contacts`}>Контакти</NavLink>
            </li>
          </ul>
        )}
      </div>

      <div className="swithes__main">

        <div className="swithes__block swithes__block--theme">
          <button className='button button--language'></button>
          <button className='button button--them' onClick={toggleTheme}></button>
        </div>

        <div className="swithes__block">
          {userId ? (
            <>
              <NavLink to={`/page`}>
                <div className="button button--page"></div>
              </NavLink>

              <div className='button__block'  onClick={() => handleUserClick(Number(pageNumber))}>
                <div className="button button--user"></div>
                <div className="button__block--text">{userName}</div>
              </div>

              <NavLink className='button button--exit' to={`/`} onClick={handleLogout}></NavLink>
            </>
          ) : (

            <NavLink className='button__block' to={`/`} onClick={() => setEnterActive(true)}>
              <div className="button button--user"></div>
              <div className="button__block--text">Увійти</div>
            </NavLink>

          )}
        </div>

      </div>
    </div>
  );
};
