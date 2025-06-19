// // Fetch and display tasks
// function fetchTasks() {
//     fetch('/api/tasks/')
//         .then(response => response.json())
//         .then(tasks => {
//             const taskTableBody = document.getElementById('taskTableBody');
//             taskTableBody.innerHTML = '';
//             tasks.forEach(task => {
//                 const row = document.createElement('tr');
//                 row.innerHTML = `
//                     <td>${task.title}</td>
//                     <td>${task.description || ''}</td>
//                     <td>${new Date(task.due_date).toLocaleString()}</td>
//                     <td>${task.completed ? 'Completed' : 'Pending'}</td>
//                     <td class="actions">
//                         <a href="#" onclick="editTask(${task.id})">Edit</a>
//                         <a href="#" onclick="deleteTask(${task.id})">Delete</a>
//                     </td>
//                 `;
//                 taskTableBody.appendChild(row);
//             });
//         });
// }

// // Handle task form submission
// document.getElementById('taskForm')?.addEventListener('submit', function(e) {
//     e.preventDefault();
//     const taskId = document.getElementById('taskId').value;
//     const method = taskId ? 'PUT' : 'POST';
//     const url = taskId ? `/api/tasks/${taskId}/` : '/api/tasks/';
//     const data = {
//         title: document.getElementById('title').value,
//         description: document.getElementById('description').value,
//         due_date: document.getElementById('due_date').value,
//         completed: document.getElementById('completed').checked,
//     };

//     fetch(url, {
//         method: method,
//         headers: {
//             'Content-Type': 'application/json',
//             'X-CSRFToken': getCookie('csrftoken'),
//         },
//         body: JSON.stringify(data),
//     })
//     .then(response => {
//         if (response.ok) {
//             window.location.href = '/dashboard/';
//         } else {
//             alert('Error saving task');
//         }
//     });
// });

// // Edit task
// function editTask(id) {
//     fetch(`/api/tasks/${id}/`)
//         .then(response => response.json())
//         .then(task => {
//             document.getElementById('taskId').value = task.id;
//             document.getElementById('title').value = task.title;
//             document.getElementById('description').value = task.description || '';
//             document.getElementById('due_date').value = task.due_date.slice(0, 16);
//             document.getElementById('completed').checked = task.completed;
//             window.location.href = '/task-form/';
//         });
// }

// // Delete task
// function deleteTask(id) {
//     if (confirm('Are you sure you want to delete this task?')) {
//         fetch(`/api/tasks/${id}/`, {
//             method: 'DELETE',
//             headers: {
//                 'X-CSRFToken': getCookie('csrftoken'),
//             },
//         })
//         .then(() => {
//             fetchTasks();
//         });
//     }
// }

// // Get CSRF token
// function getCookie(name) {
//     let cookieValue = null;
//     if (document.cookie && document.cookie !== '') {
//         const cookies = document.cookie.split(';');
//         for (let i = 0; i < cookies.length; i++) {
//             const cookie = cookies[i].trim();
//             if (cookie.substring(0, name.length + 1) === (name + '=')) {
//                 cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
//                 break;
//             }
//         }
//     }
//     return cookieValue;
// }

// // Fetch tasks on dashboard load
// if (document.getElementById('taskTableBody')) {
//     fetchTasks();
// }






// Fetch and display tasks
function fetchTasks() {
    fetch('/api/tasks/')
        .then(response => response.json())
        .then(tasks => {
            const taskTableBody = document.getElementById('taskTableBody');
            taskTableBody.innerHTML = '';
            tasks.forEach(task => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${task.title}</td>
                    <td>${task.description || ''}</td>
                    <td>${new Date(task.due_date).toLocaleString()}</td>
                    <td>${task.completed ? 'Completed' : 'Pending'}</td>
                    <td class="actions">
                        <a href="#" onclick="editTask(${task.id})">Edit</a>
                        <a href="#" onclick="deleteTask(${task.id})">Delete</a>
                    </td>
                `;
                taskTableBody.appendChild(row);
            });
        });
}

// Handle task form submission
document.getElementById('taskForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const taskId = document.getElementById('taskId').value;
    const method = taskId ? 'PUT' : 'POST';
    const url = taskId ? `/api/tasks/${taskId}/` : '/api/tasks/';
    const data = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        due_date: document.getElementById('due_date').value,
        completed: document.getElementById('completed').checked,
    };

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify(data),
    })
    .then(response => {
        if (response.ok) {
            window.location.href = '/dashboard/';
        } else {
            alert('Error saving task');
        }
    });
});

// Edit task
function editTask(id) {
    fetch(`/api/tasks/${id}/`)
        .then(response => response.json())
        .then(task => {
            // Store task data in sessionStorage
            sessionStorage.setItem('editTask', JSON.stringify(task));
            // Redirect to task form page
            window.location.href = '/task-form/';
        });
}

// Populate form when task_form.html loads
document.addEventListener('DOMContentLoaded', function() {
    const editTask = JSON.parse(sessionStorage.getItem('editTask'));
    if (editTask && document.getElementById('taskForm')) {
        document.getElementById('taskId').value = editTask.id;
        document.getElementById('title').value = editTask.title;
        document.getElementById('description').value = editTask.description || '';
        document.getElementById('due_date').value = editTask.due_date.slice(0, 16);
        document.getElementById('completed').checked = editTask.completed;
        // Clear sessionStorage after populating
        sessionStorage.removeItem('editTask');
    }
});

// Delete task
function deleteTask(id) {
    if (confirm('Are you sure you want to delete this task?')) {
        fetch(`/api/tasks/${id}/`, {
            method: 'DELETE',
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),
            },
        })
        .then(() => {
            fetchTasks();
        });
    }
}

// Get CSRF token
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Fetch tasks on dashboard load
if (document.getElementById('taskTableBody')) {
    fetchTasks();
}