import { Injectable } from '@angular/core';
import { Registro } from '../models/registro.model';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';
import { Browser } from '@capacitor/browser';

import { File } from '@awesome-cordova-plugins/file/ngx';
import { EmailComposer } from '@awesome-cordova-plugins/email-composer/ngx';

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

    this.crearArchivoFisico( arrTemp.join('') );
  
  }

  crearArchivoFisico( text: string ){

    this.file.checkFile( this.file.externalDataDirectory, 'registros.csv' )
      .then( existe => {
        console.log('Existe archivo?', existe);
        return this.escribirEnArchivo( text );
      })
      .catch( err => {

        return this.file.createFile( this.file.externalDataDirectory, 'registros.csv', false)
          .then( creado => this.escribirEnArchivo( text ) )
          .catch( err2 => console.log ('No se pudo crear el archivo', err2));
      })

  }

  async escribirEnArchivo( text: string ) {

    await this.file.writeExistingFile( this.file.externalDataDirectory, 'registros.csv', text);

    const archivo = `${this.file.externalDataDirectory}registro.csv`;
    // console.log(this.file.dataDirectory + 'registro.csv');

    const email = {
      to: 'darioavalos8517@gmail.com',
      // cc: 'darioavalos8517@gmail.com',
      // bcc: ['',''],
      attachments: [
        archivo
      ],
      subject: 'Backup de scans',
      body: 'Aqui tienen sus backup - ScanApp',
      isHtml: true
    };

    this.emailComposer.open(email);
  }

  // writeSecretFile = async ( text: string ) => {
  //   await Filesystem.writeFile({
  //     path: 'secrets/registro.txt',
  //     data: 'This is a test',
  //     directory: Directory.Documents,
  //     encoding: Encoding.UTF8,
  //   });

  //   const contents = await Filesystem.readFile({
  //     path: 'secrets/text.txt',
  //     directory: Directory.Documents,
  //     encoding: Encoding.UTF8,
  //   });
  
  //   console.log('secrets:', contents);
  // };

}
