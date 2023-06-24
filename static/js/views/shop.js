'use strict'

  const shopModel = new Shop() // eslint-disable-line no-undef

  function initAddForm () {
    const form = window.document.querySelector('#shop-add-form')
    form.addEventListener('submit', function (e) {
      e.preventDefault()

      const formData = new FormData(e.target)
      const shopData = {}
      formData.forEach((value, key) => {
        shopData[key] = value
      })
      
      const existingShop = shopModel.Select().find(shop => shop.name === shopData.name && shop.address === shopData.address)
      if(existingShop){
        window.alert("The shop alredy exist")
        return
      }

      shopModel.Create(shopData)

      e.target.reset()
    })
  }

  function initList () {
    window.jQuery('#shop-list').DataTable({
      data: shopModel.Select(),
      columns: [
        { title: 'Name', data: 'name' },
        { title: 'Address', data: 'address' },
        {
          title: 'Action',
          data: null,
          orderable: false,
          searchable: false,
          render: function (data, type, row, meta) {
            const editButton = '<button type="button" class="btn btn-primary btn-sm edit-shop" data-id="' + row.id + '">Edit</button>';
            const deleteButton = '<button type="button" class="btn btn-danger btn-sm delete-shop" data-id="' + row.id + '">Delete</button>';
            return editButton + '&nbsp;&nbsp;' + deleteButton;
          }
        },
      ]
    })
  }   

  function initListEvents () {
    window.jQuery('#shop-list').on('click', '.delete-shop', function (e) {
      const shopId = window.jQuery(this).data('id')
      shopModel.Delete(shopId)
    })
    
    window.jQuery('#shop-list').on('click', '.edit-shop', function (e) {
      const shopId = window.jQuery(this).data('id')
      const shop = shopModel.FindById(shopId)
  
      if (shop) {
        const name = window.prompt('Enter a new name', shop.name)
        const address = window.prompt('Enter a new address', shop.address)

        const existingShop = shopModel.Select().find(existingShop => existingShop.name === name && existingShop.address === address)
        if(existingShop){
          window.alert("The shop alredy exist")
          return
        }
  
        if (name !== null && address !== null) {
          shopModel.Update(shopId, { name: name, address: address })
        }
      }
    })

    document.addEventListener('shopsListDataChanged', function (e) {
      const dataTable = window.jQuery('#shop-list').DataTable()
  
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
