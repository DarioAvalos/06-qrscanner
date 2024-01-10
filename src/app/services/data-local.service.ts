import { Injectable } from '@angular/core';
import { Registro } from '../models/registro.model';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';
import { Browser } from '@capacitor/browser';

@Injectable({
  providedIn: 'root'
})
export class DataLocalService {

  guardados: Registro[] = [];

  constructor( private storage: Storage,
               private navCtrl: NavController ) { 
    //Cargar registros
    this.init();
    this.cargarStorage();
  }

  async init() {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    const storage = await this.storage.create();
    this.storage = storage;
  }

  async cargarStorage() {

    const registros = await this.storage.get('registros');
    this.guardados = registros || [];
    // return this.peliculas;

  }

  async guardarRegistro( format: string, text: string) {

    await this.cargarStorage();

    const nuevoRegistro = new Registro( format, text );
    this.guardados.unshift( nuevoRegistro );

    console.log ( this.guardados );

    this.storage.set('registros', this.guardados);

    this.abrirRegistros( nuevoRegistro );

  }

  async abrirRegistros( registro: Registro ) {

    this.navCtrl.navigateForward('/tabs/tab2');

    switch ( registro.type ) {

      case 'http':
        
        await Browser.open({ url: registro.text, windowName: '_system'  });
          
      break;

      case 'geo':
        
        await this.navCtrl.navigateForward('/tabs/tab2/mapa/' + registro.text);
      
      break;
    }

  }

}
