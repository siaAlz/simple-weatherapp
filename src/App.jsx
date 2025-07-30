import { useState } from "react";
import { CitiesProvider, useCities } from "./CitiesContext";

function App() {
  return (
    <div className="flex flex-col items-center py-2">
      <Header></Header>
      <CitiesProvider>
        <Main></Main>
      </CitiesProvider>
    </div>
  );
}
export default App;

function Header() {
  return (
    <h2 className="text-3xl font-bold text-gray-800 text-center mb-4">
      Weather App
    </h2>
  );
}
function Main() {
  return (
    <div>
      <Form />
      <Result />
    </div>
  );
}

function Form() {
  const [queryCity, setQueryCity] = useState("");
  const { cities, setCities, setIsLoading } = useCities();

  function handleFetch() {
    async function fetchWeather() {
      setIsLoading(true);
      // return before fetch to avoid unnecessary fetch!
      try {
        if (!queryCity) return;
        const api = `https://api.openweathermap.org/data/2.5/weather?q=${queryCity
          .trim()
          .toLowerCase()}&appid=a30beba661406d43ba3163b5b9121eae&units=metric`;

        const res = await fetch(api);
        const data = await res.json();

        if (data.cod !== "200" && data.cod !== 200) {
          alert(`Error ${data.message}`);
          return;
        }
        if (cities.some((c) => c.city === data.name)) {
          alert("city already added");
          return;
        }
        console.log("passed the conditions");
        setCities((prevCities) => {
          const updatedCities = [
            ...prevCities,
            {
              city: data.name,
              temp: data.main.temp,
              weather: data.weather.at(0).main,
              emoji: `https://openweathermap.org/img/wn/${
                data.weather.at(0).icon
              }@2x.png`,
            },
          ];
          localStorage.setItem("state", JSON.stringify(updatedCities));
          return updatedCities;
        });
        setQueryCity("");
      } catch (error) {
        alert("failed to fetch weather data");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchWeather();
  }
  return (
    <div className="flex flex-col gap-2 mb-4">
      <input
        onChange={(e) => setQueryCity(e.target.value)}
        value={queryCity}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleFetch();
        }}
        className=" w-full max-w-sm px-4 py-2 border border-gray-300 rounded-md text-center placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        type="text"
        placeholder="Enter your city name"
      />
      <button
        onClick={handleFetch}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
      >
        <span className="text-pink-900 font-semibold">Get</span> Weather
      </button>
    </div>
  );
}
function Result() {
  const { cities, isLoading } = useCities();
  return (
    <div className="flex flex-col-reverse gap-4">
      {cities.map((city) => (
        <WeatherCard
          city={city.city}
          temp={city.temp}
          weather={city.weather}
          emoji={city.emoji}
          key={city.city}
        />
      ))}
      {isLoading ? <p>is Loading...</p> : null}
    </div>
  );
}

function WeatherCard({ city, temp, weather, emoji }) {
  return (
    <div className="border-1 p-2">
      <h3>
        <span className="font-semibold">City</span>: {city}
      </h3>
      <p>
        <span className="text-pink-900 font-semibold">Temp</span>: {temp}°C
      </p>
      <div className="flex items-center">
        <p className="font-semibold">Weather</p>: {weather}{" "}
        <img className="w-8" src={emoji} />
      </div>
    </div>
  );
}
