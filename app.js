
import { Origin, Horoscope } from 'circular-natal-horoscope-js';
import {
  Chart
} from '@astrodraw/astrochart';

// Function to calculate Horoscope data based on provided inputs
function calculateHoroscope(data) {
  const origin = new Origin({
    year: data.year,
    month: data.month,
    date: data.date,
    hour: data.hour,
    minute: data.minute,
    latitude: data.latitude,
    longitude: data.longitude
  });

  return new Horoscope({
    origin: origin,
    houseSystem: "Campanus",
    zodiac: "tropical",
    customOrbs: {},
    language: "en"
  });
}

// Function to extract the UTC date details from a Date object
function getUTCDateDetails(date) {
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth(), // 0 = January, 11 = December
    date: date.getUTCDate(),
    hour: date.getUTCHours(),
    minute: date.getUTCMinutes(),
    latitude: 38.889805, // Default latitude
    longitude: 77.009056 // Default longitude
  };
}

// Function to transform celestial body data into key-value pairs
function getChartPlanetsData(celestialBodies , celestialPoints) {
   var celestialBodiesObj = Object.assign({},
    ...celestialBodies.map((body) => ({
      [capitalizeFirstLetter(body.key)]: [body.ChartPosition.Ecliptic.DecimalDegrees]
    }))
  );

  var celestialPointsObj = Object.assign(
    {},
    ...celestialPoints.map((body) => {
      // Check if the key contains the word "Northnode"
      if (body.key.includes("northnode")) {
        return {
          NNode: [body.ChartPosition.Ecliptic.DecimalDegrees]
        };
      }else if(body.key.includes("lilith")){
        return {
          Lilith: [body.ChartPosition.Ecliptic.DecimalDegrees]
        };
      }
      else if(body.key.includes("southnode")){
        return {
          SNode: [body.ChartPosition.Ecliptic.DecimalDegrees]
      }};
      // Return an empty object for other cases
      return {};
    }).filter(obj => Object.keys(obj).length > 0) // Filter out empty objects
  );
  

  return Object.assign({}, celestialBodiesObj, celestialPointsObj);
}



// Helper function to capitalize the first letter of a string
function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Function to hide specific chart elements by ID
function hideChartElements(elementIds) {
  elementIds.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.style.display = 'none';
    }
  });
}

// Function to draw the astrological chart on the page
function drawChart(data) {
  document.getElementById('paper').innerHTML = ''; // Clear previous chart
  const horoscopeData = calculateHoroscope(data);
  
  const chartPlanets = getChartPlanetsData(horoscopeData.CelestialBodies.all , horoscopeData.CelestialPoints.all); // Extract planet data
  console.log(chartPlanets);
  const asc = horoscopeData.Ascendant.ChartPosition.Horizon.DecimalDegrees;
  const desc = (asc + 180) % 360;
  const mc = horoscopeData.Midheaven.ChartPosition.Horizon.DecimalDegrees;
  const ic = (mc + 180) % 360;
  const chartCusps = [
    0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330
  ];
  // const chartCusps = horoscopeData.Houses.map((cusp) => cusp.ChartPosition.StartPosition.Ecliptic.DecimalDegrees);
  const chartData = {
    planets: chartPlanets,
    cusps: chartCusps
  };

  const chart = new Chart('paper', 1200, 1200);
  const radix = chart.radix(chartData);
  radix.addPointsOfInterest({
    As: [asc],
    Mc: [mc],
    Ds: [desc],
    Ic: [ic]
  });
  radix.aspects();

  hideChartElements(['paper-astrology-radix-axis', 'paper-astrology-radix-cusps']);
  const chartPlanets2 = getPlanetData(horoscopeData); // Extract planet data
  console.log(chartPlanets2);
  renderPlanetInfo(chartPlanets2); // Render planet info in the left section
}


// Initialize the date and time picker using Flatpickr
function initializeDateTimePicker() {
  const currentUTCDate = new Date(new Date().toUTCString());

  const datePicker = flatpickr("#datetime-picker", {
    enableTime: true,
    dateFormat: "Y-m-d H:i",
    defaultDate: currentUTCDate, // Set default date to current UTC time

    onChange: function (selectedDate) {
      const data = getUTCDateDetails(new Date(selectedDate));
      drawChart(data);
    }
  });

  // Open the date picker immediately after initialization
  datePicker.open();
}

document.addEventListener("DOMContentLoaded", initializeDateTimePicker);

// On window load, draw the default chart with the current UTC date and time
window.onload = function () {
  const currentUTCDate = new Date(); // Get current UTC date and time
  const data = getUTCDateDetails(currentUTCDate);
  console.log(data);
  drawChart(data);
  initializeDateTimePicker(); // Initialize the date-time picker after drawing the chart
};


function getPlanetData(horoscopeData) {
  const signs = [{
      name: "Aries",
      icon: "♈"
    },
    {
      name: "Taurus",
      icon: "♉"
    },
    {
      name: "Gemini",
      icon: "♊"
    },
    {
      name: "Cancer",
      icon: "♋"
    },
    {
      name: "Leo",
      icon: "♌"
    },
    {
      name: "Virgo",
      icon: "♍"
    },
    {
      name: "Libra",
      icon: "♎"
    },
    {
      name: "Scorpio",
      icon: "♏"
    },
    {
      name: "Sagittarius",
      icon: "♐"
    },
    {
      name: "Capricorn",
      icon: "♑"
    },
    {
      name: "Aquarius",
      icon: "♒"
    },
    {
      name: "Pisces",
      icon: "♓"
    },
    {
      name: "NNode",
      icon: "☊"
    },
    {
      name: "SNode",
      icon: "☊"
    },
    {
      name: "Lilith",
      icon: "♓"
    },

  ];

  const planetIcons = {
    Sun: '🌞',
    Moon: '🌙',
    Mercury: '☿️',
    Venus: '♀️',
    Mars: '♂️',
    Jupiter: '♃',
    Saturn: '♄',
    Uranus: '♅',
    Neptune: '♆',
    Pluto: '♇',
    Chiron: '⚷',
    Lilith: '☋',
    Sirius: '🌟',
    Northnode: '☊',
    Southnode: '☋',
    Lilith: '⚸'
  };

  const processBodies = (bodies) => {
    return bodies.map((body) => {
      const degree = body.ChartPosition.Ecliptic.DecimalDegrees;
      const signIndex = Math.floor(degree / 30); // 360 degrees divided into 12 signs
      const sign = signs[signIndex];

      return {
        name: capitalizeFirstLetter(body.key),
        degree: degree % 30, // Degree within the sign
        sign: sign.name,
        signIcon: sign.icon,
        planetIcon: planetIcons[capitalizeFirstLetter(body.key)]
      };
    });
  };

  const celestialBodies = horoscopeData.CelestialBodies.all;
  const celestialPoints = horoscopeData.CelestialPoints.all;

  return [...processBodies(celestialBodies), ...processBodies(celestialPoints)];
}

function renderPlanetInfo(planetsData) {
  const planetList = document.querySelector('.left-section ul');
  planetList.innerHTML = ''; // Clear any existing content

  planetsData.forEach((planet) => {
    const listItem = document.createElement('li');
    listItem.innerHTML = `<span class="planet-icon">${planet.planetIcon}</span> ${planet.name}  - in  ${planet.degree.toFixed(2)} ° <span class="zodiac-icon">${planet.signIcon}</span>  ${planet.sign}`;
    planetList.appendChild(listItem);
  });
}

const themeToggle = document.getElementById('theme-toggle');

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-theme'); // Toggle the dark theme class
  themeToggle.textContent = document.body.classList.contains('dark-theme') ? '☀️' : '🌙'; // Change icon
});
