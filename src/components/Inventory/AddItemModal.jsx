import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FiX } from 'react-icons/fi';

import { createStoreProduct } from '../../services/productService';
import { fetchMeasurementUnits } from '../../services/masterDataService';
import ConfirmModal from '../Common/ConfirmModal';
import ImportItemsModal from './ImportItemModal';
import { AddItemRowSkeleton } from '../Common/Skeleton';
import GreenButton from '../Common/GreenButton';
import WhiteButton from '../Common/WhiteButton';
import OrderItemsTable, { emptyRow } from '../Common/OrderItemTable';

// ─── initial row factory matching the common emptyRow shape ───────────────────
function newInventoryRow() {
  return {
    ...emptyRow(),
    // AddItemModal uses 'price' field mapped from 'costPerUnit'
  };
}

export default function AddItemModal({ open, onClose, selectedInventory }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [rows, setRows] = useState([newInventoryRow()]);

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
  });

  if (!open) return null;

  // ── reset rows on close ──
  function handleClose() {
    setRows([newInventoryRow()]);
    setShowError(false);
    onClose();
  }

  function isFormEmpty() {
    return rows.every(
      (r) => !r.name && !r.sku && !r.quantity && !r.unit && !r.price,
    );
  }

  function buildPayload(row) {
    const unitObj = units.find((u) => u.value === row.unit);
    const unitId = row.unitId || unitObj?.id;
    if (!unitId) throw new Error(`Unit not found: ${row.unit}`);

    return {
      name: row.name,
      sku: row.sku || '',
      purchaseUnitId: unitId,
      stockTakingUnitId: unitId,
      baseMeasurementUnitId: unitId,
      pricePerPurchaseUnit: Number(row.price),
      pricePerStockTakingUnit: Number(row.price),
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
    const filledRows = rows.filter(
      (r) => r.name || r.unit || r.price || r.quantity,
    );

    const hasInvalid = filledRows.some(
      (r) => !r.name || !r.unit || !r.price || !r.quantity,
    );

    if (filledRows.length === 0 || hasInvalid) {
      // Mark all non-empty rows as touched so errors highlight
      setRows((prev) =>
        prev.map((r) =>
          r.name || r.unit || r.price || r.quantity
            ? { ...r, touched: true }
            : r,
        ),
      );
      setShowError(true);
      return;
    }

    setShowError(false);
    setIsSubmitting(true);
    try {
      for (const row of filledRows) {
        await mutateAsync(buildPayload(row));
      }
      await queryClient.invalidateQueries(['products', selectedInventory?.id]);
      await queryClient.invalidateQueries([
        'stock-value',
        selectedInventory?.id,
      ]);
      handleClose();
    } catch (err) {
      console.error('ADD ITEM ERROR:', err);
    } finally {
      setIsSubmitting(false);
    }
  }

  const inventoryName = selectedInventory?.name || 'inventory';

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[0.5px]'>
      <div
        className='w-290 h-210 bg-white rounded-lg shadow-xl flex flex-col'
        style={{ minHeight: '520px' }}
      >
        {/* Header */}
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
                  handleClose();
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

        {/* Table */}
        <div className='overflow-y-auto flex-1'>
          {isSubmitting ? (
            Array.from({ length: rows.length }).map((_, i) => (
              <AddItemRowSkeleton key={i} />
            ))
          ) : (
            <OrderItemsTable
              rows={rows}
              onChange={setRows}
              units={units}
              mode='inventory'
            />
          )}
        </div>

        {/* Footer */}
        <div className='flex items-center justify-between px-6 py-4 border-t border-gray-200'>
          <WhiteButton
            onClick={() => {
              if (isFormEmpty()) {
                handleClose();
              } else {
                setShowConfirm(true);
              }
            }}
            disabled={isSubmitting}
          >
            Cancel
          </WhiteButton>

          {showError && (
            <div className='w-[60%] bg-[#fff0f1] text-[#a71a23] font-semibold text-[14px] leading-4.5 rounded px-3 py-2 flex items-center'>
              <img src='/icons/error.svg' className='w-5 ml-2 mr-2' />
              <span className='ml-2'>
                Fill in all the required fields before you continue
              </span>
            </div>
          )}

          <GreenButton onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Adding items…' : `Add items to ${inventoryName}`}
          </GreenButton>
        </div>
      </div>

      {/* Import Modal */}
      <ImportItemsModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        selectedInventory={selectedInventory}
        onImportSuccess={(items) => {
          const mappedRows = items.map((item) => ({
            ...emptyRow(),
            sku: item.sku || '',
            name: item.name || '',
            quantity: item.quantity || '',
            unit: item.unit || '',
            price: item.costPerUnit || '', // mapped from costPerUnit → price
            unitId: item._unitId || '',
            _fromSearch: false,
          }));
          setRows((prev) => [...mappedRows, ...prev]);
          setShowImportModal(false);
        }}
      />

      {/* Confirm cancel */}
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
            handleClose();
          }}
        />
      )}
    </div>
  );
}
