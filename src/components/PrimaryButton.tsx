import React from 'react';

interface Props {
    id?: string;
    title: string;
    onPress: () => void;
    disabled?: boolean;
}

const PrimaryButton: React.FC<Props> = ({ id, title, onPress, disabled = false }) => {
    return (
        <button
            id={id}
            className={`button ${disabled ? 'disabled' : ''}`}
            onClick={onPress} 
            disabled={disabled}
        >
            {title}
        </button>
    );
};

export default PrimaryButton;
