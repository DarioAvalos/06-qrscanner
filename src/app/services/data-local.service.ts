import { Injectable } from '@angular/core';
import { Registro } from '../models/registro.model';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';
import { Browser } from '@capacitor/browser';

import { File } from '@awesome-cordova-plugins/file/ngx';
import { EmailComposer } from '@awesome-cordova-plugins/email-composer/ngx';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

@Injectable({
  providedIn: 'root'
})
export class DataLocalService {

  guardados: Registro[] = [];

  constructor( private storage: Storage,
               private navCtrl: NavController,
               private file: File,
               private emailComposer: EmailComposer ) { 
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

  async enviarCorreo(){

    const arrTemp = [];
    const titulos = 'Tipo, Formato, Creado en, Texto\n';

    arrTemp.push( titulos );

    this.guardados.forEach( registro => {

      const linea = `${ registro.type }, ${ registro.format }, ${ registro.created },
      ${ registro.text.replace(',',' ') }\n`;
      
      arrTemp.push( linea );

    });

    this.writeSecretFile( arrTemp.join('') );
  
  }


  writeSecretFile = async ( text: string ) => {
    await Filesystem.writeFile({
      path: 'registro.txt',
      data: text,
      directory: Directory.Documents,
      encoding: Encoding.UTF8,
    });
    type contents = string
    const contents = await Filesystem.readFile({
      path: 'registro.txt',
      directory: Directory.Documents,
      encoding: Encoding.UTF8,
    });
    console.log('secrets:', contents);
    
    const email = {
      to: 'darioavalos8517@gmail.com',
      // cc: 'darioavalos8517@gmail.com',
      // bcc: ['',''],
      attachments: [
        'file:///storage/emulated/0/Documents/registro.txt'
      ],
      subject: 'Backup del escaneer',
      body: 'Aqui tienen sus backup - ScanApp',
      isHtml: true
    };
  
    this.emailComposer.open(email);
  };



}
