import { ChevronLeftIcon, ChevronRightIcon, HomeIcon } from '@heroicons/react/20/solid'

const pages = [
  { name: 'Projects', href: '/', current: false },
  { name: 'Project Nero', href: '/', current: true },
]

export default function Breadcrumb() {
  return (
    <nav className="flex shadow-sm text-gray-700 mb-4 border-4 border-cyan-700" aria-label="Breadcrumb">
      <ol  className="mx-auto flex w-full max-w-screen-xl space-x-4 px-4 sm:px-6 lg:px-8">
        <li className="flex">
          <div className="flex items-center">
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
                className="h-full w-6 flex-shrink-0 text-gray-700"
                viewBox="0 0 24 44"
                preserveAspectRatio="none"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
              </svg>
              <a
                href={page.href}
                className="ml-4 text-sm font-medium text-okgreen hover:text-gray-900"
                aria-current={page.current ? 'page' : undefined}
              >
                {page.name}
              </a>
            </div>
          </li>
        ))}
      </ol>
      
    </nav>
  )
}
