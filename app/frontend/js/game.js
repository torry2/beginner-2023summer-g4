// game.js

import { generateNewStreetView, streetViewLocation } from './streetview.js';

//const generateNewStreetView = require('./streetview.js')

var picked;
var distanced; 

var totalScore = 0;
var roundNumber = 1;

var marker = {};

map.on('click', function(e) {

  if (marker != undefined){
    map.removeLayer(marker);
  }

  marker = L.marker(e.latlng).addTo(map);

  let picked_data = {
    data: String("picked"),
    latitude: Number(e.latlng.lat),
    longitude: Number(e.latlng.lng)
  };

  picked = JSON.stringify(picked_data);

  let distanced_data = {
    data: String("distanced"),
    distance: Number(e.latlng.distanceTo(streetViewLocation))
  };

  distanced = JSON.stringify(distanced_data);

});

function post_data(send){
  const url = `${endpoint}/api/submit`;

  const picked_post = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(send)
  };

  fetch(url, picked_post)
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    totalScore += data['score'];
    //console.log('Response data:', data);

    let popup = document.getElementById('popup');

    let pop_up_message = document.getElementById('popup-message');
    pop_up_message.innerHTML

    popup.classList.add('open-popup');


    generateNewStreetView();

    document.getElementById('round-no.').innerHTML = "Round: " +  roundNumber;
    document.getElementById('total-points').innerHTML = "Points: " +  totalScore;


  })
  .catch(error => {
    console.error('Error:', error);
  });
}

function submit() {
  if (roundNumber === 10) {
    // handle end game stuff
    // send json to backend, to add to db
  }

  roundNumber++;
  console.log(`picked: ${picked} | distance: ${distanced}`);
  //post_data(picked);
  post_data(distanced);

}

function closePopup(){
  popup.classList.remove('open-popup');
}

const submit_button = document.getElementById('submit-button');

submit_button.addEventListener('click', submit)