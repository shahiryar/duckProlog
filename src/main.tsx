import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { Toaster } from "react-hot-toast"
import { Provider } from "react-redux"
import { store } from './store/store.ts'

import './index.scss'

const root = document.createElement("div")
root.id = "duck-root"
document.body.appendChild(root)

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
    <Toaster />
  </React.StrictMode>,
)
