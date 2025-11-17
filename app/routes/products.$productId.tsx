import { LoaderFunction, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useLocation } from "@remix-run/react";
import { ChevronRight, Star, HandCoins } from "lucide-react";
import path from "path";
import fs from "fs/promises";

import { connectToDB } from "~/utils/db";
import projectModel from "~/models/Project";

import {
  ProjectSlider,
  ProjectBreadcrumbs,
  LightBox,
} from "~/components/client";

import HomeLayout from "~/layouts/HomeLayout";

export const loader: LoaderFunction = async ({
  params,
}: LoaderFunctionArgs) => {
  const { productId } = params;

  //Check if product id was provided
  if (!productId) {
    return new Response("No project id was provided");
  }

  //Request db for data of this project
  try {
    //Establish db connection
    connectToDB();

    const project = await projectModel.find({ _id: productId }).lean();

    if (!project) {
      throw new Error("No project was found");
    }

    //Create images paths
    const projectImagesFolderName = project[0].imagesFolder!;

    //Get slider images
    const sliderImagesPath = path.join(
      process.cwd(),
      "public",
      "projects",
      projectImagesFolderName,
      "carousel_images"
    );
    const images = await fs.readdir(sliderImagesPath);
    const imagesFilePathsForClient = images.map(
      (item) => `/projects/${projectImagesFolderName}/carousel_images/${item}`
    );

    return {
      ...project[0],
      carouselImagesPaths: imagesFilePathsForClient,
    };
  } catch (error) {
    throw new Error("Error during getting project from db");
  }
};

//Product description paragraph
const ProductDescriptionPar = ({ innerContent }: { innerContent: string }) => {
  //Check for language
  const { search } = useLocation();
  const lang: string = new URLSearchParams(search).get("lang")!;

  return (
    <p className="mt-4 text-gray-700 text-left">
      {JSON.parse(innerContent)[lang === "en" ? "eng" : lang]}
    </p>
  );
};

//Product features list
const ProductFeaturesList = ({
  title,
  listItems,
}: {
  title: {
    eng: string;
    est: string;
    rus: string;
    nor: string;
  };
  listItems: {
    content: {
      eng: string;
      est: string;
      rus: string;
      nor: string;
    };
  }[];
}) => {
  //Check for language
  const { search } = useLocation();
  const lang: string = new URLSearchParams(search).get("lang")!;

  return (
    <div className="mt-10 w-full flex flex-col items-start md:items-center lg:items-start justify-start">
      <p className="text-lg font-semibold text-gray-900">
        {title[lang === "en" ? "eng" : lang]}
      </p>
      <ul className="mt-3 space-y-3">
        {listItems.map((item, i) => (
          <li
            key={i}
            className="flex justify-start md:justify-center lg:justify-start items-center gap-x-2 capitalize"
          >
            <ChevronRight size={14} />
            {item.content[lang === "en" ? "eng" : lang]}
          </li>
        ))}
      </ul>
    </div>
  );
};

//Main product route
const ProductRoute = () => {
  //Product data
  const productData = useLoaderData<{
    _id: string;
    title: string;
    quickDesc: string;
    fullDesc: string;
    isDiscount: boolean;
    price: number;
    newPrice: number;
    isPopular: boolean;
    imagesFolder: string;
    carouselImagesPaths: string[];
    featuresList: string;
  }>();

  //Parse features list
  const featuresList: {
    title: {
      eng: string;
      est: string;
      rus: string;
      nor: string;
    };
    listItems: {
      content: {
        eng: string;
        est: string;
        rus: string;
        nor: string;
      };
    }[];
  }[] = JSON.parse(productData.featuresList);

  console.log(productData);

  return (
    <>
      <HomeLayout>
        <section>
          <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8 z-0">
            {/* Header section */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-x-10">
              {/* Visual (Image and carousel) */}
              <div>
                <ProjectSlider imagePaths={productData.carouselImagesPaths} />
              </div>

              {/* Text data */}
              <div className="mt-10 md:mt-0 flex flex-col items-start justify-start">
                {/* Breadcrumbs navigation */}
                <ProjectBreadcrumbs projectTitle={productData.title} />

                {/* Title */}
                <h2 className="text-2xl font-semibold text-gray-900 sm:text-3xl text-center mt-10">
                  {productData.title}
                </h2>

                {/* Badges (For now - Popular and Discount) */}
                <div className="w-full flex justify-start items-center gap-2 mt-3">
                  {/* Popular */}
                  {productData.isPopular && (
                    <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-sm whitespace-nowrap text-purple-700 flex justify-start items-center gap-x-1">
                      <Star size={12} /> Popular
                    </span>
                  )}

                  {/* Discount */}
                  {productData.isDiscount && (
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-emerald-700 flex justify-start items-center gap-x-1">
                      <HandCoins size={12} /> Discount
                    </span>
                  )}
                </div>

                {/* Price */}
                <p className="text-gray-700 mt-4">
                  {productData.price}$
                  {productData.isDiscount && (
                    <span className="text-gray-400 line-through ml-2">
                      {productData.newPrice}$
                    </span>
                  )}
                </p>

                {/* Description */}
                <ProductDescriptionPar innerContent={productData.fullDesc} />
              </div>
            </div>

            {/* List with features house provide */}
            {(featuresList.length && (
              <div className="w-full h-auto mt-10">
                {/* Divider */}
                <span className="flex items-center">
                  <span className="h-px flex-1 bg-gray-300"></span>

                  <span className="shrink-0 px-4 text-gray-900">Features</span>

                  <span className="h-px flex-1 bg-gray-300"></span>
                </span>

                {/* Replace with actual data in future */}
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  {featuresList.map((item, i) => (
                    <ProductFeaturesList
                      key={i}
                      title={item.title}
                      listItems={item.listItems}
                    />
                  ))}
                </div>
              </div>
            )) ||
              null}
          </div>
        </section>
      </HomeLayout>
      <LightBox />
    </>
  );
};

export default ProductRoute;
