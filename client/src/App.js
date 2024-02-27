import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import LoginSignup from './pages/LoginSignup';

const App = () => {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/" component={SearchBooks} />
          <Route exact path="/saved" component={SavedBooks} />
          <Route exact path="/login" component={LoginSignup} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;