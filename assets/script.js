// oneLocation - api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
// 5day - api.openweathermap.org/data/2.5/forecast?q={city name}&appid={API key}
// current UV - http://api.openweathermap.org/data/2.5/uvi?lat={lat}&lon={lon}&appid={API key}



var apiKey = '49283df107f4b9c05123a0013d52be80';
var date = moment();
var formatDate = date.format('MM/DD/YYYY');

function populateWeatherData(city){
    get5DayForcast(city)
    getOneLocationForcast(city)
    getIndex(city)
    createSearchHistory(city)
}

function getIndex(lat, long) {
    // var requestUrl = `http://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${long}&appid=${apiKey}`
    // function makeRequest(indexResponse){
    //     console.log(indexResponse)
    // }
    // $.ajax({
    //     url: requestUrl,
    //     method: 'GET',
    // }).then(makeRequest)
}
// gets searched location info from API
function getOneLocationForcast(city) {
    var requestUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`

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
        $('#icon').attr("src",`http://openweathermap.org/img/wn/${dailyForcastInfo.weather[0].icon}@2x.png`)
    }
    $.ajax({
        url: requestUrl,
        method: 'GET',
    }).then(populateOneDayForcast)
}
// populates 5 day forcast info from API
function get5DayForcast(city){
    var requestUrl = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`

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
                    <img class='card-img icon' src='http://openweathermap.org/img/wn/${weatherHour.weather[0].icon}@2x.png'/>
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

// saving to local storage
$('.container').on('click','#submitBtn', function () {
    var textArea = $('#searchCity').val()
    populateWeatherData(textArea)
    
    var getCityName = localStorage.getItem('city');
    var city = JSON.parse(getCityName);
    
    if(city !==null) {
        city.push(textArea)
        }
    else city = [textArea]
    let uniqueArray = [...new Set(city)];
    localStorage.setItem('city', JSON.stringify(uniqueArray))
    createSearchHistory()
})

function createSearchHistory(){
    var historySidebar = $('#list-group');
    historySidebar.empty()
    var getCity = localStorage.getItem('city');
    var history = JSON.parse(getCity);

    if (history !== null) {
        var i = 0;
        for (storedCity of history) {
            var list = `<li class='list-group-item searchHistory' id='searchHistory${i}'>${storedCity}</li>`
           historySidebar.append(list);
           $(`#searchHistory${i}`).on('click', function(element){
             populateWeatherData(element.target.innerHTML)
           }) 
           i++
        }
    }
    
    
    }
    
    createSearchHistory()