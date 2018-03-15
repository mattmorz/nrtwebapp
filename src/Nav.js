import React, { Component } from 'react';
import { Nav, Navbar, MenuItem, NavItem, NavDropdown} from 'react-bootstrap';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Main from './Main';
import About from './About';
class Navi extends Component {
  render() {
    return (
	
		<Router>
		   <Navbar inverse collapseOnSelect fixedTop>
				  <Navbar.Header>
					
						<Link to="/nrt"><Navbar.Brand>Home</Navbar.Brand></Link>
					
					<Navbar.Toggle />
				  </Navbar.Header>
				  <Navbar.Collapse>
					<Nav>
					  <NavItem eventKey={1} href="#">
						<Link to="/nrt/about">About</Link>
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
		 <Route exact path="/nrt" component={Main} />
		 <Route path="/nrt/about" component={About} />
  </Router>
      
    );
  }
}

export default Navi;
