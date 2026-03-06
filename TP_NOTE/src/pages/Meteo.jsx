import "./Meteo.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import sunIcon from "../assets/sun.svg";
import cloudIcon from "../assets/cloud.svg";
import boltIcon from "../assets/bolt.svg";
import searchIcon from "../assets/search.svg";

// on met des données arbitraires
const weatherData = {
  nantes: {
    city: "Nantes",
    country: "France",
    temperature: 16,
    description: "Pluvieux",
  },
  paris: {
    city: "Paris",
    country: "France",
    temperature: 14,
    description: "Nuageux",
  },
  lyon: {
    city: "Lyon",
    country: "France",
    temperature: 15,
    description: "Couvert",
  },
  marseille: {
    city: "Marseille",
    country: "France",
    temperature: 18,
    description: "Ensoleillé",
  },
  toulouse: {
    city: "Toulouse",
    country: "France",
    temperature: 17,
    description: "Nuageux",
  },
  bordeaux: {
    city: "Bordeaux",
    country: "France",
    temperature: 16,
    description: "Pluvieux",
  },
  lille: {
    city: "Lille",
    country: "France",
    temperature: 12,
    description: "Orageux",
  },
  nice: {
    city: "Nice",
    country: "France",
    temperature: 19,
    description: "Ensoleillé",
  },
};

function Meteo() {
  const [city, setCity] = useState("");
  // on prend la dernière ville cherchée en cache pour l'afficher au chargement
  const [weather, setWeather] = useState(() => {
    const lastCity = localStorage.getItem("lastWeatherCity");
    const cached = localStorage.getItem(lastCity);
    return cached ? JSON.parse(cached) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // on choisit une icône en fonction de la description météo (icônes dont on a pris le code svg sur heroicons)
  const getWeatherIcon = (desc) => {
    const d = desc.toLowerCase();
    if (d.includes("pluvieux")) return cloudIcon;
    if (d.includes("nuageux") || d.includes("couvert")) return cloudIcon;
    if (d.includes("ensoleillé")) return sunIcon;
    if (d.includes("orage")) return boltIcon;
    return sunIcon;
  };

  const searchWeather = async (recherche) => {
    if (!recherche) {
      setError("Veuillez entrer une ville");
      return;
    }

    setLoading(true);
    setError("");
    setWeather(null);

    const villeCherchee = recherche.toLowerCase();
    try {
      if (weatherData[villeCherchee]) {
        try {
          // on simule un appel API pour récupérer les données météo
          const res = await fetch("https://dummyjson.com/test");
          if (!res.ok) throw new Error("api_error");

          const data = await res.json();
          if (data.status === "ok") {
            // on stocke les données si l'appel a réussi
            localStorage.setItem(
              `weather_${villeCherchee}`,
              JSON.stringify(weatherData[villeCherchee]),
            );
          } else {
            throw new Error("api_error");
          }
        } catch (err) {
          // si l'on a un problème API, on affiche une erreur si c'est à cause de la connexion ou non
          if (!navigator.onLine) {
            setError("Pas de connexion internet");
          } else {
            setError("Erreur lors de l'appel à l'API");
          }
          console.error(err);
        }

        setWeather(weatherData[villeCherchee]);
      } else {
        // si la ville n'est pas dans les données, on regarde si on a une donnée en cache pour cette ville, sinon on affiche une erreur
        const cached = localStorage.getItem(`weather_${villeCherchee}`);
        if (cached) {
          setWeather(JSON.parse(cached));
        } else if (!navigator.onLine) {
          setError("Pas de connexion internet et aucune donnée en cache");
        } else {
          setError(`Pas de données pour "${recherche}"`);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!navigator.geolocation) return;
    // on récupère la position de l'utilisateur pour afficher la météo de sa ville au chargement
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const { latitude, longitude } = pos.coords;
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`,
        );
        const data = await res.json();
        const cityName =
          data.address.city || data.address.town || data.address.village;

        if (cityName) {
          setCity(cityName);
          searchWeather(cityName);
        }
      } catch (err) {
        if (!navigator.onLine) {
          setError("Pas de connexion internet");
        }
        console.error(err);
      }
    });
  }, []);
  // on stocke la dernière ville cherchée en cache pour pouvoir l'afficher au chargement
  useEffect(() => {
    if (weather) {
      localStorage.setItem(
        "lastWeatherCity",
        `weather_${weather.city.toLowerCase()}`,
      );
    }
  }, [weather]);

  const handleSubmit = () => {
    searchWeather(city);
  };
  // on donne un conseil vestimentaire en fonction de la météo
  const conseil = weather
    ? weather.temperature <= 10
      ? "Il fait froid, prenez un manteau et une écharpe."
      : weather.description.toLowerCase().includes("pluvieux") ||
          weather.description.toLowerCase().includes("orage")
        ? "Prenez une veste imperméable et un parapluie."
        : weather.temperature >= 22
          ? "Temps chaud, privilégiez une tenue légère."
          : "Une tenue de mi-saison sera parfaite aujourd'hui."
    : "";

  return (
    //j'ai fait un routing manuellement mais il n'est pas nécessaire, c'est pour naviguer plus facilement
    <main className="meteo-page">
      <Link to="/" className="back-btn">
        ← home
      </Link>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="search-container"
      >
        <input
          type="text"
          placeholder="Rechercher"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-btn">
          <img src={searchIcon} alt="Rechercher" className="search-icon" />
        </button>
      </form>

      {error && <p className="error">{error}</p>}
      {loading && <p className="loading">Chargement...</p>}

      {weather && (
        <div className="weather-container">
          <div className="location">
            <span className="city">{weather.city}</span>
            <span className="separator">•</span>
            <span className="country">{weather.country}</span>
          </div>

          <div className="weather-info">
            <div className="temperature-section">
              <div className="temperature">{weather.temperature}°C</div>
              <img
                src={getWeatherIcon(weather.description)}
                alt={weather.description}
                className="weather-icon"
              />
            </div>
            <div className="description">{weather.description}</div>
            <div className="description">{conseil}</div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Meteo;
