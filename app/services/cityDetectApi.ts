import type { ReverseGeocodeData } from '../types/reverseGeocodeDataTypes';
import axios from 'axios';

const BASE_URL = 'http://192.168.1.8:3001/reverse-geocode';
export const detectCity = async (lat: number, lng: number): Promise<ReverseGeocodeData> => {
    try {
        const response = await axios.get(BASE_URL, {
            params: { lat, lng },
        });
        return response.data;
    } catch (error) {
        let errorMessage = 'Unknown error';
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        throw new Error('Error detecting city: ' + errorMessage);
    }
};