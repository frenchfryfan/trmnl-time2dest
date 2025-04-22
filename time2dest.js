// Simple Express server that returns drive time from Home to Work for TRMNL

import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Replace with your actual addresses or lat/lng coordinates
const HOME = '123 Main St, San Francisco, CA';
const WORK = '456 Mission St, San Francisco, CA';
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

app.get('/drive-time', async (req, res) => {
  try {
    const url = 'https://maps.googleapis.com/maps/api/directions/json';
    const params = {
      origin: HOME,
      destination: WORK,
      departure_time: 'now', // for real-time traffic
      key: GOOGLE_API_KEY
    };

    const response = await axios.get(url, { params });

    if (
      response.data.routes.length === 0 ||
      response.data.routes[0].legs.length === 0
    ) {
      return res.status(404).json({ error: 'No route found' });
    }

    const duration = response.data.routes[0].legs[0].duration.text;
    return res.json({ time: duration });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Could not fetch drive time' });
  }
});

app.get('/', (req, res) => {
  res.send('Drive Time API for TRMNL is running.');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
