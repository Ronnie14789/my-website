import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Preloader from './components/Preloader';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <BrowserRouter>
      <Preloader />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
