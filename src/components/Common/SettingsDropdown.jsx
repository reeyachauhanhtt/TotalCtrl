import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, useLocation } from 'react-router-dom';

const menuItems = [
  { label: 'Personal Settings', icon: '/icons/Account.svg', path: '#' },
  { label: 'Organization Settings', icon: '/icons/suitcase.svg', path: '#' },
  { label: 'Manage Users', icon: '/icons/people.svg', path: '/manage-user' },
  { label: 'Manage Roles', icon: '/icons/roles.svg', path: '#' },
  {
    label: 'Manage Inventories',
    icon: '/icons/box.svg',
    path: '/manage-storage',
  },
  {
    label: 'Manage Item Templates',
    icon: '/icons/products.svg',
    path: '/product-database',
  },
  { label: 'Roles & Permissions', icon: '/icons/roles.svg', path: '#' },
  {
    label: 'Manage Integrations',
    icon: '/icons/manageIntegration.svg',
    path: '#',
  },
  { label: 'General Reports', icon: '/icons/inbox.svg', path: '#' },
];

export default function SettingsDropdown({
  open,
  onClose,
  triggerRef,
  userName,
  orgName,
}) {
  const location = useLocation();
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (
        ref.current &&
        !ref.current.contains(e.target) &&
        triggerRef?.current &&
        !triggerRef.current.contains(e.target)
      ) {
        onClose();
      }
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div
      ref={ref}
      style={{
        position: 'fixed',
        bottom: '62px',
        left: '28px',
        width: '300px',
        backgroundColor: '#fff',
        border: '1px solid #e6e6ed',
        borderRadius: '8px',
        boxShadow: '0px 4px 12px rgba(0,0,0,0.08)',
        zIndex: 99999,
      }}
    >
      {/* Header */}
      <div style={{ padding: '24px 24px 0' }}>
        <h2
          style={{
            fontSize: '22px',
            fontWeight: '600',
            color: '#000',
            margin: '0 0 4px 0',
          }}
        >
          {userName || 'User'}
        </h2>
        <h5 style={{ margin: 0 }}>
          <span
            style={{
              display: 'block',
              fontSize: '14px',
              lineHeight: '20px',
              color: '#6b6b6f',
            }}
          >
            {orgName || ''}
          </span>
        </h5>
        <div
          style={{ borderBottom: '1px solid #e6e6ed', paddingTop: '19px' }}
        />
      </div>

      {/* Menu Items */}
      <div>
        <ul style={{ listStyle: 'none', padding: '12px 0', margin: 0 }}>
          {menuItems.map((item) => {
            const isActive =
              item.path !== '#' && location.pathname === item.path;
            return (
              <li
                key={item.label}
                className='settings-menu-item'
                style={{
                  padding: '8px 28px',
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                }}
              >
                <img
                  src={item.icon}
                  alt=''
                  style={{
                    width: '24px',
                    height: '24px',
                    objectFit: 'scale-down',
                    flexShrink: 0,
                    filter: isActive
                      ? 'invert(47%) sepia(98%) saturate(400%) hue-rotate(95deg) brightness(90%)'
                      : 'none',
                  }}
                />
                {item.path === '#' ? (
                  <a
                    href='#'
                    onClick={(e) => {
                      e.preventDefault();
                      onClose();
                    }}
                    style={{
                      margin: '0 0 0 20px',
                      fontSize: '14px',
                      lineHeight: '14px',
                      fontWeight: '600',
                      color: '#6b6b6f',
                      textDecoration: 'none',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {item.label}
                  </a>
                ) : (
                  <NavLink
                    to={item.path}
                    onClick={onClose}
                    style={{
                      margin: '0 0 0 20px',
                      fontSize: '14px',
                      lineHeight: '14px',
                      fontWeight: '600',
                      color: isActive ? '#23A956' : '#6b6b6f',
                      textDecoration: 'none',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {item.label}
                  </NavLink>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Divider */}
      <div style={{ padding: '0 24px' }}>
        <div style={{ borderBottom: '1px solid #e6e6ed' }} />
      </div>

      {/* Log out */}
      <div style={{ borderRadius: '0 0 4px 4px' }}>
        <ul style={{ listStyle: 'none', padding: '12px 0', margin: 0 }}>
          <li
            onClick={(e) => {
              e.preventDefault();
              onClose();
            }}
            className='settings-menu-item'
            style={{
              padding: '8px 28px',
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
            }}
          >
            <img
              src='/icons/exit.svg'
              alt=''
              style={{
                width: '24px',
                height: '24px',
                objectFit: 'scale-down',
                flexShrink: 0,
              }}
            />

            <a
              href='#'
              style={{
                margin: '0 0 0 20px',
                fontSize: '14px',
                lineHeight: '14px',
                fontWeight: '600',
                color: '#939397',
                textDecoration: 'none',
              }}
            >
              Log out
            </a>
          </li>
        </ul>
      </div>
    </div>,
    document.body,
  );
}
