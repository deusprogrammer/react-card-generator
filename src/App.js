import React from 'react'
import {BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom'

import './App.css'

import Card from './components/Card'
import Cards from './components/Cards'

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/cards" exact component={Cards} />
          <Route path="/cards/:id" exact component={Card} />
          <Redirect to="/cards" />
        </Switch>
      </div>
    </Router>
  )
}

export default App
