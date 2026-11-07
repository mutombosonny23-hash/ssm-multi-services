import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const app = express();
const port = Number(process.env.PORT || 3001);
const environment = process.env.AMADEUS_ENV === 'production' ? 'production' : 'test';
const apiBase = environment === 'production' ? 'https://api.amadeus.com' : 'https://test.api.amadeus.com';
let cachedToken = null;
let tokenExpiresAt = 0;
app.use(cors({ origin: process.env.CORS_ORIGIN || true }));
app.use(express.json({ limit: '20kb' }));
function credentialsConfigured() { return Boolean(process.env.AMADEUS_CLIENT_ID && process.env.AMADEUS_CLIENT_SECRET); }
async function getAccessToken() {
  if (cachedToken && Date.now() < tokenExpiresAt - 60_000) return cachedToken;
  const body = new URLSearchParams({ grant_type: 'client_credentials', client_id: process.env.AMADEUS_CLIENT_ID, client_secret: process.env.AMADEUS_CLIENT_SECRET });
  const response = await fetch(`${apiBase}/v1/security/oauth2/token`, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body, signal: AbortSignal.timeout(12_000) });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.access_token) { const error = new Error(data.error_description || 'Impossible de se connecter au fournisseur de vols.'); error.status = response.status === 401 ? 502 : 503; throw error; }
  cachedToken = data.access_token; tokenExpiresAt = Date.now() + Number(data.expires_in || 1800) * 1000; return cachedToken;
}
app.get('/api/flights/status', (_req, res) => res.json({ configured: credentialsConfigured(), environment, provider: 'Amadeus' }));
app.get('/api/flights/search', async (req, res) => {
  const { origin, destination, departureDate, returnDate, adults = '1', children = '0', currencyCode = 'EUR', nonStop = 'false' } = req.query;
  const iata = /^[A-Z]{3}$/;
  if (!iata.test(String(origin || '').toUpperCase()) || !iata.test(String(destination || '').toUpperCase())) return res.status(400).json({ error: 'Saisissez des codes IATA valides de 3 lettres (ex. CDG, DSS).', code: 'INVALID_AIRPORT' });
  if (String(origin).toUpperCase() === String(destination).toUpperCase()) return res.status(400).json({ error: 'Le départ et la destination doivent être différents.', code: 'SAME_AIRPORT' });
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(departureDate || '')) || Number.isNaN(Date.parse(`${departureDate}T00:00:00Z`))) return res.status(400).json({ error: 'Choisissez une date de départ valide.', code: 'INVALID_DATE' });
  if (returnDate && (!/^\d{4}-\d{2}-\d{2}$/.test(String(returnDate)) || Date.parse(`${returnDate}T00:00:00Z`) < Date.parse(`${departureDate}T00:00:00Z`))) return res.status(400).json({ error: 'La date de retour doit être valide et après le départ.', code: 'INVALID_RETURN_DATE' });
  const adultCount = Number(adults); const childCount = Number(children);
  if (!Number.isInteger(adultCount) || adultCount < 1 || adultCount > 9 || !Number.isInteger(childCount) || childCount < 0 || childCount > 8 || adultCount + childCount > 9) return res.status(400).json({ error: 'Choisissez au moins un adulte et au maximum 9 voyageurs au total.', code: 'INVALID_PASSENGERS' });
  if (!/^[A-Z]{3}$/.test(String(currencyCode))) return res.status(400).json({ error: 'Devise invalide.', code: 'INVALID_CURRENCY' });
  if (!credentialsConfigured()) return res.status(503).json({ error: 'API non configurée. Ajoutez vos identifiants Amadeus dans le fichier .env du serveur.', code: 'PROVIDER_NOT_CONFIGURED' });
  const params = new URLSearchParams({ originLocationCode: String(origin).toUpperCase(), destinationLocationCode: String(destination).toUpperCase(), departureDate: String(departureDate), adults: String(adultCount), currencyCode: String(currencyCode), max: '20' });
  if (childCount) params.set('children', String(childCount));
  if (returnDate) params.set('returnDate', String(returnDate));
  if (nonStop === 'true') params.set('nonStop', 'true');
  try {
    const token = await getAccessToken();
    const response = await fetch(`${apiBase}/v2/shopping/flight-offers?${params}`, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }, signal: AbortSignal.timeout(20_000) });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) { const providerMessage = payload.errors?.[0]?.detail || payload.errors?.[0]?.title; return res.status(response.status === 400 ? 422 : 502).json({ error: providerMessage || 'Le fournisseur n’a pas pu répondre à la recherche. Réessayez plus tard.', code: 'FLIGHT_PROVIDER_ERROR' }); }
    res.json({ provider: 'Amadeus', environment, currency: payload.meta?.currency || currencyCode, dictionaries: payload.dictionaries || {}, results: payload.data || [] });
  } catch (error) {
    console.error('Flight search failed:', error.message);
    res.status(error.status || 503).json({ error: error.name === 'TimeoutError' ? 'Le fournisseur met trop de temps à répondre. Réessayez.' : error.message || 'Service de recherche temporairement indisponible.', code: 'FLIGHT_SEARCH_UNAVAILABLE' });
  }
});
app.listen(port, () => console.log(`SSM flights API listening on http://localhost:${port} (${environment})`));
