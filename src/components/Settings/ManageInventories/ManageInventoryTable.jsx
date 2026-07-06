import ManageInventoryRow from './ManageInventoryRow';
import { SkeletonBar } from '../../Common/Skeleton';

const COLUMNS = [
  { label: 'Inventory name', width: '18%' },
  { label: 'Editors', width: '17%' },
  { label: 'Viewers', width: '17%' },
  { label: 'Status', width: '17%' },
  { label: '', width: '5%' },
];

export default function InventoriesTable({
  inventories = [],
  isLoading,
  isFetching,
  permissionMap,
}) {
  return (
    <div className='bg-white border-t border-[#e6e6ed]'>
      <div
        className='bg-[#f8f9fa]'
        style={{ position: 'sticky', top: 0, zIndex: 1 }}
      >
        <table
          className='text-[13px] border-collapse'
          style={{ width: '95%', margin: 'auto', tableLayout: 'fixed' }}
        >
          <thead className='border-b border-[#e6e6ed]'>
            <tr style={{ height: 48 }}>
              {COLUMNS.map((col, i) => (
                <th
                  key={i}
                  className='text-left font-semibold text-[12px] tracking-[1px] text-[#737373] uppercase align-middle border-none'
                  style={{
                    width: col.width,
                    padding: '0.75rem',
                    paddingLeft: i === 0 ? 0 : '0.75rem',
                  }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
        </table>
      </div>

      <div style={{ maxHeight: 'calc(100vh - 210px)', overflowY: 'auto' }}>
        <table
          className='text-[13px] border-collapse'
          style={{ width: '95%', margin: 'auto', tableLayout: 'fixed' }}
        >
          {/* <tbody>
            {isLoading || isFetching
              ? Array.from({ length: 3 }).map((_, i) => (
                  <tr
                    key={i}
                    className='border-b border-[#e6e6ed]'
                    style={{ height: 72 }}
                  >
                    <td
                      style={{
                        paddingTop: 24,
                        paddingBottom: 24,
                        paddingLeft: 24,
                      }}
                    >
                      <SkeletonBar
                        style={{ height: 16, width: 100, borderRadius: 4 }}
                      />
                    </td>

                    <td style={{ paddingTop: 24, paddingBottom: 24 }}>
                      <div className='flex items-center'>
                        {Array.from({ length: 4 }).map((_, i) => (
                          <div
                            key={i}
                            style={{
                              marginLeft: i === 0 ? 0 : -8,
                              border: '2px solid white',
                              borderRadius: '50%',
                            }}
                          >
                            <SkeletonBar
                              style={{
                                width: 32,
                                height: 32,
                                display: 'block',
                              }}
                              borderRadius='50%'
                            />
                          </div>
                        ))}
                      </div>
                    </td>

                    <td style={{ paddingTop: 24, paddingBottom: 24 }}>
                      <div className='flex items-center'>
                        {Array.from({ length: 4 }).map((_, i) => (
                          <div
                            key={i}
                            style={{
                              marginLeft: i === 0 ? 0 : -8,
                              border: '2px solid white',
                              borderRadius: '50%',
                            }}
                          >
                            <SkeletonBar
                              style={{
                                width: 32,
                                height: 32,
                                display: 'block',
                              }}
                              borderRadius='50%'
                            />
                          </div>
                        ))}
                      </div>
                    </td>

                    <td
                      style={{
                        paddingTop: 24,
                        paddingBottom: 24,
                        paddingRight: 24,
                      }}
                    >
                      <SkeletonBar height={20} width='50%' />
                    </td>
                    <td />
                  </tr>
                ))
              : inventories.map((inv) => (
                  <ManageInventoryRow
                    key={inv.id}
                    inventory={inv}
                    permissionMap={permissionMap}
                    // allUsers={allUsers}
                  />
                ))}
          </tbody> */}
          <tbody>
            {isLoading || isFetching
              ? Array.from({ length: 3 }).map((_, i) => (
                  <tr
                    key={i}
                    className='border-b border-[#e6e6ed]'
                    style={{ height: 72 }}
                  >
                    {/* Inventory name */}
                    <td
                      style={{ width: '18%', paddingTop: 26, paddingLeft: 24 }}
                    >
                      <SkeletonBar
                        style={{ height: 16, width: 250, borderRadius: 20 }}
                      />
                    </td>

                    {/* Editors */}
                    <td
                      style={{
                        width: '17%',
                        padding: '20px 0px',
                        paddingLeft: '0.75rem',
                      }}
                    >
                      <div className='flex items-center'>
                        {Array.from({ length: 4 }).map((_, i) => (
                          <div
                            key={i}
                            style={{
                              marginLeft: i === 0 ? 0 : -8,
                              border: '2px solid white',
                              borderRadius: '50%',
                            }}
                          >
                            <SkeletonBar
                              style={{
                                width: 32,
                                height: 32,
                                display: 'block',
                              }}
                              borderRadius='50%'
                            />
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Viewers */}
                    <td
                      style={{
                        width: '17%',
                        padding: '20px 0px',
                        paddingLeft: '0.75rem',
                      }}
                    >
                      <div className='flex items-center'>
                        {Array.from({ length: 4 }).map((_, i) => (
                          <div
                            key={i}
                            style={{
                              marginLeft: i === 0 ? 0 : -8,
                              border: '2px solid white',
                              borderRadius: '50%',
                            }}
                          >
                            <SkeletonBar
                              style={{
                                width: 32,
                                height: 32,
                                display: 'block',
                              }}
                              borderRadius='50%'
                            />
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Status */}
                    <td
                      style={{
                        width: '17%',
                        paddingTop: 26,
                        paddingLeft: '0.75rem',
                      }}
                    >
                      <SkeletonBar
                        style={{ height: 16, width: '50%', borderRadius: 20 }}
                      />
                    </td>

                    {/* Actions */}
                    <td
                      style={{
                        width: '5%',
                        paddingTop: 20,
                        paddingLeft: '0.75rem',
                        paddingRight: 24,
                      }}
                    >
                      <SkeletonBar
                        style={{ height: 16, width: 50, borderRadius: 4 }}
                      />
                    </td>
                  </tr>
                ))
              : inventories.map((inv) => (
                  <ManageInventoryRow
                    key={inv.id}
                    inventory={inv}
                    permissionMap={permissionMap}
                  />
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
