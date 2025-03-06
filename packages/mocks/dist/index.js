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
  mockProducts: () => mockProducts
});
module.exports = __toCommonJS(index_exports);
var mockProducts = [
  {
    id: "1",
    name: "Classic White Kurta",
    description: "A timeless white kurta perfect for any occasion",
    price: { amount: 49.99, currencyCode: "USD" },
    images: [
      {
        url: "/images/products/white-kurta-1.jpg",
        altText: "Classic White Kurta - Front View",
        width: 800,
        height: 800
      }
    ]
  },
  {
    id: "2",
    name: "Black Embroidered Kurta",
    description: "Elegant black kurta with traditional embroidery",
    price: { amount: 79.99, currencyCode: "USD" },
    images: [
      {
        url: "/images/products/black-kurta-1.jpg",
        altText: "Black Embroidered Kurta - Front View",
        width: 800,
        height: 800
      }
    ]
  },
  {
    id: "3",
    name: "Navy Blue Cotton Kurta",
    description: "Comfortable cotton kurta in rich navy blue",
    price: { amount: 59.99, currencyCode: "USD" },
    images: [
      {
        url: "/images/products/navy-kurta-1.jpg",
        altText: "Navy Blue Cotton Kurta - Front View",
        width: 800,
        height: 800
      }
    ]
  }
];
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  mockProducts
});
