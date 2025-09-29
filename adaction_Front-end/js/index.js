const API_URL = 'http://localhost:3000'


async function fetchVolunteers() {
    const response = await fetch(`${API_URL}/volunteers`)
    const data = await response.json()
    console.log(data)
    
}

fetchVolunteers()