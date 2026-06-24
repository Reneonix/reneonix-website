import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles/global.css';

// Disable browser scroll restoration globally. Must run before window.load
// so the browser never tries to jump to a saved scroll position on any
// refresh. GSAP ScrollTrigger requires scroll=0 on mount to calculate
// pin positions correctly; browser scroll restoration races against that.
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
