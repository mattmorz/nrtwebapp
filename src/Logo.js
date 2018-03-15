import React, { Component } from 'react';
import { Grid, Row, Col} from 'react-bootstrap';
import Logo from './wall-clock.png';

	const mystyle = {
		    position: 'relative',
			top: '50px',
			boxShadow: '0 0.25rem 0.75rem rgba(0, 0, 0, .05)',
			width: '100%',
			height: '100px'

	};
class BelowNav extends Component {

  render() {
    return (
      <Grid style={mystyle}>
	  <Row className="show-grid" >
		<Col xs={12} md={12}>
			<p className="text-center"><a href="/"><img src={Logo} alt="logo" id="img_logo"/></a></p>
		</Col>		
	  </Row>
	</Grid>
    );
  }
}

export default BelowNav;
