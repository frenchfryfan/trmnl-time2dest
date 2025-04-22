import axios from 'axios/dist/node/axios.cjs';

//const HOME = '123 Main St, San Francisco, CA';
//const WORK = '456 Mission St, San Francisco, CA';

export default async function handler(req, res) {
  try {
    const url = 'https://maps.googleapis.com/maps/api/directions/json';
    const params = {
      origin: process.env.HOME_ADDRESS,
      destination: process.env.WORK_ADDRESS,
      departure_time: 'now',
      key: process.env.GOOGLE_API_KEY
    };

    const response = await axios.get(url, { params });

    if (
      response.data.routes.length === 0 ||
      response.data.routes[0].legs.length === 0
    ) {
      return res.status(404).json({ error: 'No route found' });
    }

    const duration = response.data.routes[0].legs[0].duration.text;
    return res.status(200).json({ time: duration });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Could not fetch drive time' });
  }
}
