import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n/index'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AppContextProvider } from './context/AppContext.jsx'
import { LanguageProvider } from './context/LanguageContext.jsx'
import { FarmerModeProvider } from './context/FarmerModeContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AppContextProvider>
      <LanguageProvider>
        <FarmerModeProvider>
          <App />
        </FarmerModeProvider>
      </LanguageProvider>
    </AppContextProvider>
  </BrowserRouter>,
)
