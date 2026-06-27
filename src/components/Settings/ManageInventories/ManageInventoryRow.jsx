import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import AvatarStack from './AvatarStack';

function ActionsDropdown({ anchorRef, onClose, onEdit, onManageAccess }) {
  const dropdownRef = useRef(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (anchorRef.current && dropdownRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      const dropH = dropdownRef.current.offsetHeight;
      setPos({
        top: rect.bottom + 4,
        left: rect.left - 120,
      });
    }

    function handleClickOutside(e) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !anchorRef.current.contains(e.target)
      ) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return createPortal(
    <div
      ref={dropdownRef}
      className='fixed z-[99999] bg-white border border-[#d7d7db] rounded shadow-md text-[13px] text-[#19191c]'
      style={{ top: pos.top, left: pos.left, minWidth: 160 }}
    >
      <ul className='m-0 p-0 list-none py-2'>
        <li
          className='px-5 py-[8px] cursor-pointer hover:bg-[#fafafc]'
          onClick={() => {
            onEdit();
            onClose();
          }}
        >
          Edit inventory info
        </li>
        <li
          className='px-5 py-[8px] cursor-pointer hover:bg-[#fafafc]'
          onClick={() => {
            onManageAccess();
            onClose();
          }}
        >
          Manage access
        </li>
        <li className='px-5 py-[8px] cursor-pointer hover:bg-[#fafafc]'>
          Deactivate Inventory
        </li>
        <li className='px-5 py-[8px] cursor-pointer hover:bg-[#fafafc]'>
          Delete Inventory
        </li>
      </ul>
    </div>,
    document.body,
  );
}

export default function ManageInventoryRow({ inventory }) {
  const [showActions, setShowActions] = useState(false);
  const moreRef = useRef(null);

  const { name, editors = [], viewers = [], status } = inventory;
  const isActive = status === 'Active';

  return (
    <tr className='border-b border-[#e6e6ed]' style={{ height: 72 }}>
      {/* Inventory name */}
      <td
        className='text-left text-[14px] font-medium text-[#19191c] align-top'
        style={{ width: '18%', paddingTop: 26 }}
      >
        {name}
      </td>

      {/* Editors */}
      <td
        className='text-left align-top'
        style={{ width: '17%', padding: '20px 0px' }}
      >
        <AvatarStack users={editors} />
      </td>

      {/* Viewers */}
      <td
        className='text-left align-top'
        style={{ width: '17%', padding: '20px 0px' }}
      >
        <AvatarStack users={viewers} />
      </td>

      {/* Status */}
      <td
        className='text-left align-top'
        style={{ width: '17%', paddingTop: 26 }}
      >
        <span
          className={`inline-block text-[11px] font-semibold uppercase tracking-[0.08em] rounded px-2 py-[2px] ${
            isActive
              ? 'bg-[#dcf1e3] text-[#0f6f36]'
              : 'bg-[#e7e7ec] text-[#57575b]'
          }`}
        >
          {status}
        </span>
      </td>

      {/* Actions */}
      <td
        className='text-left align-top'
        style={{ width: '5%', paddingTop: 20 }}
      >
        <img
          ref={moreRef}
          src='/img/more_verticle_icon.png'
          alt=''
          className='cursor-pointer hover:brightness-0'
          style={{ marginLeft: 16, padding: '4px 10px' }}
          onClick={() => setShowActions((p) => !p)}
        />
        {showActions && (
          <ActionsDropdown
            anchorRef={moreRef}
            onClose={() => setShowActions(false)}
            onEdit={() => console.log('edit', name)}
            onManageAccess={() => console.log('manage access', name)}
          />
        )}
      </td>
    </tr>
  );
}
