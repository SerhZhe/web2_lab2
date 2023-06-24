'use strict'

const productModel = new Product() // eslint-disable-line no-undef

function initAddForm () {
  const form = window.document.querySelector('#product-add-form')
  form.addEventListener('submit', function (e) {
    e.preventDefault()

    const formData = new FormData(e.target)
    const productData = {}
    formData.forEach((value, key) => {
      productData[key] = value
    })
    
    const existingProduct = productModel.Select().find(product => product.code === productData.code)
    if (existingProduct) {
      alert('Code already exists!')
      return
    }

    productModel.Create(productData)

    e.target.reset()
  })
}

function initList () {
  window.jQuery('#product-list').DataTable({
    data: productModel.Select(),
    columns: [
      { title: 'Code', data: 'code' },
      { title: 'Name', data: 'name' },
      { title: 'Country', data: 'country' },
      {
        title: 'Action',
        data: null,
        orderable: false,
        searchable: false,
        render: function (data, type, row, meta) {
          const editButton = '<button type="button" class="btn btn-primary btn-sm edit-product" data-id="' + row.id + '">Edit</button>';
          const deleteButton = '<button type="button" class="btn btn-danger btn-sm delete-product" data-id="' + row.id + '">Delete</button>';
          return editButton + '&nbsp;&nbsp;' + deleteButton;
        }
      }
    ]
  })
}

function initListEvents () {
  window.jQuery('#product-list').on('click', '.delete-product', function (e) {
    const productId = window.jQuery(this).data('id')
    productModel.Delete(productId)
  })
  
  window.jQuery('#product-list').on('click', '.edit-product', function (e) {
    const productId = window.jQuery(this).data('id')
    const product = productModel.FindById(productId)

    if (product) {
      const code = window.prompt('Enter a new code', product.code)
      const name = window.prompt('Enter a new name', product.name)
      const country = window.prompt('Enter a new country', product.country)

      if (name !== null && country !== null && code !== null) {
        const existingProduct = productModel.Select().find(p => p.code === code && p.id !== productId)
        if (existingProduct) {
          window.alert(`Code '${code}' already exists. Please enter a different code.`)
        } else {
          productModel.Update(productId, { code: code, name: name, country: country })
        }
      }
    }
  })

  document.addEventListener('productsListDataChanged', function (e) {
    const dataTable = window.jQuery('#product-list').DataTable()

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
