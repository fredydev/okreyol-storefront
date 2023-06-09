import { Link } from "@remix-run/react";

export default function Example({featuredSection}) {
    return (
      <div className="">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl">
          <div className="relative overflow-hidden rounded-lg lg:h-96">
            <div className="absolute inset-0">
              <img
                // src="https://tailwindui.com/img/ecommerce-images/category-page-01-featured-collection.jpg"
                src={featuredSection.spread.reference.image.url}
                alt=""
                className="h-full w-full object-cover object-center"
              />
            </div>
            <div aria-hidden="true" className="relative h-96 w-full lg:hidden" />
            <div aria-hidden="true" className="relative h-32 w-full lg:hidden" />
            <div className="absolute inset-x-0 bottom-0 rounded-bl-lg rounded-br-lg bg-black bg-opacity-75 p-6 backdrop-blur backdrop-filter sm:flex sm:items-center sm:justify-between lg:inset-x-auto lg:inset-y-0 lg:w-96 lg:flex-col lg:items-start lg:rounded-br-none lg:rounded-tl-lg">
              <div>
                <h2 className="text-xl font-bold text-white">{featuredSection.heading.value}</h2>
                <p className="mt-1 text-sm text-gray-300">
                  {featuredSection.byline.value}
                </p>
              </div>
              <Link
                to="/collections/lumieres-et-bois"
                className="mt-6 flex flex-shrink-0 items-center justify-center  border border-white border-opacity-25 bg-white bg-opacity-0 px-4 py-3 text-base font-medium text-white hover:bg-opacity-10 sm:ml-8 sm:mt-0 lg:ml-0 lg:w-full"
              >
                {featuredSection.cta.value}
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }
  







// export default function NewsLetter() {
//     return (
//       <section className="bg-white py-16 sm:py-24">
//         <div className="mx-auto container sm:px-6 lg:px-8">
//           <div className="relative isolate flex flex-col gap-10 overflow-hidden bg-white px-6 py-24  sm:px-24 xl:flex-row xl:items-center xl:py-32">
//             <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-black sm:text-4xl xl:max-w-none xl:flex-auto">
//               Get notified when we’re launching.
//             </h2>
//             <form className="w-full max-w-md">
//               <div className="flex gap-x-4">
//                 <label htmlFor="email-address" className="sr-only">
//                   Email address
//                 </label>
//                 <input
//                   id="email-address"
//                   name="email"
//                   type="email"
//                   autoComplete="email"
//                   required
//                   className="min-w-0 flex-auto rounded-sm border  bg-white/5 px-3.5 py-2 text-black shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-corange sm:text-sm sm:leading-6"
//                   placeholder="Enter your email"
//                 />
//                 <button
//                   type="submit"
//                   className="flex-none rounded-sm bg-corange px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-corange"
//                 >
//                   Notify me
//                 </button>
//               </div>
//               <p className="mt-4 text-sm leading-6 text-gray-900">
//                 We care about your data. Read our{' '}
//                 <a href="#" className="font-semibold ">
//                   privacy&nbsp;policy
//                 </a>
//                 .
//               </p>
//             </form>
//             <svg
//               viewBox="0 0 1024 1024"
//               className="absolute left-1/2 top-1/2 -z-10 h-[96rem] w-[96rem] -translate-x-1/2"
//               aria-hidden="true"
//             >
//               <circle cx={512} cy={254} r={512} fill="url(#759c1415-0410-454c-8f7c-9a820de03641)" fillOpacity="0.7" />
//               <defs>
//                 <radialGradient
//                   id="759c1415-0410-454c-8f7c-9a820de03641"
//                   cx={0}
//                   cy={0}
//                   r={1}
//                   gradientUnits="userSpaceOnUse"
//                   gradientTransform="translate(512 512) rotate(90) scale(512)"
//                 >
//                   <stop stopColor="#7775D6" />
//                   <stop offset={9} stopColor="#edb178" stopOpacity={0} />
//                 </radialGradient>
//               </defs>
//             </svg>
//           </div>
//         </div>
//       </section>
//     )
//   }
  