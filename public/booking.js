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
const isoDay = date => date.toISOString().slice(0, 10);
const plusDays = (dateString, count) => { const date = new Date(`${dateString}T00:00:00`); date.setDate(date.getDate() + count); return isoDay(date); };
departureInput.min = tomorrow; departureInput.value = tomorrow; returnInput.min = tomorrow; returnInput.value = plusDays(tomorrow, 7);
const sampleFlights = [
  { id: 'demo-af', carrier: 'Air France', code: 'AF 718', from: 'CDG', to: 'DSS', depart: '10:20', arrive: '14:45', duration: '6 h 25', stops: 'Direct', price: 684, currency: 'EUR' },
  { id: 'demo-sn', carrier: 'Brussels Airlines', code: 'SN 280', from: 'CDG', to: 'DSS', depart: '08:35', arrive: '16:10', duration: '8 h 35', stops: '1 escale', price: 512, currency: 'EUR' },
  { id: 'demo-et', carrier: 'Ethiopian Airlines', code: 'ET 909', from: 'CDG', to: 'DSS', depart: '12:15', arrive: '18:30', duration: '7 h 15', stops: '1 escale', price: 579, currency: 'EUR' },
  { id: 'demo-kq', carrier: 'Kenya Airways', code: 'KQ 115', from: 'CDG', to: 'DSS', depart: '09:45', arrive: '17:20', duration: '7 h 35', stops: '1 escale', price: 601, currency: 'EUR' },
  { id: 'demo-4v', carrier: 'Air Congo', code: '4V 201', from: 'CDG', to: 'DSS', depart: '07:50', arrive: '15:40', duration: '7 h 50', stops: '1 escale', price: 625, currency: 'EUR' },
];
let selectedFlight = null; let adultCount = 1; let childCount = 0; let tripType = 'roundtrip';
const paymentNames = { visa: 'Carte Visa', 'airtel-money': 'Airtel Money', 'm-pesa': 'M-Pesa', 'orange-money': 'Orange Money' };
const airlineNames = { '4V': 'Air Congo', SN: 'Brussels Airlines', AF: 'Air France', ET: 'Ethiopian Airlines', KQ: 'Kenya Airways' };
const formatMoney = (value, currency) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency, maximumFractionDigits: 2 }).format(value);
function showNotice(text, error = false) { notice.hidden = false; notice.textContent = text; notice.className = `notice${error ? ' error' : ''}`; }
function selectedIata(value) { const text = String(value || '').trim().toUpperCase(); const match = text.match(/\(([A-Z]{3})\)(?:,\s*[^()]*)?$/); return match ? match[1] : /^[A-Z]{3}$/.test(text) ? text : ''; }
function setupLocationAutocomplete(fieldName, datalistId) {
  const input = form.elements[fieldName]; const list = document.getElementById(datalistId); let timer;
  input.addEventListener('input', () => {
    clearTimeout(timer); const keyword = input.value.trim();
    if (keyword.length < 2 || selectedIata(keyword)) return;
    timer = setTimeout(async () => {
      try {
        const response = await fetch(`/api/locations?keyword=${encodeURIComponent(keyword)}`);
        if (!response.ok) return;
        const payload = await response.json();
        list.replaceChildren(...payload.locations.map(location => { const option = document.createElement('option'); option.value = location.displayName; return option; }));
      } catch { /* Autocomplete is optional when the API server is not running. */ }
    }, 250);
  });
}
setupLocationAutocomplete('origin', 'origin-suggestions'); setupLocationAutocomplete('destination', 'destination-suggestions');
function setTripType(type) { tripType = type; const isReturn = type === 'roundtrip'; returnField.hidden = !isReturn; returnInput.required = isReturn; returnInput.disabled = !isReturn; if (isReturn && (!returnInput.value || returnInput.value < departureInput.value)) returnInput.value = plusDays(departureInput.value || tomorrow, 1); }
function renderChildAges() {
  childCount = Number(childrenInput.value); childAgesNode.replaceChildren(); childAgesNode.hidden = childCount === 0; if (!childCount) return;
  const heading = document.createElement('p'); heading.className = 'child-age-heading'; heading.textContent = 'Âge de chaque enfant (0 à 12 ans)'; childAgesNode.append(heading);
  for (let index = 0; index < childCount; index += 1) { const label = document.createElement('label'); label.textContent = `Enfant ${index + 1}`; const select = document.createElement('select'); select.name = `childAge${index + 1}`; select.required = true; for (let age = 0; age <= 12; age += 1) { const option = document.createElement('option'); option.value = String(age); option.textContent = age === 0 ? 'Moins d’un an' : `${age} an${age > 1 ? 's' : ''}`; select.append(option); } label.append(select); childAgesNode.append(label); }
}
form.querySelectorAll('input[name="tripType"]').forEach(input => input.addEventListener('change', () => setTripType(input.value)));
departureInput.addEventListener('change', () => { returnInput.min = departureInput.value; if (returnInput.value < departureInput.value) returnInput.value = departureInput.value; });
childrenInput.addEventListener('change', renderChildAges); setTripType(form.querySelector('input[name="tripType"]:checked').value); renderChildAges();
fetch('/api/flights/status').then(response => response.json()).then(status => { const provider = document.querySelector('#provider-status'); provider.textContent = status.environment === 'production' && status.configured ? 'Amadeus Production · tarifs en direct selon disponibilité' : status.configured ? 'Amadeus Test · tarifs de test non garantis en temps réel' : 'Configurez Amadeus pour activer les villes et les vols en direct'; }).catch(() => { document.querySelector('#provider-status').textContent = 'Serveur de vols indisponible — aperçu uniquement'; });
function legMarkup(leg, label) { const row = document.createElement('div'); row.className = `itinerary-leg${label === 'Retour' ? ' return-leg' : ''}`; const badge = document.createElement('span'); badge.className = 'leg-label'; badge.textContent = label; const from = document.createElement('div'); from.className = 'time-point'; from.innerHTML = `<b>${leg.depart}</b><small>${leg.from}</small>`; const line = document.createElement('div'); line.className = 'route-line'; const duration = document.createElement('small'); duration.textContent = leg.duration || '—'; const stroke = document.createElement('i'); const stops = document.createElement('small'); stops.textContent = leg.stops; line.append(duration, stroke, stops); const to = document.createElement('div'); to.className = 'time-point arrival'; to.innerHTML = `<b>${leg.arrive}</b><small>${leg.to}</small>`; row.append(badge, from, line, to); return row; }
function makeFlightCard(flight) {
  const card = document.createElement('article'); card.className = `flight-card${selectedFlight?.id === flight.id ? ' chosen' : ''}`; const carrier = document.createElement('div'); carrier.className = 'carrier'; const logo = document.createElement('span'); logo.className = 'carrier-logo'; logo.textContent = flight.carrier.slice(0, 1); const carrierInfo = document.createElement('span'); carrierInfo.className = 'carrier-info'; const name = document.createElement('b'); name.textContent = flight.carrier; const number = document.createElement('small'); number.textContent = flight.code; carrierInfo.append(name, number); carrier.append(logo, carrierInfo); const itinerary = document.createElement('div'); itinerary.className = 'itinerary-stack'; itinerary.append(legMarkup(flight, 'Aller')); if (flight.returnLeg) itinerary.append(legMarkup(flight.returnLeg, 'Retour')); const price = document.createElement('div'); price.className = 'price'; const amount = document.createElement('b'); amount.textContent = formatMoney(flight.price, flight.currency); const per = document.createElement('small'); per.textContent = 'prix total indicatif'; const button = document.createElement('button'); button.className = selectedFlight?.id === flight.id ? 'select-flight selected' : 'select-flight'; button.type = 'button'; button.textContent = selectedFlight?.id === flight.id ? 'Sélectionné ✓' : 'Choisir ce vol'; button.addEventListener('click', () => selectFlight(flight)); price.append(amount, per, button); card.append(carrier, itinerary, price); return card;
}
function renderFlights(flights) { resultsNode.replaceChildren(...flights.map(makeFlightCard)); count.textContent = `${flights.length} offre${flights.length === 1 ? '' : 's'}`; }
function selectFlight(flight) {
  selectedFlight = flight; document.querySelector('#empty-summary').hidden = true; const summary = document.querySelector('#selected-summary'); summary.hidden = false; summary.replaceChildren(); const details = document.createElement('div'); details.className = 'selected-flight'; const route = document.createElement('b'); route.textContent = `${flight.from} → ${flight.to}${flight.returnLeg ? ` → ${flight.from}` : ''}`; const airline = document.createElement('span'); airline.textContent = `${flight.carrier} · ${flight.code}`; const pax = document.createElement('span'); pax.textContent = `${adultCount} adulte${adultCount > 1 ? 's' : ''}${childCount ? `, ${childCount} enfant${childCount > 1 ? 's' : ''}` : ''} · ${flight.returnLeg ? 'Aller-retour' : 'Aller simple'}`; const subtotal = document.createElement('div'); subtotal.className = 'subtotal'; const subtotalLabel = document.createElement('span'); subtotalLabel.textContent = 'Prix total indicatif'; const subtotalPrice = document.createElement('b'); subtotalPrice.textContent = formatMoney(flight.price, flight.currency); subtotal.append(subtotalLabel, subtotalPrice); details.append(route, airline, pax); if (flight.returnLeg) { const back = document.createElement('span'); back.textContent = `Retour : ${flight.returnLeg.depart} – ${flight.returnLeg.arrive}`; details.append(back); } details.append(subtotal); summary.append(details); document.querySelector('#commission-value').textContent = formatMoney(flight.price * .05, flight.currency); checkout.hidden = false; renderFlights(window.currentFlights || sampleFlights); document.querySelector('#step-passenger').classList.add('active'); checkout.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
function mapLeg(itinerary, dictionaries) { const segments = itinerary?.segments || []; const first = segments[0]; const last = segments.at(-1); if (!first || !last) return null; const time = value => new Date(value).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }); const airlineCode = first.carrierCode; const carriers = dictionaries.carriers || {}; const duration = (itinerary.duration || '').replace(/^PT/, '').toLowerCase(); return { carrier: carriers[airlineCode] || airlineNames[airlineCode] || airlineCode, code: `${airlineCode} ${first.number}`, from: first.departure.iataCode, to: last.arrival.iataCode, depart: time(first.departure.at), arrive: time(last.arrival.at), duration, stops: segments.length > 1 ? `${segments.length - 1} escale${segments.length > 2 ? 's' : ''}` : 'Direct' }; }
function mapOffer(offer, dictionaries, index) { const itineraries = offer.itineraries || []; const outbound = mapLeg(itineraries[0], dictionaries); if (!outbound) return null; const returnLeg = itineraries[1] ? mapLeg(itineraries[1], dictionaries) : null; return { ...outbound, id: offer.id || `api-${index}`, returnLeg, price: Number(offer.price.total), currency: offer.price.currency }; }
form.addEventListener('submit', async event => {
  event.preventDefault(); const values = new FormData(form); const originText = String(values.get('origin')).trim(); const destinationText = String(values.get('destination')).trim(); const origin = selectedIata(originText); const destination = selectedIata(destinationText); adultCount = Number(values.get('adults')); childCount = Number(values.get('children')); tripType = String(values.get('tripType')); const departureDate = String(values.get('departureDate')); const returnDate = tripType === 'roundtrip' ? String(values.get('returnDate')) : ''; const airlines = [...form.querySelectorAll('input[name="airline"]:checked')].map(input => input.value);
  if (!origin || !destination) { showNotice('Choisissez une ville dans la liste de suggestions ou saisissez un code IATA de 3 lettres.', true); return; }
  if (!airlines.length) { showNotice('Cochez au moins une compagnie aérienne.', true); return; }
  if (adultCount + childCount > 9) { showNotice('Le nombre total de voyageurs ne peut pas dépasser 9.', true); return; }
  if (returnDate && returnDate < departureDate) { showNotice('La date de retour doit être le même jour ou après la date de départ.', true); return; }
  title.textContent = `Vols ${originText} → ${destinationText}${returnDate ? ` · retour ${returnDate}` : ''}`; showNotice('Recherche des offres auprès du fournisseur…');
  const params = new URLSearchParams({ origin, destination, departureDate, adults: String(adultCount), children: String(childCount), currencyCode: 'EUR', airlines: airlines.join(',') }); if (returnDate) params.set('returnDate', returnDate);
  try {
    const response = await fetch(`/api/flights/search?${params}`); const data = await response.json(); if (!response.ok) throw new Error(data.error || 'Recherche indisponible'); const flights = data.results.map((offer, index) => mapOffer(offer, data.dictionaries || {}, index)).filter(Boolean); if (!flights.length) throw new Error('Aucun vol trouvé pour cette route, ces dates et compagnies. En mode test, le catalogue est limité et mis en cache.'); window.currentFlights = flights; selectedFlight = null; checkout.hidden = true; renderFlights(flights); notice.hidden = true; document.querySelector('#provider-status').textContent = data.livePrices ? 'Amadeus Production · prix selon disponibilité fournisseur' : 'Amadeus Test · données limitées, non garanties en temps réel';
  } catch (error) { window.currentFlights = []; selectedFlight = null; checkout.hidden = true; renderFlights([]); showNotice(error.message || 'La recherche réelle est indisponible. Aucun prix fictif ne sera présenté comme tarif en direct.', true); }
});
checkoutForm.addEventListener('submit', event => { event.preventDefault(); if (!checkoutForm.reportValidity() || !selectedFlight) return; const payment = new FormData(checkoutForm).get('payment'); if (!payment || !paymentNames[payment]) return; document.querySelector('#selected-payment-name').textContent = paymentNames[payment]; document.querySelector('#confirmation').hidden = false; document.querySelector('#step-payment').classList.add('active'); checkoutForm.querySelector('.confirm-button').hidden = true; document.querySelector('#confirmation').scrollIntoView({ behavior: 'smooth', block: 'center' }); });
renderFlights([]);
