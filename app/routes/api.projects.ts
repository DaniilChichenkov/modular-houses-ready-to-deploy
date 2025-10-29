import { json, LoaderFunction, LoaderFunctionArgs } from "@remix-run/node";

import { connectToDB } from "~/utils/db";
import projectModel from "~/models/Project";

export const loader: LoaderFunction = async ({
  request,
}: LoaderFunctionArgs) => {
  //Check for search query params
  const url = new URL(request.url);

  //Projects-related params
  //Paggination param
  const projectsPage = url.searchParams.get("projectsPage");

  //Some filters param
  const roomsQtyMin = url.searchParams.get("projectsRoomsQtyMin");
  const roomsQtyMax = url.searchParams.get("projectsRoomsQtyMax");
  const areaMin = url.searchParams.get("projectsAreaMin");
  const areaMax = url.searchParams.get("projectsAreaMax");
  const projectsPriceMin = url.searchParams.get("projectsPriceMin");
  const projectsPriceMax = url.searchParams.get("projectsPriceMax");
  const floorsQtyMin = url.searchParams.get("projectsFloorsQtyMin");
  const floorsQtyMax = url.searchParams.get("projectsFloorsQtyMax");
  const searchString = url.searchParams.get("projectsSearch");

  //Preferences params (Just orderBy and reshuffle for now)
  const orderByPrice = url.searchParams.get("sortByPrice");
  const reshuffle = url.searchParams.get("reshuffle");

  try {
    connectToDB();

    //Request for data
    //Get projects (1 page consists of 6 projects)
    //Change to 6 (Set to 1 for dev purposes)
    const projectsPageSize = 1;

    //Calculate offset (Skip previous pages)
    const projectsToSkip = projectsPageSize * (+projectsPage! - 1);

    //Build a request to Database including search query params if they were provided
    const projectsFilter: Record<string, any> = {};

    //Filter projects by their title
    //Title starts with searchString
    if (searchString) {
      projectsFilter.title = { $regex: `^${searchString}`, $options: "i" };
    }

    //Filter by qty of rooms (roomsQty = numberOfRooms in the model)
    if (Number(roomsQtyMin) || Number(roomsQtyMax)) {
      projectsFilter.numberOfRooms = {};
      if (roomsQtyMin) projectsFilter.numberOfRooms.$gte = +roomsQtyMin;
      if (roomsQtyMax) projectsFilter.numberOfRooms.$lte = +roomsQtyMax;
    }

    //Filter by floors
    if (Number(floorsQtyMin) || Number(floorsQtyMax)) {
      projectsFilter.floors = {};

      if (floorsQtyMin) projectsFilter.floors.$gte = +floorsQtyMin;
      if (floorsQtyMax) projectsFilter.floors.$lte = +floorsQtyMax;
    }

    //Filter by area
    if (Number(areaMin) || Number(areaMax)) {
      projectsFilter.area = {};
      if (areaMin) projectsFilter.area.$gte = +areaMin;
      if (areaMax) projectsFilter.area.$lte = +areaMax;
    }

    //Filter by price
    if (Number(projectsPriceMin) || Number(projectsPriceMax)) {
      projectsFilter.price = {};
      if (projectsPriceMin) projectsFilter.price.$gte = +projectsPriceMin;
      if (projectsPriceMax) projectsFilter.price.$lte = +projectsPriceMax;
    }

    //Build sorting object (1 = ascending order, -1 = descending order)
    const projectsSort: Record<string, 1 | -1> = {};

    //Sort by price
    if (orderByPrice) {
      projectsSort.price = orderByPrice === "asc" ? 1 : -1;
    }

    if (reshuffle) {
      //Make a request
      const projects = await projectModel
        //Implement filters object
        .find(projectsFilter)
        //Implement sort object
        .sort(projectsSort)
        //Paggination implementation (+1 used to check if more projects could be pulled from db)
        .limit(projectsPageSize * Number(projectsPage) + 1)
        //Make it plain js object
        .lean()
        .exec();

      //Check if more projects could be fetched (So the load more button will not be disabled)
      const hasMoreProjects = projects.length > projectsPageSize;
      //Send qty of projects = projectsPageSize (Remove overqueried project)
      const projectsForClient = projects.slice(
        0,
        projectsPageSize * Number(projectsPage)
      );

      return json({
        projects: projectsForClient,
        hasMoreProjects,
      });
    } else {
      //Make a request
      const projects = await projectModel
        //Implement filters object
        .find(projectsFilter)
        //Implement sort object
        .sort(projectsSort)
        //Skip some projects (If not 0)
        .skip(projectsToSkip)
        //Paggination implementation (+1 used to check if more projects could be pulled from db)
        .limit(projectsPageSize + 1)
        //Make it plain js object
        .lean()
        .exec();

      //Check if more projects could be fetched (So the load more button will not be disabled)
      const hasMoreProjects = projects.length > projectsPageSize;
      //Send qty of projects = projectsPageSize (Remove overqueried project)
      const projectsForClient = projects.slice(0, projectsPageSize);

      return json({
        projects: projectsForClient,
        hasMoreProjects,
      });
    }
  } catch (error) {
    return json({
      success: false,
      error,
    });
  }
};
