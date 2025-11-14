// /src/app/context/hooks/useCart.ts

"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import SanityProduct, { CleanCartItem, ProductVariant, SanityImageObject } from '@/sanity/types/product_types';
import { toastSuccess, toastError } from '@/app/_components/shared/CustomToasts';

// === THE FIX IS HERE: `export` keyword is on the function declaration ===
export function useCart() {
  const { data: session } = useSession();
  const router = useRouter();

  const [cartItems, setCartItems] = useState<CleanCartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [totalQuantities, setTotalQuantities] = useState(0);

  // Load cart from localStorage on initial render
  useEffect(() => {
    try {
      const cartData = localStorage.getItem("PocketValue_cart");
      if (cartData) {
        const parsedCart = JSON.parse(cartData);
        setCartItems(parsedCart.items || []);
        // Subtotal and quantities will be recalculated by the other useEffect
      }
    } catch (error) {
      console.error("Failed to parse cart data from localStorage", error);
    }
  }, []);

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(
      "PocketValue_cart",
      JSON.stringify({ items: cartItems, subtotal, totalQuantities })
    );
  }, [cartItems, subtotal, totalQuantities]);

  // Centralized recalculation logic for robustness
  useEffect(() => {
    if (cartItems.length === 0) {
      if (subtotal !== 0 || totalQuantities !== 0) {
        setSubtotal(0);
        setTotalQuantities(0);
      }
      return;
    }
    
    const { newSubtotal, newTotalQuantities } = cartItems.reduce(
      (acc, item) => {
        acc.newSubtotal += item.price * item.quantity;
        acc.newTotalQuantities += item.quantity;
        return acc;
      },
      { newSubtotal: 0, newTotalQuantities: 0 }
    );

    setSubtotal(newSubtotal);
    setTotalQuantities(newTotalQuantities);
  }, [cartItems]);

  const onAdd = (product: SanityProduct, variant: ProductVariant, quantity: number): boolean => {
    if (!session) {
      toastError("Please log in to add items to your cart.");
      router.push("/login?callbackUrl=" + window.location.pathname);
      return false;
    }

    const cartItemId = `${product._id}-${variant._key}`;
    const checkProductInCart = cartItems.find(item => item.cartItemId === cartItemId);
    
    if (checkProductInCart) {
      setCartItems(cartItems.map(item => 
        item.cartItemId === cartItemId 
          ? { ...item, quantity: item.quantity + quantity } 
          : item
      ));
    } else {
      const effectivePrice = variant.salePrice ?? variant.price;
      const effectiveImage = (variant.images?.[0] || product.defaultVariant.images?.[0]) as SanityImageObject;
      const effectiveName = `${product.title} (${variant.name})`;
      
      const newCartItem: CleanCartItem = {
        _id: product._id, cartItemId, name: effectiveName, price: effectivePrice,
        quantity, slug: product.slug, image: effectiveImage,
        variant: { _key: variant._key, name: variant.name }, categoryIds: product.categoryIds,
      };
      setCartItems(prevItems => [...prevItems, newCartItem]);
    }
    
    const effectiveName = `${product.title} (${variant.name})`;
    toastSuccess(`${quantity} x ${effectiveName} added to cart.`, "Item Added");
    return true;
  };

  const onRemove = (itemToRemove: CleanCartItem) => {
    setCartItems(prevItems => prevItems.filter(item => item.cartItemId !== itemToRemove.cartItemId));
    toastError(`${itemToRemove.name} removed from cart.`, "Item Removed");
  };

  const toggleCartItemQuantity = (cartItemId: string, value: "inc" | "dec") => {
    const foundProduct = cartItems.find((item) => item.cartItemId === cartItemId);
    if (!foundProduct) return;

    if (value === "dec" && foundProduct.quantity <= 1) {
      onRemove(foundProduct);
      return;
    }

    setCartItems(cartItems.map(item =>
      item.cartItemId === cartItemId
        ? { ...item, quantity: value === "inc" ? item.quantity + 1 : item.quantity - 1 }
        : item
    ));
  };

  const clearCart = () => {
    setCartItems([]);
  };
  
  const buyNow = (product: SanityProduct, variant: ProductVariant, quantity: number) => {
    if (!session) {
      toastError("Please log in to buy this item.");
      router.push("/login?callbackUrl=" + window.location.pathname);
      return;
    }
    clearCart();
    setTimeout(() => {
      const success = onAdd(product, variant, quantity);
      if (success) {
        router.push('/checkout');
      }
    }, 100);
  };

  return {
    cartItems,
    subtotal,
    totalQuantities,
    onAdd,
    onRemove,
    toggleCartItemQuantity,
    clearCart,
    buyNow,
  };
}