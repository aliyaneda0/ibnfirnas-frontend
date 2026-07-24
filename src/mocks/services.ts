import type { Service } from "@/types/api";

export const mockServices: Service[] = [
  {
    id: 1,
    name: "Structural Design",
    slug: "structural-design",
    description:
      "End-to-end structural design and engineering for industrial and commercial buildings, from concept drawings to fabrication-ready plans.",
    shortDescription: "Engineering and structural design for industrial builds.",
    iconUrl: null,
    imageUrl:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800",
    isFeatured: true,
    isActive: true,
    displayOrder: 1,
    createdAt: "2026-06-01T09:00:00",
    updatedAt: "2026-06-01T09:00:00",
  },
  {
    id: 2,
    name: "Automatic Door Installation",
    slug: "automatic-door-installation",
    description:
      "Full installation service for sliding and swing automatic doors, including sensor calibration and site handover training.",
    shortDescription: "Professional installation for automatic door systems.",
    iconUrl: null,
    imageUrl:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
    isFeatured: true,
    isActive: true,
    displayOrder: 2,
    createdAt: "2026-06-02T09:00:00",
    updatedAt: "2026-06-02T09:00:00",
  },
  {
    id: 3,
    name: "Preventive Maintenance",
    slug: "preventive-maintenance",
    description:
      "Scheduled maintenance contracts for doors, shutters, and barriers to reduce downtime and extend equipment life.",
    shortDescription: "Scheduled maintenance for automated systems.",
    iconUrl: null,
    imageUrl:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800",
    isFeatured: true,
    isActive: true,
    displayOrder: 3,
    createdAt: "2026-06-03T09:00:00",
    updatedAt: "2026-06-03T09:00:00",
  },
  {
    id: 4,
    name: "Emergency Repair",
    slug: "emergency-repair",
    description:
      "Rapid-response repair service for automatic doors, shutters, and boom barriers across Doha and surrounding areas.",
    shortDescription: "Rapid-response repair for automated systems.",
    iconUrl: null,
    imageUrl:
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800",
    isFeatured: false,
    isActive: true,
    displayOrder: 4,
    createdAt: "2026-06-04T09:00:00",
    updatedAt: "2026-06-04T09:00:00",
  },
];
