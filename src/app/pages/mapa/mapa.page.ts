import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

declare var mapboxgl: any;

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit, AfterViewInit {

  lat: number | undefined;
  lng: number | undefined;

  constructor( private route: ActivatedRoute ) { }

  ngOnInit() {

    let geo: any = this.route.snapshot.paramMap.get('geo');

    geo = geo?.substring(4);
    geo = geo?.split(',');

    this.lat = Number (geo [0]);
    this.lng = Number (geo [1]);

    console.log(this.lat, this.lng);
  }

  ngAfterViewInit() {

    //Esto es sin el efecto 3D
    // mapboxgl.accessToken = 'pk.eyJ1IjoiZGFyaW84NTE3IiwiYSI6ImNscjcwbnAwOTJncHMya3BmYTQ5Z2t4aHAifQ.mWKTjfzkCkCJI6xtCpVTjg';

      // var map = new mapboxgl.Map({
      //   container: 'map',
      //   style: 'mapbox://styles/mapbox/streets-v11'
      // });

    mapboxgl.accessToken = 'pk.eyJ1IjoiZGFyaW84NTE3IiwiYSI6ImNscjcwbnAwOTJncHMya3BmYTQ5Z2t4aHAifQ.mWKTjfzkCkCJI6xtCpVTjg';
      
      const coordinates:any = document.getElementById('coordinates');
      const map = new mapboxgl.Map({
        // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
        style: 'mapbox://styles/mapbox/light-v11',
        center: [this.lng,this.lat],
        zoom: 15.5,
        pitch: 45,
        bearing: -17.6,
        container: 'map',
        antialias: true
      });

      map.on('style.load', () => {

        map.resize();

        //Marcador de mapa
        const marker = new mapboxgl.Marker({
          //Opcion para arrastrar el marcador
          draggable: false
          })
          .setLngLat([this.lng, this.lat])
          .addTo(map);

          const lngLat = marker.getLngLat();
          coordinates.style.display = 'block';
          coordinates.innerHTML = `Longitude: ${lngLat.lng}<br />Latitude: ${lngLat.lat}`;

        // Insert the layer beneath any symbol layer.
        const layers = map.getStyle().layers;
        const labelLayerId = layers.find(
        (layer:any) => layer.type === 'symbol' && layer.layout['text-field']
        ).id;
         
        // The 'building' layer in the Mapbox Streets
        // vector tileset contains building height data
        // from OpenStreetMap.
        map.addLayer(
        {
        'id': 'add-3d-buildings',
        'source': 'composite',
        'source-layer': 'building',
        'filter': ['==', 'extrude', 'true'],
        'type': 'fill-extrusion',
        'minzoom': 15,
        'paint': {
        'fill-extrusion-color': '#aaa',
         
        // Use an 'interpolate' expression to
        // add a smooth transition effect to
        // the buildings as the user zooms in.
        'fill-extrusion-height': [
        'interpolate',
        ['linear'],
        ['zoom'],
        15,
        0,
        15.05,
        ['get', 'height']
        ],
        'fill-extrusion-base': [
        'interpolate',
        ['linear'],
        ['zoom'],
        15,
        0,
        15.05,
        ['get', 'min_height']
        ],
        'fill-extrusion-opacity': 0.6
        }
        },
        labelLayerId
        );
        });


  }

}

