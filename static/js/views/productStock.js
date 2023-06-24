'use strict'

const productModel = new Product();// eslint-disable-line no-undef
const stockModel = new Stock();// eslint-disable-line no-undef
const productStockModel = new ProductStock();// eslint-disable-line no-undef

function initAddForm () {
  const productSelect = window.jQuery('#product')
  const stockSelect = window.jQuery('#stock')

  const products = productModel.Select()
  products.forEach(product => {
    productSelect.append('<option value="' + product.code + '">' + product.code + '</option>')
  })

  const stocks = stockModel.Select()
  stocks.forEach(stock => {
    stockSelect.append('<option value="' + stock.number + '">' + stock.number + '</option>')
  })

  const form = window.jQuery('#productStock-add-form')
  form.on('submit', function (e) {
    e.preventDefault()
    
    const formData = new FormData(e.target)
    const productStockData = {}
    formData.forEach((value, key) => {
      productStockData[key] = value
    })

    productStockModel.Create(productStockData)

    e.target.reset()
  })
}


function initList () {
  window.jQuery('#productStock-list').DataTable({
    data: productStockModel.Select(),
    columns: [
      { title: 'Stock', data: 'stock' },
      { title: 'Product', data: 'product' },
      {
        title: 'Action',
        data: null,
        orderable: false,
        searchable: false,
        render: function (data, type, row, meta) {
          const transferButton = '<button type="button" class="btn btn-primary btn-sm transfer-productStock" data-id="' + row.id + '">Transfer</button>';
          const deleteButton = '<button type="button" class="btn btn-danger btn-sm delete-productStock" data-id="' + row.id + '">Delete</button>';
          return transferButton + '&nbsp;&nbsp;' + deleteButton;
        }
      }
    ]
  })
}

function initListEvents () {
  window.jQuery('#productStock-list').on('click', '.delete-productStock', function (e) {
    const productStockId = window.jQuery(this).data('id')
    productStockModel.Delete(productStockId)
  })

  window.jQuery('#productStock-list').on('click', '.transfer-productStock', function (e) {
    const productStockId = window.jQuery(this).data('id')
    const productStock = productStockModel.FindById(productStockId)

    const currentStock = stockModel.Select().find(stock => stock.number === productStock.stock)
    const currentShop = currentStock.shop

    const newStockNumber = window.prompt('Enter a new stock number:', productStock.stock)
    const newStock = stockModel.Select().find(stock => stock.number === newStockNumber)
    if (!newStock){
      window.alert('The stock does not exist')
      return
    }
    const newShop = newStock.shop

    if (currentShop !== newShop) {
      window.alert('The stocks belong to different shops. Transfer is not allowed.')
      return
    }

    productStockModel.Update(productStockId, {stock : newStockNumber, product : productStock.product})
  })

  document.addEventListener('productStocksListDataChanged', function (e) {
    const dataTable = window.jQuery('#productStock-list').DataTable()

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
