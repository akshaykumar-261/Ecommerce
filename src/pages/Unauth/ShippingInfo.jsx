import {
  Boxes,
  Clock,
  MapPin,
  PackageCheck,
  Truck,
} from "lucide-react";
import InfoPage from "../../components/common/InfoPage";

const SECTIONS = [
  {
    id: "delivery-times",
    title: "Delivery Times",
    icon: Clock,
    intro:
      "Every order is delivered by a courier partner in 3–7 working days, with faster service in metro cities. You will see the estimated delivery date at checkout.",
    items: [
      {
        title: "Metro cities — 2 to 3 working days",
        body: "Delivered by leading express partners with order tracking shared as soon as your parcel is picked up.",
      },
      {
        title: "Tier 2 & 3 cities — 4 to 5 working days",
        body: "Standard surface or air freight depending on the courier assigned to your pin code.",
      },
      {
        title: "Remote pin codes — 6 to 7 working days",
        body: "Some pin codes are serviced on a longer transit. We flag these before you pay so there are no surprises.",
      },
    ],
    note: "Delivery estimates are estimates, not guarantees. Public holidays, courier strikes and severe weather can occasionally add a day or two.",
  },
  {
    id: "tracking",
    title: "Order Tracking",
    icon: PackageCheck,
    items: [
      {
        title: "Tracking link by email and SMS",
        body: "As soon as your order is shipped you receive a tracking link on the email and phone number on your account.",
      },
      {
        title: "Live status in your account",
        body: "Open Profile → My Orders to see the current status of every order: placed, confirmed, shipped or delivered.",
      },
      {
        title: "No update for 48 hours?",
        body: "Occasionally tracking stops updating while a parcel is in transit between hubs. It resumes automatically — if it has not moved after 48 hours, contact support and we will chase the courier.",
      },
    ],
  },
  {
    id: "charges",
    title: "Shipping Charges",
    icon: Boxes,
    items: [
      {
        title: "Free delivery on eligible orders",
        body: "Standard delivery is free on orders above the value shown in your cart. The exact amount, if any, is always visible before you pay.",
      },
      {
        title: "One payment for every seller",
        body: "If your cart has products from several sellers, you still pay once. ShopEase splits the payment and settles each seller on your behalf — there is never a second invoice.",
      },
      {
        title: "Cash on delivery",
        body: "Available on eligible pin codes for orders up to the COD limit. A small handling fee may apply and is shown in the cart.",
      },
    ],
  },
  {
    id: "serviceability",
    title: "Serviceability",
    icon: MapPin,
    items: [
      {
        title: "Check before you order",
        body: "Enter your pin code on any product page to confirm whether it can be delivered to your address.",
      },
      {
        title: "Address changes",
        body: "You can change the delivery address until the order is shipped. Once a parcel is out for delivery, changes are not possible.",
      },
    ],
  },
  {
    id: "packaging",
    title: "Packaging & Safety",
    icon: Truck,
    items: [
      {
        title: "Secure, tamper-checked parcels",
        body: "Items are packed by the seller, sealed, and scanned at every hub before being handed to the courier.",
      },
      {
        title: "Damaged or wrong item?",
        body: "Record an unboxing video and raise the issue within 7 days of delivery. We arrange a free reverse pickup and send a replacement.",
      },
    ],
  },
];

function ShippingInfo() {
  return (
    <InfoPage
      badge="Shipping Info"
      icon={Truck}
      title="Shipping & Delivery"
      subtitle="Delivery timelines, tracking, shipping charges and what happens to your parcel after you order."
      sections={SECTIONS}
      ctaTitle="Questions about a delivery?"
      ctaText="Tell us your order number and our team will check the courier status for you right away."
    />
  );
}

export default ShippingInfo;
