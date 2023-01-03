import{createCurrentUserHook,
       createClient,
    }from "next-sanity";
import imageUrlBuilder from '@sanity/image-url';

export const config = {
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    apiVersion:"2021-03-25",
    useCdn: process.env.NODE_ENV==="production",
};

//set up the client for fetching data in the getProps page function
export const sanityClient = createClient(config);

/** Set up a helper fucntion for generating
 * image urls with only the assest reference data in your documents
 * read more about it at : https://www.sanity.io/docs/image-url
 */

const builder = imageUrlBuilder(config)

export function urlFor(source) {
  return builder.image(source)
}

/**
 * Here the source that we recieve from
 * query is passed through the urlFor
 * fucntion as an argument which then 
 * passes the fucntion to createImageUrlBuilder that takes the 
 * configuration variables that are defined in the .env.local file and 
 * then the source is passed through an image function that renders
 * an image
 */

//Helper fucntion for using the current logged in user account
// export const useCurrentUser = createCurrentUserHook({config});