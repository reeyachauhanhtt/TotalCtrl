import { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { FiX, FiCheck } from 'react-icons/fi';

import UserAvatar from '../common/UserAvatar';
import GreenButton from '../../Common/GreenButton';
import WhiteButton from '../../Common/WhiteButton';
import {
  PERMISSIONS,
  PERMISSION_DESCRIPTIONS,
} from '../../../constants/permissions';
import { MANAGE_USER_MODAL_TITLES } from '../../../constants/titles';
import { fetchStoreUserPermissions } from '../../../services/manageInventoriesService';
import {
  fetchUserInventoryPermissions,
  saveUserInventoryPermissions,
} from '../../../services/manageUserService';
import { showSuccessToast, showErrorToast } from '../../../utils/showToast';

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
        className='flex items-center justify-between h-9 w-[110px] rounded border border-[#dfdfdf] bg-[#f1f1f5] cursor-default'
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className='ml-4 font-medium text-[13px] leading-5'>{value}</span>
        <img src='/icons/chevron-down-small.svg' alt='' className='mr-2' />
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

export default function ManagePermissionModal({ isOpen, onClose, user }) {
  const queryClient = useQueryClient();
  const [roleOverrides, setRoleOverrides] = useState({});
  const [saving, setSaving] = useState(false);
  const [permissions, setPermissions] = useState([]);

  const { data: permissionTypes = [] } = useQuery({
    queryKey: ['store-user-permissions'],
    queryFn: fetchStoreUserPermissions,
    staleTime: Infinity,
  });

  const { data: inventoryPermissions = [], isFetching: loadingInventories } =
    useQuery({
      queryKey: ['user-inventory-permissions', user?.id],
      queryFn: () => fetchUserInventoryPermissions(user.id),
      enabled: isOpen && !!user?.id,
    });

  const idToRoleMap = useMemo(() => {
    const map = {};
    permissionTypes.forEach((p) => {
      map[p.id] = p.name;
    });
    return map;
  }, [permissionTypes]);

  const roleToIdMap = useMemo(() => {
    const map = {};
    permissionTypes.forEach((p) => {
      map[p.name] = p.id;
    });
    return map;
  }, [permissionTypes]);

  useEffect(() => {
    if (isOpen) setRoleOverrides({});
  }, [isOpen, user?.id]);

  if (!isOpen) return null;

  const getEffectiveRole = (inv) =>
    roleOverrides[inv.inventoryId] ??
    idToRoleMap[inv.userPermissionId] ??
    PERMISSIONS.NO_ACCESS;

  const handleAccessChange = (inventoryId, newRole) => {
    setRoleOverrides((prev) => ({ ...prev, [inventoryId]: newRole }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = inventoryPermissions.map((inv) => {
        const role = getEffectiveRole(inv);
        return {
          inventoryId: inv.inventoryId,
          userPermissionId: roleToIdMap[role] ?? inv.userPermissionId,
        };
      });

      await saveUserInventoryPermissions(user.id, payload);
      showSuccessToast('Permissions updated successfully');
      queryClient.invalidateQueries({
        queryKey: ['user-inventory-permissions', user.id],
      });
      queryClient.invalidateQueries({ queryKey: ['inventories'] });
      onClose();
    } catch (error) {
      console.error('Failed updating permissions', error);
      showErrorToast(
        error?.response?.data?.message ?? 'Failed to update permissions',
      );
    } finally {
      setSaving(false);
    }
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
            <FiX size={20} className='text-gray-900' />
          </span>
        </div>

        {/* User info */}
        <div className='flex items-center px-11 mt-10'>
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
          {loadingInventories ? (
            <div className='text-sm text-[#6b6b6f]'>Loading...</div>
          ) : (
            inventoryPermissions.map((inv) => (
              <div className='border-t border-[#dee2e6]' key={inv.inventoryId}>
                <div
                  key={inv.inventoryId}
                  className='flex justify-between items-center h-[72px] text-sm font-semibold text-[#19191c]'
                >
                  <label>{inv.inventory}</label>
                  <AccessDropdown
                    value={getEffectiveRole(inv)}
                    options={[
                      PERMISSIONS.EDITOR,
                      PERMISSIONS.VIEWER,
                      PERMISSIONS.NO_ACCESS,
                    ]}
                    onChange={(newRole) =>
                      handleAccessChange(inv.inventoryId, newRole)
                    }
                  />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className='flex justify-between border-t border-[#dee2e6] px-8 py-[10px]'>
          <WhiteButton
            size='small'
            className='hover:border-gray-900 hover:text-gray-900
'
            onClick={onClose}
          >
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
