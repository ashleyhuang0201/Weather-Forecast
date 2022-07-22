import React, { useEffect, useState } from "react";
import { API_KEY } from "../utils/constants";
import Box from "@mui/material/Box";
import { DailyWeatherCard } from "../components/DailyWeatherCard";

export default function Forecast() {
  const [dailyWeather, setDailyWeather] = useState<any[]>([]);
  const [hourly, setHourly]  = useState<any[]>([]);
  const exclude = "minutely,alerts";

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
        <DailyWeatherCard item={item} dayNumber={dayNumber} id={key} setHourly={setHourly}/>
      );
    });
  };

  const getHourlyDisplay = () => {
    console.log(hourly);
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
        {getHourlyDisplay()}
      </Box>
    </div>
  );
}
