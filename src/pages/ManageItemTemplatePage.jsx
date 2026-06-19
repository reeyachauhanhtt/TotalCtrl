import { useState, useEffect, useRef } from 'react';

import TemplatePanel from '../components/Settings/ManageItemTemplate/TemplatePanel';
import TemplateMainSection from '../components/Settings/ManageItemTemplate/TemplateMainSection';
import ItemTable from '../components/Settings/ManageItemTemplate/ItemTable';

const ManageItemTemplatePage = () => {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(search || '');
  const [filters, setFilters] = useState({
    issue: null,
    category: null,
    categoryId: null,
    subcategory: null,
    subcategoryId: null,
    inventory: null,
    inventoryId: null,
    supplier: null,
    supplierId: null,
  });
  const [checkedIds, setCheckedIds] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);
  const toastTimerRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search || '');
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  function showToast(itemName) {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMessage(itemName);
    toastTimerRef.current = setTimeout(() => setToastMessage(null), 3500);
  }

  return (
    <div className='flex flex-col h-full'>
      <TemplatePanel onItemAdded={showToast} />

      <TemplateMainSection
        search={search}
        filters={filters}
        onSearchChange={setSearch}
        onFiltersChange={setFilters}
        checkedIds={checkedIds}
        onClearChecked={() => setCheckedIds([])}
      />

      <div className='flex-1 min-h-0'>
        <ItemTable
          search={search}
          filters={filters}
          // onClearIssueFilter={() => setFilters((p) => ({ ...p, issue: null }))}
          onClearIssueFilter={() =>
            setFilters({
              issue: null,
              category: null,
              categoryId: null,
              subcategory: null,
              subcategoryId: null,
              inventory: null,
              inventoryId: null,
              supplier: null,
              supplierId: null,
            })
          }
          checkedIds={checkedIds}
          onCheckedChange={setCheckedIds}
        />
      </div>

      {toastMessage && (
        <div className='fixed bottom-0 right-0 z-50' style={{ left: '200px' }}>
          <div className='mx-6 mb-4 bg-[#19191c] text-white text-[14px] leading-6 px-8 py-4 rounded-sm flex items-center gap-3'>
            <img src='/icons/right.svg' alt='' className='w-5 h-5' />
            <span>
              <strong>{toastMessage}</strong> has been successfully added to
              your product database...
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageItemTemplatePage;
