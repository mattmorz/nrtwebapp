import React, { Component } from 'react';
import {Alert} from 'react-bootstrap';
import 'ol/ol.css';
import Map from 'ol/map';
import View from 'ol/view';
import Tile from 'ol/layer/tile';
import OSM from 'ol/source/osm';
import Overlay from 'ol/overlay';
//import coordinate from 'ol/coordinate';
//import proj from 'ol/proj';
import VectorLayer from 'ol/layer/vector';
import VectorSource from 'ol/source/vector';
import BingMaps from 'ol/source/bingmaps';
import TileWMS from 'ol/source/tilewms';
//import Feature from 'ol/feature';
//import Point from 'ol/geom/point';
import GeoJSON from 'ol/format/geojson';
import EqualTo from 'ol/format/filter/equalto';
import WFS from 'ol/format/wfs';
import And from 'ol/format/filter/and';
import Style from 'ol/style/style'
//import Fill from 'ol/style/fill';
import Stroke from 'ol/style/stroke';
import FullScreen from 'ol/control/fullscreen';
import control from 'ol/control';
//import ScaleLine from 'ol/control/scaleline';

let map;
const url = 'http://121.96.33.242:8080';
const geoserver_url_nrt = url + "/geoserver/cite/wms";
const vectorSource = new VectorSource();
const vector = new VectorLayer({
	source: vectorSource,
	style: new Style({
		stroke: new Stroke({
		  color: 'blue',
		  width: 2
		})
	}),
	zIndex: 2,
	layer_type: "filtered"
 });
const alertMargin15 = {
	margin: "90px 10px 10px 10px"
}
function Progress(el) {
    this.el = el;
    this.loading = 0;
    this.loaded = 0;
}
Progress.prototype.addLoading = function () {
    if (this.loading === 0) {
        this.show();
    }
    ++this.loading;
    this.update();
};
Progress.prototype.addLoaded = function () {
    var this_ = this;
    setTimeout(function () {
        ++this_.loaded;
        this_.update();
    }, 100);
};
Progress.prototype.update = function () {
    var width = (this.loaded / this.loading * 100).toFixed(1) + '%';
    this.el.style.width = width;
    if (this.loading === this.loaded) {
        this.loading = 0;
        this.loaded = 0;
        var this_ = this;
        setTimeout(function () {
            this_.hide();
        }, 500);
    }
};
Progress.prototype.show = function () {
    this.el.style.visibility = 'visible';
};
Progress.prototype.hide = function () {
    if (this.loading === this.loaded) {
        this.el.style.visibility = 'hidden';
        this.el.style.width = 0;
    }
};

const bing_map = new Tile({
	source: new BingMaps({
		key: 'Ao6UEij7ZblJ1soOx6opo-plK6LyISwyibIqcPQSRWpxE_yQ27qwI7HdoDNN9ePl',
		imagerySet: 'AerialWithLabels'
	}),
	title: 'Bing Map',
	layer_type: 'base_map_bing',
	base_layer : true,
	visible : false,
	zIndex: 0
})

const osm_map = new Tile({
	source: new OSM(),
	layer_type: "base_map_osm",
	base_layer : true,
	visible : true,
	zIndex: 0
})

const bxu_fhm = new Tile({
	source: new TileWMS({
		url: geoserver_url_nrt,
		params: {
			'LAYERS': 'cite:flood_hazard_map',
			'TILED': true
		},
		serverType: 'geoserver',
		crossOrigin: 'anonymous',
		crs: 'EPSG:3857'
	}),
	title: "Flood Hazard Map",
	layer_type: "fhm",
	base_layer : false,
	stats_layer: null,
	zIndex: 1,
	visible : false
})

const bxu_affected = new Tile({
	source: new TileWMS({
		url: geoserver_url_nrt,
		params: {
			'LAYERS': 'cite:affected_bxu_nrt',
			'TILED': true
		},
		serverType: 'geoserver',
		crossOrigin: 'anonymous',
		crs: 'EPSG:3857'
	}),
	title: "Affected Buildings",
	layer_type: "fhm",
	stats_layer: "fhm_1",
	base_layer : false,
	zIndex: 2,
	visible : false
})


class MapM extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			error: false
		}
		 this.toogleBtnBaseMap = this.props.toogleBtnBaseMap.bind(this);
	}
	componentWillReceiveProps(newProps){
		if(newProps.affected_id.gid !== this.props.affected_id.gid){
			vectorSource.clear();
			this.setState({
				loading :true
			})
			const grid_code = newProps.affected_id.hazard_level === 'LOW' ? 1 :  newProps.affected_id.hazard_level === 'MEDIUM' ? 2 : 3;
			const bldg_name = new EqualTo('BLDG_NAME', newProps.affected_id.bldg_name);
			const bldg_type = new EqualTo('BLDG_TYPE', newProps.affected_id.bldg_type);
			const hazard_level = new EqualTo('GRIDCODE',grid_code);
			const psa_brgy = new EqualTo('PSA_BRGY',newProps.affected_id.psa_brgy);
			const f = new And(bldg_name,bldg_type, hazard_level,psa_brgy);
			const featureRequest = new WFS().writeGetFeature({
				srsName: 'EPSG:4326',
				featureNS: url + "/cite",
				featurePrefix: 'cite',
				featureTypes: ['affected_bxu_nrt'],
				outputFormat: 'application/json',
				filter: f
			});
			fetch(url + "/geoserver/wfs", {
				method: 'POST',
				body: new XMLSerializer().serializeToString(featureRequest)
			}).then(function (response) {
				return response.json();
			}).then((json) => {
				this.setState({
					loading :false
				})
				const hasGID = newProps.affected_id.gid;
				if(hasGID){
					const features = new GeoJSON().readFeatures(json);
						vectorSource.addFeatures(features);
						map.getView().fit(vectorSource.getExtent(), {
							'maxZoom': 20,
							'zoom':20
						})
			
				}else{
					const default_view = new View({
						center: [125.5406, 8.9475],
						zoom: 12,
						maxZoom: 19,
						minZoom: 10,
						projection: 'EPSG:4326'
					  })
					map.setView(default_view)
				}
				
			},
			(error) => {
				 this.setState({
					error: true
				})
			}
			)
			
		}
		if(newProps.base_map === 'base_map_osm'){
			osm_map.setVisible(true);
			bing_map.setVisible(false);
		}else if((newProps.base_map === 'base_map_bing') &&(newProps.base_map !== this.props.base_map)){
			osm_map.setVisible(false);
			bing_map.setVisible(true);
		}
		if(newProps.p_layer_type !== this.props.p_layer_type){
				let existing_layers = map.getLayers().array_;
				for (let i = 0; i < existing_layers.length; i++) {
					const ltype = existing_layers[i].values_.layer_type;
					const isBaseLayer =  existing_layers[i].values_.base_layer;
					if(isBaseLayer){
						if((newProps.base_map === 'base_map_osm') &&(newProps.base_map !== this.props.base_map)){
							osm_map.setVisible(true);
							bing_map.setVisible(false);
						}else if((newProps.base_map === 'base_map_bing') &&(newProps.base_map !== this.props.base_map)){
							osm_map.setVisible(false);
							bing_map.setVisible(true);
						}
					}else{
						if (ltype === newProps.p_layer_type){
							existing_layers[i].setVisible(true);						
						}else if ('filtered' === ltype){
							existing_layers[i].setVisible(true);
						}else{
							existing_layers[i].setVisible(false);
						}
					}
					
				}
		}
	}
  componentDidMount() {
	const progress = new Progress(document.getElementById('progress'));
    map =  new Map({
		controls: control.defaults().extend([
          new FullScreen()
		  //new ScaleLine()
        ]),
		layers: [
		   osm_map,
			vector,
			bing_map
		],
		target: 'map-panel',
		view: new View({
			center: [125.5406, 8.9475],
			zoom: 12,
			maxZoom: 19,
			minZoom: 10,
			projection: 'EPSG:4326'
		  })
	});
	
	map.addLayer(bxu_fhm);
	bxu_fhm.getSource().on('tileloadstart', e=> {
        progress.addLoading();
    });

    bxu_fhm.getSource().on('tileloadend', e=>  {
	    progress.addLoaded();
    });
	
	map.addLayer(bxu_affected);
	this.toogleBtnBaseMap();
	
	if (this.props.p_layer_type=== 'fhm'){
			bxu_affected.setVisible(true);
			bxu_fhm.setVisible(true);
	}
	
    bxu_affected.getSource().on('tileloaderror', e=> {
        this.setState({
			error: true
		})
    });
	
	
	const overlay = new Overlay({
	  element: document.getElementById('popup-container'),
	  positioning: 'bottom-center',
	  offset: [0, -10],
	  autoPan: true
	})
	map.addOverlay(overlay);
	
	map.on('singleclick',e=>{
	  overlay.setPosition();
	  let pixel = map.getEventPixel(e.originalEvent);
	  let coordinate = e.coordinate;
	  this.setState({
		loading :true
	  })
	  const features = map.forEachLayerAtPixel(pixel, layer =>{
		const layer_type = layer.values_.layer_type;
		const affected = layer.values_.stats_layer;
		if ((layer_type === 'fhm') && (!affected)){
			let viewResolution = /** @type {number} */ (map.getView().getResolution());
			let url = layer.getSource().getGetFeatureInfoUrl(
				e.coordinate, viewResolution, 'EPSG:4326',
				{'INFO_FORMAT': 'application/json'});
				if (url) {
				   fetch(url).then(function(response) {
					return response.text();
				  }).then(text=> {
					 this.setState({
						loading :false
					})
					const json_res = JSON.parse(text);
					let feature = json_res.features[0];
					let prop = feature.properties;
					let hazard_level = prop.GRIDCODE === 1 ? 'LOW' : prop.GRIDCODE === 2 ? 'MEDIUM' : 'HIGH';
					let dummy_date = prop.DATE_TIME;
					let hdms = "Flood Hazard Level: <strong>"+ hazard_level+"</strong><br/>"+
						"Date: <strong>"+ dummy_date+"</strong>";
					overlay.getElement().innerHTML = hdms;
					overlay.setPosition(coordinate);
				  });
				}else{
					
				}
			return true
		}else if (affected === 'fhm_1'){
			this.setState({
				loading :true
			})
			let viewResolution = /** @type {number} */ (map.getView().getResolution());
			let url = layer.getSource().getGetFeatureInfoUrl(
				e.coordinate, viewResolution, 'EPSG:4326',
				{'INFO_FORMAT': 'application/json'});
				if (url) {
				   fetch(url).then(function(response) {
					return response.text();
				  }).then(text=> {
					  this.setState({
						loading :false
					})
					const json_res = JSON.parse(text);
					let feature = json_res.features[0];
					let prop = feature.properties;
					let hazard_level = prop.GRIDCODE === 1 ? 'LOW' : prop.GRIDCODE === 2 ? 'MEDIUM' : 'HIGH';
					let bldg_name = prop.BLDG_NAME;
					let bldg_type = prop.BLDG_TYPE;
					let psa_brgy = prop.PSA_BRGY;
					let psa_munici = prop.PSA_MUNICI;
					let psa_provin = prop.PSA_PROVIN;
					let dummy_date = prop.DATE_TIME;
					let hdms = "Building Name: <strong>"+ bldg_name+"</strong><br/>"+
						"Building Type: <strong>"+ bldg_type+"</strong><br/>"+
						"Location: <strong>"+ psa_brgy+", "+psa_munici+", "+psa_provin+"</strong><br/>"+
						"Flood Hazard Level <strong>"+ hazard_level+"</strong><br/>"+
						"Date: <strong>"+dummy_date+"</strong><br/>";
					overlay.getElement().innerHTML = hdms;
					overlay.setPosition(coordinate);
				  });
				}else{
					
				}
			return true
		}
	  });
		if(!features){
			 this.setState({
				loading :false
			})
		}
	});
	
    map.on('pointermove', function(evt) {
        if (evt.dragging) {
          return;
        }
        var pixel = map.getEventPixel(evt.originalEvent);
        var hit = map.forEachLayerAtPixel(pixel, function(layer) {
			let layer_type = layer.values_.layer_type;
			if ((layer_type === 'fhm') || (layer_type === 'affected')){
				 return true;
			}
        });
        map.getTargetElement().style.cursor = hit ? 'pointer' : 'move';
      });
  }
	
  render() {
	  if(this.state.error){ 
		  return (
			<Alert bsStyle="danger" style={alertMargin15}>
			  <h4>An error has occured!</h4>
			  <p>
				Unable to access server as of the moment. Please try again later.
			  </p>
			</Alert>
		  )
	  }else{
		  return (
				<div id="map-panel">
					<div className="arrow_box" id="popup-container"></div>
					<div id="progress"></div>
					{this.state.loading === true  ? <div id="loading-wrapper">Loading...</div> : <div></div>}
					
				</div>		
			)
	  }
  	
  }
}

export default MapM;
