import {
  Component,
  input,
  signal,
  OnInit,
  inject,
  DestroyRef,
} from '@angular/core';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

@Component({
  selector:    'app-toast',
  imports:     [],
  templateUrl: './toast.html',
  styleUrl:    './toast.scss',
})
export class Toast implements OnInit {

  // ── Set by DynamicLoaderService via ComponentRef.setInput() ──
  message = input<string>('');
  type    = input<ToastType>('success');

  // ── Controls the CSS slide-in / slide-out animation ──────────
  visible = signal(false);

  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    // Trigger slide-in on the next microtask so the browser has
    // rendered the element with opacity:0 first.
    const showTimer = setTimeout(() => this.visible.set(true), 10);

    // Start slide-out at 2.7 s
    const hideTimer = setTimeout(() => this.visible.set(false), 2700);

    // The host element dispatches a custom event so DynamicLoaderService
    // knows when to call componentRef.destroy() after the CSS transition.
    // (Dynamic components have no template parent to receive output() events.)
    const destroyTimer = setTimeout(() => {
      const host = document.querySelector('app-toast:last-of-type');
      host?.dispatchEvent(new CustomEvent('toast:done', { bubbles: true }));
    }, 3000);

    // Clean up timers if Angular destroys this component early.
    this.destroyRef.onDestroy(() => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
      clearTimeout(destroyTimer);
    });
  }

  get icon(): string {
    const map: Record<ToastType, string> = {
      success: '✓',
      error:   '✕',
      info:    'ℹ',
      warning: '⚠',
    };
    return map[this.type()];
  }
}