const API_URL = "http://localhost:3000";

let id = 1;

// const loadTotal = async (id) => {
//   const total = document.querySelector("#total");
//   const container = document.querySelector(".container");
//   try {
//     const response = await fetch(`${API_URL}/my_collection/${id}`);
//     const data = await response.json();

//     console.log(data);
//     total.innerHTML = `${data[0].volunteer_name} a effectué ${data[0].total_global} collectes au total ! `
//     container.innerHTML = "";
//     for (const item of data) {
//       container.innerHTML += `
//     <h3>${item.category_name}</h3>
//     <h3>${item.total_by_category}</h3>`;
//     }
//   } catch (error) {
//     console.error("Problème de connexion au serveur", error);
//   }
// };
// loadTotal(id);

const searchTotal = async (id, location, date) => {
    try {
    const response = await fetch(`${API_URL}/my_collection/${id}/${location}/${date}`);
    const data = await response.json();

    console.log(data);
    } catch (error) {
    console.error("Problème de connexion au serveur", error);

    }
}
searchTotal(1, "Rouen","2025-09-30");