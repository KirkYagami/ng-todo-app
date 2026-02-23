import {
  Injectable,
  ViewContainerRef,
  ComponentRef,
  signal,
} from '@angular/core';
import { Toast, ToastType }    from '../components/toast/toast';
import { ConfirmDialog }       from '../components/confirm-dialog/confirm-dialog';
import { EditModal }           from '../components/edit-modal/edit-modal';
import { Todo }                from '../models/todo.model';

@Injectable({ providedIn: 'root' })
export class DynamicLoaderService {

  // ── The insertion point ───────────────────────────────────────
  // App.ngAfterViewInit() calls register() once at startup,
  // handing us the ViewContainerRef of <div #dynamicHost> in app.html.
  private vcr!: ViewContainerRef;

  // ── State ─────────────────────────────────────────────────────
  // Other components can read this to disable the edit button
  // while a modal is already open.
  isModalOpen = signal(false);

  private modalRef: ComponentRef<EditModal | ConfirmDialog> | null = null;

  // ── Called once by App ────────────────────────────────────────
  register(vcr: ViewContainerRef): void {
    this.vcr = vcr;
  }

  // ─────────────────────────────────────────────────────────────
  // TOAST
  // Creates a Toast, sets its inputs, listens for self-destruction.
  // Multiple toasts can exist simultaneously — each has its own ref.
  // ─────────────────────────────────────────────────────────────

  showToast(message: string, type: ToastType = 'success'): void {
    if (!this.vcr) return;

    // 1. Create the component and append it to the container
    const ref = this.vcr.createComponent(Toast);

    // 2. Pass data in via setInput — works with signal inputs + OnPush
    ref.setInput('message', message);
    ref.setInput('type', type);

    // 3. Run the first change detection cycle so the DOM renders
    ref.changeDetectorRef.detectChanges();

    // 4. Listen for the custom event the Toast fires when its
    //    CSS transition is over, then destroy the ComponentRef.
    const host = ref.location.nativeElement as HTMLElement;
    const onDone = () => {
      ref.destroy();
      host.removeEventListener('toast:done', onDone);
    };
    host.addEventListener('toast:done', onDone);
  }

  // ─────────────────────────────────────────────────────────────
  // CONFIRM DIALOG
  // Creates a blocking confirm dialog with custom message and
  // two callbacks. Destroys itself when either is called.
  // ─────────────────────────────────────────────────────────────

  confirm(
    message:      string,
    onConfirm:    () => void,
    confirmLabel: string = 'Delete',
  ): void {
    if (!this.vcr || this.isModalOpen()) return;

    this.isModalOpen.set(true);
    this.modalRef = this.vcr.createComponent(ConfirmDialog);

    const ref = this.modalRef as ComponentRef<ConfirmDialog>;

    ref.setInput('message',      message);
    ref.setInput('confirmLabel', confirmLabel);

    // Wrap each callback so it also closes the modal
    ref.setInput('onConfirm', () => {
      onConfirm();
      this.closeModal();
    });
    ref.setInput('onCancel', () => this.closeModal());

    ref.changeDetectorRef.detectChanges();
  }

  // ─────────────────────────────────────────────────────────────
  // EDIT MODAL
  // Creates the edit form modal pre-filled with an existing Todo.
  // onSaved is called after a successful save so the caller can
  // show a "Saved!" toast.
  // ─────────────────────────────────────────────────────────────

  openEditModal(todo: Todo, onSaved: () => void): void {
    if (!this.vcr || this.isModalOpen()) return;

    this.isModalOpen.set(true);
    this.modalRef = this.vcr.createComponent(EditModal);

    const ref = this.modalRef as ComponentRef<EditModal>;

    ref.setInput('todo', todo);
    ref.setInput('onClose', () => this.closeModal());
    ref.setInput('onSaved', () => {
      this.closeModal();
      onSaved();
    });

    ref.changeDetectorRef.detectChanges();
  }

  // ── Shared close helper ───────────────────────────────────────
  private closeModal(): void {
    this.modalRef?.destroy();
    this.modalRef = null;
    this.isModalOpen.set(false);
  }
}