import { useState, useRef, useEffect } from 'react';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { createPortal } from 'react-dom';

import AvatarStack from './AvatarStack';
import EditInventoryModal from './EditInventoryModal';
import Modal from './Modal';
import StatusBadge from '../../Common/StatusBadge';
import {
  updateInventoryStatus,
  deleteInventory,
} from '../../../services/manageInventoriesService';
import ManageAccessModal from './ManageAccessModal';
import { showSuccessToast } from '../../../utils/showToast';
import { fetchInventoryAccessDetails } from '../../../services/manageInventoriesService';
import {
  INVENTORY_ACTION_LABELS,
  INVENTORY_CONFIRM_MODAL,
} from '../../../constants/titles';

function ActionsDropdown({
  anchorRef,
  onClose,
  onEdit,
  onManageAccess,
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

  // console.log('permissionMap', permissionMap);
  // console.log('users', users);
  // console.log('editors', editors, 'viewers', viewers);

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
          {INVENTORY_ACTION_LABELS.EDIT_INVENTORY_INFO}
        </li>

        <li
          className='px-5 py-[8px] cursor-pointer hover:bg-[#fafafc]'
          onClick={() => {
            onManageAccess();
            onClose();
          }}
        >
          {INVENTORY_ACTION_LABELS.MANAGE_ACCESS}
        </li>

        <li
          className='px-5 py-[8px] cursor-pointer hover:bg-[#fafafc]'
          onClick={() => {
            onConfirmAction(isCurrentlyActive ? 'deactivate' : 'activate');
            onClose();
          }}
        >
          {isCurrentlyActive
            ? INVENTORY_ACTION_LABELS.DEACTIVATE_INVENTORY
            : INVENTORY_ACTION_LABELS.ACTIVATE_INVENTORY}
        </li>

        <li
          className='px-5 py-[8px] cursor-pointer hover:bg-[#fafafc]'
          onClick={() => {
            onConfirmAction('delete');
            onClose();
          }}
        >
          {INVENTORY_ACTION_LABELS.DELETE_INVENTORY}
        </li>
      </ul>
    </div>,
    document.body,
  );
}

export default function ManageInventoryRow({ inventory, permissionMap }) {
  const queryClient = useQueryClient();

  const [showActions, setShowActions] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [showManageAccess, setShowManageAccess] = useState(false);
  const moreRef = useRef(null);

  const { data: accessDetails, isFetching: isAccessLoading } = useQuery({
    queryKey: ['inventory-access', inventory.id],
    queryFn: () => fetchInventoryAccessDetails(inventory.id),
    enabled: showManageAccess,
    staleTime: 0,
    gcTime: 0,
  });

  const { name, users = [], status, isActive } = inventory;
  const isCurrentlyActive = status?.toLowerCase() === 'active';

  const editors = users.filter(
    (u) => permissionMap[u.userPermissionId] === 'Editor',
  );
  const viewers = users.filter(
    (u) => permissionMap[u.userPermissionId] === 'Viewer',
  );

  const handleConfirm = async () => {
    try {
      if (confirmAction === 'delete') {
        await deleteInventory(inventory.id);
        showSuccessToast('Inventory deleted successfully');
      } else {
        const isActive = confirmAction === 'activate' ? 1 : 0;
        await updateInventoryStatus(inventory.id, isActive);
        showSuccessToast(
          isActive
            ? 'Inventory activated successfully'
            : 'Inventory deactivated successfully',
        );
      }

      setConfirmAction(null);
      queryClient.invalidateQueries({ queryKey: ['inventories-with-access'] });
    } catch (error) {
      console.error('Failed updating inventory', error);
    }
  };

  // console.log('inventory users', inventory.users);
  return (
    <>
      <tr className='border-b border-[#e6e6ed]' style={{ height: 72 }}>
        {/* Inventory name */}
        <td
          className='text-left text-[14px] font-medium text-[#19191c] align-top'
          style={{ width: '18%', paddingTop: 26, paddingLeft: 24 }}
        >
          {name}
        </td>

        {/* Editors */}
        <td
          className='text-left align-top'
          style={{ width: '17%', padding: '20px 0px', paddingLeft: '0.75rem' }}
        >
          <AvatarStack users={editors} />
        </td>

        {/* Viewers */}
        <td
          className='text-left align-top'
          style={{ width: '17%', padding: '20px 0px', paddingLeft: '0.75rem' }}
        >
          <AvatarStack users={viewers} />
        </td>

        {/* Status */}
        <td
          className='text-left align-top'
          style={{ width: '17%', paddingTop: 26, paddingLeft: '0.75rem' }}
        >
          <StatusBadge variant={status} />
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
            style={{ marginLeft: 16, padding: '4px 10px' }}
            onClick={() => setShowActions((p) => !p)}
          />

          {showActions && (
            <ActionsDropdown
              anchorRef={moreRef}
              onClose={() => setShowActions(false)}
              onEdit={() => setShowEdit(true)}
              onManageAccess={() => setShowManageAccess(true)}
              onConfirmAction={setConfirmAction}
              isCurrentlyActive={isCurrentlyActive}
            />
          )}
        </td>
      </tr>

      {createPortal(
        <EditInventoryModal
          open={showEdit}
          onClose={() => setShowEdit(false)}
          inventory={inventory}
        />,
        document.body,
      )}

      {createPortal(
        <Modal
          open={!!confirmAction}
          onClose={() => setConfirmAction(null)}
          title={INVENTORY_CONFIRM_MODAL.title(confirmAction, name)}
          description={
            INVENTORY_CONFIRM_MODAL.description[confirmAction] ??
            INVENTORY_CONFIRM_MODAL.description.delete
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

      {createPortal(
        <ManageAccessModal
          open={showManageAccess}
          onClose={() => setShowManageAccess(false)}
          inventory={inventory}
          accessDetails={accessDetails}
          isLoading={isAccessLoading}
          onSaved={async () => {
            setShowManageAccess(false);

            await queryClient.refetchQueries({
              queryKey: ['inventories-with-access'],
            });
            showSuccessToast('Permission updated successfully');
          }}
        />,
        document.body,
      )}
    </>
  );
}
