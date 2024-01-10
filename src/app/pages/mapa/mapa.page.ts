import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit {

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

}
