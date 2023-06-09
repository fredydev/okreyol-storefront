import {json, redirect} from '@shopify/remix-oxygen';
import {Form, useActionData, useLoaderData} from '@remix-run/react';
import {useState} from 'react';

import {getInputStyleClasses} from '~/lib/utils';
import {Button, Heading, Link} from '~/components';

export const handle = {
  isPublic: true,
};

export async function loader({context, params}) {
  const customerAccessToken = await context.session.get('customerAccessToken');

  if (customerAccessToken) {
    return redirect(params.locale ? `${params.locale}/account` : '/account');
  }

  // TODO: Query for this?
  const {shop} = await context.storefront.query(SHOP_INFO_QUERY);

  return json({shopName: shop.name});
}

const badRequest = (data) => json(data, {status: 400});

export const action = async ({request, context, params}) => {
  const formData = await request.formData();
  console.log(formData)

  const email = formData.get('email');
  const password = formData.get('password');

  if (
    !email ||
    !password ||
    typeof email !== 'string' ||
    typeof password !== 'string'
  ) {
    return badRequest({
      formError: 'Please provide both an email and a password.',
    });
  }

  const {session, storefront} = context;

  try {
    const customerAccessToken = await doLogin(context, {email, password});
    session.set('customerAccessToken', customerAccessToken);

    return redirect(params.locale ? `/${params.locale}/account` : '/account', {
      headers: {
        'Set-Cookie': await session.commit(),
      },
    });
  } catch (error) {
    if (storefront.isApiError(error)) {
      return badRequest({
        formError: 'Something went wrong. Please try again later.',
      });
    }

    /**
     * The user did something wrong, but the raw error from the API is not super friendly.
     * Let's make one up.
     */
    return badRequest({
      formError:
        'Sorry. We did not recognize either your email or password. Please try to sign in again or create a new account.',
    });
  }
};

export const meta = () => {
  return [{title: 'Login'}];
};

export default function Login() {
  const {shopName} = useLoaderData();
  const actionData = useActionData();
  const [nativeEmailError, setNativeEmailError] = useState(null);
  const [nativePasswordError, setNativePasswordError] = useState(null);

  return (
    <div className="flex justify-center my-24 px-4 relative">
      <div className="max-w-md w-full border shadow-sm shadow-gray-300 bg-white px-4 py-8">
        <Heading size='dnfrd'>Connexion à votre compte</Heading>
        {/* TODO: Add onSubmit to validate _before_ submission with native? */}
        <Form
          method="post"
          noValidate
          className="pt-6 pb-8 mt-4 mb-4 space-y-3 "
        >
          {actionData?.formError && (
            <div className="flex items-center justify-center mb-6 bg-zinc-500">
              <p className="m-4 text-s text-contrast">{actionData.formError}</p>
            </div>
          )}
          <div>
            <input
              className={`mb-1 ${getInputStyleClasses(nativeEmailError)} rounded-none py-3 focus:outline-none focus:border-corange`}
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="Email address"
              aria-label="Email address"
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              onBlur={(event) => {
                setNativeEmailError(
                  event.currentTarget.value.length &&
                    !event.currentTarget.validity.valid
                    ? 'Invalid email address'
                    : null,
                );
              }}
            />
            {nativeEmailError && (
              <p className="text-red-500 text-xs">{nativeEmailError} &nbsp;</p>
            )}
          </div>

          <div>
            <input
              className={`mb-1 ${getInputStyleClasses(nativePasswordError)} rounded-none pt-3 focus:outline-none focus:border-corange`}
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Password"
              aria-label="Password"
              minLength={8}
              required
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              onBlur={(event) => {
                if (
                  event.currentTarget.validity.valid ||
                  !event.currentTarget.value.length
                ) {
                  setNativePasswordError(null);
                } else {
                  setNativePasswordError(
                    event.currentTarget.validity.valueMissing
                      ? 'Please enter a password'
                      : 'Passwords must be at least 8 characters',
                  );
                }
              }}
            />
            {nativePasswordError && (
              <p className="text-red-500 text-xs">
                {' '}
                {nativePasswordError} &nbsp;
              </p>
            )}
            <Link
              className=" inline-block align-baseline text-xs text-primary/50"
              to="/account/recover"
            >
              Mot de passe oublié
            </Link>
          </div>
          <div className="flex items-center justify-between">
            
            <Button
              className="text-sm mb-2 mt-6"
              variant="primary"
              width="full"
              type="submit"
              disabled={!!(nativePasswordError || nativeEmailError)}
            >
              Se connecter
            </Button>
          </div>
          <div className="text-center mt-8 border-t text-xs  border-gray-300">
            <p className="align-baseline mt-6">
              Nouveau chez {shopName} ? &nbsp;
              <Link className="inline underline" to="/account/register">
                Créer un compte
              </Link>
            </p>
            <p className='mt-6'>
            Si vous n'avez pas créé de compte lors de votre commande, il vous suffit de créer un compte avec la même adresse mail que celle utilisée lors de votre commande. Votre abonnement apparaîtra alors sur votre compte.
            </p>
            
          </div>
        </Form>
      </div>
    </div>
  );
}

const LOGIN_MUTATION = `#graphql
  mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerUserErrors {
        code
        field
        message
      }
      customerAccessToken {
        accessToken
        expiresAt
      }
    }
  }
`;

export async function doLogin({storefront}, {email, password}) {
  const data = await storefront.mutate(LOGIN_MUTATION, {
    variables: {
      input: {
        email,
        password,
      },
    },
  });

  if (data?.customerAccessTokenCreate?.customerAccessToken?.accessToken) {
    return data.customerAccessTokenCreate.customerAccessToken.accessToken;
  }

  /**
   * Something is wrong with the user's input.
   */
  throw new Error(
    data?.customerAccessTokenCreate?.customerUserErrors.join(', '),
  );
}

const SHOP_INFO_QUERY = `#graphql
  query {
    shop {
      name
    }
  }
`;



