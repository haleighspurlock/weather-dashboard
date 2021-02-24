// oneLocation - api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
// 5day - api.openweathermap.org/data/2.5/forecast?q={city name}&appid={API key}
// current UV - http://api.openweathermap.org/data/2.5/uvi?lat={lat}&lon={lon}&appid={API key}



var apiKey = '49283df107f4b9c05123a0013d52be80';
var date = moment();
var formatDate = date.format('MM/DD/YYYY');

function populateWeatherData(){
    get5DayForcast()
    getOneLocationForcast()
    getIndex()
}

function getIndex(lat, long) {
    var requestUrl = `http://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${long}&appid=${apiKey}`
    function makeRequest(indexResponse){
        console.log(indexResponse)
    }
    $.ajax({
        url: requestUrl,
        method: 'GET',
    }).then(makeRequest)
}

function getOneLocationForcast() {
    var searchInput = $('#searchCity')
    var requestUrl = `http://api.openweathermap.org/data/2.5/weather?q=${searchInput.val()}&appid=${apiKey}`

    function populateOneDayForcast(dailyForcastInfo){
        // var uvIndex = getIndex(dailyForcastInfo.coord.lat, dailyForcastInfo.coord.lon)
        // var dailyCityWeather = $('#dailyCityWeather');
        // var element = `
        //     <h3><b>${dailyForcastInfo.name} ${formatDate}</b><img class='icon' src='./assets/images/sunnyicon.svg'/></h3>
        //     <p>${dailyForcastInfo.main.temp}</p>
        //     <p>${dailyForcastInfo.main.humidity}</p>
        //     <p>${dailyForcastInfo.wind.speed}</p>
        //     <p>UV Index: <span id='uvIndexCondition'>${uvIndex}</span> </p>
        //     `
        // dailyCityWeather.append(element);
        // return dailyForcastInfo
        $('#name').text(dailyForcastInfo.name)
        $('#temp').text(dailyForcastInfo.main.temp)
        $('#date').text(formatDate)
        $('#humidity').text(dailyForcastInfo.main.humidity)
        $('#windspeed').text(dailyForcastInfo.wind.speed)
        $('#icon').val(dailyForcastInfo.weather.icon)
    }
    $.ajax({
        url: requestUrl,
        method: 'GET',
    }).then(populateOneDayForcast)
}

function get5DayForcast(){
    var searchInput = $('#searchCity')
    var requestUrl = `http://api.openweathermap.org/data/2.5/forecast?q=${searchInput.val()}&appid=${apiKey}`

    function populate5DayForcast(weekForcastInfo){
        var forcastSpace = $('#forcastSpace');
        forcastSpace.empty();
        var dailyForcastHour = []
        var pastDay = -1;
        for (var weatherHour of weekForcastInfo.list) {
            var day = moment(weatherHour.dt_txt).dayOfYear();
            if (day !== pastDay) {
                dailyForcastHour.push(weatherHour)
                pastDay = day   
            }
        }
        for (var weatherHour of dailyForcastHour){
            var element = `
            <div class="card col-2 forcast-day-card" style="width: 18rem;">
                <div class='card-body p-1'>
                    <h6 class='card-title'>${moment(weatherHour.dt_txt).format('MM/DD/YYYY')}</h6>
                    <img class='card-img icon' ${weatherHour.weather.icon}/>
                    <p class='card-text'>Temp:${weatherHour.main.temp}&deg;F</p>
                    <p class='card-text'>${weatherHour.main.humidity}</p>
                </div>
            </div>
            `
        forcastSpace.append(element);
        }
    }
    $.ajax({
        url: requestUrl,
        method: 'GET',
    }).then(populate5DayForcast)
}

$('#submitBtn').on('click', populateWeatherData)