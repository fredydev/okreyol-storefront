import { ChevronLeftIcon, ChevronRightIcon, HomeIcon } from '@heroicons/react/20/solid'



export default function Breadcrumb({product}) {
  const pages = [
    { name: product.collection.edges.length>0?`${product.collection.edges[0].node.title}`:"Collections", href: product.collection.edges.length>0?`/collections/${product.collection.edges[0].node.handle}`:"/collections", current: false },
    { name: product.shortname? product.shortname.value : product.title, href: `/products/${product.handle}`, current: true },
  ]
  return (
    <nav className="flex shadow- text-gray-700 mb-4 bg-slate-100" aria-label="Breadcrumb">
      <ol  className="mx-auto flex w-full max-w-screen-xl space-x-4 px-4 sm:px-6 lg:px-8 ">
        <li className="flex " >
          <div className="flex items-center ">
            <a href="/" className="text-okgreen hover:text-gray-900">
              <HomeIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
              <span className="sr-only">Home</span>
            </a>
          </div>
        </li>
        {pages.map((page) => (
          <li key={page.name} className="flex">
            <div className="flex items-center">
              <svg
                className="h-full w-6 flex-shrink-0 text-gray-200"
                viewBox="0 0 24 44"
                preserveAspectRatio="none"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
              </svg>
              {page.current
              ?
              <span
                className="ml-4 text-sm font-medium text-gray-300"
                aria-current={page.current ? 'page' : undefined}
              >
                {page.name}
              </span>
              :
              <a
                href={page.href}
                className="ml-4 text-sm font-medium text-okgreen hover:text-gray-900"
                aria-current={page.current ? 'page' : undefined}
              >
                {page.name}
              </a>}
            </div>
          </li>
        ))}
      </ol>
      
    </nav>
  )
}
