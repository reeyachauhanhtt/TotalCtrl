import { useState, useEffect } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { createPortal } from 'react-dom';

import WhiteButton from '../../Common/WhiteButton';
import GreenButton from '../../Common/GreenButton';
import FormInput from '../../Common/Input';
import {
  MANAGE_ROLES_MODAL_TITLES,
  VALIDATION_LABELS,
} from '../../../constants/titles';
import { updateRole } from '../../../services/manageRolesService';
import ToggleSwitch from './ToggleSwitch';
import { showSuccessToast, showErrorToast } from '../../../utils/showToast';

export default function EditRoleModal({ open, onClose, role }) {
  const queryClient = useQueryClient();

  const [roleName, setRoleName] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [dirty, setDirty] = useState({ roleName: false, description: false });

  useEffect(() => {
    if (open && role) {
      setRoleName(role.name ?? '');
      setDescription(role.description ?? '');
      setIsActive(!!role.isActive);
      setDirty({ roleName: false, description: false });
    }
  }, [open, role]);

  const roleNameError = dirty.roleName && roleName.trim() === '';
  const descriptionError = dirty.description && description.trim() === '';
  const isValid = roleName.trim() !== '' && description.trim() !== '';

  const { mutate: submitEditRole, isPending } = useMutation({
    mutationFn: () =>
      updateRole(role.id, {
        name: roleName.trim(),
        description: description.trim(),
        isActive,
      }),
    onSuccess: () => {
      showSuccessToast('User Role updated successfully');
      queryClient.invalidateQueries({ queryKey: ['store-roles'] });
      onClose();
    },
    onError: (error) => {
      showErrorToast(error?.response?.data?.Message ?? 'Failed to update role');
    },
  });

  if (!open) return null;

  return createPortal(
    <div className='fixed inset-0 z-[1] flex items-center bg-black/40 overflow-auto'>
      <div
        className='mx-auto rounded'
        style={{
          width: 480,
          boxShadow: '0 4px 4px rgba(0,0,0,.12)',
          backgroundColor: '#fff',
        }}
      >
        {/* Header */}
        <div
          className='flex bg-[#fafafc] border-b border-[#dee2e6] rounded-t'
          style={{ padding: '24px 29px 24px 48px' }}
        >
          <h2 className='mr-[29px] w-[95%] font-semibold text-[18px] leading-6 text-[#333]'>
            {MANAGE_ROLES_MODAL_TITLES.EDIT_ROLE}
          </h2>
          <span className='cursor-pointer' onClick={onClose}>
            <img src='/icons/closepopup-icon.svg' alt='close' />
          </span>
        </div>

        {/* Body */}
        <div
          style={{
            fontSize: 16,
            lineHeight: '24px',
            color: '#737373',
            padding: '36px 48px 24px',
          }}
        >
          <form style={{ width: '100%' }}>
            <div style={{ marginBottom: 28, position: 'relative' }}>
              <label
                className='block mb-1'
                style={{
                  fontWeight: 600,
                  fontSize: 11,
                  lineHeight: '16px',
                  textTransform: 'uppercase',
                  color: '#6b6b6f',
                  letterSpacing: '.08em',
                }}
              >
                Role Name*
              </label>
              <FormInput
                type='text'
                value={roleName}
                onChange={(e) => {
                  setRoleName(e.target.value);
                  setDirty((d) => ({ ...d, roleName: true }));
                }}
                error={roleNameError}
                errorMessage={VALIDATION_LABELS.FIELD_REQUIRED}
              />
            </div>

            <div style={{ marginBottom: 28, position: 'relative' }}>
              <label
                className='block mb-1'
                style={{
                  fontWeight: 600,
                  fontSize: 11,
                  lineHeight: '16px',
                  textTransform: 'uppercase',
                  color: '#6b6b6f',
                  letterSpacing: '.08em',
                }}
              >
                Description*
              </label>
              <FormInput
                multiline
                rows={4}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setDirty((d) => ({ ...d, description: true }));
                }}
                error={descriptionError}
                errorMessage={VALIDATION_LABELS.FIELD_REQUIRED}
                placeholder='Enter description'
              />
            </div>

            <div
              className='flex justify-between items-center'
              style={{ padding: '12px 0', fontSize: 16, color: '#19191c' }}
            >
              <label
                style={{
                  fontWeight: 600,
                  fontSize: 11,
                  lineHeight: '16px',
                  textTransform: 'uppercase',
                  color: '#6b6b6f',
                  letterSpacing: '.08em',
                }}
              >
                Active / Inactive
              </label>
              <ToggleSwitch checked={isActive} onChange={setIsActive} />
            </div>
          </form>
        </div>

        {/* Footer */}
        <div
          className='flex justify-between border-t border-[#dee2e6]'
          style={{ padding: '10px 32px' }}
        >
          <WhiteButton
            className='py-1.5 px-4 hover:border-gray-900 hover:text-gray-900'
            onClick={onClose}
          >
            Cancel
          </WhiteButton>
          <GreenButton
            className='py-1.5 px-4'
            disabled={!isValid || isPending}
            onClick={() => submitEditRole()}
          >
            Save Changes
          </GreenButton>
        </div>
      </div>
    </div>,
    document.body,
  );
}
