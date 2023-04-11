'use strict'

const projectModel = new Project() // eslint-disable-line no-undef


function initAddForm() {
    const form = window.document.querySelector('#project-add-form')
    const customerModel = new Customer()
    const customers = customerModel.Select()
    const customerSelect = form.querySelector('#customer-select')

    if (customers && customers.length) {
        console.log("Customers array:")
        customers.forEach((customer, index) => {
            console.log(`Customer ${index}:`, customer); // Add this debug log
            const option = document.createElement('option');
            option.textContent = customer['name'];
            option.value = customer['id'];
            customerSelect.appendChild(option);
          });
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
      
        const formData = new FormData(e.target);
        const projectData = {};
        formData.forEach((value, key) => {
          projectData[key] = value;
        });
        console.log(formData.get('customer'));
        const selectedCustomer = customers.find(
          (customer) => customer.id == parseInt(formData.get('customer'))
        );
      
        console.log(selectedCustomer); // Add this line to debug
      
        projectData.customer = selectedCustomer.name.toString(); // add the selected customer name to the project data
      
        projectModel.Create(projectData);
      
        e.target.reset();
        $('#add-modal').modal('hide');
        $('.modal-backdrop').remove();
      });
}

function initList() {
    window.jQuery('#project-list').DataTable({
        data: projectModel.Select(),
        columns: [
            { title: 'ID', data: 'id' },
            { title: 'Name', data: 'name' },
            { title: 'Description', data: 'description' },
            { title: 'Customer', data: 'customer' },
            {
                data: null, render: function (data, type, row) {
                    return '<button class="btn btn-danger btn-sm delete-btn">Delete</button>';
                }
            },
            {
                data: null, render: function (data, type, row) {
                    return '<button class="btn btn-success btn-sm edit-btn">Edit</button>';
                }
            }
        ]
    })
    document.addEventListener('projectsListDataChanged', function (event) {
        $('#project-list').DataTable().clear().rows.add(event.detail).draw();
    });
}

function initEditForm() {
    const form = window.document.querySelector('#project-edit-form');
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const projectData = {};
        formData.forEach((value, key) => {
            projectData[key] = value;
        });

        const id = projectData['id'];
        delete projectData['id'];

        console.log(projectData)
        if (id) {
            projectModel.Update(id, projectData);
            console.log("ok")
        } else {
            console.log("not ok")
        }

        e.target.reset();
        $('#edit-modal').modal('hide');
        $('.modal-backdrop').remove();
    });
}

$('#add-project-btn').on('click', function () {
    $('#add-modal').modal('show');
    $('body').append('<div id="edit-modal-backdrop" class="modal-backdrop fade show"></div>');
});

$('#project-list').on('click', '.delete-btn', function () {
    console.log("hello kitty")
    var row = $(this).closest('tr');
    var data = $('#project-list').DataTable().row(row).data();
    projectModel.Delete(data['id']);
});

$('#project-list').on('click', '.edit-btn', function () {
    console.log("start")
    var row = $(this).closest('tr');
    var data = $('#project-list').DataTable().row(row).data();

    // Populate the edit form with the customer data
    $('#edit-id').val(data.id);
    $('#edit-name').val(data.name);
    $('#edit-description').val(data.description);
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


function initListEvents() {
    document.addEventListener('projectListDataChanged', function (e) {
        const dataTable = window.jQuery('#project-list').DataTable()

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