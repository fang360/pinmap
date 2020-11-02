// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyA1jiFHLVPNInzDtktp_aiddPy75dhsefs",
    authDomain: "test-ae9ec.firebaseapp.com",
    databaseURL: "https://test-ae9ec.firebaseio.com",
    projectId: "test-ae9ec",
    storageBucket: "test-ae9ec.appspot.com",
    messagingSenderId: "917610809083",
    appId: "1:917610809083:web:d220705c489833e489125e",
    measurementId: "G-6Y3GVDNSJD"
  };


firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();

const savebtn = document.querySelector('.btn-submitt');
const mapbtn = document.getElementById('mapView');
const addbtn = document.getElementById('addSpot');
const count = db.doc("testpin/countpin");

function initMap() {
  // Styles a map in night mode.
  const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 25.05, lng: 121.50 },
    zoom: 12,
    disableDefaultUI: true,
    styles: [
      { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
      {
        elementType: "labels.text.stroke",
        stylers: [{ color: "#242f3e" }],
      },
      {
        elementType: "labels.text.fill",
        stylers: [{ color: "#746855" }],
      },
      {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{ color: "#263c3f" }],
      },
      {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [{ color: "#6b9a76" }],
      },
      {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#38414e" }],
      },
      {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [{ color: "#212a37" }],
      },
      {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{ color: "#9ca5b3" }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{ color: "#746855" }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{ color: "#1f2835" }],
      },
      {
        featureType: "road.highway",
        elementType: "labels.text.fill",
        stylers: [{ color: "#f3d19c" }],
      },
      {
        featureType: "transit",
        elementType: "geometry",
        stylers: [{ color: "#2f3948" }],
      },
      {
        featureType: "transit.station",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#17263c" }],
      },
      {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{ color: "#515c6d" }],
      },
      {
        featureType: "water",
        elementType: "labels.text.stroke",
        stylers: [{ color: "#17263c" }],
      },
    ],
  });
  const input = document.getElementById("pac-input");
  const autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo("bounds", map);
  // Specify just the place data fields that you need.
  autocomplete.setFields([
    "place_id",
    "geometry",
    "name",
    "formatted_address",
  ]);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  const infowindow = new google.maps.InfoWindow();
  const infowindowContent = document.getElementById("infowindow-content");
  infowindow.setContent(infowindowContent);
  const geocoder = new google.maps.Geocoder();
  const marker = new google.maps.Marker({ map: map }); // declare label position (display on const map)
  marker.addListener("click", () => {
    infowindow.open(map, marker);
  });
  mapbtn.addEventListener("click", function mapView() {
          count.get().then(function(doc) {
          if(doc.exists) {
            const pinData = doc.data();
            total = Number(pinData.index)+1;  
            console.log("total="+total);                         
          }
          for( i = 1; i < total; i++ ) {
            const docRef = db.doc("testpin/"+i+"pin");
            docRef.get().then(function(doc) {
              if(doc.exists) {
                var newPin = doc.data();
                var point = new google.maps.LatLng(newPin.lat, newPin.lng);
                var pin = new google.maps.Marker({
                  map: map,
                  position: point,
                })

              }
              infowindowContent.children["place-name"].textContent = newPin.name;
              infowindowContent.children["place-address"].textContent = newPin.address;
              pin.addListener("click", () => {
                  infowindow.open(map, pin);
                });

              addbtn.addEventListener("click", () => {
                  pin.setVisible(false);
                  infowindow.close(map,pin);

              })
            })
          }
        })
      })
  autocomplete.addListener("place_changed", () => {
    infowindow.close();
    const place = autocomplete.getPlace();

    if (!place.place_id) {
      return;
    }
    geocoder.geocode({ placeId: place.place_id }, (results, status) => {
      if (status !== "OK") {
        window.alert("Geocoder failed due to: " + status);
        return;
      }
      map.setZoom(11);
      map.setCenter(results[0].geometry.location);
      // Set the position of the marker using the place ID and location.
      marker.setPlace({
        placeId: place.place_id,
        location: results[0].geometry.location,
      });
      marker.setVisible(true);
      infowindowContent.children["place-name"].textContent = place.name;
      infowindowContent.children["place-address"].textContent =
        results[0].formatted_address;
      infowindow.open(map, marker);


      savebtn.addEventListener("click", function getInput(){
          count.get().then(function (doc) {
              if (doc.exists) {
                  const pinData = doc.data();
                  i = Number(pinData.index) + 1;
                  count.set({
                      index: i
                      
                  })
                  console.log('yes');
                  const docRef = db.doc("testpin/"+i+"pin");
                  docRef.set({
                      id: i,
                      placeID: place.place_id,
                      address: results[0].formatted_address,
                      name: place.name,
                      lat: results[0].geometry.location.lat(),
                      lng: results[0].geometry.location.lng(),
                  })
              }   
          });
        })      
    }); //google map api
  });
}

