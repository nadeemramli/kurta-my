"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  ChipService: () => ChipService
});
module.exports = __toCommonJS(index_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ChipService
});
