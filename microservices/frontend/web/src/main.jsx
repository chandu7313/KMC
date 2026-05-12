/**
 * main.jsx — Application Entry Point
 * 
 * Sets up the provider tree:
 * BrowserRouter → AppContextProvider → LanguageProvider → FarmerModeProvider → App
 * 
 * NOTE: Uses core/i18n for initialization (moved from src/i18n).
 */
import { createRoot } from 'react-dom/client';
import './index.css';
import './core/i18n/index';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { LanguageProvider } from '@/app/providers/LanguageContext.jsx';
import { FarmerModeProvider } from '@/app/providers/FarmerModeContext.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <LanguageProvider>
      <FarmerModeProvider>
        <App />
      </FarmerModeProvider>
    </LanguageProvider>
  </BrowserRouter>,
);
