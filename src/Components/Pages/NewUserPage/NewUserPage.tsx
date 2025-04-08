import { useState } from "react";
import React from "react";
import "./NewUserPage.scss";
import "../page.scss";
import { Navigate } from "react-router-dom";
import { API_URL } from "../../../utils/config";

type Props = {
    type: string[];
}

export const NewUserPage: React.FC<Props> = ({ type }) => {
    const userType = localStorage.getItem('userType');

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        birthDate: "",
        gender: "",
        address: "",
        familyDoctor: "",
        idUser: "",
        personType: "",
        institution: "",
        phone: "",
        pageNumber: "",
        position: "",
        myClasses: "",
        studentClass: "",
        classTeacher: "",
        parents: "",
        parentsPhone: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.personType === "nurse") {
            formData.myClasses = 'all';
            formData.position = 'Медична сестра';
        }

        const payload = {
            ...formData,
            idUser: Number(formData.idUser),
            myClasses: formData.myClasses ? formData.myClasses.split(",") : null,
            parents: formData.parents ? formData.parents.split(",") : null,
            parentsPhone: formData.parentsPhone ? formData.parentsPhone.split(",") : null,
        };

        try {
            const response = await fetch(`${API_URL}api/patients`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error("Помилка при створенні користувача");

            await fetch(`${API_URL}api/records/user/${formData.pageNumber}/dateOfBirth/${formData.birthDate}/synchronize`, {
                method: "POST",
            });

            alert("Користувач успішно створений!");
            setFormData({
                firstName: "",
                lastName: "",
                birthDate: "",
                gender: "",
                address: "",
                familyDoctor: "",
                idUser: "",
                personType: "",
                institution: "",
                phone: "",
                pageNumber: "",
                position: "",
                myClasses: "",
                studentClass: "",
                classTeacher: "",
                parents: "",
                parentsPhone: "",
            });
        } catch (error) {
            console.error(error);
            alert("Помилка при відправці даних");
        }
    };

    if (!userType || !type.includes(userType)) {
        return <Navigate to="/" />;
    }

    return (
        <div className="new-user-page page">
            <h1 className="page__title">Створення нового користувача</h1>
            <form className="form" onSubmit={handleSubmit}>
                <div className="form__block--big">
                    <div className="form__block">
                        <h2 className="form__title">Особисті дані</h2>
                        <input className="form__input" type="text" name="lastName" placeholder="Прізвище" value={formData.lastName} onChange={handleChange} required />
                        <input className="form__input" type="text" name="firstName" placeholder="Ім'я" value={formData.firstName} onChange={handleChange} required />
                        <input className="form__input" type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} required />
                        <input className="form__input" type="tel" name="phone" placeholder="Телефон" value={formData.phone} onChange={handleChange} required />
                        <div className="form__selects">
                            <select className="form__selects--one" name="gender" value={formData.gender} onChange={handleChange} required>
                                <option value="" disabled hidden>Оберіть Стать</option>
                                <option value="male">Чоловік</option>
                                <option value="female">Жінка</option>
                            </select>

                            <select className="form__selects--one" name="personType" value={formData.personType} onChange={handleChange} required>
                                <option value="" disabled hidden>Оберіть тип особи</option>
                                <option value="teacher">Вчитель</option>
                                <option value="nurse">Медсестра</option>
                                <option value="student">Учень</option>
                            </select>
                        </div>
                    </div>

                    <div className="form__block">
                        <h2 className="form__title">Шкільні дані</h2>
                        <input className="form__input" type="text" name="familyDoctor" placeholder="Сімейний лікар" value={formData.familyDoctor} onChange={handleChange} />
                        <input className="form__input" type="text" name="institution" placeholder="Заклад освіти" value={formData.institution} onChange={handleChange} required />
                        <input className="form__input" type="text" name="pageNumber" placeholder="Номер сторінки" value={formData.pageNumber} onChange={handleChange} />
                        {formData.personType === "teacher" && (
                            <>
                                <input className="form__input" type="text" name="position" placeholder="Посада" value={formData.position} onChange={handleChange} />
                                <input className="form__input" type="text" name="myClasses" placeholder="Класи (через кому)" value={formData.myClasses} onChange={handleChange} />
                                <input className="form__input" type="text" name="address" placeholder="Адреса" value={formData.address} onChange={handleChange} required />
                            </>
                        )}

                        {formData.personType === "student" && (
                            <>
                                <input className="form__input" type="text" name="studentClass" placeholder="Клас" value={formData.studentClass} onChange={handleChange} />
                                <input className="form__input" type="text" name="classTeacher" placeholder="Класний керівник" value={formData.classTeacher} onChange={handleChange} />
                            </>
                        )}

                        {formData.personType === "nurse" && (
                            < input className="form__input" type="text" name="address" placeholder="Адреса" value={formData.address} onChange={handleChange} required />
                        )}
                    </div>
                </div>


                {formData.personType === "student" && (
                    <div className="form__block">
                        <h2 className="form__title">Батьки</h2>
                        <input className="form__input" type="text" name="parents" placeholder="Батьки (через кому)" value={formData.parents} onChange={handleChange} />
                        <input className="form__input" type="text" name="parentsPhone" placeholder="Телефони батьків (через кому)" value={formData.parentsPhone} onChange={handleChange} />
                        <input className="form__input" type="text" name="address" placeholder="Адреса" value={formData.address} onChange={handleChange} required />
                    </div>
                )}

                <button className="form__button" type="submit">Зберегти</button>
            </form>
        </div>
    );
};
