const stationURL = "https://api.meteostat.net/v2/stations/search";
const dataURL = "https://api.meteostat.net/v2/stations/daily";
const ctx = document.getElementById('chart').getContext('2d');
let overOneDataSet = false;

const myChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [],
      datasets: [{
        label: "",
        data: [],
        fill: false,
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }]
    },

    options: {
      responsive: true,
      scales: {
        xAxes: [{
          ticks: {
            maxTicksLimit: 10,
          }
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: "Temperature in Celsius",
            padding: 20
          }
        }]
      }
    }
});

async function getData() {
  const city = document.getElementById('city').value;
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;
  if(!(city && startDate && endDate))  {
    alert('Please input all data.');
    return;
  }
  let url = new URL(stationURL);
  url.search = new URLSearchParams({
    query: city
  });
  let promise = await fetch(url, {
    method: "GET",
    headers: {
      "x-api-key": "lEoCLK3HgFzYU6oqepEkRZN8YolotzkA"
    },
  });
  let data = await promise.json();
  if (!data.data) {
    alert('No data available for the city.');
    return; 
  }
  const stationID = data.data[0].id;
  const graphData = await retrieveData(stationID, startDate, endDate); 
  if (!graphData) return; 
  updateChart(graphData, city);
}

async function retrieveData(id, start, end) {
  const xDates = [];
  const yTemps = [];

  let url = new URL(dataURL);
  url.search = new URLSearchParams({
    station: id,
    start: start,
    end: end
  });
  let promise = await fetch(url, {
    method: "GET",
    headers: {
      "x-api-key": "lEoCLK3HgFzYU6oqepEkRZN8YolotzkA"
    },
  });
  let data = await promise.json();
  if (data.data && data.data[0].tavg) {
    for (day of data.data) {
      xDates.push(day.date);
      yTemps.push(day.tavg);
    }
    return { xDates, yTemps };
    } else {
        alert("No data available for this city.");
        return false;
    }
}

function updateChart(inputData, cityName) {
  if (overOneDataSet) {
    const newData = {
      label: `Average daily temperature in ${cityName}`,
      data: inputData.yTemps,
      fill: false,
      borderColor: random_rgba(),
      borderWidth: 1
    };
    myChart.data.datasets.push(newData);
    myChart.data.labels = inputData.xDates;
    myChart.update();
  } else {
      myChart.data.labels = inputData.xDates;
      myChart.data.datasets[0].label = `Average daily temperature in ${cityName}`;
      myChart.data.datasets[0].data.push(...inputData.yTemps);
      myChart.update();
      overOneDataSet = true;
    }
}

function clearCurrentGraph() {
  myChart.data.labels = [];
  myChart.data.datasets = [{
    label: "",
    data: [],
    fill: false,
    borderColor: 'rgba(255, 99, 132, 1)',
    borderWidth: 1
  }];
  myChart.update();
  overOneDataSet = false;
}

function random_rgba() {
  const rnd = () => Math.round(Math.random() * 255);
  return `rgba(${rnd()}, ${rnd()}, ${rnd()}, 1)`;
}

