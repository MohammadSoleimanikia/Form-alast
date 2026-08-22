import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { SWRConfig } from 'swr';
import { Toaster } from 'react-hot-toast';
import UserProvider from './providers/userProvider';
import ThemeProvider from '@/theme';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { BrowserRouter } from 'react-router-dom';
createRoot(document.getElementById('root')!).render(
  <StrictMode>
  <Provider store={store}>
    <BrowserRouter>
      <SWRConfig
        value={{
          errorRetryCount: 3,
          revalidateOnFocus: false,
        }}
      >
        <UserProvider>
          <ThemeProvider>
            <App />
            <Toaster
              position="bottom-center"
              toastOptions={{
                duration: 4000,
              }}
            />
          </ThemeProvider>
        </UserProvider>
      </SWRConfig>
    </BrowserRouter>
  </Provider>
</StrictMode>
);
