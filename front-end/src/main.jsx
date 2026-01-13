import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import { NetworkProvider } from './context/NetworkContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <NetworkProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </NetworkProvider>
  </React.StrictMode>,
)