import { LoaderFunction, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { ChevronRight } from "lucide-react";
//Types
import { type ProductsItemProps } from "~/types/productsTypes";

import { ProjectSlider, ProjectBreadcrumbs } from "~/components/client";

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

export const loader: LoaderFunction = ({ params }: LoaderFunctionArgs) => {
  const { productId } = params;

  //Will make an error catch there
  if (!productId) {
    return null;
  }

  //Replace with actual server request
  console.log(`Making a request for product with id ${productId}`);
  const productData = productsFakeData.find((item) => item.id == productId);
  if (productData) {
    return productData;
  }
};

//Product description paragraph
const ProductDescriptionPar = ({ innerContent }: { innerContent: string }) => {
  return <p className="mt-4 text-gray-700 text-left">{innerContent}</p>;
};

//List fake data
const listFakeData = [
  {
    listTitle: "Key Features",
    listContent: [
      "Open-concept living and dining area",
      "Floor-to-ceiling windows for natural light",
      "Vaulted ceilings in main living spaces",
      "Integrated smart-home system",
      "Hardwood flooring throughout",
    ],
  },
  {
    listTitle: "Construction & Materials",
    listContent: [
      "Structural insulated panels (SIPs)",
      "High-performance double-glazed windows",
      "Standing-seam metal roofing",
      "Eco-friendly reclaimed wood accents",
      "R-38 spray foam wall insulation",
    ],
  },
  {
    listTitle: "Amenities & Comfort",
    listContent: [
      "Energy-efficient mini-split HVAC",
      "Tankless on-demand water heater",
      "Built-in EV charging station",
      "Under-floor radiant heating",
      "Rainwater harvesting system",
    ],
  },
];

//Product features list
const ProductFeaturesList = ({
  listTitle,
  listContent,
}: {
  listTitle: string;
  listContent: string[];
}) => {
  return (
    <div className="mt-10 w-full flex flex-col items-start md:items-center lg:items-start justify-start">
      <p className="text-lg font-semibold text-gray-900">{listTitle}</p>
      <ul className="mt-3 space-y-3">
        {listContent.map((item, i) => (
          <li
            key={i}
            className="flex justify-start md:justify-center lg:justify-start items-center gap-x-2 capitalize"
          >
            <ChevronRight size={14} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

//Main product route
const ProductRoute = () => {
  const productData = useLoaderData<ProductsItemProps>();

  //Slider config

  return (
    <section>
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8 z-0">
        {/* Header section */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-x-10">
          {/* Visual (Image and carousel) */}
          <div>
            <ProjectSlider />
          </div>

          {/* Text data */}
          <div className="mt-10 md:mt-0 flex flex-col items-start justify-start">
            {/* Breadcrumbs navigation */}
            <ProjectBreadcrumbs projectTitle={productData.name} />

            {/* Title */}
            <h2 className="text-2xl font-semibold text-gray-900 sm:text-3xl text-center mt-10">
              {productData.name}
            </h2>

            {/* Price */}
            <p className="text-gray-700 mt-4">
              {productData.currentPrice}$
              {productData.hasDiscount && (
                <span className="text-gray-400 line-through ml-2">
                  {productData.previousPrice}$
                </span>
              )}
            </p>

            {/* Description */}
            <ProductDescriptionPar innerContent={productData.desc} />
          </div>
        </div>

        {/* List with features house provide */}
        <div className="w-full h-auto mt-10">
          {/* Divider */}
          <span className="flex items-center">
            <span className="h-px flex-1 bg-gray-300"></span>

            <span className="shrink-0 px-4 text-gray-900">Description</span>

            <span className="h-px flex-1 bg-gray-300"></span>
          </span>

          {/* Replace with actual data in future */}
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {listFakeData.map((item, i) => (
              <ProductFeaturesList
                key={i}
                listTitle={item.listTitle}
                listContent={item.listContent}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductRoute;
