import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

function getInitials(firstName, lastName) {
  const first = firstName?.[0] || '';
  const last = lastName?.[0] || '';
  return (first + last).toUpperCase();
}

function AvatarTooltip({ user, anchorRef }) {
  const tooltipRef = useRef(null);
  const [pos, setPos] = useState({ top: -9999, left: -9999 });

  useEffect(() => {
    if (anchorRef.current && tooltipRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      const tooltipH = tooltipRef.current.offsetHeight;
      setPos({
        top: rect.top - tooltipH - 8,
        left: rect.left,
      });
    }
  }, []);

  return createPortal(
    <div
      ref={tooltipRef}
      className='fixed z-[99999] bg-white border border-[#d7d7db] rounded shadow-md text-[13px] text-[#19191c]'
      style={{ top: pos.top, left: pos.left, minWidth: 180 }}
    >
      <ul className='m-0 p-0 list-none'>
        <li className='px-[17px] py-[11px]'>
          <div className='flex items-center gap-3'>
            <div
              className='w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-[10px] font-semibold border border-white'
              style={{ backgroundColor: user.avatarColor }}
            >
              {getInitials(user.firstName, user.lastName)}
            </div>
            <div>
              <span className='block text-[14px] font-semibold text-[#19191c] capitalize leading-5'>
                {user.firstName} {user.lastName}
              </span>
              <span className='block text-[12px] text-[#6b6b6f] capitalize font-normal'>
                {user.jobTitle}
              </span>
            </div>
          </div>
        </li>
      </ul>
    </div>,
    document.body,
  );
}
function Avatar({ user, index, total }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const ref = useRef(null);

  return (
    <div
      ref={ref}
      className='absolute cursor-pointer'
      style={{
        left: index * 28,
        zIndex: total - index,
        width: 32,
        height: 32,
      }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div
        className='w-8 h-8 rounded-full flex items-center justify-center text-white text-[13px] font-semibold border border-white'
        style={{ backgroundColor: user.avatarColor }}
      >
        {getInitials(user.firstName, user.lastName)}
      </div>
      {showTooltip && <AvatarTooltip user={user} anchorRef={ref} />}
    </div>
  );
}

export default function AvatarStack({ users = [], maxVisible = 4 }) {
  if (!users.length) return null;

  const visible = users.slice(0, maxVisible);
  const width = (visible.length - 1) * 28 + 32;

  return (
    <div className='relative' style={{ width, height: 32 }}>
      {visible.map((user, index) => (
        <Avatar
          key={user.id}
          user={user}
          index={index}
          total={visible.length}
        />
      ))}
    </div>
  );
}
