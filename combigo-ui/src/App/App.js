// import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { Navigation } from '../Components/Navigation/Navigation';
import { Home } from '../screens/Home/Home';
import { Profile } from '../screens/Profile/Profile';


function App() {
  return (
    <Router>
      <div className="app-container">
        <Navigation />
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/profile">
            <Profile />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
