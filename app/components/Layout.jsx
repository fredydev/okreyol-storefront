import {useParams, Form, Await, useMatches} from '@remix-run/react';
import {useWindowScroll} from 'react-use';
import {Disclosure} from '@headlessui/react';
import {Suspense, useEffect, useMemo, useState} from 'react';
import {FaFacebook, FaInstagram, FaTiktok , FaRegCheckCircle, FaTelegramPlane} from 'react-icons/fa'

import {
  Drawer,
  useDrawer,
  Text,
  Input,
  IconLogin,
  IconAccount,
  IconBag,
  IconSearch,
  Heading,
  IconMenu,
  IconCaret,
  Section,
  CountrySelector,
  Cart,
  CartLoading,
  Link,
} from '~/components';
import {useIsHomePath} from '~/lib/utils';
import {useIsHydrated} from '~/hooks/useIsHydrated';
import {useCartFetchers} from '~/hooks/useCartFetchers';
import Annoucement from './Announcement';

export function Layout({children, layout,newsubscriber}) {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <div className="">
          <a href="#mainContent" className="sr-only">
            Skip to content
          </a>
        </div>
        {layout.announcement&&<Annoucement announcement={layout.announcement} />}
        <Header
          logo = {layout?.shop.brand?.logo.image.url}
          title={layout?.shop.name ?? 'Hydrogen'}
          menu={layout?.headerMenu}
        />
        <main role="main" id="mainContent" className="flex-grow ">
          {children}
        </main>
      </div>
      <Footer menu={layout?.footerMenu} logo={layout?.shop.brand?.logo.image.url} newsubscriber={newsubscriber}/>
    </>
  );
}

function Header({title, menu, logo}) {
  const isHome = useIsHomePath();

  const {
    isOpen: isCartOpen,
    openDrawer: openCart,
    closeDrawer: closeCart,
  } = useDrawer();

  const {
    isOpen: isMenuOpen,
    openDrawer: openMenu,
    closeDrawer: closeMenu,
  } = useDrawer();

  const addToCartFetchers = useCartFetchers('ADD_TO_CART');

  // toggle cart drawer when adding to cart
  useEffect(() => {
    if (isCartOpen || !addToCartFetchers.length) return;
    openCart();
  }, [addToCartFetchers, isCartOpen, openCart]);

  return (
    <>
      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
      {menu && (
        <MenuDrawer isOpen={isMenuOpen} onClose={closeMenu} menu={menu} />
      )}
      <DesktopHeader
        isHome={isHome}
        title={title}
        menu={menu}
        openCart={openCart}
        logo={logo}
      />
      <MobileHeader
        isHome={isHome}
        title={title}
        openCart={openCart}
        openMenu={openMenu}
        logo={logo}
      />
    </>
  );
}

function CartDrawer({isOpen, onClose}) {
  const [root] = useMatches();

  return (
    <Drawer open={isOpen} onClose={onClose} heading="Cart" openFrom="right">
      <div className="grid">
        <Suspense fallback={<CartLoading />}>
          <Await resolve={root.data?.cart}>
            {(cart) => <Cart layout="drawer" onClose={onClose} cart={cart} />}
          </Await>
        </Suspense>
      </div>
    </Drawer>
  );
}

export function MenuDrawer({isOpen, onClose, menu}) {
  return (
    <Drawer open={isOpen} onClose={onClose} openFrom="left" heading="Menu">
      <div className="grid">
        <MenuMobileNav menu={menu} onClose={onClose} />
      </div>
    </Drawer>
  );
}

function MenuMobileNav({menu, onClose}) {
  return (
    <nav className="grid gap-4 p-6 sm:gap-6 sm:px-12 sm:py-8">
      {/* Top level menu items */}
      {(menu?.items || []).map((item) => (
        <span key={item.id} className="block">
          <Link
            to={item.to}
            target={item.target}
            onClick={onClose}
            className={({isActive}) =>
              isActive ? 'pb-1 border-b -mb-px' : 'pb-1'
            }
          >
            <Text as="span" size="copy">
              {item.title}
            </Text>
          </Link>
        </span>
      ))}
    </nav>
  );
}

function MobileHeader({isHome, openCart, openMenu,logo}) {
  // useHeaderStyleFix(containerStyle, setContainerStyle, isHome);

  const params = useParams();

  return (
    <header
      role="banner" 
      className={`bg-primary/80 dark:bg-contrast/60 text-contrast dark:text-primary shadow-darkHeader 
       flex lg:hidden items-center donfred-nav h-16 sticky backdrop-blur-lg z-40 top-0 justify-between w-full leading-none gap-4 px-4 md:px-8`}
    >
      <div className="flex items-center justify-start w-full gap-4  ">
        <button
          onClick={openMenu}
          className="relative flex items-center justify-center w-8 h-8"
        >
          <IconMenu />
        </button>
        <Form
          method="get"
          action={params.locale ? `/${params.locale}/search` : '/search'}
          className="items-center gap-2 sm:flex"
        >
          <button
            type="submit"
            className="relative flex items-center justify-center w-8 h-8"
          >
            <IconSearch />
          </button>
          <Input
            className={
              isHome
                ? 'focus:border-contrast/20 dark:focus:border-primary/20'
                : 'focus:border-primary/20'
            }
            type="search"
            variant="minisearch"
            placeholder="Search"
            name="q"
          />
        </Form>
      </div>

      <Link
        className="flex items-center self-stretch leading-[3rem] md:leading-[4rem] justify-center flex-grow w-full h-full"
        to="/"
      >
        <div className=''>
          <img src={logo} alt="Logo" className='h-24 w-auto'/>
        </div>
      </Link>

      <div className="flex items-center justify-end w-full gap-4">
        <AccountLink className="relative flex items-center justify-center w-8 h-8" />
        <CartCount isHome={isHome} openCart={openCart} />
      </div>
    </header>
  );
}

function DesktopHeader({isHome, menu, openCart, logo}) {
  const params = useParams();
  const {y} = useWindowScroll();
  return (
    <header
      role="banner"
      className={`
           text-contrast dark:text-primary shadow-darkHeadern 
      bg-creme/80 font-poppins
      hidden h-auto donfred-nav lg:flex items-center justify-between  sticky transition duration-300  z-40 top-0  w-full leading-none gap-8  `}
    >
      <div className="donfred flex flex-col  justify-between      w-full  ">
        <div className=' bg-creme  div-sa-se-jus-poum-jere-nav-opacity-a  gap-12 justify-between  px-6 md:px-8 lg:px-12'>
        <div className="flex gap-12 justify-between container bg-creme   mx-auto px-6 md:px-8 lg:px-12">
          <Link className="font-bold" to="/" prefetch="intent">
            <div className=''>
              <img src={logo} alt="Logo" className='h-28 w-auto'/>
            </div>
          </Link>
          <div className="flex items-center  gap-2 text-black">
            <Form
              method="get"
              action={params.locale ? `/${params.locale}/search` : '/search'}
              className="flex items-center gap-2"
            >
              <Input
                className={
                  isHome
                    ? 'focus:border-contrast/20 dark:focus:border-primary/20'
                    : 'focus:border-primary/20'
                }
                type="search"
                variant="minisearch"
                placeholder="Search"
                name="q"
              />
              <button
                type="submit"
                className="relative flex items-center justify-center w-8 h-8 focus:ring-primary/5"
              >
                <IconSearch />
              </button>
            </Form>
            <AccountLink className="relative flex items-center justify-center w-8 h-8 focus:ring-primary/5" />
            <CartCount isHome={isHome} openCart={openCart} />
          </div>
          
        </div>
        
          </div>
          <nav className={`${
        !isHome && y > 50 && ' shadow-lightHeader'
      } bg-primary/80 dark:bg-contrast/60    `}>
          <div className='container flex  font-poppins items-end mx-auto px-6 md:px-8 lg:px-12 font-normal'>
            {/* Top level menu items */}
            {(menu?.items || []).map((item) => (
              <Link
                key={item.id}
                to={item.to}
                target={item.target}
                prefetch="intent"
                className={({isActive}) =>
                  isActive ? '  bg-corange py-3 px-2 transition-transform duration-300' : 'text-white hover:bg-corange transition-colors duration-700 px-2 py-3'
                }
              >
                {item.title}
              </Link>
            ))}
            </div>
          </nav>
      </div>
    </header>
  );
}

function AccountLink({className}) {
  const [root] = useMatches();
  const isLoggedIn = root.data?.isLoggedIn;
  return isLoggedIn ? (
    <Link to="/account" className={className}>
      <IconAccount />
    </Link>
  ) : (
    <Link to="/account/login" className={className}>
      <IconLogin />
    </Link>
  );
}

function CartCount({isHome, openCart}) {
  const [root] = useMatches();

  return (
    <Suspense fallback={<Badge count={0} dark={isHome} openCart={openCart} />}>
      <Await resolve={root.data?.cart}>
        {(cart) => (
          <Badge
            dark={true}
            openCart={openCart}
            count={cart?.totalQuantity || 0}
          />
        )}
      </Await>
    </Suspense>
  );
}

function Badge({openCart, dark, count}) {
  const isHydrated = useIsHydrated();

  const BadgeCounter = useMemo(
    () => (
      <>
        <IconBag />
        <div
          className={`${
            dark
              ? 'text-primary bg-contrast dark:text-contrast dark:bg-primary'
              : 'text-contrast bg-primary'
          } absolute bottom-1 right-1 text-[0.625rem] font-medium subpixel-antialiased h-3 min-w-[0.75rem] flex items-center justify-center leading-none text-center rounded-full w-auto px-[0.125rem] pb-px`}
        >
          <span>{count || 0}</span>
        </div>
      </>
    ),
    [count, dark],
  );

  return isHydrated ? (
    <button
      onClick={openCart}
      className="relative flex items-center justify-center w-8 h-8 focus:ring-primary/5"
    >
      {BadgeCounter}
    </button>
  ) : (
    <Link
      to="/cart"
      className="relative flex items-center justify-center w-8 h-8 focus:ring-primary/5"
    >
      {BadgeCounter}
    </Link>
  );
}



const Footer = ({logo,newsubscriber, menu}) => {
  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(false);

  const handleEmailChange = (event) => {
    const inputEmail = event.target.value;
    setEmail(inputEmail);
    setIsValidEmail(validateEmail(inputEmail));
  };  

  const validateEmail = (email) => {
    // Logique de validation de l'email
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  // console.log(menu)  
  const blog = menu.items.find(item=>item.title === 'Blog')
  return (             
    <footer className="bg-primary/80 dark:bg-contrast/60 text-contrast dark:text-primary shadow-darkHeader ">
      <div className="container mx-auto px-6 md:px-8 lg:px-12 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div className='text-sm'>
            <h3 className="text-xl font-bold mb-4 txt">Nous contacter</h3>
            <p className="mb-2 font-bold italic">Dites bonjour !</p>
            <p className="mb-2">info@boiscreatif.fr</p>
            {/* <p>123-456-7890</p> */}
            <Link to="/">
              <img src={logo} alt="Logo" className="w-32 mt-4" />
            </Link>
            
          </div>
          <div className='text-sm'>
            <h3 className="text-xl font-bold mb-4">Bois Créatif</h3>
            <ul>
              <li className="mb-2">
                <Link to="/search" className="text-gray-300 hover:text-white">
                  Rechercher
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/collections/lumieres-et-bois" className="text-gray-300 hover:text-white">
                  Lumières et bois
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/pages/papiers-peints" className="text-gray-300 hover:text-white">
                  Papiers peints
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/products" className="text-gray-300 hover:text-white">
                  Créations
                </Link>
              </li>
              <li>
                <Link to={"/journal"} className="text-gray-300 hover:text-white">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          <div className='text-sm'>
            <h3 className="text-xl font-bold mb-4">Liens rapides</h3>
            <ul>
              <li className="mb-2">
                <Link to="/pages/about" className="text-gray-300 hover:text-white">
                  À propos de nous
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/policies/refund-policy" className="text-gray-300 hover:text-white">
                  Politique de retour
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/policies/privacy-policy" className="text-gray-300 hover:text-white">
                  Politique de confidentialité
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/pages/faq" className="text-gray-300 hover:text-white">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/pages/contact" className="text-gray-300 hover:text-white">
                  Contactez-nous
                </Link>
              </li>
            </ul>
          </div>
          <div className='sm:px-4 text-sm' id="contact-footer">
            <h3 className="text-xl font-bold mb-4">Restons en contact</h3>
            <p className="mb-2">Soyez au courant des nouvelles offres et des news</p>
            
            <Form
              method="post"
              noValidate
              className="flex mb-2"
            >
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Email address"
                  aria-label="Email address"
                  className={`border border-gray-300 rounded-l-sm py-2 px-4 w-full text-black ${
                    isValidEmail ? "pr-12" : ""
                  }`}
                  value={email}
                  onChange={handleEmailChange}
                />
              
              <button
                className={`${
                  isValidEmail ? "bg-corange" : "bg-gray-300"
                } text-white rounded-r-sm px-4 transition-colors duration-300`}
                disabled={!isValidEmail}
              >
                <FaTelegramPlane />
              </button>
            </Form>
            {newsubscriber && (
              <p className='flex items-center mb-2'><span><FaRegCheckCircle className='text text-sm  text-green-600 mr-2'/></span><span>Merci de votre inscription &nbsp;</span></p>
            )}
            <div className="flex space-x-4 text-lg mt-2">
              <a href="https://facebook.com/boicreatif" className="text-gray-300 hover:text-corange">
                <FaFacebook />
              </a>
              <a href="https://instagram.com/boicreatif" className="text-gray-300 hover:text-corange">
                <FaInstagram/>
              </a>
              <a href="https://tiktok.com/@boicreatif" className="text-gray-300 hover:text-corange">
                <FaTiktok />
                
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-4">
        <p className="text-center text-white">
          &copy; {new Date().getFullYear()} Bois Créatif. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
};


