import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { take } from 'rxjs/operators';



@Injectable({
  providedIn: 'root',
})
export class WalletService {

  private historialTransferencias: any[] = [];
  constructor(private db: AngularFireDatabase) {}

  addTransferToHistory(transferencia: any) {
    this.historialTransferencias.push(transferencia);
  }

  getTransferHistory() {
    return this.historialTransferencias;
  }

  // Agregar una nueva cuenta a Firebase Realtime Database
  addAccount(accountData: any) {
    return this.db.list('accounts').push(accountData);
  }

  // Obtener todas las cuentas desde Firebase Realtime Database
  getAccounts() {
    return this.db.list('accounts').valueChanges();
  }

  transfer(fromAccount: string, toAccount: string, amount: number) {
  const accountsRef = this.db.list('accounts');

  accountsRef
    .snapshotChanges()
    .pipe(take(1))
    .subscribe((changes) => {
      changes.forEach((change) => {
        const account = change.payload.val() as any;

        if (account.numero_cuenta === fromAccount) {
          const from = { key: change.payload.key, ...account };

          if (from.saldo_disponible >= amount) {
            const newFromBalance = from.saldo_disponible - amount;

            // Encuentra la cuenta de destino
            const to = changes.find((toChange) => {
              const payloadVal = toChange.payload.val();
              if (payloadVal && typeof payloadVal === 'object' && 'numero_cuenta' in payloadVal) {
                return payloadVal.numero_cuenta === toAccount;
              }
              return false;
            }); 

            if (to) {
              const toAccountData = to.payload.val() as any;
              const newToBalance = toAccountData.saldo_disponible + amount;

              // Actualiza los saldos
              if (from.key && to.key) {
                accountsRef.update(from.key, { saldo_disponible: newFromBalance });
                accountsRef.update(to.key, { saldo_disponible: newToBalance });
              } else {
                console.error('Una o ambas claves son nulas.');
              }

              console.log('Transferencia exitosa.');
            } else {
              console.error('Cuenta de destino no encontrada.');
            }
          } else {
            console.error('Saldo insuficiente en la cuenta de origen.');
          }
        }
      });
    });
  }

}

