import { useEffect } from 'react';

export function useKey(key, oncallback) {
    useEffect(
        function () {
            const callback = function (e) {
                if (e.code === key) {
                    oncallback();
                }
            };

            document.addEventListener('keydown', callback);

            return () => document.removeEventListener('keydown', callback);
        },
        [oncallback]
    );
}
