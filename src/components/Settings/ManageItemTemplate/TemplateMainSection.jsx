import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  fetchProductGroups,
  fetchSuppliers,
  fetchSubcategories,
  deleteItemTemplates,
} from '../../../services/manageItemTemplateService';
import { fetchInventory } from '../../../services/inventoryService';
import ConfirmModal from '../../Common/ConfirmModal';
import SearchInput from '../../Common/SearchInput';
import AssignSupplierModal from './AssignSupplierModal';
import { ITEM_TEMPLATE_DYNAMIC_TITLES } from '../../../constants/titles';

const ISSUE_OPTIONS = [
  'All item templates',
  'Duplicate item templates',
  'Item templates without SKU',
];

//FILTER DROPDOWN
function FilterDropdown({
  label,
  options = [],
  disabled = false,
  width = 200,
  selected,
  onSelect,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div ref={ref} className='relative' style={{ width: `${width}px` }}>
      <div
        onClick={() => !disabled && setOpen((p) => !p)}
        className={`flex items-center justify-between bg-white h-9 rounded px-4 pr-2 transition-all ${
          disabled ? 'cursor-default' : 'cursor-pointer'
        } ${open ? 'border border-[#23a956]' : 'border border-[#d7d7db]'}`}
      >
        <span
          className={`text-sm font-normal truncate mr-5 ${
            disabled ? 'text-[#b7b7b7]' : 'text-[#19191c]'
          }`}
        >
          {selected || label}
        </span>
        <img
          src='/icons/chevron-down-small.svg'
          alt=''
          className='w-6 h-6 shrink-0'
        />
      </div>

      {open && options.length > 0 && (
        <ul className='absolute bg-white z-50 mt-2 py-[15px] list-none m-0 p-0 min-w-[250px] max-h-[480px] overflow-y-auto border border-[#d7d7db] rounded shadow-[0_2px_8px_rgba(0,0,0,0.12)]'>
          {options.map((opt, i) => {
            const isHeader = typeof opt === 'object' && opt.isHeader;
            const optLabel = typeof opt === 'object' ? opt.label : opt;

            return (
              <li
                key={i}
                onClick={() => {
                  if (!isHeader) {
                    onSelect(optLabel, opt.isClear ? null : opt.value);
                    setOpen(false);
                  }
                }}
                className={`w-full text-sm leading-5 cursor-pointer inline-flex items-center justify-between text-[#19191c] hover:bg-[#f1f1f5] px-4 py-2 ${
                  isHeader
                    ? 'border-b border-[#dee2e6] mb-2 pb-2.5 cursor-default hover:bg-white font-semibold'
                    : selected === optLabel
                      ? 'bg-[#f1f1f5] font-normal'
                      : 'font-semibold'
                }`}
                style={{ whiteSpace: 'break-spaces' }}
              >
                <span>{optLabel}</span>
                {selected === optLabel && !isHeader && (
                  <img
                    src='/icons/check-small.svg'
                    alt=''
                    className='w-6 h-6 shrink-0'
                  />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default function TemplateMainSection({
  search,
  filters,
  onSearchChange,
  onFiltersChange,
  checkedIds,
  onClearChecked,
  onItemDeleted,
}) {
  // const [focused, setFocused] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const toastTimerRef = useRef(null);

  function showToast() {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMessage('assigned');
    toastTimerRef.current = setTimeout(() => setToastMessage(null), 3500);
  }

  const queryClient = useQueryClient();

  //categories query
  const { data: categoriesData } = useQuery({
    queryKey: ['productGroups'],
    queryFn: fetchProductGroups,
  });

  const selectedCategoryObj = (categoriesData || []).find(
    (c) => c.name === filters.category,
  );

  //subcategories query
  const { data: subcategoriesData } = useQuery({
    queryKey: ['subcategories', selectedCategoryObj?.id],
    queryFn: () => fetchSubcategories(selectedCategoryObj.id),
    enabled: !!selectedCategoryObj?.id,
  });

  //invenotories query
  const { data: inventoryData } = useQuery({
    queryKey: ['inventories'],
    queryFn: fetchInventory,
  });

  //supplier query
  const { data: suppliersData } = useQuery({
    queryKey: ['suppliers'],
    queryFn: fetchSuppliers,
  });

  const { mutate: deleteTemplates } = useMutation({
    mutationFn: deleteItemTemplates,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['itemTemplates'] });
      onClearChecked?.();
      setShowDeleteModal(false);
      onItemDeleted?.(
        `${checkedIds.length} item${checkedIds.length > 1 ? 's' : ''}`,
      );
    },
  });

  const categoryOptions = [
    { label: 'No category', value: null, isClear: true },
    ...(categoriesData || []).map((c) => ({ label: c.name, value: c.id })),
  ];

  const subcategoryOptions = selectedCategoryObj
    ? [
        { label: 'No subcategory', value: null, isClear: true },
        ...(subcategoriesData || []).map((s) => ({
          label: s.name,
          value: s.id,
        })),
      ]
    : [];

  const inventoryOptions = [
    { label: 'No inventory', value: null, isClear: true },
    ...(inventoryData?.Data || inventoryData?.data || []).map((inv) => ({
      label: inv.name,
      value: inv.id,
    })),
  ];

  const supplierOptions = [
    { label: 'No supplier', value: null, isClear: true },
    ...(suppliersData || []).map((s) => ({ label: s.Name, value: s.Id })),
  ];

  const hasActiveFilter = Object.values(filters).some(Boolean);

  const subcategoryDisabled =
    !filters.category || (subcategoriesData || []).length === 0;

  function clearFilters() {
    onFiltersChange({
      issue: null,
      category: null,
      categoryId: null,
      subcategory: null,
      subcategoryId: null,
      inventory: null,
      inventoryId: null,
      supplier: null,
      supplierId: null,
    });
  }

  return (
    <div className='w-full px-8'>
      {/* Search */}

      <SearchInput
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        onDebouncedChange={onSearchChange}
        debounceMs={400}
        placeholder='Enter item name or SKU...'
        className='w-full'
      />

      {/* Filters */}
      <div className='flex gap-6 w-full py-[18px] items-center'>
        <FilterDropdown
          label='Issue'
          options={ISSUE_OPTIONS}
          width={150}
          selected={filters.issue}
          onSelect={(v) => onFiltersChange((p) => ({ ...p, issue: v }))}
        />

        <FilterDropdown
          label='Category'
          options={categoryOptions}
          width={200}
          selected={filters.category}
          onSelect={(label, value) => {
            onFiltersChange((p) => ({
              ...p,
              category: value ? label : null,
              categoryId: value || null,
              subcategory: null,
              subcategoryId: null,
            }));
          }}
        />

        <FilterDropdown
          label='Subcategory'
          options={subcategoryOptions}
          disabled={subcategoryDisabled}
          width={200}
          selected={filters.subcategory}
          onSelect={(label, value) => {
            onFiltersChange((p) => ({
              ...p,
              subcategory: value ? label : null,
              subcategoryId: value || null,
            }));
          }}
        />

        <FilterDropdown
          label='Inventory'
          options={inventoryOptions}
          width={200}
          selected={filters.inventory}
          onSelect={(label, value) => {
            onFiltersChange((p) => ({
              ...p,
              inventory: value ? label : null,
              inventoryId: value || null,
            }));
          }}
        />

        <FilterDropdown
          label='Supplier'
          options={supplierOptions}
          width={150}
          selected={filters.supplier}
          onSelect={(label, value) => {
            onFiltersChange((p) => ({
              ...p,
              supplier: value ? label : null,
              supplierId: value || null,
            }));
          }}
        />

        {hasActiveFilter && (
          <span
            onClick={clearFilters}
            className='text-base font-semibold leading-4 cursor-pointer whitespace-nowrap'
            style={{ color: '#1f8e4e' }}
          >
            Clear filters
          </span>
        )}
      </div>

      {checkedIds.length > 0 && (
        <div className='flex w-full items-center justify-end pb-[18px] pt-2 bg-white'>
          <label className='text-[11px] font-semibold leading-4 uppercase tracking-[0.08em] text-[#0f6f36] bg-[#dcf1e3] rounded px-3 py-2'>
            {checkedIds.length} item{checkedIds.length > 1 ? 's' : ''} selected
          </label>
          <div className='flex ml-4 gap-4'>
            <a
              onClick={() => setShowAssignModal(true)}
              className='flex items-center gap-2 text-sm font-semibold leading-6 text-[#19191c] border border-[#d7d8e0] rounded px-[9px] py-[6px] cursor-pointer'
            >
              <img src='/icons/plus-dark.svg' width={18} height={18} alt='' />
              <span>Assign supplier</span>
            </a>
            <button
              onClick={() => setShowDeleteModal(true)}
              className='flex items-center gap-2 text-sm font-semibold leading-6 text-white bg-[#e2232e] border border-[#e2232e] rounded px-[9px] py-[6px] cursor-pointer'
            >
              <img src='/icons/white-bin.svg' width={12} height={12} alt='' />
              <span>Delete all</span>
            </button>
          </div>
        </div>
      )}

      <AssignSupplierModal
        open={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        suppliers={suppliersData || []}
        checkedIds={checkedIds}
        onSuccess={showToast}
      />

      <ConfirmModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title={ITEM_TEMPLATE_DYNAMIC_TITLES.deleteSelectedItems(
          checkedIds.length,
        )}
        description='Please note that deleting this item template is irreversible, all associated data will be permanently deleted and the item will be removed from all the listed inventories.'
        confirmLabel='Delete All'
        cancelLabel='Cancel'
        onConfirm={() => deleteTemplates(checkedIds)}
      />

      {toastMessage && (
        <div className='fixed bottom-0 right-0 z-50' style={{ left: '200px' }}>
          <div className='mx-6 mb-8 bg-[#19191c] text-white text-[14px] leading-6 px-8 py-4 rounded-sm flex items-center gap-3'>
            <img src='/icons/right.svg' alt='' className='w-5 h-5' />
            Products added
          </div>
        </div>
      )}
    </div>
  );
}
