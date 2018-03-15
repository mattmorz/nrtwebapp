import React, { Component } from 'react';
import BelowNav from './Logo';
import Main from './Main';
import './bootstrap.min.css';
import './App.css';
import { Nav, Navbar, MenuItem, NavItem, NavDropdown} from 'react-bootstrap';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import About from './About';
import DataSource from './DataSource';
import Disclaimer from './Disclaimer';

class App extends Component {
  render() {
    return (
      <div>
			<Router>
			<div>
			   <Navbar inverse collapseOnSelect fixedTop>
					  <Navbar.Header>
						<Navbar.Brand componentClass="span">
							<Link to="/nrt">Home</Link>
						</Navbar.Brand>
						<Navbar.Toggle />
					  </Navbar.Header>
					  <Navbar.Collapse >
						<Nav id="fixed-nav">
						  <NavItem eventKey={1} href="#" componentClass="span">
							<Link to="/nrt/about"  smooth="true" offset="0" duration="500" role="button">About</Link>
							
						  </NavItem>
						  <NavItem eventKey={1} href="#" componentClass="span">
							<Link to="/nrt/datasource"  smooth="true" offset="0" duration="500" role="button">Data Source</Link>
						  </NavItem>
						  <NavItem eventKey={1} href="#" componentClass="span">
							<Link to="/nrt/disclaimer"  smooth="true" offset="0" duration="500" role="button">Disclaimer</Link>
						  </NavItem>
						  
						</Nav>
						<Nav pullRight>
						  <NavDropdown eventKey={3} title="Help" id="basic-nav-dropdown">
							<MenuItem eventKey={3.1}>Contact</MenuItem>
							<MenuItem eventKey={3.2}>Documentation</MenuItem>
							<MenuItem divider />
							<MenuItem eventKey={3.3}>How-to?</MenuItem>
						  </NavDropdown>
						</Nav>
					  </Navbar.Collapse>
				</Navbar>
				<BelowNav/>
				 <Route exact path="/nrt" component={Main} />
				 <Route path="/nrt/about" component={About} />
				 <Route path="/nrt/datasource" component={DataSource} />
				 <Route path="/nrt/disclaimer" component={Disclaimer} />
			 </div>
			</Router>
      </div>
    );
  }
}

export default App;
