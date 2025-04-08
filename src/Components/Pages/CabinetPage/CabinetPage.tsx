import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { CalendarBlock } from "../OfficePage/SwitchesBlock/CalendarBlock";
import { VaccineInfo } from "./VaccineInfo";
import './CabinetPage.scss';
import { useVerifyToken } from "../../../utils/useToken";
import { NotFoundPage } from "../NotFoundPage";
import { Spinner } from "../../Spinner";
import { API_URL } from "../../../utils/config";

export const CabinetPage = () => {
    const { idRecord } = useParams<{ idRecord: string }>();
    const { userId, error, isLoading } = useVerifyToken(idRecord);
    const [pageId, setPageId] = useState<string | null>(null);


    const getPageId = async (recordId: string) => {
        try {
            const recordResponse = await fetch(`${API_URL}api/records/${recordId}`);
            const recordData = await recordResponse.json();

            if (!recordData || !recordData.patientId) {
                console.error('Не вдалося отримати patientId');
                return null;
            }

            const patientId = recordData.patientId;

            const patientResponse = await fetch(`${API_URL}api/patients/page-number/${patientId}`);
            const patientData = await patientResponse.json();

            if (!patientData || !patientData.id) {
                console.error('Не вдалося отримати pageid');
                return null;
            }

            return patientData.id;
        } catch (error) {
            console.error('Помилка при отриманні даних:', error);
            return null;
        }
    }

    useEffect(() => {
        const fetchPageId = async () => {
            if (userId && userId !== '0') {
                const resolvedPageId = await getPageId(userId);
                setPageId(resolvedPageId);
            }
            if (userId === '0') {
                const pageID = localStorage.getItem('pageNumber');
                setPageId(pageID);
            }
        };
        fetchPageId();
    }, [userId]);

    if (error) {
        return <NotFoundPage />;
    }

    if (isLoading) {
        return <>
            <p>Перевірка ID запису...</p>
            <Spinner />
        </>;
    }

    if (!userId) {
        return <NotFoundPage />;
    }

    return (
        <div className="cabinet-page page">
            <div className="cabinet-page__section cabinet-page__section--calendar">
                {pageId && (
                    <CalendarBlock
                        btnActive={false}
                        userID={Number(pageId)}
                    />
                )}
            </div>

            <div className="cabinet-page__section cabinet-page__section--info">
                <VaccineInfo recordId={userId ?? ''} />
            </div>
        </div>
    );
};
