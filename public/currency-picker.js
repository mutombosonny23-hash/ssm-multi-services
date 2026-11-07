const currencyOptions = [
  ['EUR', 'EUR — Euro'],
  ['USD', 'USD — Dollar US'],
  ['XOF', 'XOF — Franc CFA'],
  ['CDF', 'CDF — Franc congolais'],
  ['GBP', 'GBP — Livre sterling'],
];

const form = document.querySelector('#search-form');
if (form) {
  const container = form.querySelector('.search-grid, .fields');
  if (container) {
    const label = document.createElement('label');
    label.textContent = 'Devise du prix';
    const select = document.createElement('select');
    select.name = 'displayCurrency';
    select.id = 'display-currency';
    select.setAttribute('aria-label', 'Devise d’affichage du prix');
    for (const [code, text] of currencyOptions) {
      const option = document.createElement('option');
      option.value = code;
      option.textContent = text;
      select.append(option);
    }
    label.append(select);
    container.append(label);

    const nativeFetch = window.fetch.bind(window);
    window.fetch = (input, init) => {
      const requestUrl = input instanceof Request ? input.url : String(input);
      if (!requestUrl.includes('/api/flights/search')) return nativeFetch(input, init);
      const url = new URL(requestUrl, window.location.href);
      url.searchParams.set('currencyCode', select.value);
      return nativeFetch(url.toString(), init);
    };
  }
}
