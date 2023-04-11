'use strict'

const running_projectModel = new RunningProject() // eslint-disable-line no-undef


function initAddForm() {
    const form = window.document.querySelector('#running_project-add-form')
    const executorModel = new Executor()
    const executors = executorModel.Select()
    const executorSelect = form.querySelector('#executor-select')

    if (executors && executors.length) {
        executors.forEach((executor, index) => {
            const option = document.createElement('option');
            option.textContent = executor['name'];
            option.value = executor['id'];
            executorSelect.appendChild(option);
          });
    }

    const projectModel = new Project()
    const projects = projectModel.Select()
    const projectSelect = form.querySelector('#project-select')

    if (projects && projects.length) {
        projects.forEach((project, index) => {
            const option = document.createElement('option');
            option.textContent = project['name'];
            option.value = project['id'];
            projectSelect.appendChild(option);
          });
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
      
        const formData = new FormData(e.target);
        const running_projectData = {};
        formData.forEach((value, key) => {
          running_projectData[key] = value;
        });
      
        const selectedExecutor = executors.find(
          (executor) => executor.id == parseInt(formData.get('executor'))
        );

        const selectedProject = projects.find(
            (project) => project.id == parseInt(formData.get('project'))
        );
      
        running_projectData.executor = selectedExecutor.name.toString(); // add the selected customer name to the project data
        running_projectData.project = selectedProject.name.toString();
      
        running_projectModel.Create(running_projectData);
      
        e.target.reset();
        $('#add-modal').modal('hide');
        $('.modal-backdrop').remove();
      });
      
}

function initList() {
    window.jQuery('#running_project-list').DataTable({
        data: running_projectModel.Select(),
        columns: [
            { title: 'ID', data: 'id' },
            { title: 'Project', data: 'project' },
            { title: 'Executor', data: 'executor' },
            { title: 'Start Time', data: 'start_time' },
            { title: 'End Time', data: 'end_time' },
            {
                data: null, render: function (data, type, row) {
                    return '<button class="btn btn-danger btn-sm delete-btn">Delete</button>';
                }
            }
        ]
    })
    document.addEventListener('running_projectsListDataChanged', function (event) {
        $('#running_project-list').DataTable().clear().rows.add(event.detail).draw();
    });
}

$('#add-running_project-btn').on('click', function () {
    $('#add-modal').modal('show');
    $('body').append('<div id="edit-modal-backdrop" class="modal-backdrop fade show"></div>');
});

$('#running_project-list').on('click', '.delete-btn', function () {
    console.log("hello kitty")
    var row = $(this).closest('tr');
    var data = $('#running_project-list').DataTable().row(row).data();
    running_projectModel.Delete(data['id']);
});

$('#add-modal').on('hidden.bs.modal', function () {
    $('.modal-backdrop').remove();
});

function initListEvents() {
    document.addEventListener('running_projectListDataChanged', function (e) {
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
})