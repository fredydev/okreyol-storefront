import { Link } from '@remix-run/react';
import myProductImage from './Background.webp';

export const MyHero = () => {
    return (
        <div className=" ">
          <div className='container  grid grid-cols-1 md:grid-cols-2 gap-8 p-8 mx-auto'>
            <div className=' flex items-center'>
                <div className='max-w-md mx-auto text-okgreen'>
                    <h1 className="text-6xl mb-4">Ekstra konsantre e delivre direkteman lakay ou</h1>
                    <p className="mb-4">Nou menm O'Kreyol, nou siveye bon gou a nan chak eleman. Nou bay yon kremas ki natirèl e ki delisye. Ou pral renmen pran gou kokoye mele ak alkol la</p>
                    <Link to={`/products`}><button className="bg-okgreen text-okwhite px-10 py-3  rounded-full">Boutique</button></Link>
                </div>
            </div>
            <div className=''>
                <img src={myProductImage} alt="My Product" className="mx-auto" />
            </div>
            </div>
        </div>
    );
}

;
