
export const serverFile = {
  DB_CONNECTION: "Data Base Connected Successfully",
  RUNNING_PORT: "Server is running on port",
  SERVER_ERROR: "Something went wrong, please try again later",
  DB_FAILED: "Database Connection Failed",
  DB_CLOSE: "Database connection closed",
  DB_CLOSING_ERROR: "Database Closing Error",
  ERROR: "Error connecting to the database:",
};

export const authMessage = {
  USER_NOT_FOUND: "this user not found or inactive",
  INVALID: "token is not valid",
  UN_AUTH: "Unauthorize user",
  TOKEN_REQUIRED: "Authorization token is required",
};

export const userMessage = {
  USER_CREATED: "User created successfully",
  USER_EXIST: "User already exists",
  USER_NOT_FOUND: "User not found",
  INVALID_CREDENTIALS: "Invalid email or password",
  OTP_SENT: "OTP sent to your email",
  OTP_INVALID: "Invalid OTP",
  INVALID_OTP: "Invalid OTP",
  OTP_NOT_FOUND: "OTP_NOT_FOUND",
  VERIFY_EMAIL: "Please verify your email before login",
  INVALID_TYPE: "Invalid OTP type",
  OTP_EXPIRED: "OTP has expired",
  OTP_VERIFIED: "OTP verified successfully",
  PASSWORD_RESET_SUCCESS: "Password reset successfully",
  PASSWORD_RESET_FAILED: "Failed to reset password",
  USER_UPDATED: "User updated successfully",
  USER_DELETED: "User deleted successfully",
  USER_LIST: "User list retrieved successfully",
  REQUIRED_FIELDS: "Name, email, and password are required",
  LOGIN_SUCCESS: "Login successful",
  LOGOUT_SUCCESS: "Logout successful",
  REQUIRED_TOKEN: "Refresh token required",
  INVALID_TOKEN: "token is not valid",
  NEW_TOKEN: "New access token generated",
  FETCH_PROFILE: "User profile fetched successfully",
  INCORRECT_PASSWORD: "Incorrect old password",
  CHANGE_PASSWORD: "Password changed successfully",
  REQUIRED: "idToken and provider are required.",
  SOCIAL_AUTH_FAIL: "Social authentication failed. Email or Social ID missing.",
  DEACTIVATE: "Your account has been deactivated by admin.",
  SOCIAL_LOGIN_SUCEES: "Logged in successfully via social authentication.",
  PROVIDER_NOT_SUPPORT: "Provider is not supported yet",
  SESSION_EXPIRED: "Session expired or logged out from this device",
  INVALID_SESSION: "Invalid session or logged out from this device",
  USER_VERIFY: "User Already Verify",
  INVALID_TOKEN: "Invalid verification token",
  USER_NOT_VERIFY: "Please verify your account first.",
  TOKEN_EXPIRED: "Token is expire",
  ACCESS_TOKEN_GENERATED: "Access token generated successfully.",
  VENDER_NOT_FOUND: "Vendor not found.",
  VENDER_DEACTIVATE: "Your account has been deactivated by admin.",
  VENDER_VERIFY: "Vendor Already Verify",
  VENDER_NOT_VERIFY: "Please verify your account first.",
  VENDER_NOT_ACTIVE: "Your account is not active yet.",
  VENDER_ACTIVE: "Your account is active now.",
  VENDER_DEACTIVATE_SUCCESS: "Vendor deactivated successfully.",
  VENDER_ACTIVATE_SUCCESS: "Vendor activated successfully.",
  VENDER_ALREADY_ACTIVE: "Vendor is already active.",
  VENDER_ALREADY_DEACTIVATE: "Vendor is already deactivated.",
  VENDER_NOT_FOUND: "Vendor not found.",
  VENDER_NOT_ACTIVE: "Your account is not active yet.",
  VENDER_ACTIVE: "Your account is active now.",
  VENDER_DEACTIVATE_SUCCESS: "Vendor deactivated successfully.",
  VENDER_ACTIVATE_SUCCESS: "Vendor activated successfully.",
  VENDER_ALREADY_ACTIVE: "Vendor is already active.",
  VENDER_ALREADY_DEACTIVATE: "Vendor is already deactivated.",
  VENDER_LIST_FETCHED: "Vendor list fetched successfully.",
  STRIPE_ACCOUNT_NOT_FOUND: "Stripe account not found.",
  STRIPE_ACCOUNT_NOT_CONNECTED: "Stripe account is not connected.",
  STRIPE_ACCOUNT_CONNECTED: "Stripe account connected successfully.",
  STRIPE_ACCOUNT_FETCHED: "Stripe account fetched successfully.",
  INVALID_ACTION: "Invalid action. Allowed actions are: approve, reject, block, unblock, delete.",
  VENDER_APPROVED: "Vendor approved successfully.",
  VENDER_REJECTED: "Vendor rejected successfully.",
  VENDER_BLOCKED: "Vendor blocked successfully.",
  VENDER_UNBLOCKED: "Vendor unblocked successfully.",
  VENDER_DELETED: "Vendor deleted successfully.",
  USER_PROFILE_FETCHED: "User profile fetched successfully.",
  VENDER_ORDER_NOT_FOUND: "Vendor orders not found.",
  VENDER_ORDER_FETCH: "Vendor orders fetched successfully.",
  PAYOUT_NOT_FOUND: "Vendor payouts not found.",
  PAYOUT_FETCH:"Vendor payouts fetched successfully."
};

export const storeMessages = {
  STORE_CREATED: "Store created successfully.",
  STORE_ALREADY_EXIST: "Store already exists.",
  STORE_NOT_FOUND: "Store not found.",
  STORE_UPDATED: "Store updated successfully.",
  STORE_DELETED: "Store deleted successfully.",
  STORE_FETCHED: "Store fetched successfully.",
  STORE_LIST: "Store list fetched successfully.",
};

export const productMessage = {
  PRODUCT_NOT_FOUND: "Product not found.",
  PRODUCT_CREATED: "Product created successfully.",
  PRODUCT_QUANTITY: "Product quantity updated successfully.",
  PRODUCT_FETCHED: "Product fetched successfully",
  DASHBOARD_FETECH: "Dashboard fetched successfully",
  PRODUCT_UPDATED: "Product updated successfully.",
  NOT_ALLOW: "You are not allowed to update this product.",
  MEDIA_UPLOAD: "Product media uploaded successfully.",
  MEDIA_NOT_FOUND: "Media not found.",
  MEDIA_DELETED: "Media deleted successfully.",
  ONLY_PRODUCT_IMAGE: "Only image can be set as primary",
  PRIMARY_IMAGE: "Primary image updated successfully.",
  OUT_OF_STOCK: "This product is currently out of stock.",
  NO_LOW_STOCK: "Low stock products not found.",
  LOW_STOCK_FETCH: "Low stock products fetched successfully."
};

export const cartMessage = {
  ITEM_ADDED: "Item added to cart successfully.",
  ITEM_UPDATED: "Cart item quantity updated successfully.",
  ITEM_REMOVED: "Item removed from cart successfully.",
  CART_CLEARED: "Cart cleared successfully.",
  ADDTO_CART: "Product added to cart successfully.",
  NOT_FOUND: "Cart Not Found",
  CART_ITEM_NOT_FOUND: "Cart item not found",
  REMOVE_FROM_CART: "Product Reove from cart",
  QUANTITY: "Quantity must be greater than 0",
  CART_UPDATED: "Cart Updated Successfully",
  // Fetch / Get
  CART_FETCHED: "Cart items fetched successfully.",
  CART_EMPTY: "Your cart is empty.",
  CART_COUNT: "Cart item count is 0.",
  CART_COUNT_FETCH: "Cart item count fetched successfully.",
  // Validation & Errors
  ITEM_NOT_FOUND: "Item not found in cart.",
  PRODUCT_OUT_OF_STOCK: "Product is out of stock.",
  EXCEEDS_STOCK: "Requested quantity exceeds available stock.",
  MIN_QUANTITY_ERROR: "Quantity must be at least 1.",
  MAX_QUANTITY_REACHED: "Maximum allowed quantity reached for this item.",
  INVALID_CART: "Invalid cart details provided.",
  // Coupon / Discount related to Cart
  COUPON_APPLIED: "Coupon code applied successfully.",
  COUPON_REMOVED: "Coupon code removed successfully.",
  INVALID_COUPON: "Invalid or expired coupon code.",
  COUPON_MIN_AMOUNT:
    "Cart total does not meet the minimum amount for this coupon.",
};

export const addressMessages = {
  ADDRESS_CREATED: "Address added successfully.",
  ADDRESS_UPDATED: "Address updated successfully.",
  ADDRESS_FETCHED: "Addresses fetched successfully.",
  ADDRESS_NOT_FOUND: "Address not found.",
  UNAUTHORIZED_ADDRESS: "You are not authorized to update this address.",
  ADDRESS_DELETED: "Address Deleted Successfully",
};

export const orderMessages = {
  ORDER_PLACED: "Order placed successfully.",
  ORDER_FETCHED: "Orders fetched successfully.",
  ORDER_CANCELLED: "Order cancelled successfully.",
  ORDER_NOT_FOUND: "Order not found.",
  ORDER_CANNOT_CANCEL: "This order cannot be cancelled.",
  CART_EMPTY: "Your cart is empty.",
  ADDRESS_NOT_FOUND: "Address not found.",
  UNAUTHORIZED: "You are not authorized to access this order.",
  ORDER_CREATED: "Order created successfully.",
  NOT_CANCEL_ORDER: "You are not allowed to cancel this order.",
  ORDER_ALREADY_CANCELLED: "Order already cancelled.",
  ORDER_STATUS: "Order status cannot be changed.",
  ORDER_STATUS_UPDATE: "Order status updated successfully.",
  VENDER_NO_SRIPE_ACCOUNT: "Vendor Stripe account not connected",
   VENDER_SRIPE_ACCOUNT_NOT_ENABLED: "Vendor Stripe account is not enabled",
};

export const paymentMessage = {
  PAYMENTINTENT_REQUIRE: "paymentIntentId is required",
  PAYMENT_SUCCESS: "Payment successful completed.",
  PAYMENT_NOT_COMPETE: "Payment not completed.",
  PAYMENT_NOT_FOUND: "Payment not found.",
  PAYMENT_REFUND_FAIL: "Refund failed.",
  ORDER_REFUND:"Order cancelled & refunded successfully"
}

export const adminMessage = {
  ORDER_NOT_FOUND: "Orders not found.",
  ORDER_FETCHED: "Orders fetched successfully.",
  VENDER_PAYOUT_FETCH: "Vendor payout summary fetched successfully.",
  VENDER_DAHBOARD_FETCH:"Vendor dashboard fetched successfully."
}