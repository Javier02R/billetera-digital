import { Component } from '@angular/core';
import { WalletService } from '../services/wallet.service';
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  cuentaOrigen: string = '';
  cuentaDestino: string = '';
  montoTransferencia: number = 0;
  historial: any[] = [];

  constructor(private walletService: WalletService,public toastController: ToastController) {}

  // Agrega una variable para controlar la visibilidad del formulario
  hacerTransferencia: boolean = false;

  ngOnInit() {
    // Llama a obtenerHistorial al cargar la página
    this.obtenerHistorial();
  }

  transferir() {
    // Muestra el formulario al presionar "Agregar Cuenta"
    this.hacerTransferencia = true;
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000, // Duración en milisegundos
      position: 'top'
    });
    toast.present();
  }

  realizarTransferencia() {
    if (!this.cuentaOrigen || !this.cuentaDestino || this.montoTransferencia <= 0) {
      console.error('Por favor complete todos los campos correctamente.');
      return;
    }

    this.walletService.transfer(this.cuentaOrigen, this.cuentaDestino, this.montoTransferencia);


    this.presentToast('Transferencia exitosa');
    const nuevaTransferencia = {
      cuentaOrigen: this.cuentaOrigen,
      cuentaDestino: this.cuentaDestino,
      monto: this.montoTransferencia,
      fecha: new Date() // Puedes agregar una marca de tiempo para la fecha de la transferencia
    };

    this.walletService.addTransferToHistory(nuevaTransferencia);

    // Limpiar los campos del formulario
    this.cuentaOrigen = '';
    this.cuentaDestino = '';
    this.montoTransferencia = 0;
    // Llamar a obtenerHistorial para actualizar la lista
    this.obtenerHistorial();
    // Cerrar el formulario
    this.hacerTransferencia = false;

  }

  obtenerHistorial() {
    this.historial = this.walletService.getTransferHistory();
  }

  cancelarTransferencia() {
    // Limpia los campos del formulario
    this.cuentaOrigen = '';
    this.cuentaDestino = '';
    this.montoTransferencia = 0;
    this.hacerTransferencia = false;
  }

  

}