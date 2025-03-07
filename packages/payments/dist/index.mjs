// src/index.ts
var ChipService = class {
  brand_id;
  api_key;
  is_sandbox;
  constructor(config) {
    this.brand_id = config.brand_id;
    this.api_key = config.api_key;
    this.is_sandbox = config.is_sandbox ?? false;
  }
  async createPayment(params) {
    const baseUrl = this.is_sandbox ? "https://gate.sandbox.chip-in.asia/api/v1" : "https://gate.chip-in.asia/api/v1";
    const response = await fetch(`${baseUrl}/purchases`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.api_key}`
      },
      body: JSON.stringify({
        success_callback: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
        failure_callback: `${process.env.NEXT_PUBLIC_APP_URL}/payment/failure`,
        cancel_callback: `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancel`,
        platform: "web",
        transaction: {
          products: [{
            name: params.product.name,
            price: params.product.price,
            quantity: 1
          }]
        },
        client: {
          email: params.client.email,
          full_name: params.client.full_name,
          phone_number: params.client.phone_number
        },
        reference: params.reference,
        send_email: true,
        brand_id: this.brand_id
      })
    });
    if (!response.ok) {
      throw new Error("Failed to create payment");
    }
    const data = await response.json();
    return data.checkout_url;
  }
};
export {
  ChipService
};
