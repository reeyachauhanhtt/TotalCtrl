import { useState, useEffect, useRef, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createPortal } from 'react-dom';
import { FiX, FiChevronDown } from 'react-icons/fi';

import WhiteButton from '../../Common/WhiteButton';
import GreenButton from '../../Common/GreenButton';
import UserAvatar from '../common/UserAvatar';
import {
  fetchStoreUserPermissions,
  updateInventoryAccess,
} from '../../../services/manageInventoriesService';
import {
  PERMISSIONS,
  hasAnyAccess,
  hasNoAccess,
} from '../../../constants/permissions';
import { getUserIdFromToken } from '../../../services/analyticsService';
import { TransferProductListSkeleton } from '../../Common/Skeleton';
import { showErrorToast } from '../../../utils/showToast';

function RoleDropdown({ anchorRef, currentRole, onSelect, onRemove, onClose }) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom + 8, left: rect.right - 274 });
    }
    function handleClickOutside(e) {
      if (
        ref.current &&
        !ref.current.contains(e.target) &&
        !anchorRef.current.contains(e.target)
      ) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return createPortal(
    <ul
      ref={ref}
      className='fixed z-[99999] m-0 p-0 list-none bg-white border border-[#d7d7db] rounded shadow-[0_2px_8px_rgba(0,0,0,0.12)]'
      style={{
        top: pos.top,
        left: pos.left,
        width: 274,
        paddingTop: 15,
        paddingBottom: 0,
      }}
    >
      <li
        className={`flex justify-between cursor-default px-5 py-2 ${currentRole === PERMISSIONS.EDITOR ? 'bg-[#eaf7ee]' : ''}`}
        onClick={() => onSelect(PERMISSIONS.EDITOR)}
      >
        <div>
          <p className='m-0 text-[#19191c] font-semibold text-[14px] flex items-center gap-1'>
            Editor
            {currentRole === PERMISSIONS.EDITOR && (
              <img src='/icons/check-small.svg' alt='' />
            )}
          </p>
          <p className='m-0 text-[#6b6b6f] font-normal text-[12px]'>
            Can do all that the viewer can do, plus check items in and out of
            the inventory, add new products, adjust product quantity
          </p>
        </div>
      </li>

      <li
        className={`flex justify-between cursor-default px-5 py-2 ${currentRole === PERMISSIONS.VIEWER ? 'bg-[#eaf7ee]' : ''}`}
        onClick={() => onSelect(PERMISSIONS.VIEWER)}
      >
        <div>
          <p className='m-0 text-[#19191c] font-semibold text-[14px] flex items-center gap-1'>
            Viewer
            {currentRole === PERMISSIONS.VIEWER && (
              <img src='/icons/check-small.svg' alt='' />
            )}
          </p>
          <p className='m-0 text-[#6b6b6f] font-normal text-[12px]'>
            Can view the inventory and inventory analytics
          </p>
        </div>
      </li>

      <li
        className='flex justify-between cursor-default px-5 border-t border-[#dee2e6]'
        style={{ padding: '14px 20px' }}
        onClick={onRemove}
      >
        <div>
          <p className='m-0 text-[#19191c] font-normal text-[14px]'>
            Remove Access
          </p>
        </div>
      </li>
    </ul>,
    document.body,
  );
}

function AccessRow({
  user,
  role,
  currentUserId,
  onRoleChange,
  onRemoveAccess,
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const ddRef = useRef(null);
  const isCurrentUser = user.id === currentUserId;
  return (
    <div
      className='border-b border-[#dee2e6] flex justify-between items-center w-full'
      style={{ fontSize: 14, height: 72, fontWeight: 600 }}
    >
      <div
        className='flex items-center'
        style={{ height: 32, marginBottom: 10 }}
      >
        <UserAvatar user={user} size={32} />
        <div style={{ marginLeft: 12 }}>
          <span className='block capitalize font-semibold text-[14px] text-[#19191c]'>
            {user.firstName} {user.lastName}{' '}
            {isCurrentUser && (
              <label
                className='font-light'
                style={{ color: '#6b6b6f', fontWeight: 300 }}
              >
                (You)
              </label>
            )}
          </span>
          <span className='block capitalize font-normal text-[12px] text-[#6b6b6f]'>
            {user.jobTitle}
          </span>
        </div>
      </div>

      <div ref={ddRef} className='select-none relative' style={{ width: 130 }}>
        <div
          className='flex items-center justify-between cursor-default'
          style={{
            height: 36,
            width: 130,
            border: '1px solid #dfdfdf',
            borderRadius: 3,
            backgroundColor: '#f1f1f5',
          }}
          onClick={() => setShowDropdown((p) => !p)}
        >
          <div
            className='font-light'
            style={{ margin: '2px 30px 2px 20px', lineHeight: '20px' }}
          >
            {role}
          </div>
          <FiChevronDown size={16} style={{ marginRight: 8 }} />
        </div>

        {showDropdown && (
          <RoleDropdown
            anchorRef={ddRef}
            currentRole={role}
            onClose={() => setShowDropdown(false)}
            onSelect={(newRole) => {
              onRoleChange(user.id, newRole);
              setShowDropdown(false);
            }}
            onRemove={() => {
              onRemoveAccess(user.id);
              setShowDropdown(false);
            }}
          />
        )}
      </div>
    </div>
  );
}

function SearchResultRow({ user, hasAccess, onGiveAccess }) {
  return (
    <div
      className='border-b border-[#dee2e6] flex justify-between items-center w-full cursor-default'
      style={{ fontSize: 14, height: 72, fontWeight: 600, padding: '0 24px' }}
    >
      <div
        className='flex items-center'
        style={{ height: 32, marginBottom: 10 }}
      >
        <UserAvatar user={user} size={32} disabled={hasAccess} />
        <div style={{ marginLeft: 12 }}>
          <span
            className='block capitalize font-semibold text-[14px]'
            style={{ color: hasAccess ? '#939397' : '#19191c' }}
          >
            {user.firstName} {user.lastName}
          </span>
          <span
            className='block capitalize font-normal text-[12px]'
            style={{ color: hasAccess ? '#939397' : '#6b6b6f' }}
          >
            {user.jobTitle}
          </span>
        </div>
      </div>

      {hasAccess ? (
        <span
          className='font-semibold text-[14px]'
          style={{ color: '#939397' }}
        >
          Has access
        </span>
      ) : (
        <span
          className='font-semibold text-[14px] cursor-pointer'
          style={{ color: '#2d9f5a' }}
          onClick={() => onGiveAccess(user.id)}
        >
          Give access
        </span>
      )}
    </div>
  );
}

export default function ManageAccessModal({
  open,
  onClose,
  inventory,
  isLoading,
  accessDetails,
  onSaved,
}) {
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [roleOverrides, setRoleOverrides] = useState({});
  const [saving, setSaving] = useState(false);

  const currentUserId = getUserIdFromToken();
  const searchWrapperRef = useRef(null);
  const queryClient = useQueryClient();

  const { data: permissions = [] } = useQuery({
    queryKey: ['store-user-permissions'],
    queryFn: fetchStoreUserPermissions,
    staleTime: Infinity,
  });

  const roleIdMap = useMemo(() => {
    const map = {};
    permissions.forEach((p) => {
      map[p.name] = p.id;
    });
    return map;
  }, [permissions]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        searchWrapperRef.current &&
        !searchWrapperRef.current.contains(e.target)
      ) {
        setShowSearchResults(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (open) {
      setRoleOverrides({});
      setSearchInput('');
      setDebouncedSearch('');
    }
  }, [open, accessDetails]);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(searchInput), 300);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  const allUsers = accessDetails?.users ?? [];

  const getEffectiveRole = (user) =>
    roleOverrides[user.id] !== undefined
      ? roleOverrides[user.id]
      : user.permissionName;

  const sortByName = (a, b) =>
    `${a.firstName} ${a.lastName}`.localeCompare(
      `${b.firstName} ${b.lastName}`,
    );

  const usersWithAccess = allUsers
    .filter((u) => hasAnyAccess(getEffectiveRole(u)))
    .sort(sortByName);

  const usersWithoutAccess = allUsers.filter(
    (u) => hasNoAccess(getEffectiveRole(u)) || !getEffectiveRole(u),
  );

  const noAccessUsers = allUsers
    .filter((u) => hasNoAccess(getEffectiveRole(u)) || !getEffectiveRole(u))
    .sort(sortByName);

  const hasAccessUsers = allUsers
    .filter((u) => hasAnyAccess(getEffectiveRole(u)))
    .sort(sortByName);

  const sortedAllUsers = [...noAccessUsers, ...hasAccessUsers];

  const searchResults = debouncedSearch
    ? sortedAllUsers.filter((u) =>
        `${u.firstName} ${u.lastName}`
          .toLowerCase()
          .includes(debouncedSearch.toLowerCase()),
      )
    : sortedAllUsers;

  const handleGiveAccess = (userId) => {
    setRoleOverrides((prev) => ({
      ...prev,
      [userId]: PERMISSIONS.VIEWER,
    }));
    setSearchInput('');
    setShowSearchResults(false);
  };

  const handleRoleChange = (userId, newRole) => {
    setRoleOverrides((prev) => ({ ...prev, [userId]: newRole }));
  };

  const handleRemoveAccess = (userId) => {
    setRoleOverrides((prev) => ({ ...prev, [userId]: PERMISSIONS.NO_ACCESS }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const payloadUsers = allUsers.map((u) => {
        const role = getEffectiveRole(u) || PERMISSIONS.NO_ACCESS;
        return {
          id: u.id,
          userPermissionId: roleIdMap[role] ?? u.userPermissionId,
        };
      });

      console.log(
        'payload order',
        payloadUsers.map(
          (u) => `${u.id.slice(0, 8)}: ${u.userPermissionId.slice(0, 8)}`,
        ),
      );

      await updateInventoryAccess(inventory.id, payloadUsers);
      setRoleOverrides({});
      await onSaved();
    } catch (error) {
      console.error('Failed updating access', error);
      showErrorToast?.('Failed to update access — please try again');
      setRoleOverrides({});
      await queryClient.refetchQueries({
        queryKey: ['inventories-with-access'],
      });
      await queryClient.refetchQueries({
        queryKey: ['inventory-access', inventory.id],
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 overflow-auto'>
      <div
        className='bg-white rounded shadow-[0_4px_4px_rgba(0,0,0,0.12)]'
        style={{ width: 760 }}
      >
        <div
          className='rounded-t border-b border-[#dee2e6]'
          style={{ padding: '24px 29px 24px 48px' }}
        >
          <div className='flex items-center justify-between'>
            <h2 className='text-[18px] leading-6 font-bold text-[#333] m-0'>
              {inventory?.name}
            </h2>
            <button onClick={onClose} className='cursor-pointer'>
              <FiX size={20} className='text-gray-600' />
            </button>
          </div>

          <div className='mt-6 relative' ref={searchWrapperRef}>
            <input
              type='text'
              placeholder='Add users...'
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                setShowSearchResults(true);
              }}
              onFocus={() => setShowSearchResults(true)}
              className='w-full outline-none border border-[#d7d7db] focus:border-[#23a956] focus:shadow-[0_0_0_1px_#23a956] rounded'
              style={{ height: 48, padding: '0 16px', fontSize: 14 }}
            />

            {showSearchResults && (
              <div
                className='absolute bg-white border border-[#d7d7db] rounded shadow-[0_4px_11px_rgba(0,0,0,0.1)]'
                style={{
                  top: '100%',
                  left: 0,
                  right: 0,
                  marginTop: 8,
                  maxHeight: 300,
                  overflowY: 'auto',
                  zIndex: 10,
                }}
              >
                {searchResults.length === 0 ? (
                  <div className='px-6 py-4 text-[14px] text-[#6b6b6f]'>
                    No users found
                  </div>
                ) : (
                  searchResults.map((user) => (
                    <SearchResultRow
                      key={user.id}
                      user={user}
                      hasAccess={hasAnyAccess(getEffectiveRole(user))}
                      onGiveAccess={handleGiveAccess}
                    />
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        <div style={{ padding: '0 48px 24px' }}>
          <div
            style={{
              overflowY: 'auto',
              height: 'calc(100vh - 390px)',
            }}
          >
            {isLoading || !accessDetails ? (
              <TransferProductListSkeleton />
            ) : (
              usersWithAccess.map((user) => (
                <AccessRow
                  key={user.id}
                  user={user}
                  role={getEffectiveRole(user)}
                  currentUserId={currentUserId}
                  onRoleChange={handleRoleChange}
                  onRemoveAccess={handleRemoveAccess}
                />
              ))
            )}
          </div>
        </div>

        <div
          className='flex justify-between border-t border-[#dee2e6]'
          style={{ padding: '10px 48px' }}
        >
          <WhiteButton onClick={onClose} className='h-[38px] px-3 py-1.5'>
            Cancel
          </WhiteButton>
          <GreenButton
            className='h-[38px] px-3 py-1.5'
            disabled={saving}
            onClick={handleSave}
          >
            Save changes
          </GreenButton>
        </div>
      </div>
    </div>
  );
}
