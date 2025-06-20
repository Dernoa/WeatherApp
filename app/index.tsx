import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TextInput, Button } from 'react-native';
import { fetchWeather } from './services/weatherApi';
import type { WeatherData } from './types/weatherDataTypes';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function Index() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [city, setCity] = useState('');

  useEffect(() => {
    fetchWeather('Minsk')
      .then(data => {
        setWeather(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleSearch = () => {
    setLoading(true);
    setError(null);
    fetchWeather(city)
      .then(data => {
        setWeather(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Загрузка...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>Ошибка: {error}</Text>
        <Button title="Назад" onPress={() => setError(null)} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.center}>
        <TextInput
          placeholder='Введите город'
          value={city}
          onChangeText={setCity}
          style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingHorizontal: 10, width: 200 }}
        />
        <Button
          title="Поиск"
          onPress={handleSearch}
        />
        {weather && (
          <>
            <Text style={styles.city}>{weather.name}</Text>
            <Text>Температура: {weather.main.temp}°C</Text>
            <Text>Ощущается как: {weather.main.feels_like}°C</Text>
            <Text>Погода: {weather.weather[0].description}</Text>
            <Text>Ветер: {weather.wind.speed} м/с</Text>
            <Text>Влажность: {weather.main.humidity}%</Text>
          </>
        )}
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  city: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
});