import React, { Component } from 'react';
import './App.css';
import { Grid, Row, Col, Panel} from 'react-bootstrap';

const mystyle = {
	position: 'relative',
	top: '65px',

};
class Disclaimer extends Component {
  render() {
    return (
       <Grid style={mystyle}>
	  <Row className="show-grid">
		<Col xs={12} md={12}>
			<Panel>
				<Panel.Heading id="blue"> 
				  <Panel.Title componentClass="h2" >Disclaimer</Panel.Title>
				</Panel.Heading>
				<Panel.Body>
					<p className="text-justify">

The information contained in this website is for general information purposes only. The information is provided by Geo-SAFER Agusan and while we endeavor to keep the information up to date and correct, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability or availability with respect to the website or the information, products, services, or related graphics contained on the website for any purpose. Any reliance you place on such information is therefore strictly at your own risk.

In no event will we be liable for any loss or damage including without limitation, indirect or consequential loss or damage, or any loss or damage whatsoever arising from loss of data or profits arising out of, or in connection with, the use of this website.

Through this website you are able to link to other websites which are not under the control of Geo-SAFER Agusan. We have no control over the nature, content and availability of those sites. The inclusion of any links does not necessarily imply a recommendation or endorse the views expressed within them.

Every effort is made to keep the website up and running smoothly. However, Geo-SAFER Agusan takes no responsibility for, and will not be liable for, the website being temporarily unavailable due to technical issues beyond our control.
</p>
				</Panel.Body>
				
			  </Panel>
		</Col>		
	  </Row>
	  </Grid>
    );
  }
}

export default Disclaimer;
