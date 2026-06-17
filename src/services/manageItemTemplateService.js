import axiosInstance from '../api/axiosInstance';

// Fetch all products (item templates) with pagination + filters
export const fetchItemTemplates = async ({
  name = '',
  offset = 0,
  limit = 20,
  sortOrder = 'ASC',
  sortBy = 'name',
  language = 'en',
  itemTemplate = '',
  parentProductGroupId = '',
  productGroupId = '',
  inventoryId = '',
  supplierId = '',
} = {}) => {
  const { data } = await axiosInstance.get('/products', {
    params: {
      name,
      offset,
      limit,
      sortOrder,
      sortBy,
      language,
      itemTemplate,
      parentProductGroupId,
      productGroupId,
      inventoryId,
      supplierId,
    },
  });
  return data;
};

// Fetch product groups (categories) - parents only
export const fetchProductGroups = async () => {
  const { data } = await axiosInstance.get('/product-groups', {
    params: { language: 'en', onlyParents: true },
  });
  return data?.Data || [];
};

// Fetch subcategories by parent group id
export const fetchSubcategories = async (parentId) => {
  const { data } = await axiosInstance.get('/product-groups', {
    params: { language: 'en', parentId, onlyParents: false },
  });
  return data?.Data || [];
};

// Fetch suppliers
export const fetchSuppliers = async () => {
  const { data } = await axiosInstance.get('/suppliers');
  return data?.Data || [];
};

// Fetch store products search
export const fetchStoreProductsSearch = async ({
  name = '',
  limit = 10,
  offset = 0,
} = {}) => {
  const { data } = await axiosInstance.get(
    '/inventory-management/store-products/search',
    {
      params: { name, limit, offset },
    },
  );
  return data;
};

// Delete item template
export const deleteItemTemplate = async (id) => {
  const { data } = await axiosInstance.delete(`/products/${id}`);
  return data;
};
