import { WeatherData } from '../types/weatherDataTypes';
import axios from 'axios';

// Указывайте адрес вашего backend-сервера:
const BASE_URL = 'http://192.168.1.8:3001/weather';

export const fetchWeather = async (city: string): Promise<WeatherData> => {
    try {
        const response = await axios.get(BASE_URL, {
            params: { city },
        });
        return response.data;
    } catch (error) {
        let errorMessage = 'Unknown error';
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        throw new Error('Error fetching weather data: ' + errorMessage);
    }
};