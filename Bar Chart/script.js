const stationURL = "https://api.meteostat.net/v2/stations/search";
const dataURL = "https://api.meteostat.net/v2/stations/daily";
const ctx = document.getElementById('chart').getContext('2d');
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

let myChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: [],
    datasets: [{
      label: "",
      backgroundColor: 'rgba(255, 99, 132, 0.2',
      borderColor: 'rgba(255, 99, 132, 1)',
      hoverBackgroundColor: 'rgba(255, 99, 132, 0.4',
      data: [],
    }]
  },
  options: {
    responsive: true,
    scales: {
      xAxes: [{
        ticks: {
          maxTicksLimit: 12,
        }
      }],
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: "Monthly Temperature in Celsius",
          padding: 20
        }
      }]
    }
  }
});

async function getData() {
  const city = document.getElementById('city').value;
  const yearInput = document.getElementById('year').value;
  const startMonth = document.getElementById('startMonth').value;
  const endMonth = document.getElementById('endMonth').value;
    
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
  if(!data.data) {
    alert('No data available for the city.');
    return; 
  } 
  const stationID = data.data[0].id;
  const graphData = await retrieveData(stationID, yearInput, startMonth, endMonth);
  if (!graphData) return; 
    updateChart(graphData, city, startMonth, endMonth);
}

async function retrieveData(id, year, start, end) {
  const yTemps = [];

  let url = new URL(dataURL);
  url.search = new URLSearchParams({
    station: id,
    start: `${year}-${start}-01`, 
    end: `${year}-${end}-29` // Simply generalizing all months to be 29 days long for the sake of this example. 
  });
  let promise = await fetch(url, {
    headers: {
      "x-api-key": "lEoCLK3HgFzYU6oqepEkRZN8YolotzkA"        
    },
  });
  let data = await promise.json();
  if(data.data && data.data[0].tavg) {
    let iterationPlace = 0; // Ensures that iteration over data for every new month starts where we left off. 
    for(let month = parseInt(start); month <= parseInt(end); month++) { // parseInt() gets rid of leading zeros such as "05", allowing it to be used while iterating. 
      let sumTemps = 0;
      let count = 0;
      Loop1: // Loop label that lets us break out of it later. 
      for(let dayNumber = iterationPlace; dayNumber < data.data.length; dayNumber++) { // initialize day to iteration place so we don't start at beginning of the weather data after each iteration of the month.  
        if(parseInt(data.data[dayNumber].date[5] + data.data[dayNumber].date[6]) == month) { // check if current data object belongs in the right month that is currently being iterated. index 5 + index 6 return the month number, such as 06, 10, 12. 
          sumTemps += data.data[dayNumber].tavg;
          count++;          
        } else {
          iterationPlace = dayNumber; // set iterationPlace to current day so the next iteration of the month will start iterating through the weather data at the place we just left off, not index 0. 
          break Loop1;
        }        
      }
      let avg = sumTemps / count;               
      yTemps.push(avg.toFixed(2));
    }
  } 
  else {
    alert("No data available for this city.");
    return false;
  }
  return yTemps;
}

function updateChart(inputData, cityName, startMonth, endMonth) {
  const newData = {
    label: `Average temperature in ${cityName}`,
    data: inputData,
    borderColor: 'rgba(255, 99, 132, 1)',
    backgroundColor: 'rgba(255, 99, 132, 0.2',
    hoverBackgroundColor: 'rgba(255, 99, 132, 0.4',
    fill: true,
    borderWidth: 1
  };
  myChart.data.datasets[0] = newData; // update chart data with monthly averages
  myChart.data.labels = months.slice(startMonth - 1, endMonth); // Add months to x-axis
  myChart.update();    
}

