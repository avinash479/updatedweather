async function fetchForecast(cityName, countryCode) {
  const apiKey = "ea4e21a356824b3eb9964d673e3e3078"; // Replace with your actual API key
  const url = `https://api.weatherbit.io/v2.0/forecast/daily?city=${encodeURIComponent(cityName)},${encodeURIComponent(countryCode)}&key=${apiKey}&days=16`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log(data); // Log the full API response for debugging

    if (!data || !data.data || data.data.length === 0) {
      alert("City not found! Please enter a valid city name and country code.");
      return;
    }

    document.getElementById("cityNameDisplay").textContent = `Weather Forecast for ${cityName}, ${countryCode}`;
    displayForecast(data.data);
    plotTemperatureChart(data.data); // Plot the temperature chart
    plotHumidityChart(data.data);    // Plot the humidity chart
    plotWindSpeedChart(data.data);   // Plot the wind speed chart
  } catch (error) {
    console.error("Error fetching forecast data:", error);
    alert("There was an error fetching the weather data. Please try again.");
  }
}

function displayForecast(forecastList) {
  const forecastContainer = document.getElementById("forecast");
  forecastContainer.innerHTML = ""; // Clear previous content

  forecastList.forEach((day) => {
    // Format the date to a more readable format (e.g., 'dd-mm-yyyy')
    const formattedDate = new Date(day.datetime).toLocaleDateString('en-GB'); // "dd/mm/yyyy" format
    const weatherIcon = `https://weatherbit.io/static/img/icons/${day.weather?.icon}.png`;
    const description = day.weather?.description || "No data";
     console.log(description);
    const cardHTML = `
    <div class="col">
        <div class="card h-100 shadow-sm">
            <div class="card-header text-center bg-primary text-white">
                <h5 class="card-title">${formattedDate}</h5>
            </div>
            <div class="card-body text-center">
                <img src="${weatherIcon}" alt="${description}" class="mb-3" style="width: 50px;">
                <h6>${description}</h6>
                <p><strong>Temp:</strong> ${day.temp}°C</p>
                <p><strong>Min:</strong> ${day.min_temp}°C | <strong>Max:</strong> ${day.max_temp}°C</p>
                <p><strong>Humidity:</strong> ${day.rh}%</p>
                <p><strong>Wind:</strong> ${day.wind_spd} m/s</p>
            </div>
        </div>
    </div>
    `;
    forecastContainer.insertAdjacentHTML("beforeend", cardHTML);
  });
}

// Plot temperature chart using Chart.js
function plotTemperatureChart(forecastList) {
  const ctx = document.getElementById("weatherChart").getContext("2d");
  const labels = forecastList.map(day =>
    new Date(day.datetime).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) // e.g., '06 Dec'
  );
  const temps = forecastList.map(day => day.temp);

  // Clear previous chart instance if it exists
  if (window.weatherChartInstance) {
    window.weatherChartInstance.destroy();
  }

  // Create the new chart
  window.weatherChartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Daily Temperature (°C)",
          data: temps,
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          tension: 0.3,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: false,
        },
      },
    },
  });
}

// Plot humidity chart using Chart.js
// Plot humidity chart using Chart.js
function plotHumidityChart(forecastList) {
  const ctx = document.getElementById("humidityChart").getContext("2d");
  const labels = forecastList.map(day =>
    new Date(day.datetime).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) // e.g., '06 Dec'
  );
  const humidity = forecastList.map(day => day.rh);

  // Clear previous chart instance if it exists
  if (window.humidityChartInstance) {
    window.humidityChartInstance.destroy();
  }

  // Create the new chart for humidity
  window.humidityChartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Daily Humidity (%)",
          data: humidity,
          borderColor: "rgba(255, 159, 64, 1)",
          backgroundColor: "rgba(255, 159, 64, 0.2)",
          tension: 0.3,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          ticks: {
            maxRotation: 0, // Prevents the labels from rotating
            minRotation: 0, // Ensures labels remain horizontal
            font: {
              size: 12, // Adjust font size for better readability
            },
            padding: 5, // Adds some space between the labels and the axis line
          },
        },
        y: {
          beginAtZero: true,
          max: 100, // Adjust the max value as needed
        },
      },
      plugins: {
        legend: {
          labels: {
            font: {
              size: 14, // Adjusts the legend font size
            },
          },
        },
      },
    }
  });
}


// Plot wind speed chart using Chart.js
function plotWindSpeedChart(forecastList) {
  const ctx = document.getElementById("windSpeedChart").getContext("2d");
  const labels = forecastList.map(day =>
    new Date(day.datetime).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) // e.g., '06 Dec'
  );
  const windSpeed = forecastList.map(day => day.wind_spd);

  // Clear previous chart instance if it exists
  if (window.windSpeedChartInstance) {
    window.windSpeedChartInstance.destroy();
  }

  // Create the new chart for wind speed
  window.windSpeedChartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Daily Wind Speed (m/s)",
          data: windSpeed,
          borderColor: "rgba(54, 162, 235, 1)",
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          tension: 0.3,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

document.getElementById("cityForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const cityValue = document.getElementById("city").value.trim();
  const countryValue = document.getElementById("country").value.trim();

  if (cityValue && countryValue) {
    fetchForecast(cityValue, countryValue);
  } else {
    alert("Please enter both a city name and a country code.");
  }
});

// Fetch forecast for a default city and country (e.g., Hyderabad, India)
fetchForecast("Hyderabad", "IN");
