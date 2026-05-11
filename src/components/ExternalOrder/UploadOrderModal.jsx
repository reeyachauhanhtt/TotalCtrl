import { useState, useRef } from 'react';
import { FiX } from 'react-icons/fi';
import { Tooltip } from 'react-tooltip';
import GreenButton from '../Common/GreenButton';
import WhiteButton from '../Common/WhiteButton';
import ConfirmModal from '../Common/ConfirmModal';

export default function UploadOrderModal({ isOpen, onClose }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef();

  const handleFile = async (selectedFile) => {
    if (!selectedFile) return;
    const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowed.includes(selectedFile.type)) {
      setFile(selectedFile);
      setError(true);
      return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      setFile(selectedFile);
      setError(true);
      return;
    }
    setFile(selectedFile);
    setError(false);
    setUploading(true);
    setSuccess(false);

    try {
      // TODO: wire upload API here
      await new Promise((res) => setTimeout(res, 2000)); // simulate upload
      setUploading(false);
      setSuccess(true);
    } catch (err) {
      setUploading(false);
      setError(true);
    }
  };

  const handleClose = () => {
    setFile(null);
    setError(false);
    setUploading(false);
    setSuccess(false);
    onClose();
  };

  // truncate filename
  const truncateFilename = (name) => {
    if (name.length <= 20) return name;
    return name.slice(0, 10) + '...' + name.slice(-10);
  };

  const isValidFile =
    file &&
    ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'].includes(
      file.type,
    ) &&
    file.size <= 5 * 1024 * 1024;

  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center'
      style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
    >
      <div
        className='bg-white rounded-lg shadow-[0_4px_4px_rgba(0,0,0,0.12)] flex flex-col'
        style={{ width: '75%', height: 'calc(100% - 48px)' }}
      >
        {/* Header */}
        <div className='flex items-center justify-between border-b border-[#e7e7ec] px-12 py-6'>
          <h2
            className='text-[18px] font-semibold leading-6 tracking-[-0.01em] text-[#19191c] m-0'
            style={{ width: '95%', marginRight: '29px' }}
          >
            Upload order
          </h2>
          <span
            onClick={() => (file ? setShowCancelConfirm(true) : handleClose())}
            className='cursor-pointer'
          >
            <FiX size={20} strokeWidth={2.5} className='text-[#19191c]' />
          </span>
        </div>

        {/* Body */}
        <div
          className='flex-1 overflow-y-auto'
          style={{ height: 'calc(100% - 140px)', padding: '48px 48px 24px' }}
        >
          {/* Title */}
          <h2
            className='font-semibold text-center tracking-[-0.01em] text-[#19191c] pb-3'
            style={{ fontSize: '24px', lineHeight: '32px' }}
          >
            Upload the order file
          </h2>

          {/* Description */}
          <div className='mx-auto mb-10 text-center' style={{ width: '360px' }}>
            <p className='text-center mb-4 text-[16px] text-[#737373]'>
              TotalCtrl can automatically extract the order data to help you
              reduce manual data entry.
            </p>
            <ul className='mt-4 ml-12 text-left text-[16px] text-[#737373]'>
              <li className='mb-0 list-disc'>
                Supported file formats are PDF, JPG and PNG
              </li>
              <li className='mb-0 list-disc'>Maximum file size is 5 MB</li>
            </ul>
          </div>

          {/* Drop zone or file state */}
          <div className='flex flex-col items-center justify-center'>
            {!file ? (
              // Drop zone
              <div
                className='border-2 border-dashed border-[#d7d7db] rounded-lg w-full text-center cursor-pointer'
                style={{ padding: '40px 0px 50px' }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  handleFile(e.dataTransfer.files[0]);
                }}
                onClick={() => fileInputRef.current.click()}
              >
                <img src='/icons/file-upload.svg' alt='' className='mx-auto' />
                <p className='mt-3 text-[20px] text-[#19191c]'>
                  Drag & drop your file here
                </p>
                <p className='mt-3 mb-3 text-[20px] text-[#19191c]'>or</p>
                <div className='relative overflow-hidden inline-block'>
                  <button
                    className='bg-[#23a956] rounded-sm font-semibold text-[14px] leading-6 text-white px-3 py-2.5 tracking-[0.04em] border-none cursor-pointer'
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current.click();
                    }}
                  >
                    Select a file from your computer
                  </button>
                  <input
                    ref={fileInputRef}
                    type='file'
                    accept='application/pdf,image/jpeg,image/png,image/jpg'
                    className='absolute left-0 top-0 opacity-0 cursor-pointer w-full h-full'
                    onChange={(e) => handleFile(e.target.files[0])}
                  />
                </div>
              </div>
            ) : (
              // File selected state
              <div className='flex flex-col' style={{ width: '500px' }}>
                {/* File row */}
                <div
                  className='w-full flex items-center justify-between rounded-lg border border-[#d7d7db]'
                  style={{ padding: '20px' }}
                >
                  <div className='flex items-center gap-3'>
                    {/* Icon */}
                    <span className='mr-3'>
                      {uploading ? (
                        <svg
                          className='animate-spin w-14 h-14'
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
                      ) : (
                        <img
                          src='/icons/upload-error.svg'
                          style={{ height: '56px', width: '56px' }}
                          alt=''
                        />
                      )}
                    </span>

                    {/* Filename */}
                    <span
                      data-tooltip-id='upload-filename-tooltip'
                      data-tooltip-content={file.name}
                      style={{ color: '#19191c' }}
                    >
                      <b>{truncateFilename(file.name)}</b>{' '}
                      <span className='text-[14px]'>
                        ({(file.size / 1024).toFixed(2)} KB)
                      </span>
                    </span>
                    <Tooltip
                      id='upload-filename-tooltip'
                      place='top'
                      positionStrategy='fixed'
                      style={{
                        backgroundColor: '#19191c',
                        fontSize: 12,
                        zIndex: 9999,
                      }}
                    />
                  </div>
                </div>

                {/* Error state */}
                {error && (
                  <div
                    className='w-full mt-3 rounded-lg bg-[#fff0f1] text-[#a71a23]'
                    style={{ padding: '16px 20px' }}
                  >
                    <h5 className='font-semibold text-[16px] leading-5 tracking-[-0.01em] text-left mb-1'>
                      Some data couldn't be extracted
                    </h5>
                    <h5 className='font-normal text-[14px] leading-5 text-left mb-0'>
                      We apologize for the inconvenience. It seems that certain
                      data in your order file couldn't be automatically
                      extracted.
                    </h5>
                  </div>
                )}

                {/* Edit data yourself card */}
                {error && (
                  <div
                    className='w-full mt-3 rounded-lg border border-[#d7d7db] flex items-center justify-between cursor-pointer hover:border-[#23a956] hover:border-2 transition-all'
                    style={{ padding: '20px 8px 20px 20px', gap: '20px' }}
                  >
                    <div>
                      <h5 className='font-semibold text-[16px] leading-5 tracking-[-0.01em] text-[#19191c] text-left mb-1'>
                        Edit data yourself
                      </h5>
                      <p className='font-normal text-[14px] leading-5 text-[#737373] text-left mb-0'>
                        Open the Editor to manually specify where to find the
                        missing data within the order file.
                      </p>
                    </div>
                    <img
                      src='/icons/right-dark-arrow.svg'
                      alt='Edit data yourself'
                      className='cursor-pointer w-5 h-5'
                    />
                  </div>
                )}

                {/* Contact support card */}
                {error && (
                  <div
                    className='w-full mt-3 rounded-lg border border-[#d7d7db] flex items-center justify-between cursor-pointer hover:border-[#23a956] hover:border-2 transition-all'
                    style={{ padding: '20px 8px 20px 20px', gap: '20px' }}
                  >
                    <div>
                      <h5 className='font-semibold text-[16px] leading-5 tracking-[-0.01em] text-[#19191c] text-left mb-1'>
                        Contact TotalCtrl Support
                      </h5>
                      <p className='font-normal text-[14px] leading-5 text-[#737373] text-left mb-0'>
                        If you prefer not to use the Editor, a member of our
                        team will locate the missing data for you and add the
                        order to scheduled orders afterwards.
                      </p>
                    </div>
                    <img
                      src='/icons/right-dark-arrow.svg'
                      alt='Contact TotalCtrl Support'
                      className='cursor-pointer w-5 h-5'
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          className='flex items-center justify-between border-t border-[#e7e7ec]'
          style={{ padding: '14px 48px' }}
        >
          <WhiteButton
            onClick={() => (file ? setShowCancelConfirm(true) : handleClose())}
          >
            Cancel
          </WhiteButton>
          <GreenButton
            disabled={!isValidFile || uploading}
            className='disabled:opacity-40 disabled:cursor-not-allowed'
          >
            Continue
          </GreenButton>
        </div>
      </div>

      <ConfirmModal
        open={showCancelConfirm}
        onClose={() => setShowCancelConfirm(false)}
        title='Cancel the order upload?'
        description='This action is irreversible'
        confirmLabel='Yes, Cancel The Order Upload'
        cancelLabel="No, Don't Cancel It"
        onConfirm={() => {
          setShowCancelConfirm(false);
          handleClose();
        }}
      />
    </div>
  );
}
