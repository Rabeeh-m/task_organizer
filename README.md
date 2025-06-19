# Task Organizer

A web application built with Django and Django Templates that allows users to create, view, edit, and delete tasks. Users can schedule tasks, view them on a calendar, and mark them as completed. The app features user registration with email-based OTP verification and a clean, responsive UI.

## Features
#### User Authentication:
- Register with username, email, password, and OTP verification.
- Login using email and password.
- Logout functionality.

#### Task Management:
- Create, view, edit, and delete tasks.
- Schedule tasks with due dates.
- Mark tasks as completed.

#### Dashboard:
- View tasks in a table and on a FullCalendar.
- Responsive design with task filtering by completion status.

#### RESTful API:
- Backend APIs for task CRUD operations.

#### Clean UI/UX:
- Modern, responsive design using HTML, CSS, and JavaScript.
- FullCalendar integration for task visualization.

## Technologies Used
- Frontend: Django Templates, HTML, CSS, JavaScript, FullCalendar
- Backend: Python, Django, Django REST Framework

## Prerequisites
- Python 3.9+
- pip
- Git

## Installation

### 1. Clone the Repository:
```bash
git clone https://github.com/Rabeeh-m/task_organizer.git
cd task_organizer
```

### 2. Set Up a Virtual Environment:
```bash
python -m venv venv
source venv/bin/activate    # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies:
```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables:
- Create a .env file in the project root and add:
```bash
SECRET_KEY=your-secret-key-here

EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-email-password
```

### 5. Apply Migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

### 6. Collect Static Files:
```bash
python manage.py collectstatic
```

### 7. Run the Development Server:
```bash
python manage.py runserver
```

## Contributing
- Fork the repository.
- Create a new branch (git checkout -b feature-branch).
- Make your changes and commit (git commit -m 'Add feature').
- Push to the branch (git push origin feature-branch).
- Open a Pull Request.
