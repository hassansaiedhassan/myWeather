const searchInputSubmit = document.getElementById('searchInputSubmit');
let weatherDiv = document.getElementById('weatherDiv');
let city = 'Cairo';

// Event listener for the search button
searchInputSubmit.addEventListener('click', function () {
  city = document.getElementById('searchInput').value;
  openLoading();
  setTimeout(() => {
    startApp(city);
    closeLoading();
  }, 3000);
});

function openLoading() {
  document.getElementById('loading').style.opacity = 1;
  document.getElementById('loading').style.width = '100%';
  document.getElementById('loading').style.height = '100vh';
}

function closeLoading() {
  document.getElementById('loading').style.opacity = 0;
  document.getElementById('loading').style.width = '0';
  document.getElementById('loading').style.height = '0';
}

// Function to repeat data for today and the next two days
function repeatData(today, nextday, nextDay2) {
  let cartona = '';
  const days = [today, nextday, nextDay2];
  const dayNames = ['Sunday', 'Monday', 'Tuesday']; // Update as per actual day names

  for (let i = 0; i < days.length; i++) {
    const looping = days[i];
    const todayName = dayNames[i];
    cartona += `
      <div class="item me-3 w-75 d-flex justify-content-center align-items-center p-2">
        <div class="card w-33 pt-2 pb-2">
          <div class="header text-center">
            <h1 class="name">${looping.name}</h1> 
            <p class="text-curr">${todayName}</p>
            <div class="icon d-flex justify-content-center align-items-center ">
              <img class="icon-curr img-fluid rounded-5 bg-body-secondary text-bg-danger w-50" src="${looping.icon}" alt="Icon" />
            </div>
            <div class="footer text-center p-2">
              <span class="temp-curr h2">${looping.temp}°C</span>
            </div>
          </div>
          <div class="text-body p-2">
            <div class="row ">
              <div class="col-md-6 text-white">
                <span class="humgradeCurr"><i class="fa-solid fa-umbrella fa-2x"></i> ${looping.humidity}%</span>
              </div>
              <div class="col-md-6  text-white">
                <span class="gradeCurr w-100"><i class="fa-solid fa-wind fa-2x"></i> ${looping.windSpeed}km/h</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
  weatherDiv.innerHTML = cartona;

  // Initialize Owl Carousel
  $('.owl-carousel').trigger('destroy.owl.carousel'); // Destroy the previous instance
  $('.owl-carousel').html(cartona).owlCarousel({
    loop: true,
    
    nav: true,
    dots: true,
    items: 1, // Display one item at a time
    responsive: {
      0: {
        items: 1 // Mobile view
      },
      600: {
        items: 1 // Tablet view
      },
      1000: {
        items: 1 // Desktop view
      }
    }
  });
}

// Function to fetch weather data from the API
async function getData(city) {
  try {
    let response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=a1e0ad7d3337473f912114859243108&q=${city}&days=3&aqi=no&alerts=no`);

    if (!response.ok) throw new Error('Failed word ');
    let data = await response.json();
    console.log(data);
    return data;

  } catch (error) {
    document.getElementById('Error').innerHTML = `
      <div class="alert alert-danger mb-5">
        <p>${error.message}</p>
      </div>`;
  }
}

// Function to start the app and render data
async function startApp(inputtype) {
  let data = await getData(inputtype);
  
  if (!data) return;

  let today = {
    name: data.location.name,
    date: data.location.localtime.split(' ')[0],
    icon: data.current.condition.icon,
    temp: data.current.temp_c,
    humidity: data.current.humidity,
    windSpeed: data.current.wind_kph,
    pressure: data.current.pressure_mb
  };

  let nextday = {
    name: data.location.name,
    icon: data.forecast.forecastday[1].day.condition.icon,
    temp: data.forecast.forecastday[1].day.avgtemp_c,
    humidity: data.forecast.forecastday[1].day.avghumidity,
    windSpeed: data.forecast.forecastday[1].day.maxwind_kph,
    pressure: data.forecast.forecastday[1].day.maxpressure_mb
  };

  let nextDay2 = {
    name: data.location.name,
    icon: data.forecast.forecastday[2].day.condition.icon,
    temp: data.forecast.forecastday[2].day.avgtemp_c,
    humidity: data.forecast.forecastday[2].day.avghumidity,
    windSpeed: data.forecast.forecastday[2].day.maxwind_kph,
    pressure: data.forecast.forecastday[2].day.maxpressure_mb
  };

  repeatData(today, nextday, nextDay2);
}

$(document).ready(function(){
  startApp(city);
});
