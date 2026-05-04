import { useState, useRef, useEffect, useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FiX, FiUpload, FiTrash2, FiChevronDown } from 'react-icons/fi';

import {
  createStoreProduct,
  searchProducts,
} from '../../services/productService';
import { fetchMeasurementUnits } from '../../services/masterDataService';
import ConfirmModal from '../Common/ConfirmModal';
import ImportItemsModal from './ImportItemModal';
import { AddItemRowSkeleton } from '../Common/Skeleton';
import GreenButton from '../Common/GreenButton';
import WhiteButton from '../Common/WhiteButton';

const COLS = 'grid-cols-[100px_2fr_120px_200px_180px_160px_44px]';

function UnitDropdown({ value, onChange, units }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className='relative w-full' ref={ref}>
      <button
        type='button'
        onClick={() => setOpen(!open)}
        className='flex items-center cursor-pointer justify-between w-full h-8.5 px-2 text-[13px] text-gray-500 bg-white focus:outline-none focus:bg-gray-100 hover:bg-gray-100 transition hover:text-gray-700'
      >
        <span className={value ? 'text-gray-800' : 'text-gray-400'}>
          {value || 'select unit'}
        </span>
        <FiChevronDown size={13} className='text-gray-400 shrink-0' />
      </button>
      {open && (
        <div className='absolute top-full mt-1 left-0 w-full bg-white border border-gray-200 rounded shadow-lg z-50 max-h-56 overflow-y-auto'>
          {units?.length > 0 ? (
            units.map((unit) => (
              <div
                key={unit.id}
                onClick={() => {
                  onChange(unit.value);
                  setOpen(false);
                }}
                className={`px-3 py-2 text-[13px] cursor-pointer hover:bg-gray-100 ${
                  value === unit.value
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-gray-700'
                }`}
              >
                {unit.label}
              </div>
            ))
          ) : (
            <div className='px-3 py-2 text-[12px] text-gray-400'>
              Loading units…
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ItemRow({ row, onChange, onDelete, units }) {
  const [nameInput, setNameInput] = useState(row.name || '');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef(null);
  const wrapperRef = useRef(null);

  const isAutoFilled = !!row._unitId; // locked if selected from search

  useEffect(() => {
    function handleClick(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleNameChange = (e) => {
    const val = e.target.value;
    setNameInput(val);
    onChange('name', val);
    // clear auto-fill lock if user manually edits
    onChange('_unitId', '');

    clearTimeout(debounceRef.current);
    if (val.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      const results = await searchProducts(val.trim());
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
    }, 300);
  };

  const handleSelect = (product) => {
    const unitLabel = product.stockTakingUnit || product.purchaseUnit || '';
    const unitId = product.stockTakingUnitId || product.purchaseUnitId || '';
    const cost =
      product.pricePerStockTakingUnit ?? product.pricePerPurchaseUnit ?? '';
    const sku = product.sku || '';

    setNameInput(product.name);
    onChange('name', product.name);
    onChange('sku', sku);
    onChange('unit', unitLabel);
    onChange('costPerUnit', cost);
    onChange('_unitId', unitId);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const formatNO = (val) =>
    val !== '' && !isNaN(val)
      ? Number(val).toLocaleString('nb-NO', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : '';

  const total =
    row.costPerUnit && row.quantity
      ? formatNO(parseFloat(row.quantity) * parseFloat(row.costPerUnit))
      : '';

  return (
    <div
      className={`grid ${COLS} px-6 py-2 items-center border-b border-gray-100`}
    >
      {/* SKU - reads from row.sku so it reflects auto-fill */}
      <input
        value={row.sku}
        onChange={(e) => onChange('sku', e.target.value)}
        placeholder='SKU'
        disabled={isAutoFilled}
        className={`h-8.5 px-2 text-[13px] rounded focus:outline-none transition text-gray-700 placeholder-gray-400 ${
          isAutoFilled
            ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
            : 'bg-transparent hover:bg-gray-100 focus:bg-gray-100'
        } cursor-pointer`}
      />

      {/* Item name with search */}
      <div className='relative' ref={wrapperRef}>
        <input
          value={nameInput}
          onChange={handleNameChange}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          placeholder='Item name'
          className='w-full h-8.5 px-2 text-[13px] bg-transparent rounded focus:outline-none focus:bg-gray-100 hover:bg-gray-100 transition text-gray-700 placeholder-gray-400 cursor-pointer'
        />
        {showSuggestions && (
          <div className='absolute top-full mt-1 left-0 w-60 bg-white border border-gray-200 rounded shadow-lg z-50 max-h-56 overflow-y-auto'>
            {suggestions.map((product) => (
              <div
                key={product.id}
                onMouseDown={() => handleSelect(product)}
                className='px-3 py-2 text-[13px] hover:bg-gray-100 text-gray-700'
              >
                {product.name}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quantity - always editable */}
      <input
        type='number'
        value={row.quantity}
        onChange={(e) => onChange('quantity', e.target.value)}
        placeholder='Quantity'
        className='h-8.5 px-2 text-[13px] bg-transparent rounded focus:outline-none focus:bg-gray-100 hover:bg-gray-100 transition text-gray-700 placeholder-gray-400 cursor-pointer'
      />

      {/* Unit - disabled if auto-filled */}
      <div
        className={`${isAutoFilled ? 'opacity-50 pointer-events-none' : ''} cursor-pointer`}
      >
        <UnitDropdown
          value={row.unit}
          onChange={(val) => onChange('unit', val)}
          units={units}
        />
      </div>

      {/* Cost per unit */}
      <div
        className={`flex items-center h-8.5 rounded px-2 gap-1 transition ${
          isAutoFilled
            ? 'bg-gray-50 cursor-not-allowed'
            : row.touched && !row.costPerUnit
              ? 'bg-red-50 border border-red-200'
              : 'hover:bg-gray-100'
        } `}
      >
        {isAutoFilled ? (
          <span className='w-full text-[13px] text-right text-gray-700'>
            {formatNO(row.costPerUnit)}
          </span>
        ) : (
          <input
            type='number'
            value={row.costPerUnit}
            onChange={(e) => onChange('costPerUnit', e.target.value)}
            onBlur={() => onChange('touched', true)}
            className='w-full text-[13px] bg-transparent outline-none text-right text-gray-700 placeholder-gray-400 cursor-pointer'
          />
        )}
        <span className='text-[13px] text-gray-400 shrink-0'>kr</span>
      </div>

      {/* Total value */}
      <div className='flex items-center h-8.5 gap-1 pr-1 hover:bg-gray-100 rounded transition cursor-pointer'>
        <span className='w-full text-[13px] text-right text-gray-700'>
          {total}
        </span>
        <span className='text-[13px] text-gray-400 shrink-0'>kr</span>
      </div>

      <button
        onClick={onDelete}
        className='flex items-center justify-center w-10 h-10 rounded-full hover:bg-emerald-100 transition cursor-pointer'
      >
        <img src='/icons/dark-bin.svg' width={18} height={18} alt='' />
      </button>
    </div>
  );
}
export default function AddItemModal({ open, onClose, selectedInventory }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [rows, setRows] = useState([
    {
      id: Date.now(),
      sku: '',
      name: '',
      quantity: '',
      unit: '',
      costPerUnit: '',
    },
  ]);

  const queryClient = useQueryClient();

  const { data: unitData } = useQuery({
    queryKey: ['measurementUnits'],
    queryFn: fetchMeasurementUnits,
    staleTime: Infinity,
  });

  const units = (unitData?.stockTakingUnit ?? []).map((u) => ({
    id: u.id,
    label: u.name ?? u.title ?? u.label ?? String(u.id),
    value: u.name ?? u.title ?? u.label ?? String(u.id),
  }));

  const { mutateAsync } = useMutation({
    mutationFn: createStoreProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(['products', selectedInventory?.id]);
      queryClient.invalidateQueries(['stock-value', selectedInventory?.id]);
    },
  });

  if (!open) return null;

  function updateRow(id, field, value) {
    setRows((prev) => {
      const updated = prev.map((r) =>
        r.id === id ? { ...r, [field]: value } : r,
      );
      const last = updated[updated.length - 1];
      const isLastComplete = last.name && last.unit && last.costPerUnit;
      if (isLastComplete && last.id === id) {
        return [
          ...updated,
          {
            id: Date.now(),
            sku: '',
            name: '',
            quantity: '',
            unit: '',
            costPerUnit: '',
            touched: false,
          },
        ];
      }
      return updated;
    });
  }

  function deleteRow(id) {
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  const inventoryName = selectedInventory?.name || 'inventory';

  function buildPayload(row) {
    const unitObj = units.find((u) => u.value === row.unit);
    const unitId = row._unitId || unitObj?.id;
    if (!unitId) throw new Error(`Unit not found: ${row.unit}`);

    return {
      name: row.name,
      sku: row.sku || '',
      purchaseUnitId: unitId,
      stockTakingUnitId: unitId,
      baseMeasurementUnitId: unitId,
      pricePerPurchaseUnit: Number(row.costPerUnit),
      pricePerStockTakingUnit: Number(row.costPerUnit),
      stockTakingQuantityPerPurchaseUnit: 1,
      stockTakingQuantityPerBaseMeasurementUnit: 1,
      products: [
        {
          id: '0',
          quantity: Number(row.quantity || 0),
          expirationDate: null,
          isManual: 1,
          isDeleted: 0,
          stockCountItemId: crypto.randomUUID(),
          daysLeft: 0,
          selected: false,
        },
      ],
      currencyId: selectedInventory.currencyId,
      inventoryId: selectedInventory.id,
      dateAndTime: new Date().toISOString(),
      productId: crypto.randomUUID(),
      storeProductId: crypto.randomUUID(),
      rfidTagIds: [],
    };
  }
  async function handleSubmit() {
    const validRows = rows.filter((r) => r.name && r.unit && r.costPerUnit);
    if (validRows.length === 0) {
      setShowError(true);
      return;
    }
    setShowError(false);
    setIsSubmitting(true);
    try {
      for (const row of validRows) {
        await mutateAsync(buildPayload(row));
      }
      onClose();
    } catch (err) {
      console.error('ADD ITEM ERROR:', err);
    } finally {
      setIsSubmitting(false);
    }
  }

  function isFormEmpty() {
    return rows.every(
      (r) => !r.name && !r.sku && !r.quantity && !r.unit && !r.costPerUnit,
    );
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[0.5px]'>
      <div
        className='w-290 h-210 bg-white rounded-lg shadow-xl flex flex-col'
        style={{ minHeight: '520px' }}
      >
        <div className='flex items-center justify-between px-6 py-4 border-b border-gray-100'>
          <h2 className='text-[15px] font-semibold text-gray-800'>
            Add items to {inventoryName}
          </h2>

          <div className='flex items-center gap-3'>
            <GreenButton onClick={() => setShowImportModal(true)}>
              <img src='/icons/upload.svg' width={20} height={20} alt='' />
              Import items using a spreadsheet template
            </GreenButton>
            <button
              onClick={() => {
                if (isFormEmpty()) {
                  onClose();
                } else {
                  setShowConfirm(true);
                }
              }}
              className='text-gray-700 p-1 cursor-pointer'
            >
              <FiX size={20} />
            </button>
          </div>
        </div>

        <div
          className={`grid ${COLS} px-6 py-2 border-b border-gray-200 bg-gray-100`}
        >
          {[
            { label: 'SKU', asterisk: false },
            { label: 'ITEM NAME', asterisk: true },
            { label: 'QUANTITY', asterisk: false },
            { label: 'UNIT', asterisk: true },
            { label: 'COST PER UNIT', asterisk: true },
            { label: 'TOTAL VALUE', asterisk: true },
            { label: '', asterisk: false },
          ].map((col, i) => (
            <div
              key={i}
              className='text-[11px] font-semibold text-gray-500 tracking-wider uppercase'
            >
              {col.label}
              {col.asterisk && <span className='text-red-500'>*</span>}
            </div>
          ))}
        </div>

        <div className='overflow-y-auto flex-1'>
          {isSubmitting
            ? Array.from({ length: rows.length }).map((_, i) => (
                <AddItemRowSkeleton key={i} />
              ))
            : rows.map((row) => (
                <ItemRow
                  key={row.id}
                  row={row}
                  onChange={(field, value) => updateRow(row.id, field, value)}
                  onDelete={() => deleteRow(row.id)}
                  units={units}
                />
              ))}
        </div>

        <div className='flex items-center justify-between px-6 py-4 border-t border-gray-200'>
          <WhiteButton
            onClick={() => {
              if (isFormEmpty()) {
                onClose();
              } else {
                setShowConfirm(true);
              }
            }}
            disabled={isSubmitting}
            // className='text-sm px-5 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 hover:border-gray-500 transition disabled:opacity-50'
          >
            Cancel
          </WhiteButton>

          {showError && (
            <div className='flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-4 py-2'>
              <span>⚠</span>
              Fill in all the required fields before you continue.
            </div>
          )}

          <GreenButton onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Adding items…' : `Add items to ${inventoryName}`}
          </GreenButton>
        </div>
      </div>

      <ImportItemsModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        selectedInventory={selectedInventory}
        onImportSuccess={(items) => {
          const mappedRows = items.map((item) => ({
            id: Date.now() + Math.random(),
            sku: item.sku || '',
            name: item.name || '',
            quantity: item.quantity || '',
            unit: item.unit || '',
            costPerUnit: item.costPerUnit || '',
            _unitId: item.unitId || '',
            touched: false,
          }));

          setRows((prev) => [...mappedRows, ...prev]);
          setShowImportModal(false);
        }}
      />

      {showConfirm && (
        <ConfirmModal
          open={showConfirm}
          onClose={() => setShowConfirm(false)}
          title={`Cancel adding items to ${inventoryName}?`}
          description={`Any unsaved changes will be lost and the items you entered here won't be added to ${inventoryName}.`}
          confirmLabel='Yes, Cancel'
          cancelLabel='No, Continue Adding Items'
          onConfirm={() => {
            setShowConfirm(false);
            onClose();
          }}
        />
      )}
    </div>
  );
}
