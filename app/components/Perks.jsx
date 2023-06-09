// import {Image} from '@shopify/hydrogen';
import {Section} from '~/components';

export function Perks({
  perks,
  title = 'Perks',
  ...props
}) {
console.log(perks)
  return (
    <Section {...props} bg='bg-white' className={'text-okgreen'}>
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-32 lg:px-8 parallax-sectiono">
            <div className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-0">
              {perks.map((perk) => (
                <div
                  key={perk.node.id}
                  className="text-center md:flex md:items-start md:text-left lg:block lg:text-center "
                >
                  <div className="md:flex-shrink-0">
                    <div className="flow-root">
                      <img className="-my-1 mx-auto h-48 w-auto " src={perk.node.fields[1].value} alt="" />
                    </div> 
                  </div>
                  <div className="mt-6 md:ml-4 md:mt-0 lg:ml-0 lg:mt-6">
                    <h3 className=" text-lg font-bold ">{perk.node.fields[2].value}</h3>
                    <p className="mt-3 text-sm ">{perk.node.fields[0].value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
    </Section>
  );
}
