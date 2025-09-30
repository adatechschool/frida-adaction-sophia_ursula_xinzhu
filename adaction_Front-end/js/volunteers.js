// let paramString = window.location.search;
// let searchParams = new URLSearchParams(paramString);

// const city = searchParams.get('city-list')
// const name = searchParams.get('name-input')


// async function fetchVolunteers() {
//     try {
//         const response = await fetch(`${API_URL}/volunteers`)
//         const data = await response.json()
//         // console.log(data)
//         return data

//     } catch (error) {
//         console.log(error)
//     }

// }

const API_URL = 'http://localhost:3000'

//& Afficher les volontaires

async function fetchQuantities() {
    try {
        const response = await fetch(`${API_URL}/quantities`);
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error("Erreur fetchQuantities:", error);
    }
}

const displayVolunteers = async () => {
    try {
        const dataVolunteers = await fetchQuantities();
        const container = document.getElementById("volunteers");

        container.innerHTML = "";

        dataVolunteers.forEach(volunteer => {
            const div = document.createElement("div");
            div.classList.add("volunteer-profil");

            div.innerHTML = `
            <div class="profil-box">
                <div>
                  <ul> 
                    <li><strong>Nom:</strong> ${volunteer.name}</li>
                    <li><strong>Localisation:</strong> ${volunteer.city}</li>
                    <li class='collect'><strong>Nombre de déchets collectés:</strong> ${volunteer.total_quantity}</li>
                  </ul>
                </div>
                <div>
                    <button class="edit-btn">Modifier</button>
                    <button class="delete-btn">Supprimer</button>
                </div>
            </div>
            `;

            container.appendChild(div);
        });

    } catch (error) {
        console.error("Erreur displayVolunteers:", error);
    }
};

displayVolunteers();

//& Afficher les profils en submit


document.querySelector(".search-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const city = document.getElementById("citySelect").value;
  const name = document.getElementById("name-input").value.trim();

  const params = new URLSearchParams();
  if (city) params.append("city", city);
  if (name) params.append("name", name);

  try {
    const response = await fetch(`${API_URL}/volunteers/search?${params.toString()}`);
    const data = await response.json();

    const container = document.getElementById("volunteers");
    container.innerHTML = ""; 

    if (data.length === 0) {
      container.innerHTML = "<p>Aucun profil trouvé.</p>";
      return;
    }

    data.forEach(volunteer => {
      const div = document.createElement("div");
      div.classList.add("volunteer-profil");

      div.innerHTML = `
        <div>
          <ul> 
            <li><strong>Nom:</strong> ${volunteer.name}</li>
            <li><strong>Localisation:</strong> ${volunteer.city}</li>
            <li class='collect'><strong>Nombre de déchets collectés:</strong> ${volunteer.total_quantity || 0}</li>
          </ul>
        </div>
      `;
      container.appendChild(div);
    });

  } catch (error) {
    console.error("Erreur recherche :", error);
  }
});


//& Afficher les villes dans select options

async function loadCities() {
    try {
        const response = await fetch(`${API_URL}/cities`);
        const cities = await response.json();

        const select = document.getElementById("citySelect");

        cities.forEach(c => {
            const option = document.createElement("option");
            option.value = c.city;
            option.textContent = c.city;
            select.appendChild(option);
        });
    } catch (err) {
        console.error("Erreur lors du chargement des villes :", err);
    }
}

loadCities();


