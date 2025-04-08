import React, { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import './App.scss';
import { Footer } from './Components/Footer';
import { Header } from './Components/Header';
import { MainPage } from './Components/Pages/MainPage';
import { OfficePage } from './Components/Pages/OfficePage';
import { CardPage } from './Components/Pages/CardPage';
import { VaccinePage } from './Components/Pages/VaccinePage';
import { CabinetPage } from './Components/Pages/CabinetPage';
import { CalendarPage } from './Components/Pages/CalendarPage/CalendarPage';
import { NewUserPage } from './Components/Pages/NewUserPage';
import { DeleteUserPage } from './Components/Pages/DeleteUserPage';
import { RegistrationPage } from './Components/Pages/RegistrationPage';
import { NotFoundPage } from './Components/Pages/NotFoundPage';
import { UpdateUserPage } from './Components/Pages/UpdateUserPage';

export const App = () => {

  const [enterActive, setEnterActive] = useState(false)

  return (
    <div className='App'>
      <Header 
        setEnterActive={setEnterActive}
      />
      <main className="page-section">
        <div className="main-container">
          <Routes>
            <Route path="/" element={<MainPage
              setEnterActive={setEnterActive}
              enterActive={enterActive} />}
            />
            <Route path="/page" element={<OfficePage />} />
            <Route path="/home" element={<Navigate to="/" />} />
            <Route path="/vaccines" element={<VaccinePage />} />
            <Route path="/details/:idRecord" element={<CabinetPage />} />
            <Route path="/card/:id" element={<CardPage />} />
            <Route path="/calendar" element={<CalendarPage/>} />
            <Route path="/registration-user" element={<NewUserPage type={['nurse']}/>} />
            <Route path="/delete-user" element={<DeleteUserPage type={['nurse']}/>} />
            <Route path="/update-user" element={<UpdateUserPage type={['nurse']}/>} />
            <Route path="/registration" element={<RegistrationPage/>} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </main>
      <div className="footer__conteiner">
        <Footer />
      </div>
    </div>
  );
}
