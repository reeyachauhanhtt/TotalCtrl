import { useState } from "react";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns";

import { fetchPurchaseTotal } from "../../../services/purchasesService";
import { formatPrice } from "../../../utils/format";
import { getPersistedDateRange } from "../../../utils/analyticsDateRange";
import GreenButton from "../../../components/Common/GreenButton";
import MonthPicker from "../common/MonthPicker";
import ExportButton from "../common/ExportButton";
import BiggestOrders from "./BiggestOrders";
import BiggestSuppliers from "./BiggestSuppliers";
import PriceVariations from "./PriceVariations";
import { SkeletonBar } from "../../Common/Skeleton";

export default function Purchases() {
  const persisted = getPersistedDateRange("analytics_date_range_purchases");
  const [dateRange, setDateRange] = useState({
    fromDate:
      persisted?.fromDate ??
      format(startOfMonth(subMonths(new Date(), 1)), "yyyy-MM-dd"),
    toDate:
      persisted?.toDate ??
      format(endOfMonth(subMonths(new Date(), 1)), "yyyy-MM-dd"),
    label: persisted?.label ?? "Last Month",
  });

  const inventoryId = useSelector((s) => s.analytics.selectedInventory?.id);
  const navigate = useNavigate();

  const { data: totalData, isLoading: isTotalLoading } = useQuery({
    queryKey: [
      "purchaseTotal",
      inventoryId,
      dateRange.fromDate,
      dateRange.toDate,
    ],
    queryFn: () =>
      fetchPurchaseTotal({
        inventoryId,
        fromDate: dateRange.fromDate,
        toDate: dateRange.toDate,
      }),
    enabled: !!inventoryId && !!dateRange.fromDate && !!dateRange.toDate,
    staleTime: 0,
    gcTime: 0,
  });

  const purchaseValue = totalData?.Data?.purchaseValue?.[0];
  const totalDisplay = purchaseValue
    ? `${formatPrice(purchaseValue.totalPurchases)}`
    : "0 kr";

  const isEmpty =
    !isTotalLoading &&
    (!totalData || totalData?.Data?.purchaseValue?.[0]?.totalPurchases === 0);

  function handleDateApply({ startDate, endDate, label }) {
    setDateRange({ fromDate: startDate, toDate: endDate, label });
  }
  console.log(
    "isEmpty:",
    isEmpty,
    "totalData:",
    totalData,
    "inventoryId:",
    inventoryId,
    "dateRange:",
    dateRange
  );

  return (
    <div className="px-8.75 pb-15 pr-10">
      {/* Header */}
      <div className="flex justify-between items-start mt-9.5">
        <div>
          <span className="text-[20px] font-semibold text-[#19191c] tracking-[-0.01em] leading-7">
            Purchases
          </span>
        </div>
        <div className="flex items-center gap-5 px-20">
          <ExportButton disabled={isEmpty} />
          <MonthPicker
            fromDate={dateRange.fromDate}
            toDate={dateRange.toDate}
            label={dateRange.label}
            onApply={handleDateApply}
            storageKey="analytics_date_range_purchases"
          />
        </div>
      </div>

      {/* Empty state */}
      {isEmpty && (
        <div className="h-125 w-full flex flex-col justify-center items-center">
          <img
            src="/icons/PurchaseIllustration.svg"
            alt=""
            style={{ height: 108, width: 151 }}
          />
          <span className="text-[24px] font-semibold text-[#19191c] tracking-[-0.01em] leading-8 text-center mt-6">
            No orders found
          </span>
          <div className="flex justify-center mt-4 mb-4 w-2/3">
            <ul className="text-[16px] text-[#97979b] text-center font-normal tracking-[-0.16px]">
              <li>
                We can't show any useful information without orders. Please add
                a
              </li>
              <li>new one using the button below.</li>
            </ul>
          </div>
          <div className="mt-4">
            <GreenButton onClick={() => navigate("/external-orders")}>
              <img src="/icons/upload.svg" alt="" width={20} height={20} />
              <span>Add order with receipt</span>
            </GreenButton>
          </div>
        </div>
      )}

      {/* Data content — always mounted for API calls, hidden when empty */}
      <div className={!isTotalLoading && isEmpty ? "hidden" : ""}>
        <div className="mb-10">
          <label className="block text-[12px] font-bold uppercase tracking-[0.08em] text-[#6b6b6f] mt-12 mb-4">
            Total Purchases
          </label>

          {isTotalLoading ? (
            <SkeletonBar style={{ height: 56, width: 320, borderRadius: 12 }} />
          ) : (
            <label className="block text-[64px] font-medium text-[#19191c] leading-16 tracking-[-0.01em]">
              {totalDisplay}
            </label>
          )}
        </div>

        <div className="flex w-[95%] mt-0">
          <BiggestOrders inventoryId={inventoryId} dateRange={dateRange} />
          <BiggestSuppliers inventoryId={inventoryId} dateRange={dateRange} />
        </div>

        <div className="mt-15">
          <PriceVariations inventoryId={inventoryId} dateRange={dateRange} />
        </div>
      </div>
    </div>
  );
}
