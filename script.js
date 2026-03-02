async function fetchCountryData(countryName) {
    const spinnerEl = document.getElementById('spinner');
    const countryEl = document.getElementById('country-info');
    const bordersEl = document.getElementById('border-countries');
    const errorEl = document.getElementById('error');

   