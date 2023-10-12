import { useEffect, useState } from 'react';

export function useLocalStorage(initialState, name) {
    const [watched, setWatched] = useState(getStorage);

    useEffect(
        function () {
            localStorage.setItem(name, JSON.stringify(watched));
        },
        [watched]
    );

    function getStorage() {
        const data = localStorage.getItem(name);
        return JSON.parse(data) || initialState;
    }

    return [watched, setWatched];
}
