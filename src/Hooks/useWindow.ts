import { useState, useEffect } from "react";

const useWindowDimensions = () => {
    const [windowDimensions, setWindowDimensions] = useState<{
        width: number,
        height: number
    }>({
        width: typeof window !== 'undefined' ? window.innerWidth : 650,
        height: typeof window !== 'undefined' ? window.innerHeight : 650,
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const handleResize = () => {
                setWindowDimensions({
                    width: window.innerWidth,
                    height: window.innerHeight,
                });
            };
            window.addEventListener("resize", handleResize);
            return () => window.removeEventListener("resize", handleResize);
        }
    }, []);

    return windowDimensions;
};

export default useWindowDimensions;