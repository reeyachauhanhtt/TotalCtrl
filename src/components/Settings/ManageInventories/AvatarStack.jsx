import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

import { getUserIdFromToken } from '../../../services/analyticsService';
import UserAvatar from '../common/UserAvatar';

function AvatarTooltip({ user, anchorRef, isCurrentUser }) {
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
            <UserAvatar user={user} size={32} />

            <div>
              <span className='block text-[14px] font-semibold text-[#19191c] capitalize leading-5'>
                {user.firstName} {user.lastName}
                {isCurrentUser ? ' (You)' : ''}
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

function Avatar({ user, index, total, isCurrentUser }) {
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
      <UserAvatar user={user} size={32} />

      {showTooltip && (
        <AvatarTooltip
          user={user}
          anchorRef={ref}
          isCurrentUser={isCurrentUser}
        />
      )}
    </div>
  );
}

export default function AvatarStack({ users = [], maxVisible = 4 }) {
  if (!users.length) return null;

  const visible = users.slice(0, maxVisible);
  const width = (visible.length - 1) * 28 + 32;

  const currentUserId = getUserIdFromToken();

  return (
    <div className='relative' style={{ width, height: 32 }}>
      {visible.map((user, index) => (
        <Avatar
          key={user.id}
          user={user}
          index={index}
          total={visible.length}
          isCurrentUser={user.id === currentUserId}
        />
      ))}
    </div>
  );
}
