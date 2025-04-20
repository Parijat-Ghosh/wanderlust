// const { coordinates } = require("@maptiler/sdk");

// const { coordinates } = require("@maptiler/sdk");

    maptilersdk.config.apiKey = 's72amowdGowKmTxIwPsw';
    const map = new maptilersdk.Map({ 
      container: 'map', // container's id or the HTML element to render the map
      style: maptilersdk.MapStyle.STREETS,
      center: coordinates, // starting position [lng, lat]
      zoom: 9, // starting zoom
    });

    console.log("Coordinates in map.js:", coordinates);


    // create the popup
    var popup = new maptilersdk.Popup({ offset: 25 }).setText(
      'Exact location will be provided after booking'
  );

  // create DOM element for the marker
  var el = document.createElement('div');
  el.id = 'marker';

  const marker = new maptilersdk.Marker({color : "red"},{element : el})
  .setLngLat(coordinates) // listing.geometry.coordinates (listing schema)
  .setPopup(popup)
  .addTo(map);
