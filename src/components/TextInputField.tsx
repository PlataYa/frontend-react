import React, { useState } from 'react';

interface Props {
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    secureTextEntry?: boolean;
    keyboardType?: string;
    autoCapitalize?: string;
    editable?: boolean;
}

const TextInputField: React.FC<Props> = ({
    placeholder,
    value,
    onChangeText,
    secureTextEntry = false,
    keyboardType = 'default',
    autoCapitalize = 'sentences',
    editable = true
}) => {
    const [focused, setFocused] = useState(false);

    const getInputType = () => {
        if (secureTextEntry) return 'password';
        if (keyboardType === 'email-address') return 'email';
        if (keyboardType === 'numeric') return 'number';
        if (keyboardType === 'phone-pad') return 'tel';
        return 'text';
    };

    const getAutoComplete = () => {
        if (keyboardType === 'email-address') return 'email';
        if (secureTextEntry) return 'current-password';
        return 'off';
    };

    return (
        <input
            className={`input ${focused ? 'focused' : ''}`}
            type={getInputType()}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChangeText(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            autoComplete={getAutoComplete()}
            disabled={!editable}
            autoCapitalize={autoCapitalize}
        />
    );
};

export default TextInputField;
