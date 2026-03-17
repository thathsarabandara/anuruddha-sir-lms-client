import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './app/store'
import './index.css'
import './i18n/config'
import App from './App.jsx'
import { STORAGE_KEYS } from './utils/constants'

const validateAuthData = () => {
  try {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    
    if ((token && !user) || (!token && user)) {
      console.log('Inconsistent auth data detected. Clearing...');
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      return;
    }
    
    if (user) {
      try {
        JSON.parse(user);
      } catch (e) {
        console.log('User data is invalid JSON. Clearing...', e);
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      }
    }
  } catch (error) {
    console.error('Error validating auth data:', error);
  }
};

validateAuthData();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
