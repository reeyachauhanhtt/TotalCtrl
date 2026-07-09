import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { formatPrice } from '../../../utils/format';
import WasteCauseProgressBar from './WasteCauseProgressBar';
import OtherReasonTooltip from './OtherReasonTooltip';
import OtherReasonModal from './OtherReasonPopModal';
import { fetchOtherReasonLineItems } from '../../../services/foodWasteService';
import { SkeletonBar } from '../../Common/Skeleton';

const CAUSE_LABELS = {
  expiration: 'Expiration',
  bad_quality: 'Bad quality',
  damaged: 'Damaged',
  other_reason: 'Other reason',
};

export default function FoodWasteByCause({
  causes,
  inventoryId,
  fromDate,
  toDate,
  dateLabel,
  isLoading = false,
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [fetchDetails, setFetchDetails] = useState(false);

  const { data: lineItemsData } = useQuery({
    queryKey: ['foodWaste-other-reason', inventoryId, fromDate, toDate],
    queryFn: () => fetchOtherReasonLineItems({ inventoryId, fromDate, toDate }),
    enabled: fetchDetails && !!inventoryId && !!fromDate && !!toDate,
    select: (res) => res.Data,
  });

  const otherCause = (causes ?? []).find((c) => c.key === 'other_reason');
  const otherTotal =
    otherCause?.otherReasons?.reduce((sum, r) => sum + r.foodWasteValue, 0) ||
    0;

  const tooltipReasons = (otherCause?.otherReasons ?? []).map((r) => ({
    label: r.label,
    value: formatPrice(r.foodWasteValue),
    percent:
      otherTotal > 0 ? +((r.foodWasteValue / otherTotal) * 100).toFixed(1) : 0,
  }));

  const modalData = {
    totalLogs:
      lineItemsData?.itemCount ??
      otherCause?.otherReasons?.reduce((sum, r) => sum + r.lineCount, 0) ??
      0,
    totalValue: lineItemsData?.totalWasteValue ?? otherCause?.value ?? 0,
    dateLabel: dateLabel ?? '',
    insightName: otherCause?.otherReasons?.[0]?.label ?? '',
    insightText: `account for ${otherCause?.otherReasons?.[0]?.foodWastePercentage?.toFixed(1)}% of all 'other' waste. Export the full log to see exact dates and items.`,
    reasons: (otherCause?.otherReasons ?? []).map((r) => ({
      label: r.label,
      value: r.foodWasteValue,
      percent:
        otherTotal > 0
          ? +((r.foodWasteValue / otherTotal) * 100).toFixed(1)
          : 0,
      logs: r.lineCount,
    })),
  };
  return (
    <div style={{ width: '50%' }}>
      <span
        className='block w-full font-semibold text-[#19191c]'
        style={{
          margin: '24px 0',
          fontSize: 18,
          lineHeight: '24px',
          letterSpacing: '-0.01em',
        }}
      >
        Food waste by cause
      </span>

      <div>
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} style={{ width: '85%', marginTop: 10 }}>
                <div className='flex justify-between'>
                  <SkeletonBar
                    style={{ height: 20, width: 100, borderRadius: 20 }}
                  />
                  <SkeletonBar
                    style={{ height: 20, width: 100, borderRadius: 20 }}
                  />
                </div>
                <SkeletonBar
                  style={{
                    height: 12,
                    width: '100%',
                    borderRadius: 20,
                    marginTop: 10,
                  }}
                />
              </div>
            ))
          : (causes ?? []).map((cause) => (
              <div key={cause.key} style={{ width: '85%', marginTop: 25 }}>
                <div className='flex justify-between'>
                  <span
                    className='flex items-center text-[#19191c]'
                    style={{
                      fontWeight: 400,
                      fontSize: 14,
                      lineHeight: '20px',
                    }}
                  >
                    {CAUSE_LABELS[cause.key]} (
                    {cause.percent ? cause.percent.toFixed(2) : '0'}%)
                    {cause.key === 'other_reason' && cause.value > 0 && (
                      <span
                        style={{
                          position: 'relative',
                          display: 'inline-flex',
                          alignItems: 'center',
                          marginLeft: 6,
                          verticalAlign: 'middle',
                        }}
                        onMouseEnter={() => setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                      >
                        <img
                          src={
                            showTooltip
                              ? '/icons/info-green.svg'
                              : '/icons/info.svg'
                          }
                          alt='info'
                          style={{ width: 18, height: 18, cursor: 'pointer' }}
                        />

                        {showTooltip && (
                          <OtherReasonTooltip
                            reasons={tooltipReasons}
                            onSeeDetails={() => {
                              setFetchDetails(true);
                              setShowModal(true);
                            }}
                          />
                        )}
                      </span>
                    )}
                  </span>

                  <span
                    className='text-[#19191c]'
                    style={{
                      fontWeight: 400,
                      fontSize: 14,
                      lineHeight: '20px',
                    }}
                  >
                    {formatPrice(cause.value ?? 0)}
                  </span>
                </div>

                <div style={{ marginTop: 15 }}>
                  <WasteCauseProgressBar
                    cause={cause.key}
                    percent={cause.percent ?? 0}
                  />
                </div>
              </div>
            ))}
      </div>

      {showModal && (
        <OtherReasonModal
          data={modalData}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
