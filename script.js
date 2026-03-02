async function fetchCountryData(countryName) {
    const spinnerEl = document.getElementById('spinner');
    const countryEl = document.getElementById('country-info');
    const bordersEl = document.getElementById('border-countries');
    const errorEl = document.getElementById('error');


    try {
      
        spinnerEl.classList.remove('hidden');
        errorEl.classList.add('hidden');
        countryEl.innerHTML = '';
        bordersEl.innerHTML = '';

        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
        if (!response.ok) {
            throw new Error('Country not found');
        }

        const result = await response.json();
        const country = result[0];

        
        countryEl.innerHTML = `
            <h2>${country.name.common}</h2>
            <p><strong>Capital:</strong> ${country.capital?.[0] || 'N/A'}</p>
            <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
            <p><strong>Region:</strong> ${country.region}</p>
            <img src="${country.flags.svg}" alt="Flag of ${country.name.common}" width="150">
        `;

        
        if (country.borders && country.borders.length > 0) {
            for (let code of country.borders) {
                const borderResp = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
                const borderData = await borderResp.json();
                const neighbor = borderData[0];

                bordersEl.innerHTML += `
                    <div class="country-card">
                        <p>${neighbor.name.common}</p>
                        <img src="${neighbor.flags.svg}" alt="Flag of ${neighbor.name.common}" width="80">
                    </div>
                `;
            }
        } else {
            bordersEl.innerHTML = '<p>No bordering countries</p>';
        }

    } catch (err) {
      
        errorEl.textContent = 'Oops! Something went wrong. Please check the country name and try again.';
        errorEl.classList.remove('hidden');
    } finally {
       
        spinnerEl.classList.add('hidden');
    }
}


document.getElementById('search-btn').addEventListener('click', () => {
    const input = document.getElementById('country-input').value.trim();
    if (input) fetchCountryData(input);
});

document.getElementById('country-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const input = e.target.value.trim();
        if (input) fetchCountryData(input);
    }
});