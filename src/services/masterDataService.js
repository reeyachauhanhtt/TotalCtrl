import axiosInstance from '../api/axiosInstance';

//fetch Units
export const fetchMeasurementUnits = async () => {
  const res = await axiosInstance.get('/master-data/measurement-units', {
    params: new URLSearchParams([
      ['types', 'purchaseUnit'],
      ['types', 'stockTakingUnit'],
      ['types', 'basicMeasurementUnit'],
      ['language', 'en'],
    ]),
  });

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
  const { data } = await axiosInstance.get('/master-data/quality-issues');
  return data;
};
