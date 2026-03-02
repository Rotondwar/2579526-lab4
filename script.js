

async function searchCountry(countryName) {
   
    const spinner = document.getElementById('loading-spinner');
    const countryInfo = document.getElementById('country-info');
    const borderContainer = document.getElementById('bordering-countries');
    const errorMessage = document.getElementById('error-message');

    
    spinner.classList.remove('hidden');
    errorMessage.classList.add('hidden');
    countryInfo.innerHTML = '';
    borderContainer.innerHTML = '';

    try {
       
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
        if (!response.ok) throw new Error('Country not found');

        const data = await response.json();
        const country = data[0];

        
        countryInfo.innerHTML = `
            <h2>${country.name.common}</h2>
            <p><strong>Capital:</strong> ${country.capital?.[0] || 'N/A'}</p>
            <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
            <p><strong>Region:</strong> ${country.region}</p>
            <img src="${country.flags.svg}" alt="Flag of ${country.name.common}" width="150">
        `;

        
        if (country.borders && country.borders.length > 0) {
            
            const borderPromises = country.borders.map(code =>
                fetch(`https://restcountries.com/v3.1/alpha/${code}`).then(res => res.json())
            );

            const borderResults = await Promise.all(borderPromises);

            borderContainer.innerHTML = borderResults.map(borderData => {
                const neighbor = borderData[0];
                return `
                    <div class="country-card">
                        <p>${neighbor.name.common}</p>
                        <img src="${neighbor.flags.svg}" alt="Flag of ${neighbor.name.common}" width="80">
                    </div>
                `;
            }).join('');
        } else {
            borderContainer.innerHTML = '<p>No bordering countries</p>';
        }

    } catch (err) {
        console.error(err); 
        errorMessage.textContent = 'Oops! Something went wrong. Please check the country name and try again.';
        errorMessage.classList.remove('hidden');
    } finally {
        
        spinner.classList.add('hidden');
    }
}


document.getElementById('search-btn').addEventListener('click', () => {
    const country = document.getElementById('country-input').value.trim();
    if (country) searchCountry(country);
});

document.getElementById('country-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const country = e.target.value.trim();
        if (country) searchCountry(country);
    }
});