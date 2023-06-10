import {useRef, Suspense, useMemo, useState} from 'react';
import {Disclosure, Listbox, RadioGroup, Tab} from '@headlessui/react';
import BreadCrumb from "../components/BreadCrumb"
import CustomerReviews from "../components/CustomerReviews"
import { StarIcon, ChevronDownIcon, ChevronRightIcon, ChevronUpIcon } from '@heroicons/react/20/solid'
import { HeartIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import {defer} from '@shopify/remix-oxygen';
import {getAllReviewsForProduct} from '../api/reviews'
import {FiClock, FiTruck} from "react-icons/fi"
import {GiPadlock} from "react-icons/gi"
import { useSpring, animated } from "react-spring";
import {
  useLoaderData,
  Await,
  useSearchParams,
  useLocation,
  useNavigation,
} from '@remix-run/react';
import {AnalyticsPageType, Money, ShopPayButton} from '@shopify/hydrogen';
import invariant from 'tiny-invariant';
import clsx from 'clsx';

import {
  Heading,
  IconCaret,
  IconCheck,
  IconClose,
  ProductGallery,
  ProductSwimlane,
  Section,
  Skeleton,
  Text,
  Link,
  AddToCartButton,
  Button,
} from '~/components';
import { truncateText} from '~/lib/utils';
import {seoPayload} from '~/lib/seo.server';
import {MEDIA_FRAGMENT, PRODUCT_CARD_FRAGMENT} from '~/data/fragments';
import {routeHeaders, CACHE_SHORT} from '~/data/cache';
import { type } from 'os';

export const headers = routeHeaders;

export async function loader({params, request, context}) {
  const {productHandle} = params;
  invariant(productHandle, 'Missing productHandle param, check route filename');

  const searchParams = new URL(request.url).searchParams;

  const selectedOptions = [];
  searchParams.forEach((value, name) => {
    selectedOptions.push({name, value});
  });

  const {shop, product} = await context.storefront.query(PRODUCT_QUERY, {
    variables: {
      handle: productHandle,
      selectedOptions,
      country: context.storefront.i18n.country,
      language: context.storefront.i18n.language,
    },
  });

  if (!product?.id) {
    throw new Response('product', {status: 404});
  }
  const shopifyProductId = product.id
  const shopifyPrefix = 'gid://shopify/Product/'
  const productId = shopifyProductId.split(shopifyPrefix)[1]
  const reviews = await getAllReviewsForProduct(productId)
  const recommended = getRecommendedProducts(context.storefront, product.id);
  const firstVariant = product.variants.nodes[0];
  const selectedVariant = product.selectedVariant ?? firstVariant;

  const productAnalytics = {
    productGid: product.id,
    variantGid: selectedVariant.id,
    name: product.title,
    variantName: selectedVariant.title,
    brand: product.vendor,
    price: selectedVariant.price.amount,
  };

  const seo = seoPayload.product({
    product,
    selectedVariant,
    url: request.url,
  });

  return defer(
    {
      reviews,
      product,
      shop,
      storeDomain: shop.primaryDomain.url,
      recommended,
      analytics: {
        pageType: AnalyticsPageType.product,
        resourceId: product.id,
        products: [productAnalytics],
        totalValue: parseFloat(selectedVariant.price.amount),
      },
      seo,
    },
    {
      headers: {
        'Cache-Control': CACHE_SHORT,
      },
    },
  );
}



const perks = [
  {
    id: 1,
    perkname: 'Livraison gratuite',
    perkdescription: 'Livraison gratuite',
    icone: <FiTruck />
  },

  {
    id: 3,
    perkname: 'Délai de livraison',
    perkdescription: 'Délai de livraison : 7 jours ouvrables',
    icone: <FiClock />
  },
  {
    id: 4,
    perkname: 'Paiement sécurisée',
    perkdescription: 'Paiement sécurisée',
    icone: <GiPadlock />
  }
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}
export default function Product() {
  const {product,shop, recommended, reviews} = useLoaderData();
  const {media, title, vendor, descriptionHtml, french_desc ,features, id, shortname} = product;
  const {shippingPolicy, refundPolicy} = shop;
  const urls = media.nodes.reduce((acc, curr) => {
    if (curr.previewImage && curr.previewImage.url) {
      acc.push(curr.previewImage.url);
    }
    return acc;
  }, []);
  console.log(product)
  let reviewTotalCount = reviews.length>0?reviews.length : 0
  let reviewAverage = reviewTotalCount ? reviews.reduce((acc, review) => acc+review.reviewRate,0)/reviewTotalCount : 0
  const [currentSearchParams] = useSearchParams();
  const {location} = useNavigation();

  /**
   * We update `searchParams` with in-flight request data from `location` (if available)
   * to create an optimistic UI, e.g. check the product option before the
   * request has completed.
   */
  const searchParams = useMemo(() => {
    return location
      ? new URLSearchParams(location.search)
      : currentSearchParams;
  }, [currentSearchParams, location]);

  const firstVariant = product.variants.nodes[0];

  /**
   * We're making an explicit choice here to display the product options
   * UI with a default variant, rather than wait for the user to select
   * options first. Developers are welcome to opt-out of this behavior.
   * By default, the first variant's options are used.
   */
  const searchParamsWithDefaults = useMemo(() => {
    const clonedParams = new URLSearchParams(searchParams);

    for (const {name, value} of firstVariant.selectedOptions) {
      if (!searchParams.has(name)) {
        clonedParams.set(name, value);
      }
    }

    return clonedParams;
  }, [searchParams, firstVariant.selectedOptions]);

  /**
   * Likewise, we're defaulting to the first variant for purposes
   * of add to cart if there is none returned from the loader.
   * A developer can opt out of this, too.
   */
  const selectedVariant = product.selectedVariant ?? firstVariant;
  return (
    <div className="bg-white ">
      <div className="mx-auto container px-6 md:px-8 lg:px-12 py-8 s ">
        <BreadCrumb product={product}/>
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
          {/* Image gallery */}
          <Tab.Group as="div" className="flex flex-col-reverse">
            {/* Image selector */}
            <div className="mx-auto mt-6  w-full max-w-2xl sm:block lg:max-w-none">
              <Tab.List className="grid grid-cols-4 gap-6">
                {urls.map((image) => (
                  <Tab
                    key={image}
                    className="relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-offset-4"
                  >
                    {({ selected }) => (
                      <>
                        <span className="sr-only">{image}</span>
                        <span className="absolute inset-0 overflow-hidden rounded-md">
                          <img src={image} alt={image} className="h-full w-full object-cover object-center" />
                        </span>
                        <span
                          className={classNames(
                            selected ? 'ring-corange' : 'ring-transparent',
                            'pointer-events-none absolute inset-0 rounded-md rin ring-o'
                          )}
                          aria-hidden="true"
                        />
                      </>
                    )}
                  </Tab>
                ))}
              </Tab.List>
            </div>

            <Tab.Panels className="aspect-h-1 aspect-w-1 w-full">
              {urls.map((image) => (
                <Tab.Panel key={image} className={"border border-gray-100"}>
                  <img
                    src={image}
                    alt={image}
                    className="h-full w-full object-cover object-center sm:rounded-lg"
                  />
                </Tab.Panel>
              ))}
            </Tab.Panels>
          </Tab.Group>
                {/* {documentToReactComponents(JSON.parse(features.value))} */}
          {/* Product info */}
          <div className="mt-10 sm:mt-16 lg:mt-0 border px-2 border-dashed">
          {vendor && (
                  <Text className={'opacity-50 font-medium text-sm'}>{vendor}</Text>
                )}
            <h1 className="text-3xl font-normal tracking-tight text-gray-900">{shortname ? shortname.value : title}</h1>
            
            <div className="mt-3">
              <h2 className="sr-only">Product information</h2>
              <div className="flex items-center mb-3">
                {[0, 1, 2, 3, 4].map((rating) => ( 
                  <StarIcon
                    key={rating}
                    className={classNames(
                      reviewAverage > rating ? 'text-yellow-400' : 'text-gray-300',
                      'flex-shrink-0 h-5 w-5'
                    )}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <p className="text-3xl tracking-tight text-gray-900">
                <Money
                  withoutTrailingZeros
                  data={selectedVariant?.price}
                  as="span"
                /> EUR
              </p>
            </div>
            <p className='my-2 text-[10px]'>Taxes incluses. <Link className='underline' to='/policies/shipping-policies'>Frais d'expédition</Link> calculés à l'étape de paiement. </p>

            <ProductForm selectedVariant={selectedVariant}  searchParamsWithDefaults={searchParamsWithDefaults}/>
            <div className='grid grid-cols-2 gap-2'>
              {perks.map(perk =>{
                console.log(selectedVariant?.price)
                if(Number(selectedVariant?.price.amount)<100&&perk.perkdescription.toLowerCase()==="livraison gratuite") return null
                return(
                  <div className="flex p-2 items-center bg-gray-100 gap-4 rounded-sm" key={perk.id}>
                    <span className='text-xl'>{perk.icone}</span>
                    <span className=' text-[8px] font-semibold'>{perk.perkdescription}</span>
                  </div>
                )
              })}
            </div>     
            <section aria-labelledby="details-heading" className="mt-12">
              <h2 id="details-heading" className="sr-only">
                Additional details
              </h2>

              <div className="divide-y divide-gray-200 border-t ">
                {features&&(
                  <Accordion  title={"Caractéristiques"} content={features.value} />
                )}
              </div>
              {shippingPolicy?.body && (
                  <Accordion
                    title="Expédition"
                    content={truncateText(shippingPolicy.body,"Frais d'Expédition")}
                    learnMore={`/policies/${shippingPolicy.handle}`}
                  />
                )}
                {refundPolicy?.body && (
                  <Accordion
                    title="Retour"
                    content={truncateText(refundPolicy.body, "Processus de Retour :")}
                    learnMore={`/policies/${refundPolicy.handle}`}
                  />
                )}
            </section>
          </div>
           
        </div>
        <div className="my-16">
          <Text className="sr-onl font-bold mt-4 ">Note de l'artisan </Text>

          <div
            className="mt-4 space-y-6 text-base text-gray-700"
            dangerouslySetInnerHTML={{ __html: french_desc? french_desc.value : descriptionHtml }}
          />
        </div>
        <div className="" id="reviews-section">
          <CustomerReviews reviews={reviews} productId={id} reviewAverage={reviewAverage} reviewTotalCount={reviewTotalCount}/>
        </div>
        
      </div>
      <Suspense fallback={<Skeleton className="h-32" />}>
        <Await
          errorElement="There was a problem loading related products"
          resolve={recommended}
        >
          {(products) => (
            <ProductSwimlane  title="Related Products" products={products} />
          )}
        </Await>
        </Suspense>
    </div>
  )
}
const variantNames = ["type","types", "taille","tailles", "couleur", "couleurs","poids", "dimension","dimensions","épaisseur"]
export function ProductForm({searchParamsWithDefaults, selectedVariant}) {
  const {product, analytics, storeDomain} = useLoaderData();

  
  const isOutOfStock = !selectedVariant?.availableForSale;

  const isOnSale =
    selectedVariant?.price?.amount &&
    selectedVariant?.compareAtPrice?.amount &&
    selectedVariant?.price?.amount < selectedVariant?.compareAtPrice?.amount;

  const productAnalytics = {
    ...analytics.products[0],
    quantity: 1,
  };
  console.log(product.options)

  return (
    <div className="grid gap-10 my-4">
      <div className="grid gap-4">
        <ProductOptions
          options={product.options}
          searchParamsWithDefaults={searchParamsWithDefaults}
        />
        {selectedVariant && (
          <div className="grid items-stretch gap-4">
            {isOutOfStock ? (
              <Button variant="secondary" disabled>
                <Text>Sold out</Text>
              </Button>
            ) : (
              <AddToCartButton
                lines={[
                  {
                    merchandiseId: selectedVariant.id,
                    quantity: 1,
                  },
                ]}
                variant="primary"
                data-test="add-to-cart"
                analytics={{
                  products: [productAnalytics],
                  totalValue: parseFloat(productAnalytics.price),
                }}
              >
                <Text
                  as="span"
                  className="flex items-center justify-center gap-2"
                >
                  <span>Add to Cart</span> <span>·</span>{' '}
                  <Money
                    withoutTrailingZeros
                    data={selectedVariant?.price}
                    as="span"
                  />
                  {isOnSale && (
                    <Money
                      withoutTrailingZeros
                      data={selectedVariant?.compareAtPrice+"yolo"}
                      as="span"
                      className="opacity-50 strike"
                    />
                  )}
                </Text>
              </AddToCartButton>
            )}
            {!isOutOfStock && (
              <ShopPayButton
              className=''
                width="100%"
                variantIds={[selectedVariant?.id]}
                storeDomain={storeDomain}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ProductOptions({options, searchParamsWithDefaults}) {
  const closeRef = useRef(null);
  return (
    <>
      {options
        .filter((option) => option.values.length > 1)
        .map((option) => (
          <div
            key={option.name}
            className="flex flex-col flex-wrap mb-4 gap-y-2 last:mb-0 "
          >
            {variantNames.includes(option.name.toLowerCase())&&<Heading as="legend" size="lead" className="min-w-[4rem]">
              {option.name}
            </Heading>}
            <div className="flex flex-wrap items-baseline gap-4">
              {/**
               * First, we render a bunch of <Link> elements for each option value.
               * When the user clicks one of these buttons, it will hit the loader
               * to get the new data.
               *
               * If there are more than 7 values, we render a dropdown.
               * Otherwise, we just render plain links.
               */}
              {option.values.length > 7 ? (
                <div className="relative w-full">
                  <Listbox>
                    {({open}) => (
                      <>
                        <Listbox.Button
                          ref={closeRef}
                          className={clsx(
                            'flex items-center justify-between w-full py-3 px-4 border border-primary',
                            open
                              ? 'rounded-b md:rounded-t md:rounded-b-none'
                              : 'rounded',
                          )}
                        >
                          <span>
                            {searchParamsWithDefaults.get(option.name)}
                          </span>
                          <IconCaret direction={open ? 'up' : 'down'} />
                        </Listbox.Button>
                        <Listbox.Options
                          className={clsx(
                            'border-primary bg-contrast absolute bottom-12 z-30 grid h-48 w-full overflow-y-scroll rounded-t border px-2 py-2 transition-[max-height] duration-150 sm:bottom-auto md:rounded-b md:rounded-t-none md:border-t-0 md:border-b',
                            open ? 'max-h-48' : 'max-h-0',
                          )}
                        >
                          {option.values.map((value) => (
                            <Listbox.Option
                              key={`option-${option.name}-${value}`}
                              value={value}
                            >
                              {({active}) => (
                                <ProductOptionLink
                                  optionName={option.name}
                                  optionValue={value}
                                  className={clsx(
                                    'text-primary w-full p-2 transition rounded flex justify-start items-center text-left cursor-pointer',
                                    active && 'bg-primary/10',
                                  )}
                                  searchParams={searchParamsWithDefaults}
                                  onClick={() => {
                                    if (!closeRef?.current) return;
                                    closeRef.current.click();
                                  }}
                                >
                                  {value}
                                  {searchParamsWithDefaults.get(option.name) ===
                                    value && (
                                    <span className="ml-2">
                                      <IconCheck />
                                    </span>
                                  )}
                                </ProductOptionLink>
                              )}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </>
                    )}
                  </Listbox>
                </div>
              ) : (
                <>
                  {option.values.map((value) => {
                    const checked =
                      searchParamsWithDefaults.get(option.name) === value;
                    const id = `option-${option.name}-${value}`;

                    return (
                      <Text key={id}>
                        <ProductOptionLink
                          optionName={option.name}
                          optionValue={value}
                          searchParams={searchParamsWithDefaults}
                          className={clsx(
                            'leading-none py-1 border-b-[1.5px] cursor-pointer transition-all duration-200',
                            checked ? 'border-primary/50' : 'border-primary/0',
                          )}
                        />
                      </Text>
                    );
                  })}
                </>
              )}
            </div>
          </div>
        ))}
    </>
  );
}

function ProductOptionLink({
  optionName,
  optionValue,
  searchParams,
  children,
  ...props
}) {
  const {pathname} = useLocation();
  const isLocalePathname = /\/[a-zA-Z]{2}-[a-zA-Z]{2}\//g.test(pathname);
  // fixes internalized pathname
  const path = isLocalePathname
    ? `/${pathname.split('/').slice(2).join('/')}`
    : pathname;

  const clonedSearchParams = new URLSearchParams(searchParams);
  clonedSearchParams.set(optionName, optionValue);

  return (
    <Link
      {...props}
      preventScrollReset
      prefetch="intent"
      replace
      to={`${path}?${clonedSearchParams.toString()}`}
    >
      {children ?? optionValue}
    </Link>
  );
}
function Accordion({learnMore,title, content}) {
  const [open, setOpen] = useState(false);
  //toggle accordion function
  let toggleHandler = (e) => {
    //switch state
    setOpen(!open);
  };

  const openAnimation = useSpring({
    from: { opacity: "0", maxHeight: "55px" },
    to: { opacity: "1", maxHeight: open ? "2000px" : "55px" },
    config: { duration: "500" }
  });

  //rotate animation
  const iconAnimation = useSpring({
    from: {
      transform: "rotate(0deg)",
    },
    to: {
      transform: open ? "rotate(180deg)" : "rotate(0deg)",
      color: "#000000"
    },
    config: { duration: "120" }
  });

  return (
    <animated.div className="w-full max-h-full  border-b border-gray-200 text-white overflow-hidden cursor-pointer scroll-auto" style={openAnimation}>
      <div className="flex justify-between py-[17px] px-[10px] items-center text-black " onClick={toggleHandler}>
        <h4 className='font-normal'>{title}</h4>
        <animated.i style={iconAnimation}>
        <ChevronDownIcon className={`h-5 w-5`} />
        </animated.i>
      </div>
      <div
        className="prose dark:prose-invert text-xs mt-1 p-3"
        dangerouslySetInnerHTML={{__html: content}}
      />    
      {learnMore && (
        <div className="p-3">
          <Link
            className="pb-px border-b border-primary/30 text-primary/50 font-normal italic hover:text-corange"
            to={learnMore}
          >
            Learn more
          </Link>
        </div>
      )}
    </animated.div>
  );
}
function ProductDetail({title, content, learnMore}) {
  const [open, setOpen] = useState(false);
  //toggle accordion function
  let toggleHandler = (e) => {
    //switch state
    setOpen(!open);
  };
  const openAnimation = useSpring({
    from: { opacity: "0", maxHeight: "25px" },
    to: { opacity: "1", maxHeight: open ? "200px" : "25px" },
    config: { duration: "300" }
  });
  
  //rotate animation
  const iconAnimation = useSpring({
    from: {
      transform: "rotate(0deg)",
      color: "#ffff"
    },
    to: {
      transform: open ? "rotate(180deg)" : "rotate(0deg)",
      color: open ? "#10d6f5" : "#fff"
    },
    config: { duration: "120" }
  });
  return (  
    <animated.div className="w-full max-h-full py-[17px] px-[10px] border-b border-gray-200 text-white overflow-hidden cursor-pointer" style={openAnimation}>
      <div className="flex justify-between items-center" onClick={toggleHandler}>
        <h4 className='text-black' >{title}</h4>
        <animated.i style={iconAnimation}>
        <ChevronRightIcon className={` h-5 w-5`} />
        </animated.i>
      </div>
      <div className="prose dark:prose-invert text-sm" dangerouslySetInnerHTML={{__html: content}}/>
    </animated.div>
    // <Disclosure >
    //     {({ open }) => (
    //       <>
    //         <Disclosure.Button className="flex items-center  justify-between w-full border-b border-gray-200  text-gray-700 transition-colors duration-300  px-4 rounded-md py-4">
    //           <span> {title}</span>
    //           <ChevronRightIcon className={`${open?"rotate-90 transform":""} h-5 w-5`} />
    //         </Disclosure.Button>
    //         <Disclosure.Panel
    //           className={`${
    //             open ? 'transition-max-height duration-700 ease-out' : 'hidden'
    //           } bg-gray-100 p-4 overflow-hidden`}
    //         >
    //           {typeof content === 'string' ? <div
    //             className="prose dark:prose-invert text-sm"
    //             dangerouslySetInnerHTML={{__html: content}}
    //           /> :<ul className=' p-2 list-disc '>
    //           {content.map((item) => (
    //             <li className='l   ' key={item.children[0].value}>{item.children[0].value}</li>
    //           ))}
    //         </ul>}
    //           {learnMore && (
    //           <div className="">
    //             <Link
    //               className="pb-px border-b border-primary/30 text-primary/50 font-normal italic hover:text-corange"
    //               to={learnMore}
    //             >
    //               Learn more
    //             </Link>
    //           </div> )}
    //         </Disclosure.Panel>
    //       </>
    //     )}
    //   </Disclosure>

      
    
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariantFragment on ProductVariant {
    id
    availableForSale
    selectedOptions {
      name
      value
    }
    image {
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    compareAtPrice {
      amount
      currencyCode
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
  }
`;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      id
      title
      vendor
      handle
      descriptionHtml
      description
      options {
        name
        values
      }
      features: metafield(namespace:"custom",key:"features") {
        value
      }
      french_desc: metafield(namespace:"custom",key:"description") {
        value
      }
      shortname: metafield(namespace:"descriptors",key:"subtitle") {
        value
      }
      reviewContent: metafield(namespace:"custom",key:"review_content") {
        value
      }
      collection: collections(first:1) {
        edges {
          node {
            handle
            title
          }
        }
      }
      selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions) {
        ...ProductVariantFragment
      }
      media(first: 7) {
        nodes {
          ...Media
        }
      }
      variants(first: 1) {
        nodes {
          ...ProductVariantFragment
        }
      }
      seo {
        description
        title
      }
    }
    shop {
      name
      primaryDomain {
        url
      }
      shippingPolicy {
        body
        handle
      }
      refundPolicy {
        body
        handle
      }
    }
  }
  ${MEDIA_FRAGMENT}
  ${PRODUCT_VARIANT_FRAGMENT}
`;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  query productRecommendations(
    $productId: ID!
    $count: Int
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    recommended: productRecommendations(productId: $productId) {
      ...ProductCard
    }
    additional: products(first: $count, sortKey: BEST_SELLING) {
      nodes {
        ...ProductCard
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
`;

async function getRecommendedProducts(storefront, productId) {
  const products = await storefront.query(RECOMMENDED_PRODUCTS_QUERY, {
    variables: {productId, count: 12},
  });

  invariant(products, 'No data returned from Shopify API');

  const mergedProducts = products.recommended
    .concat(products.additional.nodes)
    .filter(
      (value, index, array) =>
        array.findIndex((value2) => value2.id === value.id) === index,
    );

  const originalProduct = mergedProducts
    .map((item) => item.id)
    .indexOf(productId);

  mergedProducts.splice(originalProduct, 1);

  return mergedProducts;
}

const CUSTOMER_CREATE_REVIEW = `#graphql
  mutation productUpdate($input: ProductInput!) {
    productUpdate(input: $input) {
      product {
        
      }
      userErrors {
        
        field
        message
      }
    }
  }
`;
