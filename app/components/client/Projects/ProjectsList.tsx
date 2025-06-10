import ProjectsListItem from "./ProjectsListItem";

import { type ProductsItemProps } from "~/types/productsTypes";

//Fake data
const productsFakeData = [
  {
    id: 1,
    name: "Aspen Retreat",
    currentPrice: 999,
    previousPrice: 99999,
    desc: "A cozy one-bedroom cabin with rustic wood finishes and panoramic mountain views.",
    isPopular: true,
    hasDiscount: true,
  },
  {
    id: 2,
    name: "Maple Grove",
    currentPrice: 1200,
    previousPrice: 1500,
    desc: "Spacious two-bedroom home with open kitchen, vaulted ceilings, and light-filled living areas.",
    isPopular: false,
    hasDiscount: true,
  },
  {
    id: 3,
    name: "Cedar Point",
    currentPrice: 850,
    previousPrice: 850,
    desc: "Compact one-bedroom unit perfect for small families or first-time homeowners.",
    isPopular: true,
    hasDiscount: false,
  },
  {
    id: 4,
    name: "Pine Crest",
    currentPrice: 1750,
    previousPrice: 2000,
    desc: "Luxury three-bedroom design with floor-to-ceiling windows and energy-efficient appliances.",
    isPopular: true,
    hasDiscount: true,
  },
  {
    id: 5,
    name: "Birch Haven",
    currentPrice: 1100,
    previousPrice: 1100,
    desc: "Charming cottage-style home with wraparound porch and eco-friendly insulation.",
    isPopular: false,
    hasDiscount: false,
  },
  {
    id: 6,
    name: "Oak Manor",
    currentPrice: 2300,
    previousPrice: 2800,
    desc: "Four-bedroom estate featuring smart-home integration and rooftop solar panels.",
    isPopular: true,
    hasDiscount: true,
  },
  {
    id: 7,
    name: "Willow Creek",
    currentPrice: 1450,
    previousPrice: 1450,
    desc: "Modern two-story home with attached garage and landscaped outdoor living space.",
    isPopular: false,
    hasDiscount: false,
  },
  {
    id: 8,
    name: "Spruce Landing",
    currentPrice: 950,
    previousPrice: 1200,
    desc: "Efficient studio unit with multifunctional furniture and high ceilings.",
    isPopular: false,
    hasDiscount: true,
  },
  {
    id: 9,
    name: "Elm Estate",
    currentPrice: 1600,
    previousPrice: 1600,
    desc: "Three-bedroom home with minimalist design and premium hardwood floors.",
    isPopular: true,
    hasDiscount: false,
  },
  {
    id: 10,
    name: "Sycamore Vista",
    currentPrice: 2000,
    previousPrice: 2500,
    desc: "Contemporary villa featuring large glass panels and an infinity pool.",
    isPopular: true,
    hasDiscount: true,
  },
  {
    id: 11,
    name: "Chestnut Bungalow",
    currentPrice: 780,
    previousPrice: 780,
    desc: "Affordable one-bedroom layout optimized for urban living with built-in storage.",
    isPopular: false,
    hasDiscount: false,
  },
  {
    id: 12,
    name: "Cypress Sanctuary",
    currentPrice: 1300,
    previousPrice: 1600,
    desc: "Elegant two-bedroom home with open concept living and solar-heated water system.",
    isPopular: false,
    hasDiscount: true,
  },
  {
    id: 13,
    name: "Redwood Retreat",
    currentPrice: 1980,
    previousPrice: 1980,
    desc: "Spacious four-bedroom configuration ideal for large families, with energy-star appliances.",
    isPopular: true,
    hasDiscount: false,
  },
  {
    id: 14,
    name: "Sequoia Loft",
    currentPrice: 1150,
    previousPrice: 1400,
    desc: "Trendy two-bedroom loft with industrial accents and polished concrete floors.",
    isPopular: false,
    hasDiscount: true,
  },
  {
    id: 15,
    name: "Pinewood Pavilion",
    currentPrice: 2450,
    previousPrice: 3000,
    desc: "Premium three-bedroom design with rooftop deck and smart heating controls.",
    isPopular: true,
    hasDiscount: true,
  },
  {
    id: 16,
    name: "Hemlock Hideaway",
    currentPrice: 1050,
    previousPrice: 1050,
    desc: "Compact studio with panoramic windows and green-roof technology.",
    isPopular: false,
    hasDiscount: false,
  },
];

const ProjectsList = () => {
  return (
    <div className="w-full grid grid-cols-1 gap-y-8 relative z-0 md:grid-cols-2 md:grid-rows-2 md:gap-x-5 lg:grid-cols-3">
      {productsFakeData.map((item: ProductsItemProps) => (
        <ProjectsListItem key={item.name} {...item} />
      ))}
    </div>
  );
};

export default ProjectsList;
