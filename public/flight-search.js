const form = document.querySelector('#search-form');
const results = document.querySelector('#results');
const message = document.querySelector('#message');
const badge = document.querySelector('#provider-badge');
const title = document.querySelector('#results-title');
const count = document.querySelector('#result-count');
const childSelect = form.elements.children;
const childAges = document.querySelector('#child-ages');
const dateInput = form.elements.departureDate;
const tomorrow = new Date(Date.now() + 86400000);
dateInput.min = tomorrow.toISOString().slice(0, 10); dateInput.value = dateInput.min;
const renderChildAges = () => {
  const numberOfChildren = Number(childSelect.value); childAges.replaceChildren(); childAges.hidden = numberOfChildren === 0;
  for (let i = 1; i <= numberOfChildren; i += 1) {
    const label = document.createElement('label'); label.textContent = `Âge enfant ${i}`;
    const select = document.createElement('select'); select.name = `childAge${i}`; select.required = true;
    for (let age = 0; age <= 12; age += 1) { const option = document.createElement('option'); option.value = String(age); option.textContent = age === 0 ? 'Moins d’un an' : `${age} an${age > 1 ? 's' : ''}`; select.append(option); }
    label.append(select); childAges.append(label);
  }
};
childSelect.addEventListener('change', renderChildAges); renderChildAges();
const money = (amount, currency) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency, maximumFractionDigits: 2 }).format(Number(amount));
const airportName = (code, dict) => dict.locations?.[code]?.cityCode || dict.locations?.[code]?.name || code;
fetch('/api/flights/status').then(r => r.json()).then(status => { badge.textContent = status.configured ? `Amadeus · ${status.environment === 'test' ? 'Mode test' : 'Production'}` : 'API à configurer'; badge.classList.toggle('ready', status.configured); }).catch(() => { badge.textContent = 'Serveur API indisponible'; });
function showMessage(text, kind = 'info') { message.hidden = false; message.className = `message ${kind}`; message.textContent = text; }
function renderOffer(offer, dictionaries) {
  const itinerary = offer.itineraries?.[0]; const segments = itinerary?.segments || []; const first = segments[0]; const last = segments.at(-1); if (!first || !last) return '';
  const airlineCode = first.carrierCode; const airline = dictionaries.carriers?.[airlineCode] || airlineCode; const stops = Math.max(segments.length - 1, 0);
  const departure = new Date(first.departure.at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }); const arrival = new Date(last.arrival.at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }); const duration = itinerary.duration?.replace('PT', '').toLowerCase() || '—'; const origin = first.departure.iataCode; const destination = last.arrival.iataCode;
  return `<article class="flight-card"><div class="airline"><span class="airline-mark">✈</span><span><b>${airline}</b><small>${airlineCode} · ${segments.map(s => s.number).join(' / ')}</small></span></div><div class="route"><div><b>${departure}</b><small>${origin} · ${airportName(origin, dictionaries)}</small></div><div class="route-line"><small>${duration}</small><span></span><small>${stops ? `${stops} escale${stops > 1 ? 's' : ''}` : 'Direct'}</small></div><div class="arrival"><b>${arrival}</b><small>${destination} · ${airportName(destination, dictionaries)}</small></div></div><div class="fare"><b>${money(offer.price.total, offer.price.currency)}</b><small>total indicatif</small></div></article>`;
}
form.addEventListener('submit', async event => {
  event.preventDefault(); results.replaceChildren(); count.textContent = ''; const formData = new FormData(form); const adults = Number(formData.get('adults')); const children = Number(formData.get('children'));
  if (adults + children > 9) { showMessage('Le nombre total de voyageurs ne peut pas dépasser 9.', 'error'); return; }
  const params = new URLSearchParams({ origin: String(formData.get('origin')).trim().toUpperCase(), destination: String(formData.get('destination')).trim().toUpperCase(), departureDate: String(formData.get('departureDate')), adults: String(adults), children: String(children), currencyCode: String(formData.get('currencyCode')), nonStop: String(formData.get('nonStop') === 'on') });
  if (formData.get('returnDate')) params.set('returnDate', String(formData.get('returnDate')));
  showMessage('Recherche des tarifs en cours…', 'info'); title.textContent = `${params.get('origin')} → ${params.get('destination')}`;
  try { const response = await fetch(`/api/flights/search?${params}`); const data = await response.json(); if (!response.ok) throw new Error(data.error || 'La recherche a échoué.'); const cards = data.results.map(offer => renderOffer(offer, data.dictionaries || {})).filter(Boolean); message.hidden = true; if (!cards.length) { showMessage('Aucun vol trouvé pour ces critères.', 'info'); return; } results.innerHTML = cards.join(''); count.textContent = `${cards.length} offre${cards.length > 1 ? 's' : ''} · ${data.environment === 'test' ? 'Données de test' : 'Données fournisseur'}`; }
  catch (error) { showMessage(error.message, 'error'); }
});
