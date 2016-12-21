ROSM.Map = {
  init: function() {
    ROSM.G.map = new L.Map('map', {
      center: new L.LatLng(51.3934, 5.3133),
      zoom: 12,
      zoomControl: false
    });

    ROSM.G.map.addControl(new L.Control.Zoom({
      position: 'topright'
    }));
    ROSM.G.map.addLayer(new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
    }));
    var northEast = new L.LatLng(90, 180);
    var southWest = new L.LatLng(-90, -180);
    var bounds = new L.LatLngBounds(southWest, northEast);
    ROSM.G.map.options.maxBounds = bounds;
    ROSM.G.map.options.minZoom = 4;
    ROSM.G.map.on('click', ROSM.Map.click);
  },

  click: function(e) {
    var index;
    if (!ROSM.G.markers.hasSource()) {
      index = ROSM.G.markers.setSource(e.latlng);
      ROSM.Geocoder.updateAddress(ROSM.C.SOURCE_LABEL);
      ROSM.G.markers.route[index].show();
      ROSM.Routing.getRoute();
    } else if (!ROSM.G.markers.hasTarget()) {
      index = ROSM.G.markers.setTarget(e.latlng);
      ROSM.Geocoder.updateAddress(ROSM.C.TARGET_LABEL);
      ROSM.G.markers.route[index].show();
      ROSM.Routing.getRoute();
    }
  }
};
