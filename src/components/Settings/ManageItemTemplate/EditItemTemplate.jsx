import { useState } from 'react';

import WhiteButton from '../../Common/WhiteButton';
import GreenButton from '../../Common/GreenButton';
import ConfirmModal from '../../Common/ConfirmModal';
import CategoryDropdown from './common/CategoryDropdown';
import SubcategoryDropdown from './common/SubcategoryDropdown';

export default function EditItemTemplateModal({ isOpen, onClose, item }) {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [name, setName] = useState(item?.name || '');
  const [sku, setSku] = useState(item?.sku || '');
  const [durabilityDays, setDurabilityDays] = useState(
    item?.durabilityDays || '',
  );
  const [category, setCategory] = useState(
    item?.categoryId ? { id: item.categoryId, name: item.category } : null,
  );
  const [subcategory, setSubcategory] = useState(
    item?.subcategoryId
      ? { id: item.subcategoryId, name: item.subcategory }
      : null,
  );
  const [touched, setTouched] = useState({ name: false });
  const [focusedField, setFocusedField] = useState(null);

  if (!isOpen) return null;

  function handleClose() {
    setName(item?.name || '');
    setSku(item?.sku || '');
    setDurabilityDays(item?.durabilityDays || '');
    setCategory(
      item?.categoryId ? { id: item.categoryId, name: item.category } : null,
    );
    setSubcategory(
      item?.subcategoryId
        ? { id: item.subcategoryId, name: item.subcategory }
        : null,
    );
    setTouched({ name: false });
    setFocusedField(null);
    onClose();
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'>
      <div className='h-[calc(100vh-48px)] w-[75%] rounded-lg bg-white shadow-lg'>
        <div className='flex h-full flex-col'>
          {/* Header */}
          <div className='flex items-center border-b border-[#E7E7EC] px-12 py-6'>
            <h2 className='w-full text-[18px] font-semibold text-[#19191C]'>
              Edit item template
            </h2>
            <button onClick={() => setShowCancelConfirm(true)}>
              <img
                src='/icons/closepopup-icon.svg'
                alt='close'
                className='h-3.5 w-3.5'
              />
            </button>
          </div>

          {/* Body */}
          <div className='h-[calc(100%-140px)] overflow-y-auto px-12 pb-8'>
            {/* Basic Info Section */}
            <section className='pt-[60px] pb-[60px] border-b border-[#e7e7ec]'>
              <h3 className='mb-6 text-[20px] font-semibold leading-7 tracking-[-0.01em] text-[#19191C]'>
                Basic item info
              </h3>

              {/* Row 1: Item Name + SKU */}
              <div className='grid grid-cols-12 gap-4 mb-2'>
                <div className='col-span-8'>
                  <label className='mb-1 flex text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6B6B6F]'>
                    Item Name
                    <span className='ml-1 text-[#e2232e] text-[12px]'>*</span>
                  </label>
                  <div
                    className={`flex h-12 w-full items-center rounded border px-4 ${
                      focusedField === 'name'
                        ? 'border-2 border-[#23a956]'
                        : touched.name && !name.trim()
                          ? 'border-[#fc5c63] shadow-[0_0_0_1px_#fc5c63] bg-[#fff7f7]'
                          : 'border-[#D7D8E0]'
                    }`}
                  >
                    <input
                      type='text'
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (touched.name)
                          setTouched((p) => ({ ...p, name: false }));
                      }}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => {
                        setFocusedField(null);
                        setTouched((p) => ({ ...p, name: true }));
                      }}
                      className='w-full text-sm text-[#333] outline-none bg-transparent'
                    />
                  </div>
                  {touched.name && !name.trim() && (
                    <p className='mt-2 text-[13px] text-[#D93A3F]'>
                      This field is required
                    </p>
                  )}
                </div>

                <div className='col-span-4'>
                  <label className='mb-1 block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6B6B6F]'>
                    SKU
                  </label>
                  <div
                    className={`flex h-12 w-full items-center rounded border px-4 ${
                      focusedField === 'sku'
                        ? 'border-2 border-[#23a956]'
                        : 'border-[#D7D8E0]'
                    }`}
                  >
                    <input
                      type='text'
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      onFocus={() => setFocusedField('sku')}
                      onBlur={() => setFocusedField(null)}
                      className='w-full text-sm text-[#333] outline-none bg-transparent'
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Category + Subcategory + Durability */}
              <div className='grid grid-cols-12 gap-4 mt-3'>
                <div className='col-span-4'>
                  <label className='mb-1 flex text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6B6B6F]'>
                    Category
                    <span className='ml-1 text-[#e2232e] text-[12px]'>*</span>
                  </label>
                  <CategoryDropdown
                    selected={category}
                    onSelect={(c) => {
                      setCategory(c);
                      setSubcategory(null);
                    }}
                  />
                </div>

                <div className='col-span-4'>
                  <label className='mb-1 block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6B6B6F]'>
                    Subcategory
                  </label>
                  <SubcategoryDropdown
                    selected={subcategory}
                    onSelect={setSubcategory}
                    categoryId={category?.id}
                  />
                </div>

                <div className='col-span-4'>
                  <label className='mb-1 block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6B6B6F]'>
                    Durability Days
                  </label>
                  <div
                    className={`flex h-12 w-full items-center rounded border px-4 ${
                      focusedField === 'durability'
                        ? 'border-2 border-[#23a956]'
                        : 'border-[#D7D8E0]'
                    }`}
                  >
                    <input
                      type='number'
                      min='0'
                      value={durabilityDays}
                      onChange={(e) => setDurabilityDays(e.target.value)}
                      onFocus={() => setFocusedField('durability')}
                      onBlur={() => setFocusedField(null)}
                      className='w-full text-sm text-[#333] outline-none bg-transparent'
                    />
                  </div>
                  <span className='mt-2 block text-[13px] leading-4 text-[#6b6b6f]'>
                    Maximum recommended storage days before the item may spoil.
                  </span>
                </div>
              </div>
            </section>

            {/* remaining sections will go here */}
          </div>

          {/* Footer */}
          <div className='flex items-center justify-between border-t border-[#E7E7EC] px-12 py-[14px]'>
            <WhiteButton
              onClick={() => setShowCancelConfirm(true)}
              className='px-3 py-[6px] text-sm'
            >
              Cancel
            </WhiteButton>
            <GreenButton className='px-3 py-[6px] text-sm'>
              Save item template
            </GreenButton>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={showCancelConfirm}
        onClose={() => setShowCancelConfirm(false)}
        onConfirm={() => {
          setShowCancelConfirm(false);
          handleClose();
        }}
        title='Discard unsaved changes?'
        confirmLabel='Discard'
        cancelLabel='Cancel'
      />
    </div>
  );
}
