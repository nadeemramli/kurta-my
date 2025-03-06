import chip from 'chip-sdk';

// Disable the no-explicit-any rule for this file since we're dealing with an external SDK
// that doesn't provide proper TypeScript types
/* eslint-disable @typescript-eslint/no-explicit-any */

interface ChipConfig {
  brand_id: string;
  api_key: string;
  is_sandbox: boolean;
}

export interface CreatePaymentParams {
  product: {
    name: string;
    price: number;
  };
  client: {
    email: string;
    full_name?: string;
    phone_number?: string;
  };
  reference?: string;
  send_email?: boolean;
  callbacks?: {
    success_url?: string;
    failure_url?: string;
    cancel_url?: string;
  };
}

// Create a singleton instance of Purchase
const purchase = new (chip.Purchase as any)();

export class ChipService {
  private config: ChipConfig;

  constructor(config: ChipConfig) {
    this.config = config;
  }

  async createPayment({
    product,
    client,
    reference,
    send_email = true,
    callbacks = {},
  }: CreatePaymentParams) {
    try {
      const payment = await purchase.create({
        success_callback: callbacks.success_url,
        failure_callback: callbacks.failure_url,
        cancel_callback: callbacks.cancel_url,
        platform: 'web',
        transaction: {
          products: [{
            name: product.name,
            price: product.price,
            quantity: 1,
          }],
        },
        client: {
          email: client.email,
          full_name: client.full_name,
          phone_number: client.phone_number,
        },
        reference: reference,
        send_email: send_email,
      }, this.config);

      return payment;
    } catch (error) {
      console.error('Error creating Chip payment:', error);
      throw error;
    }
  }

  async getPayment(id: string) {
    try {
      const payment = await purchase.get(id, this.config);
      return payment;
    } catch (error) {
      console.error('Error getting Chip payment:', error);
      throw error;
    }
  }
}

export { purchase as chipPurchase }; 