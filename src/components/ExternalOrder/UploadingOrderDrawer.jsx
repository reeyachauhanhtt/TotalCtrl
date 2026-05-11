import { useState } from 'react';

export default function UploadingOrdersDrawer({ orders = [], isOpen = true }) {
  const [collapsed, setCollapsed] = useState(true);

  if (!isOpen) return null;

  return (
    <>
      {/* Drawer */}
      <div
        className='fixed bottom-0 z-100 bg-white'
        style={{
          right: '24px',
          left: 'unset',
          width: '500px',
          boxShadow: '0 2px 8px 0 rgba(0,0,0,0.12)',
          borderTopLeftRadius: '8px',
          borderTopRightRadius: '8px',
          transition: 'transform 250ms',
        }}
      >
        {/* Header */}
        <div
          className='flex items-center justify-between border-b border-[#e7e7ec] cursor-pointer'
          style={{ padding: '22px' }}
          onClick={() => setCollapsed((p) => !p)}
        >
          <div
            className='flex items-center'
            style={{
              fontStyle: 'normal',
              fontWeight: 600,
              fontSize: '18px',
              lineHeight: '24px',
              letterSpacing: '-0.18px',
              color: '#19191c',
            }}
          >
            Uploading orders
            <span
              className='ml-4 flex items-center justify-center text-white font-semibold text-[14px] rounded-full'
              style={{
                marginLeft: '15px',
                background: '#02906e',
                borderRadius: '24px',
                padding: '5px',
                width: '20px',
                height: '20px',
              }}
            >
              {orders.length}
            </span>
          </div>

          {/* Chevron icon — up when expanded, down when collapsed */}
          <div style={{ height: '27px', transition: 'all 0.3s ease-in-out' }}>
            {/* {collapsed ? (
              // Chevron down
              <svg
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M6 10L12 16L18 10'
                  stroke='#19191C'
                  strokeWidth='2'
                  strokeLinecap='round'
                />
              </svg>
            ) : (
              // Chevron up
              <svg
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M6 14L12 8L18 14'
                  stroke='#19191C'
                  strokeWidth='2'
                  strokeLinecap='round'
                />
              </svg>
            )} */}

            <div
              style={{
                height: '27px',
                transition: 'transform 0.3s ease-in-out',
                transform: collapsed ? 'rotate(0deg)' : 'rotate(180deg)',
              }}
            >
              <svg
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M6 10L12 16L18 10'
                  stroke='#19191C'
                  strokeWidth='2'
                  strokeLinecap='round'
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Contents */}
        <div
          style={{
            overflowX: 'hidden',
            overflowY: 'auto',
            maxHeight: collapsed ? 0 : 'calc(100vh - 271px)',
            transition: 'max-height 0.6s',
            overflow: collapsed ? 'hidden' : 'auto',
            marginRight: '6px',
            position: 'relative',
            bottom: 0,
          }}
        >
          <div style={{ marginTop: '20px', padding: '10px 22px 22px' }}>
            {orders.map((order, index) => (
              <div key={index} style={{ marginBottom: '48px' }}>
                <div className='flex items-center justify-between flex-wrap mb-3'>
                  {/* Left — icon + filename */}
                  <div className='flex flex-wrap items-center'>
                    <div className='pt-1' style={{ marginRight: '24px' }}>
                      <img
                        src='/icons/upload-success.svg'
                        style={{ height: '36px', width: '36px' }}
                        alt=''
                      />
                    </div>
                    <div>
                      <span
                        className='font-semibold'
                        style={{ color: '#19191c' }}
                      >
                        {order.name}
                        <span
                          className='ml-2 font-normal'
                          style={{ color: '#19191c' }}
                        >
                          ({(order.size / 1024).toFixed(2)} KB)
                        </span>
                      </span>
                      {order.inventoryName && (
                        <div
                          style={{
                            color: '#6b6b6f',
                            fontSize: '14px',
                            fontWeight: 400,
                          }}
                        >
                          {order.inventoryName}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right — See Order Summary */}
                  <div>
                    <a
                      className='cursor-pointer font-semibold text-[14px] leading-4'
                      style={{ color: '#23a956' }}
                      onClick={() => order.onSeeOrder?.()}
                    >
                      See Order Summary
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
