import { useState, useEffect } from 'react';

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search || '');
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className='flex flex-col h-full'>
      <TemplatePanel />
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
          onClearIssueFilter={() => setFilters((p) => ({ ...p, issue: null }))}
          checkedIds={checkedIds}
          onCheckedChange={setCheckedIds}
        />
      </div>
    </div>
  );
};

export default ManageItemTemplatePage;
