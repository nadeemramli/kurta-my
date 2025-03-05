"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCart, CartItem } from "./cart-context";
import { Minus, Plus, X } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

function CartItemComponent({ item }: { item: CartItem }) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex py-4">
      <div className="relative h-20 w-20 sm:h-24 sm:w-24 flex-shrink-0 overflow-hidden rounded-md border border-neutral-200 dark:border-neutral-800">
        <Image
          src={item.imageSrc}
          alt={item.imageAlt}
          fill
          sizes="(max-width: 640px) 80px, 96px"
          className="object-cover object-center"
          priority={false}
        />
      </div>

      <div className="ml-4 flex flex-1 flex-col">
        <div className="flex justify-between text-base font-medium">
          <h3 className="pr-2">{item.title}</h3>
          <p className="ml-4 whitespace-nowrap">${item.price.toFixed(2)}</p>
        </div>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          {item.color} / {item.size}
        </p>

        <div className="mt-auto flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-4 text-center">{item.quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => {
              removeItem(item.id);
              toast.success("Item removed from cart");
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function CartSheet() {
  const { isOpen, setIsOpen, items, subtotal } = useCart();

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error("Your cart is empty", {
        description: "Add some items to your cart before checking out.",
      });
      return;
    }
    window.location.href = "/checkout";
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent
        side="right"
        className="flex w-full flex-col pr-0 sm:max-w-lg"
      >
        <SheetHeader className="flex flex-row items-center justify-between px-6 border-b pb-4">
          <SheetTitle>Shopping Cart</SheetTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </SheetHeader>

        <div className="mt-8 flex h-full flex-col">
          <div className="flex-1 overflow-y-auto px-6">
            {items.length === 0 ? (
              <p className="text-center text-neutral-500 dark:text-neutral-400">
                Your cart is empty
              </p>
            ) : (
              <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {items.map((item) => (
                  <CartItemComponent key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-neutral-200 px-6 py-6 dark:border-neutral-800">
            <div className="flex justify-between text-base font-medium">
              <p>Subtotal</p>
              <p>${subtotal.toFixed(2)}</p>
            </div>
            <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
              Shipping and taxes calculated at checkout.
            </p>
            <div className="mt-6">
              <Button
                className="w-full"
                onClick={handleCheckout}
                disabled={items.length === 0}
              >
                Checkout
              </Button>
            </div>
            <div className="mt-6 flex justify-center text-center text-sm text-neutral-500 dark:text-neutral-400">
              <Button
                variant="link"
                className="text-sm"
                onClick={() => setIsOpen(false)}
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
