// Initialize FullCalendar
document.addEventListener('DOMContentLoaded', function() {
    const calendarEl = document.getElementById('calendar');
    if (calendarEl) {
        const calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            events: async function(fetchInfo, successCallback) {
                try {
                    let allTasks = [];
                    let nextUrl = '/api/tasks/';
                    
                    // Fetch all pages of tasks
                    while (nextUrl) {
                        const response = await fetch(nextUrl);
                        if (!response.ok) {
                            console.error('Error fetching tasks for calendar:', response.statusText);
                            break;
                        }
                        const data = await response.json();
                        console.log('Raw API response:', data); // Log raw response for debugging
                        if (Array.isArray(data.results)) {
                            allTasks = allTasks.concat(data.results);
                        } else {
                            console.error('Invalid data format:', data);
                            break;
                        }
                        nextUrl = data.next; // Update nextUrl for the next page
                    }

                    // Map tasks to calendar events
                    const events = allTasks.map(task => ({
                        title: task.title,
                        start: task.due_date,
                        backgroundColor: task.completed ? '#28a745' : '#dc3545',
                    }));
                    successCallback(events);
                } catch (error) {
                    console.error('Fetch error:', error);
                    successCallback([]);
                }
            },
        });
        calendar.render();
    }
});