import React, { Component } from 'react';
import './App.css';
import { Grid, Row, Col, Panel} from 'react-bootstrap';

const mystyle = {
	position: 'relative',
	top: '65px',

};
class DataSource extends Component {
  render() {
    return (
       <Grid style={mystyle}>
	  <Row className="show-grid">
		<Col xs={12} md={12}>
			<Panel>
				<Panel.Heading id="blue"> 
				  <Panel.Title componentClass="h2" >DataSource</Panel.Title>
				</Panel.Heading>
				<Panel.Body>
					<div>
                    <dl>
                        <dt>
                        <h4>Topographic Datasets (SAR DEM, LiDAR DTMs and DSMs)</h4>
                        </dt><dd><a href="http://dream.upd.edu.ph" target="_blank" rel="noopener noreferrer"> Disaster Risk Exposure and
                            Assessment for Mitigation (DREAM) / Phil-LiDAR 1 Programs, University of the
                            Philippines-Diliman</a></dd>
                        <br/>
                        <dt>
                        <h4>Rainfall and Water Level Data</h4>
                        </dt><dd>DOST-ASTI (Advanced Science And Technology Institute)</dd>
                        <br/>
                        <dt>
                        <h4>Flood Characteristic Maps</h4>
                        </dt><dd><a href="http://geosafer-mindanao.org/" target="_blank" rel="noopener noreferrer">Geo-SAFER Agusan Project</a></dd>
                    </dl>
                </div>

				</Panel.Body>
			  </Panel>
		</Col>		
	  </Row>
	  </Grid>
    );
  }
}

export default DataSource;
