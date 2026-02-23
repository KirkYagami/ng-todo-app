import { Component, input } from '@angular/core';

@Component({
  selector:    'app-confirm-dialog',
  imports:     [],
  templateUrl: './confirm-dialog.html',
  styleUrl:    './confirm-dialog.scss',
})
export class ConfirmDialog {

  // ── Set by DynamicLoaderService via ComponentRef.setInput() ──
  message       = input<string>('Are you sure?');
  confirmLabel  = input<string>('Delete');
  cancelLabel   = input<string>('Cancel');

  // Callbacks — the service passes arrow functions that call
  // componentRef.destroy() after the user chooses.
  onConfirm = input<() => void>(() => {});
  onCancel  = input<() => void>(() => {});

  handleConfirm(): void { this.onConfirm()(); }
  handleCancel():  void { this.onCancel()();  }
}