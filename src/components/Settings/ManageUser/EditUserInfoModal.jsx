import { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import GreenButton from '../../Common/GreenButton';
import WhiteButton from '../../Common/WhiteButton';
import FormInput from '../../Common/Input';
import RoleSelect from './RoleSelectDropdown';
import { TransferProductListSkeleton } from '../../Common/Skeleton';
import { showSuccessToast, showErrorToast } from '../../../utils/showToast';
import {
  VALIDATION_LABELS,
  MANAGE_USER_MODAL_TITLES,
} from '../../../constants/titles';
import { REGEX } from '../../../constants/regex';
import {
  fetchUserRoles,
  fetchAdminEmails,
  updateUser,
  fetchStoreUserById,
} from '../../../services/manageUserService';

export default function EditUserInfoModal({ open, onClose, user: userRow }) {
  const [fullName, setFullName] = useState('');
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [role, setRole] = useState(null);
  const [adminEmail, setAdminEmail] = useState(null);
  const [errors, setErrors] = useState({});

  const queryClient = useQueryClient();

  const { data: user, isFetching: isUserLoading } = useQuery({
    queryKey: ['store-user-detail', userRow?.id],
    queryFn: () => fetchStoreUserById(userRow.id),
    enabled: open && !!userRow?.id,
    staleTime: 0,
    gcTime: 0,
  });

  const { data: rolesData } = useQuery({
    queryKey: ['userRoles'],
    queryFn: fetchUserRoles,
    staleTime: 60_000,
    enabled: open,
  });

  const { data: adminsData } = useQuery({
    queryKey: ['adminEmails'],
    queryFn: fetchAdminEmails,
    staleTime: 60_000,
    enabled: open,
  });

  const roleOptions = useMemo(
    () =>
      (rolesData ?? []).map((r) => ({
        value: r.id,
        label: r.name,
        description: r.description ?? '',
      })),
    [rolesData],
  );

  const adminEmailOptions = useMemo(
    () =>
      (adminsData ?? [])
        .filter((a) => a.email)
        .map((a) => ({
          value: a.id,
          label: `${a.email} (${[a.firstName, a.lastName]
            .filter(Boolean)
            .join(' ')})`,
        })),
    [adminsData],
  );

  useEffect(() => {
    if (!open || !user) return;

    setFullName(
      [user.firstName, user.lastName].filter(Boolean).join(' ').trim(),
    );
    setEmailOrUsername(user.email || user.userName || '');
    setJobTitle(user.jobTitle || '');
    setErrors({});
  }, [open, user]);

  useEffect(() => {
    if (!open || !user) return;
    if (roleOptions.length === 0) {
      setRole({
        value: user.userRoleId,
        label: user.userRoleName,
        description: '',
      });
      return;
    }
    const matched = roleOptions.find((r) => r.value === user.userRoleId);
    setRole(
      matched ?? {
        value: user.userRoleId,
        label: user.userRoleName,
        description: '',
      },
    );
  }, [open, user, roleOptions]);

  useEffect(() => {
    if (!open || !user) return;
    if (!user.referenceUserId) {
      setAdminEmail(null);
      return;
    }
    const matched = adminEmailOptions.find(
      (a) => a.value === user.referenceUserId,
    );
    setAdminEmail(
      matched ?? {
        value: user.referenceUserId,
        label: user.referenceUserEmail ?? '',
      },
    );
  }, [open, user, adminEmailOptions]);

  const isEmailEntered = REGEX.EMAIL.test(emailOrUsername.trim());

  const updateUserMutation = useMutation({
    mutationFn: (payload) => updateUser(user.id, payload),
    onSuccess: () => {
      showSuccessToast('User updated successfully');
      queryClient.invalidateQueries({ queryKey: ['store-users'] });
      onClose();
    },
    onError: (error) => {
      console.error('updateUser mutation error:', error);
      showErrorToast(error?.response?.data?.message ?? 'Failed to update user');
    },
  });

  if (!open) return null;

  const validateEmailOrUsername = (value) => {
    const trimmed = value.trim();
    if (trimmed.length < 3) return true;
    const isValidEmail = REGEX.EMAIL.test(trimmed);
    const isValidUsername = REGEX.USERNAME.test(trimmed);
    return !(isValidEmail || isValidUsername);
  };

  const validate = () => {
    const nextErrors = {};
    if (!fullName.trim()) nextErrors.fullName = true;
    nextErrors.emailOrUsername = validateEmailOrUsername(emailOrUsername);
    if (!jobTitle.trim()) nextErrors.jobTitle = true;
    if (!role) nextErrors.role = true;
    setErrors(nextErrors);
    return Object.keys(nextErrors).every((key) => !nextErrors[key]);
  };

  const handleSave = () => {
    if (!validate()) return;

    const [firstName, ...rest] = fullName.trim().split(/\s/);
    const lastName = rest.join(' ') || ' ';

    updateUserMutation.mutate({
      firstName,
      lastName,
      email: isEmailEntered ? emailOrUsername.trim() : null,
      userName: isEmailEntered ? null : emailOrUsername.trim(),
      jobTitle: jobTitle.trim(),
      referenceUserId: adminEmail?.value ?? null,
      userRoleId: role.value,
    });
  };

  const isFormValid =
    fullName.trim() && emailOrUsername.trim() && jobTitle.trim() && role;

  return (
    <div className='fixed inset-0 z-50 flex items-center overflow-auto bg-black/40'>
      <div className='mx-auto w-[616px] rounded bg-white shadow-[0_4px_4px_rgba(0,0,0,0.12)]'>
        {/* Header */}
        <div className='flex items-center justify-between rounded-t border-b border-[#dee2e6] bg-[#fafafc] py-6 pl-12 pr-[29px]'>
          <h2 className='mr-[29px] w-[95%] font-bold text-[18px] leading-6 text-[#333]'>
            {MANAGE_USER_MODAL_TITLES.EDIT_USER_INFO}
          </h2>
          <span className='cursor-pointer' onClick={onClose}>
            <img src='./icons/closepopup-icon.svg' alt='close' />
          </span>
        </div>

        {/* Body */}
        <div className='px-12 pt-9 pb-6 text-base leading-6 text-[#737373]'>
          {isUserLoading || !user ? (
            <div className='flex h-[400px] items-center justify-center text-sm text-[#6b6b6f]'>
              <TransferProductListSkeleton />
            </div>
          ) : (
            <form className='w-[400px]'>
              <div className='mb-7 relative'>
                <div className='flex items-center justify-between mb-2'>
                  <label className='text-[11px] font-semibold uppercase leading-4 tracking-[.08em] text-[#6b6b6f]'>
                    Full Name*
                  </label>
                  {errors.fullName && (
                    <span className='text-[13px] font-semibold leading-4 text-[#a71a23]'>
                      {VALIDATION_LABELS.FIELD_REQUIRED}
                    </span>
                  )}
                </div>
                <FormInput
                  type='text'
                  value={fullName}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFullName(value);
                    setErrors((prev) => ({ ...prev, fullName: !value.trim() }));
                  }}
                  autoFocus
                  error={errors.fullName}
                />
              </div>

              <div className='mb-7 relative'>
                <div className='flex items-center justify-between mb-2'>
                  <label className='text-[11px] font-semibold uppercase leading-4 tracking-[.08em] text-[#6b6b6f]'>
                    E-mail or Username*
                  </label>
                  {errors.emailOrUsername && (
                    <span className='text-[13px] font-semibold leading-4 text-[#a71a23] text-right'>
                      Please enter a valid email address or username (minimum 3
                      characters).
                    </span>
                  )}
                </div>
                <FormInput
                  type='text'
                  placeholder='Enter email or username'
                  value={emailOrUsername}
                  onChange={(e) => {
                    const value = e.target.value;
                    setEmailOrUsername(value);
                    setErrors((prev) => ({
                      ...prev,
                      emailOrUsername: validateEmailOrUsername(value),
                    }));
                    if (REGEX.EMAIL.test(value.trim())) {
                      setAdminEmail(null);
                    }
                  }}
                  error={errors.emailOrUsername}
                />
              </div>

              <div className='mb-7 relative'>
                <div className='flex items-center justify-between mb-2'>
                  <label className='text-[11px] font-semibold uppercase leading-4 tracking-[.08em] text-[#6b6b6f]'>
                    Job Title*
                  </label>
                  {errors.jobTitle && (
                    <span className='text-[13px] font-semibold leading-4 text-[#a71a23]'>
                      {VALIDATION_LABELS.FIELD_REQUIRED}
                    </span>
                  )}
                </div>
                <FormInput
                  type='text'
                  value={jobTitle}
                  onChange={(e) => {
                    const value = e.target.value;
                    setJobTitle(value);
                    setErrors((prev) => ({ ...prev, jobTitle: !value.trim() }));
                  }}
                  error={errors.jobTitle}
                />
              </div>

              <div className='relative mt-7'>
                <label className='mb-2 block text-[11px] font-semibold uppercase leading-4 tracking-[.08em] text-[#6b6b6f]'>
                  User Role*
                </label>
                <RoleSelect
                  options={roleOptions}
                  value={role}
                  onChange={setRole}
                  menuWidth={280}
                />
              </div>

              <div className='relative mt-7'>
                <label className='mb-2 block text-[11px] font-semibold uppercase leading-4 tracking-[.08em] text-[#6b6b6f]'>
                  Primary email for communication
                </label>
                <RoleSelect
                  menuWidth={265}
                  options={adminEmailOptions}
                  value={adminEmail}
                  onChange={setAdminEmail}
                  placeholder='Select admin email...'
                  variant='compact'
                  disabled={isEmailEntered}
                />
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className='flex items-center justify-between px-8 py-[10px] border-t border-gray-200'>
          <WhiteButton
            onClick={onClose}
            className='px-3 py-1.5 hover:border-gray-900 hover:text-gray-900'
          >
            Cancel
          </WhiteButton>

          <GreenButton
            disabled={!isFormValid || updateUserMutation.isPending}
            onClick={handleSave}
            className='h-[38px] px-3 py-1.5'
          >
            {updateUserMutation.isPending ? 'Saving...' : 'Save Changes'}
          </GreenButton>
        </div>
      </div>
    </div>
  );
}
