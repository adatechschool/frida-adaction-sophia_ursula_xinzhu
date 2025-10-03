const API_URL = 'http://localhost:3000';

const cityInput = document.getElementById('cities');
const dateInput = document.getElementById('collections-date');
const searchButton = document.getElementById('collections-search');
const categoriesList = document.getElementById('categories-list');
const totalValue = document.getElementById('total-value');

// Load cities into the select#cities from backend
async function loadCities() {
    const select = document.getElementById('cities');
    if (!select) return;
    try {
        const res = await fetch(`${API_URL}/cities`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const rows = await res.json();
        // clear existing options
        select.innerHTML = '';
        // default option
        const defaultOpt = document.createElement('option');
        defaultOpt.value = '';
        defaultOpt.textContent = 'Toutes les villes';
        select.appendChild(defaultOpt);
        rows.forEach(r => {
            const opt = document.createElement('option');
            // r may be object { city: 'Name' } or a string
            const val = (r && r.city) ? r.city : r;
            if (!val) return; // skip null/empty values
            opt.value = val;
            opt.textContent = val;
            select.appendChild(opt);
        });
    } catch (error) {
        console.error('Erreur lors du chargement des villes:', error);
    }
}

async function fetchOverview({ date, location } = {}) {
    const params = new URLSearchParams();
    if (date) params.append('date', date);
    if (location) params.append('location', location);

    const URL = `${API_URL}/stats/overview?${params.toString()}`;
    try {
        const response = await fetch(URL);
        if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
        const data = await response.json();
        return {
            total: data.total || 0,
            categories: data.categories?.map(c => ({
                name: c.name,
                total: Number(c.total) || 0
            })) || []
        };
    } catch (error) {
        console.error('Erreur fetchOverview:', error);
        throw error;
    }
}
function renderCategories(categories) {
    categoriesList.innerHTML = '';
    if (!categories || categories.length === 0) {
        categoriesList.innerHTML = '<li>Aucune donnée disponible</li>';
        return;
    }
    categories.forEach(category => {
        const li = document.createElement('li');
        li.textContent = `${category.name}${category.total.toLocaleString()}`;
        categoriesList.appendChild(li);
    });
}
function renderTotal(total) {
    totalValue.textContent = total !== undefined ? total.toLocaleString() : "0";
}

searchButton.addEventListener('click', async () => {
    const location = cityInput.value.trim();
    const date = dateInput.value;

    try {
        const { total, categories } = await fetchOverview({ date, location });
        renderTotal(total);
        renderCategories(categories);
    } catch (error) {
        console.error('Erreur lors de la recherche:', error);
        totalValue.textContent = "Erreur";
        categoriesList.innerHTML = '<li>Erreur lors de la récupération des données</li>';
    }
});

(async () => {
    try {
        // fill cities select
        await loadCities();
        const { total, categories } = await fetchOverview();
        renderTotal(total);
        renderCategories(categories);
    } catch (error) {
        console.error('Erreur initialisation:', error);
    }
})();

console.log('Collections JS chargé');
