import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import SCity from './pages/SCity';
import { Collaborators } from './pages/Collaborators';
import ComingSoon from './pages/ComingSoon';

function App() {
  return (
    <BrowserRouter basename="/collaborators-app">
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Routes>
          <Route path="/" element={<SCity />} />
          <Route path="/collaborators" element={<Collaborators />} />
          <Route path="/market" element={<ComingSoon title="Market" />} />
          <Route path="/restaurants" element={<ComingSoon title="Restaurants" />} />
          <Route path="/grocery" element={<ComingSoon title="Grocery" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
