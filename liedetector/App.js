// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import Home from './Home';
import DataAnalytics from './DataAnalytics';
import About from '../lie_detect/src/About';
import Resources from './Resources';
import './styles.css'; // Link to your CSS file

const App = () => {
    return (
        <Router>
            <div>
                <header className="header">
                    <nav className="navbar">
                        <div className="container">
                            <ul className="nav-links">
                                <li><Link to="/">Home</Link></li>
                                <li><Link to="/data-analytics">Data & Analytics</Link></li>
                                <li><Link to="/about">About</Link></li>
                                <li><Link to="/resources">Resources</Link></li>
                            </ul>
                        </div>
                    </nav>
                </header>

                <Switch>
                    <Route path="/data-analytics" component={DataAnalytics} />
                    <Route path="/about" component={About} />
                    <Route path="/resources" component={Resources} />
                    <Route path="/" exact component={Home} />
                </Switch>

                <footer className="footer">
                    <div className="container">
                        <p>&copy; 2024 Your Company Name. All rights reserved.</p>
                    </div>
                </footer>
            </div>
        </Router>
    );
};

export default App;
