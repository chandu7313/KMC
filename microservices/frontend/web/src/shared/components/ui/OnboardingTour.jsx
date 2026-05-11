import { useContext, useCallback, useEffect } from 'react';
import Joyride, { STATUS } from 'react-joyride';
import { AppContext } from '../../../context/AppContext';
import { LanguageContext } from '../../../context/LanguageContext';
import { useTranslation } from 'react-i18next';
import { Zap } from 'lucide-react';

const OnboardingTour = () => {
    const { runTour, completeTour, voiceEnabled, toggleVoice } = useContext(AppContext);
    const { language } = useContext(LanguageContext);
    const { t } = useTranslation();

    const voiceNarration = useCallback((text) => {
        if (!window.speechSynthesis || !voiceEnabled) return;
        
        // Stop any current speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        
        // Set language-specific voice if possible
        const voices = window.speechSynthesis.getVoices();
        let langCode = 'en-IN';
        if (language === 'hi') langCode = 'hi-IN';
        if (language === 'te') langCode = 'te-IN'; 
        
        utterance.lang = langCode;
        
        const voice = voices.find(v => v.lang.startsWith(langCode));
        if (voice) utterance.voice = voice;

        window.speechSynthesis.speak(utterance);
    }, [language, voiceEnabled]);

    useEffect(() => {
        return () => {
            if (window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    const steps = [
        {
            target: '#hero-section',
            content: t('tour_hero', 'Welcome to KMC! This is your control center for data-driven farming.'),
            disableBeacon: true,
        },
        {
            target: '#services-section',
            content: t('tour_services', 'Explore our precision services including soil analysis and crop health monitoring.'),
        },
        {
            target: '#login-button',
            content: t('tour_login', 'Join our community of 10,000+ happy farmers. Register or Login here.'),
        },
        {
            target: '#contact-button',
            content: t('tour_help', 'Need assistance? Book a farm visit or contact our agronomists anytime.'),
        }
    ];

    const handleJoyrideCallback = (data) => {
        const { status, type, step } = data;

        if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
            completeTour();
            window.speechSynthesis.cancel();
        }

        if (type === 'step:after' || type === 'tour:start' || type === 'tooltip') {
            // Check if step changed or tour started
            if (data.action === 'next' || data.action === 'prev' || data.action === 'start') {
                const currentStep = steps[data.index];
                if (currentStep && voiceEnabled) {
                    voiceNarration(currentStep.content);
                }
            }
            if (data.action === 'update' && type === 'tooltip' && data.index === 0 && runTour) {
                 // Trigger first step narration on start
                 voiceNarration(steps[0].content);
            }
        }
    };

    return (
        <>
        <Joyride
            steps={steps}
            run={runTour}
            continuous={true}
            showSkipButton={true}
            showProgress={true}
            styles={{
                options: {
                    primaryColor: '#16a34a',
                    zIndex: 1000,
                },
                tooltipContainer: {
                    textAlign: 'left',
                },
                buttonNext: {
                   borderRadius: '12px',
                   fontFamily: 'serif',
                   fontWeight: '900',
                   textTransform: 'uppercase',
                   fontSize: '10px',
                   letterSpacing: '0.1em',
                   padding: '12px 24px'
                },
                buttonBack: {
                   marginRight: '12px',
                   fontSize: '10px',
                   fontWeight: '900',
                   textTransform: 'uppercase',
                   letterSpacing: '0.1em',
                },
                buttonSkip: {
                    fontSize: '10px',
                    fontWeight: '900',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                }
            }}
            callback={handleJoyrideCallback}
            locale={{
                back: t('back', 'Back'),
                close: t('close', 'Close'),
                last: t('finish', 'Finish'),
                next: t('next', 'Next'),
                skip: t('skip', 'Skip')
            }}
        />
        {runTour && (
            <div className="fixed bottom-6 right-6 z-[1100] animate-in slide-in-from-right duration-500">
                <button 
                    onClick={toggleVoice}
                    className={`flex items-center gap-3 px-6 py-3 rounded-2xl border-2 transition-all shadow-xl font-black text-[10px] uppercase tracking-widest ${
                        voiceEnabled 
                        ? 'bg-green-600 border-green-500 text-white shadow-green-900/20' 
                        : 'bg-white border-slate-100 text-slate-400 shadow-slate-900/10'
                    }`}
                >
                    <div className="relative">
                        <Zap size={14} className={voiceEnabled ? 'text-yellow-400' : ''} />
                        {!voiceEnabled && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-0.5 bg-slate-400 rotate-45" />}
                    </div>
                    {voiceEnabled ? t('voice_on', 'Voice On') : t('voice_off', 'Voice Off')}
                </button>
            </div>
        )}
        </>
    );
};

export default OnboardingTour;
