import {defer} from '@shopify/remix-oxygen';
import { useLoaderData} from '@remix-run/react';
import {AnalyticsPageType} from '@shopify/hydrogen';

import {seoPayload} from '~/lib/seo.server';
import {routeHeaders, CACHE_SHORT} from '~/data/cache';

export const headers = routeHeaders;

export async function loader({params, context}) {
  // const {language, country} = context.storefront.i18n;

  // if (
  //   params.locale &&
  //   params.locale.toLowerCase() !== `${language}-${country}`.toLowerCase()
  // ) {
  //   // If the locale URL param is defined, yet we still are on `EN-US`
  //   // the the locale param must be invalid, send to the 404 page
  //   throw new Response(null, {status: 404});
  // }
  // const {shop} = await context.storefront.query(HOMEPAGE_SEO_QUERY, {
  //   variables: {handle: 'meilleures-ventes'},
  // });

  // const seo = seoPayload.thanks();

  return defer(
    {
      shop: "FREDY",
      
      // analytics: {
      //   pageType: AnalyticsPageType.home,
      // },
      // seo,
    },
    {
      headers: {
        'Cache-Control': CACHE_SHORT,
      },
    },
  );
}


export default function Thanks() {
  const {
    shop
  } = useLoaderData();
  // TODO: skeletons vs placeholders

  return (
    <>
      <div>
        {shop}
      </div>
     
</>
  );
}



const HOMEPAGE_SEO_QUERY = `#graphql
  query seoCollectionContent($handle: String, $country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language,) {
    shop {
      name
      description
    }
  }
`;

