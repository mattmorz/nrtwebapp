import React, { Component } from 'react';
import { Alert} from 'react-bootstrap';
import Highcharts from 'highcharts';
require('highcharts/modules/exporting')(Highcharts);

let wl_data = {
	"stations":[
		{
			"Province": "Agusan del Norte",
			"City_Municipality": "BUTUAN CITY",
			"region": "13",
			"proper_name": "DRRM RIVER BASE LEON KILAT",
			"device_id": 594,
			"left_bank": 1.6701,
			"right_bank": 2.6891,
			"min_wl": -0.8,
			"max_wl": 5,
			"tick_val": 0.5,
			"dif_val": 1.174,
			"assumed_msl": "no",
			"ave_dis": 1.6223,
			"with_spilling": "yes",
			"ave_wse" : 0.0478
		},
		{
			 "Province": "Agusan del Sur",
			"City_Municipality": "SIBAGAT",
			"region": "13",
			"proper_name": "HUPAS BRIDGE, POBLACION",
			"device_id": 572,
			"left_bank": 16.907,
			"right_bank": 17.228,
			"min_wl": 10,
			"max_wl": 20,
			"tick_val": 0.5,
			"dif_val": -10.646,
			"assumed_msl": "yes",
			"ave_dis": 3.461,
			"with_spilling": "yes",
			"ave_wse": 13.446
		},{
			"Province": "Agusan del Sur",
			"City_Municipality": "POBLACION, ESPERANZA",
			"region": "13",
			"proper_name": "ESPERANZA BRIDGE",
			"device_id": 666,
			"left_bank": 14.668,
			"right_bank": 14.365,
			"min_wl": 5,
			"max_wl": 20,
			"tick_val": 0.5,
			"dif_val": -7.728,
			"assumed_msl": "yes",
			"ave_dis": 5.227,
			"with_spilling": "yes"
		},{
			"Province": "Agusan del Sur",
			"City_Municipality": "BAYUGAN CITY",
			"region": "13",
			"proper_name": "ANDANAN BRIDGE",
			"device_id": 629,
			"left_bank": 22.5514,
			"right_bank": 23.6314,
			"min_wl": 15,
			"max_wl": 25,
			"tick_val": 1,
			"dif_val": -17.4444,
			"assumed_msl": "no",
			"ave_dis": 4.437,
			"with_spilling": "yes"
		}
		
	]
	
	
}

const alertMargin = {
	marginTop: "70px"
}

class GetWL extends Component {
	constructor(props) {
	  super(props);
	  this.state = {
		  error: null,
		  isLoaded: false,
		  items: {},
		  dev_id_wll: this.props.dev_id_wl
	  };
	  this.toogleBtnWL = this.props.toogleBtnWL.bind(this);
	  this.setWLData = this.props.setWLData.bind(this);
	  this.setData = this.setData.bind(this);
	}
	
	setData(dev_id){
		let latest_wl = -2;
		let actual_wl_vals = [];
		let last_date;
		const data = this.state.items;
		let station_name, mun, prov, llast_date, lleft_bank, rright_bank, assumed_msl, llatest_wl, max_wl, min_wl, tick_val;
		if(data[0] !== -1 ){
			for(let i=0;i < wl_data.stations.length; i++){
				if(dev_id === wl_data.stations[i].device_id){
					let dif_val = wl_data.stations[i].dif_val;
					for (let i = 0; i < data.length; i++) {
						let c = data[i][0];
						let d = c.match(/(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})/);
						let m_val = (parseFloat(data[i][1]) / 100) - dif_val;
						actual_wl_vals.push([Date.UTC(+d[3], d[1] - 1, +d[2], +d[4], +d[5]), parseFloat(m_val.toFixed(2))]);
					}
					last_date = Highcharts.dateFormat("%b %e, %Y %I:%M %p", actual_wl_vals[actual_wl_vals.length - 1][0]);
					let forecast_wl_arr_len = parseInt(actual_wl_vals.length - 1,0);
					latest_wl = actual_wl_vals[forecast_wl_arr_len][1];
					//console.log(latest_wl);
					wl_data.stations[i].actual_wl = actual_wl_vals;
					wl_data.stations[i].last_date = last_date;
					wl_data.stations[i].latest_wl = latest_wl;
					station_name = wl_data.stations[i].proper_name;
					mun = wl_data.stations[i].City_Municipality;
					prov = wl_data.stations[i].Province;
					llast_date = wl_data.stations[i].last_date;
					lleft_bank = wl_data.stations[i].left_bank;
					rright_bank = wl_data.stations[i].right_bank;
					assumed_msl = wl_data.stations[i].assumed_msl;
					llatest_wl = wl_data.stations[i].latest_wl;
					max_wl = wl_data.stations[i].max_wl;
					min_wl = wl_data.stations[i].min_wl;
					tick_val = wl_data.stations[i].tick_val;
					this.setState({
						items : {
							latest_wl : llatest_wl,
							station_name : station_name,
							mun : mun,
							prov: prov,
							llast_date : llast_date,
							lleft_bank : lleft_bank,
							assumed_msl : assumed_msl,
							rright_bank : rright_bank,
							min_wl: min_wl,
							max_wl : max_wl,
							actual_wl : actual_wl_vals,
							tick_val : tick_val
						}
					},()=>{
						this.setWLData(this.state.items)
					})
				}
			}	
		}
	}
	componentDidMount() {
		fetch("http://monitoring.geosafer-mindanao.org/waterlevel/getWL_data.php?dev_id="+this.props.dev_id_wl)
		  .then(res => res.json())
		  .then(
			(result) => {
			if(result[0] === -1){
				this.setState({
					isLoaded: true,
					items: result,
					error : "Unable"
				  });
			}else{
				this.toogleBtnWL();
				  this.setState({
					isLoaded: true,
					items: result
				  }, () => {
					  this.setData(this.props.dev_id_wl)
				  });
			}
			  
			},
			(error) => {
			  this.setState({
				isLoaded: true,
				error
			  });
			}
		  )
	  }

	componentWillReceiveProps(newProps){
		  if(newProps.dev_id_wl !== this.props.dev_id_wl){
			  this.setState({
					error: null,
					isLoaded: false,
					items: {}
			  });
			  fetch("http://monitoring.geosafer-mindanao.org/waterlevel/getWL_data.php?dev_id="+ newProps.dev_id_wl)
			  .then(res => res.json())
			  .then(
				(result) => {
				  if(result[0] === -1){
						this.setState({
							isLoaded: true,
							items: result,
							error : "Unable"
						  });
					}else{
						this.toogleBtnWL();
						  this.setState({
							isLoaded: true,
							items: result
						  }, () => {
							  this.setData(this.props.dev_id_wl)
						  })
					}
				},
				(error) => {
				  this.setState({
					isLoaded: true,
					error
				  });
				}
			  )
		  }
	}
	
	render() {
		const { error, isLoaded, items } = this.state;
		if (error) {
		  return (
			<Alert bsStyle="danger" style={alertMargin}>
			  <h4>An error has occured!</h4>
			  <p>
				Unable to access DOST-ASTI server as of the moment. Please try again later.
			  </p>
			</Alert>
		  )
		} else if (!isLoaded) {
		  return <div><em>Getting Water Level Data...</em></div>;
		} else {
			
		  return (
			  <div className="result">
					
					{items.latest_wl === -2 
						?  <p><strong> No Data</strong></p>:
						<div>
							<p><i><strong> {items.station_name} , {items.mun}, {items.prov}</strong></i></p>
							<p>Water Level as of {items.llast_date} : <strong>{items.latest_wl} M. </strong></p>
							<p>Left Bank Spilling Level: <strong> {items.lleft_bank} M. {items.assumed_msl === "yes" ? "" : " from MSL"} </strong></p>
							<p>Right Bank Spilling Level: <strong> {items.rright_bank} M. {items.assumed_msl === "yes" ? "" : " from MSL"} </strong></p>
						</div>
					}
					
					 
			  </div>
		  );
		}
	}
}

export default GetWL;

