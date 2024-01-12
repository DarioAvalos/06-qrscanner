import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { DataLocalService } from 'src/app/services/data-local.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  constructor( public dataLocal: DataLocalService ) {}

  enviarCorreo() {
    this.dataLocal.enviarCorreo();
  }

  abrirRegistro( registro: any ) {

    console.log('Rgistro', registro);
    this.dataLocal.abrirRegistros( registro );

  }

  // openUrl() {
  //   this.dataLocal.abrirRegistros;
  // }

}
