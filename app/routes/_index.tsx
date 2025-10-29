import {
  LoaderFunction,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import { useLoaderData, useFetcher } from "@remix-run/react";
import { useEffect, useCallback } from "react";
import fs from "fs/promises";
import path from "path";

import {
  Header,
  Projects,
  QuickStats,
  Technology,
  Gallery,
  Contacts,
  ScrollToElement,
  LightBox,
} from "~/components/client";

import useClientProjectsStore from "~/stores/ClientProjectsStore";
import useTechnologyActiveLinkStore from "~/stores/TechnologyActiveLinkStore";

import HomeLayout from "~/layouts/HomeLayout";
import { connectToDB } from "~/utils/db";
import technologyModel from "~/models/Technology";
import galleryModel from "~/models/Gallery";
import memberModel from "~/models/Member";
import mongoose from "mongoose";

export const loader: LoaderFunction = async ({
  request,
}: LoaderFunctionArgs) => {
  //Check for search query params
  const url = new URL(request.url);

  //Referer
  const referer = request.headers?.get("referer");

  //Language
  const lang = url.searchParams.get("lang");

  //Projects-related params
  //Paggination param
  const projectsPage = url.searchParams.get("projectsPage");

  //Tech-related params
  const techPage = url.searchParams.get("techPage");

  //Gallery-related params
  const galleryPage = url.searchParams.get("galleryPage");

  //Check for search query (If they exists) and build them if they not
  //This used for initial request to "/" route when all params may not be provided
  if (!projectsPage || !techPage || !galleryPage || !lang) {
    if (!lang) url.searchParams.set("lang", "en");
    if (!projectsPage) url.searchParams.set("projectsPage", "1");

    //Get id of a first article
    if (!techPage) {
      try {
        await connectToDB();

        const initialTechnologyArticleId = await technologyModel
          .findOne({}, { _id: 1 })
          .sort({ createdAt: -1, _id: 1 })
          .lean();

        if (initialTechnologyArticleId) {
          const newestArticleId = initialTechnologyArticleId._id.toString();

          if (newestArticleId) {
            url.searchParams.set("techPage", newestArticleId);
          } else {
            throw new Error();
          }
        } else {
          throw new Error();
        }
      } catch (error) {
        //Set url of techPage as none (Means no tech related articles were found)
        url.searchParams.set("techPage", "none");
      }
    }

    //Get id of first gallery
    if (!galleryPage) {
      try {
        await connectToDB();

        const initialGalleryId = await galleryModel
          .findOne({}, { _id: 1 })
          .sort({ createdAt: -1, _id: 1 })
          .lean();

        if (initialGalleryId) {
          const newestGalleryId = initialGalleryId._id.toString();

          if (newestGalleryId) {
            url.searchParams.set("galleryPage", newestGalleryId);
          } else {
            throw new Error();
          }
        } else {
          throw new Error();
        }
      } catch (error) {
        //Set url of galleryPage as none (Means no gallery related articles were found)
        url.searchParams.set("galleryPage", "none");
      }
    }

    //Redirect to URL with search params
    return redirect(url.toString());
  }

  //Request "/api/" routes for data
  try {
    //Array of requests to API
    const apiRequests = [];

    //If referer includes /products/ - User went from single product page to / page back
    //So revalidation is not needed (Implement this feature later)
    // if (!referer?.includes("/products/")) {
    //   //Build /api/projects url path
    //   const apiProjectsUrl = new URL("/api/projects", url);
    //   const projectsRequestFunction = fetch(
    //     `${apiProjectsUrl}?${url.searchParams.toString()}`
    //   );

    //   //Add function to api requests array
    //   apiRequests.push(projectsRequestFunction);
    // } else {
    //   apiRequests.push(null);
    // }

    //Build /api/projects url path
    const apiProjectsUrl = new URL("/api/projects", url);
    const projectsRequestFunction = fetch(
      `${apiProjectsUrl}?${url.searchParams.toString()}`
    );

    //Add function to api requests array
    apiRequests.push(projectsRequestFunction);

    //Make requests for data (For now working only with projects)
    const [projects] = await Promise.all(apiRequests);

    //Parse responses to JSON
    const projectsParsed = projects ? await projects.json() : null;

    //Get tech article by techPage url param (Id is stored there if not "none" (No articles exist at all))
    let techArticle;
    if (techPage && techPage !== "none") {
      try {
        await connectToDB();
        const techArticleById = await technologyModel
          .findOne(
            {
              _id: new mongoose.Types.ObjectId(techPage),
            },
            { createdAt: 0 }
          )
          .lean();

        if (techArticleById) {
          techArticle = techArticleById;
        }
      } catch (error) {
        techArticle = null;
      }
    }

    //Get titles of all tech articles (For navigation between them)
    let techArticlesTitles;
    if (techPage && techPage !== "none") {
      try {
        await connectToDB();
        const techArticlesTitlesFromDB = await technologyModel
          .find({}, { _id: 1, title: 1 })
          .sort({ createdAt: -1, _id: 1 })
          .lean();
        if (techArticlesTitlesFromDB.length > 0) {
          techArticlesTitles = techArticlesTitlesFromDB;
        }
      } catch (error) {
        techArticlesTitles = null;
      }
    }

    //Get titles of all Galleries (For navigation between them)
    let galleriesTitles;
    if (galleryPage && galleryPage !== "none") {
      try {
        await connectToDB();

        //Get titles for navigation
        const galleriesTitlesFromDB = await galleryModel
          .find({}, { _id: 1, title: 1 })
          .sort({ createdAt: -1, _id: 1 })
          .lean();
        if (galleriesTitlesFromDB.length > 0) {
          galleriesTitles = galleriesTitlesFromDB;
        }
      } catch (error) {
        galleriesTitles = null;
      }
    }

    //Get files from current gallery
    let galleryFiles;
    if (galleryPage && galleryPage !== "none") {
      try {
        await connectToDB();

        const pathToGallery = path.join(
          process.cwd(),
          "public",
          "gallery",
          galleryPage
        );
        const filesFromGallery = await fs.readdir(pathToGallery, {
          recursive: true,
        });
        const filesForClient = filesFromGallery.map(
          (item) => `/gallery/${galleryPage}/${item}`
        );
        galleryFiles = filesForClient;
      } catch (error) {
        galleryFiles = null;
      }
    }

    //Get team members data (Contacts)
    let teamMembers;
    try {
      await connectToDB();
      const members = await memberModel.find({}, { __v: 0 }).lean();
      if (members && members.length) {
        teamMembers = members.map((item) => ({
          ...item,
          _id: item._id.toString(),
        }));
      }
    } catch (error) {
      teamMembers = error;
    }

    //Return data to client
    return json({
      projects: projectsParsed.projects,
      hasMoreProjects: projectsParsed.hasMoreProjects,
      techArticle,
      techArticlesTitles,
      galleriesTitles,
      galleryFiles,
      teamMembers,
    });
  } catch (error) {
    return json({ success: false, msg: "Error during request" });
  }
};

const IndexRoute = () => {
  //Loader data
  const {
    projects,
    hasMoreProjects,
    techArticle,
    techArticlesTitles,
    galleryFiles,
    galleriesTitles,
    teamMembers,
  } = useLoaderData<{
    //Projects data
    projects: {
      _id: string;
      title: string;
      quickDesc: string;
      fullDesc: string;
      isDiscount: boolean;
      price: number;
      newPrice: number;
      isPopular: boolean;
      imagesFolder: string;
      featuresList: string;
    }[];
    hasMoreProjects: boolean;
    techArticle: {
      _id: string;
      title: string;
      content: string;
    };
    techArticlesTitles: {
      _id: string;
      title: string;
    }[];
    galleriesTitles: {
      _id: string;
      title: string;
    }[];
    galleryFiles: string[];
    teamMembers: {
      name: string;
      tel: string;
      email: string;
      position: string;
      languages: string;
      _id: string;
    }[];
  }>();

  //Fetcher
  const fetcher = useFetcher<typeof loader>();

  //Projects Store
  const setFetchNextPageProjects = useClientProjectsStore(
    (state) => state.setFetchNextPageProjects
  );
  const setFetcherState = useClientProjectsStore(
    (state) => state.setFetcherState
  );
  const setHasMore = useClientProjectsStore((state) => state.setHasMore);
  const storedProjects = useClientProjectsStore((state) => state.projects);
  const setProjects = useClientProjectsStore((state) => state.setProjects);

  //Tech active link store (Update UI so user will see which Technology Article is on the screen now)
  const setActiveLink = useTechnologyActiveLinkStore(
    (state) => state.setActiveLink
  );

  //Function to request for projects from next page
  const getNextPageProjects = useCallback(() => {
    //Get search params
    const url = new URL(window.location.href);
    const currentPage = url.searchParams.get("projectsPage");

    //Calculate next page
    const nextPage = +currentPage! + 1;

    //Clone other search params
    const params = url.searchParams;
    params.set("projectsPage", String(nextPage));

    //Fetch for projects from next page
    const requestUrl = `/api/projects/?${params.toString()}`;

    //Request for data
    fetcher.load(requestUrl);
  }, [fetcher]);

  //Handle new fetcher data
  useEffect(() => {
    //Track has more projects
    if (fetcher.data?.projects) {
      setHasMore(fetcher.data.hasMoreProjects);
    }

    //Track projects
    if (fetcher.data?.projects && fetcher.data?.projects.length) {
      //Change url search params
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set(
        "projectsPage",
        String(+newUrl.searchParams.get("projectsPage")! + 1)
      );

      //Possible source of bugs (Because URL is being updated only after server response)
      window.history.replaceState({}, "", newUrl.toString());

      //Add data to accumulated projects array
      setProjects([...storedProjects, ...fetcher.data.projects]);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher.data]);

  //Inject function into Projects Store
  useEffect(() => {
    setFetchNextPageProjects(getNextPageProjects);
  }, [getNextPageProjects, setFetchNextPageProjects]);

  //Track fetcher state
  useEffect(() => {
    setFetcherState(fetcher.state);
  }, [fetcher.state, setFetcherState]);

  //Set initial has more projects flag and tech article active link
  useEffect(() => {
    //Set initial projects
    if (storedProjects === undefined) {
      setProjects(projects);
    }

    //If there are already any projects in store - do not set them there from loader
    // if (storedProjects !== undefined && !storedProjects.length) {
    //   console.log("ALREADY");
    //   setProjects(projects);
    // }

    //Check if hasMoreProjects != null to prevent load more button disabling once user navigated from /products/ page
    if (hasMoreProjects !== null && hasMoreProjects !== undefined) {
      setHasMore(hasMoreProjects);
    }

    //Set tech article active link
    setActiveLink(techArticle._id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <HomeLayout>
      <Header />
      <Projects projects={projects} />
      <QuickStats />
      <Technology
        techArticlesTitles={techArticlesTitles}
        techArticleContent={techArticle}
      />
      <Gallery titles={galleriesTitles} currentGalleryFiles={galleryFiles} />
      <Contacts members={teamMembers} />
      <ScrollToElement />
      <LightBox />
    </HomeLayout>
  );
};

export default IndexRoute;
