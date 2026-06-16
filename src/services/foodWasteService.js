import axiosInstance from '../api/axiosInstance';
import { getUserIdFromToken } from './analyticsService';

//TOTAL FOOD WASTE VALUE
export async function fetchTotalFoodWaste({ inventoryId, fromDate, toDate }) {
  const userId = getUserIdFromToken();
  const res = await axiosInstance.get('/analytics/food-waste/total-foodwaste', {
    params: { userId, inventoryId, fromDate, toDate },
  });
  return res.data;
}

//FOOD WASTE BY CAUSE
export async function fetchFoodWasteByCause({ inventoryId, fromDate, toDate }) {
  const res = await axiosInstance.get(
    '/analytics/food-waste/foodwaste-by-cause',
    {
      params: { language: 'en', inventoryId, fromDate, toDate },
    },
  );
  return res.data;
}

//FOOD WASTE BY CATEGORY
export async function fetchFoodWasteByCategory({
  inventoryId,
  fromDate,
  toDate,
  limit = 4,
  offset = 0,
}) {
  const res = await axiosInstance.get(
    '/analytics/food-waste/foodwaste-by-category',
    {
      params: { language: 'en', inventoryId, fromDate, toDate, limit, offset },
    },
  );
  return res.data;
}

//MOST WASTED ITEMS
export async function fetchMostWastedItems({
  inventoryId,
  fromDate,
  toDate,
  limit = 4,
  offset = 0,
}) {
  const res = await axiosInstance.get(
    '/analytics/food-waste/most-wasted-items',
    {
      params: { language: 'en', inventoryId, fromDate, toDate, limit, offset },
    },
  );
  return res.data;
}

//OVERVIEW OF WASTED FOOD
export async function fetchFoodWasteOverview({
  inventoryId,
  fromDate,
  toDate,
  dateRangeType,
}) {
  const res = await axiosInstance.get(
    '/analytics/food-waste/foodwaste-overview',
    {
      params: { language: 'en', inventoryId, fromDate, toDate, dateRangeType },
    },
  );
  return res.data;
}

//OTHER REASON DETAILS
export async function fetchOtherReasonLineItems({
  inventoryId,
  fromDate,
  toDate,
}) {
  const res = await axiosInstance.get(
    '/analytics/food-waste/other-reason-line-items',
    {
      params: { inventoryId, fromDate, toDate },
    },
  );
  return res.data;
}
