import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createPortal } from 'react-dom';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';

import GreenButton from '../../Common/GreenButton';
import WhiteButton from '../../Common/WhiteButton';
import Checkbox from '../../Common/Checkbox';
import SupplierSearchDropdown from '../../Common/SupplierSearchDropdown';
import {
  parseExcel,
  addInitialProducts,
} from '../../../services/manageItemTemplateService';
import { fetchSuppliers } from '../../../services/supplierService';
import { fetchMeasurementUnits } from '../../../services/masterDataService';
import { getUserIdFromToken } from '../../../services/analyticsService';

const STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
};

function SimpleUnitDropdown({ units, value, onChange, error }) {
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
    <div ref={ref} className='relative select-none' style={{ width: '160px' }}>
      {/* Header */}
      <div
        onClick={() => setOpen((p) => !p)}
        className={`flex items-center justify-between h-[36px] rounded-[3px] cursor-pointer transition-all px-5 ${
          error
            ? 'bg-[#fff0f1] border border-[#fc5c63] shadow-[0_0_0_1px_#fc5c63]'
            : 'bg-[#f1f1f5] border border-[#dfdfdf]'
        }`}
      >
        <span
          className='text-[12px] leading-5 font-light truncate'
          style={{ color: 'black' }}
        >
          {value || ''}
        </span>
        <img
          src='/icons/chevron-down-small.svg'
          alt=''
          className='mr-[-8px] shrink-0'
        />
      </div>

      {/* Dropdown list */}
      {open && (
        <ul
          className='absolute z-50 w-full bg-white border border-[#d7d7db] rounded-[4px] shadow-[0_2px_8px_rgba(0,0,0,0.12)] py-[15px] mt-2 overflow-y-auto list-none p-0 m-0'
          style={{ maxHeight: '215px' }}
        >
          {units.map((u) => (
            <li
              key={u.id}
              onClick={() => {
                onChange(u.label, u.id);
                setOpen(false);
              }}
              className={`flex justify-between items-center px-5 py-2 text-[12px] leading-5 text-[#19191c] font-normal cursor-pointer hover:bg-gray-100 ${
                value === u.label ? 'bg-[#eaf7ee]' : ''
              }`}
            >
              {u.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function UploadAnExcelModal({ isOpen, onClose, onSuccess }) {
  const [uploadState, setUploadState] = useState(STATES.IDLE);
  const [fileName, setFileName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [step, setStep] = useState(1);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [supplierError, setSupplierError] = useState(false);
  const [productRows, setProductRows] = useState([]);
  const [showUnitErrors, setShowUnitErrors] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [footerError, setFooterError] = useState(false);
  const [parsedProducts, setParsedProducts] = useState([]);

  const [allInDB, setAllInDB] = useState(false);

  const selectedInventory = useSelector(
    (state) => state.inventory.selectedInventory,
  );
  //   const currencyId = selectedInventory?.currencyId || '';

  const currencyId = (() => {
    // try localStorage first (works on dev)
    try {
      const keys = Object.keys(localStorage);
      for (const key of keys) {
        const raw = localStorage.getItem(key);
        if (!raw) continue;
        try {
          const parsed = JSON.parse(raw);
          const id = parsed?.user?.currencyId || parsed?.currencyId;
          if (id) return id;
        } catch {
          continue;
        }
      }
    } catch {}
    // fallback to env
    return import.meta.env.VITE_CURRENCY_ID || '';
  })();

  const inputRef = useRef(null);
  const queryClient = useQueryClient();

  const { data: suppliers = [] } = useQuery({
    queryKey: ['suppliers'],
    queryFn: fetchSuppliers,
    staleTime: 5 * 60 * 1000,
  });

  const { data: units } = useQuery({
    queryKey: ['measurementUnits'],
    queryFn: fetchMeasurementUnits,
    staleTime: Infinity,
  });

  const { mutate: submitProducts, isPending: isSubmitting } = useMutation({
    mutationFn: addInitialProducts,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['itemTemplates'] });
      onSuccess?.();
      handleClose();
    },
    onError: (err) => {
      console.error('submit error:', err);
      setFooterError(true);
    },
  });

  const allUnits = [
    ...(units?.purchaseUnit || []),
    ...(units?.stockTakingUnit || []),
    ...(units?.basicMeasurementUnit || []),
  ].reduce((acc, u) => {
    if (!acc.find((x) => x.id === u.id)) {
      acc.push({
        id: u.id,
        label: u.name,
        value: u.name,
        singular: u.singularShortcut,
        plural: u.pluralShortcut,
      });
    }
    return acc;
  }, []);

  useEffect(() => {
    const newProducts = parsedProducts.filter((p) => p.isInDB === 0);
    if (newProducts.length > 0 && allUnits.length > 0) {
      setProductRows(
        newProducts.map((p) => {
          const suUnit = allUnits.find((u) => u.id === p.stockTakingUnitId);

          return {
            ...p,
            checked: true,
            purchaseUnitId: p.purchaseUnitId || null,
            purchaseUnitName: null,
            stockTakingUnitId: p.stockTakingUnitId || null,
            stockTakingUnitName: suUnit?.label || '',
            stockTakingUnitSingular: suUnit?.singular || '',
            stockTakingUnitPlural: suUnit?.plural || '',
            stockTakingQuantityPerPurchaseUnit:
              p.stockTakingQuantityPerPurchaseUnit ?? 1,
            conversionError:
              !p.stockTakingQuantityPerPurchaseUnit ||
              parseFloat(p.stockTakingQuantityPerPurchaseUnit) <= 0,
          };
        }),
      );
      setShowUnitErrors(false);
    }
  }, [parsedProducts, allUnits.length]);

  useEffect(() => {
    if (step === 3) {
      setShowUnitErrors(true);
    }
  }, [step]);

  const updateRow = (index, fields) => {
    setProductRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, ...fields } : row)),
    );
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const isXlsx = file.name.endsWith('.xlsx') || file.name.endsWith('.xls');
    setFileName(file.name);
    setUploadState(STATES.LOADING);

    if (!isXlsx) {
      setErrorMessage(
        'PDF is not supported in this flow. Please upload an XLSX file.',
      );
      setUploadState(STATES.ERROR);
      resetInput();
      return;
    }

    try {
      // Parse xlsx client-side
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const parseData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      const payload = {
        dateAndTime: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        language: 'en',
        fileName: file.name,
        bucketName: '',
        isFromSetting: 1,
        parseData,
      };

      const response = await parseExcel(payload);
      if (response?.Status) {
        const products = response.Data.products;
        setParsedProducts(products);
        const allExist =
          products.length > 0 && products.every((p) => p.isInDB === 1);
        setAllInDB(allExist);
        if (allExist) {
          setStep(3);
        }
        setUploadState(STATES.SUCCESS);
      } else {
        setErrorMessage(response?.Message || 'Failed to extract file.');
        setUploadState(STATES.ERROR);
      }
    } catch (err) {
      setErrorMessage('Something went wrong. Please try again.');
      setUploadState(STATES.ERROR);
    }

    resetInput();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    handleFileChange({ target: { files: [file] } });
  };

  const resetInput = () => {
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleClose = () => {
    setUploadState(STATES.IDLE);
    setFileName('');
    setErrorMessage('');
    setStep(1);
    setSelectedSupplier(null);
    setSupplierError(false);
    setFooterError(false);
    setParsedProducts([]);
    setProductRows([]);
    setShowUnitErrors(false);
    setAttempted(false);
    setAllInDB(false);

    resetInput();
    onClose();
  };

  const checkedRows = productRows.filter((r) => r.checked);
  const hasNoChecked = checkedRows.length === 0;
  const hasUnitError = checkedRows.some((r) => !r.purchaseUnitId);
  const hasConversionError = checkedRows.some(
    (r) =>
      r.stockTakingQuantityPerPurchaseUnit === '' ||
      r.stockTakingQuantityPerPurchaseUnit === null ||
      parseFloat(r.stockTakingQuantityPerPurchaseUnit) <= 0 ||
      r.conversionError,
  );
  const step3Invalid = hasNoChecked || hasUnitError || hasConversionError;

  const userId = getUserIdFromToken() || '';

  console.log(
    'currentUser_restaurant raw:',
    localStorage.getItem('currentUser_restaurant'),
  );

  if (!isOpen) return null;

  return createPortal(
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 overflow-auto'>
      <div className='bg-white rounded-lg shadow-md w-3/4 h-[calc(100%-48px)] flex flex-col'>
        {/* Header */}
        <div className='flex items-center px-12 py-6 border-b border-[#e7e7ec] rounded-t-lg'>
          <h2 className='flex-1 text-[18px] font-semibold leading-6 tracking-[-0.01em] text-[#19191c] mr-7'>
            Add order with receipt{' '}
            <label className='ml-4 font-semibold text-gray-800'>
              Step {step}/3
            </label>
          </h2>

          <span className='cursor-pointer ml-auto' onClick={handleClose}>
            <img src='/icons/closepopup-icon.svg' alt='close' />
          </span>
        </div>

        {/* Body */}

        <div
          className='flex-1 overflow-y-auto text-base leading-6 text-[#737373]'
          style={{ padding: '36px 48px 24px' }}
        >
          {/* Step 1 */}
          {step === 1 && (
            <div
              className='h-full border-2 border-dashed border-[#d7d7db] rounded-lg pt-[10px] cursor-pointer flex flex-col items-center text-center'
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              <h2 className='text-2xl font-semibold tracking-[-0.01em] text-[#19191c] mb-6 text-center'>
                Upload an order to extract products
              </h2>

              {/* IDLE */}
              {uploadState === STATES.IDLE && (
                <div>
                  <div className='mx-auto mb-10 text-left w-[360px]'>
                    <ul className='list-disc ml-[26px] space-y-4'>
                      <li>Supported file formats XLS and XLSX</li>
                      <li>Maximum file size is 5 MB</li>
                      <li>
                        <a
                          href='https://dev.totalctrl.com/restaurant/resources/productexcel/TotalCtrl_Items_List_Template_en.xlsx'
                          className='text-[#23a956]'
                        >
                          Download Demo XLSX file
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className='relative overflow-hidden inline-block'>
                    <GreenButton className='py-3'>
                      Select a file from your computer
                    </GreenButton>
                    <input
                      ref={inputRef}
                      type='file'
                      name='myfile'
                      accept='.pdf, .xlsx'
                      onChange={handleFileChange}
                      className='absolute left-0 top-0 opacity-0 w-full h-full cursor-pointer text-[100px]'
                    />
                  </div>
                  <p className='mt-5'>OR</p>
                  <p>You can also drag and drop the file here</p>
                </div>
              )}

              {/* LOADING */}
              {uploadState === STATES.LOADING && (
                <div>
                  <h5 className='font-medium text-[#19191c] text-[18px] leading-7 mb-0'>
                    {fileName}
                  </h5>
                  <div className='flex flex-col items-center'>
                    <img
                      src='/import_order_loader.gif'
                      alt='loading'
                      className='mt-[46px] mb-[30px] block mx-auto'
                    />
                    <span>Extracting data...</span>
                  </div>
                </div>
              )}

              {/* SUCCESS */}
              {uploadState === STATES.SUCCESS && (
                <div>
                  <h5 className='font-medium text-[#19191c] text-[18px] leading-7 mb-0'>
                    {fileName}
                  </h5>
                  <div className='mx-auto mt-6 bg-[#eaf7ee] rounded-lg w-[320px] text-[#0f6f36] px-10 py-9 flex flex-col items-center'>
                    <img
                      src='/icons/ok-circle.svg'
                      alt='success'
                      className='mb-[19px]'
                    />
                    <h5 className='text-[16px] font-semibold leading-5 tracking-[-0.01em] text-center mb-[9px]'>
                      Success
                    </h5>
                    <h5 className='text-[14px] font-normal leading-5 text-center mb-[26px]'>
                      Your file has been succesfully uploaded
                    </h5>
                  </div>
                </div>
              )}

              {/* ERROR */}
              {uploadState === STATES.ERROR && (
                <div>
                  <h5 className='font-medium text-[#19191c] text-[18px] leading-7 mb-0'>
                    {fileName}
                  </h5>
                  <div className='mx-auto mt-6 bg-[#fff0f1] rounded-lg w-[480px] text-[#a71a23] px-10 py-9 flex flex-col items-center'>
                    <img
                      src='/icons/error.svg'
                      alt='error'
                      className='mb-[19px]'
                    />
                    <h5 className='text-[16px] font-semibold leading-5 tracking-[-0.01em] text-center mb-[9px]'>
                      Issues found
                    </h5>
                    <h5 className='text-[14px] font-normal leading-5 text-center mb-[26px]'>
                      {errorMessage}
                    </h5>
                    <div className='relative overflow-hidden inline-block'>
                      <GreenButton className='py-3'>
                        Import another order
                      </GreenButton>
                      <input
                        ref={inputRef}
                        type='file'
                        name='myfile'
                        accept='.pdf, .xlsx'
                        onChange={handleFileChange}
                        className='absolute left-0 top-0 opacity-0 w-full h-full cursor-pointer text-[100px]'
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div>
              <div className='flex'>
                <div
                  className='relative mb-7'
                  style={{ width: '340px', marginRight: '64px' }}
                >
                  <label className='block mb-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6B6B6F]'>
                    Supplier name*
                  </label>
                  <SupplierSearchDropdown
                    className='w-90'
                    suppliers={suppliers}
                    selectedSupplier={selectedSupplier}
                    onSelect={(s) => {
                      setSelectedSupplier(s);
                      setSupplierError(false);
                      setFooterError(false);
                    }}
                    supplierError={supplierError}
                    onBlur={() => {
                      if (!selectedSupplier) setSupplierError(true);
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && allInDB ? (
            <div className='text-left mt-[100px] ml-12'>
              <h2 className='text-2xl text-center font-semibold tracking-[-0.01em] text-[#19191c] mb-6'>
                Congratulations!
              </h2>
              <div className='mx-auto mb-10 text-left w-[360px]'>
                <ul className='list-none m-0 p-0 text-[#737373] text-base text-center leading-6'>
                  All the products in this order are already in your database,
                  so you don't have to set up anything.
                </ul>
              </div>
            </div>
          ) : (
            step === 3 && (
              <div>
                <div className='ml-12'>
                  <h2 className='text-2xl font-semibold tracking-[-0.01em] text-[#19191c] mb-2'>
                    Setup unit conversions
                  </h2>
                  <h5 className='text-[16px] font-medium text-[#6b6b6f]'>
                    We have found {productRows.length} products that are not in
                    your product database yet. <br />
                    Take a moment to setup basic unit conversions.
                  </h5>
                </div>

                <div className='ml-12 mt-10 w-[95%]'>
                  <table className='w-full text-[13px]'>
                    <tbody>
                      {productRows.map((row, index) => {
                        const puError = showUnitErrors && !row.purchaseUnitId;

                        return (
                          <tr key={index} className='border-b border-[#e6e6ed]'>
                            {/* Col 1: Checkbox + Name/SKU */}
                            <td
                              className='py-9 text-left align-middle'
                              style={{ width: '35%' }}
                            >
                              <div className='flex items-start'>
                                <div className='mr-6 pt-[5px]'>
                                  <Checkbox
                                    checked={row.checked}
                                    onChange={(e) => {
                                      const checked = e.target.checked;
                                      updateRow(index, { checked });
                                      const updatedRows = productRows.map(
                                        (r, i) =>
                                          i === index ? { ...r, checked } : r,
                                      );
                                      const newCheckedRows = updatedRows.filter(
                                        (r) => r.checked,
                                      );
                                      if (newCheckedRows.length === 0) {
                                        setAttempted(true);
                                        setFooterError(true);
                                      } else {
                                        setFooterError(false);
                                      }
                                    }}
                                    size={25}
                                  />
                                </div>
                                <div>
                                  <label className='font-semibold text-[18px] leading-6 text-[#19191c] block'>
                                    {row.name}
                                  </label>
                                  <span className='text-[14px] leading-5 text-[#19191c] font-normal'>
                                    {row.sku}
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* Col 2: Purchase unit */}
                            <td
                              className='py-9 text-left align-middle'
                              style={{ width: '10%' }}
                            >
                              <div
                                className='relative'
                                style={{ width: '160px' }}
                              >
                                <label className='block mb-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6b6b6f]'>
                                  Purchase unit
                                </label>
                                <SimpleUnitDropdown
                                  units={allUnits}
                                  value={row.purchaseUnitName || ''}
                                  onChange={(label, id) => {
                                    updateRow(index, {
                                      purchaseUnitId: id,
                                      purchaseUnitName: label,
                                    });
                                  }}
                                  error={puError}
                                />
                                {puError && (
                                  <span className='block text-[#a71a23] text-[13px] mt-1'>
                                    Specify unit
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Col 3: Stocktaking unit */}
                            <td
                              className='py-9 text-left align-middle'
                              style={{ width: '11%' }}
                            >
                              <div
                                className='relative'
                                style={{ width: '160px' }}
                              >
                                <label className='block mb-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6b6b6f]'>
                                  Stocktaking-unit
                                </label>
                                <SimpleUnitDropdown
                                  units={allUnits}
                                  value={row.stockTakingUnitName || ''}
                                  onChange={(label, id) => {
                                    const u = allUnits.find((x) => x.id === id);
                                    updateRow(index, {
                                      stockTakingUnitId: id,
                                      stockTakingUnitName: label,
                                      stockTakingUnitSingular:
                                        u?.singular || '',
                                      stockTakingUnitPlural: u?.plural || '',
                                    });
                                  }}
                                  error={false}
                                />
                              </div>
                            </td>

                            {/* Col 4: Conversion */}
                            <td
                              className='py-9 text-left align-middle'
                              style={{ width: '13%' }}
                            >
                              <label className='block mb-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6b6b6f]'>
                                1 purchase unit =
                              </label>
                              <div
                                className='flex items-center'
                                style={{ width: '175px' }}
                              >
                                <input
                                  type='number'
                                  min='0'
                                  value={row.stockTakingQuantityPerPurchaseUnit}
                                  onKeyDown={(e) => {
                                    if (e.key === '-' || e.key === 'e')
                                      e.preventDefault();
                                  }}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    const num = parseFloat(val);
                                    updateRow(index, {
                                      stockTakingQuantityPerPurchaseUnit: val,
                                      conversionError:
                                        val === '' || isNaN(num) || num <= 0,
                                    });
                                  }}
                                  className='border border-[#d7d8e0] bg-[#f1f1f5] rounded-[4px] px-4 py-[6px] w-[100px] h-[36px] text-[14px] leading-6 text-[#333] outline-none'
                                />
                                <span className='ml-2 text-[#19191c] text-[14px] whitespace-nowrap'>
                                  {Number(
                                    row.stockTakingQuantityPerPurchaseUnit,
                                  ) === 1
                                    ? row.stockTakingUnitSingular
                                    : row.stockTakingUnitPlural}
                                </span>
                              </div>
                              {row.conversionError && (
                                <span className='block text-[#a71a23] text-[13px] mt-1'>
                                  {row.stockTakingQuantityPerPurchaseUnit === ''
                                    ? 'Specify conversion'
                                    : 'Enter a number greater than 0'}
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          )}
        </div>

        {/* Footer */}
        <div className='flex items-center justify-between px-12 py-[14px] border-t border-[#e7e7ec]'>
          <WhiteButton onClick={handleClose}>Cancel</WhiteButton>

          {step === 3 && allInDB ? (
            <div className='flex items-center gap-4'>
              <WhiteButton
                onClick={() => {
                  setStep(1);
                  setUploadState(STATES.IDLE);
                  setFileName('');
                  setParsedProducts([]);
                  setProductRows([]);
                  setAllInDB(false);
                  resetInput();
                }}
                className='text-[#6b6b6f]'
              >
                Upload another order
              </WhiteButton>
              <GreenButton onClick={handleClose}>Close</GreenButton>
            </div>
          ) : (
            <>
              {step === 3 && (attempted || footerError) && step3Invalid && (
                <div className='w-[70%] bg-[#fff0f1] text-[#a71a23] font-semibold text-[14px] leading-[18px] rounded-[4px] flex items-center'>
                  <img
                    src='/icons/error.svg'
                    alt='error'
                    className='ml-[18px] w-5'
                  />
                  <label className='m-[9px]'>
                    {hasNoChecked
                      ? 'Select at least one product to continue'
                      : 'Specify unit conversions for all listed products before you continue'}
                  </label>
                </div>
              )}

              {step === 2 && footerError && (
                <div className='w-[70%] bg-[#fff0f1] text-[#a71a23] font-semibold text-[14px] leading-[18px] rounded-[4px] flex items-center'>
                  <img
                    src='/img/error.svg'
                    alt='error'
                    className='ml-[18px] w-5'
                  />
                  <label className='m-[9px]'>
                    Fill in all the required fields before you continue
                  </label>
                </div>
              )}

              <div className='flex items-center gap-4'>
                {step === 3 && !allInDB && (
                  <WhiteButton
                    onClick={() => {
                      setStep(2);
                      setFooterError(false);
                      setShowUnitErrors(false);
                      setAttempted(false);
                    }}
                    style={{ marginRight: '24px', color: '#6b6b6f' }}
                  >
                    Previous Step
                  </WhiteButton>
                )}

                <GreenButton
                  disabled={
                    step === 1
                      ? uploadState !== STATES.SUCCESS
                      : step === 3
                        ? step3Invalid
                        : false
                  }
                  onClick={() => {
                    if (step === 1) {
                      setStep(2);
                    } else if (step === 2) {
                      if (!selectedSupplier) {
                        setSupplierError(true);
                        setFooterError(true);
                        return;
                      }
                      setFooterError(false);
                      setStep(3);
                    } else if (step === 3) {
                      setAttempted(true);
                      if (step3Invalid) {
                        setShowUnitErrors(true);
                        setFooterError(true);
                        return;
                      }
                      const payload = {
                        dateAndTime: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                        language: 'en',
                        userId,
                        currencyId,
                        products: checkedRows.map((r) => {
                          const pricePerPU =
                            parseFloat(r.pricePerPurchaseUnit) || 0;
                          const qty =
                            parseFloat(r.stockTakingQuantityPerPurchaseUnit) ||
                            1;
                          const pricePerSU = qty > 0 ? pricePerPU / qty : 0;
                          return {
                            productId: null,
                            sku: r.sku ? String(r.sku) : null,
                            productName: r.name,
                            name: r.name,
                            qty: null,
                            purchaseUnitId: r.purchaseUnitId,
                            stockTakingUnitId: r.stockTakingUnitId,
                            stockTakingQuantityPerPurchaseUnit: qty,
                            stockTakingQuantityPerBaseMeasurementUnit: 0,
                            baseMeasurementUnitId: r.baseUnitId || null,
                            quantityBaseMeasurmentUnit: 0,
                            preppingUnitId: null,
                            purchaseSubUnitId: null,
                            pricePerPurchaseUnit: pricePerPU,
                            pricePerStockTakingUnit: pricePerSU,
                            pricePerBaseUnit: 0,
                            expirationDate: null,
                            products: [
                              {
                                quantity: null,
                                expirationDate: null,
                                selected: false,
                                id: '0',
                                isManual: 1,
                              },
                            ],
                            isSkuUpdate: false,
                            productGroupId: r.productGroupId || null,
                          };
                        }),
                      };
                      submitProducts(payload);
                    }
                  }}
                >
                  {step === 3
                    ? isSubmitting
                      ? 'Adding...'
                      : `Add ${checkedRows.length} products`
                    : 'Continue'}
                </GreenButton>
              </div>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
