import { useEffect, useState } from 'react';
const KEY = '5519c6f0';

export function useMovies(query, callback) {
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(
        function () {
            const controller = new AbortController();
            callback?.();

            async function fetchMovies() {
                try {
                    setError('');
                    setIsLoading(true);
                    const res = await fetch(
                        `http://www.omdbapi.com/?s=${query}&apikey=${KEY}`,
                        { signal: controller.signal }
                    );
                    if (!res.ok)
                        throw new Error(
                            'Something went wrong with fetching movies!'
                        );

                    const data = await res.json();
                    if (data.Response === 'False')
                        throw new Error('Can not find that movie!');
                    setMovies(data.Search);
                    setError('');
                } catch (err) {
                    if (err.name !== 'AbortError') {
                        console.error(err.message);
                        setError(err.message);
                    }
                } finally {
                    setIsLoading(false);
                }
            }

            if (query.length < 3) {
                setMovies([]);
                setError('');
                return;
            }
            fetchMovies();

            return () => controller.abort();
        },
        [query]
    );

    return [movies, isLoading, error];
}
