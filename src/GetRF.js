import React, { Component } from 'react';
import {Alert} from 'react-bootstrap';
import Highcharts from 'highcharts';
require('highcharts/modules/exporting')(Highcharts);

const alertMargin = {
	marginTop: "70px"
}	
class GetRF extends Component {
	constructor(props) {
	  super(props);
	  this.state = {
		  error: null,
		  isLoaded: false,
		  items: {}
	  };
	  this.toogleBtnRF = this.props.toogleBtnRF.bind(this);
	  this.setRFData = this.props.setRFData.bind(this);
	  this.setData = this.setData.bind(this);
	}
	
	setData(){
		const items = this.state.items;
		const rfdata = items.data.map(item => item.rain_value);
		const rfdata_len = rfdata.length;
		const rainVal = items.data;
		let  latest_rainval;
		if(rfdata_len > 0){
			latest_rainval = parseFloat(rainVal[rfdata_len - 1]['rain_value'] * 4);
			let rain_data = [];
			let firstDate;//, llastDate;
			let accum = 0;
			let getIndex = 0,
				diffHours = 0;
			for (let k = 0; k < rfdata_len; k++) {
				let lastDate = rainVal[rfdata_len- k - 1]['dateTimeRead'];
				firstDate = rainVal[rfdata_len - 1]['dateTimeRead'];
				diffHours = (Math.abs(lastDate - firstDate) / 36e5) * 1000;
				if ((diffHours >= 23) && (diffHours <= 24)) {
					getIndex = parseInt(rainVal.length - k - 1,0);

				}
			}
			for (let i = getIndex; i < rfdata_len; i++) {
				let dateTimeRead = parseInt(rainVal[i]['dateTimeRead'] + 28800, 0) * 1000;
				let rain_values = parseFloat(rainVal[i]['rain_value'],2);
				parseFloat(accum += rainVal[i]['rain_value']);
				rain_data.push([dateTimeRead,rain_values])
			}
			let asof = (firstDate + 28800) * 1000;
			let asof1 = Highcharts.dateFormat("%b %e, %Y %I:%M %p", asof);
			this.setState({
				items : {
					location : items.location,
					municipality :  items.municipality,
					province : items.province,
					data : rain_data,
					latest_date : asof1,
					latest_rainval : latest_rainval,
					rainVal_len : rfdata_len,
					accum24 : parseFloat(accum.toFixed(2),0)
				}	
			},()=>{
				this.setRFData(this.state.items)
			})
		}else{
			this.setState({
				items : {
					location : items.location,
					municipality :  items.municipality,
					province : items.province
				}
			})
		}
	}
	
	
	componentDidMount() {
		fetch("http://monitoring.geosafer-mindanao.org/rainfall/getRF_data.php?dev_id="+this.props.dev_id)
		  .then(res => res.json())
		  .then(
			(result) => {
			  if(result.dev_id){
				  this.toogleBtnRF();
				  this.setState({
					isLoaded: true,
					items: result
				  }, () => {
					  this.setData()
				  });					 
			  }else{
				  this.setState({
					isLoaded: true,
					items: result,
					error : "Unable"
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
		  if(newProps.dev_id !== this.props.dev_id){
			  this.setState({
					error: null,
					isLoaded: false,
					items: {}				
			  });
			  fetch("http://monitoring.geosafer-mindanao.org/rainfall/getRF_data.php?dev_id="+ newProps.dev_id)
			  .then(res => res.json())
			  .then(
				(result) => {				  
				  if(result.dev_id){
					  this.toogleBtnRF();
					  this.setState({
						isLoaded: true,
						items: result
					  }, () => {
						  this.setData()
					  });					 
				  }else{
					  this.setState({
						isLoaded: true,
						items: result,
						error : "Unable"
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
		  return <div><em>Getting Rainfall Data...</em></div>;
		} else {
			

			
		  return (
		  <div className="result">
				 {items.rainVal_len > 0
					? 
					<div>
						<p><strong> <i>{items.location}, {items.municipality}, {items.province} </i></strong></p>
						<span> 	
							 <p>Rainfall Amount as of {items.latest_date} :<strong> {items.latest_rainval.toFixed(2)} mm./hr </strong></p>
							 <p>Total Accumulated Rainfall Amount: <strong> {items.accum24} mm </strong></p>
						 </span>
					</div>:
					 <p><strong>No Data</strong></p>				 
				 }
		  </div>
		  );
		}
	}
}


export default GetRF;

