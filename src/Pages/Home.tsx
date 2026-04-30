import MovieCard from "../components/MovieCard";
import { useState } from "react";
import { useEffect } from "react";
import "../css/Home.css";
import { BackendURL } from "../Services/BackendURL";
import { useNavigate } from "react-router-dom";


function Home() {
  const [sarchQuery, SetSearchQuery] = useState("");
  /*const [movies, setMovies] = useState<any[]>([]);*/
  const [Error, seterror] = useState("");
  const [loading, setloading] = useState(false);
  const navigate = useNavigate();

  interface Restaurantdetails {
    Id: number;
    name: string;
    phone: string;
    address: string;
    imageUrl: string;
    openTime: string;
    closeTime: string;
  }

  const [movies, setMovies] = useState<Restaurantdetails[]>([]);

  useEffect(() => {
    fetchActiveRestaurants();
  }, []);

  const fetchActiveRestaurants = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        BackendURL + "/api/Restaurant/fetchAllRestaurants",

        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 401) {
        navigate("/SignIn");
        return;
      }

      if (!response.ok) {
        alert("Failed to fetch Restaurant");
      }

      const data = await response.json();
      console.log("Fetched Restaurants:", data);
      setMovies(data);
    } catch (error) {
      console.error(error);
    } finally {
      console.log("Fetch restaurants completed");
    }
  };

  



  return (
    <div className="home">
      <form  className="search-form">
        <input
          type="text"
          placeholder="Search for Restaurants"
          className="search-input"
          value={sarchQuery}
          onChange={(e) => SetSearchQuery(e.target.value)}
        ></input>
      
      </form>
      {Error && <div className="error-message">{Error}</div>}
      {loading ? (
        <div className="loading">Loding...</div>
      ) : (
        <div className="movies-grid">
          {movies
            .filter((movie) =>
              movie.name.toLowerCase().includes(sarchQuery.toLowerCase()),
            )
            .map((movie) => (
              <MovieCard movie={movie} key={movie.name} />
            ))}
        </div>
      )}
    </div>
  );
}

export default Home;
