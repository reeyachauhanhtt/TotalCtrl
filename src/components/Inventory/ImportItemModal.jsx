import { useState, useEffect, useRef } from 'react';
import { FiX } from 'react-icons/fi';
import { Tooltip } from 'react-tooltip';
import * as XLSX from 'xlsx';

// import templateFile from '../../assets/TotalCtrl_Item_Import_Template_en.xlsx';
import { parseExcel } from '../../services/importFileService';
import GreenButton from '../Common/GreenButton';

const ImportItemsModal = ({
  isOpen,
  onClose,
  onImportSuccess,
  selectedInventory,
}) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const fileInputRef = useRef();

  useEffect(() => {
    if (isOpen) {
      setFile(null);
      setError(false);
      setUploading(false);
      setSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const TEMPLATE_NAME = 'TotalCtrl_Item_Import_Template_en.xlsx';

  const handleFile = async (selectedFile) => {
    if (!selectedFile) return;

    console.log('File name:', selectedFile.name); // check exact name
    console.log('Expected:', TEMPLATE_NAME);

    setFile(selectedFile);

    if (!selectedFile.name.endsWith('.xlsx')) {
      setError(true);
      setUploading(false);
      setSuccess(false);
      return;
    }

    setError(false);
    setUploading(true);
    setSuccess(false);

    try {
      // Parse xlsx client-side into 2D array
      const buffer = await selectedFile.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array' });
      const raw = XLSX.read(buffer, { type: 'array' });
      const sheet = raw.Sheets[raw.SheetNames[0]];
      const allRows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      const parseData = allRows
        .slice(2)
        .filter(
          (row) =>
            Array.isArray(row) &&
            row.some(
              (cell) => cell !== null && cell !== undefined && cell !== '',
            ),
        )
        .map((row) => row.filter((_, i) => i > 0)); // remove the empty first column

      console.log('parseData:', JSON.stringify(parseData));
      console.log('allRows:', JSON.stringify(allRows.slice(0, 5)));
      console.log('after slice:', JSON.stringify(allRows.slice(2, 5)));

      // Send to API
      const data = await parseExcel({
        inventoryId: selectedInventory?.id,
        parseData,
      });

      setUploading(false);
      setSuccess(true);

      // Map response to row format expected by AddItemModal
      const items = data.map((item) => ({
        sku: item.sku || '',
        name: item.productName || item.name || '',
        quantity: item.quantity ?? '',
        unit: item.unit || '',
        costPerUnit: item.pricePerStocktakingUnit ?? item.unitPrice ?? '',
        _unitId: item.stockTakingUnitId || '',
      }));

      onImportSuccess && onImportSuccess(items);
    } catch (err) {
      console.error('Import error:', err);
      setUploading(false);
      setError(true);
    }
  };

  const handleCancel = () => {
    setFile(null);
    setError(false);
    setUploading(false);
    setSuccess(false);
  };

  return (
    <div className='fixed inset-0 z-1100 flex items-center justify-center'>
      <div className='absolute inset-0 bg-black/30 backdrop-blur-[0.5px]' />

      <div className='relative bg-white w-200 h-170 rounded-xl shadow-xl border border-gray-200 px-8 py-23'>
        <button
          onClick={onClose}
          className='absolute top-5 right-5 text-gray-900 cursor-pointer'
        >
          <FiX size={18} />
        </button>

        <h2 className='text-[22px] font-semibold text-gray-800 text-center mb-5'>
          Import items using a spreadsheet template
        </h2>

        <ol className='text-[15px] text-gray-500 list-decimal list-insidespace-y-3 mb-6 max-w-90 mx-auto text-left'>
          <li>Download the spreadsheet template</li>
          <li>Fill in all the required information</li>
          <li>
            Upload the filled-in template here to set up all inventory items at
            once
          </li>
        </ol>

        <div className='flex justify-center mb-6'>
          <GreenButton
            onClick={() => {
              const link = document.createElement('a');
              link.href =
                'https://dev.totalctrl.com/restaurant/resources/productexcel/TotalCtrl_Item_Import_Template_en.xlsx';
              link.download = TEMPLATE_NAME;
              link.click();
            }}
          >
            <img src='/icons/download-white.svg' className='w-5 h-5' alt='' />
            Download template
          </GreenButton>
        </div>

        {!file ? (
          <div
            className='border-dashed border-2 border-gray-300 rounded-lg py-10 flex flex-col items-center justify-center text-center max-w-175 w-full mx-auto'
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleFile(e.dataTransfer.files[0]);
            }}
          >
            <img
              src='/icons/file-upload.svg'
              className='w-13 h-13 mb-3'
              alt=''
            />

            <p className='text-[16px] text-gray-700 mb-2'>
              Drag & drop the filled-in template here
            </p>

            <p className='text-[16px] text-gray-700 mb-2'>or</p>

            <GreenButton
              className='px-4 py-3'
              onClick={() => fileInputRef.current.click()}
            >
              Select a file from your computer
            </GreenButton>

            <input
              type='file'
              ref={fileInputRef}
              className='hidden'
              accept='.xlsx'
              onChange={(e) => handleFile(e.target.files[0])}
            />
          </div>
        ) : (
          <div
            className={`max-w-125 w-full mx-auto border border-gray-300 rounded-lg p-4 ${!uploading ? 'h-40' : ''}`}
          >
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3 min-w-0'>
                <div className='w-14 h-14 flex items-center justify-center'>
                  {uploading ? (
                    <svg
                      className='animate-spin w-10 h-10'
                      viewBox='0 0 24 24'
                      fill='none'
                    >
                      <circle
                        cx='12'
                        cy='12'
                        r='10'
                        stroke='#e5e7eb'
                        strokeWidth='2.5'
                      />
                      <path
                        d='M12 2a10 10 0 0 1 10 10'
                        stroke='#16a34a'
                        strokeWidth='2.5'
                      />
                    </svg>
                  ) : error ? (
                    <img
                      src='/icons/upload-error.svg'
                      className='w-14 h-14'
                      alt=''
                    />
                  ) : success ? (
                    <img
                      src='/icons/success.svg'
                      className='w-14 h-14'
                      alt=''
                    />
                  ) : null}
                </div>

                <div className='min-w-0'>
                  <div
                    data-tooltip-id='filename-tooltip'
                    data-tooltip-content={file.name}
                    className='flex items-center gap-1 max-w-55 min-w-0'
                  >
                    <span className='text-[14px] text-gray-900 truncate'>
                      {file.name}
                    </span>
                    <span className='text-gray-400 text-[12px] whitespace-nowrap'>
                      ({(file.size / 1024).toFixed(2)} KB)
                    </span>
                  </div>

                  <Tooltip
                    id='filename-tooltip'
                    place='top'
                    style={{ backgroundColor: '#000', fontSize: 12 }}
                  />
                </div>
              </div>

              <button
                onClick={handleCancel}
                className='text-green-600 text-[13px] font-medium whitespace-nowrap'
              >
                Cancel upload
              </button>
            </div>

            {/* ERROR */}
            {error && (
              <div className='mt-3 bg-red-50 rounded-md p-3 text-red-800'>
                <p className='text-[14px] font-medium'>Issues found</p>
                <p className='text-[12px]'>
                  The file does not contain any data or is not correctly
                  formatted.
                </p>
              </div>
            )}

            {/* SUCCESS */}
            {success && (
              <div className='mt-3 bg-green-50 rounded-md p-3 text-green-700'>
                <p className='text-[13px] font-medium'>
                  Items successfully imported
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImportItemsModal;
