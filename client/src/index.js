import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.js'
import { AuthContextProvider } from './contexts/authContext.js'
import { DarkModeContextProvider } from './contexts/darkModeContext.js'

ReactDOM.createRoot(document.getElementById('root')).render(
  <DarkModeContextProvider>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </DarkModeContextProvider>,
);