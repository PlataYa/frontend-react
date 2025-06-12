export const handleTransferError = (errorMessage: string): string => {
    if (errorMessage.includes("cannot be the same")) {
        return "No puedes transferir dinero a tu propia cuenta";
    } else if (errorMessage.includes("insufficient funds")) {
        return "Fondos insuficientes. Verifica tu saldo";
    } else if (errorMessage.includes("amount must be positive")) {
        return "El monto debe ser mayor a 0";
    } else if (errorMessage.includes("Payer wallet") && errorMessage.includes("not found")) {
        return "Tu billetera no fue encontrada";
    } else if (errorMessage.includes("Payee wallet") && errorMessage.includes("not found")) {
        return "La billetera de destino no existe";
    } else if (errorMessage.includes("External service error")) {
        return "Servicio temporalmente no disponible";
    } else {
        return "Error en la transferencia. Intenta nuevamente";
    }
};

export const handleWithdrawalError = (errorMessage: string): string => {
    if (errorMessage.includes("amount must be positive")) {
        return "El monto debe ser mayor a 0";
    } else if (errorMessage.includes("insufficient funds")) {
        return "Fondos insuficientes para el retiro";
    } else if (errorMessage.includes("Internal wallet") && errorMessage.includes("not found")) {
        return "Tu billetera no fue encontrada";
    } else if (errorMessage.includes("External CVU") && errorMessage.includes("not found")) {
        return "CVU de destino no encontrado";
    } else if (errorMessage.includes("Invalid deposit request")) {
        return "CVU de destino inválido";
    } else if (errorMessage.includes("External deposit failed")) {
        return "Error en el proceso de retiro";
    } else if (errorMessage.includes("Failed to connect")) {
        return "Conexión con banco externo fallida";
    } else if (errorMessage.includes("External service error")) {
        return "Servicio de retiros temporalmente no disponible";
    } else {
        return "Error en el retiro. Intenta nuevamente";
    }
};

export const validateTransferForm = (payerCvu: number, payeeCvu: number, amount: number): string[] => {
    const errors: string[] = [];
    
    if (!payerCvu || payerCvu.toString().length !== 11) {
        errors.push("CVU de origen debe tener 11 dígitos");
    }
    
    if (!payeeCvu || payeeCvu.toString().length !== 11) {
        errors.push("CVU de destino debe tener 11 dígitos");
    }
    
    if (payerCvu === payeeCvu) {
        errors.push("No puedes transferir a tu propia cuenta");
    }
    
    if (!amount || amount <= 0) {
        errors.push("El monto debe ser mayor a 0");
    }
    
    if (amount > 999999) {
        errors.push("El monto máximo es $999,999");
    }
    
    return errors;
}; 