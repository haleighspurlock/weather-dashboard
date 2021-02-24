// oneLocation - api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
// 5day - api.openweathermap.org/data/2.5/forecast?q={city name}&appid={API key}
// current UV - http://api.openweathermap.org/data/2.5/uvi?lat={lat}&lon={lon}&appid={API key}



var apiKey = '49283df107f4b9c05123a0013d52be80';

function populateWeatherData(){
    get5DayForcast()
}

function get5DayForcast(){
    var searchInput = $('#searchCity')
    var requestUrl = `http://api.openweathermap.org/data/2.5/forecast?q=${searchInput.val()}&appid=${apiKey}`

    function populate5DayForcast(weekForcastInfo){
        var dailyForcastHour = []
        var pastDay = -1;
        for (var weatherHour of weekForcastInfo.list) {
            var day = moment.unix(weatherHour.dt).day();
            if (day !== pastDay) {
                dailyForcastHour.push(weatherHour)
                pastDay = day   
            }
            var forcastSpace = $('#forcastSpace');
            var element = `
            <div class="card col-2 forcast-day-card" style="width: 18rem;">
                <div class='card-body p-1'>
                    <h6 class='card-title'>8/16/2019</h6>
                    <img class='card-img icon' src='./assets/images/sunnyicon.svg'/>
                    <p class='card-text'>Temp:86.84 &deg;F</p>
                    <p class='card-text'></p>
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