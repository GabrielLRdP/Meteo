//fonction qui récupère les données météorologies actuelles à une position données via l'API OpenWeathermap
async function getWeatherData(cityData) {

    
    let lat = 48.866667;
    let lon = 2.333333;
    

    if (cityData !== undefined) {
      lat = cityData.lat;
      lon = cityData.lon;
      console.log(cityData);
    };
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

async function displayWeatherData(data,cityData) {

    // récupération des données dans le fichier Json et création des variables pour les données actuelles 
    const description = data.weather[0].description;
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
function addressAutocomplete(containerElement, callback, options) {

  const MIN_ADDRESS_LENGTH = 3;
  const DEBOUNCE_DELAY = 300;

  // create container for input element
  const inputContainerElement = document.createElement("div");
  inputContainerElement.setAttribute("class", "input-container");
  containerElement.appendChild(inputContainerElement);

  // create input element
  const inputElement = document.createElement("input");
  inputElement.setAttribute("type", "text");
  inputElement.setAttribute("placeholder", options.placeholder);
  inputContainerElement.appendChild(inputElement);

  // add input field clear button
  const clearButton = document.createElement("div");
  clearButton.classList.add("clear-button");
  addIcon(clearButton);
  clearButton.addEventListener("click", (e) => {
    e.stopPropagation();
    inputElement.value = '';
    callback(null);
    clearButton.classList.remove("visible");
    closeDropDownList();
  });
  inputContainerElement.appendChild(clearButton);

  /* We will call the API with a timeout to prevent unneccessary API activity.*/
  let currentTimeout;

  /* Save the current request promise reject function. To be able to cancel the promise when a new request comes */
  let currentPromiseReject;

  /* Focused item in the autocomplete list. This variable is used to navigate with buttons */
  let focusedItemIndex;

  /* Process a user input: */
  inputElement.addEventListener("input", function(e) {
    const currentValue = this.value;

    /* Close any already open dropdown list */
    closeDropDownList();


    // Cancel previous timeout
    if (currentTimeout) {
      clearTimeout(currentTimeout);
    }

    // Cancel previous request promise
    if (currentPromiseReject) {
      currentPromiseReject({
        canceled: true
      });
    }

    if (!currentValue) {
      clearButton.classList.remove("visible");
    }

    // Show clearButton when there is a text
    clearButton.classList.add("visible");

    // Skip empty or short address strings
    if (!currentValue || currentValue.length < MIN_ADDRESS_LENGTH) {
      return false;
    }

    /* Call the Address Autocomplete API with a delay */
    currentTimeout = setTimeout(() => {
      currentTimeout = null;

      /* Create a new promise and send geocoding request */
      const promise = new Promise((resolve, reject) => {
        currentPromiseReject = reject;

        // The API Key provided is restricted to JSFiddle website
        // Get your own API Key on https://myprojects.geoapify.com
        const apiKey = "6e865bcd5dfb42638a9dd1c74b62c665";

        var url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(currentValue)}&format=json&limit=5&apiKey=${apiKey}`;

        fetch(url)
          .then(response => {
            currentPromiseReject = null;

            // check if the call was successful
            if (response.ok) {
              response.json().then(data => resolve(data));
            } else {
              response.json().then(data => reject(data));
            }
          });
      });

      promise.then((data) => {
        // here we get address suggestions
        let currentItems = data.results;

        /*create a DIV element that will contain the items (values):*/
        const autocompleteItemsElement = document.createElement("div");
        autocompleteItemsElement.setAttribute("class", "autocomplete-items");
        inputContainerElement.appendChild(autocompleteItemsElement);

        /* For each item in the results */
        data.results.forEach((result, index) => {
          /* Create a DIV element for each element: */
          const itemElement = document.createElement("div");
          /* Set formatted address as item value */
          itemElement.innerHTML = result.formatted;
          autocompleteItemsElement.appendChild(itemElement);

          /* Set the value for the autocomplete text field and notify: */
          itemElement.addEventListener("click", function(e) {
            inputElement.value = currentItems[index].formatted;
            callback(currentItems[index]);
            /* Close the list of autocompleted values: */
            closeDropDownList();
          });
        });

      }, (err) => {
        if (!err.canceled) {
          console.log(err);
        }
      });
    }, DEBOUNCE_DELAY);
  });

  /* Add support for keyboard navigation */
  inputElement.addEventListener("keydown", function(e) {
    var autocompleteItemsElement = containerElement.querySelector(".autocomplete-items");
    if (autocompleteItemsElement) {
      var itemElements = autocompleteItemsElement.getElementsByTagName("div");
      if (e.keyCode == 40) {
        e.preventDefault();
        /*If the arrow DOWN key is pressed, increase the focusedItemIndex variable:*/
        focusedItemIndex = focusedItemIndex !== itemElements.length - 1 ? focusedItemIndex + 1 : 0;
        /*and and make the current item more visible:*/
        setActive(itemElements, focusedItemIndex);
      } else if (e.keyCode == 38) {
        e.preventDefault();

        /*If the arrow UP key is pressed, decrease the focusedItemIndex variable:*/
        focusedItemIndex = focusedItemIndex !== 0 ? focusedItemIndex - 1 : focusedItemIndex = (itemElements.length - 1);
        /*and and make the current item more visible:*/
        setActive(itemElements, focusedItemIndex);
      } else if (e.keyCode == 13) {
        /* If the ENTER key is pressed and value as selected, close the list*/
        e.preventDefault();
        if (focusedItemIndex > -1) {
          closeDropDownList();
        }
      }
    } else {
      if (e.keyCode == 40) {
        /* Open dropdown list again */
        var event = document.createEvent('Event');
        event.initEvent('input', true, true);
        inputElement.dispatchEvent(event);
      }
    }
  });

  function setActive(items, index) {
    if (!items || !items.length) return false;

    for (var i = 0; i < items.length; i++) {
      items[i].classList.remove("autocomplete-active");
    }

    /* Add class "autocomplete-active" to the active element*/
    items[index].classList.add("autocomplete-active");

    // Change input value and notify
    inputElement.value = currentItems[index].formatted;
    callback(currentItems[index]);
  }

  function closeDropDownList() {
    const autocompleteItemsElement = inputContainerElement.querySelector(".autocomplete-items");
    if (autocompleteItemsElement) {
      inputContainerElement.removeChild(autocompleteItemsElement);
    }

    focusedItemIndex = -1;
  }

  function addIcon(buttonElement) {
    const svgElement = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
    svgElement.setAttribute('viewBox', "0 0 24 24");
    svgElement.setAttribute('height', "24");

    const iconElement = document.createElementNS("http://www.w3.org/2000/svg", 'path');
    iconElement.setAttribute("d", "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z");
    iconElement.setAttribute('fill', 'currentColor');
    svgElement.appendChild(iconElement);
    buttonElement.appendChild(svgElement);
  }
  
    /* Close the autocomplete dropdown when the document is clicked. 
      Skip, when a user clicks on the input field */
  document.addEventListener("click", function(e) {
    if (e.target !== inputElement) {
      closeDropDownList();
    } else if (!containerElement.querySelector(".autocomplete-items")) {
      // open dropdown list again
      var event = document.createEvent('Event');
      event.initEvent('input', true, true);
      inputElement.dispatchEvent(event);
    }
  });
  


}
async function addressAutocompletePromise(containerElement, options) {
  return new Promise((resolve) => {
    addressAutocomplete(containerElement, (selectedLocation) => {
      resolve(selectedLocation);
    }, options);
  });
}

async function main() {
  // Utilisez la promesse pour attendre la sélection de la localisation
  let selectedLocation = await addressAutocompletePromise(document.getElementById("autocomplete-container"), {
    placeholder: "Entrez un lieu ici"
  });

  let weatherData = await getWeatherData(selectedLocation);
  let weatherForecast = await getWeatherForecast(selectedLocation);
  displayWeatherData(weatherData);
  displayWeatherForecast(weatherForecast);
}

async function init() {
  let weatherData = await getWeatherData();
  let weatherForecast = await getWeatherForecast();
  displayWeatherData(weatherData);
  displayWeatherForecast(weatherForecast);
}
init();
main();




