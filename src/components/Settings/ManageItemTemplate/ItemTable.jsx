import { useState } from "react";
import ItemRow from "./ItemRows";

const DUMMY_ITEMS = [
  {
    id: 1,
    name: "TESTTTTT product",
    sku: "",
    purchaseUnit: { name: "Carton", sub: "(10 Boxes)", price: "40,00 kr" },
    stockTakingUnit: { name: "Box", sub: "(10 Pieces)", price: "4,00 kr" },
    basicMeasUnit: { name: "Piece", price: "0,40 kr" },
    category: "Other",
    subcategory: "-----",
    durabilityDays: "----",
    inStock: [],
    isDuplicate: false,
  },
  {
    id: 2,
    name: "Testtt Product",
    sku: "",
    purchaseUnit: { name: "Carton", sub: "(5 Boxes)", price: "400,00 kr" },
    stockTakingUnit: { name: "Box", sub: "(10 Pieces)", price: "80,00 kr" },
    basicMeasUnit: { name: "Piece", price: "8,00 kr" },
    category: "Other",
    subcategory: "-----",
    durabilityDays: "----",
    inStock: ["Empty Inv 21"],
    isDuplicate: false,
  },
  {
    id: 3,
    name: "testststtstttt",
    sku: "tetste12121",
    purchaseUnit: { name: "Piece", sub: "", price: "47,00 kr" },
    stockTakingUnit: { name: "Piece", sub: "", price: "47,00 kr" },
    basicMeasUnit: { name: "-----" },
    category: "Other",
    subcategory: "-----",
    durabilityDays: "----",
    inStock: [],
    isDuplicate: false,
  },
  {
    id: 4,
    name: "Testing1",
    sku: "",
    purchaseUnit: { name: "Basket", sub: "(10 Bags)", price: "0,00 kr" },
    stockTakingUnit: { name: "Bag", sub: "(10 Grams)", price: "" },
    basicMeasUnit: { name: "Gram" },
    category: "Other",
    subcategory: "-----",
    durabilityDays: "----",
    inStock: ["Main Inventory", "Pinkesh Inventory"],
    isDuplicate: false,
  },
  {
    id: 5,
    name: "Testing 2",
    sku: "",
    purchaseUnit: {
      name: "BIB Carton",
      sub: "(2 Baskets)",
      price: "100,00 kr",
    },
    stockTakingUnit: {
      name: "Basket",
      sub: "(10 Kilograms)",
      price: "50,00 kr",
    },
    basicMeasUnit: { name: "Kilogram" },
    category: "Other",
    subcategory: "-----",
    durabilityDays: "----",
    inStock: [],
    isDuplicate: false,
  },
  {
    id: 6,
    name: "SPORT+ WASA",
    sku: "",
    purchaseUnit: { name: "Piece", sub: "", price: "0,00 kr" },
    stockTakingUnit: { name: "Piece", sub: "", price: "" },
    basicMeasUnit: { name: "Piece" },
    category: "Other",
    subcategory: "-----",
    durabilityDays: "----",
    inStock: [],
    isDuplicate: true,
    duplicateProducts: [
      {
        id: "dup-6-1",
        name: "SPORT+ WASA",
        sku: "5588",
        purchaseUnit: "Piece",
        purchasePrice: "202,08 kr",
        stockTakingUnit: "Piece",
        stockPrice: "202,08 kr",
        category: "Other",
        inStock: ["Sweety Inventory"],
      },
    ],
  },
  {
    id: 7,
    name: "Søtpotet fries",
    sku: "",
    purchaseUnit: { name: "Bag", sub: "", price: "175,00 kr" },
    stockTakingUnit: { name: "Bag", sub: "(1 Kilogram)", price: "175,00 kr" },
    basicMeasUnit: { name: "Kilogram" },
    category: "Other",
    subcategory: "-----",
    durabilityDays: "----",
    inStock: [],
    isDuplicate: false,
  },
  {
    id: 8,
    name: "Poiuytrrkmk",
    sku: "569874LKJ",
    purchaseUnit: { name: "Kilogram", sub: "", price: "60,00 kr" },
    stockTakingUnit: { name: "Kilogram", sub: "", price: "60,00 kr" },
    basicMeasUnit: { name: "-----" },
    category: "Other",
    subcategory: "-----",
    durabilityDays: "----",
    inStock: ["Empty inventory"],
    isDuplicate: false,
  },
  {
    id: 9,
    name: "Manish Testing Product",
    sku: "",
    purchaseUnit: { name: "Bottle", sub: "", price: "80,00 kr" },
    stockTakingUnit: { name: "Bottle", sub: "", price: "80,00 kr" },
    basicMeasUnit: { name: "-----" },
    category: "Other",
    subcategory: "-----",
    durabilityDays: "----",
    inStock: [],
    isDuplicate: false,
  },
  {
    id: 10,
    name: "Manish Testing Filter",
    sku: "",
    purchaseUnit: { name: "BIB Carton", sub: "", price: "6,50 kr" },
    stockTakingUnit: { name: "BIB Carton", sub: "", price: "6,50 kr" },
    basicMeasUnit: { name: "-----" },
    category: "Other",
    subcategory: "-----",
    durabilityDays: "----",
    inStock: [],
    isDuplicate: false,
  },
];

const HEADERS = [
  {
    label: "Item name",
    key: "name",
    active: true,
    minWidth: "300px",
    width: "38%",
  },
  { label: "SKU", key: "sku", center: true, width: "8%" },
  {
    label: "Purchase Unit",
    key: "purchaseUnit",
    width: "7%",
    minWidth: "60px",
  },
  { label: "Stocktaking Unit", key: "stockTakingUnit", width: "7%" },
  {
    label: "Basic Meas. Unit",
    key: "basicMeasUnit",
    width: "7%",
    minWidth: "70px",
  },
  {
    label: "Category And Subcategory",
    key: "category",
    width: "12%",
    minWidth: "85px",
  },
  { label: "Durability Days", key: "durabilityDays", width: "8%" },
  { label: "In Stock", key: "inStock", width: "15%", minWidth: "150px" },
];

export default function ItemTable() {
  const [checkedIds, setCheckedIds] = useState([]);
  const [sortKey, setSortKey] = useState("name");
  const [sortAsc, setSortAsc] = useState(true);

  const allChecked = checkedIds.length === DUMMY_ITEMS.length;

  function toggleAll() {
    setCheckedIds(allChecked ? [] : DUMMY_ITEMS.map((i) => i.id));
  }

  function toggleOne(id) {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function handleSort(key) {
    if (sortKey === key) setSortAsc((p) => !p);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  }

  return (
    <div className="flex-1 overflow-hidden">
      <div className="h-full overflow-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#fbfbfc]">
              {/* Checkbox */}
              <th
                className="sticky top-[-1px] z-20 text-left align-top border-t border-b border-[#e7e7ec] bg-[#fbfbfc] pl-8"
                style={{
                  minWidth: "62px",
                  height: "64px",
                  paddingTop: "16px",
                  paddingBottom: "16px",
                }}
              >
                <label
                  className="relative block cursor-pointer select-none"
                  style={{ paddingLeft: "20px", marginBottom: 0 }}
                >
                  <input
                    type="checkbox"
                    checked={allChecked}
                    onChange={toggleAll}
                    className="absolute opacity-0 cursor-pointer h-0 w-0"
                  />
                  <span
                    className={`absolute top-0 left-0 rounded h-5 w-5 border ${
                      allChecked
                        ? "bg-[#23a956] border-[#23a956]"
                        : "bg-white border-[#d7d7db]"
                    }`}
                    style={{ borderRadius: "4px" }}
                  >
                    {allChecked && (
                      <span
                        className="absolute border-white"
                        style={{
                          left: "7px",
                          top: "4px",
                          width: "4px",
                          height: "8px",
                          border: "solid white",
                          borderWidth: "0 2px 2px 0",
                          transform: "rotate(45deg)",
                          display: "block",
                        }}
                      />
                    )}
                  </span>
                </label>
              </th>

              {HEADERS.map((h) => (
                <th
                  key={h.key}
                  onClick={() => handleSort(h.key)}
                  className={`sticky top-[-1px] z-20 align-top border-t border-b border-[#e7e7ec] bg-[#fbfbfc] cursor-pointer pl-[10px] pr-3 ${
                    h.center ? "text-center" : "text-left"
                  }`}
                  style={{
                    height: "64px",
                    paddingTop: "16px",
                    paddingBottom: "16px",
                    fontSize: "11px",
                    fontWeight: "600",
                    lineHeight: "16px",
                    letterSpacing: "0.88px",
                    textTransform: "uppercase",
                    width: h.width,
                    minWidth: h.minWidth,
                    color:
                      h.active || sortKey === h.key ? "#23a956" : "#6b6b6f",
                  }}
                >
                  {/* <span className="inline-flex items-start gap-1"> */}
                  {/* <span className="inline">
                    <span>{h.label}</span>
                    <img
                      src={
                        sortKey === h.key
                          ? sortAsc
                            ? "/icons/asc-order-inv-green.svg"
                            : "/icons/desc-order-inv-green.svg"
                          : "/icons/desc-order.svg"
                      }
                      alt=""
                      className="inline-block flex-shrink-0"
                      style={{ marginTop: "2px" }}
                    />
                  </span> */}

                  <span className="flex items-start gap-2">
                    <span>{h.label}</span>
                    <img
                      src={
                        sortKey === h.key
                          ? sortAsc
                            ? "/icons/asc-order-inv-green.svg"
                            : "/icons/desc-order-inv-green.svg"
                          : "/icons/desc-order.svg"
                      }
                      alt=""
                      className="mt-0.5 inline-block align-middle"
                    />
                  </span>
                </th>
              ))}

              {/* Empty last col */}
              <th
                className="sticky top-[-1px] z-20 bg-[#fbfbfc] border-t border-b border-[#e7e7ec] pr-8"
                style={{ height: "64px" }}
              />
            </tr>
          </thead>

          <tbody>
            {DUMMY_ITEMS.map((item) => (
              <ItemRow
                key={item.id}
                item={item}
                checked={checkedIds.includes(item.id)}
                onToggle={() => toggleOne(item.id)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
