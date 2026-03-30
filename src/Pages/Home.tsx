import MovieCard from "../components/MovieCard";
import { useState } from "react";
import { useEffect } from "react";
import { getPopularMovies, searchMovies } from "../Services/api";
import { getUserRole } from "../Services/ReadToke";

import "../css/Home.css";
import Navbar from "../components/NavBar";

function Home() {
  const [sarchQuery, SetSearchQuery] = useState("");
  /*const [movies, setMovies] = useState<any[]>([]);*/
  const [Error, seterror] = useState("");
  const [loading, setloading] = useState(false);

  

  const [movies, setMovies] = useState<any[]>([
    {
      id: 1,
      name: "Hill City Cafe",
      location: "Kandy",
      image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2b/3a/47/86/barista-kurunegala.jpg",
      status: "Open",
      rating: 4.5,
      reviews: 120,
      priceRange: "$$",
      category: "Cafe",
      distance: "2.5 km",
      isFavorite: true,
      openingHours: "8:00 AM - 10:00 PM",
      contact: "+94 77 123 4567",
      description: "A cozy cafe with scenic hill views and great coffee.",
      tags: ["Coffee", "Chill", "Scenic"],
    },
    {
      id: 2,
      name: "Ocean Breeze",
      location: "Galle",
      image: "https://images.trvl-media.com/lodging/15000000/14740000/14737500/14737424/eca2bb48.jpg?impolicy=resizecrop&rw=575&rh=575&ra=fill",
      status: "Open",
      rating: 4.7,
      reviews: 200,
      priceRange: "$$$",
      category: "Restaurant",
      distance: "1.2 km",
      isFavorite: false,
      openingHours: "10:00 AM - 11:00 PM",
      contact: "+94 71 987 6543",
      description: "Seafood restaurant with stunning ocean views.",
      tags: ["Seafood", "Luxury", "Beach"],
    },
    {
      id: 3,
      name: "City Lights Dine",
      location: "Colombo",
      image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2a/99/22/01/bailey-s-lounge-bar-italian.jpg?w=900&h=500&s=1",
      status: "Closed",
      rating: 4.2,
      reviews: 95,
      priceRange: "$$",
      category: "Fine Dining",
      distance: "3.8 km",
      isFavorite: true,
      openingHours: "6:00 PM - 12:00 AM",
      contact: "+94 76 555 1122",
      description: "Modern dining experience in the heart of the city.",
      tags: ["Dinner", "City View", "Modern"],
    },
     {
      id: 5,
      name: "Hill City Cafe",
      location: "Kandy",
      image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2b/3a/47/86/barista-kurunegala.jpg",
      status: "Open",
      rating: 4.5,
      reviews: 120,
      priceRange: "$$",
      category: "Cafe",
      distance: "2.5 km",
      isFavorite: true,
      openingHours: "8:00 AM - 10:00 PM",
      contact: "+94 77 123 4567",
      description: "A cozy cafe with scenic hill views and great coffee.",
      tags: ["Coffee", "Chill", "Scenic"],
    }, {
      id: 6,
      name: "Hill City Cafe",
      location: "Kandy",
      image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2b/3a/47/86/barista-kurunegala.jpg",
      status: "Open",
      rating: 4.5,
      reviews: 120,
      priceRange: "$$",
      category: "Cafe",
      distance: "2.5 km",
      isFavorite: true,
      openingHours: "8:00 AM - 10:00 PM",
      contact: "+94 77 123 4567",
      description: "A cozy cafe with scenic hill views and great coffee.",
      tags: ["Coffee", "Chill", "Scenic"],
    }, {
      id: 7,
      name: "Hill City Cafe",
      location: "Kandy",
      image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2b/3a/47/86/barista-kurunegala.jpg",
      status: "Open",
      rating: 4.5,
      reviews: 120,
      priceRange: "$$",
      category: "Cafe",
      distance: "2.5 km",
      isFavorite: true,
      openingHours: "8:00 AM - 10:00 PM",
      contact: "+94 77 123 4567",
      description: "A cozy cafe with scenic hill views and great coffee.",
      tags: ["Coffee", "Chill", "Scenic"],
    },
  ]);

 /* useEffect(() => {
    const Loadpopularmovies = async () => {
      try {
        const popularmovies = await getPopularMovies();
        setMovies(popularmovies);
      } catch (err) {
        console.log(err);
        seterror("Failed to Load Movies...");
      } finally {
        setloading(false);
      }
    };
    Loadpopularmovies();
  }, []);*/

  const LoadSearchmovies = async () => {
    try {
      const searchmovies = await searchMovies(sarchQuery);
      setMovies(searchmovies);
    } catch (err) {
      console.log(err);
      seterror("Failed to Load Movies...");
    } finally {
      setloading(false);
    }
  };

  const handleSearch = (e: any) => {
    e.preventDefault();
    LoadSearchmovies();
  };

  return (
    <div className="home">
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search for movies"
          className="search-input"
          value={sarchQuery}
          onChange={(e) => SetSearchQuery(e.target.value)}
        ></input>
        <button type="submit" className="search-button">
          Search
        </button>
      </form>
      {Error && <div className="error-message">{Error}</div>}
      {loading ? (
        <div className="loading">Loding...</div>
      ) : (
        <div className="movies-grid">
          {movies.map((movie) => (
            <MovieCard movie={movie} key={movie.id} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
