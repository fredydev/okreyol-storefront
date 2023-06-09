import {json} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import {
  Image,
  Pagination__unstable as Pagination,
  getPaginationVariables__unstable as getPaginationVariables,
} from '@shopify/hydrogen';

import {Grid, Heading, PageHeader, Section, Link, Button} from '~/components';
import {getImageLoadingPriority} from '~/lib/const';
import {seoPayload} from '~/lib/seo.server';
import {CACHE_SHORT, routeHeaders} from '~/data/cache';
import { useState } from 'react';

const PAGINATION_SIZE = 4;

export const headers = routeHeaders;

export const loader = async ({request, context: {storefront}}) => {
  const variables = getPaginationVariables(request, {pageBy: PAGINATION_SIZE});
  const {collections} = await storefront.query(COLLECTIONS_QUERY, {
    variables: {
      ...variables,
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
  });

  const seo = seoPayload.listCollections({
    collections,
    url: request.url,
  });

  return json(
    {collections, seo},
    {
      headers: {
        'Cache-Control': CACHE_SHORT,
      },
    },
  );
};

export default function Collections() {
  const {collections} = useLoaderData();
  const items = collections.length&&collections.nodes.filter((item) => item.image).length
  console.log(items)
  return (
    <>
      <PageHeader heading="Collections" />
      <Section padding='x'>
        <Pagination connection={collections}>
          {({nodes, isLoading, PreviousLink, NextLink}) => (
            <>
              <div className="flex items-center justify-center mt-6">
                <PreviousLink className="inline-block font-medium text-center py-3 px-6 border border-primary/10 bg-contrast text-primary w-fit">
                  {isLoading ? 'Loading...' : 'Précédent'}
                </PreviousLink>
              </div>
              <Grid
                items={items}
                data-test="collection-grid"
              >
                {nodes.map((collection, i) => (
                  <CollectionCard
                    collection={collection}
                    key={collection.id}
                    loading={getImageLoadingPriority(i, 2)}
                  />
                ))}
              </Grid>
              <div className="flex items-center justify-center my-6">
                <NextLink className="inline-block font-medium text-center   bg-contrast text-primary w-fit">
                  <Button>
                    {isLoading ? 'Loading...' : 'Suivant'}
                  </Button>
                  
                </NextLink>
              </div>
            </> 
          )}
        </Pagination>
      </Section>
    </>
  );
}

function CollectionCard({collection, loading}) {
  const [hovered, setHovered] = useState(null);
  return (
    <Link  key={collection.id} to={`/collections/${collection.handle}`} onMouseEnter={() => setHovered(collection.id)} onMouseLeave={() => setHovered(null)}>
              <div className="grid gap-4 overflow-hidden relative border ">
                <div className=" overflow-hidden aspect-[2/2] flex justify-center">
                  {collection?.image && (<img
                    src={collection?.image.url}
                    alt="Image"
                    className="max-w-lg max-h-auto object-cover transform transition-transform duration-200 hover:scale-105 aspect-[2/2]"
                  />)}
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-primary/80 dark:bg-contrast/60 text-contrast dark:text-primary shadow-darkHeader py-4 px-4 font-bold text-xs">
                  {collection.title}
                  <span   className={`ml-2 inline-block transform-gpu transition-transform duration-300 ${
                      hovered===collection.id ? 'scale-x-150' : 'scale-x-100'
                    }`}>
                    →
                  </span>
                </div>
              </div>
            </Link>
  );
}

const COLLECTIONS_QUERY = `#graphql
  query Collections(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collections(first: $first, last: $last, before: $startCursor, after: $endCursor) {
      nodes {
        id
        title
        description
        handle
        seo {
          description
          title
        }
        image {
          id
          url
          width
          height
          altText
        }
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
`;
