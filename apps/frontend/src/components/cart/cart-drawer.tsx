"use client";

import { Fragment } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "./cart-context";
import { formatPrice } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingBag, X, Minus, Plus } from "lucide-react";

export function CartDrawer() {
  const { state, removeItem, updateQuantity } = useCart();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative"
          aria-label="Open cart"
        >
          <ShoppingBag className="h-5 w-5" />
          {state.itemCount > 0 && (
            <span className="absolute -right-2 -top-2 h-5 w-5 rounded-full bg-black text-xs text-white flex items-center justify-center">
              {state.itemCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
        <SheetHeader className="px-1">
          <SheetTitle>Shopping Cart</SheetTitle>
        </SheetHeader>
        <div className="flex flex-1 flex-col gap-6 overflow-hidden">
          {state.items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center space-y-2">
              <ShoppingBag className="h-12 w-12 text-neutral-400" />
              <div className="text-xl font-medium text-neutral-400">
                Your cart is empty
              </div>
              <SheetTrigger asChild>
                <Link
                  href="/products"
                  className="text-sm text-neutral-500 underline-offset-4 hover:underline"
                >
                  Continue shopping
                </Link>
              </SheetTrigger>
            </div>
          ) : (
            <Fragment>
              <div className="flex-1 overflow-y-auto">
                <ul className="-my-6 divide-y divide-neutral-200">
                  {state.items.map((item) => (
                    <li key={item.id} className="flex py-6 px-1">
                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-neutral-200">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={96}
                          height={96}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>

                      <div className="ml-4 flex flex-1 flex-col">
                        <div>
                          <div className="flex justify-between text-base font-medium text-neutral-900">
                            <div>
                              <h3>
                                <Link
                                  href={`/product/${item.productId}`}
                                  className="font-medium"
                                >
                                  {item.name}
                                </Link>
                              </h3>
                              {item.attributes &&
                                Object.keys(item.attributes).length > 0 && (
                                  <p className="mt-1 text-sm text-neutral-500">
                                    {Object.entries(item.attributes)
                                      .map(([key, value]) => `${key}: ${value}`)
                                      .join(", ")}
                                  </p>
                                )}
                            </div>
                            <p className="ml-4">{formatPrice(item.price)}</p>
                          </div>
                        </div>
                        <div className="flex flex-1 items-end justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              disabled={item.quantity <= 1}
                              className="rounded-md p-1 hover:bg-neutral-100 disabled:opacity-50"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <Input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) =>
                                updateQuantity(item.id, Number(e.target.value))
                              }
                              className="h-8 w-16 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                            />
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="rounded-md p-1 hover:bg-neutral-100"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="font-medium text-red-600 hover:text-red-500"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-neutral-200 px-1 py-6">
                <div className="flex justify-between text-base font-medium text-neutral-900">
                  <p>Subtotal</p>
                  <p>{formatPrice(state.total)}</p>
                </div>
                <p className="mt-0.5 text-sm text-neutral-500">
                  Shipping and taxes calculated at checkout.
                </p>
                <div className="mt-6">
                  <SheetTrigger asChild>
                    <Link href="/checkout">
                      <Button className="w-full">Checkout</Button>
                    </Link>
                  </SheetTrigger>
                </div>
                <div className="mt-6 flex justify-center text-center text-sm text-neutral-500">
                  <SheetTrigger asChild>
                    <Link
                      href="/products"
                      className="font-medium text-black hover:text-neutral-800"
                    >
                      Continue Shopping
                    </Link>
                  </SheetTrigger>
                </div>
              </div>
            </Fragment>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
