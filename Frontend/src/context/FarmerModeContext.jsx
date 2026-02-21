import React, { createContext, useState, useEffect } from 'react';

export const FarmerModeContext = createContext(null);

export const FarmerModeProvider = ({ children }) => {
    // Check local storage for initial state, default to false if not found
    const [isFarmerMode, setIsFarmerMode] = useState(() => {
        const savedMode = localStorage.getItem('kmc_farmer_mode');
        return savedMode ? JSON.parse(savedMode) : false;
    });

    // Toggle the mode and save to local storage
    const toggleFarmerMode = () => {
        setIsFarmerMode(prevMode => {
            const newMode = !prevMode;
            localStorage.setItem('kmc_farmer_mode', JSON.stringify(newMode));
            return newMode;
        });
    };

    // Apply or remove the global CSS class based on the state
    useEffect(() => {
        if (isFarmerMode) {
            document.body.classList.add('farmer-mode');
        } else {
            document.body.classList.remove('farmer-mode');
        }
        
        // Cleanup function (though likely not needed on body, good practice)
        return () => {
            document.body.classList.remove('farmer-mode');
        };
    }, [isFarmerMode]);

    return (
        <FarmerModeContext.Provider value={{ isFarmerMode, toggleFarmerMode }}>
            {children}
        </FarmerModeContext.Provider>
    );
};
