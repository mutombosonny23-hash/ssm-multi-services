const form = document.querySelector('#search-form');
const resultsNode = document.querySelector('#flight-results');
const title = document.querySelector('#results-title');
const count = document.querySelector('#results-count');
const notice = document.querySelector('#notice');
const checkout = document.querySelector('#checkout');
const checkoutForm = document.querySelector('#checkout-form');
const departureInput = form.elements.departureDate;
const returnInput = form.elements.returnDate;
const returnField = document.querySelector('#return-date-field');
const childrenInput = form.elements.children;
const childAgesNode = document.querySelector('#child-ages');
const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
const isoDay = (date) => date.toISOString().slice(0, 10);
const plusDays = (dateString, count) => { const date = new Date(`${dateString}T00:00:00`); date.setDate(date.getDate() + count); return isoDay(date); };
departureInput.min = tomorrow;
departureInput.value = tomorrow;
returnInput.min = tomorrow;
returnInput.value = plusDays(tomorrow, 7);

const sampleFlights = [
  { id: 'demo-af', carrier: 'Air France', code: 'AF 718', from: 'CDG', to: 'DSS', depart: '10:20', arrive: '14:45', duration: '6 h 25', stops: 'Direct', price: 684, currency: 'EUR' },
  { id: 'demo-tp', carrier: 'TAP Air Portugal', code: 'TP 439', from: 'CDG', to: 'DSS', depart: '08:35', arrive: '16:10', duration: '8 h 35', stops: '1 escale', price: 512, currency: 'EUR' },
  { id: 'demo-rm', carrier: 'Royal Air Maroc', code: 'AT 789', from: 'CDG', to: 'DSS', depart: '12:15', arrive: '18:30', duration: '7 h 15', stops: '1 escale', price: 579, currency: 'EUR' },
];
let selectedFlight = null;
let passengerCount = 1;
let childCount = 0;
let tripType = 'roundtrip';
const paymentNames = { visa: 'Carte Visa', 'airtel-money': 'Airtel Money', 'm-pesa': 'M-Pesa', 'orange-money': 'Orange Money' };
const formatMoney = (value, currency) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency, maximumFractionDigits: 2 }).format(value);
function showNotice(text, error = false) { notice.hidden = false; notice.textContent = text; notice.className = `notice${error ? ' error' : ''}`; }
function setTripType(type) {
  tripType = type;
  const isReturn = type === 'roundtrip';
  returnField.hidden = !isReturn;
  returnInput.required = isReturn;
  returnInput.disabled = !isReturn;
  if (isReturn && (!returnInput.value || returnInput.value < departureInput.value)) returnInput.value = plusDays(departureInput.value || tomorrow, 1);
}
function renderChildAges() {
  childCount = Number(childrenInput.value);
  childAgesNode.replaceChildren();
  childAgesNode.hidden = childCount === 0;
  if (!childCount) return;
  const heading = document.createElement('p'); heading.className = 'child-age-heading'; heading.textContent = 'Âge de chaque enfant (0 à 12 ans)';
  childAgesNode.append(heading);
  for (let index = 0; index < childCount; index += 1) {
    const label = document.createElement('label'); label.textContent = `Enfant ${index + 1}`;
    const select = document.createElement('select'); select.name = `childAge${index + 1}`; select.required = true;
    for (let age = 0; age <= 12; age += 1) { const option = document.createElement('option'); option.value = String(age); option.textContent = age === 0 ? 'Moins d’un an' : `${age} an${age > 1 ? 's' : ''}`; select.append(option); }
    label.append(select); childAgesNode.append(label);
  }
}
form.querySelectorAll('input[name="tripType"]').forEach((input) => input.addEventListener('change', () => setTripType(input.value)));
departureInput.addEventListener('change', () => { returnInput.min = departureInput.value; if (returnInput.value < departureInput.value) returnInput.value = departureInput.value; });
childrenInput.addEventListener('change', renderChildAges);
setTripType(form.querySelector('input[name="tripType"]:checked').value);
renderChildAges();

function legMarkup(leg, label) {
  const row = document.createElement('div'); row.className = `itinerary-leg${label === 'Retour' ? ' return-leg' : ''}`;
  const badge = document.createElement('span'); badge.className = 'leg-label'; badge.textContent = label;
  const from = document.createElement('div'); from.className = 'time-point'; from.innerHTML = `<b>${leg.depart}</b><small>${leg.from}</small>`;
  const line = document.createElement('div'); line.className = 'route-line';
  const duration = document.createElement('small'); duration.textContent = leg.duration;
  const stroke = document.createElement('i');
  const stops = document.createElement('small'); stops.textContent = leg.stops;
  line.append(duration, stroke, stops);
  const to = document.createElement('div'); to.className = 'time-point arrival'; to.innerHTML = `<b>${leg.arrive}</b><small>${leg.to}</small>`;
  row.append(badge, from, line, to); return row;
}
function makeFlightCard(flight) {
  const card = document.createElement('article'); card.className = `flight-card${selectedFlight?.id === flight.id ? ' chosen' : ''}`;
  const carrier = document.createElement('div'); carrier.className = 'carrier';
  const logo = document.createElement('span'); logo.className = 'carrier-logo'; logo.textContent = flight.carrier.slice(0, 1);
  const carrierInfo = document.createElement('span'); carrierInfo.className = 'carrier-info';
  const name = document.createElement('b'); name.textContent = flight.carrier;
  const number = document.createElement('small'); number.textContent = flight.code;
  carrierInfo.append(name, number); carrier.append(logo, carrierInfo);
  const itinerary = document.createElement('div'); itinerary.className = 'itinerary-stack'; itinerary.append(legMarkup(flight, 'Aller'));
  if (flight.returnLeg) itinerary.append(legMarkup(flight.returnLeg, 'Retour'));
  const price = document.createElement('div'); price.className = 'price';
  const amount = document.createElement('b'); amount.textContent = formatMoney(flight.price, flight.currency);
  const per = document.createElement('small'); per.textContent = 'prix total du voyage';
  const button = document.createElement('button'); button.className = selectedFlight?.id === flight.id ? 'select-flight selected' : 'select-flight'; button.type = 'button'; button.textContent = selectedFlight?.id === flight.id ? 'Sélectionné ✓' : 'Choisir ce vol'; button.addEventListener('click', () => selectFlight(flight));
  price.append(amount, per, button); card.append(carrier, itinerary, price); return card;
}
function renderFlights(flights) { resultsNode.replaceChildren(...flights.map(makeFlightCard)); count.textContent = `${flights.length} option${flights.length === 1 ? '' : 's'}`; }
function selectFlight(flight) {
  selectedFlight = flight;
  const total = flight.price;
  document.querySelector('#empty-summary').hidden = true;
  const summary = document.querySelector('#selected-summary'); summary.hidden = false; summary.replaceChildren();
  const details = document.createElement('div'); details.className = 'selected-flight';
  const route = document.createElement('b'); route.textContent = `${flight.from} → ${flight.to}${flight.returnLeg ? ` → ${flight.from}` : ''}`;
  const airline = document.createElement('span'); airline.textContent = `${flight.carrier} · ${flight.code}`;
  const timing = document.createElement('span'); timing.textContent = `${flight.depart} – ${flight.arrive} · ${flight.stops}`;
  const passenger = document.createElement('span'); passenger.textContent = `${passengerCount} adulte${passengerCount > 1 ? 's' : ''}${childCount ? `, ${childCount} enfant${childCount > 1 ? 's' : ''}` : ''} · ${flight.returnLeg ? 'Aller-retour' : 'Aller simple'}`;
  const subtotal = document.createElement('div'); subtotal.className = 'subtotal';
  const subtotalLabel = document.createElement('span'); subtotalLabel.textContent = 'Prix total indicatif';
  const subtotalPrice = document.createElement('b'); subtotalPrice.textContent = formatMoney(total, flight.currency);
  subtotal.append(subtotalLabel, subtotalPrice); details.append(route, airline, timing, passenger);
  if (flight.returnLeg) { const back = document.createElement('span'); back.textContent = `Retour : ${flight.returnLeg.depart} – ${flight.returnLeg.arrive} · ${flight.returnLeg.stops}`; details.append(back); }
  details.append(subtotal); summary.append(details);
  document.querySelector('#commission-value').textContent = formatMoney(total * .05, flight.currency);
  checkout.hidden = false; renderFlights(window.currentFlights || sampleFlights); document.querySelector('#step-passenger').classList.add('active'); checkout.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
function toLeg(segments, dictionaries = {}) {
  const first = segments[0]; const last = segments.at(-1); if (!first || !last) return null;
  const time = (value) => new Date(value).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
  const codes = dictionaries.carriers || {};
  return { carrier: codes[first.carrierCode] || first.carrierCode, code: `${first.carrierCode} ${first.number}`, from: first.departure.iataCode, to: last.arrival.iataCode, depart: time(first.departure.at), arrive: time(last.arrival.at), duration: 'Durée du trajet', stops: segments.length > 1 ? `${segments.length - 1} escale${segments.length > 2 ? 's' : ''}` : 'Direct' };
}
function mapOffer(offer, dictionaries, index) {
  const itineraries = offer.itineraries || []; const outbound = toLeg(itineraries[0]?.segments || [], dictionaries); if (!outbound) return null;
  const returnLeg = itineraries[1] ? toLeg(itineraries[1].segments || [], dictionaries) : null;
  return { ...outbound, id: offer.id || `api-${index}`, returnLeg, price: Number(offer.price.total), currency: offer.price.currency };
}
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const values = new FormData(form); const origin = String(values.get('origin')).trim().toUpperCase(); const destination = String(values.get('destination')).trim().toUpperCase();
  passengerCount = Number(values.get('adults')); childCount = Number(values.get('children')); tripType = String(values.get('tripType'));
  const departureDate = String(values.get('departureDate')); const returnDate = tripType === 'roundtrip' ? String(values.get('returnDate')) : '';
  const totalPassengers = passengerCount + childCount;
  if (totalPassengers > 9) { showNotice('Le nombre total de voyageurs (adultes et enfants) ne peut pas dépasser 9.', true); return; }
  if (returnDate && returnDate < departureDate) { showNotice('La date de retour doit être le même jour ou après la date de départ.', true); return; }
  title.textContent = `Vols ${origin} → ${destination}${returnDate ? ` · retour ${returnDate}` : ''}`;
  showNotice('Recherche des disponibilités en cours…');
  const params = new URLSearchParams({ origin, destination, departureDate, adults: String(passengerCount), currencyCode: 'EUR' });
  if (childCount) params.set('children', String(childCount));
  if (returnDate) params.set('returnDate', returnDate);
  try {
    const response = await fetch(`/api/flights/search?${params}`); if (!response.ok) throw new Error('API fournisseur indisponible');
    const data = await response.json(); const flights = data.results.map((offer, index) => mapOffer(offer, data.dictionaries || {}, index)).filter(Boolean);
    if (!flights.length) throw new Error('Aucun vol trouvé pour cette recherche.');
    window.currentFlights = flights; selectedFlight = null; checkout.hidden = true; renderFlights(flights); notice.hidden = true; document.querySelector('#provider-status').textContent = 'Tarifs en direct via Amadeus';
  } catch {
    window.currentFlights = sampleFlights.map((flight) => ({ ...flight, from: origin || flight.from, to: destination || flight.to, returnLeg: returnDate ? { carrier: flight.carrier, code: flight.code, from: destination, to: origin, depart: '11:30', arrive: '17:45', duration: '6 h 15', stops: flight.stops } : null }));
    selectedFlight = null; checkout.hidden = true; renderFlights(window.currentFlights); showNotice('Mode aperçu : résultats illustratifs. Configurez l’API Amadeus côté serveur pour obtenir des offres en direct.');
  }
});
checkoutForm.addEventListener('submit', (event) => {
  event.preventDefault(); if (!checkoutForm.reportValidity() || !selectedFlight) return;
  const payment = new FormData(checkoutForm).get('payment'); if (!payment || !paymentNames[payment]) return;
  document.querySelector('#selected-payment-name').textContent = paymentNames[payment]; document.querySelector('#confirmation').hidden = false; document.querySelector('#step-payment').classList.add('active'); checkoutForm.querySelector('.confirm-button').hidden = true; document.querySelector('#confirmation').scrollIntoView({ behavior: 'smooth', block: 'center' });
});
renderFlights(sampleFlights);
