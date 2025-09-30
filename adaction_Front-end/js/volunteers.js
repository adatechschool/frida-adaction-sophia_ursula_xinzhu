let paramString = window.location.search;
let searchParams = new URLSearchParams(paramString);

const city = searchParams.get('city-list')
const name = searchParams.get('name-input')

const API_URL = 'http://localhost:3000'


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

async function fetchQuantities() {
    try {
        const response = await fetch(`${API_URL}/quantities`)
        const data = await response.json()
        console.log(data)
        return data

    } catch (error) {
        console.log(error)
    }
}

const profils = document.querySelectorAll('.volunteer-profil')

const displayVolunteers = async () => {
    try {
        const dataVolunteers = await fetchQuantities();

        profils.forEach((item, index) => {
            const volunteer = dataVolunteers[index];

            if (!volunteer) return;

            item.innerHTML = `
        <div>
        <ul> 
        <li> Nom: ${volunteer.name}</li>
        <li> Localisation: ${volunteer.city}</li>
        <li class='collect'> Nombre de déchets collectés : ${volunteer.total_quantity} </li>
        </ul>
        </div>
        <button id="edit-btn"> modiifier </button>
        <button id="delete-btn"> supprimer </button>
        
        `
        })

    } catch (error) {
        console.log(error)

    }


}

displayVolunteers()


