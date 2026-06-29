import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

import AvatarStack from './AvatarStack';
import EditInventoryModal from './EditInventoryModal';
import Modal from './Modal';
import StatusBadge from '../../Common/StatusBadge';
import { updateInventoryStatus } from '../../../services/manageInventoriesService';

function ActionsDropdown({
  anchorRef,
  onClose,
  onEdit,
  onManageAccess,
  onConfirmAction,
  isActive,
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

        <li
          className='px-5 py-[8px] cursor-pointer hover:bg-[#fafafc]'
          onClick={() => {
            // onConfirmAction(isActive === 1 ? 'deactivate' : 'activate');
            onConfirmAction(Number(isActive) === 1 ? 'deactivate' : 'activate');
            onClose();
          }}
        >
          {Number(isActive) === 1
            ? 'Deactivate Inventory'
            : 'Activate Inventory'}
        </li>

        <li
          className='px-5 py-[8px] cursor-pointer hover:bg-[#fafafc]'
          onClick={() => {
            onConfirmAction('delete');
            onClose();
          }}
        >
          Delete Inventory
        </li>
      </ul>
    </div>,
    document.body,
  );
}

export default function ManageInventoryRow({ inventory, permissionMap }) {
  const [showActions, setShowActions] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const moreRef = useRef(null);

  const { name, users = [], status, isActive } = inventory;

  const editors = users.filter(
    (u) => permissionMap[u.userPermissionId] === 'Editor',
  );
  const viewers = users.filter(
    (u) => permissionMap[u.userPermissionId] === 'Viewer',
  );

  const handleInventoryStatus = async () => {
    try {
      const isActive = confirmAction === 'activate' ? 1 : 0;

      await updateInventoryStatus(inventory.id, isActive);

      setConfirmAction(null);

      // refresh table data here
      console.log('inventory updated');
    } catch (error) {
      console.error('Failed updating inventory status', error);
    }
  };

  return (
    <>
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
          <StatusBadge variant={status} />
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
              onEdit={() => setShowEdit(true)}
              onManageAccess={() => console.log('manage access', name)}
              onConfirmAction={setConfirmAction}
              isActive={isActive}
            />
          )}
        </td>

        <EditInventoryModal
          open={showEdit}
          onClose={() => setShowEdit(false)}
          inventory={inventory}
        />

        <Modal
          open={!!confirmAction}
          onClose={() => setConfirmAction(null)}
          title={`Are you sure you want to ${confirmAction} ${name}?`}
          description={
            confirmAction === 'activate'
              ? 'If you activate this inventory, it will be visible to the users which can see and edit it in the web administration and the mobile app.'
              : 'If you deactivate this inventory, it won’t be visible to the users anymore.'
          }
          actionText={confirmAction === 'activate' ? 'Activate' : 'Deactivate'}
          actionType={confirmAction}
          onConfirm={handleInventoryStatus}
        />
      </tr>
    </>
  );
}
