// src/index.ts
async function createPayment(params) {
  const response = await fetch("https://gate.chip-in.asia/api/v1/purchases", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.NEXT_PUBLIC_CHIP_BRAND_ID}`
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
      brand_id: process.env.NEXT_PUBLIC_CHIP_BRAND_ID
    })
  });
  if (!response.ok) {
    throw new Error("Failed to create payment");
  }
  const data = await response.json();
  return data.checkout_url;
}
export {
  createPayment
};
