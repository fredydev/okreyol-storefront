import {json} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import invariant from 'tiny-invariant';
import {
  Pagination__unstable as Pagination,
  getPaginationVariables__unstable as getPaginationVariables,
} from '@shopify/hydrogen';

import {PageHeader, Section, ProductCard, Grid, Button} from '~/components';
import {PRODUCT_CARD_FRAGMENT} from '~/data/fragments';
import {getImageLoadingPriority} from '~/lib/const';
import {seoPayload} from '~/lib/seo.server';
import {routeHeaders, CACHE_SHORT} from '~/data/cache';

const PAGE_BY = 8;

export const headers = routeHeaders;

export async function loader({request, context: {storefront}}) {
  const variables = getPaginationVariables(request, {pageBy: PAGE_BY});

  const data = await storefront.query(ALL_PRODUCTS_QUERY, {
    variables: {
      ...variables,
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
  });

  invariant(data, 'No data returned from Shopify API');

  const seoCollection = {
    id: 'all-products',
    title: 'All Products',
    handle: 'products',
    descriptionHtml: 'All the store products',
    description: 'All the store products',
    seo: {
      title: 'All Products',
      description: 'All the store products',
    },
    metafields: [],
    products: data.products,
    updatedAt: '',
  };

  const seo = seoPayload.collection({
    collection: seoCollection,
    url: request.url,
  });

  return json(
    {
      products: data.products,
      seo,
    },
    {
      headers: {
        'Cache-Control': CACHE_SHORT,
      },
    },
  );
}

export default function AllProducts() {
  const {products} = useLoaderData();

  return (
    <>
      <PageHeader heading="Tous nos articles en bois"  />
      <Section padding='x'>
        <Pagination connection={products}>
          {({nodes, isLoading, NextLink, PreviousLink}) => {
            const itemsMarkup = nodes.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                loading={getImageLoadingPriority(i)}
              />
            ));

            return (
              <>
                <div className="flex items-center justify-center my-6">
                  <PreviousLink className="inline-block  font-medium text-center  border-primary/10 bg-contrast text-primary w-fit">
                    <Button>
                      {isLoading ? 'Loading...' : 'Précédent'}
                    </Button>
                    
                  </PreviousLink>
                </div>
                <Grid data-test="product-grid">{itemsMarkup}</Grid>
                <div className="flex items-center justify-center my-6">
                  <NextLink className="inline-block  font-medium text-center  border-primary/10 bg-contrast text-primary w-fit">
                    <Button>
                      {isLoading ? 'Loading...' : 'Suivant'}
                    </Button>
                    
                  </NextLink>
                </div>
              </>
            );
          }}
        </Pagination>
      </Section>
    </>
  );
}

const ALL_PRODUCTS_QUERY = `#graphql
  query AllProducts(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    products(first: $first, last: $last, before: $startCursor, after: $endCursor) {
      nodes {
        ...ProductCard
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
`;
