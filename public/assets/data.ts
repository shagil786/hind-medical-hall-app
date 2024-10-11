import { Notification } from "@/provider/notificationProvider";
import image from "../images/droping-image.png"
import medicine from "../images/medicine.png"

export const generateFakeNotifications = (): Notification[] => {
    const types: Notification['type'][] = ['info', 'success', 'warning', 'error'];
    const messages = [
        "New feature released: Check out our latest update!",
        "Your order has been shipped.",
        "Your account password will expire in 3 days.",
        "Payment failed: Please update your payment method.",
        "Congratulations! You've earned a loyalty reward."
    ];

    return messages.map((message, index) => ({
        id: Date.now() + index,
        message,
        type: types[index % types.length],
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 86400000)), // Random time within last 24 hours
        read: Math.random() > 0.5 // Randomly set as read or unread
    }));
};

// Fake data for OfferCards
export const offerData = [
    {
        id: 1,
        title: "Summer Sale",
        description: "30% off on all summer items",
        image: image,
        gradientStart: "#30c8b1",
        gradientEnd: "#76f2c7",
    },
    {
        id: 2,
        title: "New Arrivals",
        description: "Check out our latest collection",
        image: image,
        gradientStart: "#30c8b1",
        gradientEnd: "#76f2c7",
    },
    {
        id: 3,
        title: "Free Shipping",
        description: "Free shipping on orders over $50",
        image: image,
        gradientStart: "#30c8b1",
        gradientEnd: "#76f2c7",
    },
    {
        id: 4,
        title: "Flash Sale",
        description: "24-hour sale on electronics",
        image: image,
        gradientStart: "#30c8b1",
        gradientEnd: "#76f2c7",
    },
];

// Fake data for Filters
export const filterData = [
    { id: 'medicine', name: 'Medicine', icon: medicine },
    { id: 'consultation', name: 'Consultation', icon: medicine },
    { id: 'prescription', name: 'Prescription', icon: medicine },
];

export const orders = [
    {
      status: 'Processed',
      orderNumber: 'F15306',
      pharmacyName: 'Farmacy ABC, Harry St. 10',
      productCount: 2,
      total: 167.90,
      items: []
    },
    {
      status: 'Delivered',
      orderNumber: 'F15324',
      pharmacyName: 'ALPHA Farmacy, Tyler St. 24',
      productCount: 6,
      total: 156.20,
      items: [
        { quantity: 1, name: 'Paracetamol', price: 12.70 },
        { quantity: 4, name: 'Aflukunazol 3000', price: 14.10 },
        { quantity: 1, name: 'RX Sintomix', price: 120.70 }
      ]
    }
  ];