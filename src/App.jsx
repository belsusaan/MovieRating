import { useEffect, useState } from "react";
import { Logo, Nav, NumResults, Search } from "./components/Nav";
import { Box } from "./components/Box";
import { MovieList } from "./components/Movie";
import {
  WatchedMoviesContainer,
  WatchedMoviesList,
  WatchedSummary,
} from "./components/WatchedMovie";
import { useFetchMovies } from "./hooks/useFetchMovies";
import { MovieDetails } from "./components/MovieDetails";

/**
Componente principal de la aplicacion.
*/
export default function App() {
  // Función para almacenar en el Local Storage
  function initialList() {
    const localStorageList = localStorage.getItem("watched");
    return localStorageList ? JSON.parse(localStorageList) : [];
  }

  // Estado para la búsqueda de peliculas
  const [query, setQuery] = useState("");

  // Obtiene peliculas basadas en la consulta
  const { movies, isLoading, error } = useFetchMovies(query);

  // Estado de peliculas vistas
  const [watched, setWatched] = useState(initialList);

  // Estado para la película seleccionada
  const [selectedId, setSelectedId] = useState(null);

  //Local storage
  useEffect(() => {
    localStorage.setItem("watched", JSON.stringify(watched));
  }, [watched]);

  /**
   * Maneja la selección de una pelicula.
   * @param {string} id - ID de la pelicula seleccionada.
   */
  function handleSelectMovie(id) {
    setSelectedId(id);
  }

  /**
   * Cierra los detalles de la pelicula.
   */
  function handleCloseMovie() {
    setSelectedId(null);
  }

  /**
   * Agrega una pelicula a la lista de vistas.
   * @param {Object} movie - Pelicula a agregar.
   */
  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  /**
   * Eliminar una pelicula a la lista de vistas.
   * @param {Object} movie - Pelicula a eliminar.
   */
  function handleRemoveWatched(movie) {
    const updateList = watched.filter((item) => item.imdbID !== movie.imdbID);
    setWatched(updateList);
  }

  return (
    <>
      <Nav>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </Nav>
      <main className="main">
        <Box>
          {isLoading && <p className="loader">Cargando ...</p>}
          {error && <p className="error"> {error}</p>}
          <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
        </Box>

        <Box>
          <WatchedMoviesContainer>
            {selectedId ? (
              <MovieDetails
                selectedId={selectedId}
                onCloseMovie={handleCloseMovie}
                onAddWatched={handleAddWatched}
                watched={watched}
                onRemoveWatched={handleRemoveWatched}
              />
            ) : (
              <>
                <WatchedSummary watched={watched} />
                <WatchedMoviesList
                  watched={watched}
                  handleRemoveWatched={handleRemoveWatched}
                />
              </>
            )}
          </WatchedMoviesContainer>
        </Box>
      </main>
    </>
  );
}
