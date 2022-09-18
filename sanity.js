import imageUrlBuilder from '@sanity/image-url'
import sanityClient  from '@sanity/client'
import {
    createCurrentUserHook,
    createClient
} from "next-sanity";

export const configClient = {
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "23z0n4lu",
  apiVersion: "2022-07-20",
  useCdn: false//process.env.NODE_ENV === "production"
}

export const configServer = {
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "23z0n4lu",
  apiVersion: "2022-07-20",
  useCdn: false,//process.env.NODE_ENV === "production",
  token: process.env.SANITY_API_TOKEN
}

export const client = createClient(configClient); // Make Fetch Query to Sanity CMS
export const server = sanityClient(configServer); // Make Fetch Query to Sanity CMS
export const urlFor = (source) => imageUrlBuilder(configClient).image(source); // Extract Image Url
export const useCurrentUser = createCurrentUserHook(configClient); // Use Current LoggedIn User 