import { useState, useRef, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { createPortal } from 'react-dom';

import UserAvatar from '../common/UserAvatar';
import StatusBadge from '../../Common/StatusBadge';
import Modal from '../common/Modal';
import EditUserInfoModal from './EditUserInfoModal';
import ManagePermissionModal from './ManagePermissionModal';
import {
  updateUserStatus,
  deleteUser,
} from '../../../services/manageUserService';
import { showSuccessToast, showErrorToast } from '../../../utils/showToast';
import {
  USER_ACTION_LABELS,
  USER_CONFIRM_MODAL,
} from '../../../constants/titles';
import { PERMISSIONS } from '../../../constants/permissions';

const DUMMY_USER = { name: 'vikas', role: 'Developer' };

const DUMMY_INVENTORIES = [
  { id: 1, name: 'Pinkesh Inventory', access: PERMISSIONS.NO_ACCESS },
  { id: 2, name: 'Temp Empty Inventory', access: PERMISSIONS.NO_ACCESS },
  { id: 3, name: 'Main Inventory', access: PERMISSIONS.NO_ACCESS },
  { id: 4, name: 'Manish Inventory', access: PERMISSIONS.EDITOR },
];

function ActionsDropdown({
  anchorRef,
  onClose,
  onEdit,
  onManagePermission,
  onConfirmAction,
  isCurrentlyActive,
}) {
  const dropdownRef = useRef(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (anchorRef.current && dropdownRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
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
          {USER_ACTION_LABELS.EDIT_USER_INFO}
        </li>

        <li
          className='px-5 py-[8px] cursor-pointer hover:bg-[#fafafc]'
          onClick={() => {
            onManagePermission();
            onClose();
          }}
        >
          {USER_ACTION_LABELS.MANAGE_PERMISSION}
        </li>

        <li
          className='px-5 py-[8px] cursor-pointer hover:bg-[#fafafc]'
          onClick={() => {
            onConfirmAction(isCurrentlyActive ? 'deactivate' : 'activate');
            onClose();
          }}
        >
          {isCurrentlyActive
            ? USER_ACTION_LABELS.DEACTIVATE_USER
            : USER_ACTION_LABELS.ACTIVATE_USER}
        </li>

        <li
          className='px-5 py-[8px] cursor-pointer hover:bg-[#fafafc]'
          onClick={() => {
            onConfirmAction('delete');
            onClose();
          }}
        >
          {USER_ACTION_LABELS.DELETE_USER}
        </li>
      </ul>
    </div>,
    document.body,
  );
}

export default function ManageUserRow({ user }) {
  const queryClient = useQueryClient();

  const [showActions, setShowActions] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);

  const moreRef = useRef(null);

  const {
    firstName,
    lastName,
    jobTitle,
    email,
    userName,
    userRoleName,
    status,
  } = user;

  const isCurrentlyActive = !!status;

  const handleConfirm = async () => {
    try {
      if (confirmAction === 'delete') {
        await deleteUser(user.id);
        showSuccessToast(`User ${firstName} ${lastName} deleted successfully`);
      } else {
        const nextStatus = confirmAction === 'activate';
        await updateUserStatus(user.id, nextStatus);
        showSuccessToast(
          nextStatus
            ? 'User activated successfully'
            : 'User deactivated successfully',
        );
      }

      setConfirmAction(null);
      queryClient.invalidateQueries({ queryKey: ['store-users'] });
    } catch (error) {
      console.error('Failed updating user', error);
      showErrorToast(error?.response?.data?.message ?? 'Failed to update user');
    }
  };

  return (
    <>
      <tr className='border-b border-[#e6e6ed]' style={{ height: 72 }}>
        {/* Full name */}
        <td
          className='text-left align-top'
          style={{ width: '18%', paddingTop: 26 }}
        >
          <div className='flex'>
            <UserAvatar user={user} disabled={!isCurrentlyActive} />

            <div style={{ marginLeft: 12, marginBottom: 25 }}>
              <span
                className={`block font-semibold text-[14px] leading-5 capitalize ${
                  isCurrentlyActive ? 'text-[#19191c]' : 'text-[#a3a3a8]'
                }`}
              >
                {firstName} {lastName}
              </span>
              <span
                className={`block text-[13px] leading-4 capitalize ${
                  isCurrentlyActive ? 'text-[#6b6b6f]' : 'text-[#a3a3a8]'
                }`}
              >
                {jobTitle}
              </span>
            </div>
          </div>
        </td>

        {/* Email / Username */}
        <td
          className={`text-left align-top text-[14px] ${
            isCurrentlyActive ? 'text-[#19191c]' : 'text-[#a3a3a8]'
          }`}
          style={{ width: '30%', paddingTop: 35, paddingLeft: '0.75rem' }}
        >
          {email ?? userName}
        </td>

        {/* User Role */}
        <td
          className={`text-left align-top text-[14px] capitalize ${
            isCurrentlyActive ? 'text-[#19191c]' : 'text-[#a3a3a8]'
          }`}
          style={{ width: '8%', paddingTop: 35, paddingLeft: '1.5rem' }}
        >
          {userRoleName}
        </td>

        {/* Status */}
        <td
          className='text-left align-top'
          style={{ width: '14%', paddingTop: 35, paddingLeft: '0.75rem' }}
        >
          <StatusBadge variant={isCurrentlyActive ? 'active' : 'inactive'} />
        </td>

        {/* Actions */}
        <td
          className='text-left align-top'
          style={{
            width: '5%',
            paddingTop: 20,
            paddingLeft: '0.75rem',
            paddingRight: 24,
          }}
        >
          <img
            ref={moreRef}
            src='/img/more_verticle_icon.png'
            alt=''
            className='cursor-pointer hover:brightness-0'
            style={{ padding: '4px 10px' }}
            onClick={() => setShowActions((p) => !p)}
          />

          {showActions && (
            <ActionsDropdown
              anchorRef={moreRef}
              onClose={() => setShowActions(false)}
              onEdit={() => setShowEdit(true)}
              onManagePermission={() => setIsPermissionModalOpen(true)}
              onConfirmAction={setConfirmAction}
              isCurrentlyActive={isCurrentlyActive}
            />
          )}
        </td>
      </tr>

      {createPortal(
        <EditUserInfoModal
          open={showEdit}
          onClose={() => setShowEdit(false)}
          user={user}
        />,
        document.body,
      )}

      {createPortal(
        <Modal
          open={!!confirmAction}
          onClose={() => setConfirmAction(null)}
          title={USER_CONFIRM_MODAL.title(
            confirmAction,
            `${firstName} ${lastName}`,
          )}
          description={
            USER_CONFIRM_MODAL.description[confirmAction] ??
            USER_CONFIRM_MODAL.description.delete
          }
          actionText={
            confirmAction === 'activate'
              ? 'Activate'
              : confirmAction === 'deactivate'
                ? 'Deactivate'
                : 'Delete'
          }
          actionType={confirmAction}
          onConfirm={handleConfirm}
        />,
        document.body,
      )}

      {isPermissionModalOpen && (
        <ManagePermissionModal
          isOpen={isPermissionModalOpen}
          onClose={() => setIsPermissionModalOpen(false)}
          user={user}
        />
      )}
    </>
  );
}
