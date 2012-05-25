function init(){
	var map = new L.Map("map");
	
	/* Tilestream Layer example: */
	var bioticUrl = "http://opengis.azexperience.org/tiles/v2/azphysiobiotic/{z}/{x}/{y}.png",
		bioticLayer = new L.TileLayer(bioticUrl, {maxZoom: 12, opacity: 0.6}); 
	
	/* ESRI tiled service example: */
	//var imageryLayer = new L.TileLayer.ESRI("http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer");
	//var refLayer = new L.TileLayer.ESRI("http://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer");
	
	// Cloudmade / OpenStreetMap tiled layer
	var cmUrl = 'http://{s}.tile.cloudmade.com/f7d28795be6846849741b30c3e4db9a9/997/256/{z}/{x}/{y}.png',
		cmAttribution = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
		cmOptions = { maxZoom: 18, attribution: cmAttribution };
	
	var cloudmade = new L.TileLayer(cmUrl, cmOptions);//, {styleId: 999});
	
	/* WFS GeoJSON layer example: */
	var wfsLayer = new L.GeoJSON.WFS("http://opengis.azexperience.org/geoserver/wfs", "vae:azpointsofinterest", {
		pointToLayer: function(latlng) { 
			return new L.Marker(latlng, {
				icon: new L.Icon({
					iconUrl: "style/images/fancy-binoculars.png",
					iconSize: new L.Point(40, 40)
				})				
			}); 
		},
		popupObj: new JadeContent("templates/pointofinterest.jade"),
		popupOptions: { maxWidth: 530, centered: true },
		popupFn: function(e) {
			var map = e.layer._map;
			if (map.activePanel && map.activePanel.hidden == false) { map.activePanel.hide(); }
		},
		hoverFld: "name"
	});
	
	var legendPanel = new L.Control.Panel({
		id: "legend-panel",
		content: "Hello there",
		width: 400,
		template: new JadeContent("templates/polys.jade"),
		onShow: function() {
			$("#chooser div").click(function() {				
				var id = $(this).attr("id");
				var bio = $("#biotic-info"), phys = $("#physio-info");
				if (id == "bio") {
					$("#bio").addClass("chosen-chooser");
					$("#phys").removeClass("chosen-chooser");
					bio.removeClass("hidden-content");
					phys.addClass("hidden-content");
				} else {
					$("#phys").addClass("chosen-chooser");
					$("#bio").removeClass("chosen-chooser");
					bio.addClass("hidden-content");
					phys.removeClass("hidden-content");
				}
			});
		}
	});
	
	
	
	map.clickResponse = new L.GeoJSON.WFS.ClickResponder({
		map: map,
		url: "http://opengis.azexperience.org/geoserver/wfs",
		featureType: "vae:azphysiobioticpolys",
		version: "1.0.0",
		geomFieldName: "wkb_geometry",
		panelObj: legendPanel
	});
	
	var center = new L.LatLng(34.1618, -111.53332);
	map.setView(center, 7).addLayer(cloudmade).addLayer(wfsLayer);
	setTimeout(function() {
		map.addLayer(bioticLayer);
		setTimeout(function() {
			map.addControl(legendPanel);		
		}, 250);
	}, 250);
}