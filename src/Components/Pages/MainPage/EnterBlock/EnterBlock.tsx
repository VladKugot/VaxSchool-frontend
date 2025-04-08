import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './EnterBlock.scss';
import { API_URL } from '../../../../utils/config';

export const EnterBlock = () => {
  const [login, setLogin] = useState('');
  const [inputPassword, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!login || !inputPassword) {
      setErrorMessage('Будь ласка, введіть логін і пароль');
      return;
    }

    try {
      const response = await fetch(`${API_URL}api/users`);
      const users = await response.json();

      const user = users.find(
        (user: { login: string }) => user.login === login
      );

      if (!user) {
        setErrorMessage('Невірний логін або пароль');
        return;
      }

      console.log('token', user.password);
      
      const verifyResponse = await fetch(
        `${API_URL}api/patients/verify-token/${user.password}`
      );
      const result = await verifyResponse.json();

      if (result.id === inputPassword) {
        if (result.token) {
          const passwordUpdateResponse = await fetch(
            `${API_URL}api/users/${user.id}/password/${result.token}`,
            {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );

          if (!passwordUpdateResponse.ok) {
            setErrorMessage('Не вдалося оновити пароль. Спробуйте пізніше.');
            return;
          }
        }

        const patientResponse = await fetch(
          `${API_URL}api/patients/user/${user.id}`
        );
        const patientData = await patientResponse.json();

        localStorage.setItem('userId', patientData.userId);
        localStorage.setItem('userType', patientData.personType);
        localStorage.setItem('pageNumber', patientData.pageNumber);

        navigate('/page');
        window.location.reload();
      } else {
        setErrorMessage('Невірний пароль. Спробуйте пізніше.');
      }
    } catch (error) {
      console.error('Помилка при перевірці:', error);
      setErrorMessage('Сталася помилка при перевірці. Спробуйте пізніше.');
    }
  };

  return (
    <div className="enter-block">
      <p className="enter-block__title">Введіть логін:</p>
      <input
        type="text"
        className="enter-block__input"
        value={login}
        onChange={(e) => setLogin(e.target.value)}
      />

      <p className="enter-block__title">Введіть пароль:</p>
      <input
        type="password"
        className="enter-block__input"
        value={inputPassword}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="enter-block__btn" onClick={handleLogin}>
        Вхід
      </button>

      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};
