const API_URL = 'http://localhost:3000';

const cityInput = document.getElementById('collections-city');
const dateInput = document.getElementById('collections-date');
const searchButton = document.getElementById('collections-search');
const categoriesList = document.getElementById('categories-list');
const totalValue = document.getElementById('total-value');

function parseDateToYearMonth(dateStr) {
    if (!dateStr) return {};
     const[year, month] = dateStr.split('-');
     return { year, month :parseInt (month , 10) };
    };
async function fetchFilters({year, month, location}={}) {
    const params = new URLSearchParams();
    if (year) params.append('year', year);
    if (month) params.append('month', month);
    if (location) params.append('location', location);
const URL = `${API_URL}/stats/filters?${params.toString()}`;
   try{ const response = await fetch(URL);
    if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);');
   const data = await response.json();
    const total = data?.total !=null ?  Number (data.total) : 0;
    return  total;
   } catch (error) {
    console.error('Erreur fetchFilters:', error);
    throw error;
   }
}

async function fetchCategories({year, month, location}={}) {
    const params = new URLSearchParams();
    if (year) params.append('year', year);
    if (month) params.append('month', month);
    if (location) params.append('location', location);
const URL = `${API_URL}/stats/categories?${params.toString()}`;
   try{ const response = await fetch(URL);
    if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);');
   const rows = await response.json();
   return rows.map(r =>({ name: r.name, total: Number(r.total) || 0 }));

   } catch (error) {
    console.error('Erreur fetchCategories:', error);
    throw error;
   }
}