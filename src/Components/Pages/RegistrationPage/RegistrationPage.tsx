import React, { useState } from "react";
import "./RegistrationPage.scss";
import "../page.scss";
import { useStudentToken } from "../../../utils/createToken";
import { API_URL } from "../../../utils/config";

export const RegistrationPage = () => {
    const [formData, setFormData] = useState({
        lastName: "",
        phone: "",
        login: "",
        password: "",
    });

    const { getTokenForId } = useStudentToken();

    const [isAdditionalFieldsVisible, setIsAdditionalFieldsVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.lastName || !formData.phone) {
            setErrorMessage("Прізвище та телефон обов'язкові для заповнення");
            return;
        }

        try {
            const patientsResponse = await fetch(`${API_URL}api/patients`);
            if (!patientsResponse.ok) {
                throw new Error("Помилка при отриманні списку пацієнтів");
            }

            const patients = await patientsResponse.json();
            const normalizedPhone = formData.phone.replace(/\D/g, "");
            const normalizedLastName = formData.lastName.trim().toLowerCase();

            const existingPatient = patients.find((p: any) => {
                const dbPhone = String(p.phone).replace(/\D/g, "");
                const dbLastName = String(p.lastName).trim().toLowerCase();
                return dbLastName === normalizedLastName && dbPhone === normalizedPhone;
            });

            if (!existingPatient) {
                setErrorMessage("Пацієнта з таким прізвищем чи телефоном не знайдено!");
                return;
            }

            if (existingPatient.idUser) {
                setErrorMessage("Пацієнта з таким прізвищем і телефоном уже зареєстровано!");
                return;
            }

            setIsAdditionalFieldsVisible(true);
            setErrorMessage(""); // clear error before next steps

            // якщо вже показані додаткові поля, виконуємо реєстрацію користувача
            if (formData.login && formData.password) {
                if (formData.password.length < 6) {
                    setErrorMessage("Пароль має містити щонайменше 6 символів");
                    return;
                }

                const passwordToken = await getTokenForId(formData.password);
                console.log("PASSWORD__TOKEN: ",passwordToken, formData.password);

                const userResponse = await fetch(`${API_URL}api/users`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        login: formData.login,
                        password: passwordToken,
                        isActive: true,
                    }),
                });

                console.log(userResponse)

                if (!userResponse.ok) {
                    const errorData = await userResponse.json();
                    throw new Error(errorData.message || "Помилка при створенні користувача");
                }

                const newUser = await userResponse.json();

                const updatePatientResponse = await fetch(
                    `${API_URL}api/patients/${existingPatient.id}`,
                    {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ idUser: newUser.id }),
                    }
                );

                if (!updatePatientResponse.ok) {
                    throw new Error("Помилка при оновленні пацієнта");
                }

                alert("Користувач успішно створений та прив'язаний до пацієнта!");

                setFormData({
                    lastName: "",
                    phone: "",
                    login: "",
                    password: "",
                });
                setIsAdditionalFieldsVisible(false);
                setErrorMessage("");
            }
        } catch (error: any) {
            console.error(error);
            setErrorMessage(error.message || "Сталася помилка");
        }
    };

    return (
        <div className="registration-page page">
            <h1 className="page__title">Реєстрація нового користувача</h1>
            <form className="registration-page__form" onSubmit={handleSubmit}>
                <div className="registration-page__form__conteiner">
                    <div className="registration-page__form__block">
                        <input
                            className="registration-page__input"
                            type="text"
                            name="lastName"
                            placeholder="Прізвище"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                        />
                        <input
                            className="registration-page__input"
                            type="tel"
                            name="phone"
                            placeholder="Телефон"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {isAdditionalFieldsVisible && (
                        <div className="registration-page__form__block">
                            <input
                                className="registration-page__input"
                                type="text"
                                name="login"
                                placeholder="Логін"
                                value={formData.login}
                                onChange={handleChange}
                                required
                            />
                            <input
                                className="registration-page__input"
                                type="password"
                                name="password"
                                placeholder="Пароль"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    )}
                </div>

                <div className="registration-page__button__conteiner">
                    <button className="registration-page__button" type="submit">Зареєструватися</button>
                    {errorMessage && <div className="registration-page__error-message">{errorMessage}</div>}
                </div>
            </form>
        </div>
    );
};
