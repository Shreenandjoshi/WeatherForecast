let currentWeather = {
    weather_apiKey: "b5af752f9ec804ace97776aa558f0ef3",
    fetchWeather: function(city) {
        fetch(
            "https://api.openweathermap.org/data/2.5/weather?q=" 
            + city 
            + "&units=metric&appid=" 
            + this.weather_apiKey
        )
        .then((response) => response.json())
        .then((data) => this.displayWeather(data));
    },

    displayWeather: function(data) {
        console.log(data);
        const {name} = data;
        const {temp} = data.main;
        const {temp_min, temp_max} = data.main;
        const {humidity} = data.main;
        const {speed} = data.wind;
        const {visibility} = data;
        const {description,icon} = data.weather[0];

        document.querySelector(".city").innerHTML = name.toUpperCase(2);
        document.querySelector(".temp").innerHTML =  Math.round(temp) + " °C";
        document.querySelector(".description").innerHTML = description;
        document.querySelector(".humidity").innerHTML = `<i class="fa-solid fa-water"></i><span style="color: #150656;  font-size:1.2em"> Humidity :  ${humidity}% </span>`;
        document.querySelector(".wind").innerHTML = `<i class="fa-solid fa-wind"></i><span style="color: #150656;  font-size:1.2em"> Wind :  ${speed} Km/hr </span>`;
        document.querySelector(".visibility").innerHTML = `<i class="fa-solid fa-cloud"></i><span style="color: #150656; ; font-size:1.2em"> Visibility : ${visibility/1000} Km </span>`;
        document.querySelector(".temp_min").innerHTML= `<i class="fa-solid fa-temperature-arrow-up"></i><span style="color: #150656; font-size:1.2em"> Min Temp. : ${temp_min} °C </span>`;
        document.querySelector(".temp_max").innerHTML= `<i class="fa-solid fa-temperature-arrow-down"></i><span style="color: #150656;  font-size:1.2em"> Max Temp. : ${temp_min} °C </span>`;
        
    },

    forcast_apiKey: "PcmALQZ8L3Biz4lUBa5tBMAyTZkAl7LL",

    fetchForcast: function(city) {
        var location_key;
        const loc_key_url = "https://dataservice.accuweather.com/locations/v1/cities/search?apikey="
        +this.forcast_apiKey+
        "&q=" 
        + city;
        fetch(loc_key_url).then((res) => res.json()).then( (data) => 
        fetch("https://dataservice.accuweather.com/forecasts/v1/daily/5day/"+data[0].Key +"?apikey=" + this.forcast_apiKey+"&metric=true")
        .then((res) => res.json()).then((data) => this.displayForcast(data)));
    },    

    displayForcast : function(data) {
        const {DailyForecasts} = data;
        console.log(DailyForecasts);
        const allftop = document.querySelectorAll(".date");
        let i = 0;
        for (const element of allftop) {
            const d = DailyForecasts[i].Date;
            const date = new Date(d);
            const f = new Intl.DateTimeFormat("en-us", {
                dateStyle: "full"
            });
            element.innerHTML = f.format(date);
            i++;
        }
        const allftemp = document.querySelectorAll(".ftemp");
        i = 0;
        for (const element of allftemp) {
            const {Date} = DailyForecasts[i];
            const temp_max = DailyForecasts[i].Temperature.Maximum.Value; 
            const temp_min = DailyForecasts[i].Temperature.Minimum.Value; 
            element.innerHTML = Math.round(temp_min)+" °C"+" / "+Math.round(temp_max)+" °C";
            i++;
        }

        const allfdayicon = document.querySelectorAll(".fday-icon");
        i=0;
        for(const element of allfdayicon) {
            const {Icon} = DailyForecasts[i].Day;
            if(Icon < 10){
                element.src = "https://developer.accuweather.com/sites/default/files/0"+Icon+"-s.png";
            }
            else {
                element.src = "https://developer.accuweather.com/sites/default/files/"+Icon+"-s.png";
            }
            i++;
        }

        const allfnighticon = document.querySelectorAll(".fnight-icon");
        i=0;
        for(const element of allfnighticon) {
            const {Icon} = DailyForecasts[i].Night;
            if(Icon < 10){
                element.src = `https://developer.accuweather.com/sites/default/files/0 ${Icon}-s.png`;
            }
            else {
                element.src = `https://developer.accuweather.com/sites/default/files/${Icon}-s.png`;
            }
            i++;
        }

        const alldaydescription = document.querySelectorAll(".fday-description");
        i = 0;
        for(const element of alldaydescription) {
            const{IconPhrase} = DailyForecasts[i].Day;
            element.innerHTML = `<p style="font-size:1.3em">${IconPhrase}</p>`;
            i++;
        }
        const allnightdescription = document.querySelectorAll(".fnight-description");
        i = 0;
        for(const element of allnightdescription) {
            const{IconPhrase} = DailyForecasts[i].Night;
            element.innerHTML = `<p style="font-size:1.3em">${IconPhrase}</p>`;
            i++;
        }
    },

    search: function() {
        let city = document.querySelector(".search-input").value;
        this.fetchWeather(city);
        this.fetchForcast(city);
        console.log(city);
    }
}

document.querySelector(".search-input").addEventListener("keyup", function(event) {
    if(event.key == "Enter"){
        currentWeather.search();
    } 
})
document.querySelector(".search-button").addEventListener("click", function() {
    currentWeather.search();
})


function getUserLocationWeather() {
    weather_apiKey: "b5af752f9ec804ace97776aa558f0ef3"
    function success(data) {
        const url =  "https://api.openweathermap.org/data/2.5/weather?lat="
        +data.coords.latitude+
        "&lon="
        +data.coords.longitude+
        "&units=metric&appid=b5af752f9ec804ace97776aa558f0ef3";

        fetch(url).then((res) => res.json()).then(data => currentWeather.displayWeather(data));
    }

    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success,console.error);
    }
    else{
        currentWeather.fetchWeather("Delhi");
    }
}

document.querySelector(".location-button").addEventListener("click", function() {
    getUserLocationWeather();
})


currentWeather.fetchWeather("Mumbai");
currentWeather.fetchForcast("Mumbai");

