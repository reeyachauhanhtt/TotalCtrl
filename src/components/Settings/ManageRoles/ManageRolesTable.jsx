import ManageRolesRow from './ManageRolesRows';
import { SkeletonBar } from '../../Common/Skeleton';
import { EMPTY_STATE_LABELS } from '../../../constants/titles';

const COLUMNS = [
  { label: 'Role Name', width: '18%' },
  { label: 'Description', width: '38%' },
  { label: 'Status', width: '14%' },
  { label: '', width: '5%' },
];

export default function ManageRolesTable({
  roles = [],
  isLoading,
  isFetching,
  onFetchNext,
  hasNextPage,
  isFetchingNextPage,
}) {
  const showSkeleton = (isLoading || isFetching) && !isFetchingNextPage;

  return (
    <div className='border-t border-[#e6e6ed] bg-white'>
      <div
        className='bg-[#f8f9fa] border-b border-[#e6e6ed]'
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

      <div
        style={{ maxHeight: 'calc(100vh - 150px)', overflowY: 'auto' }}
        onScroll={(e) => {
          const { scrollTop, scrollHeight, clientHeight } = e.target;
          if (
            scrollHeight - scrollTop - clientHeight < 100 &&
            hasNextPage &&
            !isFetchingNextPage &&
            typeof onFetchNext === 'function'
          ) {
            onFetchNext();
          }
        }}
      >
        <table
          className='text-[13px] border-collapse'
          style={{ width: '95%', margin: 'auto', tableLayout: 'fixed' }}
        >
          <tbody className='bg-white'>
            {showSkeleton ? (
              Array.from({ length: 3 }).map((_, i) => (
                <tr
                  key={i}
                  className='border-b border-[#e6e6ed]'
                  style={{ height: 72 }}
                >
                  {/* Role name */}
                  <td style={{ width: '18%', paddingTop: 26 }}>
                    <div className='flex'>
                      <SkeletonBar
                        style={{ width: 32, height: 32 }}
                        borderRadius='50%'
                      />
                      <div style={{ marginLeft: 12 }}>
                        <SkeletonBar
                          style={{
                            height: 6,
                            width: 160,
                            borderRadius: 20,
                            marginBottom: 0,
                          }}
                        />
                        <SkeletonBar
                          style={{ height: 6, width: 60, borderRadius: 20 }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Description */}
                  <td
                    style={{
                      width: '38%',
                      paddingTop: 35,
                      paddingLeft: '0.75rem',
                    }}
                  >
                    <SkeletonBar
                      style={{ height: 12, width: '90%', borderRadius: 20 }}
                    />
                  </td>

                  {/* Status */}
                  <td
                    style={{
                      width: '14%',
                      paddingTop: 35,
                      paddingLeft: '0.75rem',
                    }}
                  >
                    <SkeletonBar
                      style={{ height: 12, width: '30%', borderRadius: 20 }}
                    />
                  </td>

                  {/* Actions */}
                  <td
                    style={{
                      width: '5%',
                      paddingTop: 35,
                      paddingLeft: '0.75rem',
                    }}
                  >
                    <SkeletonBar
                      style={{ height: 12, width: 50, borderRadius: 4 }}
                    />
                  </td>
                </tr>
              ))
            ) : roles.length === 0 ? (
              <tr>
                <td
                  colSpan={COLUMNS.length}
                  className='text-center text-[16px] text-[#737373]'
                  style={{ padding: '2rem 0' }}
                >
                  {EMPTY_STATE_LABELS.NO_RESULT_FOUND}
                </td>
              </tr>
            ) : (
              roles.map((role) => <ManageRolesRow key={role.id} role={role} />)
            )}
          </tbody>
        </table>
        <div className='h-10' />
      </div>
    </div>
  );
}
