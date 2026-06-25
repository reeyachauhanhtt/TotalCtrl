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

//--------------------------------------------------------------------------

//delete selected product/s from the selected product/s
export const deleteItemTemplates = async (ids) => {
  const { data } = await axiosInstance.delete('/products', {
    data: { productIds: ids },
  });
  return data;
};

//assign supplier to the selected product/s
export async function assignSupplier({ supplierId, storeId, productIds }) {
  const res = await axiosInstance.post(`/suppliers/${supplierId}/products`, {
    storeId,
    productIds,
  });
  return res.data;
}

//GET THE INFO ABOUT THE PRODUCS WHEN OPENED AN EDIT MODAL
export const fetchItemTemplateDetail = async (id) => {
  const { data } = await axiosInstance.get(`/products/${id}`);
  return data?.Data || null;
};

//parse an excel
export const parseExcel = async (payload) => {
  const { data } = await axiosInstance.post('/products/parse-excel', payload);
  return data;
};

//UPLOAD AN EXCEL
export const addInitialProducts = async (payload) => {
  const { data } = await axiosInstance.post('/products/add-initial', payload);
  return data;
};

//--------------------------------------------------------------------------

//add item template
export async function createItemTemplate(payload) {
  const res = await axiosInstance.post('/products', payload);
  return res.data;
}

//edit item template
export const updateItemTemplate = async ({ id, payload }) => {
  const { data } = await axiosInstance.put(`/products/${id}`, payload);
  return data;
};

// Delete item template
export const deleteItemTemplate = async (id) => {
  const { data } = await axiosInstance.delete(`/products/${id}`);
  return data;
};

//add item to an inventory
export async function addProductToInventory(payload) {
  const response = await axiosInstance.post(
    '/inventory-management/store-products',
    payload,
  );
  return response.data;
}
