const input = document.querySelector('.form-control');
const btn = document.querySelector('.weather-search');
const day_toggle = document.querySelector('.toggle-switch');
const weatherCurrent = document.querySelector('.weather-current')

let weather_info,unit;
let checked_status = '';

// Getting weather api 
const weatherApi = {
    key : '2ad4a84aa600792db979b17cca629600',
    url : 'https://api.openweathermap.org/data/2.5/'
}

// Click to show weather
btn.addEventListener('click',()=>{
    getCurrentWeather();
})

// Operating keyboard to show weather 
input.addEventListener('keypress',(event)=>{
    if(event.key === 'Enter'){
        getCurrentWeather();
    }
})

// Fetch api to get weather information
const getCurrentWeather = () =>{
    const inputValue = input.value;
    fetch(`${weatherApi.url}/weather?q=${inputValue}&units=metric&appid=${weatherApi.key}`,{
        method : 'GET'
    }).then(response =>{
        return response.json();
    }).then(result =>{
        if(!weather_info){  // if weather_info isn't exist, pass an empty to weather_info
            weather_info = [];
        }else{
            weather_info.splice(0,weather_info.length);
        }

        weather_info.push(result);  // push weather information in weather_info array
        Check_input();
    })
}

// Check user input 
const Check_input = () =>{
    const city_cod = weather_info[0].cod;
    
    if(city_cod === '400'){
        Swal.fire({
            icon: 'warning',
            title: '操作錯誤',
            text: '請輸入國家或城市',
        })
    }else if(city_cod === '404'){
        Swal.fire({
            icon: 'error',
            title: '輸入錯誤',
            text: '您所輸入的國家或城市不存在!'
        })
        input.value = '';
    }else{
        Temp_cal(checked_status);
    }
}

// Temperature unit conversion
const Temp_cal = (checked_status) =>{
    let temp = weather_info[0].main.temp;
    let feel_temp = weather_info[0].main.feels_like;
    let max_temp = weather_info[0].main.temp_max;
    let min_temp = weather_info[0].main.temp_min;

    if(checked_status === ''){
        unit = 'F';
        showWeather(temp, feel_temp, max_temp, min_temp, unit);  // C
    }else{
        unit ='C';
        showWeather((temp*(9/5)+32), (feel_temp*(9/5)+32), (max_temp*(9/5)+32), (min_temp*(9/5)+32), unit);  // F
    } 
}

// Click day-night button to chang css style
day_toggle.addEventListener('click',()=>{
    document.querySelector('.weather-current').classList.toggle('bx-sun');
    document.querySelector('body').classList.toggle('bx-sun');
    document.querySelector('.form-control').classList.toggle('bx-sun');
    document.querySelector('.current-title span').classList.toggle('bx-sun');
})

// Managing and showing datetime
const dateManage = (date) =>{
    let weather_info_days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let weather_info_months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    let year = date.getFullYear();
    let month = weather_info_months[date.getMonth()];
    let day = date.getDate();
    let week = weather_info_days[date.getDay()];
    let hour = date.getHours();
    let minute = date.getMinutes();

    return `${year} ${month} ${day}, ${week} ${hour}:${minute}`;
}

// Check status of temperature unit checkbox 
const Temp_status = (btn_check) =>{
    if(btn_check.checked){
        checked_status = 'checked';
    }else{
        checked_status = '';
    }

    Temp_cal(checked_status);
}

// Showing weather information
const showWeather = (temp, feel_temp, max_temp, min_temp, unit) =>{
    weatherCurrent.style.display = 'block';

    let date = new Date();
    let iconurl = `./img/WeatherIcon/${weather_info[0].weather[0].icon}.png`;

    weatherCurrent.innerHTML = `
        <div class='current-info d-flex flex-column'>
            <div class='current-title d-flex justify-content-between align-items-center'>
                <span>當前天氣</span>
                <div class='temp-transform'>
                    <label>
                        <input type='checkbox' onclick='Temp_status(this)' ${checked_status}>
                        <span class='temp-unit' style='color:#FFFFFF'>${unit}</span>
                        <div class='temp-switch'></div>
                        <div class='temp-background'></div>
                    </label> 
                </div>
            </div>
            <div class='current-content d-flex flex-wrap'>
                <div class='weather-temp col-12 col-md-5 d-flex flex-column'>
                    <div class='country-city'>
                        <h4>${weather_info[0].name}</h4>
                    </div>
                    <div class='icon-temperature d-flex'>
                        <div class='icon'>
                            <img id='wicon' src="${iconurl}" alt='Weather icon' style='width:100px; height:100px;'>
                        </div>
                        <div class='temperature'>
                            ${Math.round(temp)}&deg
                        </div>
                    </div>
                    <div class='weather'>
                        <span>${weather_info[0].weather[0].main}</span>
                    </div>
                </div>
                <div class='weather-detail col-12 col-md-6 d-flex flex-column'>
                    <div class='datetime'>
                        ${dateManage(date)}
                    </div>
                    <div class='max-min-temp d-flex mb-3'>
                        <div class='max-temp d-flex temp-mg align-items-baseline'>
                            <svg class='me-3' xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-up" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"/>
                            </svg>
                            <span class='me-3 text'>最高溫</span>
                            <span class='result'>${Math.round(max_temp)} &deg</span>
                        </div>
                        <div class='min-temp d-flex temp-mg align-items-baseline'>
                            <svg class='me-3' xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z"/>
                            </svg>
                            <span class='me-3 text'>最低溫</span>
                            <span class='result'>${Math.round(min_temp)} &deg</span>
                        </div>
                    </div>
                    <div class='detailed d-flex align-items-baseline mb-3'>
                        <svg class='me-3' xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-thermometer-half" viewBox="0 0 16 16">
                            <path d="M9.5 12.5a1.5 1.5 0 1 1-2-1.415V6.5a.5.5 0 0 1 1 0v4.585a1.5 1.5 0 0 1 1 1.415z"/>
                            <path d="M5.5 2.5a2.5 2.5 0 0 1 5 0v7.55a3.5 3.5 0 1 1-5 0V2.5zM8 1a1.5 1.5 0 0 0-1.5 1.5v7.987l-.167.15a2.5 2.5 0 1 0 3.333 0l-.166-.15V2.5A1.5 1.5 0 0 0 8 1z"/>
                        </svg>
                        <span class='me-3 text' style='width:6rem'>體感溫度</span>
                        <span class='result'>${Math.round(feel_temp)} &deg</span>
                    </div>
                    <div class='detailed d-flex align-items-baseline mb-3'>
                        <svg class='me-3' xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-droplet-fill" viewBox="0 0 16 16">
                            <path d="M8 16a6 6 0 0 0 6-6c0-1.655-1.122-2.904-2.432-4.362C10.254 4.176 8.75 2.503 8 0c0 0-6 5.686-6 10a6 6 0 0 0 6 6ZM6.646 4.646l.708.708c-.29.29-1.128 1.311-1.907 2.87l-.894-.448c.82-1.641 1.717-2.753 2.093-3.13Z"/>
                           </svg>
                        <span class='me-3 text' style='width:6rem'>濕度</span>
                        <span class='result'>${weather_info[0].main.humidity} %</span>
                    </div>
                    <div class='detailed d-flex align-items-baseline mb-3'>
                        <svg class='me-3'xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-wind" viewBox="0 0 16 16">
                            <path d="M12.5 2A2.5 2.5 0 0 0 10 4.5a.5.5 0 0 1-1 0A3.5 3.5 0 1 1 12.5 8H.5a.5.5 0 0 1 0-1h12a2.5 2.5 0 0 0 0-5zm-7 1a1 1 0 0 0-1 1 .5.5 0 0 1-1 0 2 2 0 1 1 2 2h-5a.5.5 0 0 1 0-1h5a1 1 0 0 0 0-2zM0 9.5A.5.5 0 0 1 .5 9h10.042a3 3 0 1 1-3 3 .5.5 0 0 1 1 0 2 2 0 1 0 2-2H.5a.5.5 0 0 1-.5-.5z"/>
                        </svg>
                        <span class='me-3 text' style='width:6rem'>風速</span>
                        <span class='result'>${weather_info[0].wind.speed} kmh</span>
                    </div>
                    <div class='detailed d-flex align-items-baseline mb-3'>
                        <svg class='me-3' xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-fan" viewBox="0 0 16 16">
                               <path d="M10 3c0 1.313-.304 2.508-.8 3.4a1.991 1.991 0 0 0-1.484-.38c-.28-.982-.91-2.04-1.838-2.969a8.368 8.368 0 0 0-.491-.454A5.976 5.976 0 0 1 8 2c.691 0 1.355.117 1.973.332.018.219.027.442.027.668Zm0 5c0 .073-.004.146-.012.217 1.018-.019 2.2-.353 3.331-1.006a8.39 8.39 0 0 0 .57-.361 6.004 6.004 0 0 0-2.53-3.823 9.02 9.02 0 0 1-.145.64c-.34 1.269-.944 2.346-1.656 3.079.277.343.442.78.442 1.254Zm-.137.728a2.007 2.007 0 0 1-1.07 1.109c.525.87 1.405 1.725 2.535 2.377.2.116.402.222.605.317a5.986 5.986 0 0 0 2.053-4.111c-.208.073-.421.14-.641.199-1.264.339-2.493.356-3.482.11ZM8 10c-.45 0-.866-.149-1.2-.4-.494.89-.796 2.082-.796 3.391 0 .23.01.457.027.678A5.99 5.99 0 0 0 8 14c.94 0 1.83-.216 2.623-.602a8.359 8.359 0 0 1-.497-.458c-.925-.926-1.555-1.981-1.836-2.96-.094.013-.191.02-.29.02ZM6 8c0-.08.005-.16.014-.239-1.02.017-2.205.351-3.34 1.007a8.366 8.366 0 0 0-.568.359 6.003 6.003 0 0 0 2.525 3.839 8.37 8.37 0 0 1 .148-.653c.34-1.267.94-2.342 1.65-3.075A1.988 1.988 0 0 1 6 8Zm-3.347-.632c1.267-.34 2.498-.355 3.488-.107.196-.494.583-.89 1.07-1.1-.524-.874-1.406-1.733-2.541-2.388a8.363 8.363 0 0 0-.594-.312 5.987 5.987 0 0 0-2.06 4.106c.206-.074.418-.14.637-.199ZM8 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"/>
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14Zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16Z"/>
                        </svg>
                        <span class='me-3 text' style='width:6rem'>氣壓</span>
                        <span class='result'>${weather_info[0].main.pressure} mb</span>
                    </div>
                </div>
            </div>
        </div>
    `;

    input.value = '';
}