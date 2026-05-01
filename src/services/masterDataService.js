import axiosInstance from '../api/axiosInstance';

export const fetchMeasurementUnits = async () => {
  const res = await axiosInstance.get('/master-data/measurement-units', {
    params: new URLSearchParams([
      ['types', 'purchaseUnit'],
      ['types', 'stockTakingUnit'],
      ['types', 'basicMeasurementUnit'],
      ['language', 'en'],
    ]),
  });

  console.log('measurementUnits raw:', res.data); // keep this to verify

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
