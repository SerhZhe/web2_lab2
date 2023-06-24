'use strict'

const stockModel = new Stock() // eslint-disable-line no-undef
const productStockModel = new ProductStock() // eslint-disable-line no-undef
const shopModel = new Shop() // eslint-disable-line no-undef

function initAddForm () {
  const form = window.document.querySelector('#stock-add-form')
  form.addEventListener('submit', function (e) {
    e.preventDefault()

    const formData = new FormData(e.target)
    const stockData = {}
    formData.forEach((value, key) => {
      stockData[key] = value
    })
    
    const stocks = stockModel.Select()
    const shops = shopModel.Select()
    const isNumberExist = stocks.some(stock => stock.number === stockData.number)
    const isShopExist = shops.some(shop => shop.name === stockData.shop)

    if (!isNumberExist && isShopExist) {
      stockModel.Create(stockData)
      e.target.reset()
      initList()
    } else {
      if (isNumberExist) {
        alert('Number already exists!')
      }
      if (!isShopExist) {
        alert('Shop does not exist!')
      }
    }
  })
}

function calculateStockCapacities() {
  const stocks = stockModel.Select();
  const productStocks = productStockModel.Select();

  const stockCapacities = stocks.map((stock) => {
    const productsInStock = productStocks.filter(
      (pw) => pw.stock === stock.number
    );
    const totalUsedCapacity = productsInStock.length;
    const usedCapacityPercent = Math.round(
      (totalUsedCapacity / stock.capacity) * 100
    );

    const capacityStatusClass =
      usedCapacityPercent < 20 ? "bg-danger" : "";

    return {
      ...stock,
      totalCapacity: stock.capacity,
      totalUsedCapacity: totalUsedCapacity,
      usedCapacityPercent: `<span class="${capacityStatusClass}">${usedCapacityPercent}%</span>`,
    };
  });
  
  return stockCapacities;
}

function initList() {
  const stockCapacities = calculateStockCapacities();

  const $dataTable = window.jQuery("#stock-list");
  
  if ($.fn.dataTable.isDataTable($dataTable)) {
    $dataTable.DataTable().destroy();
  }

  $dataTable.DataTable({
    data: stockCapacities,
    columns: [
      { title: "Number", data: "number" },
      { title: "Shop", data: "shop" },
      { title: "Capacity", data: "capacity" },
      {
        title: "Used Capacity",
        data: null,
        render: function (data, type, row, meta) {
          const capacityStatusClass =
            row.usedCapacityPercent < 20 ? "bg-danger" : "";
          return `<span class="${capacityStatusClass}">${row.usedCapacityPercent}</span>`;
        },
      },      
      {
        title: "Action",
        data: null,
        orderable: false,
        searchable: false,
        render: function (data, type, row, meta) {
          const editButton = `<button type="button" class="btn btn-primary btn-sm edit-stock" data-id="${row.id}">Edit</button>`;
          const deleteButton = `<button type="button" class="btn btn-danger btn-sm delete-stock" data-id="${row.id}">Delete</button>`;
          return `${editButton}&nbsp;&nbsp;${deleteButton}`;
        },
      },
    ],    
  });
}

function initListEvents () {
  window.jQuery('#stock-list').on('click', '.delete-stock', function (e) {
    const stockId = window.jQuery(this).data('id')
    stockModel.Delete(stockId)
  })

  window.jQuery('#stock-list').on('click', '.edit-stock', function (e) {
    const stockId = window.jQuery(this).data('id')
    const stock = stockModel.FindById(stockId)

    if (stock) {
      const number = window.prompt('Enter a new number', stock.number)
      const shop = window.prompt('Enter a new shop', stock.shop)
      const capacity = window.prompt('Enter a new capacity', stock.capacity)

      if (shop !== null && capacity !== null) {
        const stocks = stockModel.Select()
        const shops = shopModel.Select()
        const isNumberExist = stocks.some(w => w.number === number && w.id !== stockId)
        const isShopExist = shops.some(s => s.name === shop)

        if (!isNumberExist && isShopExist) {
          stockModel.Update(stockId, { number, shop, capacity })
        } else {
          if (isNumberExist) {
            alert('Number already exists!')
          }
          if (!isShopExist) {
            alert('Shop does not exist!')
          }
        }
      }
    }
  })

  document.addEventListener('stocksListDataChanged', function (e) {
    const dataTable = window.jQuery('#stock-list').DataTable()

    dataTable.clear()
    dataTable.rows.add(e.detail)
    dataTable.draw()
  }, false)
}

window.addEventListener('DOMContentLoaded', e => {
  initAddForm()
  initList()
  initListEvents()
})
