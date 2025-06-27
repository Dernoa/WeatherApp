require('dotenv').config({ path: '../.env' });
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

const opencage = require('opencage-api-client');

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const OPENCAGE_API_KEY = process.env.OPENCAGE_API_KEY;

if (!OPENCAGE_API_KEY) {
    console.error('ERROR: OPENCAGE_API_KEY is not set!');
    process.exit(1);
}

if (!OPENWEATHER_API_KEY) {
    console.error('ERROR: OPENWEATHER_API_KEY is not set!');
    process.exit(1);
}

app.get('/weather', async (req, res) => {
    const city = req.query.city;
    if (!city) return res.status(400).json({ error: 'City is required' });

    try {
        const response = await axios.get(
            'https://api.openweathermap.org/data/2.5/weather',
            {
                params: {
                    q: city,
                    appid: OPENWEATHER_API_KEY,
                    units: 'metric',
                },
            }
        );
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch weather' });
    }
});

app.get('/reverse-geocode', async (req, res) => {
    const { lat, lng } = req.query;
    if (!lat || !lng) return res.status(400).json({ error: 'lat and lng are required' });

    try {
        const response = await opencage.geocode({
            key: OPENCAGE_API_KEY,
            q: `${lat},${lng}`,
        });
        if (response.results.length === 0) {
            return res.status(404).json({ error: 'No results found' });
        }
        // Можно вернуть только город:
        const city = response.results[0].components.city ||
                     response.results[0].components.town ||
                     response.results[0].components.village ||
                     response.results[0].components.hamlet ||
                     'Unknown city';
        res.json({ city });
    } catch (error) {
        res.status(500).json({ error: 'Failed to reverse geocode' });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));