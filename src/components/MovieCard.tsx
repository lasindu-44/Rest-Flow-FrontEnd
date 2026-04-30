import { useNavigate } from "react-router-dom";

import "../css/MovieCard.css";

const MovieCard = ({ movie, onFavoriteClick }: any) => {
  const navigate = useNavigate();

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 🚨 prevents navigation
    onFavoriteClick(movie);
  };

  return (
    <div
      className="movie-card"
      onClick={() => navigate("/Menu", { state: movie })}
    >
      <div className="movie-poster">
        <img src={movie.imageUrl} alt={movie.name} />
        <div className="movie-overlay">
          <button className="favorite-btn" onClick={handleFavoriteClick}>
            ♥
          </button>
          <div className="view-menu-text">View Menu</div>
        </div>
      </div>
      <div className="movie-info">
        <h3>{movie.name}</h3>
        <p>{movie.address}</p>
        <p>
          {movie.openTime} - {movie.closeTime}
        </p>
        <p>{movie.phone}</p>
      </div>
    </div>
  );
};

export default MovieCard;
