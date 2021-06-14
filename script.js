const h1  = document.querySelector('h1');
const temperatureDegree = document.querySelector('.temperature-degree')
const temperatureDescription = document.querySelector('.temperature-description');
const timeZoneElement = document.querySelector('.time-zone');
const tempSpan = document.querySelector('.degree-section span');
const degreeSection = document.querySelector('.degree-section');

const apiKey = '78a4470605ee71b7416aeab965537681'
let unit = 'metric';

let long;
let lat;

const iconMapper = {
    '01d': 'CLEAR_DAY',
    '02n': 'PARTLY_CLOUDY_DAY',
    '03n': 'PARTLY_CLOUDY_DAY',
    '04n': 'PARTLY_CLOUDY_DAY',
    '09n': 'RAIN',
    '10n': 'RAIN',
    '11n': 'SLEET',
    '13n': 'SNOW',
    '13n': 'FOG',
};

const setIcon = (icon, iconID) => {
    var skycons = new Skycons({color: 'white'})
    skycons.play();
    return skycons.set(iconID, Skycons[icon])
}

const renderDateData = (timezone, name, country, temp, description, icon) => {

    temperatureDescription.innerHTML = description;
    temperatureDegree.innerHTML =  temp;
    
    const nowInLocalTime = Date.now()  + 1000 * (timezone / 3600);
    const millitime = new Date(nowInLocalTime);
    const dateFormat = millitime.toLocaleString("en-US", {hour: "numeric", minute: "numeric"});
    
    timeZoneElement.innerHTML = `${dateFormat}, ${name}, ${country}`
    setIcon(iconMapper[icon], document.querySelector('.icon'));
}

const getData = (unit) => {

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            long = position.coords.longitude;
            lat = position.coords.latitude;
            const api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=${unit}&appid=${apiKey}`;
            console.log(api)
            fetch(api)
                .then(response => response.json())
                .then(data => {
                    console.log(data)
                    const { timezone, name } = data;
                    const { country } = data.sys;
                    const { temp } = data.main;
                    const { description, icon } = data.weather[0];
                    
                    renderDateData(timezone, name, country, temp, description, icon)
                })
        });
    } else {
        h1.innerHTML = "You need to allow geolocation to work"
    }
}

degreeSection.addEventListener('click', () => {
    if (tempSpan.innerHTML === 'F') {
        tempSpan.innerHTML = 'C'
        unit = 'metric'
    } else {
        tempSpan.innerHTML = 'F'
        unit = 'imperial'
    }

    getData(unit);
});

window.addEventListener('load', () => {
    getData(unit)
})