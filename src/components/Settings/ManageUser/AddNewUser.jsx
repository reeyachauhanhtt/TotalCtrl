import { useState } from 'react';
import Select, { components } from 'react-select';

import GreenButton from '../../Common/GreenButton';
import WhiteButton from '../../Common/WhiteButton';
import FormInput from '../../Common/Input';
import {
  VALIDATION_LABELS,
  MANAGE_USER_MODAL_TITLES,
} from '../../../constants/titles';

const selectClassNames = {
  container: () => 'relative box-border',
  control: (state) =>
    `flex items-center justify-between h-12 min-h-12 border rounded box-border cursor-default transition-[100ms] outline-none
     ${state.isDisabled ? 'bg-[#f7f7f9] border-[#d7d8e0] cursor-not-allowed' : 'border-[#d7d8e0]'}
     ${state.isFocused ? 'border-[#333]' : ''}`,
  valueContainer: () =>
    'flex flex-1 flex-wrap items-center gap-0.5 px-2 py-0.5 relative overflow-hidden box-border capitalize',
  placeholder: () => 'text-[#808080] mx-0.5 text-sm',
  input: () => 'text-sm text-[#333]',
  singleValue: () => 'text-sm text-[#333] capitalize',
  indicatorsContainer: () =>
    'flex items-center self-stretch shrink-0 box-border',
  indicatorSeparator: () => 'hidden',
  dropdownIndicator: () =>
    'flex p-2 text-[#d7d8e0] transition-colors duration-150',
  menu: () =>
    'mt-5` w-[100px] border border-[#d7d8e0] rounded shadow-md bg-white z-10',
  menuList: () => 'max-h-[100px] overflow-y-auto py-1',
  option: (state) =>
    `px-4 py-3 text-sm cursor-pointer
   ${state.isSelected ? 'bg-[#e5ede7]' : state.isFocused ? 'bg-[#f5f5f7]' : 'bg-white'}`,
};

const roleOptions = [
  {
    value: 'admin',
    label: 'Admin',
    description:
      'Can do all that the user can, plus access the web administration, invite people, create inventories and manage access to them, upload orders and manage the product database.',
  },
  { value: 'clerk', label: 'Clerk', description: 'Role Clerk' },
  { value: 'doctor', label: 'Doctor', description: 'Test Doctor role' },
  {
    value: 'guardian_of_goods',
    label: 'Guardian Of Goods',
    description:
      'A steward of inventory integrity, dedicated to overseeing the condition and consistency of stock without the distraction of pricing data. This role is key for maintaining operational standards and ensuring inventory accuracy across the board.',
  },
  {
    value: 'nurse',
    label: 'Nurse',
    description:
      "Can download the mobile app and manage inventories they're given access to. Doesn't have access to the web administration.",
  },
  { value: 'super_admin', label: 'Super Admin', description: '' },
  {
    value: 'user',
    label: 'User',
    description:
      "Can download the mobile app and manage inventories they're given access to. Doesn't have access to the web administration.",
  },
];

const RoleOption = (props) => {
  const { data, isSelected } = props;
  return (
    <components.Option {...props}>
      <div className='flex items-start justify-between gap-2'>
        <span className='font-semibold text-[#333]'>{data.label}</span>
        {isSelected && (
          <svg
            className='mt-0.5 shrink-0'
            width='16'
            height='16'
            viewBox='0 0 16 16'
            fill='none'
          >
            <path
              d='M13.5 4L6 11.5L2.5 8'
              stroke='#2f7a4d'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        )}
      </div>
      {data.description && (
        <p className='mt-1 text-xs leading-4 text-[#6b6b6f] normal-case'>
          {data.description}
        </p>
      )}
    </components.Option>
  );
};

const RoleSingleValue = (props) => (
  <components.SingleValue {...props}>{props.data.label}</components.SingleValue>
);

const adminEmailOptions = [
  { value: 'admin1@totalctrl.com', label: 'admin1@totalctrl.com' },
  { value: 'admin2@totalctrl.com', label: 'admin2@totalctrl.com' },
];

export default function AddNewUserModal({ isOpen, onClose }) {
  const [fullName, setFullName] = useState('');
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [role, setRole] = useState(null);
  const [adminEmail, setAdminEmail] = useState(null);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const resetForm = () => {
    setFullName('');
    setEmailOrUsername('');
    setJobTitle('');
    setRole(null);
    setAdminEmail(null);
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validateEmailOrUsername = (value) => {
    const trimmed = value.trim();
    if (trimmed.length < 3) return true;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = emailRegex.test(trimmed);
    const isValidUsername = /^[a-zA-Z0-9._-]{3,}$/.test(trimmed);

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

    setSaving(true);
    console.log('Dummy invite payload:', {
      fullName: fullName.trim(),
      emailOrUsername: emailOrUsername.trim(),
      jobTitle: jobTitle.trim(),
      roleId: role.value,
      adminEmailId: adminEmail?.value ?? null,
    });

    setTimeout(() => {
      setSaving(false);
      handleClose();
    }, 600);
  };

  const isFormValid =
    fullName.trim() && emailOrUsername.trim() && jobTitle.trim() && role;

  return (
    <div className='fixed inset-0 z-50 flex items-center overflow-auto bg-black/40'>
      <div className='mx-auto w-[616px] rounded bg-white shadow-[0_4px_4px_rgba(0,0,0,0.12)]'>
        {/* Header */}
        <div className='flex items-center justify-between rounded-t border-b border-[#dee2e6] bg-[#fafafc] py-6 pl-12 pr-[29px]'>
          <h2 className='mr-[29px] w-[95%] font-bold text-[18px] leading-6 text-[#333]'>
            {MANAGE_USER_MODAL_TITLES.ADD_NEW_USER}
          </h2>
          <span className='cursor-pointer' onClick={handleClose}>
            <img src='./icons/closepopup-icon.svg' alt='close' />
          </span>
        </div>

        {/* Body */}
        <div className='px-12 pt-9 pb-6 text-base leading-6 text-[#737373]'>
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

            <Select
              unstyled
              classNames={selectClassNames}
              styles={{
                menu: (base) => ({
                  ...base,
                  width: 250,
                }),
                menuList: (base) => ({ ...base, maxHeight: 280 }),
              }}
              components={{ Option: RoleOption, SingleValue: RoleSingleValue }}
              options={roleOptions}
              value={role}
              onChange={setRole}
              placeholder='Select user role...'
              getOptionValue={(opt) => opt.value}
              getOptionLabel={(opt) => opt.label}
              menuPlacement='top'
            />

            <div className='relative mt-7'>
              <label className='mb-2 block text-[11px] font-semibold uppercase leading-4 tracking-[.08em] text-[#6b6b6f]'>
                Primary email for communication
              </label>
              <Select
                unstyled
                classNames={selectClassNames}
                options={adminEmailOptions}
                value={adminEmail}
                onChange={setAdminEmail}
                placeholder='Select admin email...'
              />
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className='flex items-center justify-between px-8 py-[10px] border-t border-gray-200'>
          <WhiteButton
            onClick={handleClose}
            className='px-3 py-1.5 hover:border-gray-900 hover:text-gray-900'
          >
            Cancel
          </WhiteButton>

          <GreenButton
            disabled={!isFormValid || saving}
            onClick={handleSave}
            className='h-[38px] px-3 py-1.5'
          >
            {saving ? 'Sending...' : 'Send Invite'}
          </GreenButton>
        </div>
      </div>
    </div>
  );
}
