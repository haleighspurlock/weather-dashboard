// oneLocation - api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
// 5day - api.openweathermap.org/data/2.5/forecast?q={city name}&appid={API key}
// current UV - http://api.openweathermap.org/data/2.5/uvi?lat={lat}&lon={lon}&appid={API key}



var apiKey = '49283df107f4b9c05123a0013d52be80';
var date = moment.utc();
var formatDate = date.format('MM/DD/YYYY');

function populateWeatherData(city){
    get5DayForcast(city)
    getOneLocationForcast(city)
    createSearchHistory(city)
}

function getIndex(forcastInfo) {
    var requestUrl = `http://api.openweathermap.org/data/2.5/uvi?lat=${forcastInfo.coord.lat}&lon=${forcastInfo.coord.lon}&appid=${apiKey}`
    function makeRequest(indexResponse){
        var UV = indexResponse.value
        $('#uvIndexCondition').text(UV)

        if (UV >= 6.0) {
            $('#uvIndexCondition').css('background-color', 'red')
            $('#uvIndexCondition').css('color', 'white')    
        } else if (UV <= 3.0) {
            $('#uvIndexCondition').css('background-color', 'green')
            $('#uvIndexCondition').css('color', 'white')     
        } else {
            $('#uvIndexCondition').css('background-color', 'yellow')
            $('#uvIndexCondition').css('color', 'black')    
        }

    }
    $.ajax({
        url: requestUrl,
        method: 'GET',
    }).then(makeRequest)
}

// gets searched location info from API
function getOneLocationForcast(city) {
    var requestUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`

    function populateOneDayForcast(dailyForcastInfo){
        $('#name').text(dailyForcastInfo.name)
        $('#temp').text(convertKelvin(dailyForcastInfo.main.temp))
        $('#date').text(formatDate)
        $('#humidity').text(dailyForcastInfo.main.humidity + '%')
        $('#windspeed').text(dailyForcastInfo.wind.speed)
        $('#icon').attr("src",`http://openweathermap.org/img/wn/${dailyForcastInfo.weather[0].icon}@2x.png`)
        return dailyForcastInfo
    }
    $.ajax({
        url: requestUrl,
        method: 'GET',
    }).then(populateOneDayForcast).then(getIndex)
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
            if (day !== pastDay && dailyForcastHour.length < 5) {
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
                    <p class='card-text'>Temp: ${convertKelvin(weatherHour.main.temp)}&deg;F</p>
                    <p class='card-text'>Humidity: ${weatherHour.main.humidity}%</p>
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

    function convertKelvin(k){
        return ((((k-273.15)*9)/5) + 32).toFixed(1);
    }
    
    createSearchHistory()