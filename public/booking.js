const form = document.querySelector('#search-form');
const resultsNode = document.querySelector('#flight-results');
const title = document.querySelector('#results-title');
const count = document.querySelector('#results-count');
const notice = document.querySelector('#notice');
const checkout = document.querySelector('#checkout');
const checkoutForm = document.querySelector('#checkout-form');
const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
form.elements.departureDate.min = tomorrow;
form.elements.departureDate.value = tomorrow;

const sampleFlights = [
  { id: 'demo-af', carrier: 'Air France', code: 'AF 718', from: 'CDG', to: 'DSS', depart: '10:20', arrive: '14:45', duration: '6 h 25', stops: 'Direct', price: 684, currency: 'EUR' },
  { id: 'demo-tp', carrier: 'TAP Air Portugal', code: 'TP 439', from: 'CDG', to: 'DSS', depart: '08:35', arrive: '16:10', duration: '8 h 35', stops: '1 escale', price: 512, currency: 'EUR' },
  { id: 'demo-rm', carrier: 'Royal Air Maroc', code: 'AT 789', from: 'CDG', to: 'DSS', depart: '12:15', arrive: '18:30', duration: '7 h 15', stops: '1 escale', price: 579, currency: 'EUR' },
];
let selectedFlight = null;
let passengerCount = 1;
const paymentNames = { visa: 'Carte Visa', 'airtel-money': 'Airtel Money', 'm-pesa': 'M-Pesa', 'orange-money': 'Orange Money' };
const formatMoney = (value, currency) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency, maximumFractionDigits: 2 }).format(value);
function showNotice(text, error = false) { notice.hidden = false; notice.textContent = text; notice.className = `notice${error ? ' error' : ''}`; }
function makeFlightCard(flight) {
  const card = document.createElement('article');
  card.className = `flight-card${selectedFlight?.id === flight.id ? ' chosen' : ''}`;
  const carrier = document.createElement('div'); carrier.className = 'carrier';
  const logo = document.createElement('span'); logo.className = 'carrier-logo'; logo.textContent = flight.carrier.slice(0, 1);
  const carrierInfo = document.createElement('span'); carrierInfo.className = 'carrier-info';
  const name = document.createElement('b'); name.textContent = flight.carrier;
  const number = document.createElement('small'); number.textContent = flight.code;
  carrierInfo.append(name, number); carrier.append(logo, carrierInfo);
  const route = document.createElement('div'); route.className = 'route';
  const from = document.createElement('div'); from.className = 'time-point'; from.innerHTML = `<b>${flight.depart}</b><small>${flight.from}</small>`;
  const line = document.createElement('div'); line.className = 'route-line';
  const duration = document.createElement('small'); duration.textContent = flight.duration;
  const stroke = document.createElement('i');
  const stops = document.createElement('small'); stops.textContent = flight.stops;
  line.append(duration, stroke, stops);
  const to = document.createElement('div'); to.className = 'time-point arrival'; to.innerHTML = `<b>${flight.arrive}</b><small>${flight.to}</small>`;
  route.append(from, line, to);
  const price = document.createElement('div'); price.className = 'price';
  const amount = document.createElement('b'); amount.textContent = formatMoney(flight.price, flight.currency);
  const per = document.createElement('small'); per.textContent = 'par voyageur';
  const button = document.createElement('button'); button.className = selectedFlight?.id === flight.id ? 'select-flight selected' : 'select-flight'; button.type = 'button'; button.textContent = selectedFlight?.id === flight.id ? 'Sélectionné ✓' : 'Choisir ce vol';
  button.addEventListener('click', () => selectFlight(flight));
  price.append(amount, per, button); card.append(carrier, route, price);
  return card;
}
function renderFlights(flights) {
  resultsNode.replaceChildren(...flights.map(makeFlightCard));
  count.textContent = `${flights.length} option${flights.length === 1 ? '' : 's'}`;
}
function selectFlight(flight) {
  selectedFlight = flight;
  const price = flight.price * passengerCount;
  document.querySelector('#empty-summary').hidden = true;
  const summary = document.querySelector('#selected-summary'); summary.hidden = false; summary.replaceChildren();
  const details = document.createElement('div'); details.className = 'selected-flight';
  const route = document.createElement('b'); route.textContent = `${flight.from} → ${flight.to}`;
  const airline = document.createElement('span'); airline.textContent = `${flight.carrier} · ${flight.code}`;
  const timing = document.createElement('span'); timing.textContent = `${flight.depart} – ${flight.arrive} · ${flight.stops}`;
  const subtotal = document.createElement('div'); subtotal.className = 'subtotal';
  const subtotalLabel = document.createElement('span'); subtotalLabel.textContent = `${passengerCount} voyageur${passengerCount > 1 ? 's' : ''}`;
  const subtotalPrice = document.createElement('b'); subtotalPrice.textContent = formatMoney(price, flight.currency);
  subtotal.append(subtotalLabel, subtotalPrice); details.append(route, airline, timing, subtotal); summary.append(details);
  document.querySelector('#commission-value').textContent = formatMoney(price * .05, flight.currency);
  checkout.hidden = false;
  renderFlights(window.currentFlights || sampleFlights);
  document.querySelector('#step-passenger').classList.add('active');
  checkout.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const values = new FormData(form);
  const origin = String(values.get('origin')).trim().toUpperCase();
  const destination = String(values.get('destination')).trim().toUpperCase();
  passengerCount = Number(values.get('adults'));
  title.textContent = `Vols ${origin} → ${destination}`;
  showNotice('Recherche des disponibilités en cours…');
  const params = new URLSearchParams({ origin, destination, departureDate: String(values.get('departureDate')), adults: String(passengerCount), currencyCode: 'EUR' });
  try {
    const response = await fetch(`/api/flights/search?${params}`);
    if (!response.ok) throw new Error('API fournisseur indisponible');
    const data = await response.json();
    const flights = data.results.map((offer, index) => {
      const itinerary = offer.itineraries?.[0]; const segments = itinerary?.segments || []; const first = segments[0]; const last = segments.at(-1);
      if (!first || !last) return null;
      const time = (value) => new Date(value).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
      const codes = data.dictionaries?.carriers || {};
      const code = first.carrierCode;
      return { id: offer.id || `api-${index}`, carrier: codes[code] || code, code: `${code} ${first.number}`, from: first.departure.iataCode, to: last.arrival.iataCode, depart: time(first.departure.at), arrive: time(last.arrival.at), duration: itinerary.duration?.replace('PT', '').toLowerCase() || '—', stops: segments.length > 1 ? `${segments.length - 1} escale${segments.length > 2 ? 's' : ''}` : 'Direct', price: Number(offer.price.total), currency: offer.price.currency };
    }).filter(Boolean);
    if (!flights.length) throw new Error('Aucun vol trouvé pour cette recherche.');
    window.currentFlights = flights; selectedFlight = null; checkout.hidden = true; renderFlights(flights);
    notice.hidden = true; document.querySelector('#provider-status').textContent = 'Tarifs en direct via Amadeus';
  } catch {
    window.currentFlights = sampleFlights.map(f => ({ ...f, from: origin || f.from, to: destination || f.to })); selectedFlight = null; checkout.hidden = true; renderFlights(window.currentFlights);
    showNotice('Mode aperçu : résultats illustratifs. Configurez la connexion API Amadeus sur votre serveur pour obtenir des offres en direct.');
  }
});

checkoutForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!checkoutForm.reportValidity() || !selectedFlight) return;
  const payment = new FormData(checkoutForm).get('payment');
  if (!payment || !paymentNames[payment]) return;
  document.querySelector('#selected-payment-name').textContent = paymentNames[payment];
  document.querySelector('#confirmation').hidden = false;
  document.querySelector('#step-payment').classList.add('active');
  checkoutForm.querySelector('.confirm-button').hidden = true;
  document.querySelector('#confirmation').scrollIntoView({ behavior: 'smooth', block: 'center' });
});
renderFlights(sampleFlights);
