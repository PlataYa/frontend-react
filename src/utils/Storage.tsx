// utils/Storage.ts
const Storage = {
    setItem: async (key: string, value: string) => {
        try {
            localStorage.setItem(key, value);
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    },

    getItem: async (key: string): Promise<string | null> => {
        try {
            return localStorage.getItem(key);
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return null;
        }
    },

    removeItem: async (key: string) => {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Error removing from localStorage:', error);
        }
    },
};

export default Storage;
