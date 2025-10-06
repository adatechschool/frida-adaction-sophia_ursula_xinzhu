const API_URL = 'http://localhost:3000';
const volunteerForm = document.getElementById("volunteer-form");

volunteerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const volunteerName = document.getElementById("name").value.trim();
    const volunteerCity = document.getElementById("city").value.trim();

    try {
        const response = await fetch(`${API_URL}/volunteers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: volunteerName, city: volunteerCity }),
        });

        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }

        const data = await response.json();
        alert('Bénévole ajouté avec succès !');
        volunteerForm.reset();

    } catch (error) {
        console.error("Erreur lors de l'ajout du bénévole :", error);
        alert("Échec de l'ajout du bénévole. Veuillez réessayer.");
    }
});