import axiosInstance from '../api/axiosInstance';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

//fetch Units
export const fetchMeasurementUnits = async () => {
  const res = await axiosInstance.get(
    API_ENDPOINTS.MASTER_DATA_MEASUREMENT_UNITS,
    {
      params: new URLSearchParams([
        ['types', 'purchaseUnit'],
        ['types', 'stockTakingUnit'],
        ['types', 'basicMeasurementUnit'],
        ['language', 'en'],
      ]),
    },
  );

  console.log('measurementUnits raw:', res.data);
  const raw = res.data?.Data || [];

  if (Array.isArray(raw)) {
    return {
      purchaseUnit: raw,
      stockTakingUnit: raw,
      basicMeasurementUnit: raw,
    };
  }

  return {
    purchaseUnit: raw.purchaseUnit || [],
    stockTakingUnit: raw.stockTakingUnit || [],
    basicMeasurementUnit: raw.basicMeasurementUnit || [],
  };
};

//fetch quality issues
export const fetchQualityIssues = async () => {
  const { data } = await axiosInstance.get(
    API_ENDPOINTS.MASTER_DATA_QUALITY_ISSUES,
  );
  return data;
};
