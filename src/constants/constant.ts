import { computed } from "vue";
import type { VoyageTypeInfo } from "../types/voyage";

interface NavItem {
  name: string;
  path: string;
  icon?: string;
}

export const NavPaths = computed<NavItem[]>(() => [
  { name: "About", path: "/about", icon: "InfoIcon" },
  { name: "Contact", path: "/contact" },
]);

export const Voyages: VoyageTypeInfo[] = [
  {
    id: 1,
    imageUrl:
      "https://media.istockphoto.com/id/2166651330/photo/grand-teton-mountains-from-oxbow-bend-on-the-snake-river-at-sunrise-grand-teton-national-park.jpg?s=1024x1024&w=is&k=20&c=HjgInHAqpRLzk5HHSl9liLMzgjpDdC7EbXSTjRD66Uo=",
    title: "Summer Trip to Bali",
    notes: "Visited Ubud and Nusa Penida. Amazing beaches!",
    user_id: 101,
    location: "Bali, Indonesia",
    date: new Date("2023-07-15"),
    rating: 1,
    createdAt: new Date("2023-06-01T10:00:00Z"),
  },
  {
    id: 2,
    imageUrl:
      "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGxhbmRzY2FwZXxlbnwwfHwwfHx8MA%3D%3D",
    title: "Business Conference in Berlin",
    notes: "Attended Tech Summit 2023. Great networking opportunities.",
    user_id: 102,
    location: "Berlin, Germany",
    date: new Date("2023-09-22"),
    rating: 5,
    createdAt: new Date("2023-08-10T14:30:00Z"),
  },
  {
    id: 3,
    imageUrl:
      "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGxhbmRzY2FwZXxlbnwwfHwwfHx8MA%3D%3D",
    title: "Weekend Getaway to the Mountains",
    notes: "Hiking and camping in the Rockies. Breathtaking views!",
    user_id: 103,
    location: "Rocky Mountains, USA",
    date: new Date("2023-05-30"),
    rating: 2,
    createdAt: new Date("2023-05-15T09:15:00Z"),
  },
  {
    id: 4,
    imageUrl:
      "https://images.unsplash.com/photo-1433838552652-f9a46b332c40?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGxhbmRzY2FwZXxlbnwwfHwwfHx8MA%3D%3D",
    title: "Cultural Tour in Kyoto",
    notes: "Explored ancient temples and tried matcha desserts.",
    user_id: 104,
    location: "Kyoto, Japan",
    date: new Date("2023-11-05"),
    rating: 3,
    createdAt: new Date("2023-10-20T11:45:00Z"),
  },
  {
    id: 5,
    imageUrl:
      "https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGxhbmRzY2FwZXxlbnwwfHwwfHx8MA%3D%3D",
    title: "Road Trip Along the Coast",
    notes: "Drove from LA to San Francisco. Stopped at Big Sur.",
    user_id: 105,
    location: "California, USA",
    date: new Date("2023-08-12"),
    rating: 5,
    createdAt: new Date("2023-07-25T16:20:00Z"),
  },
];

export const platforms = [
  {
    socialMedia: "facebook",
    icon: "facebook",
  },
  {
    socialMedia: "X",
    icon: "x",
  },
  {
    socialMedia: "linkedIn",
    icon: "linkedin",
  },
];
