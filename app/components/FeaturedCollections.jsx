import {Image} from '@shopify/hydrogen';
import { useState } from 'react';
import {Heading, Section, Grid, Link} from '~/components';

export function FeaturedCollections({
  collections,
  title = 'Collections',
  ...props
}) {
  const [hovered, setHovered] = useState(null);
  const haveCollections = collections && collections.length > 0;
  if (!haveCollections) return null;

  const items = collections.filter((item) => item.image).length;
  return (
    <Section {...props} heading={title} className={'text-okgreen'}>
      <Grid items={items}>
        {collections.map((collection) => {
          if (!collection?.image) {
            return null;
          }
          return (
            <Link key={collection.id} to={`/collections/${collection.handle}`}onMouseEnter={() => setHovered(collection.id)}
            onMouseLeave={() => setHovered(null)}>
              <div className="grid gap-4 overflow-hidden relative">
                <div className="card-image bg-primary/5 aspect-[3/2]">
                  {collection?.image && (
                    <Image
                      alt={`Image of ${collection.title}`}
                      data={collection.image}
                      sizes="(max-width: 32em) 100vw, 33vw"
                      aspectRatio="3/2"
                      className='transition-transform duration-300 transform group-hover:scale-110'
                    />
                  )}
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-corange text-white py-4 px-4 font-bold text-lg">
                  {collection.title}
                  <span   className={`ml-2 inline-block transform-gpu transition-transform duration-300 ${
                      hovered===collection.id ? 'scale-x-150' : 'scale-x-100'
                    }`}>
                    →
                  </span>
                </div>
                {/* <Heading size="copy">{collection.title}</Heading> */}
              </div>
            </Link>
          );
        })}
      </Grid>
    </Section>
  );
}
