import { NavLink } from 'react-router-dom';
import {
  FiBox,
  FiTruck,
  FiBarChart2,
  FiClipboard,
  FiSettings,
  FiInbox,
} from 'react-icons/fi';
import { FaCalculator } from 'react-icons/fa';

export default function Sidebar() {
  const navItems = [
    { name: 'Inventories', icon: FiBox, path: '/' },
    { name: 'External Orders', icon: FiTruck, path: '/external-orders' },
    { name: 'Internal Orders', icon: FiTruck, path: '/internal-orders' },
    { name: 'Analytics', icon: FiBarChart2, path: '/analytics' },
    { name: 'Inventory Count', icon: FiInbox, path: '/inventory-count' },
    { name: 'COGS Calculator', icon: FaCalculator, path: '/cogs-calculator' },
  ];

  return (
    <div className='w-50 h-screen bg-white border-r border-gray-200 flex flex-col justify-between fixed'>
      <div>
        {/* LOGO - centered */}
        <div className='pt-4 h-16 flex items-center justify-center px-6'>
          <img
            src='/img/totalctrl-logo-only.png'
            alt='logo'
            className='h-4.5 object-contain'
          />
        </div>

        <nav className='mt-4 px-3 text-[13px]'>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `group flex items-center gap-3 px-4 py-2.5 rounded-md cursor-pointer
                   transition-all duration-150
                   ${
                     isActive
                       ? 'text-green-600 font-extrabold hover:text-black'
                       : 'text-gray-600 font-extrabold hover:text-black hover:font-medium'
                   }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={18}
                      className={
                        isActive
                          ? 'text-green-500 group-hover:text-black'
                          : 'text-gray-400 group-hover:text-black'
                      }
                    />
                    <span>{item.name}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Fade border below nav */}
        <div
          className='mx-3 mt-4'
          style={{
            height: '1px',
            background:
              'linear-gradient(to right, transparent, #e5e7eb, transparent)',
          }}
        />
      </div>

      <div className='px-3 pb-4 mt-2'>
        {/* Get the mobile app */}
        <div className='bg-green-50 rounded-lg p-4 mb-4'>
          <p className='text-emerald-950 font-medium text-sm p-1 mb-3'>
            Get the mobile app
          </p>
          <div className='text-emerald-950 text-xs space-y-2'>
            <div className='flex items-center gap-2 border-t border-green-200 pt-2.5 pl-5 pb-1'>
              <img
                src='/icons/app-store-logo.svg'
                alt='App Store'
                className='w-4 h-4'
              />
              <span>App Store</span>
            </div>
            <div className='flex items-center gap-2 border-t border-green-200 pt-2 pl-5'>
              <img
                src='/icons/google-play-icon.svg'
                alt='Google Play'
                className='w-4 h-4'
              />
              <span>Google Play</span>
            </div>
          </div>
        </div>

        {/* Video Library */}
        <a
          href='https://www.youtube.com/watch?v=dHJzsYbJbrE'
          target='_blank'
          rel='noreferrer'
          className='block bg-purple-50 rounded-lg px-3 py-0.5 mb-4 cursor-pointer hover:bg-purple-100 transition'
        >
          <div className='flex items-center gap-2 mb-1 p-3'>
            <img
              src='/icons/video-library.svg'
              alt='Video Library'
              className='w-6 h-6'
            />
            <p className='text-purple-950 font-medium text-sm'>Video Library</p>
          </div>
          <div className='border-t border-purple-200 pt-1' />
          <p className='text-xs text-purple-950 leading-snug mt-0.5 px-3'>
            Master the basics of inventory count with TotalCtrl
          </p>
        </a>

        {/* Refer a Friend */}
        <a
          href='https://totalctrl.getrewardful.com/signup?campaign=refer-a-friend-earn-rewards'
          target='_blank'
          rel='noreferrer'
          className='flex items-center justify-center w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md text-sm font-medium mb-0.5 transition'
        >
          Refer a Friend
        </a>

        <div className='mx-4 my-2 border-t border-gray-200' />

        <NavLink
          to='/settings'
          className={({ isActive }) =>
            `group flex items-center gap-2 mt-5 ml-5 text-sm px-2 transition
             ${
               isActive
                 ? 'text-green-600 font-medium hover:text-black'
                 : 'text-gray-500 hover:text-black'
             }`
          }
        >
          {({ isActive }) => (
            <>
              <FiSettings
                size={18}
                className={
                  isActive
                    ? 'text-green-500 group-hover:text-black'
                    : 'text-gray-400 group-hover:text-black'
                }
              />
              <span>Settings</span>
            </>
          )}
        </NavLink>
      </div>
    </div>
  );
}
