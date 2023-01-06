  var skycons = new Skycons({"color": "white"});


  var weatherData = {};
  var api = "https://api.openweathermap.org/data/2.5/forecast?";
  var id = "&APPID=06d1dd4a0f26b517ce3891d040d9fa1b";
  var cnt =  "&cnt=4"
  var country="";
  var ctyName = "";
  var options = {
                weekday: "long", year: "numeric", month: "short",
                day: "numeric", hour: "2-digit", minute: "2-digit"
              };
  var Icons = {
    "01d": { bg :"http://www.photos-public-domain.com/wp-content/uploads/2011/02/bright-sun-in-blue-sky.jpg",
            icn : Skycons.CLEAR_DAY},
    "02d": { bg : "http://canitbesaturdaynow.com/images/fpics/1679/033120bd5d2cfd5c05653a107622e41d.jpg",
           icn : Skycons.PARTLY_CLOUDY_DAY },
    "03d": { bg :" http://img15.deviantart.net/c199/i/2011/304/e/4/scattered_clouds___stock_by_thy_darkest_hour-d4em598.jpg",
           icn :Skycons.PARTLY_CLOUDY_DAY },
    "04d": { bg :"http://bovitz.com/bovitz.com/photo/traditional/jpgphotos/2006/2006-07/Broken-clouds.jpg",
            icn :Skycons.CLOUDY },
    "09d": { bg : "https://4.bp.blogspot.com/-AAS54vTj-V0/TgPob6pfJ0I/AAAAAAAAAYw/_iLZ1qAsEf0/s1600/Rain+falling.jpg",
           icn :Skycons.RAIN },
    "10d": { bg : "https://4.bp.blogspot.com/-AAS54vTj-V0/TgPob6pfJ0I/AAAAAAAAAYw/_iLZ1qAsEf0/s1600/Rain+falling.jpg",
           icn :Skycons.RAIN },
    "11d": { bg : "http://www.bahrainweather.gov.bh/documents/10716/11884/ThunderStorm.PNG/",
            icn :Skycons.SLEET },
    "13d": { bg : "http://www.vancitybuzz.com/wp-content/uploads/2015/12/shutterstock_315123593-984x500.jpg",
           icn :Skycons.SNOW },
    "50d": { bg: "https://tripswithtots.files.wordpress.com/2012/06/d-walking-into-the-mist.jpg",
            icn :Skycons.FOG },
    "01n": { bg: "http://static.wolfire.com/legacy/PhoenixNight.jpg",
            icn :Skycons.CLEAR_NIGHT },
    "02n": { bg: "https://earthoceanskyredux.files.wordpress.com/2013/06/er1.jpg",
            icn :Skycons.PARTLY_CLOUDY_NIGHT },
    "03n": { bg: "https://trentsthoughts.files.wordpress.com/2011/05/night_sky.jpg",
            icn :Skycons.PARTLY_CLOUDY_NIGHT },
    "04n": { bg: "https://3.bp.blogspot.com/-oHQAaVLuOI4/UfEtlvesXZI/AAAAAAAAWbU/YRKlIbUdNh8/s1600/1+moon.JPG",
            icn :Skycons.CLOUDY },
    "09n": { bg : "http://cdn.pcwallart.com/images/rain-falling-wallpaper-1.jpg",
           icn : Skycons.RAIN },
    "10n":{ bg : "http://cdn.pcwallart.com/images/rain-falling-wallpaper-1.jpg",
           icn : Skycons.RAIN },
    "11n": { bg : "http://www.bahrainweather.gov.bh/documents/10716/11884/ThunderStorm.PNG/",
            icn :Skycons.SLEET },
    "13n": { bg :"https://api.ning.com/files/kV4MbYiv7oT8dnYIHa3udW295K9IWghHEnroWtZ-lq4QOBdnGX4uFQIUC6oOeDX*oHFTjEuj3wlJRhHpW722NqH8O0Uq4aWN/1082060622.jpeg",
            icn :Skycons.SNOW },
    "50n":{ bg: "http://img.mota.ru/upload/wallpapers/source/2014/08/07/16/02/41019/028.jpg",
           icn :Skycons.FOG }
  };
  var curDate = $(".cur-date");
  curDate.html(new Date().toLocaleTimeString('en-US', options));
  
$.ajax({url: "https://ipinfo.io/json?"})
 .done( function(res) {
    console.log(res);
    country = res.country;
    ctyName = "q="+res.city+","+country;
    
    getWeather();
});


function getWeather() {
  $.ajax({url: api+ctyName+id+cnt, dataType: 'json', success: function(result) {
    $('#loader').hide();
    console.log(result);
    weatherData = result;
    var icons= [];
    
    $("#loc").html(result.city.name+", "+result.city.country);
    $("#cur-weath").html(result.list[0].weather[0].main);
    $("#cur-deg").html(Math.round(result.list[0].main.temp - 273.15)+"° C");
    $("#cur-desc").html(result.list[0].weather[0].description);
    var icon = result.list[0].weather[0].icon;
    setBackground(icon);
    //icons.push(result.list[0].weather[0].icon+".png");
    console.log(Icons[icon].icn);
    skycons.set("cur-icon",Icons[icon].icn);
   // $("#cur-icon").html("<img src='http://openweathermap.org/img/w/"+icons[0]+"'style='width:100px;height:100px;'>");
    for(var i=1;i<4;i++) {
      var $next=$(".next-weath");
      icons.push(result.list[i].weather[0].icon);
      var dt = new Date(result.list[i].dt_txt);
      if(dt == "Invalid Date") { //modify dt for internet explorer compatibility
        var ar = result.list[i].dt_txt.split(" ");
        dt = new Date(ar[0]+"T"+ar[1]);
      }
      var hour = dt.toLocaleTimeString('en-US', {hour: "2-digit", minute: "2-digit", hour12: true,  });
      $next.eq(i-1).find(".next-hour").html(hour);
      $next.eq(i-1).find(".next-desc").text(result.list[i].weather[0].description);
      $next.eq(i-1).find(".next-deg").html(Math.round(result.list[i].main.temp - 273.15)+"° C");
      skycons.set($next.eq(i-1).find(".next-icon")[0], Icons[icons[i-1]].icn);
    }
    

  },
          
  error: function(error, errorType, errorMessage) {
	    $("#loc").html("Unable to Locate").next().hide();
  },
          
  beforeSend: function() {
      $("#loc").html("loading").next().show();
      
	}});
}  

$("button").on("click", getCityWeather);

$("input").keydown(function(event){
    if (event.which == 13)
      getCityWeather();
});

$(".next-deg").on("click", function() {
    if(weatherData) 
      changeTempScale( $(this));
});

$("#cur-deg").on("click", function() {
    if(weatherData) 
      changeTempScale( $(this));
});


function setBackground(icon) {
  $(".wrap").css('background-image', 'url(' + Icons[icon].bg + ')');
}

function getCityWeather() {
  $("input").val()
  ctyName = "q="+$("input").val();
  getWeather();
}

function changeTempScale($this) {
      //console.log(result);
      var i = parseInt($this.attr("data-num"));
      var t = $this.attr("data-temp")
      
      if(t=="cel") {
        $this.html(Math.round((weatherData.list[i].main.temp*(9/5)) - 459.67)+"° F");
        $this.attr("data-temp", "far");
      } else {
        $this.html(Math.round(weatherData.list[i].main.temp - 273.15)+"° C");
        $this.attr("data-temp", "cel");
      }
}
skycons.play(); 
setInterval(function(){ 
  curDate.html(new Date().toLocaleTimeString('en-US', options));
}, 60000);
