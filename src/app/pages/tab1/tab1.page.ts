import { Component } from '@angular/core';
import { BarcodeScanner, SupportedFormat } from '@capacitor-community/barcode-scanner';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  public inProcess: boolean = false;

  constructor( private alertCtrl: AlertController, private toastCtrl: ToastController ) {}

  // ionViewDidEnter() {
  //   console.log('viewDidEnter');
  // }

  // ionViewWillEnter() {
  //   console.log('viewWillEnter');
  // }

  ionViewDidLeave() {
    console.log('viewDidLeave');
    BarcodeScanner.stopScan();
  }
  
  ionViewWillLeave() {
    console.log('viewWillLeave');
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
      this.presentAlert();
    }
 
  }
 
  stopScan(){
    BarcodeScanner.showBackground();
    BarcodeScanner.stopScan();
  };
 
  async presentAlert() {
    const alert = await this.alertCtrl.create({
      header: '¡Excelente!',
      // subHeader: 'La asistencia se registró correctamente',
      message: 'La asistencia se guardó correctamente',
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

}
