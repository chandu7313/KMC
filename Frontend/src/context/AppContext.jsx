/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */


import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

export const AppContext = createContext();

export const AppContextProvider=(props)=>{

    axios.defaults.withCredentials = true
    const { i18n } = useTranslation();

    const backendUrl=import.meta.env.VITE_BACKEND_URL
    const [isLoggedin, setIsLoggedin] = useState(false)
    const [userData, setUserData] = useState(false)
    const [loading, setLoading] = useState(true)
    const [runTour, setRunTour] = useState(false)
    const [voiceEnabled, setVoiceEnabled] = useState(localStorage.getItem('voiceEnabled') !== 'false')

    const getAuthState = async ()=>{
        try{
            const {data} = await axios.get(backendUrl + '/api/auth/is-auth')

            if(data.success){
                setIsLoggedin(true)
                getUserData()
            } else {
                setLoading(false)
            }

        }catch(error){
            toast.error(error.message)
            setLoading(false)
        }
    }

    const getUserData = async ()=>{
        try{
            const {data} = await axios.get(backendUrl + '/api/user/data')
            if (data.success) {
                setUserData(data.userData)
            } else {
                toast.error(data.message)
            }
        }catch(error){
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    const completeTour = () => {
        setRunTour(false);
        localStorage.setItem('tourCompleted', 'true');
    };

    const toggleVoice = () => {
        setVoiceEnabled(prev => {
            const newValue = !prev;
            localStorage.setItem('voiceEnabled', String(newValue));
            if (!newValue && window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }
            return newValue;
        });
    };

    useEffect(()=>{
        getAuthState()
        if (!localStorage.getItem('tourCompleted') && localStorage.getItem('languageSet')) {
            setRunTour(true);
        }
    },[])

    const value = {
        backendUrl,
        isLoggedin,setIsLoggedin,
        userData,setUserData,
        getUserData,
        loading,
        runTour, setRunTour, completeTour,
        voiceEnabled, toggleVoice
    }



    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )

}


