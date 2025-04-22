import axios from 'axios/dist/node/axios.cjs';

export default async function handler(req, res) {
  try {
    const directionsUrl = 'https://maps.googleapis.com/maps/api/directions/json';
    const staticMapBaseUrl = 'https://maps.googleapis.com/maps/api/staticmap';
    
    const params = {
      origin: process.env.HOME_ADDRESS,
      destination: process.env.WORK_ADDRESS,
      departure_time: 'now',
      key: process.env.GOOGLE_API_KEY
    };

    if (!params.key) {
      console.error('Missing GOOGLE_API_KEY');
      return res.status(500).json({ error: 'GOOGLE_API_KEY is missing' });
    }

   const response = await axios.get(directionsUrl, { params });

    if (
      response.data.routes.length === 0 ||
      response.data.routes[0].legs.length === 0
    ) {
      return res.status(404).json({ error: 'No route found' });
    }

     const route = response.data.routes[0];
    const duration = route.legs[0].duration.text;
    const polyline = route.overview_polyline?.points;

    const mapUrl = `${staticMapBaseUrl}?size=400x480&scale=2&path=enc:${polyline}&markers=color:green|${process.env.HOME_ADDRESS}&markers=color:red|${process.env.WORK_ADDRESS}&key=${params.key}`;

    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');

     return res.status(200).json({
      time: duration,
      staticMapUrl: mapUrl
    });
  } catch (err) {
    console.error('Drive time/map error:', err.response?.data || err.message || err);
    return res.status(500).json({ error: 'Could not fetch drive time or map' });
  }
}
