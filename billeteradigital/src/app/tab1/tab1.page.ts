import { Component, ChangeDetectionStrategy } from '@angular/core';
import { WalletService } from '../services/wallet.service';



@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class Tab1Page {
  nombreCuenta: string = '';
  numeroCuenta: string = '';
  saldoDisponible: number = 0;
  cuentas: any[] = [];
  

  // scontrolar la visibilidad del formulario
  mostrarFormulario: boolean = false;

  constructor(private walletService: WalletService) {}

  agregarCuenta() {
    // Muestra el formulario al presionar "Agregar Cuenta"
    this.mostrarFormulario = true;
  }

  guardarCuenta() {
    const nuevaCuenta = {
      nombre: this.nombreCuenta,
      numero_cuenta: this.numeroCuenta,
      saldo_disponible: this.saldoDisponible
    };

    // Llama a la función del servicio para agregar la cuenta
    this.walletService.addAccount(nuevaCuenta);

    // Limpia los campos del formulario
    this.nombreCuenta = '';
    this.numeroCuenta = '';
    this.saldoDisponible = 0;
    this.mostrarFormulario = false;

    // Recarga la lista de cuentas después de agregar una nueva cuenta
    this.walletService.getAccounts().subscribe((cuentas) => {
      this.cuentas = cuentas;
    });

  }

  cancelarCuenta() {
    // Limpia los campos del formulario
    this.nombreCuenta = '';
    this.numeroCuenta = '';
    this.saldoDisponible = 0;
    this.mostrarFormulario = false;
  }
  // Agrega ngOnInit para cargar las cuentas al iniciar la página
  ngOnInit() {
    this.walletService.getAccounts().subscribe((cuentas) => {
      this.cuentas = cuentas;
    });
  }
  
}
