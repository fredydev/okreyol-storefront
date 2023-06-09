import { useEffect, useState } from 'react';
import {Section, Grid, Link} from '~/components';


function LoadingAnimation() {
  return (
    <div className="loading-animation">
      <div className="loading-spinner"></div>
      <div className="loading-text">Chargement...</div>
    </div>
  );
}


export function FeaturedCollections({
  collections,
  title = 'Collections',
  ...props
}) {
  const [hovered, setHovered] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const haveCollections = collections && collections.length > 0;
  if (!haveCollections) return null;
  useEffect(() => {
    // Exemple de chargement asynchrone (simulé)
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);


  const items = collections.filter((item) => item.image).length;
  if(isLoading) return <LoadingAnimation />
  return (

    <Section {...props} heading={title} className={'text-okgreen'}>
      <Grid items={items}>
        {collections.map((collection) => {
          if (!collection?.image) {
            return null;
          }
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
        })}
      </Grid>
    </Section>
  );
}
