const API_URL = 'http://localhost:3000';

//& Afficher la quantité des collectes bénévoles
async function fetchVolunteers() {
  try {
    const response = await fetch(`${API_URL}/quantities`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erreur fetchVolunteers:", error);
    return [];
  }
}

//& Afficher la liste des bénévoles:
const displayVolunteers = async (volunteers = null) => {
  try {
    const dataVolunteers = volunteers || await fetchVolunteers();
    const container = document.getElementById("volunteers");
    container.innerHTML = "";

    if (dataVolunteers.length === 0) {
      container.innerHTML = "<p> Aucun bénévole trouvé.</p>";
      const addVolunteer = document.querySelectorAll('delete-btn')
      addVolunteer.innerHTML = ""
      return;
    }

    dataVolunteers.forEach(volunteer => {
      const div = document.createElement("div");
      div.classList.add("volunteer-profil");

      div.innerHTML = `
          <div class="profil-text">
            <ul> 
              <li><strong>Nom:</strong> ${volunteer.name}</li>
              <li><strong>Localisation:</strong> ${volunteer.city}</li>
              <li class='collect'><strong>Nombre de déchets collectés:</strong> ${volunteer.total_quantity || 0}</li>
            </ul>
          </div>
          <div class="profil-btn">
            <button class="edit-btn">Modifier</button>
            <button class="delete-btn" data-id="${volunteer.id}">Supprimer</button>
          </div>
      `;

      container.appendChild(div);
    });

    //& Supprimer un bénévole:

    document.querySelectorAll(".delete-btn").forEach(button => {
      button.addEventListener("click", async (e) => {
        const id = e.target.dataset.id;
        if (!id) return;

        if (confirm("Voulez-vous vraiment supprimer ce bénévole ?")) {
          try {
            const response = await fetch(`${API_URL}/volunteers/${id}`, { method: "DELETE" });
            const result = await response.json();
            console.log("Suppression:", result);

            if (volunteers) {
              const filtered = volunteers.filter(v => v.id != id);
              displayVolunteers(filtered);
            } else {
              displayVolunteers();
            }
          } catch (error) {
            console.error("Erreur suppression bénévole:", error);
          }
        }
      });
    });

  } catch (error) {
    console.error("Erreur affichage des bénévoles:", error);
  }
};

displayVolunteers();

//& Rechercher les bénévoles par nom et ville, soumettre le formulaire:
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

    displayVolunteers(data);
  } catch (error) {
    console.error("Erreur recherche :", error);
  }
});

//& implanter les villes dans select options: 
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

