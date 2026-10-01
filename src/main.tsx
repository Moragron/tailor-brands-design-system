// Showcase entry (excluded from connected projects, like App.tsx and src/pages/).
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './pages/showcase.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
