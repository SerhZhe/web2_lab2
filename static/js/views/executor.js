'use strict'

const executorModel = new Executor() // eslint-disable-line no-undef

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}


function initAddForm () {
  const form = window.document.querySelector('#executor-add-form')
  form.addEventListener('submit', function (e) {
    e.preventDefault()
    
    const formData = new FormData(e.target)
    const executorData = {}
    formData.forEach((value, key) => {
      executorData[key] = value
    })

    executorModel.Create(executorData)

    e.target.reset()
    $('#add-modal').modal('hide');
    $('.modal-backdrop').remove();
  })
}

function initList () {
  window.jQuery('#executor-list').DataTable({
    data: executorModel.Select(),
    columns: [
      { title: 'ID', data: 'id' },
      { title: 'Name', data: 'name' },
      { title: 'Exp', data: 'exp' },
      {title: 'Workers', data: 'workers'},
      {data: null, render: function(data, type, row) {
        return '<button class="btn btn-danger btn-sm delete-btn">Delete</button>';
      }},
      {data: null, render: function(data, type, row) {
        return '<button class="btn btn-success btn-sm edit-btn">Edit</button>';
      }}
    ]
  })

  document.addEventListener('executorsListDataChanged', function (event) {
    $('#executor-list').DataTable().clear().rows.add(event.detail).draw();
  });
}

function initEditForm() {
  const form = window.document.querySelector('#executor-edit-form');
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const executorData = {};
    formData.forEach((value, key) => {
      executorData[key] = value;
    });

    const id = executorData['id'];
    delete executorData['id'];

    console.log(executorData)
    if (id) {
      executorModel.Update(id, executorData);
      console.log("ok")
    } else {
      console.log("not ok")
    }

    e.target.reset();
    $('#edit-modal').modal('hide');
    $('.modal-backdrop').remove();
  });
}

$('#add-executor-btn').on('click', function() {
  $('#add-modal').modal('show');
  $('body').append('<div id="edit-modal-backdrop" class="modal-backdrop fade show"></div>');
});

$('#executor-list').on('click', '.delete-btn', function() {
  console.log("hello kitty")
  var row = $(this).closest('tr');
  var data = $('#executor-list').DataTable().row(row).data();
  executorModel.Delete(data['id']);
});

$('#executor-list').on('click', '.edit-btn', function() {
  console.log("start")
  var row = $(this).closest('tr');
  var data = $('#executor-list').DataTable().row(row).data();

  // Populate the edit form with the
  $('#edit-id').val(data.id);
  $('#edit-name').val(data.name);
  $('#edit-exp').val(data.exp);
  $('#edit-workers').val(data.workers);
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
  document.addEventListener('executorListDataChanged', function (e) {
    const dataTable = window.jQuery('#executor-list').DataTable()

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