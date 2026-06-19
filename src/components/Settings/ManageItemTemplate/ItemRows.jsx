import { useState, useRef, useEffect } from 'react';

import EditItemTemplate from './EditItemTemplate';
import ConfirmModal from '../../Common/ConfirmModal';

const MAX_VISIBLE_INVENTORIES = 3;

export default function ItemRow({
  item,
  checked,
  onToggle,
  checkedIds,
  onDupToggle,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDuplicates, setShowDuplicates] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setMenuOpen(false);
    }
    if (menuOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  const tdBase = 'align-top text-left border-b border-[#e6e6ed] px-[10px]';
  const tdPadY = 'pt-[26px] pb-[26px]';

  function UnitCell({ unit }) {
    if (!unit || !unit.name) {
      return (
        <span className='text-[#6b6b6f] text-[12px] italic font-normal leading-4 w-full'>
          -----
        </span>
      );
    }
    return (
      <div className='flex flex-col w-full'>
        <span className='text-[#000] text-[13px] font-normal leading-5 w-full'>
          {unit.name}
        </span>
        {unit.price && (
          <span className='text-[#6b6b6f] text-[12px] italic font-normal leading-4 mt-2 w-full'>
            {unit.price}
          </span>
        )}
      </div>
    );
  }

  function ActionMenu({ itemRef }) {
    return (
      <div className='relative' ref={itemRef}>
        <button
          onClick={() => setMenuOpen((p) => !p)}
          className='w-12 h-12 flex items-center justify-center rounded-full hover:bg-gray-100 cursor-pointer bg-transparent border-none mb-2'
        >
          <img src='/icons/dark-more.svg' alt='' className='align-middle' />
        </button>
        {menuOpen && (
          <div
            className='absolute bg-white z-50 py-[9px]'
            style={{
              minWidth: '219px',
              maxWidth: '219px',
              right: 0,
              top: '55px',
              border: '1px solid #d7d7db',
              borderRadius: '4px',
              boxShadow: '0 2px 8px 0 rgba(0,0,0,0.12)',
            }}
          >
            {[
              { icon: '/icons/dark-edit.svg', label: 'Edit item template' },
              { icon: '/icons/dark-bin.svg', label: 'Delete item template' },
              { icon: '/icons/plus-dark.svg', label: 'Add item to inventory' },
            ].map((action) => (
              <button
                key={action.label}
                onClick={() => {
                  if (action.label === 'Edit item template') {
                    setMenuOpen(false);
                    setShowEditModal(true);
                  }
                  if (action.label === 'Delete item template') {
                    setMenuOpen(false);
                    setShowDeleteModal(true);
                  }
                }}
                className='flex items-center gap-2 w-full px-[18px] py-2 text-[14px] font-normal leading-4 text-[#19191c] hover:bg-[#f1f1f5] cursor-pointer bg-transparent border-none text-left'
              >
                <span className='flex items-center mr-2'>
                  <img
                    src={action.icon}
                    alt=''
                    width={16}
                    height={16}
                    className='align-middle'
                  />
                </span>
                <span className='text-[14px] font-normal leading-4 text-[#19191c]'>
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }
  function renderRow(rowItem, rowChecked, rowToggle, isRed = false) {
    const inStock = Array.isArray(rowItem.inStock) ? rowItem.inStock : [];

    console.log(item);

    return (
      <>
        <tr className='relative'>
          <td
            className={`${tdBase} ${tdPadY} pl-8 pr-[10px]`}
            style={{
              minWidth: '62px',
              minHeight: '72px',
              ...(isRed ? { borderLeft: '6px solid #e2232e' } : {}),
            }}
          >
            <label
              className='relative block cursor-pointer select-none'
              style={{ paddingLeft: '20px', marginBottom: '12px' }}
            >
              <input
                type='checkbox'
                checked={rowChecked}
                onChange={rowToggle}
                className='absolute opacity-0 cursor-pointer h-0 w-0'
              />
              <span
                className={`absolute top-0 left-0 h-5 w-5 border ${rowChecked ? 'bg-[#23a956] border-[#23a956]' : 'bg-white border-[#d7d7db]'}`}
                style={{ borderRadius: '4px' }}
              >
                {rowChecked && (
                  <span
                    className='absolute'
                    style={{
                      left: '7px',
                      top: '4px',
                      width: '4px',
                      height: '8px',
                      border: 'solid white',
                      borderWidth: '0 2px 2px 0',
                      transform: 'rotate(45deg)',
                      display: 'block',
                    }}
                  />
                )}
              </span>
            </label>
          </td>

          <td
            className={`${tdBase} ${tdPadY} pl-[10px]`}
            style={{
              minWidth: '300px',
              width: '38%',
              overflowWrap: 'anywhere',
              height: '72px',
            }}
          >
            <span className='text-[#000] font-semibold text-sm leading-5'>
              {rowItem.name}
            </span>
          </td>

          <td
            className={`${tdBase} ${tdPadY} text-center`}
            style={{ width: '8%', height: '72px' }}
          >
            <span className='text-[#000] font-semibold text-sm leading-5'>
              {rowItem.sku || ''}
            </span>
          </td>

          <td
            className={`${tdBase} ${tdPadY}`}
            style={{ width: '7%', height: '72px' }}
          >
            <UnitCell unit={rowItem.purchaseUnit} />
          </td>

          <td
            className={`${tdBase} ${tdPadY}`}
            style={{ width: '7%', height: '72px' }}
          >
            <UnitCell unit={rowItem.stockTakingUnit} />
          </td>

          <td
            className={`${tdBase} ${tdPadY}`}
            style={{ width: '7%', minWidth: '70px', height: '72px' }}
          >
            <UnitCell unit={rowItem.basicMeasUnit} />
          </td>

          <td
            className={`${tdBase} ${tdPadY}`}
            style={{ width: '12%', minWidth: '85px', height: '72px' }}
          >
            <div className='flex flex-col w-full'>
              <span className='text-[#000] text-[13px] font-normal leading-5 w-full'>
                {rowItem.category}
              </span>
              <span className='text-[#6b6b6f] text-[12px] italic font-normal leading-4 mt-2 w-full'>
                {rowItem.subcategory}
              </span>
            </div>
          </td>

          <td
            className={`${tdBase} ${tdPadY}`}
            style={{ width: '8%', height: '72px' }}
          >
            <span className='text-[#000] text-[13px] font-normal leading-5'>
              {rowItem.durabilityDays}
            </span>
          </td>

          <td
            className={`${tdBase} ${tdPadY}`}
            style={{ width: '15%', minWidth: '150px', height: '72px' }}
          >
            <div className='flex flex-col' style={{ maxWidth: '130px' }}>
              {!inStock || inStock.length === 0 ? (
                <span className='text-[#6b6b6f] text-[12px] italic font-normal'>
                  -----
                </span>
              ) : (
                <>
                  {(inStock || [])
                    .slice(0, MAX_VISIBLE_INVENTORIES)
                    .map((inv) => (
                      <span
                        key={inv}
                        className='text-[13px] font-semibold leading-5 text-[#23a956] underline cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap w-full'
                      >
                        {inv}
                      </span>
                    ))}
                  {(inStock || []).length - MAX_VISIBLE_INVENTORIES > 0 && (
                    <span className='text-[13px] font-semibold leading-5 text-[#6b6b6f] underline cursor-pointer mt-1'>
                      &amp; {inStock.length - MAX_VISIBLE_INVENTORIES} more
                    </span>
                  )}
                </>
              )}
            </div>
          </td>

          <td
            className={`${tdBase} ${tdPadY} pr-8 relative`}
            style={{
              height: '72px',
              ...(isRed ? { borderRight: '6px solid #e2232e' } : {}),
            }}
          >
            <ActionMenu itemRef={menuRef} />
          </td>
        </tr>

        {/* Divider */}
        {!isRed && (
          <tr>
            <td colSpan={10} style={{ height: '1px', padding: '0' }}>
              <hr
                style={{ margin: '0', borderTop: '1px solid rgba(0,0,0,0.1)' }}
              />
            </td>
          </tr>
        )}
      </>
    );
  }

  return (
    <>
      {/* Main row — red border only if isDuplicate */}
      {renderRow(item, checked, onToggle, item.isDuplicate)}

      {/* Duplicate alert + expanded rows */}
      {item.isDuplicate && (
        <>
          <tr className='relative'>
            <td
              colSpan={10}
              className='p-0 border-b border-[#e6e6ed]'
              style={{
                borderLeft: '6px solid #e2232e',
                borderRight: '6px solid #e2232e',
              }}
            >
              <div
                className='flex justify-between items-center w-full'
                style={{
                  padding: '12px 16px',
                  fontSize: '14px',
                  lineHeight: '18px',
                  fontWeight: '600',
                  background: '#fff0f1',
                  borderRadius: '8px',
                  color: '#a71a23',
                }}
              >
                <span>Duplicate item templates found</span>
                <button
                  onClick={() => setShowDuplicates((p) => !p)}
                  className='flex items-center text-[#23a956] text-sm font-semibold cursor-pointer bg-transparent border-none pl-12 pr-4'
                >
                  {showDuplicates
                    ? 'Hide the duplicates'
                    : 'Show the duplicates'}
                  <img
                    src='/icons/down-green-arrow.svg'
                    alt=''
                    className='ml-1 align-middle transition-transform'
                    style={{
                      transform: showDuplicates
                        ? 'rotate(180deg)'
                        : 'rotate(0deg)',
                    }}
                  />
                </button>
              </div>
            </td>
          </tr>

          {/* Expanded duplicate rows */}
          {showDuplicates &&
            item.duplicateProducts &&
            item.duplicateProducts.map((dupItem) => (
              <tr key={dupItem.id} className='relative'>
                <td
                  className={`${tdBase} ${tdPadY} pl-8 pr-[10px]`}
                  style={{
                    minWidth: '62px',
                    height: '72px',
                    borderLeft: '6px solid #e2232e',
                  }}
                >
                  <label
                    className='relative block cursor-pointer select-none'
                    style={{ paddingLeft: '20px', marginBottom: '12px' }}
                  >
                    <input
                      type='checkbox'
                      checked={checkedIds.includes(dupItem.id)}
                      onChange={() => onDupToggle(dupItem.id)}
                      className='absolute opacity-0 cursor-pointer h-0 w-0'
                    />
                    <span
                      className={`absolute top-0 left-0 h-5 w-5 border ${checkedIds.includes(dupItem.id) ? 'bg-[#23a956] border-[#23a956]' : 'bg-white border-[#d7d7db]'}`}
                      style={{ borderRadius: '4px' }}
                    >
                      {checkedIds.includes(dupItem.id) && (
                        <span
                          className='absolute'
                          style={{
                            left: '7px',
                            top: '4px',
                            width: '4px',
                            height: '8px',
                            border: 'solid white',
                            borderWidth: '0 2px 2px 0',
                            transform: 'rotate(45deg)',
                            display: 'block',
                          }}
                        />
                      )}
                    </span>
                  </label>
                </td>
                <td
                  className={`${tdBase} ${tdPadY} pl-[10px]`}
                  style={{ minWidth: '300px', width: '38%', height: '72px' }}
                >
                  <span className='text-[#000] font-semibold text-sm leading-5'>
                    {dupItem.name}
                  </span>
                </td>
                <td
                  className={`${tdBase} ${tdPadY} text-center`}
                  style={{ width: '8%', height: '72px' }}
                >
                  <span className='text-[#000] font-semibold text-sm leading-5'>
                    {dupItem.sku || ''}
                  </span>
                </td>
                <td
                  className={`${tdBase} ${tdPadY}`}
                  style={{ width: '7%', height: '72px' }}
                >
                  <div className='flex flex-col w-full'>
                    <span className='text-[#000] text-[13px] font-normal leading-5 w-full'>
                      {dupItem.purchaseUnit}
                    </span>
                    {dupItem.purchasePrice && (
                      <span className='text-[#6b6b6f] text-[12px] italic font-normal leading-4 mt-2 w-full'>
                        {dupItem.purchasePrice}
                      </span>
                    )}
                  </div>
                </td>
                <td
                  className={`${tdBase} ${tdPadY}`}
                  style={{ width: '7%', height: '72px' }}
                >
                  <div className='flex flex-col w-full'>
                    <span className='text-[#000] text-[13px] font-normal leading-5 w-full'>
                      {dupItem.stockTakingUnit}
                    </span>
                    {dupItem.stockPrice && (
                      <span className='text-[#6b6b6f] text-[12px] italic font-normal leading-4 mt-2 w-full'>
                        {dupItem.stockPrice}
                      </span>
                    )}
                  </div>
                </td>
                <td
                  className={`${tdBase} ${tdPadY}`}
                  style={{ width: '7%', height: '72px' }}
                >
                  <span className='text-[#6b6b6f] text-[12px] italic font-normal leading-4 w-full'>
                    -----
                  </span>
                </td>
                <td
                  className={`${tdBase} ${tdPadY}`}
                  style={{ width: '12%', height: '72px' }}
                >
                  <span className='text-[#000] text-[13px] font-normal leading-5 w-full'>
                    {dupItem.category}
                  </span>
                </td>
                <td
                  className={`${tdBase} ${tdPadY}`}
                  style={{ width: '8%', height: '72px' }}
                >
                  <span className='text-[#000] text-[13px] font-normal leading-5'>
                    ----
                  </span>
                </td>
                <td
                  className={`${tdBase} ${tdPadY}`}
                  style={{ width: '15%', height: '72px' }}
                >
                  <div className='flex flex-col' style={{ maxWidth: '130px' }}>
                    {dupItem.inStock &&
                      dupItem.inStock.map((inv) => (
                        <span
                          key={inv}
                          className='text-[13px] font-semibold leading-5 text-[#23a956] underline cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap w-full'
                        >
                          {inv}
                        </span>
                      ))}
                  </div>
                </td>
                <td
                  className={`${tdBase} ${tdPadY} pr-8`}
                  style={{
                    height: '72px',
                    borderRight: '6px solid #e2232e',
                  }}
                />
              </tr>
            ))}

          {/* Divider after alert/expanded section */}
          <tr>
            <td colSpan={10} style={{ height: '1px', padding: '0' }}>
              <hr
                style={{ margin: '0', borderTop: '1px solid rgba(0,0,0,0.1)' }}
              />
            </td>
          </tr>
        </>
      )}

      {showEditModal && (
        <EditItemTemplate
          isOpen={showEditModal}
          item={item}
          onClose={() => setShowEditModal(false)}
        />
      )}

      <ConfirmModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title='Delete the template?'
        description='is currently not listed in any inventory. Please note that deleting the item template is irreversible and all associated data will be permanently deleted.'
        confirmLabel='Delete Item Template'
        cancelLabel='Cancel'
        onConfirm={() => setShowDeleteModal(false)}
      />
    </>
  );
}
