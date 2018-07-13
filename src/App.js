import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import Progress from './router/stock/Progress';
import Stock from './router/stock/Stock';
import Monitor from './router/stock/Monitor';
import Slider from './router/stock/SliderModel';
import LineChart from './router/stock/LineChart';

class App extends Component {
  render() {
    const pathName = window.location.pathname;
    return (
      <div className="App">
        {pathName === "/" ? <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header> : ''
        }
        <BrowserRouter>
          <div>
            <Route path="/progress" component={Progress} />
          </div>
        </BrowserRouter>
        <BrowserRouter>
          <div>
            <Route path="/stock" component={Stock} />
          </div>
        </BrowserRouter>
        <BrowserRouter>
          <div>
            <Route path="/monitor" component={Monitor} />
          </div>
        </BrowserRouter>
        <BrowserRouter>
          <div>
            <Route path="/slider" component={Slider} />
          </div>
        </BrowserRouter>
        <BrowserRouter>
          <div>
            <Route path="/lineChart" component={LineChart} />
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
