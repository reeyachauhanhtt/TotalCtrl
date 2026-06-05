import { useState, useRef } from 'react';
import { NavLink } from 'react-router-dom';

import SettingsDropdown from './Common/SettingsDropdown';

export default function Sidebar() {
  const [settingsOpen, setSettingsOpen] = useState(false);

  const settingsBtnRef = useRef(null);

  const navItems = [
    { name: 'Inventories', icon: '/icons/box.svg', path: '/' },
    {
      name: 'External Orders',
      icon: '/icons/transport.svg',
      path: '/external-orders',
    },
    {
      name: 'Internal Orders',
      icon: '/icons/transport.svg',
      path: '/internal-orders',
    },
    {
      name: 'Analytics',
      icon: '/icons/chart.svg',
      path: '/analytics-overview',
    },
    {
      name: 'Inventory Count',
      icon: '/icons/inbox.svg',
      path: '/inventory-count',
    },
    {
      name: 'COGS Calculator',
      icon: '/icons/cogs-calculator.svg',
      path: '/cogs-calculator',
    },
  ];

  return (
    <div
      className='w-50 h-screen bg-white flex flex-col justify-between fixed'
      style={{ borderRight: '1px solid #e7e7ec' }}
    >
      <div>
        {/* LOGO */}
        <div
          className='flex items-center'
          style={{ height: '75px', paddingLeft: '44px' }}
        >
          <img
            src='/img/totalctrl-logo-only.png'
            alt='logo'
            style={{ maxWidth: '111px' }}
            className='object-contain'
          />
        </div>

        {/* Nav */}
        <nav className='mt-0'>
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `nav-link flex items-center transition-all duration-200 ${
                  isActive
                    ? 'active text-[#23A956] hover:text-[#19191c]'
                    : 'text-[#6B6B6F] hover:text-[#19191c]'
                }`
              }
              style={{
                padding: '0px 25px 0px 29px',
                height: '42px',
                fontSize: '14px',
                fontWeight: '600',
                lineHeight: '24px',
              }}
            >
              {({ isActive }) => (
                <>
                  <img
                    src={item.icon}
                    alt=''
                    style={{
                      marginRight: '18px',
                      width: '24px',
                      height: '24px',
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ whiteSpace: 'nowrap' }}>{item.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Divider */}
        <img src='/icons/Line.svg' style={{ margin: '12px 24px' }} />
      </div>

      <div style={{ padding: '0 0 16px' }}>
        {/* Mobile app */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            padding: '4px 16px',
            margin: '10px',
            background: '#eaf7ee',
            borderRadius: '8px',
          }}
        >
          <div
            style={{
              fontWeight: '700',
              fontSize: '14px',
              lineHeight: '20px',
              padding: '16px 10px',
              color: '#0f6f36',
            }}
          >
            Get the mobile app
          </div>

          {/* App Store */}

          <a
            href='https://apps.apple.com/us/app/totalctrl-restaurant/id1484776237'
            target='_blank'
            rel='noreferrer'
            style={{ textDecoration: 'none' }}
          >
            <div
              style={{
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '12px',
                color: '#0f6f36',
                padding: '12px 0',
                paddingLeft: '25px',
                borderTop: '1px solid #cdead6',
                width: '136px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <img
                src='/icons/app-store-logo.svg'
                alt='App Store'
                style={{ marginRight: '8px', width: '16px', height: '16px' }}
              />
              <span>App Store</span>
            </div>
          </a>

          {/* Google Play */}

          <a
            href='https://play.google.com/store/apps/details?id=totalctrl.restaurant.manager'
            target='_blank'
            rel='noreferrer'
            style={{ textDecoration: 'none' }}
          >
            <div
              style={{
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '12px',
                color: '#0f6f36',
                padding: '12px 0',
                paddingLeft: '25px',
                borderTop: '1px solid #cdead6',
                width: '136px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <img
                src='/icons/google-play-icon.svg'
                alt='Google Play'
                style={{ marginRight: '6px', width: '18px', height: '18px' }}
              />
              <span>Google Play</span>
            </div>
          </a>
        </div>

        {/* Video Library */}

        <a
          href='https://www.youtube.com/watch?v=dHJzsYbJbrE'
          target='_blank'
          rel='noreferrer'
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            margin: '10px',
            background: '#f2f1ff',
            borderRadius: '7px',
            padding: '0 10px',
            textDecoration: 'none',
          }}
        >
          <div
            style={{
              fontWeight: '600',
              fontSize: '15px',
              lineHeight: '20px',
              display: 'flex',
              alignItems: 'center',
              padding: '10px 0',
              color: '#362a96',
              borderBottom: '1px solid #e6e3ff',
              width: '100%',
            }}
          >
            <img
              src='/icons/video-library.svg'
              alt='Video Library'
              style={{ paddingRight: '17px', width: '40px' }}
            />
            <span>Video Library</span>
          </div>
          <p
            style={{
              fontSize: '12px',
              fontWeight: '400',
              lineHeight: '16px',
              color: '#362a96',
              padding: '6px 0',
              margin: 0,
            }}
          >
            Master the basics of inventory count with TotalCtrl
          </p>
        </a>

        {/* Refer a Friend */}
        <div style={{ display: 'flex', width: '100%' }}>
          <a
            href='https://totalctrl.getrewardful.com/signup?campaign=refer-a-friend-earn-rewards'
            target='_blank'
            rel='noreferrer'
            style={{
              fontWeight: '700',
              lineHeight: '24px',
              fontSize: '14px',
              margin: '10px',
              width: '100%',
              borderRadius: '4px',
              padding: '10px 12px',
              backgroundColor: '#23a956',
              color: '#fff',
              textAlign: 'center',
              letterSpacing: '0.04em',
              textDecoration: 'none',
            }}
          >
            Refer a Friend
          </a>
        </div>

        {/* Divider */}
        <div
          style={{
            margin: '8px 24px',
            height: '1px',
            backgroundColor: '#e5e7eb',
          }}
        />

        {/* Settings */}
        <>
          <button
            ref={settingsBtnRef}
            onClick={() => setSettingsOpen((p) => !p)}
            className={`nav-link flex items-center transition-all duration-200 w-full bg-transparent border-none cursor-pointer ${
              settingsOpen
                ? 'text-[#23A956]'
                : 'text-[#6B6B6F] hover:text-[#19191c]'
            }`}
            style={{
              padding: '0px 25px 0px 29px',
              height: '42px',
              fontSize: '14px',
              fontWeight: '600',
              lineHeight: '24px',
            }}
          >
            <img
              src='/icons/settings.svg'
              alt=''
              className={settingsOpen ? 'settings-active' : ''}
              style={{
                marginRight: '18px',
                width: '24px',
                height: '24px',
                flexShrink: 0,
              }}
            />
            <span>Settings</span>
          </button>

          <SettingsDropdown
            open={settingsOpen}
            onClose={() => setSettingsOpen(false)}
            triggerRef={settingsBtnRef}
            userName='Totalctrl Developer'
            userEmail='totalctrl@dev.com'
            orgName='Totalctrl Developer'
          />
        </>
      </div>
    </div>
  );
}
