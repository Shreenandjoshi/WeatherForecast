const stationURL = "https://api.meteostat.net/v2/stations/search";
const dataURL = "https://api.meteostat.net/v2/stations/daily";
const ctx = document.getElementById('chart').getContext('2d');
let isCelsius = true;

let myChart = new Chart(ctx, {
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
        headers: {
            "x-api-key": "lEoCLK3HgFzYU6oqepEkRZN8YolotzkA"
        },
    });
    let data = await promise.json();
    if (!data.data) {
        alert('No data available for the city.');
        return; 
    } // if no data return function
    const stationID = data.data[0].id; // just pick the id of the first station
    const graphData = await retrieveData(stationID, startDate, endDate); // makes sure that we have data before chart loads
    if (!graphData) return; // if no data from first station then return function
    // update the chart
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
  const newData = {
    label: `Average temperature in ${cityName}`,
    data: inputData.yTemps,
    fill: false,
    borderColor: 'rgba(255, 99, 132, 1)',
    borderWidth: 1
  };
  myChart.data.datasets[0] = newData;
  myChart.data.labels = inputData.xDates;
  myChart.update();    
  isCelsius = true;
  document.getElementById("convertButton").innerHTML = "Convert to Fahrenheit";

}

function convertTemp() {
  let yTemps = myChart.data.datasets[0].data;
  if(isCelsius) {
    let convertedTemps = yTemps.map(function(num) {
      return ((num * (9/5)) + 32).toFixed(2);
    });
    myChart.data.datasets[0].data = convertedTemps;
    myChart.update();
    document.getElementById("convertButton").innerHTML = "Convert to Celsius";
    isCelsius = false;
  } else {
      let convertedTemps = yTemps.map(function(num) {
        return ((num - 32) * 5/9).toFixed(2);
      })
    myChart.data.datasets[0].data = convertedTemps;
    myChart.update();
    document.getElementById("convertButton").innerHTML = "Convert to Fahrenheit";
    isCelsius = true;
  }
}
