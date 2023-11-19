async function test_API() {
    const lat = 48.866667;
    const lon = 2.333333;
    const exclude = "";
    const apiKey = "164a233102ef1695c66fa04eba9244de";

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Erreur de l'API: ${response.statusText}`);
        }

        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error("Erreur lors de la récupération des données de l'API:", error);
    }
}

test_API();