import {json, redirect} from '@shopify/remix-oxygen';
import {useActionData, useLoaderData, useSearchParams} from '@remix-run/react';
import invariant from 'tiny-invariant';
import oak1 from "../images/oak_wood_1.png"
import oak2 from "../images/oak_wood_2.png"
import oak3 from "../images/oak_wood_3.png"
import { useSpring, animated } from "react-spring";
import {getInputStyleClasses} from '~/lib/utils';

const wallpaperData = [
  {
    id: 1,
    imageUrl: oak1,
    woodType: "Chêne 1",
    description: "Un magnifique wallpaper en bois de chêne. 1",
    downloadUrl: "path/to/download1.jpg",
  },
  {
    id: 2,
    imageUrl: oak2,
    woodType: "Chêne 2",
    description: "Un magnifique wallpaper en bois de chêne 2.",
    downloadUrl: "path/to/download1.jpg",
  },
  {
    id: 3,
    imageUrl: oak3,
    woodType: "Chêne 3",
    description: "Un magnifique wallpaper en bois de chêne 3.",
    downloadUrl: "path/to/download1.jpg",
  },
  // Ajoutez d'autres objets de données pour les autres wallpapers
];


import {Button, Heading, Link, PageHeader, Section} from '~/components';
import {CACHE_LONG, routeHeaders} from '~/data/cache';
import {seoPayload} from '~/lib/seo.server';
import { useEffect, useRef, useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import {
  Form
} from '@remix-run/react';

const badRequest = (data) => json(data, {status: 400});

const formDataHas = (formData, key) => {
  if (!formData.has(key)) return false;

  const value = formData.get(key);
  return typeof value === 'string' && value.length > 0;
};


export const action = async ({request, context, params}) => {
  const formData = await request.formData();
  try {
    // console.log(formData);
    const body = {};

    formDataHas(formData, 'name') &&
      (body.name = formData.get('name'));
    formDataHas(formData, 'email') && (body.email = formData.get('email'));
    formDataHas(formData, 'checkbox') ? (body.consent = true) : (body.consent = false);
    formDataHas(formData, 'message') &&
      (body.message = formData.get('message'));
      // console.log(body)
    const data = await fetch('https://eohztqmor46ogw0.m.pipedream.net', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    
    // assertApiErrors(data.customerUpdate);
    return redirect(params?.locale ? `${params.locale}/pages/contact?success=true` : '/pages/contact?success=true');
  } catch (error) {
    return badRequest({formError: error.message});
  }
};

export const headers = routeHeaders;

export async function loader({request, params, context}) {
  invariant(params.pageHandle, 'Missing page handle');
  const FAQ_META_TYPE = "faq"
  const {page, faq} = await context.storefront.query(PAGE_QUERY, {
    variables: {
      handle: params.pageHandle,
      language: context.storefront.i18n.language,
      metaObjectType: FAQ_META_TYPE
    },
  });
  if (!page) {
    throw new Response(null, {status: 404});
  }
  if (!faq) {
    throw new Response(null, {status: 404});
  }
  const 
  myfaq = faq.edges.length > 0
    ? faq.edges[0].node.fields[0].value
    : null;
  const seo = seoPayload.page({page, url: request.url, });

  return json(
    {page, seo, faq: myfaq},
    {
      headers: {
        'Cache-Control': CACHE_LONG,
      },
    },
  );
}

export default function Page() {
  const {page, faq} = useLoaderData();
  if(page.title === "Papiers peints"){
    return <>
      <HeroSection />
      <Section>
        <WallpapersGrid />
      </Section>
    </>
  }
  if(page.title === "About"){
    return <>
        <AboutUsPage  page={page}/>
    </>
  }
  if(page.title === "Contact us"){
    const [searchParams, setSearchParams] = useSearchParams();
    const success = searchParams.get('success') === 'true';
    // console.log(success);
    return <>
        <ContactUsPage success={success}  page={page}/>
    </>
  }
  console.log(page.title)
  if(page.title === "FAQ - Frequently Asked Questions"){
    return <>
      <Section>
        <FAQ menu={JSON.parse(faq).questions}  />
      </Section>
    </>
  }
  return (
    <div className={`lg:bg-[url('../brown-parallax.svg')] lg:bg-fixed lg:bg-right lg:bg-no-repeat block`}>
      <div className="bg-white/80 border">
        <PageHeader heading={page.title}/>
        <Section >
            <div >
              <div 
                dangerouslySetInnerHTML={{__html: page.body}}
                className="prose dark:prose-invert b "
              />
          </div>
          </Section>
        </div>
    </div>
  );
}

const PAGE_QUERY = `#graphql
  query PageDetails($language: LanguageCode, $handle: String!, $metaObjectType: String!)
  @inContext(language: $language) {
    page(handle: $handle) {
      id
      title
      body
      seo {
        description
        title
      }
    }
    faq: metaobjects(type: $metaObjectType,first:1){
      edges {
        node {
          id
          fields {
            value
          }
        }
      }
    }
  }
`;

function HeroSection() {
  return (
    <section className="flex items-center justify-center h-screen bg-gray-200">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Wallpapers pour tous vos écrans</h1>
        <p className="mt-4 text-lg">Découvrez notre collection de magnifiques wallpapers pour embellir vos écrans.</p>
        
      </div>
      <a className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-3 mt-8  rounded-full bg-corange text-white font-semibold flex justify-center flex-col items-center">
        <span>Parcourir</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 animate-bounce" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14" />
          <path d="M19 12l-7 7-7-7" />
        </svg>
      </a>
    </section>
  );
}

function WallpapersGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {wallpaperData.map((wallpaper) => (
        <div key={wallpaper.id} className="relative rounded-lg overflow-hidden bg-gray-200">
          <div
            className="w-full h-0"
            style={{
              paddingTop: "50%", // Ajustez cette valeur pour obtenir la hauteur souhaitée en pourcentage
            }}
          >
            <img
              src={wallpaper.imageUrl}
              alt={wallpaper.description}
              className="absolute inset-0 object-cover w-full h-full"
            />
          </div>
          {/* Le reste du contenu de l'image */}
        </div>
      ))}
    </div>
  );
}



const FAQ = ({menu}) => {
  const [activeItems, setActiveItems] = useState(1);

  const toggleItem = (itemId) => {
    setActiveItems(itemId);
  };

  
  const data = menu.find(elem=>elem.id===activeItems)

return (
  <div className="bg-groay-100 ">
    <Heading size='dnfrd'> FAQ</Heading>
    <div className="  font-normal">
      <ul className="py-4 flex">
        <li
          className={`px-4 py-2 cursor-pointer ${
            activeItems === 1 ? 'bg-corange text-white' : ''
          }`}
          onClick={() => toggleItem(1)}
        >
          L'entreprise
        </li>
        <li
          className={`px-4 py-2 cursor-pointer ${
            activeItems === 6 ? 'bg-corange text-white' : ''
          }`}
          onClick={() => toggleItem(6)}
        >
          Les commandes
        </li>
      </ul>
  </div>
    <div className="container mx-auto mt-8">
      <div className="mb-4 border border-dashed" >
        {data.subitems.map((item, i) =>{
          return <Accordion key={item.id} title={item.title} content={item.url}/>
        })}
      </div>
    </div>
  </div>
);
};

      

                            
function Accordion({title, content, children}) {
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
    config: { duration: "500" }
  });

  return (
    <>
    <animated.div className="w-full max-h-full  border-b border-gray-200 text-white overflow-hidden cursor-pointer scroll-auto pr-4" style={openAnimation}>
      <div className="flex justify-between py-[17px] px-[10px] items-center text-black " onClick={toggleHandler}>
        <h4 className='font-semibold'>{title}</h4>
        <animated.i style={iconAnimation}>
        <ChevronDownIcon className={`h-5 w-5`} />
        </animated.i>
      </div>
      <div
        className=" text-gray-800  text-sm mt-1 p-3"
       
      >
        {content}
      </div>
    </animated.div>
    {children}
    </>
  );
}


import woodBackground from "../brown-parallax2.svg";

const AboutUsPage = ({page}) => {
  return (
    <div className="bg-white relative" >
      <div className="bg-cover bg-center h-64 sm:h-96" style={{ backgroundImage: `url(${woodBackground})` }}>
        <div className="h-full flex flex-col justify-center items-center bg-black bg-opacity-75 p-6 backdrop-blur backdrop-filter">
          <Heading>À propos de nous</Heading> 
          <p className="text-xl sm:text-2xl text-white mt-4">Des créations uniques en bois naturel</p>
        </div>
      </div>
      <Section>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Notre histoire</h2>
          <div 
              dangerouslySetInnerHTML={{__html: page.body}}
              className="prose dark:prose-invert p-0 border border-cyan-700 w-full "
            />
        </div>
      </Section>
    </div>
  );
};





const ContactUsPage = ({success}) => {
  const [isChecked, setIsChecked] = useState(false);
  const actionData = useActionData();

  const formRef = useRef()
  useEffect(()=>{
    if(success) formRef.current?.reset()
      
  }, [])
  return (
    <div className=" lg:bg-fixed  lg:bg-right lg:bg-no-repeat lg:bg-[url('../brown-parallax.svg')]  flex lg:h-[calc(100vh-10.5rem)]">
      {success && ( <SuccessMessage />
        
      )}
    <div className=" bg-white/80  w-full">
    <div className="py-8 md:flex items-center justify-between container mx-auto px-6 md:px-8 lg:px-12 ">
      <div className="  flex flex-col pb-6  max-w-md font-normal">
        <Heading>Vous cherchez des réponses ?</Heading>
        <div className="my-8">
          <p>
          Consultez notre section pour trouver des réponses aux {" "}
            <Link to="/pages/faq" className="text-blue-500 hover:underline">
            questions fréquemment posées.
            </Link>
          </p>
        </div>
        <div className='my '>
          <p className='my-2'>Vous n'avez pas trouvé la réponse à votre question ?</p>
          <p>Remplissez notre formulaire de contact et nous vous répondrons dans les plus brefs délais.</p>
        </div>
      </div>
      <div className="max-w-md  md:bg-white md:px-4 py-8 md:shadow-sm shadow-gray-300 ">
        <Heading size='dnfrd'>Envoyez-nous un message</Heading>
        <Form method='post' noValidate ref={formRef}>
        {actionData?.formError && (
            <div className="flex items-center justify-center mb-6 bg-zinc-500">
              <p className="m-4 text-s text-contrast">{actionData.formError}</p>
            </div>
          )}
          <div className="my-4">
            <label htmlFor="name" className="block font-normal mb- text-[10px]">
              Nom
            </label>
            <input
            name='name'
              required
              type="text"
              id="name"
              className={`${getInputStyleClasses()} rounded-none w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-corange`}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block font-normal mb- text-[10px]">
              Email
            </label>
            <input
              required
              type="email"
              name='email'
              id="email"
              className={`${getInputStyleClasses()} rounded-none w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-corange`}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="message" className="block font-normal mb- text-[10px]">
              Message
            </label>
            <textarea
              required
              id="message"
              name='message'
              className="text-primary/90 placeholder:text-primary/50 leading-tight focus:shadow-outline focus:ring-0 w-full px-4 py-2 border border-primary/20 border-gray-300 resize-none h-40 focus:outline-none focus:border-corange"
            ></textarea>

          </div>
          <Checkbox isChecked={isChecked} setIsChecked={setIsChecked}/>
          <Button 
          // onClick={(e) => handleSubmit(e)}
          width="full"
            type="submit"
          >
            Envoyer
          </Button>
        </Form>
      </div>
    </div></div></div>
    
  );
};

const Checkbox = ({isChecked, setIsChecked}) => {
 

  const toggleCheckbox = () => {
    setIsChecked(!isChecked);
  };

  return (
    <label className="flex items-center mb-4">
      <input
        type="checkbox"
        id='checkbox'
        name='checkbox'
        checked={isChecked}
        onChange={toggleCheckbox}
        className="hidden"
      />
      <div className="w-8 h-8 border border-corange rounded-sm flex justify-center items-center ">
        {isChecked && (
          <svg
            className="w-6 h-6 text-corange"
            viewBox="0 0 20 20"
            fill="currentColor"
          > 
            <path
              fillRule="evenodd"
              d="M9.293 16.293a1 1 0 0 1-1.414 0l-6-6a1 1 0 0 1 1.414-1.414L9 13.586l8.293-8.293a1 1 0 1 1 1.414 1.414l-9 9z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>
      <span className="text-gray-700 text-[10px] pl-4 font-normal"> En cliquant sur envoyer, vous autorisez l'utilisation de votre adresse mail. </span>
    </label>
  );
};


const SuccessMessage = () => {
  return (
    <div className="bg-green-100 border border-green-500 text-green-900 px-4 py-3  my-4">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-green-500 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.293 16.293a1 1 0 0 1-1.414 0l-6-6a1 1 0 0 1 1.414-1.414L9 13.586l8.293-8.293a1 1 0 1 1 1.414 1.414l-9 9z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm">
            Merci pour votre message ! Nous vous répondrons dès que possible.
            </span>
          </div>
        </div>
  );
};