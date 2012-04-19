function init(){
	var map = new L.Map("map");
	
	/* Tilestream Layer example: */
	var bioticUrl = "http://opengis.azexperience.org/tiles/v2/azphysiobiotic/{z}/{x}/{y}.png",
		bioticLayer = new L.TileLayer(bioticUrl, {maxZoom: 12, opacity: 0.6}); 
	
	/* ESRI tiled service example: */
	var imageryLayer = new L.TileLayer.ESRI("http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer");
	var refLayer = new L.TileLayer.ESRI("http://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer");
	
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
	map.setView(center, 7).addLayer(imageryLayer).addLayer(wfsLayer);
	setTimeout(function() {
		map.addLayer(bioticLayer);
		setTimeout(function() {
			map.addLayer(refLayer);
			map.addControl(legendPanel);		
		}, 250);
	}, 250);
}