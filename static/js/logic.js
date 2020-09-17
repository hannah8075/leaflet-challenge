// Use this link to get the geojson data
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
var tectonicLink = "https://github.com/fraxen/tectonicplates/blob/master/GeoJSON/PB2002_boundaries.json";

// Grabbing our GeoJSON data
d3.json(link, function(eqData) {
    d3.json(tectonicLink, function(plateData) {
        createFeatures(eqData.features, plateData.features);
    });
});

function createFeatures(eqData, plateData) {

    var earthquakeMarkers = [];

    for (var i = 0; i < response.features.length; i++) {

        var location = response.features[i].geometry;
        if (location) {
            var latlng = [location.coordinates[1], location.coordinates[0]];
        };

        var properties = response.features[i].properties;
        if (properties) {
            var mag = [properties.mag];
        }

        earthquakeMarkers.push(L.circle(latlng, {
            weight:0.5,
            fillOpacity: 0.75,
            color: "black",
            fillColor: chooseColor(mag),
            radius: (mag)*20000
          })
        .bindPopup("<h3>" + properties.place + "<br>Magnitude: " + mag)
        );
    }
};

var earthquakeLayer = L.layerGroup(earthquakeMarkers);

plateData= L.geoJSON(plateData, {
    color: "orange",
    weight: 2
});

//chooseColor function based on magnitude size
function chooseColor(magnitude) {
    switch (true) {
        case magnitude > 5:
            return "#bd0026";
        case magnitude > 4:
            return "#f03b20";
        case magnitude > 3:
            return "#fd8d3c";
        case magnitude > 2:
            return "#feb24c";
        case magnitude > 1:
            return "#fed976";
        default:
            return "#ffffb2";
    }
};


// Defining tile layer
var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
});

var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/satellite-streets-v9",
    accessToken: API_KEY
});
var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/outdoors-v9",
    accessToken: API_KEY
});

var baseMaps = {
    Light: lightmap,
    Satellite: satellite,
    Outdoors: outdoors
};

var overlayMaps = {
    Earthquakes: earthquakeLayer,
    Tectonic_Plates: plateData
};

// Creating map object and set default layers
var myMap = L.map("map", {
    center: [39.8283, -98.5795],
    zoom: 5,
    layers:[lightmap, earthquakeLayer]
});

//Add layer control
L.control.layers(baseMaps, overlayMaps).addTo(myMap);

// Adding legend
var legend = L.control({
    position: "bottomright"
  });

  legend.onAdd = function() {
    var div = L
      .DomUtil
      .create("div", "info legend");

    var magLegend = [0, 1, 2, 3, 4, 5];
    var colors = [
      "#ffffb2",
      "#fed976",
      "#feb24c",
      "#fd8d3c",
      "#f03b20",
      "#bd0026"
    ];

    for (var i = 0; i < magLegend.length; i++) {
      div.innerHTML += "<i style='background: " + colors[i] + "'></i> " +
        magLegend[i] + (magLegend[i + 1] ? "&ndash;" + magLegend[i + 1] + "<br>" : "+");
    }
    return div;
  };

  legend.addTo(myMap);