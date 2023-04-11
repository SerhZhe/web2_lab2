'use strict'

const customerModel = new Customer() // eslint-disable-line no-undef

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}


function initAddForm () {
  const form = window.document.querySelector('#customer-add-form')
  form.addEventListener('submit', function (e) {
    e.preventDefault()
    
    const formData = new FormData(e.target)
    const customerData = {}
    formData.forEach((value, key) => {
      customerData[key] = value
    })

    customerModel.Create(customerData)

    e.target.reset()
    $('#add-modal').modal('hide');
    $('.modal-backdrop').remove();
  })
}

function initList () {
  window.jQuery('#customer-list').DataTable({
    data: customerModel.Select(),
    columns: [
      { title: 'ID', data: 'id' },
      { title: 'Name', data: 'name' },
      { title: 'Budget', data: 'budget' },
      {data: null, render: function(data, type, row) {
        return '<button class="btn btn-danger btn-sm delete-btn">Delete</button>';
      }},
      {data: null, render: function(data, type, row) {
        return '<button class="btn btn-success btn-sm edit-btn">Edit</button>';
      }}
    ]
  })

  document.addEventListener('customersListDataChanged', function (event) {
    $('#customer-list').DataTable().clear().rows.add(event.detail).draw();
  });
}

function initEditForm() {
  const form = window.document.querySelector('#customer-edit-form');
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const customerData = {};
    formData.forEach((value, key) => {
      customerData[key] = value;
    });

    const id = customerData['id'];
    delete customerData['id'];

    console.log(customerData)
    if (id) {
      customerModel.Update(id, customerData);
      console.log("ok")
    } else {
      console.log("not ok")
    }

    e.target.reset();
    $('#edit-modal').modal('hide');
    $('.modal-backdrop').remove();
  });
}

$('#add-customer-btn').on('click', function() {
  $('#add-modal').modal('show');
  $('body').append('<div id="edit-modal-backdrop" class="modal-backdrop fade show"></div>');
});

$('#customer-list').on('click', '.delete-btn', function() {
  console.log("hello kitty")
  var row = $(this).closest('tr');
  var data = $('#customer-list').DataTable().row(row).data();
  customerModel.Delete(data['id']);
});

$('#customer-list').on('click', '.edit-btn', function() {
  console.log("start")
  var row = $(this).closest('tr');
  var data = $('#customer-list').DataTable().row(row).data();

  // Populate the edit form with the customer data
  $('#edit-id').val(data.id);
  $('#edit-name').val(data.name);
  $('#edit-budget').val(data.budget);
  // Show the edit modal
  $('#edit-modal').modal('show');
  $('body').append('<div id="edit-modal-backdrop" class="modal-backdrop fade show"></div>');
});


$('#add-modal').on('hidden.bs.modal', function () {
  $('.modal-backdrop').remove();
});

$('#edit-modal').on('hidden.bs.modal', function () {
  $('.modal-backdrop').remove();
});



function initListEvents () {
  document.addEventListener('customerListDataChanged', function (e) {
    const dataTable = window.jQuery('#customer-list').DataTable()

    dataTable.clear()
    dataTable.rows.add(e.detail)
    dataTable.draw()
  })
}

window.addEventListener('DOMContentLoaded', e => {
  initAddForm()
  initList()
  initListEvents()
  initEditForm()
})