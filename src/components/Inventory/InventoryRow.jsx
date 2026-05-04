import { useState, useEffect, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';

import { formatDate, formatPrice } from '../../utils/format';
import {
  updateStoreProduct,
  deleteStoreProduct,
} from '../../services/productService';
import ConfirmModal from '../Common/ConfirmModal';

function formatQty(num) {
  return num.toFixed(2).replace('.', ',');
}

function getExpirationStatus(dateStr) {
  if (
    !dateStr ||
    dateStr === 'Not specified' ||
    dateStr === 'Multiple' ||
    dateStr === '----'
  )
    return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const exp = new Date(dateStr);
  if (isNaN(exp)) return null;
  const diffMs = exp - today;
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return { type: 'expired' };
  return { type: 'days_left', days: diffDays };
}

// Exact .neutral-lbl.highlighted + .inventory-danger styles from dev
function ExpirationBadge({ dateStr }) {
  const status = getExpirationStatus(dateStr);
  if (!status) return null;

  if (status.type === 'expired') {
    return (
      <label
        style={{
          display: 'inline-block',
          marginTop: 5,
          backgroundColor: '#fde8e8',
          color: '#c0392b',
          fontSize: 11,
          lineHeight: '16px',
          fontWeight: 600,
          fontStyle: 'normal',
          textTransform: 'uppercase',
          letterSpacing: '.08em',
          padding: '2px 8px',
          borderRadius: 4,
          textAlign: 'center',
        }}
      >
        Expired
      </label>
    );
  }

  return (
    <label
      style={{
        display: 'inline-block',
        marginTop: 5,
        backgroundColor: '#e6e3ff',
        color: '#362a96',
        fontSize: 11,
        lineHeight: '16px',
        fontWeight: 600,
        fontStyle: 'normal',
        textTransform: 'uppercase',
        letterSpacing: '.08em',
        padding: '2px 8px',
        borderRadius: 4,
        textAlign: 'center',
      }}
    >
      {status.days} Days Left
    </label>
  );
}

// .multiple div with date + badge stacked — matches dev's <div class="multiple"> pattern
function ExpirationCell({ dateStr }) {
  if (!dateStr) {
    return (
      <div style={{ display: 'block', margin: '0 0 20px' }}>
        <span style={{ color: 'rgb(107,107,111)' }}>-----</span>
      </div>
    );
  }
  const displayDate = formatDate(dateStr);
  return (
    <div style={{ display: 'block', margin: '0 0 20px' }}>
      <span style={{ color: '#6b6b6f', lineHeight: '20px' }}>
        {displayDate}
      </span>
      <br />
      <ExpirationBadge dateStr={dateStr} />
    </div>
  );
}

// OUT OF STOCK badge — exact .neutral-lbl.highlightedstock from dev
const OutOfStockBadge = () => (
  <label
    style={{
      display: 'inline-block',
      backgroundColor: '#e7e7ec',
      color: '#57575b',
      fontSize: 11,
      lineHeight: '16px',
      fontWeight: 600,
      fontStyle: 'normal',
      textTransform: 'uppercase',
      letterSpacing: '.08em',
      padding: '2px 8px',
      borderRadius: 4,
      textAlign: 'center',
    }}
  >
    Out of stock
  </label>
);

// Shared TD style — .pd-y-5 = padding 5px top/bottom
const tdStyle = {
  paddingTop: 12,
  // paddingBottom: 5,
  // marginTop: 5,
  verticalAlign: 'top',
  borderTop: '1px solid #dee2e6',
  color: '#333333',
  fontSize: 12,
};

// .dark-text styles
const darkText = {
  color: '#19191c',
  fontSize: 13,
  lineHeight: '20px',
  fontWeight: 400,
};

// .grey-text styles
const greyText = {
  color: '#6b6b6f',
  lineHeight: '20px',
  fontSize: 12,
};

// .multiple div — display:block, margin: 0 0 20px
const multipleDiv = {
  display: 'block',
  margin: '0 0 20px',
};

function BatchRow({ batch, isEditing, editQty, onQtyChange }) {
  const hasQty = batch.quantity > 0;
  const expStatus = getExpirationStatus(batch.expirationDate);

  return (
    <tr>
      {/* Checkbox placeholder */}
      <td style={{ ...tdStyle, paddingLeft: 24, borderTop: 'none' }} />

      {/* Name placeholder with vertical line */}
      <td
        style={{
          ...tdStyle,
          paddingLeft: 48,
          position: 'relative',
          borderTop: 'none',
        }}
      ></td>

      {/* Arrival */}
      <td style={{ ...tdStyle, borderTop: 'none' }}>
        <div style={{ display: 'block', margin: '0 0 20px' }}>
          <span style={greyText}> {formatDate(batch.arrivalDate)}</span>
          <br />
          <span style={{ ...greyText, fontSize: 12 }}>
            {batch.daysInStorage} Days in storage
          </span>
        </div>
      </td>

      {/* Expiration */}
      <td style={{ ...tdStyle, borderTop: 'none' }}>
        {batch.expirationDate ? (
          <div
            style={{
              ...multipleDiv,
              padding: hasQty ? undefined : '3px 0 18px',
            }}
          >
            <span style={greyText}>{formatDate(batch.expirationDate)}</span>
            <br />
            {hasQty && <ExpirationBadge dateStr={batch.expirationDate} />}
          </div>
        ) : (
          <div style={{ ...multipleDiv, padding: '3px 0 18px' }}>
            <span
              style={{ ...greyText, marginBottom: 4, display: 'inline-block' }}
            >
              Not specified
            </span>
            <br />
          </div>
        )}
      </td>

      {/* Quantity */}
      <td style={{ ...tdStyle, borderTop: 'none' }}>
        <div style={{ ...multipleDiv, padding: '3px 0 18px' }}>
          {isEditing ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                width: 'fit-content',
                backgroundColor: '#f0f0f0',
                borderRadius: 3,
              }}
            >
              <input
                type='number'
                value={editQty}
                onChange={(e) => onQtyChange(e.target.value)}
                style={{
                  width: 100,
                  padding: '3px 4px 3px 8px',
                  fontSize: 13,
                  textAlign: 'right',
                  color: '#333333',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                }}
              />
              <span
                style={{
                  fontSize: 13,
                  color: '#6b6b6f',
                  paddingRight: 8,
                  whiteSpace: 'nowrap',
                }}
              >
                {batch.unit}
              </span>
            </div>
          ) : batch.quantity === 0 ? (
            <OutOfStockBadge />
          ) : (
            <>
              <span style={{ ...greyText, fontWeight: 400 }}>
                {formatQty(batch.quantity)}
              </span>
              <span style={greyText}>{batch.unit}</span>
            </>
          )}
        </div>
      </td>

      {/* Unit Price */}
      <td style={{ ...tdStyle, borderTop: 'none', textAlign: 'center' }}>
        <div style={{ ...multipleDiv, padding: '3px 0 18px' }}>
          <span style={greyText}>{formatPrice(batch.unitPrice)} </span>
        </div>
      </td>

      {/* Total */}
      <td
        style={{
          ...tdStyle,
          borderTop: 'none',
          textAlign: 'right',
          paddingRight: 30,
        }}
      >
        <div style={{ ...multipleDiv, padding: '3px 0 18px' }}>
          <span style={greyText}>
            {batch.total != null
              ? formatPrice(batch.total)
              : 'Not specified'}{' '}
          </span>
        </div>
      </td>

      {/* Actions placeholder */}
      <td style={{ ...tdStyle, borderTop: 'none', paddingRight: 48 }} />
    </tr>
  );
}

export default function InventoryRow({ item, selected, onSelect }) {
  const hasBatches = item.batches && item.batches.length > 0;
  const isMulti = item.batches?.length > 1;
  const [isEditing, setIsEditing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [dotHovered, setDotHovered] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const menuRef = useRef(null);
  const [editQtys, setEditQtys] = useState({});

  const queryClient = useQueryClient();
  const selectedInventory = useSelector((s) => s.inventory.selectedInventory);

  const isViewOnly = selectedInventory?.permission === 'Viewer';

  const updateMutation = useMutation({
    mutationFn: updateStoreProduct,

    onSuccess: () => {
      console.log('All query keys in cache:');
      console.log(
        queryClient
          .getQueryCache()
          .getAll()
          .map((q) => q.queryKey),
      );

      queryClient.invalidateQueries({
        queryKey: ['products', selectedInventory?.id],
      });

      queryClient.invalidateQueries({
        queryKey: ['stock-value', selectedInventory?.id],
      });

      setIsEditing(false);
    },

    onError: (err) => console.error('Update failed:', err),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteStoreProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['products', selectedInventory?.id],
      });
      queryClient.invalidateQueries({
        queryKey: ['stock-value', selectedInventory?.id],
      });
      setShowDeleteModal(false);
      setShowMenu(false);
    },
    onError: (err) => console.error('Delete failed:', err),
  });

  const singleExpDisplay =
    item.expirationInfo && item.expirationInfo !== 'Multiple'
      ? item.expirationInfo
      : null;

  useEffect(() => {
    if (!showMenu) return;
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setShowMenu(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showMenu]);

  function handleEditClick() {
    const initial = {};
    item.batches?.forEach((b) => {
      initial[b.id] = b.quantity;
    });
    setEditQtys(initial);
    setIsEditing(true);
  }

  function handleCancelEdit() {
    setIsEditing(false);
    setEditQtys({});
  }

  function handleSaveEdit() {
    const updatedBatches = item.batches.map((b) => ({
      ...b,
      quantity: Number(editQtys[b.id] ?? b.quantity),
    }));
    const firstBatchRawId = item.batches[0]?.rawId;
    updateMutation.mutate(
      {
        rawId: firstBatchRawId,
        inventoryId: selectedInventory.id,
        stockTakingUnitId: item.stockTakingUnitId,
        batches: updatedBatches,
      },
      {
        onMutate: async () => {
          await queryClient.cancelQueries(['products', selectedInventory?.id]);
          const previous = queryClient.getQueryData([
            'products',
            selectedInventory?.id,
          ]);
          queryClient.setQueryData(
            ['products', selectedInventory?.id],
            (old = []) =>
              old.map((p) =>
                p.id === item.rawId ? { ...p, products: updatedBatches } : p,
              ),
          );
          return { previous };
        },
        onError: (err, _, context) => {
          queryClient.setQueryData(
            ['products', selectedInventory?.id],
            context.previous,
          );
        },
      },
    );
  }

  function handleDeleteConfirm() {
    const rawId = item.batches[0]?.storeProductId;
    if (!rawId) {
      console.error('No storeProductId found:', item.batches);
      return;
    }
    deleteMutation.mutate({ rawId, inventoryId: selectedInventory.id });
  }

  return (
    <>
      {/* ── MAIN ROW ── */}
      <tr id={item.id} className='invtr'>
        {/* Checkbox */}
        <td style={{ ...tdStyle, paddingLeft: 24, width: 44 }}>
          <label
            style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          >
            <input
              type='checkbox'
              className='hidden'
              checked={selected}
              onChange={onSelect}
            />
            <div
              style={{
                width: 20,
                height: 20,
                border: selected ? '1px solid #059669' : '1px solid #d1d5db',
                borderRadius: 4,
                backgroundColor: selected ? '#059669' : '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {selected && (
                <svg
                  width='14'
                  height='14'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='white'
                  strokeWidth='3'
                >
                  <path d='M5 13l4 4L19 7' />
                </svg>
              )}
            </div>
          </label>
        </td>

        {/* Item Name */}
        <td style={{ ...tdStyle, paddingLeft: 48 }}>
          {/* Main row: single .multiple div wrapping item name */}
          <div style={multipleDiv}>
            <span style={{ ...darkText, fontWeight: 600 }}>{item.name}</span>
          </div>
        </td>

        {/* Arrival Info */}
        <td style={tdStyle}>
          <div style={multipleDiv}>
            <span style={darkText}>
              {isMulti ? (
                'Multiple'
              ) : item.arrivalInfo ? (
                formatDate(item.arrivalInfo)
              ) : (
                <span style={{ color: 'rgb(107,107,111)' }}>-----</span>
              )}
            </span>
            <br />
            {!isMulti && item.daysInStorage != null && (
              <span style={{ ...greyText, fontSize: 12 }}>
                {item.daysInStorage} Days in storage
              </span>
            )}
          </div>
        </td>

        {/* Expiration Info */}
        <td style={tdStyle}>
          {isMulti ? (
            <div style={multipleDiv}>
              <span style={darkText}>Multiple</span>
              <br />
            </div>
          ) : singleExpDisplay ? (
            <div style={multipleDiv}>
              <span style={darkText}>{formatDate(singleExpDisplay)}</span>
              <br />
            </div>
          ) : (
            <div style={multipleDiv}>
              <span style={darkText}>
                <div style={{ color: 'rgb(107,107,111)' }}>-----</div>
              </span>
              <br />
            </div>
          )}
        </td>

        {/* Quantity */}
        <td style={tdStyle}>
          <div style={{ ...multipleDiv, marginBottom: 24 }}>
            {item.quantity === 0 ? (
              <OutOfStockBadge />
            ) : (
              <>
                <span style={{ ...darkText, fontWeight: 400 }}>
                  {item.quantity ? formatQty(item.quantity) : '--'}{' '}
                </span>
                <span style={darkText}>{item.unit}</span>
              </>
            )}
          </div>
        </td>

        {/* Unit Price */}
        <td style={{ ...tdStyle, textAlign: 'center' }}>
          <div style={multipleDiv}>
            <span style={darkText}>
              {isMulti ? 'Multiple' : formatPrice(item.unitPrice)}
            </span>
          </div>
        </td>

        {/* Total Value */}
        <td style={{ ...tdStyle, textAlign: 'right', paddingRight: 30 }}>
          <div style={{ ...multipleDiv, marginBottom: 24 }}>
            <span style={{ ...darkText, fontWeight: 600 }}>
              {formatPrice(item.total ?? 0)}
            </span>
          </div>
        </td>

        {/* Actions */}
        <td
          style={{ ...tdStyle, paddingLeft: 35, paddingRight: 45, width: 60 }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {isEditing ? (
              <>
                <img
                  src='/img/reverse.png'
                  alt='cancel'
                  onClick={handleCancelEdit}
                  style={{
                    width: 20,
                    height: 20,
                    objectFit: 'contain',
                    cursor: 'pointer',
                  }}
                />
                <img
                  src='/img/check_ok.png'
                  alt='save'
                  onClick={handleSaveEdit}
                  style={{
                    width: 20,
                    height: 20,
                    objectFit: 'contain',
                    cursor: 'pointer',
                    marginLeft: 8,
                  }}
                />
              </>
            ) : (
              <>
                <img
                  src='/img/pencil.png'
                  alt='edit'
                  onClick={() => !isViewOnly && handleEditClick()}
                  style={{
                    padding: '2px 2px 3px 3px',
                    cursor: isViewOnly ? 'not-allowed' : 'pointer',
                    opacity: isViewOnly ? 0.4 : 1,
                  }}
                />
                <div
                  style={{ position: 'relative', marginLeft: 16 }}
                  ref={menuRef}
                >
                  <img
                    src='/img/more_verticle_icon.png'
                    alt='more'
                    onClick={() => !isViewOnly && setShowMenu((p) => !p)}
                    onMouseEnter={() => !isViewOnly && setDotHovered(true)}
                    onMouseLeave={() => setDotHovered(false)}
                    style={{
                      cursor: isViewOnly ? 'not-allowed' : 'pointer',
                      width: 20,
                      height: 20,
                      objectFit: 'contain',
                      filter:
                        dotHovered && !isViewOnly ? 'brightness(0)' : 'none',
                      transition: 'filter 0.15s',
                      opacity: isViewOnly ? 0.4 : 1,
                    }}
                  />

                  {showMenu && (
                    <div
                      style={{
                        position: 'absolute',
                        right: 0,
                        top: '100%',
                        marginTop: 4,
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: 4,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        zIndex: 50,
                        minWidth: 120,
                      }}
                    >
                      <button
                        onClick={() => {
                          if (isViewOnly) return;
                          setShowMenu(false);
                          setShowDeleteModal(true);
                        }}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          fontSize: 13,
                          color: '#374151',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          textAlign: 'left',
                          whiteSpace: 'nowrap',
                        }}
                        onMouseEnter={(e) =>
                          (e.target.style.backgroundColor = '#f9fafb')
                        }
                        onMouseLeave={(e) =>
                          (e.target.style.backgroundColor = 'transparent')
                        }
                      >
                        Delete item
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </td>
      </tr>

      {/* ── BATCH SUB-ROWS ── */}
      {hasBatches &&
        item.quantity > 0 &&
        item.batches.map((batch) => (
          <BatchRow
            key={batch.id}
            batch={batch}
            isEditing={isEditing}
            editQty={editQtys[batch.id] ?? batch.quantity}
            onQtyChange={(val) =>
              setEditQtys((prev) => ({ ...prev, [batch.id]: val }))
            }
          />
        ))}

      {/* ── DELETE MODAL ── */}
      <ConfirmModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title={`Do you want to delete ${item.name}, from the Inventory`}
        description='This action is irreversible and you will lose all the information related to this product.'
        confirmLabel='Delete'
        cancelLabel='Cancel'
      />
    </>
  );
}
