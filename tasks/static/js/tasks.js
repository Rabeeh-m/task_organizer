
// Fetch and display tasks with pagination
function fetchTasks(page = 1) {
    fetch(`/api/tasks/?page=${page}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Fetched data:', data);  // Debug output

            const taskTableBody = document.getElementById('taskTableBody');
            taskTableBody.innerHTML = '';

            if (!data || !Array.isArray(data.results)) {
                throw new Error('Invalid response format: expected `results` to be an array.');
            }

            data.results.forEach(task => {
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

            renderPagination(data, page);
        })
        .catch(error => {
            console.error('Error fetching tasks:', error);
        });
}

// Render pagination controls
function renderPagination(data, currentPage) {
    const paginationContainer = document.getElementById('paginationControls');
    if (!paginationContainer) return;

    paginationContainer.innerHTML = '';

    if (data.previous) {
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Previous';
        prevButton.onclick = () => fetchTasks(getPageNumber(data.previous));
        paginationContainer.appendChild(prevButton);
    }

    const totalPages = Math.ceil(data.count / 3);
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.disabled = i === currentPage;
        pageButton.onclick = () => fetchTasks(i);
        paginationContainer.appendChild(pageButton);
    }

    if (data.next) {
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next';
        nextButton.onclick = () => fetchTasks(getPageNumber(data.next));
        paginationContainer.appendChild(nextButton);
    }
}

// Extract page number from URL
function getPageNumber(url) {
    if (!url) return 1;
    try {
        const params = new URL(url).searchParams;
        return parseInt(params.get('page')) || 1;
    } catch (e) {
        return 1;
    }
}

// Handle task form submission
document.getElementById('taskForm')?.addEventListener('submit', function (e) {
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
                return response.json().then(err => {
                    console.error('Error response:', err);
                    alert('Error saving task');
                });
            }
        })
        .catch(error => {
            console.error('Fetch error on form submit:', error);
            alert('Network error while saving task');
        });
});

// Edit task
function editTask(id) {
    fetch(`/api/tasks/${id}/`)
        .then(response => response.json())
        .then(task => {
            sessionStorage.setItem('editTask', JSON.stringify(task));
            window.location.href = '/task-form/';
        })
        .catch(error => {
            console.error('Error fetching task for edit:', error);
            alert('Failed to load task');
        });
}

// Populate form when task_form.html loads
document.addEventListener('DOMContentLoaded', function () {
    const editTask = JSON.parse(sessionStorage.getItem('editTask'));
    if (editTask && document.getElementById('taskForm')) {
        document.getElementById('taskId').value = editTask.id;
        document.getElementById('title').value = editTask.title;
        document.getElementById('description').value = editTask.description || '';
        document.getElementById('due_date').value = editTask.due_date.slice(0, 16);
        document.getElementById('completed').checked = editTask.completed;
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
            .then(() => fetchTasks())
            .catch(error => {
                console.error('Error deleting task:', error);
                alert('Failed to delete task');
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
