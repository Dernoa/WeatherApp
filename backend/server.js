require('dotenv').config({ path: '../.env' });
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));