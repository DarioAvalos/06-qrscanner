import { Component } from '@angular/core';
import { BarcodeScanner, SupportedFormat } from '@capacitor-community/barcode-scanner';
import { AlertController } from '@ionic/angular';
import { DataLocalService } from 'src/app/services/data-local.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  public inProcess: boolean = false;
  result: string | undefined;

  constructor( private alertCtrl: AlertController,  
               private dataLocal: DataLocalService ) {}

  // ionViewDidEnter() {
  //   console.log('viewDidEnter');
  // }

  // ionViewWillEnter() {
  //   console.log('viewWillEnter');
  // }

  ionViewDidLeave() {
    // console.log('viewDidLeave');
    BarcodeScanner.stopScan();
  }
  
  ionViewWillLeave() {
    // console.log('viewWillLeave');
    window.document.querySelector('body')?.classList.remove('scanner-active');
  }

  async scan() {
 
    this.inProcess = true;
    // Este es lo importante!
    window.document.querySelector('body')?.classList.add('scanner-active');
 
    // Check camera permission
    // This is just a simple example, check out the better checks below
    await BarcodeScanner.checkPermission({ force: true });
 
    // make background of WebView transparent
    // note: if you are using ionic this might not be enough, check below
    BarcodeScanner.hideBackground();
 
    const result = await BarcodeScanner.startScan({ targetedFormats: [SupportedFormat.QR_CODE] }); // start scanning and wait for a result
 
    // if the result has content
    if (result.hasContent) {
      console.log(result.content); // log the raw scanned content
      // this.stopScan()
      this.result = result.content;

      this.dataLocal.guardarRegistro( result.format as string , result.content as string );

      this.presentAlert();

      this.abrirRegistro( result.content as string );
    }

    // if ( result.format ) {
    //   this.dataLocal.guardarRegistro( result.format as string , result.content as string );
    // }
 
  }
 
  stopScan(){
    BarcodeScanner.showBackground();
    BarcodeScanner.stopScan();
  };
 
  async presentAlert() {
    const alert = await this.alertCtrl.create({
      header: '¡Excelente!',
      subHeader: this.result,
      message: 'El codigo se guardó correctamente',
      buttons: [
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {
            console.log('Alert confirmed');
            this.inProcess = false;
            
          },
        },
      ],
      mode: 'ios',
      translucent: true,
      animated: true
    });
 
 
    await alert.present();
  }

  abrirRegistro( registro: any ) {

    this.dataLocal.abrirRegistros( registro );

  }
  
  cancel() {
    this.inProcess = false;
    this.stopScan();
  }
}
