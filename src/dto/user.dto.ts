export interface RegisterRequestDTO {
    name: string;
    lastname: string;
    mail: string;
    password: string;
    dayOfBirth?: string | null;
}

export interface RegisterResponseDTO {
    name: string;
    lastname: string;
    mail: string;
    token: string | null;
    cvu: number | null;
}

export interface LoginRequestDTO {
    mail: string;
    password: string;
}

export interface LoginResponseDTO {
    name: string;
    lastname: string;
    mail: string;
    token: string;
    cvu: number | null;
}

export interface UserResponseDTO {
    id: number;
    name: string;
    lastname: string;
    mail: string;
}
