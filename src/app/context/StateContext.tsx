
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { toast } from "react-hot-toast";
import SanityProduct, {
  CleanCartItem,
  CleanWishlistItem,
  ProductVariant,
  SanityImageObject,
} from "@/sanity/types/product_types";
import { useSession } from "next-auth/react"; // <-- ZAROORI IMPORT
import { useRouter } from "next/navigation"; // <-- ZAROORI IMPORT

// Interfaces (No change)
interface ShippingAddress {
  fullName: string;
  phone: string;
  province: string;
  city: string;
  area: string;
  address: string;
}
interface StateContextType {
  cartItems: CleanCartItem[];
  totalPrice: number;
  totalQuantities: number;
  onAdd: (
    product: SanityProduct,
    variant: ProductVariant,
    quantity: number
  ) => void;
  onRemove: (item: CleanCartItem) => void;
  toggleCartItemQuantity: (cartItemId: string, value: "inc" | "dec") => void;
  wishlistItems: CleanWishlistItem[];
  handleAddToWishlist: (product: SanityProduct) => void;
  clearCart: () => void;
  shippingAddress: ShippingAddress | null;
  setShippingAddress: (address: ShippingAddress) => void;
}

const Context = createContext<StateContextType | null>(null);

export const StateContext = ({ children }: { children: ReactNode }) => {
  const { data: session } = useSession(); // <-- Get session data
  const router = useRouter(); // <-- Get router for redirection

  // All state declarations are perfect (No change)
  const [cartItems, setCartItems] = useState<CleanCartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantities, setTotalQuantities] = useState(0);
  const [wishlistItems, setWishlistItems] = useState<CleanWishlistItem[]>([]);
  const [shippingAddress, setShippingAddressState] =
    useState<ShippingAddress | null>(null);

  // All useEffects for localStorage are perfect (No change)
  useEffect(() => {
    try {
      const cartData = localStorage.getItem("PocketValue_cart");
      if (cartData) {
        const parsedCart = JSON.parse(cartData);
        setCartItems(parsedCart.items || []);
        setTotalPrice(parsedCart.totalPrice || 0);
        setTotalQuantities(parsedCart.totalQuantities || 0);
      }
      const wishlistData = localStorage.getItem("PocketValue_wishlist");
      if (wishlistData) {
        setWishlistItems(JSON.parse(wishlistData));
      }
    } catch (error) {
      console.error("Failed to parse data from localStorage", error);
      localStorage.clear();
    }
  }, []);
  useEffect(() => {
    localStorage.setItem(
      "PocketValue_cart",
      JSON.stringify({ items: cartItems, totalPrice, totalQuantities })
    );
  }, [cartItems, totalPrice, totalQuantities]);
  useEffect(() => {
    localStorage.setItem(
      "PocketValue_wishlist",
      JSON.stringify(wishlistItems)
    );
  }, [wishlistItems]);


  // === 'onAdd' FUNCTION UPGRADED WITH AUTH CHECK ===
  const onAdd = (
    product: SanityProduct,
    variant: ProductVariant,
    quantity: number
  ) => {
    // --- AUTHENTICATION CHECK ---
    if (!session) {
      toast.error("Please log in to add items to your cart.");
      router.push("/login?redirect=" + window.location.pathname);
      return; // Stop the function here
    }
    // --- END OF CHECK ---
    
    // Rest of the logic is perfect (No change)
    const cartItemId = `${product._id}-${variant._key}`;
    const checkProductInCart = cartItems.find(
      (item) => item.cartItemId === cartItemId
    );
    const effectivePrice = variant.salePrice ?? variant.price;
    const effectiveImage = (variant.images?.[0] ||
      product.defaultVariant.images?.[0]) as SanityImageObject;
    const effectiveName = `${product.title} (${variant.name})`;

    setTotalPrice((prev) => prev + effectivePrice * quantity);
    setTotalQuantities((prev) => prev + quantity);

    if (checkProductInCart) {
      const updatedCartItems = cartItems.map((p) =>
        p.cartItemId === cartItemId
          ? { ...p, quantity: p.quantity + quantity }
          : p
      );
      setCartItems(updatedCartItems);
    } else {
      const newCartItem: CleanCartItem = {
        _id: product._id,
        cartItemId,
        name: effectiveName,
        price: effectivePrice,
        quantity,
        slug: product.slug,
        image: effectiveImage,
        variant: {
          _key: variant._key,
          name: variant.name,
        },
      };
      setCartItems([...cartItems, newCartItem]);
    }
    toast.success(`${quantity} x ${effectiveName} added to cart.`);
  };

  
  // === 'handleAddToWishlist' FUNCTION UPGRADED WITH AUTH CHECK ===
  const handleAddToWishlist = (product: SanityProduct) => {
    // --- AUTHENTICATION CHECK ---
    if (!session) {
      toast.error("Please log in to manage your wishlist.");
      router.push("/login?redirect=" + window.location.pathname);
      return; // Stop the function here
    }
    // --- END OF CHECK ---

    // Rest of the logic is perfect (No change)
    const isAlreadyInWishlist = wishlistItems.some(
      (item) => item._id === product._id
    );

    if (isAlreadyInWishlist) {
      const updatedWishlist = wishlistItems.filter(
        (item) => item._id !== product._id
      );
      setWishlistItems(updatedWishlist);
      toast.error(`${product.title} removed from wishlist.`);
    } else {
      const defaultVariant = product.defaultVariant;
      const price = defaultVariant.salePrice ?? defaultVariant.price;
      const image = defaultVariant.images?.[0];

      if (!image) {
        toast.error("Could not add item to wishlist. Image is missing.");
        return;
      }

      const newWishlistItem: CleanWishlistItem = {
        _id: product._id,
        name: product.title,
        price: price,
        slug: product.slug,
        image: image,
      };
      setWishlistItems((prev) => [...prev, newWishlistItem]);
      toast.success(`${product.title} added to wishlist!`);
    }
  };


  // All other functions are perfect and do not need auth checks
  const onRemove = (itemToRemove: CleanCartItem) => {
    const foundProduct = cartItems.find((item) => item.cartItemId === itemToRemove.cartItemId);
    if (!foundProduct) return;
    const newCartItems = cartItems.filter((item) => item.cartItemId !== itemToRemove.cartItemId);
    setTotalPrice((prev) => prev - foundProduct.price * foundProduct.quantity);
    setTotalQuantities((prev) => prev - foundProduct.quantity);
    setCartItems(newCartItems);
    toast.error(`${foundProduct.name} removed from cart.`);
  };
  const toggleCartItemQuantity = (cartItemId: string, value: "inc" | "dec") => {
    const foundProduct = cartItems.find((item) => item.cartItemId === cartItemId);
    if (!foundProduct) return;
    if (value === "inc") {
        setCartItems(cartItems.map((item) => item.cartItemId === cartItemId ? { ...item, quantity: item.quantity + 1 } : item));
        setTotalPrice((prev) => prev + foundProduct.price);
        setTotalQuantities((prev) => prev + 1);
    } else if (value === "dec") {
        if (foundProduct.quantity > 1) {
            setCartItems(cartItems.map((item) => item.cartItemId === cartItemId ? { ...item, quantity: item.quantity - 1 } : item));
            setTotalPrice((prev) => prev - foundProduct.price);
            setTotalQuantities((prev) => prev - 1);
        } else {
            onRemove(foundProduct);
        }
    }
  };
  const clearCart = () => {
    setCartItems([]);
    setTotalPrice(0);
    setTotalQuantities(0);
  };
  const setShippingAddress = (address: ShippingAddress) => {
    setShippingAddressState(address);
  };

  return (
    <Context.Provider
      value={{
        cartItems,
        totalPrice,
        totalQuantities,
        onAdd,
        onRemove,
        toggleCartItemQuantity,
        wishlistItems,
        handleAddToWishlist,
        clearCart,
        shippingAddress,
        setShippingAddress,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useStateContext = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error(
      "useStateContext must be used within a StateContextProvider"
    );
  }
  return context;
};