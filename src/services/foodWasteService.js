import axiosInstance from '../api/axiosInstance';
import { API_ENDPOINTS } from '../constants/apiEndpoints';
import { getUserIdFromToken } from './analyticsService';

//TOTAL FOOD WASTE VALUE
export async function fetchTotalFoodWaste({ inventoryId, fromDate, toDate }) {
  const userId = getUserIdFromToken();
  const res = await axiosInstance.get(
    API_ENDPOINTS.ANALYTICS_FOOD_WASTE_TOTAL,
    {
      params: { userId, inventoryId, fromDate, toDate },
    },
  );
  return res.data;
}

//FOOD WASTE BY CAUSE
export async function fetchFoodWasteByCause({ inventoryId, fromDate, toDate }) {
  const res = await axiosInstance.get(
    API_ENDPOINTS.ANALYTICS_FOOD_WASTE_BY_CAUSE,
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
    API_ENDPOINTS.ANALYTICS_FOOD_WASTE_BY_CATEGORY,
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
    API_ENDPOINTS.ANALYTICS_FOOD_WASTE_MOST_WASTED_ITEMS,
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
    API_ENDPOINTS.ANALYTICS_FOOD_WASTE_OVERVIEW,
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
    API_ENDPOINTS.ANALYTICS_FOOD_WASTE_OTHER_REASON_LINE_ITEMS,
    {
      params: { inventoryId, fromDate, toDate },
    },
  );
  return res.data;
}
