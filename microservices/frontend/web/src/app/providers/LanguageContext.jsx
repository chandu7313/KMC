import { createContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { useGlobalStore } from '@/app/store/globalStore';

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const { i18n } = useTranslation();
    const { isLoggedin, backendUrl, userData } = useGlobalStore();
    
    // Check if language has been set previously
    const isLanguageSet = localStorage.getItem('languageSet') === 'true';
    
    const [language, setLanguage] = useState(localStorage.getItem('i18nextLng') || 'en');
    const [showLanguageModal, setShowLanguageModal] = useState(!isLanguageSet);

    const changeLanguage = async (newLang, syncWithBackend = true) => {
        i18n.changeLanguage(newLang);
        setLanguage(newLang);
        localStorage.setItem('languageSet', 'true');
        setShowLanguageModal(false);

        if (syncWithBackend && isLoggedin) {
            try {
                await axios.post(backendUrl + '/api/user/update-language', { language: newLang });
            } catch (error) {
                console.error("Failed to sync language with backend", error);
            }
        }
    };

    useEffect(() => {
        if (userData && userData.language && userData.language !== language) {
            changeLanguage(userData.language, false);
        }
    }, [userData]);

    useEffect(() => {
        // Sync with i18next detected language if no localStorage set
        if (!localStorage.getItem('i18nextLng')) {
            localStorage.setItem('i18nextLng', i18n.language);
            setLanguage(i18n.language);
        }
    }, [i18n.language]);

    return (
        <LanguageContext.Provider value={{ language, changeLanguage, showLanguageModal, setShowLanguageModal }}>
            {children}
        </LanguageContext.Provider>
    );
};
