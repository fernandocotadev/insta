// const mapToken = '<%-process.env.MAPBOX_TOKEN%>';
// const post = { features: <%- JSON.stringify(post) %>}

// mapboxgl.accessToken = mapToken;
// const map = new mapboxgl.Map({
//     container: 'cluster-map',
//     style: 'mapbox://styles/mapbox/streets-v11',
//     center: [-103.59179687498357, 40.66995747013945],
//     zoom: 3
// });



mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
	container: 'map', // container ID
	style: 'mapbox://styles/mapbox/light-v10', // stylesheet location
	center: post.geometry.coordinates, // starting position [lng, lat]
	zoom: 9 // starting zoom
});


map.addControl(new mapboxgl.NavigationControl());


new mapboxgl.Marker()
    .setLngLat(post.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${post.location}</h3><p>${post.description}</p>`
            )
    )
    .addTo(map)
