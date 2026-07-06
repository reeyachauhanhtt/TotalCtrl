import ManageUserRow from './ManageUserRow';
const COLUMNS = [
  { label: 'Full Name', width: '18%' },
  { label: 'E-mail / Username', width: '30%' },
  { label: 'User Role', width: '8%' },
  { label: 'Status', width: '14%' },
  { label: '', width: '5%' },
];

export default function ManageUserTable({
  users = [],
  onFetchNext,
  hasNextPage,
  isFetchingNextPage,
}) {
  return (
    <div className='border-t border-b border-[#e6e6ed] bg-[#f8f9fa]'>
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

      <div
        style={{ maxHeight: 'calc(100vh - 210px)', overflowY: 'auto' }}
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
            {users.map((user) => (
              <ManageUserRow key={user.id} user={user} />
            ))}

            {isFetchingNextPage && (
              <tr>
                <td colSpan={5} className='text-center py-4'>
                  Loading more...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
