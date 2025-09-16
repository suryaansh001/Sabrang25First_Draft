declare module '@cashfreepayments/cashfree-js' {
  interface CashfreeOptions {
    mode: 'production' | 'sandbox';
  }

  interface CheckoutOptions {
    paymentSessionId: string;
    redirectTarget?: '_self' | '_blank';
  }

  interface CashfreeInstance {
    checkout(options: CheckoutOptions): Promise<void>;
  }

  export function load(options: CashfreeOptions): Promise<CashfreeInstance>;
}
