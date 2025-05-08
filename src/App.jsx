import { Routes, Route } from 'react-router-dom';

import Navbar from './Components/navbar';
import Home from './Components/Home';
import About from './Components/About';
import Product from './Components/Product';
import Contact from './Components/Contact';
import LoggedInHome from './Components/LoggedInHome';


function App() {
  return (
    <Routes>
      <Route path="/" element={<><Navbar /><Home /><About /><Product /><Contact /></>} />
      <Route path="/home" element={<LoggedInHome />} />
    </Routes>
  );
}

export default App;
