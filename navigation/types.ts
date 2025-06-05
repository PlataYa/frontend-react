export type User = {
    name: string;
    lastname: string;
    mail: string;
    token?: string;
};

export type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    Home: undefined;
    Transfer: undefined;
};
