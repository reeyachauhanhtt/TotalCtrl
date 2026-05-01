# React + Tailwind Intern Task: Inventory Dashboard

## Objective

Build a **Main Inventory Dashboard UI** using **React.js and Tailwind CSS**, then integrate it with an API to display inventory data.

This assignment evaluates your understanding of:

* React component structure
* Reusable components
* Tailwind CSS styling
* State management
* API integration
* Clean folder structure

---

# Part 1: UI Development

Create a page similar to the **Main Inventory Dashboard**.

---

## 1. Sidebar Navigation

Create a fixed left sidebar with the following menu items:

* Inventories
* External Orders
* Internal Orders
* Analytics
* Inventory Count
* COGS Calculator
* Settings

### Requirements

* Highlight **Inventories** as active
* Icons can be placeholders
* Sidebar should remain fixed on the left side

**Estimated Time:** 45 min

---

## 2. Header Section

Create a header containing:

* Page title: **Inventories**
* Inventory selector dropdown
* Notification icon

Buttons:

* Download CSV
* Transfer Items
* Add Items

**Estimated Time:** 30 min

---

## 3. Summary Section

Display the following summary information:

Items in Stock: 2
Total Stock Value: 13,912.50 kr
Access Type: Editor

**Estimated Time:** 30 minutes

---

## 4. Filters Section

Add filters above the table.

Filters should include:

* Supplier dropdown
* Items dropdown
* Search input

The **search input should filter table data locally**.

**Estimated Time:** 45 min

---

## 5. Inventory Table

Create a table with the following columns:

* Item
* Arrival Info
* Expiration Info
* Quantity
* Unit Price
* Total Value
* Actions

### Actions

* Edit icon
* More options icon

**Estimated Time:** 1.5 hour

---

## 6. Status Badge

Display a badge when an item is out of stock.

Example:

OUT OF STOCK

Style it using **Tailwind CSS**.

---

## 7. Dummy Data

Use static JSON data to populate the inventory table initially.

Example:

```javascript
const inventory = [
  {
    name: "1 L LETTMELK 0,5%",
    quantity: 0,
    unitPrice: "Bundle",
    price: 50,
    currency: "kr", 
    total: 0,
    arraivalInfo: '02-03-2026',
    expirationInfo: '02-03-2026',
    status: "out_of_stock"
  },
  {
    name: "GRØNNSAKSBL JULIENNE",
    quantity: 75,
    unit: "Kilogram",
    unitPrice: 73.5,
    currency: "kr", 
    arraivalInfo: null,
    expirationInfo: null,
    total: 5512.5
  }
];
```

**Estimated Time:** 30 minutes

---

# Part 2: API Integration

After completing the UI using dummy data, integrate the **Inventory Table with API data**.

---


## 1. API Documentation

Use the following Swagger documentation to understand the API structure and response format.

**Swagger URL**

[https://dev.totalctrl.com:2053/api-docs](https://dev.totalctrl.com:2053/api-docs)

**Inventory API Endpoint**

GET https://dev.totalctrl.com:2053/inventory-management/store-products
Use this endpoint to fetch inventory items and display them in the table.

## 2. Create API Service

Create a service file to manage API calls.

### Folder Structure

```
src
 ├─ services
 │   └─ inventoryService.js
```

### Task

* Create a function to fetch inventory data from an API
* Use Axios to make the request
* Export the function so it can be used in the page component

---

## 3. Fetch Inventory Data

Fetch inventory data when the **Inventory page loads**.

### Requirements

* Use `useEffect`
* Store API response using `useState`
* Pass the fetched data to the **InventoryTable component**

---

## 4. Loading State

Show a loading indicator while the API request is in progress.

Example:

Loading inventory data...

---

## 5. Error Handling

Handle API errors properly.

### Requirements

* Display an error message if the request fails
* Log the error in the console

Example:

Failed to load inventory data

---

## 6. Replace Dummy Data

Remove the static dummy data and use **API response data** to populate the inventory table.

---

## 7. Search with API Data

The search input should filter **items received from the API**.

Search should work based on:

* Item Name

---

# Expected Folder Structure

```
src
 ├─ components
 │   ├─ Sidebar.jsx
 │   ├─ Header.jsx
 │   ├─ InventoryFilters.jsx
 │   ├─ InventoryTable.jsx
 │   ├─ InventoryRow.jsx
 │   └─ StatusBadge.jsx
 │
 ├─ pages
 │   └─ InventoryPage.jsx
 │
 ├─ services
 │   └─ inventoryService.js
 │
 └─ data
     └─ inventoryData.js
```

---

# Deliverables

Submit the following:

1. Working React project
2. Clean component structure
3. Tailwind CSS used for styling
4. API integrated with the table

---

# Time Expectation

| Task            | Expected Time |
| --------------- | ------------- |
| UI Development  | 4 – 5 hours  |
| API Integration | 2 – 3 hours  |

### Total Expected Time

**7 – 9 hours**
