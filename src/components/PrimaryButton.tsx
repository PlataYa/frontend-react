import React from 'react';

interface Props {
    title: string;
    onPress: () => void;
    disabled?: boolean;
}

const PrimaryButton: React.FC<Props> = ({ title, onPress, disabled = false }) => {
    return (
        <button 
            className={`button ${disabled ? 'disabled' : ''}`} 
            onClick={onPress} 
            disabled={disabled}
        >
            {title}
        </button>
    );
};

export default PrimaryButton;