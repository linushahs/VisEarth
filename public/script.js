window.onload = () => {
  showBarChart();
  showLineChart();
};

// Fetching from api
//Get weather function (async)
async function getWeather(lat = 52.52, lon = 13.41) {
  url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum,snowfall_sum,windspeed_10m_max,windgusts_10m_max,winddirection_10m_dominant&timezone=auto`;
  const response = await fetch(url);
  const weatherData = await response.json();
  return weatherData;
}

const btns = document.querySelectorAll(".btn");
let tempData = [14, 15, 12, 13, 17, 18, 11];

function collapseBtn() {
  btns.forEach((btn) => {
    btn.classList.remove("is-active");
  });
}

//Function to remove canvas and create new canvas
function resetCanvas() {
  const oldCanv = document.getElementById("lc");
  const oldCanvBC = document.getElementById("bc");
  const container = document.querySelector(".lc-graph");
  const containerBC = document.querySelector(".bc-graph");
  container.removeChild(oldCanv);
  containerBC.removeChild(oldCanvBC);

  //creating new canvas in the document (line chart)
  const newCanv = document.createElement("canvas");
  newCanv.id = "lc";
  newCanv.width = "500";
  newCanv.height = "350";
  //creating new canvas in the document (bar chart)
  const newCanvBC = document.createElement("canvas");
  newCanvBC.id = "bc";
  newCanvBC.width = "550";
  newCanvBC.height = "350";
  container.appendChild(newCanv);
  containerBC.appendChild(newCanvBC);
}

//Get the selected option weather data: getReqData()
function getReqData(id, weatherData) {
  let arr;
  switch (id) {
    case "max-temp":
      arr = weatherData.daily.temperature_2m_max;
      break;
    case "min-temp":
      arr = weatherData.daily.temperature_2m_min;
      break;
    case "prec":
      arr = weatherData.daily.precipitation_sum;
      break;
    case "max-ptemp":
      arr = weatherData.daily.apparent_temperature_max;
      break;
    case "min-ptemp":
      arr = weatherData.daily.apparent_temperature_min;
      break;
    case "wind-speed":
      arr = weatherData.daily.windspeed_10m_max;
      break;
    case "snow-rate":
      arr = weatherData.daily.snowfall_sum;
      break;
    case "wind-gusts":
      arr = weatherData.daily.windgusts_10m_max;
      break;
    case "wind-dir":
      arr = weatherData.daily.winddirection_10m_dominant;
      break;
    default:
      break;
  }
  return arr;
}

//Get the label function
function getLabel(id) {
  let label;
  if (id == "max-temp" || id == "min-temp") {
    label = "Temperature";
  } else if (id == "max-ptemp" || id == "min-ptemp") {
    label = "Perceived Temperature";
  } else if (id == "prec") {
    label = "Precipitation";
  } else if (id == "snow-rate") {
    label = "Snowfall Rate";
  } else if (id == "wind-speed") {
    label = "Wind Speed";
  } else if (id == "wind-gusts") {
    label = "Wind Gusts";
  } else if (id == "wind-dir") {
    label = "Wind Direction";
  }
  return label;
}

//Onclick functionality of button
btns.forEach((btn) => {
  btn.onclick = async (e) => {
    e.preventDefault();
    //collapse active class from other buttons
    collapseBtn();
    //first add the active class to button
    btn.classList.add("is-active");
    //Reset canvas
    resetCanvas();
    const weatherData = await getWeather();
    let id = btn.id;
    //Get the required weather data (options)
    const arr = getReqData(id, weatherData);

    tempData = [...arr];
    let label = getLabel(id);
    showLineChart(label);
    showBarChart(label);
  };
});

// For Line chart
// ************************************************
const labelsOfLC = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function showLineChart(lbl = "Temperature") {
  const data1 = {
    labels: labelsOfLC,
    datasets: [
      {
        label: lbl,
        backgroundColor: "#ff7551",
        borderColor: "#353340",
        data: tempData,
        pointRadius: 5,
      },
    ],
  };

  const config1 = {
    type: "line",
    data: data1,
  };

  const myChart1 = new Chart(document.getElementById("lc"), config1);
}

// For bar chart
// ****************************************************************
function showBarChart(lbl = "Temperature") {
  const data2 = {
    labels: labelsOfLC,
    datasets: [
      {
        label: lbl,
        data: tempData,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(255, 205, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(201, 203, 207, 0.2)",
        ],
        borderColor: [
          "rgb(255, 99, 132)",
          "rgb(255, 159, 64)",
          "rgb(255, 205, 86)",
          "rgb(75, 192, 192)",
          "rgb(54, 162, 235)",
          "rgb(153, 102, 255)",
          "rgb(201, 203, 207)",
        ],
        borderWidth: 1,
      },
    ],
  };
  const config2 = {
    type: "bar",
    data: data2,
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  };
  const myChart2 = new Chart(document.getElementById("bc"), config2);
}

// Search data based on latitude and longitude
// ****************************************************************
const searchBtn = document.getElementById("search-btn");
const lat = document.getElementById("latitude");
const lon = document.getElementById("longitude");

searchBtn.onclick = async () => {
  const weatherData = await getWeather(lat.value, lon.value);
  const selectedElem = document.querySelector(".sidebar-link.is-active");

  resetCanvas();
  const data = getReqData(selectedElem.id, weatherData);
  tempData = [...data];

  //Get the label of data set
  let label = getLabel(selectedElem.id);
  showLineChart(label);
  showBarChart(label);
};
