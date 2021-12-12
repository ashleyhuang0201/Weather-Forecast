import React, { useEffect, useState } from "react";
import { API_KEY } from "../utils/constants";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export default function Forecast() {
  const exclude = "minutely,alerts";
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const [dailyWeather, setDailyWeather] = useState([]);
  const [hourly, setHourly] = useState([]);

  const getForecast = async () => {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=33.86&lon=151.2&exclude=${exclude}&units=metric&appid=${API_KEY}`
    );
    const responseData = await response.json();
    if (response.status === 200) {
      // api daily updates later than current day sometimes
      if (responseData.current.dt < responseData.daily[0].dt) {
        setDailyWeather(responseData.daily.slice(0, 5));
      } else {
        setDailyWeather(responseData.daily.slice(1, 6));
      }
    } else if (response.status === 401) {
      console.log("broken");
    }
  };

  useEffect(() => {
    getForecast();

    setInterval(() => {
      getForecast();
    }, 300000);
  }, []);

  const getDailyDisplay = () => {
    return dailyWeather.map((item, key) => {
      let dayNumber = new Date(item.dt * 1000).getDay();
      return (
        <Card
          sx={{ margin: "20px" }}
          key={key}
          onClick={() => getWeatherByHour(key)}
        >
          <CardContent>
            <Typography>{days[dayNumber]}</Typography>
            <Typography>Temperature: {item.temp.day} C</Typography>
            <Typography>Humidity: {item.humidity} %</Typography>
            <Typography>Windspeed: {item.wind_speed} km/h</Typography>
            <img
              src={`http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`} alt="weather icon"
            />
          </CardContent>
        </Card>
      );
    });
  };

  const getWeatherByHour = async (dayNumber) => {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=33.86&lon=151.2&exclude=${exclude}&units=metric&appid=${API_KEY}`
    );
    const responseData = await response.json();
    if (response.status === 200) {
      let hour = new Date(responseData.current.dt * 1000).getHours();
      let hoursLeft = 24 - hour;
      // api only returns 48 hours for hour step weather forecast (free version)
      if (dayNumber === 0) {
        setHourly(responseData.hourly.slice(0, hoursLeft));
      } else if (dayNumber === 1) {
        setHourly(responseData.hourly.slice(hoursLeft, hoursLeft + 24));
      } else if (dayNumber === 2) {
        setHourly(responseData.hourly.slice(hoursLeft + 24));
      }
    } else if (response.status === 401) {
      console.log("broken");
    }
  };

  const getHourlyDisplay = () => {
    return hourly.map((item, key) => {
      let hour = new Date(item.dt * 1000).getHours();
      let hourFormat = hour >= 13 ? hour % 12 : hour;
      let timePeriod = hour >= 12 ? "PM" : "AM";
      return (
        <Box
          sx={{
            color: "white",
            m: 1,
            fontSize: "14px",
          }}
          key={key}
        >
          {item.temp} C
          <div>
            {hourFormat === 0 ? 12 : hourFormat} {timePeriod}
          </div>
        </Box>
      );
    });
  };

  return (
    <div>
      5-Day Forecast
      <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
        {getDailyDisplay()}
      </Box>
      <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
        {hourly && getHourlyDisplay()}
      </Box>
    </div>
  );
}
