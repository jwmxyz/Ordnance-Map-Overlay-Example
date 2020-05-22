import React from 'react';
import './App.css';
import GoogleMap from './google/GoogleMap'
import GoogleMapAdvanced from './google/GoogleMapAdvanced'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";


function App() {
  return (
    <div className="App">
      <Router>
      <div>
        <nav>
          <ul>
              <Link to="/simple">Simple Example</Link><br />
              <Link to="/advanced">Advanced Example</Link>
          </ul>
        </nav>

        <Switch>
          <Route path="/">
            <GoogleMap />
          </Route>
          <Route path="/simple">
            <GoogleMap />
          </Route>
          <Route path="/advanced">
            <GoogleMapAdvanced />
          </Route>

        </Switch>
      </div>
    </Router>
    </div>
  );
}

export default App;
