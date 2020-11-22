import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import CongressView from './components/views/CongressView';
import AboutView from './components/views/AboutView';

import './App.scss';

interface IAppProps {
}

const App = (props: IAppProps) => {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/about" component={AboutView} />
          <Route path="/" component={CongressView} />
        </Switch>
      </Router>
    </div>
  )
}

export default App;
