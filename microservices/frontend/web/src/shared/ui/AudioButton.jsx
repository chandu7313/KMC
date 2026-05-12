import React, { useContext, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { FarmerModeContext } from '@/app/providers/FarmerModeContext';

const AudioButton = ({ text, className = '' }) => {
    const { isFarmerMode } = useContext(FarmerModeContext);
    const [isPlaying, setIsPlaying] = useState(false);

    // Only render if Farmer Mode is active
    if (!isFarmerMode) return null;

    const handlePlayAudio = (e) => {
        e.stopPropagation(); // Prevent triggering parent clicks
        
        if (!window.speechSynthesis) {
            alert("Sorry, your browser doesn't support text to speech!");
            return;
        }

        if (isPlaying) {
            window.speechSynthesis.cancel();
            setIsPlaying(false);
            return;
        }

        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        
        // Try to set language based on app context if possible or default to English
        utterance.lang = 'en-US'; 
        // Can adjust rate, pitch, etc. for better accessibility
        utterance.rate = 0.9; 
        
        utterance.onend = () => {
            setIsPlaying(false);
        };
        
        utterance.onerror = () => {
             setIsPlaying(false);
        };

        setIsPlaying(true);
        window.speechSynthesis.speak(utterance);
    };

    return (
        <button 
            type="button"
            onClick={handlePlayAudio}
            className={`inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 hover:scale-110 transition-all shadow-sm ${className}`}
            aria-label={isPlaying ? "Stop reading" : "Read aloud text"}
            title={isPlaying ? "Stop reading" : "Read text aloud"}
        >
            {isPlaying ? <VolumeX size={16} className="animate-pulse" /> : <Volume2 size={16} />}
        </button>
    );
};

export default AudioButton;
