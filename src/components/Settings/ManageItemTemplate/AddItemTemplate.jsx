import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Tooltip } from 'react-tooltip';

import GreenButton from '../../Common/GreenButton';
import WhiteButton from '../../Common/WhiteButton';
import FormInput from '../../Common/FormInput';
import ConfirmModal from '../../Common/ConfirmModal';
import CategoryDropdown from './common/CategoryDropdown';
import SubcategoryDropdown from './common/SubcategoryDropdown';
import AllUnitDropdown from './common/AllUnitsDropdown';
import { fetchMeasurementUnits } from '../../../services/masterDataService';
import { createItemTemplate } from '../../../services/manageItemTemplateService';
import { formatPrice } from '../../../utils/format';

export default function AddItemTemplateModal({ isOpen, onClose, onSuccess }) {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [category, setCategory] = useState(null);
  const [subcategory, setSubcategory] = useState(null);
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [durabilityDays, setDurabilityDays] = useState('');
  const [purchaseUnit, setPurchaseUnit] = useState(null);
  const [stockTakingUnit, setStockTakingUnit] = useState(null);
  const [puToStu, setPuToStu] = useState('');
  const [stuToBmu, setStuToBmu] = useState('');
  const [bmu, setBmu] = useState(null);
  const [subparLevel, setSubparLevel] = useState('');
  const [cost, setCost] = useState('');
  const [costUnit, setCostUnit] = useState(null);

  const [touched, setTouched] = useState({ name: false });
  const [touchedConversions, setTouchedConversions] = useState({
    puToStu: false,
    stuToBmu: false,
  });
  const [focusedField, setFocusedField] = useState('name');
  const [touchedCost, setTouchedCost] = useState(false); // auto-focus on open

  const queryClient = useQueryClient();

  const { data: units } = useQuery({
    queryKey: ['measurementUnits'],
    queryFn: fetchMeasurementUnits,
    staleTime: Infinity,
  });

  const { mutate: saveTemplate, isLoading: isSaving } = useMutation({
    mutationFn: createItemTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['itemTemplates'] });
      onSuccess?.(name);
      handleClose();
    },
  });

  if (!isOpen) return null;

  function handleClose() {
    setName('');
    setSku('');
    setDurabilityDays('');
    setCategory(null);
    setSubcategory(null);
    setPurchaseUnit(null);
    setStockTakingUnit(null);
    setPuToStu('');
    setStuToBmu('');
    setBmu(null);
    setSubparLevel('');
    setCost('');
    setCostUnit(null);

    setTouchedCost(false);
    setTouched({ name: false });
    setTouchedConversions({ puToStu: false, stuToBmu: false });
    setFocusedField(null);

    onClose();
  }

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

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'>
      <div className='h-[calc(100vh-48px)] w-[75%] rounded-lg bg-white shadow-lg'>
        <div className='flex h-full flex-col'>
          {/* Header */}
          <div className='flex items-center border-b border-[#E7E7EC] px-12 py-6'>
            <h2 className='w-full text-[18px] font-semibold text-[#19191C]'>
              Add item template
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
                Basic item info
              </h3>

              {/* Row 1: Item Name + SKU */}

              {/* ITEM */}
              <div className='grid grid-cols-12 gap-4 mb-2'>
                <div className='col-span-8'>
                  <div className='mb-2'>
                    <label className='mb-1 flex text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6B6B6F]'>
                      Item Name
                      <span className='ml-1 text-[#e2232e] text-[12px]'>*</span>
                    </label>

                    <FormInput
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
                </div>

                {/* SKU */}
                <div className='col-span-4'>
                  <div className='mb-2'>
                    <label className='mb-1 block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6B6B6F]'>
                      SKU
                    </label>

                    <FormInput
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      className='col-span-4'
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Category + Subcategory + Durability Days */}
              <div className='grid grid-cols-12 gap-4 mt-3'>
                {/* CATEGORY */}

                <div className='col-span-4'>
                  <div className='mb-2'>
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
                </div>

                {/* SUBCATEGORY */}
                <div className='col-span-4'>
                  <div className='mb-2'>
                    <label className='mb-1 block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6B6B6F]'>
                      Subcategory
                    </label>
                    <SubcategoryDropdown
                      selected={subcategory}
                      onSelect={setSubcategory}
                      categoryId={category?.id}
                    />
                  </div>
                </div>

                {/* DURABILITY DAYS */}
                <div className='col-span-4'>
                  <div className='mb-2'>
                    <label className='mb-1 block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6B6B6F]'>
                      Durability Days
                    </label>

                    <FormInput
                      type='number'
                      value={durabilityDays}
                      onChange={(e) => setDurabilityDays(e.target.value)}
                      className='col-span-4'
                    />
                    <span className='mt-2 block text-[13px] leading-4 text-[#6b6b6f]'>
                      Maximum recommended storage days before the item may
                      spoil.
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ UNITS SECTION  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  */}

            <section className='pb-[60px] border-b border-[#e7e7ec]'>
              <h3 className='mb-1 text-[20px] font-semibold leading-7 tracking-[-0.01em] text-[#19191C]'>
                Units
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
                Conversions
              </h3>

              <div className='grid grid-cols-12 gap-4'>
                {/* Col 1: Purchase → Stocktaking */}
                <div className='col-span-4'>
                  <p className='mb-6 text-[14px] font-semibold leading-5 text-[#19191c]'>
                    Purchase unit to stocktaking unit
                  </p>
                  <div className='mb-2'>
                    <label className='mb-1 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6B6B6F]'>
                      1 {purchaseUnit ? purchaseUnit.name : 'purchase unit'}
                      {purchaseUnit && stockTakingUnit && (
                        <span className='text-[#e2232e] text-[12px]'>*</span>
                      )}
                      =
                    </label>

                    <FormInput
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
                          This field is required
                        </span>
                      )}

                    {purchaseUnit && !stockTakingUnit && (
                      <div
                        className='mt-[10px] w-full rounded px-4 py-3 mb-5 inline-flex font-semibold text-[14px] leading-[18px]'
                        style={{ background: '#f2f1ff', color: '#362a96' }}
                      >
                        Stocktaking unit not defined yet
                      </div>
                    )}

                    {!purchaseUnit && !stockTakingUnit && (
                      <div
                        className='mt-[10px] w-full rounded px-4 py-3 mb-5 inline-flex font-semibold text-[14px] leading-[18px]'
                        style={{ background: '#f2f1ff', color: '#362a96' }}
                      >
                        Both units not defined yet
                      </div>
                    )}
                  </div>
                </div>

                {/* Col 2: Stocktaking → BMU */}

                {!(stockTakingUnit && bmu && stockTakingUnit.id === bmu.id) && (
                  <div className='col-span-4'>
                    <p className='mb-6 text-[14px] font-semibold leading-5 text-[#19191c]'>
                      Stocktaking unit to basic measurement unit
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

                      <FormInput
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
                      {!stockTakingUnit && !bmu && (
                        <div
                          className='mt-[10px] w-full rounded px-4 py-3 mb-5 inline-flex font-semibold text-[14px] leading-[18px]'
                          style={{ background: '#f2f1ff', color: '#362a96' }}
                        >
                          Both units not defined yet
                        </div>
                      )}
                      {stockTakingUnit && !bmu && (
                        <div
                          className='mt-[10px] w-full rounded px-4 py-3 mb-5 inline-flex font-semibold text-[14px] leading-[18px]'
                          style={{ background: '#f2f1ff', color: '#362a96' }}
                        >
                          Basic measurement unit not defined yet
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
                  Subpar level
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
                <Tooltip
                  id='subpar-tooltip'
                  place='bottom'
                  html={true}
                  style={{
                    backgroundColor: '#333',
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
                  <FormInput
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
                Cost
              </h3>

              <div className='flex items-start gap-0'>
                {/* Cost input */}
                <div className='w-[25%]'>
                  <FormInput
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

              {/* Cost per unit overview card */}
              {computedCosts && (
                <div className='mt-4 w-[65%] rounded-lg bg-[#f7f7f9] p-5'>
                  <h3 className='text-[16px] font-semibold leading-5 text-[#19191c]'>
                    Cost per unit overview
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
                  name: name.trim(),
                  sku: sku || undefined,
                  durabilityDays: durabilityDays
                    ? Number(durabilityDays)
                    : undefined,
                  purchaseUnitId: purchaseUnit?.id || undefined,
                  stockTakingUnitId: stockTakingUnit?.id || undefined,
                  baseMeasurementUnitId: bmu?.id || undefined,
                  stockTakingQuantityPerPurchaseUnit: puToStu
                    ? Number(puToStu)
                    : undefined,
                  stockTakingQuantityPerBaseMeasurementUnit: stuToBmu
                    ? Number(stuToBmu)
                    : undefined,
                  subparLevel: subparLevel ? Number(subparLevel) : undefined,
                  pricePerPurchaseUnit: computedCosts?.puCost ?? undefined,
                  pricePerStockTakingUnit: computedCosts?.stuCost ?? undefined,
                  pricePerBaseUnit: computedCosts?.bmuCost ?? undefined,
                  // costUnit: costUnit?.role || undefined,
                  productGroupId: category?.id || undefined,
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
        title='Discard unsaved changes?'
        confirmLabel='Discard'
        cancelLabel='Cancel'
      />
    </div>
  );
}
