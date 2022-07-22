import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { API_KEY } from "../utils/constants";

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const exclude = "minutely,alerts";

type Props = {
  item: {
    temp: { day: number };
    humidity: number;
    wind_speed: number;
    weather: {icon: string}[];
  };
  dayNumber: number;
  id: number;
  setHourly: any;
};

export const DailyWeatherCard = ({ item, dayNumber, id, setHourly }: Props) => (
  <Card
    sx={{ margin: "20px" }}
    key={id}
    onClick={() => getWeatherByHour(id, setHourly)}
  >
    <CardContent>
      <Typography>{days[dayNumber]}</Typography>
      <Typography>Temperature: {item.temp.day} C</Typography>
      <Typography>Humidity: {item.humidity} %</Typography>
      <Typography>Windspeed: {item.wind_speed} km/h</Typography>
      <img
        src={`http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
        alt="weather icon"
      />
    </CardContent>
  </Card>
);

const getWeatherByHour = async (dayNumber: number, setHourly: any) => {
  console.log("clicked");
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
    } else {
      setHourly([]);
    }
  } else if (response.status === 401) {
    console.log("broken");
  }
};
