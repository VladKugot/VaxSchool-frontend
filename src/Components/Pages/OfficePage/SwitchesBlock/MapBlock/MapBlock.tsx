import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import "./MapBlock.scss";
import L from "leaflet";
import { Hospital } from "../../../../../type/hospital";
import { API_URL } from "../../../../../utils/config";


const customIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/784/784095.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

const customIconUser = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/3308/3308008.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

const DEFAULT_LOCATION: [number, number] = [49.000687, 31.391642];

export const MapBlock = () => {
    const [hospitals, setHospitals] = useState<Hospital[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

    useEffect(() => {
        if (!navigator.geolocation) {
            setError("Геолокація не підтримується вашим браузером");
            setUserLocation(DEFAULT_LOCATION);
            fetchHospitals(DEFAULT_LOCATION);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const location: [number, number] = [latitude, longitude];
                setUserLocation(location);
                fetchHospitals(location);
            },
            () => {
                setError("Не вдалося отримати вашу геолокацію, використовується стандартне місце розташування.");
                setUserLocation(DEFAULT_LOCATION);
                fetchHospitals(DEFAULT_LOCATION);
            }
        );
    }, []);

    const fetchHospitals = (location: [number, number]) => {
        const [lat, lon] = location;

        axios.get<Hospital[]>(`${API_URL}api/hospitalsnearest`, {
            params: { lat, lon }
        })
            .then((response: AxiosResponse<Hospital[]>) => {
                setHospitals(response.data);
                setLoading(false);
            })
            .catch(() => {
                setError("Не вдалося завантажити дані");
                setLoading(false);
            });
    };

    if (!userLocation) return <p></p>;

    return (
        <MapContainer center={userLocation} zoom={13} className="map">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {/* Позначка користувача */}
            <Marker position={userLocation} icon={customIconUser}>
                <Popup>Ваша локація</Popup>
            </Marker>

            {/* Позначки лікарень */}
            {hospitals.map((hospital) => (
                <Marker
                    key={hospital.id}
                    position={[parseFloat(hospital.coordinates_x), parseFloat(hospital.coordinates_y)]}
                    icon={customIcon}
                >
                    <Popup>
                        <strong>{hospital.name}</strong><br />
                        {hospital.address && <><br />Адреса: <strong>{hospital.address}</strong></>}
                        {hospital.phoneNumber && <><br />Телефон: <strong>{hospital.phoneNumber}</strong></>}
                        {hospital.timeTable && <><br />Режим роботи: <strong>{hospital.timeTable}</strong></>}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};
