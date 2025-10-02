const API_URL = "http://localhost:3000";

const createCollection = async (name, date, location,arr) => {
  try {
    const response = await fetch(`${API_URL}/add_collection`, {
      method: "POST",
      headers: { "Content-Type": "application/json" }, //! je précise au serveur que je vais envoyer les data en fromat json
      body: JSON.stringify({
        volunteers_name: name,
        collections_date: date,
        collections_location: location,
        quantities: arr,
      }),
    });
    const data = await response.json();
    alert(`${data.message}`);
  } catch (error) {
    console.log("Having difficulty connecting to api.", error);
  }
};
//fonction pour afficher la templates catégories déchets
const loadCategories = async () => {
  const container = document.querySelector(".grid");
  try {
    const response = await fetch(`${API_URL}/categories`);
    const data = await response.json();
    console.log(data);
    container.innerHTML = "";
    for (const item of data) {
      container.innerHTML += `<div>
      <h2>${item.name}</h2>
      <button class="decrease"> - </button>
      <input class="quantity" type="number" placeholder = "Entrez un nombre">
      <button class="add"> + </button>
      </div>`;
    }

    getUserInput();
  } catch (error) {
    console.log("Having difficulty connecting to api.", error);
  }
};
loadCategories();
//fonction qui permet de collecter tous les input nécessaire pour un post createCollection
const getUserInput = () => {
  document.querySelector("#add").addEventListener("click", () => {
    const name = document.querySelector("#name").value;
    const location = document.querySelector("#city").value;
    const date = document.querySelector("#date").value;
    const quantities = document.querySelectorAll(".quantity");
    let quantityArr = [];
    for (const item of quantities) {
      quantityArr.push(item.value);
    }
    let newArr = quantityArr.map(Number);
    console.log(newArr);

    createCollection(name,date,location,newArr);
  });
};
