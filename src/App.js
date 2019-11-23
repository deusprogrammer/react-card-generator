import React from 'react'
import {BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom'

import './App.css'

import CreateTemplate from './components/CreateTemplate'

import CardDetail from './components/CardDetail'
import Cards from './components/Cards'

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/cards" exact component={Cards} />
          <Route path="/cards/:id" exact component={CardDetail} />
          <Route path="/new/templates" exact component={CreateTemplate} />
          <Redirect to="/cards" />
        </Switch>
      </div>
    </Router>
  )
}

export default App
