import { BrowserRouter as Router, Route, Routes  } from 'react-router-dom';

import './App.css';

import Navbar from './components/Navbar/Navbar.js';
import Home from './pages/Home/Home.js'; 
import SearchTitle  from './pages/SearchTitle/SearchTitle.js';
import Movie from './pages/Movie/Movie.js';
import ByGenre from './pages/ByGenre/ByGenre.js'
import Name from './pages/Name/Name.js'
import ActorName from './pages/ActorName/ActorName.js'
import Login from './pages/Auth/Login.js'
import SignUp from './pages/Auth/SignUp.js'
import Liked from './pages/Liked/Liked.js'


function App() {
  return (
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/home' element={<Home />} />
          <Route path='/searchTitle' element={<SearchTitle />} />
          <Route path='/movie/:movieID' element={<Movie />} />
          <Route path='/bygenre' element={<ByGenre />} />
          <Route path='/name/:nameID' element={<Name />} />
          <Route path='/actorName' element={<ActorName />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/liked' element={<Liked />} />
        </Routes>
      </Router>
    );
}

export default App;
