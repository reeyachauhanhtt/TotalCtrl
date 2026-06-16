import axiosInstance from '../api/axiosInstance';
import * as XLSX from 'xlsx';

export const downloadInventoryCSV = async ({
  inventoryId,
  name,
  supplierIds,
  stockFilter,
}) => {
  const params = {};

  if (inventoryId) params.inventoryId = inventoryId;
  if (name) params.name = name;
  if (supplierIds) params.supplierIds = supplierIds;
  if (stockFilter && stockFilter !== 'all') {
    const stockMap = { in: '1', out: '0', low: '2' };
    params.isInStock = stockMap[stockFilter];
  }

  const res = await axiosInstance.get(
    '/inventory-management/store-products/download-csv',
    { params },
  );

  const rows = res.data?.Data || [];

  // Format rows — clean up expiration date
  const formatted = rows.map((row) => ({
    Index: row.Index,
    'Product Name': row['Product Name'],
    'Expiration Date':
      row['Expiration Date'] === 'Not Specified'
        ? 'Not Specified'
        : new Date(row['Expiration Date']).toLocaleDateString('en-GB'),
    Price: row.Price,
    Quantity: row.Quantity,
    Subtotal: row.Subtotal,
  }));

  // Build worksheet
  const worksheet = XLSX.utils.json_to_sheet(formatted);

  // Column widths
  worksheet['!cols'] = [
    { wch: 8 }, // Index
    { wch: 40 }, // Product Name
    { wch: 18 }, // Expiration Date
    { wch: 10 }, // Price
    { wch: 10 }, // Quantity
    { wch: 15 }, // Subtotal
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventory');

  // Return as blob
  const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  return new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
};
