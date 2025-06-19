// Initialize FullCalendar
document.addEventListener('DOMContentLoaded', function() {
    const calendarEl = document.getElementById('calendar');
    if (calendarEl) {
        const calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            events: function(fetchInfo, successCallback) {
                fetch('/api/tasks/')
                    .then(response => response.json())
                    .then(tasks => {
                        const events = tasks.map(task => ({
                            title: task.title,
                            start: task.due_date,
                            backgroundColor: task.completed ? '#28a745' : '#dc3545',
                        }));
                        successCallback(events);
                    });
            },
        });
        calendar.render();
    }
});