import { Disclosure } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { SearchPlaceContext } from '../../context/SearchPlaceProvider'
import { useAuthStatus } from '../../hooks/useAuthStatus'
import Loading from '../Loading'

const navigation = [
  { name: 'Home', to: '/', current: true },
  { name: 'Country Tours', to: '/tours', current: false },
  { name: 'Create Vocal Tour', to: '/admin/tours', current: false },
  { name: 'Try Vocalty+ on App', to: 'https://play.google.com/store/apps/details?id=com.vocalty.app', current: false },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const Navbar = () => {
  const location = useLocation();
  const { isLoggedIn } = useContext(SearchPlaceContext)
  const { loggedIn, status } = useAuthStatus();

  if (status) {
    return <Loading />
  }
  return (
    <>
      <Disclosure as="nav" className="bg-white fixed w-full z-50 md:h-[80] h-[80px] pt-4 pb-10 shadow">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
              <div className="relative flex h-16 items-center justify-between">
                <div className="absolute inset-y-0 right-0 flex items-center tablet:hidden">
                  {/* Mobile menu button*/}
                  <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-900 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="flex flex-1 items-center md:justify-between justify-center sm:items-stretch sm:justify-start">
                  <div className="flex flex-shrink-0 items-center">
                    <Link to={'/'} className="text-gray-600 text-xl md:text-2xl font-black">VOCALTY</Link>
                  </div>
                  <div className="hidden sm:ml-6 tablet:block">
                    <div className="flex flex-wrap space-x-4">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          to={item.to}
                          className={classNames(item.to === 'https://play.google.com/store/apps/details?id=com.vocalty.app' ? 'text-gray-600 bg-[#64f67b] font-semibold px-[18px] py-[8px] rounded-full text-[14px]' : 'text-black hover:bg-light-blue-100 hover:text-gray-900',
                            'rounded-md px-3 py-2 text-sm font-medium'
                          )}
                          aria-current={item.current ? 'page' : undefined}
                          target={item.to === 'https://play.google.com/store/apps/details?id=com.vocalty.app' ? '_blank' : undefined}
                        >
                          {item.name}
                        </Link>
                      ))}
                      {
                        isLoggedIn || loggedIn ?
                          <Link to={'/profile'} className='text-black hover:bg-light-blue-100 hover:text-gray-900 rounded-md py-2 px-5 text-sm font-medium'>Profile</Link>
                          :
                          <Link to={'/login'} className='text-black hover:bg-light-blue-100 hover:text-gray-900 rounded-md py-2 px-5 text-sm font-medium'>Login</Link>
                      }
                    </div>
                  </div>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                </div>
              </div>
            </div>

            <Disclosure.Panel className="tablet:hidden z-50 bg-white">
              <div className="space-y-1 px-2 pb-3 pt-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.to}
                    className={classNames(item.to === 'https://play.google.com/store/apps/details?id=com.vocalty.app' ? 'text-[#142800] bg-[#64f67b] font-semibold px-[18px] py-[8px] rounded-full text-[14px]' : 'text-black hover:bg-light-blue-100 hover:text-gray-700',
                      'block rounded-md px-3 py-2 text-base font-medium'
                    )}
                    aria-current={item.current ? 'page' : undefined}
                    target={item.to === 'https://play.google.com/store/apps/details?id=com.vocalty.app' ? '_blank' : undefined}
                  >
                    {item.name}
                  </Link>
                ))}
                {
                  isLoggedIn || loggedIn ?
                    <Link to={'/profile'} className='text-black hover:bg-light-blue-100 hover:text-gray-900 rounded-md py-2 px-5 text-sm font-medium'>Profile</Link>
                    :
                    <Link to={'/login'} className='text-black hover:bg-light-blue-100 hover:text-gray-900 rounded-md py-2 px-5 text-sm font-medium'>Login</Link>
                }
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
      <ToastContainer />
    </>
  )
}

export default Navbar;