const API_URL = "http://localhost:3000";


const createCollection = async () => {
  try {
    const response = await fetch(`${API_URL}/add_collection`, {
      method: "POST",
      headers: { "Content-Type": "application/json" }, //! je précise au serveur que je vais envoyer les data en fromat json
      body: JSON.stringify({
        volunteers_name: "Xinzhu",
        collections_date: "2025-09-30",
        collections_location: "Rouen",
        quantities: [5, 4, 5, 4, 5],
      }),
    });
    const data = await response.json();
    alert(`${data.message}`);
  } catch (error) {
    console.log("Having difficulty connecting to api.", error);
  }
};
document.querySelector("#add").addEventListener("click", createCollection);
