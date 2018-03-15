import React, { Component } from 'react';
import './App.css';
import { Grid, Row, Col, Panel} from 'react-bootstrap';

const mystyle = {
	position: 'relative',
	top: '65px',

};
class App extends Component {
  render() {
    return (
       <Grid style={mystyle}>
	  <Row className="show-grid">
		<Col xs={12} md={12}>
			<Panel>
				<Panel.Heading id="blue"> 
				  <Panel.Title componentClass="h2" >About The App</Panel.Title>
				</Panel.Heading>
				<Panel.Body>
					<p>An online web platform for near-real time flood characteristics visualization and impact analysis.</p>
				</Panel.Body>
				
			  </Panel>
		</Col>		
	  </Row>
	  </Grid>
    );
  }
}

export default App;
