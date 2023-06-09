import {
  Await,
  Form,
  Outlet,
  useLoaderData,
  useMatches,
  useOutlet,
} from '@remix-run/react';
import {Suspense, useState} from 'react';
import {json, defer, redirect} from '@shopify/remix-oxygen';
import {flattenConnection} from '@shopify/hydrogen';

import {
  Button,
  OrderCard,
  PageHeader,
  Text,
  AccountDetails,
  AccountAddressBook,
  Modal,
  ProductSwimlane,
  Section,
} from '~/components';
import {FeaturedCollections} from '~/components/FeaturedCollections';
import {usePrefixPathWithLocale} from '~/lib/utils';
import {CACHE_NONE, routeHeaders} from '~/data/cache';

import {getFeaturedData} from './($locale).featured-products';
import {doLogout} from './($locale).account.logout';

export const headers = routeHeaders;

export async function loader({request, context, params}) {
  const {pathname} = new URL(request.url);
  const locale = params.locale;
  const customerAccessToken = await context.session.get('customerAccessToken');
  const isAuthenticated = Boolean(customerAccessToken);
  const loginPath = locale ? `/${locale}/account/login` : '/account/login';
  const isAccountPage = /^\/account\/?$/.test(pathname);

  if (!isAuthenticated) {
    if (isAccountPage) {
      return redirect(loginPath);
    }
    // pass through to public routes
    return json({isAuthenticated: false});
  }

  const customer = await getCustomer(context, customerAccessToken);

  const heading = customer
    ? customer.firstName
      ? `Bienvenu, ${customer.firstName}.`
      : `Bienvenu sur votre compte.`
    : 'Account Details';

  const orders = flattenConnection(customer.orders);

  return defer(
    {
      isAuthenticated,
      customer,
      heading,
      orders,
      addresses: flattenConnection(customer.addresses),
      featuredData: getFeaturedData(context.storefront),
    },
    {
      headers: {
        'Cache-Control': CACHE_NONE,
      },
    },
  );
}

export default function Authenticated() {
  const data = useLoaderData();
  const outlet = useOutlet();
  const matches = useMatches();

  // routes that export handle { renderInModal: true }
  const renderOutletInModal = matches.some((match) => {
    return match?.handle?.renderInModal;
  });

  // Public routes
  if (!data.isAuthenticated) {
    return <Outlet />;
  }

  // Authenticated routes
  if (outlet) {
    if (renderOutletInModal) {
      return (
        <>
          <Modal cancelLink="/account">
            <Outlet context={{customer: data.customer}} />
          </Modal>
          <Account {...data} />
        </>
      );
    } else {
      return <Outlet context={{customer: data.customer}} />;
    }
  }

  return <Account {...data} />;
}

function Account({customer, orders, heading, addresses, featuredData}) {
  const [activeMenuItem, setActiveMenuItem] = useState('my-info');

  const handleMenuItemClick = (menuItem) => {
    setActiveMenuItem(menuItem);
  };
  return (
    <>
      <PageHeader heading={heading}>
        
      </PageHeader>
      <Section className={""}>
        
          
        
      <div className="flex flex-col md:flex-row ">
        <aside className="w-48 md:w-1/5 ">
          <nav className='bg-gray-100'>
            <ul className="py-4">
              <li
                className={`px-4 py-2 cursor-pointer ${
                  activeMenuItem === 'my-info' ? 'bg-corange text-white' : ''
                }`}
                onClick={() => handleMenuItemClick('my-info')}
              >
                Mes informations
              </li>
              <li
                className={`px-4 py-2 cursor-pointer ${
                  activeMenuItem === 'my-orders' ? 'bg-corange text-white' : ''
                }`}
                onClick={() => handleMenuItemClick('my-orders')}
              >
                Mes commandes
              </li>
              <li
                className={`px-4 py-2 cursor-pointer ${
                  activeMenuItem === 'address-book' ? 'bg-corange text-white' : ''
                }`}
                onClick={() => handleMenuItemClick('address-book')}
              >
                Mes adresses
              </li>
              <Form method="post" action={usePrefixPathWithLocale('/account/logout')}>
          <button type="submit" className="text-red-500 font-normal px-4 py-2 cursor-pointer border  border-red-500 ml-4 my-4">
            Sign out
          </button>
        </Form>
            </ul>
          </nav>
        </aside>
        <div className="flex-1 py-4 md:py-0 md:px-4">
          {activeMenuItem === 'my-info' && <AccountDetails customer={customer} />}
          {activeMenuItem === 'my-orders' && orders && <AccountOrderHistory orders={orders} />}
          {activeMenuItem === 'address-book' && <AccountAddressBook addresses={addresses} customer={customer} />}
        {/* Contenu de chaque section */}
      </div>
      </div>
        {}
        
        
        
      </Section>
      
      {!orders.length && (
          <Suspense>
            <Await
              resolve={featuredData}
              errorElement="There was a problem loading featured products."
            >
              {(data) => (
                <>
                  <FeaturedCollections
                    title="Popular Collections"
                    collections={data.featuredCollections}
                  />
                  <ProductSwimlane products={data.featuredProducts} />
                </>
              )}
            </Await>
          </Suspense>
        )}
    </>
  );
}

function AccountOrderHistory({orders}) {
  return (
    <div className="m">
      <div className="grid w-full gap-4  pb-6 md:gap-8 md:pb-8 lg:pb-12">
        <h2 className="font-bold text-lead">Order History</h2>
        {orders?.length ? <Orders orders={orders} /> : <EmptyOrders />}
      </div>
    </div>
  );
}

function EmptyOrders() {
  return (
    <div>
      <Text className="mb-1" size="fine" width="narrow" as="p">
        You haven&apos;t placed any orders yet.
      </Text>
      <div className="w-48">
        <Button
          className="w-full mt-2 text-sm"
          variant="secondary"
          to={usePrefixPathWithLocale('/')}
        >
          Start Shopping
        </Button>
      </div>
    </div>
  );
}

function Orders({orders}) {
  return (
    <ul className="grid grid-flow-row grid-cols-1 gap-2 gap-y-6 md:gap-4 lg:gap-6 false sm:grid-cols-3">
      {orders.map((order) => (
        <OrderCard order={order} key={order.id} />
      ))}
    </ul>
  );
}

const CUSTOMER_QUERY = `#graphql
  query CustomerDetails(
    $customerAccessToken: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    customer(customerAccessToken: $customerAccessToken) {
      firstName
      lastName
      phone
      email
      defaultAddress {
        id
        formatted
        firstName
        lastName
        company
        address1
        address2
        country
        province
        city
        zip
        phone
      }
      addresses(first: 6) {
        edges {
          node {
            id
            formatted
            firstName
            lastName
            company
            address1
            address2
            country
            province
            city
            zip
            phone
          }
        }
      }
      orders(first: 250, sortKey: PROCESSED_AT, reverse: true) {
        edges {
          node {
            id
            orderNumber
            processedAt
            financialStatus
            fulfillmentStatus
            currentTotalPrice {
              amount
              currencyCode
            }
            lineItems(first: 2) {
              edges {
                node {
                  variant {
                    image {
                      url
                      altText
                      height
                      width
                    }
                  }
                  title
                }
              }
            }
          }
        }
      }
    }
  }
`;

export async function getCustomer(context, customerAccessToken) {
  const {storefront} = context;

  const data = await storefront.query(CUSTOMER_QUERY, {
    variables: {
      customerAccessToken,
      country: context.storefront.i18n.country,
      language: context.storefront.i18n.language,
    },
  });

  /**
   * If the customer failed to load, we assume their access token is invalid.
   */
  if (!data || !data.customer) {
    throw await doLogout(context);
  }

  return data.customer;
}
