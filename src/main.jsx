

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { LeadProvider } from "./LeadContext"
import { AuthProvider } from "./AuthContext"
import { BrowserRouter } from "react-router-dom"

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <LeadProvider>
          <App />
        </LeadProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
