const GUEST_CART_KEY = "guestCart";
const CHANGE_EVENT = "guest-cart-change";

const isBrowser = () => typeof window !== "undefined";

const notify = () => {
  if (isBrowser()) window.dispatchEvent(new Event(CHANGE_EVENT));
};

export const getGuestCart = () => {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(GUEST_CART_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const setGuestCart = (items) => {
  if (!isBrowser()) return;
  window.localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
  notify();
};

export const clearGuestCart = () => {
  if (!isBrowser()) return;
  window.localStorage.removeItem(GUEST_CART_KEY);
  notify();
};

export const subscribeGuestCart = (fn) => {
  if (!isBrowser()) return () => {};
  window.addEventListener(CHANGE_EVENT, fn);
  return () => window.removeEventListener(CHANGE_EVENT, fn);
};

export const addToGuestCart = (product, quantity = 1) => {
  const productId = Number(product.id);
  const qty = Number(quantity) || 1;
  const items = getGuestCart();
  const existing = items.find((i) => Number(i.product_id) === productId);

  if (existing) {
    const maxQty = Number(product.quantity) || Infinity;
    const nextQty = Math.min(existing.quantity + qty, maxQty);
    existing.quantity = nextQty;
    setGuestCart(items);
    return items;
  }

  items.push({
    product_id: productId,
    quantity: qty,
    pro_name: product.pro_name || product.name || "",
    price: Number(product.price) || 0,
    discount_price: Number(product.discount_price) || 0,
    stock: Number(product.quantity) || 0,
    image:
      product.product_media?.find((m) => m.is_primary)?.media_url ||
      product.product_media?.[0]?.media_url ||
      product.media_url ||
      null,
  });
  setGuestCart(items);
  return items;
};

export const removeFromGuestCart = (productId) => {
  const items = getGuestCart().filter(
    (i) => Number(i.product_id) !== Number(productId),
  );
  setGuestCart(items);
  return items;
};

export const updateGuestCartQuantity = (productId, quantity) => {
  const items = getGuestCart();
  const item = items.find((i) => Number(i.product_id) === Number(productId));
  if (!item) return items;

  const maxQty = Number(item.stock) || Infinity;
  item.quantity = Math.max(1, Math.min(Number(quantity) || 1, maxQty));
  setGuestCart(items);
  return items;
};

export const getGuestCartCount = () =>
  getGuestCart().reduce((sum, item) => sum + Number(item.quantity || 0), 0);

export const isProductInGuestCart = (productId) =>
  getGuestCart().some((i) => Number(i.product_id) === Number(productId));
