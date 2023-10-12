import { useEffect, useRef, useState } from 'react';
import StarRating from './StarRating.jsx';
import { useMovies } from './useMovies.jsx';
import { useLocalStorage } from './useLocalStorage.jsx';
import { useKey } from './useKey.jsx';

const tempMovieData = [
    {
        imdbID: 'tt1375666',
        Title: 'Inception',
        Year: '2010',
        Poster: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
    },
    {
        imdbID: 'tt0133093',
        Title: 'The Matrix',
        Year: '1999',
        Poster: 'https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg',
    },
    {
        imdbID: 'tt6751668',
        Title: 'Parasite',
        Year: '2019',
        Poster: 'https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg',
    },
];

const tempWatchedData = [
    {
        imdbID: 'tt1375666',
        Title: 'Inception',
        Year: '2010',
        Poster: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
        runtime: 148,
        imdbRating: 8.8,
        userRating: 10,
    },
    {
        imdbID: 'tt0088763',
        Title: 'Back to the Future',
        Year: '1985',
        Poster: 'https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg',
        runtime: 116,
        imdbRating: 8.5,
        userRating: 9,
    },
];
const KEY = '5519c6f0';

const average = (arr) =>
    arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export function Button({ handler, children }) {
    return (
        <button className="btn-toggle" onClick={handler}>
            {children}
        </button>
    );
}

export default function App() {
    const [query, setQuery] = useState('');

    const [watched, setWatched] = useLocalStorage([], 'watched');

    const [selectedID, setSelectedID] = useState(null);

    function handleSelectedMovie(movieID) {
        if (movieID === selectedID) {
            setSelectedID(null);
            return;
        }
        setSelectedID(movieID);
    }
    function handleCloseSelected() {
        setSelectedID(null);
    }

    function handleAddWatched(movie) {
        const temp = watched.find((entry) => entry.imdbID === movie.imdbID);

        if (temp) {
            temp.userRating = movie.userRating;
            return;
        }
        setWatched((watched) => [...watched, movie]);
    }

    function handleDeleteWatched(id) {
        setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
    }

    let [movies, isLoading, error] = useMovies(query, handleCloseSelected);

    return (
        <>
            <NavBar>
                <Logo />
                <Search query={query} setQuery={setQuery} />
                <Result movies={movies} />
            </NavBar>
            <main className="main">
                <Box>
                    {isLoading && <Loader />}
                    {!isLoading && !error && (
                        <MovieList
                            movies={movies}
                            onhandleSelectedMovie={handleSelectedMovie}
                        />
                    )}
                    {error && <ErrorMessage message={error} />}
                </Box>
                <Box>
                    {selectedID ? (
                        <MovieDetails
                            selectedID={selectedID}
                            onhandleCloseSelected={handleCloseSelected}
                            onhandleAddWatched={handleAddWatched}
                        />
                    ) : (
                        <>
                            <WatchedSummary watched={watched} />
                            <WatchedMovieList
                                watched={watched}
                                onhandleDeleteWatched={handleDeleteWatched}
                            />
                        </>
                    )}
                </Box>
            </main>
        </>
    );
}

function Loader() {
    return <p className="loader">Loading...</p>;
}

function ErrorMessage({ message }) {
    return <p className="error">{message}</p>;
}

function NavBar({ children }) {
    return <nav className="nav-bar">{children}</nav>;
}
function Logo() {
    return (
        <div className="logo">
            <span role="img">🍿</span>
            <h1>usePopcorn</h1>
        </div>
    );
}
function Search({ query, setQuery }) {
    const inputEl = useRef(null);
    useEffect(function () {
        inputEl.current.focus();
    }, []);

    function onhandleEnter() {
        if (document.activeElement === inputEl.current) return;
        inputEl.current.focus();
        setQuery('');
    }

    useKey('Enter', onhandleEnter);

    return (
        <input
            className="search"
            type="text"
            placeholder="Search movies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            ref={inputEl}
        />
    );
}
function Result({ movies }) {
    return (
        <p className="num-results">
            Found <strong>{movies.length}</strong> results
        </p>
    );
}

function WatchedSummary({ watched }) {
    const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
    const avgUserRating = average(watched.map((movie) => movie.userRating));
    const avgRuntime = average(watched.map((movie) => movie.runtime));
    return (
        <div className="summary">
            <h2>Movies you watched</h2>
            <div>
                <p>
                    <span>#️⃣</span>
                    <span>{watched.length} movies</span>
                </p>
                <p>
                    <span>⭐️</span>
                    <span>{avgImdbRating.toFixed(2)}</span>
                </p>
                <p>
                    <span>🌟</span>
                    <span>{avgUserRating.toFixed(2)}</span>
                </p>
                <p>
                    <span>⏳</span>
                    <span>{avgRuntime.toFixed(2)} min</span>
                </p>
            </div>
        </div>
    );
}

function MovieList({ movies, onhandleSelectedMovie }) {
    return (
        <ListBox>
            {movies?.map((movie) => (
                <Movie
                    movie={movie}
                    onhandleSelectedMovie={onhandleSelectedMovie}
                    key={movie.imdbID}
                />
            ))}
        </ListBox>
    );
}

function WatchedMovieList({ watched, onhandleDeleteWatched }) {
    return (
        <ListBox>
            {watched.map((movie) => (
                <WatchedMovie
                    movie={movie}
                    key={movie.imdbID}
                    onhandleDeleteWatched={onhandleDeleteWatched}
                />
            ))}
        </ListBox>
    );
}

function ListBox({ children }) {
    return <ul className="list">{children}</ul>;
}

function WatchedMovie({ movie, onhandleDeleteWatched }) {
    return (
        <li>
            <img src={movie.Poster} alt={`${movie.Title} poster`} />
            <h3>{movie.Title}</h3>
            <div>
                <p>
                    <span>⭐️</span>
                    <span>{movie.imdbRating}</span>
                </p>
                <p>
                    <span>🌟</span>
                    <span>{movie.userRating}</span>
                </p>
                <p>
                    <span>⏳</span>
                    <span>{movie.runtime} min</span>
                </p>
            </div>
            <button
                className="btn-delete"
                onClick={() => onhandleDeleteWatched(movie.imdbID)}
            >
                X
            </button>
        </li>
    );
}

export function Box({ children }) {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="box">
            <Button handler={() => setIsOpen((open) => !open)}>
                {isOpen ? '–' : '+'}
            </Button>
            {isOpen && <>{children}</>}
        </div>
    );
}
function Movie({ movie, onhandleSelectedMovie }) {
    return (
        <li onClick={() => onhandleSelectedMovie(movie.imdbID)}>
            <img src={movie.Poster} alt={`${movie.Title} poster`} />
            <h3>{movie.Title}</h3>
            <div>
                <p>
                    <span>🗓</span>
                    <span>{movie.Year}</span>
                </p>
            </div>
        </li>
    );
}

function MovieDetails({
    selectedID,
    onhandleCloseSelected,
    onhandleAddWatched,
}) {
    const [movieDetails, setMovieDetails] = useState(null);
    const [onloading, setOnloading] = useState(true);
    // let isTop, setIsTop;

    function handleAdd() {
        const newWatchMovie = {
            imdbID: selectedID,
            Title: movieDetails.Title,
            Year: movieDetails.Year,
            Poster: movieDetails.Poster,
            imdbRating: Number(movieDetails.imdbRating),
            runtime: Number(movieDetails.Runtime.split(' ').at(0)),
            userRating: movieDetails.userRating,
        };
        onhandleAddWatched(newWatchMovie);
        onhandleCloseSelected();
    }

    // if (movieDetails?.imdbRating > 8) [isTop, setIsTop] = useState(true);

    function handleUserRating(rating) {
        setMovieDetails((s) => ({ ...s, userRating: rating }));
    }

    useEffect(
        function () {
            async function loadDetails() {
                try {
                    setOnloading(true);
                    const res = await fetch(
                        `http://www.omdbapi.com/?i=${selectedID}&apikey=${KEY}`
                    );
                    if (!res.ok)
                        throw new Error(
                            'Something went wrong with fetching movies!'
                        );

                    const data = await res.json();
                    if (data.Response === 'False')
                        throw new Error('Can not find that movie!');

                    setMovieDetails(data);
                } catch (err) {
                    console.error(err);
                    throw new Error(err.message);
                } finally {
                    setOnloading(false);
                }
            }
            loadDetails();
        },
        [selectedID]
    );

    useEffect(
        function () {
            if (!movieDetails?.Title) return;
            document.title = `Movie | ${movieDetails.Title}`;

            return () => (document.title = 'usePopcorn');
        },
        [movieDetails]
    );

    useKey('Escape', onhandleCloseSelected);

    return (
        <div className="details">
            {onloading ? (
                <Loader />
            ) : (
                <>
                    <header>
                        <button
                            className="btn-back"
                            onClick={onhandleCloseSelected}
                        >
                            &larr;
                        </button>
                        <img src={movieDetails.Poster} alt="post" />
                        <div className="details-overview">
                            <h2>{movieDetails.Title}</h2>
                            <p>
                                {movieDetails.Released} &bull;
                                {movieDetails.Runtime}
                            </p>
                            <p>{movieDetails.Genre}</p>
                            <p>
                                <span>⭐</span>
                                {movieDetails.imdbRating}
                            </p>
                        </div>
                    </header>

                    <section>
                        <div className="rating">
                            <StarRating
                                maxRating={10}
                                size={24}
                                onSetRating={handleUserRating}
                            />
                            <button className="btn-add" onClick={handleAdd}>
                                + Add to list
                            </button>
                        </div>
                        <p>
                            <em>{movieDetails.Plot}</em>
                        </p>

                        <p>Starring {movieDetails.Actors}</p>
                        <p>Directed by {movieDetails.Director}</p>
                    </section>
                </>
            )}
        </div>
    );
}
