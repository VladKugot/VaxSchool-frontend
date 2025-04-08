import React from 'react';
import './Spinner.scss';

interface SpinnerProps {
    size?: number;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 40 }) => {
    return (
        <div className="spinner__container">
            <div className="spinner" style={{ width: size, height: size }}></div>
        </div>
    );
};
