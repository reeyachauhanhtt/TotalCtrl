import { useState, useRef, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { createPortal } from 'react-dom';

import StatusBadge from '../../Common/StatusBadge';
import Modal from '../common/Modal';
import {
  ROLE_ACTION_LABELS,
  ROLE_CONFIRM_MODAL,
} from '../../../constants/titles';
import EditRoleModal from './EditRoleModal';
import { deleteRole } from '../../../services/manageRolesService';
import { showSuccessToast, showErrorToast } from '../../../utils/showToast';

function ActionsDropdown({ anchorRef, onClose, onEdit, onDelete }) {
  const dropdownRef = useRef(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (anchorRef.current && dropdownRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      const dropdownHeight = dropdownRef.current.offsetHeight;
      const spaceBelow = window.innerHeight - rect.bottom;

      const top =
        spaceBelow < dropdownHeight
          ? rect.top - dropdownHeight - 4
          : rect.bottom + 4;
      setPos({ top, left: rect.left - 120 });
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
      style={{ top: pos.top, left: pos.left, minWidth: 100 }}
    >
      <ul className='list-none py-1'>
        <li
          className='px-5 py-[4px] cursor-pointer hover:bg-[#fafafc]'
          onClick={() => {
            onEdit();
            onClose();
          }}
        >
          {ROLE_ACTION_LABELS.EDIT_ROLE}
        </li>

        <li
          className='px-5 py-[4px] cursor-pointer hover:bg-[#fafafc]'
          onClick={() => {
            onDelete();
            onClose();
          }}
        >
          {ROLE_ACTION_LABELS.DELETE_ROLE}
        </li>
      </ul>
    </div>,
    document.body,
  );
}

export default function ManageRolesRow({ role }) {
  const queryClient = useQueryClient();
  const [showActions, setShowActions] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const moreRef = useRef(null);

  const { name: roleName, description, storeId, isActive } = role;
  const isSystemRole = storeId === '0';
  const isEditable = storeId !== '0';
  const status = isActive ? 'active' : 'inactive';

  const handleConfirmDelete = async () => {
    try {
      await deleteRole(role.id);
      showSuccessToast('User Role deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['store-roles'] });
      setConfirmDelete(false);
    } catch (error) {
      console.error('Failed deleting role', error);
      showErrorToast(error?.response?.data?.Message ?? 'Failed to delete role');
    }
  };

  return (
    <>
      <tr className='border-b border-[#e6e6ed]' style={{ height: 72 }}>
        {/* Role name */}
        <td
          className='text-left align-top'
          style={{
            width: '18%',
            paddingTop: 35,
            paddingBottom: 30,
            paddingLeft: '0.75rem',
          }}
        >
          <span className='block font-semibold text-[14px] leading-5 text-[#19191c] capitalize'>
            {roleName}
            {isSystemRole && (
              <>
                <br />
                <label className='font-light text-[#6b6b6f] text-[14px]'>
                  System
                </label>
              </>
            )}
          </span>
        </td>

        {/* Description */}
        <td
          className='text-left align-top text-[14px] text-[#19191c]'
          style={{
            width: '38%',
            paddingTop: 35,
            paddingBottom: 30,
            paddingLeft: '0.75rem',
          }}
        >
          {description}
        </td>

        {/* Status */}
        <td
          className='text-left align-top'
          style={{
            width: '14%',
            paddingTop: 35,
            paddingBottom: 30,
            paddingLeft: '0.75rem',
          }}
        >
          <StatusBadge variant={status} />
        </td>

        {/* Actions */}
        <td
          className='text-left align-top'
          style={{
            width: '5%',
            paddingTop: 35,
            paddingBottom: 30,
            paddingLeft: '0.75rem',
          }}
        >
          <img
            ref={moreRef}
            src='/img/more_verticle_icon.png'
            alt=''
            className={
              isEditable
                ? 'cursor-pointer hover:brightness-0'
                : 'cursor-not-allowed opacity-50'
            }
            style={{ padding: '4px 10px' }}
            onClick={() => isEditable && setShowActions((p) => !p)}
          />

          {showActions && isEditable && (
            <ActionsDropdown
              anchorRef={moreRef}
              onClose={() => setShowActions(false)}
              onEdit={() => setShowEdit(true)}
              onDelete={() => setConfirmDelete(true)}
            />
          )}
        </td>
      </tr>

      <EditRoleModal
        open={showEdit}
        onClose={() => setShowEdit(false)}
        role={role}
      />

      {createPortal(
        <Modal
          open={confirmDelete}
          onClose={() => setConfirmDelete(false)}
          title={ROLE_CONFIRM_MODAL.title('delete', roleName)}
          description={ROLE_CONFIRM_MODAL.description.delete}
          actionText='Delete'
          actionType='delete'
          onConfirm={handleConfirmDelete}
        />,
        document.body,
      )}
    </>
  );
}
