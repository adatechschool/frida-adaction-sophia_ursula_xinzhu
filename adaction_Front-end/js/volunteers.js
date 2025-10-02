const API_URL = "http://localhost:3000";

// ---------------------- FETCH DATA ----------------------

//& Récupérer tous les bénévoles
async function fetchVolunteers() {
  try {
    const res = await fetch(`${API_URL}/volunteers`);
    return await res.json();
  } catch (err) {
    console.error("Erreur fetchVolunteers:", err);
    return [];
  }
}

//& Récupérer les villes
async function fetchCities() {
  try {
    const res = await fetch(`${API_URL}/cities`);
    return await res.json();
  } catch (err) {
    console.error("Erreur fetchCities:", err);
    return [];
  }
}

// ---------------------- AFFICHAGE ----------------------

//& Afficher la liste des bénévoles
async function displayVolunteers(volunteers = null) {
  const data = volunteers || await fetchVolunteers();
  const container = document.getElementById("volunteers");
  container.innerHTML = "";

  if (data.length === 0) {
    container.innerHTML = "<p>Aucun profil trouvé.</p>";
    return;
  }

  data.forEach(v => {
    const div = document.createElement("div");
    div.className = "volunteer-profil";

    div.innerHTML = `
      <div class="profil-box">
        <div>
          <ul>
            <li><strong>Nom:</strong> ${v.name}</li>
            <li><strong>Ville:</strong> ${v.city}</li>
            <li><strong>Déchets collectés:</strong> ${v.total_quantity}</li>
          </ul>
        </div>
        <div>
          <button class="edit-btn">Modifier</button>
          <button class="delete-btn" data-id="${v.id}">Supprimer</button>
        </div>
      </div>
    `;

    container.appendChild(div);
  });

  deleteVolunteers();
}

// ---------------------- SUPPRESSION ----------------------

//& Supprimer un Bénévole
function deleteVolunteers() {
  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", async e => {
      const id = e.target.dataset.id;
      if (!id) return;

      // Confirmation personnalisée
      if (!confirm("Voulez-vous vraiment supprimer ce bénévole ?")) return;

      try {
        const res = await fetch(`${API_URL}/volunteers/${id}`, { method: "DELETE" });
        const result = await res.json();
        console.log("Suppression:", result);

        displayVolunteers(); // recharger la liste
      } catch (err) {
        console.error("Erreur suppression:", err);
      }
    });
  });
}

// ---------------------- RECHERCHE ----------------------


//& Rechercher les bénévoles selon la ville et le nom :
document.querySelector(".search-form").addEventListener("submit", async e => {
  e.preventDefault();

  const city = document.getElementById("citySelect").value;
  const name = document.getElementById("name-input").value.trim();

  const params = new URLSearchParams();
  if (city) params.append("city", city);
  if (name) params.append("name", name);

  try {
    const res = await fetch(`${API_URL}/volunteers/search?${params}`);
    const data = await res.json();
    displayVolunteers(data);
  } catch (err) {
    console.error("Erreur recherche:", err);
  }
});

// ---------------------- INITIALISATION ----------------------

//& Implanter les villes dans select options:
async function loadCities() {
  const cities = await fetchCities();
  const select = document.getElementById("citySelect");

  cities.forEach(c => {
    const option = document.createElement("option");
    option.value = c.city;
    option.textContent = c.city;
    select.appendChild(option);
  });
}

// Lancer l’app
loadCities();
displayVolunteers();


