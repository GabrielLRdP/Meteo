
//fonction qui récupère les données météorologies actuelles à une position données via l'API OpenWeathermap
async function getWeatherData() {

    const lat = 48.866667;
    const lon = 2.333333;
    const apiKey = "164a233102ef1695c66fa04eba9244de";
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=fr&appid=${apiKey}`;
    const response = await fetch(url);

    return await response.json();

}
//fonction qui récupère les données météorologies prévisionelles à une position données via l'API OpenWeathermap
async function getWeatherForecast() {

    const lat = 48.866667;
    const lon = 2.333333;
    const apiKey = "164a233102ef1695c66fa04eba9244de";
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=fr&appid=${apiKey}`;
    const response = await fetch(url);

    return await response.json();

}

async function displayWeatherData(data,forecast) {

    // récupération des données dans le fichier Json et création des variables pour les données actuelles 
    const description = data.weather[0].description;
    const name = data.name;
    const temp = Math.round(data.main.temp);
    const icon = data.weather[0].icon;
    const windspeed = Math.round(data.wind.speed*3.6);
    const lieu = data.name;

    


    
    
    //récupération des horaires de levé et couché du soleil puis converion en hh:mm
    const sunriseData = new Date(data.sys.sunrise*1000);
    const heureLeveSoleil = sunriseData.getHours();
    const minutesLeveSoleil = sunriseData.getMinutes();
    const sunriseTime = `${heureLeveSoleil}h${minutesLeveSoleil}`

    const sunsetData = new Date(data.sys.sunset*1000);
    const heureCoucheSoleil = sunsetData.getHours();
    const minutesCoucheSoleil = sunsetData.getMinutes();
    const sunsetTime = `${heureCoucheSoleil}h${minutesCoucheSoleil}`

    // récupération du jour et de l'heure actuelle et converstion en jour hh:mm avec le bon format
    const currentDate = new Date();
    const currentDay = currentDate.toLocaleDateString('fr-FR', { weekday: 'long' });
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const dateFormate = currentDate.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });

    // Ajoute un zéro devant si l'heure ou les minutes sont inférieures à 10 et corrige l'affichage pour éviter les 1h1
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const heureActuelle = `${formattedHours}h${formattedMinutes}`

    
    // intégration des éléments dans le DOM 

    //partie centrale avec la température et l'icone
    let affichage_temperature = document.querySelector(".temperature");
    affichage_temperature.innerHTML = 
        `${temp}°
        <img src = "https://openweathermap.org/img/wn/${icon}@2x.png">
        <span class= "minuscule">${description}</span>`
        

    // partie à gauche avec le vent, l'heure de levé et couché du soleil
    let affichage_gauche = document.querySelector(".details");
    affichage_gauche.innerHTML = `
        
        Vent: ${windspeed}km/h<br>
        Levé du soleil: ${sunriseTime}<br>
        Couché du soleil: ${sunsetTime}<br>
        `

    // partie à droite avec le lieu, la date et l'heure 
    let affichage_droite = document.querySelector(".lieu");
    affichage_droite.innerHTML = `
        ${lieu}<br>
        ${currentDay} ${dateFormate}<br>
        ${heureActuelle}
    
    `
}

async function displayWeatherForecast(forecast){

    let previsions = document.querySelector(".previsions");
    let listeJours = ["Demain", "Après demain"];
    let jour = 0;
    let aujourdhui = new Date();

    
    // variable qui va permettre d'aller chercher le bon indice dans les données de forecast (on augmente l'index de 8 par 24h)
    let nbJoursForecast = 4*8+8; // 2*8+8 va permettre d'aller chercher les data de j+1 et j+2, pour j+3, changer 2*8+8 par 3*8+8 ect.

    for (let i = 8; i  < nbJoursForecast; i = i + 8){
        let tempDemain = Math.round(forecast.list[i].main.temp);
        let iconDemain = forecast.list[i].weather[0].icon;
        let descriptionDemain = forecast.list[i].weather[0].description;

        let jourLettre = new Date();
        jourLettre.setDate(aujourdhui.getDate() + (i / 8));

        let nomJour = jourLettre.toLocaleDateString('fr-FR', { weekday: 'long' });

        if (i == 8){
            nomJour = "Demain";
        }

        if (i == 16){
            nomJour = "Après demain";
        }

        let previsionJour = document.createElement("div");
        previsionJour.innerHTML = `
            ${nomJour} : ${tempDemain}° ${descriptionDemain}
            <img src="https://openweathermap.org/img/wn/${iconDemain}@2x.png" alt=""><br>
        `
        previsions.appendChild(previsionJour);
    
        

    }

}

async function main () {
    const weatherData = await getWeatherData();
    const weatherForecast = await getWeatherForecast();
    console.log(weatherForecast);
    displayWeatherData(weatherData);
    displayWeatherForecast(weatherForecast);

}

main();


