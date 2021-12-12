import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Forecast from './pages/Forecast';

function App() {
  return (
    <div className="App">
      <header className="App-header">
      <Router>
        <Routes>
          <Route exact path="/" element={<Forecast/>}/> 
        </Routes>
      </Router>
      </header>
    </div>
  );
}

export default App;
