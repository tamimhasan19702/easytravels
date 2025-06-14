/** @format */

import client3 from "/clients/logo (1).png";
import client4 from "/clients/logo (2).png";
import client5 from "/clients/logo (3).png";
import client2 from "/clients/logo.png";
import client1 from "/clients/slack.png";

export const clients = [client1, client2, client3, client4, client5];

export const pricingTableInfo = [
  {
    packageName: "Basic Package",
    price: "$39",
    discountPrice: "$29",
    whatsIncluded: [
      "60 Unique Screens",
      "Apps source file",
      "400+ Free fonts",
      "Color source",
      "Icon included",
      "All Sketch, Figma Files",
    ],
    link: "",
    offNow: null,
    extra: [],
  },
  {
    packageName: "Premium Package",
    price: "$65",
    discountPrice: "$59",
    whatsIncluded: [
      "60 Unique Screens",
      "Apps source file",
      "400+ Free fonts",
      "Color source",
      "Icon included",
      "All Sketch, Figma Files",
    ],
    link: "",
    offNow: "50% Off Now",
    extra: ["HTML 5", "Frontend support", "Web Source"],
  },
];

export const faq = [
  {
    question: "How easy is it to book with EasyTravels?",
    answer:
      "t’s as simple as 1-2-3! Pick your destination, choose a package, and book in minutes. You’ll get a confirmation email with all the details.",
  },
  {
    question: "What’s included in EasyTravels packages?",
    answer:
      "Our packages cover flights, hotels, and select activities to keep things simple. Check the package details for more info.",
  },
  {
    question: "Can I customize my trip with EasyTravels?",
    answer:
      "Yes! Our tools make it easy to tweak your itinerary, or you can reach out to our team for help.",
  },
  {
    question: "What if I need to cancel my booking?",
    answer:
      "We make cancellations easy with flexible policies. Check the terms when booking or contact us for assistance.",
  },
  {
    question: "Will I have support during my trip?",
    answer:
      "Absolutely! EasyTravels offers 24/7 support to ensure your trip goes smoothly.",
  },
];

export const footerNavigation = [
  {
    widget_title: "Links",
    links: [
      {
        name: "Overons",
        link: "",
      },
      {
        name: "Social Media",
        link: "",
      },
      {
        name: "Counters",
        link: "",
      },
      {
        name: "Contact",
        link: "",
      },
    ],
  },
  {
    widget_title: "Company",
    links: [
      {
        name: "Terms & Conditions",
        link: "",
      },
      {
        name: "Privacy Policy",
        link: "",
      },
      {
        name: "Contact",
        link: "",
      },
    ],
  },
];

export const mainNavigation = [
  {
    name: "FEATURES",
    link: null,
    submenu: [
      {
        name: "FEATURE 1",
        link: "",
      },
      {
        name: "FEATURE 2",
        link: "",
      },
      {
        name: "FEATURE 2",
        link: "",
      },
    ],
  },
  {
    name: "PRICING",
    link: "",
  },
  {
    name: "WATCH A DEMO",
    link: "",
  },
];

export const variants1 = {
  hidden: { opacity: 0, y: -100 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
    },
  },
};
export const variants2 = {
  hidden: { opacity: 0, y: 100 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
    },
  },
};
export const variants3 = {
  hidden: { opacity: 0, x: -100 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 1,
    },
  },
};
export const variants4 = {
  hidden: { opacity: 0, x: 100 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 1,
    },
  },
};

export const animationVariants1 = {
  initial: {
    opacity: 0,
    y: 100,
  },
  animate: (index) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.2 * index,
      duration: 1,
    },
  }),
};

export const animationVariants2 = {
  initial: {
    opacity: 0,
    y: 30,
  },
  animate: (index) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.2 * index,
      duration: 1,
    },
  }),
};

export const graphData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Trips Booked",
      data: [5, 3, 7, 4, 6, 2],
      backgroundColor: "#9DAE11",
      borderColor: "#8C9A0F",
      borderWidth: 1,
    },
  ],
};

// Demo data for recent trips
export const recentTrips = [
  {
    id: 1,
    destination: "Paris, France",
    date: "2025-04-10",
    status: "Completed",
  },
  {
    id: 2,
    destination: "Tokyo, Japan",
    date: "2025-05-15",
    status: "Upcoming",
  },
  {
    id: 3,
    destination: "New York, USA",
    date: "2025-03-01",
    status: "Completed",
  },
];

// Demo data for upcoming bookings
export const upcomingBookings = [
  {
    id: 1,
    destination: "Tokyo, Japan",
    date: "2025-05-15",
    status: "Confirmed",
  },
  {
    id: 2,
    destination: "Sydney, Australia",
    date: "2025-06-20",
    status: "Pending",
  },
];

// Demo stats
export const stats = {
  totalTrips: 15,
  totalSpent: "$5,230",
  favoriteDestination: "Paris, France",
};
