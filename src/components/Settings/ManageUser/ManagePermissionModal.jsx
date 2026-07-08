import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FiChevronDown, FiX, FiCheck } from 'react-icons/fi';

import UserAvatar from '../common/UserAvatar';
import GreenButton from '../../Common/GreenButton';
import WhiteButton from '../../Common/WhiteButton';
import {
  PERMISSIONS,
  PERMISSION_DESCRIPTIONS,
} from '../../../constants/permissions';
import { MANAGE_USER_MODAL_TITLES } from '../../../constants/titles';

const DEFAULT_ROLE_OPTIONS = [
  PERMISSIONS.EDITOR,
  PERMISSIONS.NO_ACCESS,
  PERMISSIONS.VIEWER,
];

function AccessDropdown({ value, options, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div ref={wrapperRef} className='relative select-none w-[100px] mr-6'>
      <div
        className='flex items-center justify-between h-9 w-[100px] rounded border border-[#dfdfdf] bg-[#f1f1f5] cursor-default'
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className='ml-4 font-light text-sm leading-5'>{value}</span>
        <FiChevronDown size={14} className='mr-2 text-gray-500' />
      </div>

      {isOpen && (
        <ul
          className='absolute right-0 mt-2 z-10 bg-white border border-[#d7d7db] rounded shadow-[0_2px_8px_rgba(0,0,0,0.12)] py-[15px] overflow-y-auto'
          style={{ width: 274 }}
        >
          {options.map((option) => {
            const isSelected = option === value;
            return (
              <li
                key={option}
                className={`flex justify-between px-5 py-2 text-sm cursor-default hover:bg-[#f1f1f5] ${
                  isSelected ? 'bg-[#eaf7ee]' : ''
                }`}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
              >
                <div>
                  <p className='flex items-center gap-1 text-[#19191c] font-semibold text-sm m-0'>
                    {option}
                    {isSelected && <img src='/icons/check-small.svg' alt='' />}
                  </p>
                  <p className='text-[#6b6b6f] font-normal text-xs m-0 mt-0.5 whitespace-normal'>
                    {PERMISSION_DESCRIPTIONS[option]}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default function ManagePermissionModal({
  isOpen,
  onClose,
  user, // { name, role }
  inventories, // [{ id, name, access }]
  roleOptions = DEFAULT_ROLE_OPTIONS,
  onSave,
}) {
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    if (isOpen) setPermissions(inventories);
  }, [isOpen, inventories]);

  if (!isOpen) return null;

  const handleAccessChange = (inventoryId, newAccess) => {
    setPermissions((prev) =>
      prev.map((inv) =>
        inv.id === inventoryId ? { ...inv, access: newAccess } : inv,
      ),
    );
  };

  const handleSave = () => {
    onSave(permissions);
    onClose();
  };

  return createPortal(
    <div className='fixed inset-0 z-[1] flex items-center bg-black/40 overflow-auto'>
      <div className='bg-white rounded mx-auto shadow-[0_4px_4px_rgba(0,0,0,0.12)] w-[600px]'>
        {/* Header */}
        <div className='flex justify-between bg-[#fafafc] rounded-t pt-6 pb-6 pl-12 pr-[29px] border-b border-[#dee2e6]'>
          <h2 className='text-lg font-bold leading-6 text-[#333] w-[95%] mr-[29px]'>
            {MANAGE_USER_MODAL_TITLES.MANAGE_STORAGE_ACCESS}
          </h2>
          <span className='cursor-pointer' onClick={onClose}>
            <FiX size={18} className='text-gray-500' />
          </span>
        </div>

        {/* User info */}
        <div className='flex items-center px-11 mt-10 border-b border-[#eee]'>
          <UserAvatar user={user} size={40} />
          <div className='ml-3'>
            <span className='block text-[20px] font-semibold capitalize text-[#333]'>
              {user.firstName} {user.lastName}
            </span>
            <span className='block text-[#6b6b6f] text-[14px] capitalize'>
              {user.jobTitle}
            </span>
          </div>
        </div>

        {/* Inventory list */}
        <div
          className='overflow-y-auto px-12 pt-2 pb-6'
          style={{ height: 'calc(100vh - 300px)' }}
        >
          {permissions.map((inv) => (
            <div className='border-t border-[#dee2e6]'>
              <div
                key={inv.id}
                className='flex justify-between items-center h-[72px] border-b border-[#dee2e6] text-sm font-semibold text-[#19191c]'
              >
                <label>{inv.name}</label>
                <AccessDropdown
                  value={inv.access}
                  options={roleOptions}
                  onChange={(newAccess) =>
                    handleAccessChange(inv.id, newAccess)
                  }
                />
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className='flex justify-between border-t border-[#dee2e6] px-8 py-[10px]'>
          <WhiteButton size='small' onClick={onClose}>
            Cancel
          </WhiteButton>
          <GreenButton size='small' onClick={handleSave}>
            Save changes
          </GreenButton>
        </div>
      </div>
    </div>,
    document.body,
  );
}
