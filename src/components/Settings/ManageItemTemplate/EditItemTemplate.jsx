import { useState, useEffect } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';

import WhiteButton from '../../Common/WhiteButton';
import GreenButton from '../../Common/GreenButton';
import Checkbox from '../../Common/Checkbox';
import Input from '../../Common/Input';
import ConfirmModal from '../../Common/ConfirmModal';
import AppTooltip from '../../Common/Tooltip';
import CategoryDropdown from './common/CategoryDropdown';
import SubcategoryDropdown from './common/SubcategoryDropdown';
import AllUnitDropdown from './common/AllUnitsDropdown';
import { fetchMeasurementUnits } from '../../../services/masterDataService';
import {
  fetchItemTemplateDetail,
  updateItemTemplate,
} from '../../../services/manageItemTemplateService';
import { formatPrice } from '../../../utils/format';
import {
  ITEM_TEMPLATE_MODAL_TITLES,
  ITEM_TEMPLATE_SECTION_TITLES,
  VALIDATION_LABELS,
} from '../../../constants/titles';

function deriveCategory(item) {
  const group = item?.productGroup;
  if (!group) return null;
  return group.parent
    ? { id: group.parent.id, name: group.parent.name }
    : { id: group.id, name: group.name };
}

function deriveSubcategory(item) {
  const group = item?.productGroup;
  if (!group || !group.parent) return null;
  return { id: group.id, name: group.name };
}

export default function EditItemTemplateModal({
  isOpen,
  onClose,
  item,
  onSuccess,
}) {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [name, setName] = useState(item?.name || '');
  const [sku, setSku] = useState(item?.sku || '');
  const [durabilityDays, setDurabilityDays] = useState(
    item?.durabilityDays || '',
  );
  const [category, setCategory] = useState(() => deriveCategory(item));
  const [subcategory, setSubcategory] = useState(() => deriveSubcategory(item));
  const [purchaseUnit, setPurchaseUnit] = useState(null);
  const [stockTakingUnit, setStockTakingUnit] = useState(null);
  const [bmu, setBmu] = useState(null);
  const [puToStu, setPuToStu] = useState('');
  const [stuToBmu, setStuToBmu] = useState('');
  const [origPurchaseUnitId, setOrigPurchaseUnitId] = useState(null);
  const [origStockTakingUnitId, setOrigStockTakingUnitId] = useState(null);
  const [origBmuId, setOrigBmuId] = useState(null);
  const [subparLevel, setSubparLevel] = useState('');
  const [cost, setCost] = useState('');
  const [costUnit, setCostUnit] = useState(null);

  const [touched, setTouched] = useState({ name: false });
  const [focusedField, setFocusedField] = useState(null);
  const [touchedConversions, setTouchedConversions] = useState({
    puToStu: false,
    stuToBmu: false,
  });
  const [touchedCost, setTouchedCost] = useState(false);

  const [affectedQuantities, setAffectedQuantities] = useState({});
  const [removeFromInventory, setRemoveFromInventory] = useState({});
  const [conversionsTouched, setConversionsTouched] = useState(false);

  const { data: itemDetail } = useQuery({
    queryKey: ['itemTemplateDetail', item?.id],
    queryFn: () => fetchItemTemplateDetail(item.id),
    enabled: !!item?.id,
    staleTime: 0,
    gcTime: 0,
  });

  const { data: units } = useQuery({
    queryKey: ['measurementUnits'],
    queryFn: fetchMeasurementUnits,
    staleTime: Infinity,
  });

  const queryClient = useQueryClient();

  const { mutate: saveTemplate, isLoading: isSaving } = useMutation({
    mutationFn: updateItemTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['itemTemplates'] });
      queryClient.invalidateQueries({
        queryKey: ['itemTemplateDetail', item?.id],
      });
      onSuccess?.(name);
      handleClose();
    },
  });

  useEffect(() => {
    console.log('inventoryQuantities:', itemDetail?.existInventoryList);
    if (!item) return;
    setName(item.name || '');
    setSku(item.sku || '');
    setDurabilityDays(
      item.durabilityDays && item.durabilityDays !== '----'
        ? String(item.durabilityDays)
        : '',
    );
    setCategory(deriveCategory(item));
    setSubcategory(deriveSubcategory(item));

    const allUnits = [
      ...(units?.purchaseUnit || []),
      ...(units?.stockTakingUnit || []),
      ...(units?.basicMeasurementUnit || []),
    ];
    const matchedPU =
      allUnits.find((u) => u.id === item.purchaseUnitId) || null;
    const matchedSTU =
      allUnits.find((u) => u.id === item.stockTakingUnitId) || null;
    const matchedBMU =
      allUnits.find((u) => u.id === item.baseMeasurementUnitId) || null;

    setPurchaseUnit(matchedPU);
    setStockTakingUnit(matchedSTU);
    setBmu(matchedBMU);
    setPuToStu(
      item.stockTakingQuantityPerPurchaseUnit > 0
        ? String(item.stockTakingQuantityPerPurchaseUnit)
        : '',
    );
    setStuToBmu(
      item.stockTakingQuantityPerBaseMeasurementUnit > 0
        ? String(item.stockTakingQuantityPerBaseMeasurementUnit)
        : '',
    );
    setOrigPurchaseUnitId(matchedPU?.id || null);
    setOrigStockTakingUnitId(matchedSTU?.id || null);
    setOrigBmuId(matchedBMU?.id || null);
    setSubparLevel(item.subparLevel != null ? String(item.subparLevel) : '');
    const apiCostUnit = item.costUnit;
    if (apiCostUnit === 'PU' && item.pricePerPurchaseUnit) {
      setCost(String(item.pricePerPurchaseUnit));
    } else if (apiCostUnit === 'SU' && item.pricePerStockTakingUnit) {
      setCost(String(item.pricePerStockTakingUnit));
    } else if (apiCostUnit === 'BMU' && item.pricePerBaseUnit) {
      setCost(String(item.pricePerBaseUnit));
    } else {
      setCost(
        item.pricePerPurchaseUnit ? String(item.pricePerPurchaseUnit) : '',
      );
    }

    const initialQuantities = {};
    (itemDetail?.existInventoryList || []).forEach((inv) => {
      initialQuantities[inv.inventoryId] = String(inv.totalQuantity);
    });
    setAffectedQuantities(initialQuantities);
    setRemoveFromInventory({});
  }, [item, units]);

  if (!isOpen) return null;

  function handleClose() {
    setName(item?.name || '');
    setSku(item?.sku || '');
    setDurabilityDays(item?.durabilityDays || '');
    setCategory(deriveCategory(item));
    setSubcategory(deriveSubcategory(item));
    setPurchaseUnit(null);
    setStockTakingUnit(null);
    setBmu(null);
    setPuToStu('');
    setStuToBmu('');
    setOrigPurchaseUnitId(null);
    setOrigStockTakingUnitId(null);
    setOrigBmuId(null);
    setSubparLevel('');
    setCost('');
    setCostUnit(null);

    setTouched({ name: false });
    setFocusedField(null);
    setTouchedConversions({ puToStu: false, stuToBmu: false });
    setTouchedCost(false);
    setAffectedQuantities({});
    setRemoveFromInventory({});
    setConversionsTouched(false);

    onClose();
  }

  // console.log('category state:', category);
  // console.log('subcategory state:', subcategory);
  // console.log('item.productGroup:', item?.productGroup);

  const puChanged =
    origPurchaseUnitId !== null && purchaseUnit?.id !== origPurchaseUnitId;
  const stuChanged =
    origStockTakingUnitId !== null &&
    stockTakingUnit?.id !== origStockTakingUnitId;
  const bmuChanged =
    (bmu?.id ?? null) !== (item?.baseMeasurementUnitId ?? null);

  function getPuStuWarning() {
    if (puChanged && stuChanged)
      return 'Both units have been changed. Please review if the conversion needs to be updated too.';
    if (puChanged)
      return 'Purchase unit has been changed. Please review if the conversion needs to be updated too.';
    if (stuChanged)
      return 'Stocktaking unit has been changed. Please review if the conversion needs to be updated too.';
    return null;
  }

  function getStuBmuWarning() {
    if (puChanged && stuChanged)
      return 'Both units have been changed. Please review if the conversion needs to be updated too.';
    if (bmuChanged)
      return 'Basic measurement unit has been changed. Please review if the conversion needs to be updated too.';
    if (stockTakingUnit && !bmu)
      return 'Basic measurement unit not defined yet';
    return null;
  }

  const puStuWarning = getPuStuWarning();
  const stuBmuWarning = getStuBmuWarning();

  function getCostWarning() {
    if (puChanged && stuChanged && bmuChanged)
      return 'All units have been changed. Please review if the cost needs to be updated too.';
    if (puChanged && stuChanged)
      return 'Purchase unit and stocktaking unit have been changed. Please review if the cost needs to be updated too.';
    if (puChanged)
      return 'Purchase unit has been changed. Please review if the cost needs to be updated too.';
    if (stuChanged)
      return 'Stocktaking unit has been changed. Please review if the cost needs to be updated too.';
    if (bmuChanged)
      return 'Basic measurement unit has been changed. Please review if the cost needs to be updated too.';
    return null;
  }

  const costWarning = getCostWarning();

  //bmu cost change effect
  useEffect(() => {
    if (bmuChanged) setConversionsTouched(true);
  }, [bmuChanged]);

  const costUnitOptions = [
    purchaseUnit
      ? { ...purchaseUnit, label: `${purchaseUnit.name} (PU)`, role: 'PU' }
      : null,
    stockTakingUnit
      ? {
          ...stockTakingUnit,
          label: `${stockTakingUnit.name} (SU)`,
          role: 'SU',
        }
      : null,
    bmu ? { ...bmu, label: `${bmu.name} (BMU)`, role: 'BMU' } : null,
  ].filter(Boolean);

  useEffect(() => {
    if (costUnitOptions.length > 0 && !costUnit) {
      setCostUnit(costUnitOptions[0]);
    }
  }, [purchaseUnit, stockTakingUnit, bmu]);

  useEffect(() => {
    if (purchaseUnit && !costUnit) {
      setCostUnit({
        ...purchaseUnit,
        label: `${purchaseUnit.name} (PU)`,
        role: 'PU',
      });
    }
  }, [purchaseUnit]);

  const costNum = parseFloat(cost);
  const puToStuNum = parseFloat(puToStu);
  const stuToBmuNum = parseFloat(stuToBmu);

  const computedCosts = (() => {
    if (!cost || isNaN(costNum) || !costUnit) return null;

    let puCost, stuCost, bmuCost;

    if (costUnit.role === 'PU') {
      puCost = costNum;
      stuCost = puToStuNum > 0 ? costNum / puToStuNum : null;
      bmuCost =
        stuCost !== null && stuToBmuNum > 0 ? stuCost / stuToBmuNum : null;
    } else if (costUnit.role === 'SU') {
      stuCost = costNum;
      puCost = puToStuNum > 0 ? costNum * puToStuNum : null;
      bmuCost = stuToBmuNum > 0 ? costNum / stuToBmuNum : null;
    } else if (costUnit.role === 'BMU') {
      bmuCost = costNum;
      stuCost = stuToBmuNum > 0 ? costNum * stuToBmuNum : null;
      puCost = stuCost !== null && puToStuNum > 0 ? stuCost * puToStuNum : null;
    }

    return { puCost, stuCost, bmuCost };
  })();

  const hasFormChanges =
    puChanged ||
    stuChanged ||
    bmuChanged ||
    puToStu !==
      (item?.stockTakingQuantityPerPurchaseUnit > 0
        ? String(item.stockTakingQuantityPerPurchaseUnit)
        : '') ||
    stuToBmu !==
      (item?.stockTakingQuantityPerBaseMeasurementUnit > 0
        ? String(item.stockTakingQuantityPerBaseMeasurementUnit)
        : '') ||
    cost !==
      (item?.pricePerPurchaseUnit ? String(item.pricePerPurchaseUnit) : '');

  // console.log('payload:', {
  //   name: name.trim(),
  //   sku: sku || undefined,
  //   durabilityDays: durabilityDays ? Number(durabilityDays) : 0,
  //   purchaseUnitId: purchaseUnit?.id || undefined,
  //   stockTakingUnitId: stockTakingUnit?.id || undefined,
  //   baseMeasurementUnitId: bmu?.id || undefined,
  //   stockTakingQuantityPerPurchaseUnit: puToStu ? Number(puToStu) : undefined,
  //   stockTakingQuantityPerBaseMeasurementUnit: stuToBmu
  //     ? Number(stuToBmu)
  //     : undefined,
  //   subparLevel: subparLevel ? Number(subparLevel) : null,
  //   pricePerPurchaseUnit: computedCosts?.puCost ?? undefined,
  //   pricePerStockTakingUnit: computedCosts?.stuCost ?? undefined,
  //   pricePerBaseUnit: computedCosts?.bmuCost ?? undefined,
  //   productGroupId: subcategory?.id || category?.id || undefined,
  //   affectedItems: (itemDetail?.existInventoryList || []).map((inv) => ({
  //     inventoryId: inv.inventoryId,
  //     storeProductExpirationDateIds: inv.storeProductExpirationDateIds,
  //     storeProductItemsIds: inv.storeProductItemsIds,
  //     totalQty:
  //       parseFloat(affectedQuantities[inv.inventoryId] ?? inv.totalQty) || 0,
  //     isRemoveFromInventory: !!removeFromInventory[inv.inventoryId],
  //   })),
  // });

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'>
      <div className='h-[calc(100vh-48px)] w-[75%] rounded-lg bg-white shadow-lg'>
        <div className='flex h-full flex-col'>
          {/* Header */}
          <div className='flex items-center border-b border-[#E7E7EC] px-12 py-6'>
            <h2 className='w-full text-[18px] font-semibold text-[#19191C]'>
              {ITEM_TEMPLATE_MODAL_TITLES.EDIT_ITEM_TEMPLATE}
            </h2>
            <button onClick={() => setShowCancelConfirm(true)}>
              <img
                src='/icons/closepopup-icon.svg'
                alt='close'
                className='h-3.5 w-3.5'
              />
            </button>
          </div>

          {/* Body */}
          <div className='h-[calc(100%-140px)] overflow-y-auto px-12 pb-8'>
            {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~BASIC INFO SECTION  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  */}

            <section className='pt-[60px] pb-[60px] border-b border-[#e7e7ec]'>
              <h3 className='mb-6 text-[20px] font-semibold leading-7 tracking-[-0.01em] text-[#19191C]'>
                {ITEM_TEMPLATE_SECTION_TITLES.BASIC_ITEM_INFO}
              </h3>

              {/* Row 1: Item Name + SKU */}
              <div className='grid grid-cols-12 gap-4 mb-2'>
                <div className='col-span-8'>
                  <label className='mb-1 flex text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6B6B6F]'>
                    Item Name
                    <span className='ml-1 text-[#e2232e] text-[12px]'>*</span>
                  </label>

                  <Input
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (touched.name)
                        setTouched((p) => ({ ...p, name: false }));
                    }}
                    onBlur={() => {
                      setTouched((p) => ({ ...p, name: true }));
                    }}
                    placeholder=''
                    autoFocus
                    error={touched.name && !name.trim()}
                    errorMessage='This field is required'
                    className='col-span-8'
                  />
                </div>

                <div className='col-span-4'>
                  <label className='mb-1 block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6B6B6F]'>
                    SKU
                  </label>

                  <Input
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className='col-span-4'
                  />
                </div>
              </div>

              {/* Row 2: Category + Subcategory + Durability */}
              <div className='grid grid-cols-12 gap-4 mt-3'>
                <div className='col-span-4'>
                  <label className='mb-1 flex text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6B6B6F]'>
                    Category
                    <span className='ml-1 text-[#e2232e] text-[12px]'>*</span>
                  </label>
                  <CategoryDropdown
                    selected={category}
                    onSelect={(c) => {
                      setCategory(c);
                      setSubcategory(null);
                    }}
                  />
                </div>

                <div className='col-span-4'>
                  <label className='mb-1 block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6B6B6F]'>
                    Subcategory
                  </label>
                  <SubcategoryDropdown
                    selected={subcategory}
                    onSelect={setSubcategory}
                    categoryId={category?.id}
                  />
                </div>

                <div className='col-span-4'>
                  <label className='mb-1 block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6B6B6F]'>
                    Durability Days
                  </label>

                  <Input
                    type='number'
                    value={durabilityDays}
                    onChange={(e) => setDurabilityDays(e.target.value)}
                    className='col-span-4'
                  />

                  <span className='mt-2 block text-[13px] leading-4 text-[#6b6b6f]'>
                    Maximum recommended storage days before the item may spoil.
                  </span>
                </div>
              </div>
            </section>

            {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ UNITS SECTION  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  */}

            <section className='pb-[60px] border-b border-[#e7e7ec]'>
              <h3 className='mb-1 text-[20px] font-semibold leading-7 tracking-[-0.01em] text-[#19191C]'>
                {ITEM_TEMPLATE_SECTION_TITLES.UNITS}
              </h3>
              <span className='block text-[14px] leading-5 text-[#6b6b6f] mb-6'>
                Define at least one of the following units
              </span>

              <div className='grid grid-cols-12 gap-4'>
                {/* Purchase Unit */}
                <div className='col-span-4'>
                  <div className='mb-2'>
                    <label className='mb-1 flex text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6B6B6F]'>
                      Purchase unit
                      <span className='ml-1 text-[#e2232e] text-[12px]'>*</span>
                    </label>
                    <AllUnitDropdown
                      options={units?.purchaseUnit || []}
                      selected={purchaseUnit}
                      onSelect={setPurchaseUnit}
                      placeholder='Select purchase unit...'
                    />
                    <span className='mt-2 block text-[13px] leading-4 text-[#6b6b6f]'>
                      Unit in which you acquire or purchase a product. It
                      usually appears on your order confirmations or invoices.
                    </span>
                  </div>
                </div>

                {/* Stocktaking Unit */}
                <div className='col-span-4'>
                  <div className='mb-2'>
                    <label className='mb-1 flex text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6B6B6F]'>
                      Stocktaking unit
                      <span className='ml-1 text-[#e2232e] text-[12px]'>*</span>
                    </label>
                    <AllUnitDropdown
                      options={units?.stockTakingUnit || []}
                      selected={stockTakingUnit}
                      onSelect={setStockTakingUnit}
                      placeholder='Select stocktaking unit...'
                    />
                    <span className='mt-2 block text-[13px] leading-4 text-[#6b6b6f]'>
                      Unit used for inventory management and stocktaking, in
                      which you count or track the items in your inventory. It
                      might or might not be the same as the purchase unit,
                      depending on how you manage your inventory.
                    </span>
                  </div>
                </div>

                {/* Basic Measurement Unit */}
                <div className='col-span-4'>
                  <div className='mb-2'>
                    <label className='mb-1 block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6B6B6F]'>
                      Basic measurement unit
                    </label>
                    <AllUnitDropdown
                      options={units?.basicMeasurementUnit || []}
                      selected={bmu}
                      onSelect={setBmu}
                      placeholder='Select basic measurement unit...'
                    />
                    <span className='mt-2 block text-[13px] leading-4 text-[#6b6b6f]'>
                      The fundamental unit of measurement associated with the
                      product. It represents the weight (kilogram), volume
                      (liter) or count (piece) of an item, and it's often used
                      for consistency in measurements.
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ CONVERSION SECTION  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  */}

            <section className='border-b border-[#e7e7ec]'>
              <h3 className='mb-6 text-[20px] font-semibold leading-7 tracking-[-0.01em] text-[#19191C]'>
                {ITEM_TEMPLATE_SECTION_TITLES.CONVERSIONS}
              </h3>

              <div className='grid grid-cols-12 gap-4'>
                {/* Col 1: Purchase → Stocktaking */}
                <div className='col-span-4'>
                  <p className='mb-6 text-[14px] font-semibold leading-5 text-[#19191c]'>
                    {ITEM_TEMPLATE_SECTION_TITLES.PURCHASE_TO_STOCKTAKING_UNIT}
                  </p>

                  <div className='mb-2'>
                    <label className='mb-1 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6B6B6F]'>
                      1 {purchaseUnit ? purchaseUnit.name : 'purchase unit'}
                      {purchaseUnit && stockTakingUnit && (
                        <span className='text-[#e2232e] text-[12px]'>*</span>
                      )}
                      =
                    </label>

                    <Input
                      value={puToStu}
                      onChange={(e) => setPuToStu(e.target.value)}
                      onBlur={() =>
                        setTouchedConversions((p) => ({ ...p, puToStu: true }))
                      }
                      disabled={!purchaseUnit}
                      placeholder={
                        stockTakingUnit
                          ? stockTakingUnit.name.toLowerCase()
                          : 'stocktaking units'
                      }
                      suffix={stockTakingUnit?.name.toLowerCase()}
                      error={
                        touchedConversions.puToStu &&
                        !puToStu &&
                        !!purchaseUnit &&
                        !!stockTakingUnit
                      }
                    />

                    <span className='mt-2 block text-[13px] leading-4 text-[#6b6b6f]'>
                      How many{' '}
                      {stockTakingUnit
                        ? stockTakingUnit.name.toLowerCase()
                        : 'stocktaking units'}{' '}
                      are there in one{' '}
                      {purchaseUnit
                        ? purchaseUnit.name.toLowerCase()
                        : 'purchase unit'}
                      ?
                    </span>

                    {touchedConversions.puToStu &&
                      !puToStu &&
                      purchaseUnit &&
                      stockTakingUnit && (
                        <span className='mt-1 block text-[13px] text-[#d93a3f]'>
                          {VALIDATION_LABELS.FIELD_REQUIRED}
                        </span>
                      )}

                    {puStuWarning && (
                      <div
                        className='mt-[10px] w-full rounded px-4 py-3 mb-5 inline-flex font-semibold text-[14px] leading-[18px]'
                        style={{ background: '#f2f1ff', color: '#362a96' }}
                      >
                        {puStuWarning}
                      </div>
                    )}
                  </div>
                </div>

                {/* Col 2: Stocktaking → BMU */}

                {!(stockTakingUnit && bmu && stockTakingUnit.id === bmu.id) && (
                  <div className='col-span-4'>
                    <p className='mb-6 text-[14px] font-semibold leading-5 text-[#19191c]'>
                      {ITEM_TEMPLATE_SECTION_TITLES.STOCKTAKING_TO_BASIC_UNIT}
                    </p>
                    <div className='mb-2'>
                      <label className='mb-1 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6B6B6F]'>
                        1{' '}
                        {stockTakingUnit
                          ? stockTakingUnit.name
                          : 'stocktaking unit'}
                        {stockTakingUnit && bmu && (
                          <span className='text-[#e2232e] text-[12px]'>*</span>
                        )}
                        =
                      </label>

                      <Input
                        value={stuToBmu}
                        onChange={(e) => setStuToBmu(e.target.value)}
                        onBlur={() =>
                          setTouchedConversions((p) => ({
                            ...p,
                            stuToBmu: true,
                          }))
                        }
                        disabled={!bmu}
                        placeholder={
                          bmu
                            ? bmu.name.toLowerCase()
                            : 'basic measurement units'
                        }
                        suffix={bmu?.name.toLowerCase()}
                      />

                      <span className='mt-2 block text-[13px] leading-4 text-[#6b6b6f]'>
                        How many{' '}
                        {bmu
                          ? bmu.name.toLowerCase()
                          : 'basic measurement units'}{' '}
                        are there in one{' '}
                        {stockTakingUnit
                          ? stockTakingUnit.name.toLowerCase()
                          : 'stocktaking unit'}
                        ?
                      </span>

                      {stuBmuWarning && (
                        <div
                          className='mt-[10px] w-full rounded px-4 py-3 mb-5 inline-flex font-semibold text-[14px] leading-[18px]'
                          style={{ background: '#f2f1ff', color: '#362a96' }}
                        >
                          {stuBmuWarning}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ SUBAPAR LEVEL SECTION  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  */}

            <section className='pt-[60px] border-b border-[#e7e7ec]'>
              <div className='flex items-center gap-5 mb-6'>
                <h3 className='text-[20px] font-semibold leading-7 tracking-[-0.01em] text-[#19191C]'>
                  {ITEM_TEMPLATE_SECTION_TITLES.SUBPAR_LEVEL}
                </h3>
                <span
                  data-tooltip-id='subpar-tooltip'
                  className='inline-flex items-center cursor-pointer'
                >
                  <img
                    src='/icons/info.svg'
                    alt='info'
                    style={{ width: 18, height: 18 }}
                  />
                </span>
                <AppTooltip
                  id='subpar-tooltip'
                  place='bottom'
                  html={true}
                  style={{
                    borderRadius: 12,
                    fontSize: 14,
                    fontWeight: 300,
                    lineHeight: '20px',
                    maxWidth: 350,
                    padding: '18px 15px',
                    whiteSpace: 'normal',
                    textAlign: 'left',
                    zIndex: 200,
                  }}
                  content="This defines your minimum stock level. When items drop below it, they'll appear in 'Low in Stock' and your weekly smart shopping list, sent to your registered email."
                />
              </div>

              <div className='grid grid-cols-12 gap-4'>
                <div className='col-span-4'>
                  <Input
                    value={subparLevel}
                    onChange={(e) => setSubparLevel(e.target.value)}
                    placeholder={
                      stockTakingUnit
                        ? stockTakingUnit.name.toLowerCase()
                        : 'stocktaking units'
                    }
                    suffix={stockTakingUnit?.name.toLowerCase()}
                  />
                </div>
              </div>
            </section>

            {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ COST SECTION  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  */}

            <section className='pt-[60px] pb-[60px]'>
              <h3 className='mb-6 text-[20px] font-semibold leading-7 tracking-[-0.01em] text-[#19191C]'>
                {ITEM_TEMPLATE_SECTION_TITLES.COST}
              </h3>

              <div className='flex items-start gap-0'>
                {/* Cost input */}
                <div className='w-[25%]'>
                  <Input
                    value={cost}
                    onChange={(e) => {
                      setCost(e.target.value);
                      if (touchedCost) setTouchedCost(false);
                    }}
                    onBlur={() => setTouchedCost(true)}
                    placeholder='0'
                    suffix='kr'
                    error={touchedCost && !cost}
                    errorMessage='This field is required'
                    className='w-[100%]'
                  />
                </div>

                {/* "per" text */}
                <div className='flex h-12 items-center px-3 text-[14px] text-[#19191c]'>
                  per
                </div>

                {/* Unit dropdown */}
                <div className='w-[33%]'>
                  {costUnitOptions.length > 0 ? (
                    <AllUnitDropdown
                      options={costUnitOptions}
                      selected={costUnit}
                      // onSelect={setCostUnit}
                      onSelect={(u) => {
                        if (computedCosts) {
                          if (u.role === 'PU' && computedCosts.puCost !== null)
                            setCost(String(computedCosts.puCost));
                          else if (
                            u.role === 'SU' &&
                            computedCosts.stuCost !== null
                          )
                            setCost(String(computedCosts.stuCost));
                          else if (
                            u.role === 'BMU' &&
                            computedCosts.bmuCost !== null
                          )
                            setCost(String(computedCosts.bmuCost));
                        }
                        setCostUnit(u);
                      }}
                      placeholder='Select unit...'
                    />
                  ) : (
                    <div className='flex h-12 w-full items-center justify-between rounded border border-[#d7d8e0] bg-[#f1f1f5] px-4 text-sm cursor-default'>
                      <span className='text-[#6b6b6f] opacity-50'>
                        Select unit...
                      </span>
                      <img
                        src='/icons/chevron-down-small.svg'
                        alt=''
                        className='w-6 h-6 shrink-0'
                      />
                    </div>
                  )}

                  {costUnitOptions.length === 0 && (
                    <div
                      className='mt-[10px] w-full rounded px-4 py-3 inline-flex font-semibold text-[14px] leading-[18px]'
                      style={{ background: '#f2f1ff', color: '#362a96' }}
                    >
                      No unit defined yet
                    </div>
                  )}
                </div>
              </div>

              {costWarning && (
                <div
                  className='mt-[10px] w-2/3 rounded px-4 py-3 inline-flex font-semibold text-[14px] leading-[18px]'
                  style={{ background: '#f2f1ff', color: '#362a96' }}
                >
                  {costWarning}
                </div>
              )}

              {conversionsTouched && !puChanged && !stuChanged && (
                <div
                  className='mt-2 w-2/3 rounded px-4 py-3 inline-flex font-semibold text-[14px] leading-[18px]'
                  style={{ background: '#f2f1ff', color: '#362a96' }}
                >
                  Unit conversions unit has been changed. Please review if the
                  cost needs to be updated too.
                </div>
              )}

              {/* Cost per unit overview card */}
              {computedCosts && (
                <div className='mt-4 w-[65%] rounded-lg bg-[#f7f7f9] p-5'>
                  <h3 className='text-[16px] font-semibold leading-5 text-[#19191c]'>
                    {ITEM_TEMPLATE_SECTION_TITLES.COST_PER_UNIT_OVERVIEW}
                  </h3>
                  <hr className='my-0 border-[#e7e7ec]' />
                  <div className='pt-4 space-y-4'>
                    {purchaseUnit && computedCosts.puCost !== null && (
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                          <span className='text-[14px] font-semibold text-[#19191c]'>
                            1 {purchaseUnit.name}
                          </span>
                          <span className='text-[14px] italic text-[#6b6b6f]'>
                            (PU
                            {puToStu && stockTakingUnit
                              ? `, 1 ${purchaseUnit.name} = ${puToStu} ${stockTakingUnit.name}s`
                              : ''}
                            )
                          </span>
                        </div>
                        <span className='text-[14px] text-[#19191c]'>
                          {formatPrice(computedCosts.puCost)}
                        </span>
                      </div>
                    )}

                    {stockTakingUnit && computedCosts.stuCost !== null && (
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                          <span className='text-[14px] font-semibold text-[#19191c]'>
                            1 {stockTakingUnit.name}
                          </span>
                          <span className='text-[14px] italic text-[#6b6b6f]'>
                            (SU
                            {stuToBmu && bmu
                              ? `, 1 ${stockTakingUnit.name} = ${stuToBmu} ${bmu.name}s`
                              : ''}
                            )
                          </span>
                        </div>
                        <span className='text-[14px] text-[#19191c]'>
                          {formatPrice(computedCosts.stuCost)}
                        </span>
                      </div>
                    )}

                    {bmu && computedCosts.bmuCost !== null && (
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                          <span className='text-[14px] font-semibold text-[#19191c]'>
                            1 {bmu.name}
                          </span>
                          <span className='text-[14px] italic text-[#6b6b6f]'>
                            (BMU)
                          </span>
                        </div>
                        <span className='text-[14px] text-[#19191c]'>
                          {formatPrice(computedCosts.bmuCost)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </section>

            {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ AFFECTED ITEMS SECTION ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
            <section className='pt-[60px] pb-[60px]'>
              <h3 className='mb-2 text-[20px] font-semibold leading-7 tracking-[-0.01em] text-[#19191C]'>
                {ITEM_TEMPLATE_SECTION_TITLES.AFFECTED_ITEMS}
              </h3>
              <p className='mb-6 text-[14px] leading-5 text-[#6b6b6f] w-2/3'>
                The changes you've made may affect the item quantity in
                inventories where the item is currently in stock. To ensure
                accurate tracking, please review the updated item quantity for
                each inventory listed below.
              </p>

              {!hasFormChanges ? (
                <p
                  className='mt-[10px] w-2/3 h-10 rounded px-4 py-3 inline-flex font-semibold text-[16px] leading-[18px]'
                  style={{ background: '#f2f1ff', color: '#362a96' }}
                >
                  No affected inventories (items)
                </p>
              ) : (
                <div className='w-full rounded-lg border border-[#dee2e6] overflow-hidden'>
                  <table className='w-full border-collapse'>
                    <thead>
                      <tr>
                        <th
                          className='text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6b6b6f] border-t border-b border-[#dee2e6] border-r border-[#dee2e6] bg-[#fbfbfc] px-5 py-[14px] rounded-tl-lg'
                          style={{ minWidth: '250px' }}
                        >
                          Inventory
                        </th>

                        <th className='text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6b6b6f] border-t border-b border-[#dee2e6] border-r-0 bg-[#fbfbfc] px-5 py-[14px]'>
                          Current
                          <br />
                          Item Quantity
                          <br />
                          (SU)
                        </th>

                        <th className='text-right text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6b6b6f] border-t border-b border-[#dee2e6]border-r border-[#dee2e6] bg-[#fbfbfc] px-5 py-[14px]'>
                          Current
                          <br />
                          Total Value
                        </th>

                        <th className='text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6b6b6f] border-t border-b border-[#dee2e6] border-r-0 bg-[#dcf1e3] px-5 py-[14px]'>
                          Updated
                          <br />
                          Item Quantity
                          <br />
                          (SU)
                        </th>

                        <th className='text-right text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6b6b6f] border-t border-b border-[#dee2e6] border-r border-[#dee2e6]  bg-[#dcf1e3] px-5 py-[14px]'>
                          Updated
                          <br />
                          Total Value
                        </th>

                        <th className='text-center text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6b6b6f] border-t border-b border-[#dee2e6] border-r border-[#dee2e6] bg-[#fbfbfc] px-5 py-[14px] rounded-tr-lg'>
                          Remove
                          <br />
                          From
                          <br />
                          Inventory
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {(itemDetail?.existInventoryList || []).length === 0 ? (
                        <tr>
                          <td
                            colSpan={6}
                            className='px-5 py-[14px] text-[14px] text-[#6b6b6f] border-b border-[#e6e6ed]'
                          >
                            -----
                          </td>
                        </tr>
                      ) : (
                        (itemDetail?.existInventoryList || []).map(
                          (inv, idx) => {
                            const isLast =
                              idx ===
                              (itemDetail?.existInventoryList?.length || 0) - 1;
                            const editedQty = parseFloat(
                              affectedQuantities[inv.inventoryId] ??
                                inv.totalQty,
                            );
                            const stuPrice =
                              computedCosts?.stuCost ??
                              item?.pricePerStockTakingUnit ??
                              0;
                            const updatedTotal = isNaN(editedQty)
                              ? 0
                              : editedQty * stuPrice;
                            const currentTotal =
                              inv.totalQty *
                              (item?.pricePerStockTakingUnit ?? 0);

                            return (
                              <tr key={inv.inventoryId}>
                                {/* Inventory name */}
                                <td
                                  className={`px-5 py-[14px] text-[14px] font-semibold text-[#000] border-r border-[#dee2e6] ${!isLast ? 'border-b border-[#dee2e6]' : ''} ${isLast ? 'rounded-bl-lg' : ''}`}
                                  style={{ minWidth: '250px' }}
                                >
                                  {inv.name}
                                </td>

                                {/* Current Item Quantity */}
                                <td
                                  className={`px-5 py-[14px] border-r-0 ${!isLast ? 'border-b border-[#dee2e6]' : ''}`}
                                >
                                  <span className='block text-[14px] text-[#000]'>
                                    {inv.totalQty}{' '}
                                    {item?.stockTakingUnit?.name || ''}
                                  </span>
                                  <span className='block text-[12px] italic text-[#6b6b6f] mt-1'>
                                    (
                                    {formatPrice(
                                      item?.pricePerStockTakingUnit ?? 0,
                                    )}{' '}
                                    / {item?.stockTakingUnit?.name || ''})
                                  </span>
                                </td>

                                {/* Current Total Value */}
                                <td
                                  className={`px-5 py-[14px] text-right text-[14px] text-[#000] border-r border-[#dee2e6] ${!isLast ? 'border-b border-[#dee2e6]' : ''}`}
                                >
                                  {formatPrice(currentTotal)}
                                </td>

                                {/* Updated Item quantity */}
                                <td
                                  className={`px-5 py-[14px] border-r-0 bg-[#f4faf6] ${!isLast ? 'border-b border-[#dee2e6]' : ''}`}
                                >
                                  <div className='relative flex items-center'>
                                    <input
                                      type='text'
                                      value={
                                        affectedQuantities[inv.inventoryId] ??
                                        String(inv.totalQty)
                                      }
                                      onChange={(e) =>
                                        setAffectedQuantities((prev) => ({
                                          ...prev,
                                          [inv.inventoryId]: e.target.value,
                                        }))
                                      }
                                      className='h-[35px] w-full rounded border border-[#d7d8e0] px-3 text-[14px] font-semibold text-[#19191c] outline-none focus:border-[#23a956] focus:border-2'
                                    />
                                    <span className='absolute right-3 text-[14px] font-semibold text-[#19191c]'>
                                      {stockTakingUnit?.name ||
                                        item?.stockTakingUnit?.name ||
                                        ''}
                                    </span>
                                  </div>
                                  <span className='block text-[12px] italic text-[#6b6b6f] mt-2'>
                                    ({formatPrice(stuPrice)} /{' '}
                                    {stockTakingUnit?.name ||
                                      item?.stockTakingUnit?.name ||
                                      ''}
                                    )
                                  </span>
                                </td>

                                {/* updated total value */}
                                <td
                                  className={`px-5 py-[14px] text-right text-[14px] font-semibold text-[#000] border-r border-[#dee2e6] bg-[#f4faf6] ${!isLast ? 'border-b border-[#dee2e6]' : ''}`}
                                >
                                  {formatPrice(updatedTotal)}
                                </td>

                                {/* Remove from inventory */}
                                <td
                                  className={`px-5 py-[14px] text-center ${!isLast ? 'border-b border-[#dee2e6]' : ''} ${isLast ? 'rounded-br-lg' : ''}`}
                                >
                                  <Checkbox
                                    checked={
                                      !!removeFromInventory[inv.inventoryId]
                                    }
                                    onChange={() =>
                                      setRemoveFromInventory((prev) => ({
                                        ...prev,
                                        [inv.inventoryId]:
                                          !prev[inv.inventoryId],
                                      }))
                                    }
                                  />
                                </td>
                              </tr>
                            );
                          },
                        )
                      )}
                    </tbody>
                  </table>
                  <AppTooltip
                    id='remove-inv-tooltip'
                    place='top'
                    positionStrategy='fixed'
                    style={{
                      borderRadius: 4,
                      fontSize: 13,
                      fontWeight: 300,
                      lineHeight: '16px',
                      maxWidth: 200,
                      padding: '8px',
                      zIndex: 9999,
                    }}
                    content="If checked, the item will be removed after you click the 'Save Changes' button"
                  />
                </div>
              )}
            </section>
          </div>

          {/* Footer */}
          <div className='flex items-center justify-between border-t border-[#E7E7EC] px-12 py-[14px]'>
            <WhiteButton
              onClick={() => setShowCancelConfirm(true)}
              className='px-3 py-[6px] text-sm'
            >
              Cancel
            </WhiteButton>

            <GreenButton
              disabled={isSaving}
              className='px-3 py-[6px] text-sm'
              onClick={() => {
                if (!name.trim()) {
                  setTouched((p) => ({ ...p, name: true }));
                  return;
                }

                saveTemplate({
                  id: item.id,
                  payload: {
                    name: name.trim(),
                    sku: sku || undefined,
                    durabilityDays: durabilityDays ? Number(durabilityDays) : 0,
                    purchaseUnitId: purchaseUnit?.id || undefined,
                    stockTakingUnitId: stockTakingUnit?.id || undefined,
                    baseMeasurementUnitId: bmu?.id || undefined,
                    stockTakingQuantityPerPurchaseUnit: puToStu
                      ? Number(puToStu)
                      : undefined,
                    stockTakingQuantityPerBaseMeasurementUnit: stuToBmu
                      ? Number(stuToBmu)
                      : undefined,
                    subparLevel: subparLevel ? Number(subparLevel) : '',
                    pricePerPurchaseUnit: computedCosts?.puCost ?? undefined,
                    pricePerStockTakingUnit:
                      computedCosts?.stuCost ?? undefined,
                    pricePerBaseUnit: computedCosts?.bmuCost ?? undefined,
                    productGroupId:
                      subcategory?.id || category?.id || undefined,
                    affectedItems: (itemDetail?.existInventoryList || []).map(
                      (inv) => ({
                        inventoryId: inv.inventoryId,
                        storeProductExpirationDateIds:
                          inv.storeProductExpirationDateIds,
                        storeProductItemsIds: inv.storeProductItemsIds,
                        totalQty:
                          parseFloat(
                            affectedQuantities[inv.inventoryId] ?? inv.totalQty,
                          ) || 0,
                        isRemoveFromInventory:
                          !!removeFromInventory[inv.inventoryId],
                      }),
                    ),
                  },
                });
              }}
            >
              {isSaving ? 'Saving...' : 'Save item template'}
            </GreenButton>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={showCancelConfirm}
        onClose={() => setShowCancelConfirm(false)}
        onConfirm={() => {
          setShowCancelConfirm(false);
          handleClose();
        }}
        confirmLabel='Discard'
        cancelLabel='Cancel'
      />
    </div>
  );
}
