// script.js for QuickList app

document.addEventListener('DOMContentLoaded', () => {
  const taskForm = document.getElementById('task-form');
  const taskInput = document.getElementById('task-input');
  const taskList = document.getElementById('task-list');
  const todoBtn = document.getElementById('todo-btn');
  const shoppingBtn = document.getElementById('shopping-btn');
  const reminderBtn = document.getElementById('reminder-btn');

  let currentListType = 'todo'; // 'todo', 'shopping', 'reminder'
  let tasks = {
    todo: [],
    shopping: [],
    reminder: []
  };

  // Load tasks from localStorage
  function loadTasks() {
    const savedTasks = localStorage.getItem('quicklist-tasks');
    if (savedTasks) {
      tasks = JSON.parse(savedTasks);
    }
  }

  // Save tasks to localStorage
  function saveTasks() {
    localStorage.setItem('quicklist-tasks', JSON.stringify(tasks));
  }

  // Render tasks for current list type
  function renderTasks() {
    taskList.innerHTML = '';
    if (tasks[currentListType].length === 0) {
      const emptyMsg = document.createElement('li');
      emptyMsg.textContent = 'No tasks in this list.';
      emptyMsg.style.textAlign = 'center';
      emptyMsg.style.color = '#666';
      taskList.appendChild(emptyMsg);
      return;
    }
    tasks[currentListType].forEach((task, index) => {
      const li = document.createElement('li');
      li.className = task.checked ? 'checked' : '';
      li.textContent = task.text;

      // Checkbox to toggle checked
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = task.checked;
      checkbox.addEventListener('change', () => {
        tasks[currentListType][index].checked = checkbox.checked;
        saveTasks();
        renderTasks();
      });

      // Delete button
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'delete-btn';
      deleteBtn.textContent = '×';
      deleteBtn.title = 'Delete task';
      deleteBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete this task?')) {
          tasks[currentListType].splice(index, 1);
          saveTasks();
          renderTasks();
        }
      });

      li.prepend(checkbox);
      li.appendChild(deleteBtn);
      taskList.appendChild(li);
    });
  }

  // Add new task
  taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = taskInput.value.trim();
    if (text === '') {
      alert('Please enter a task or item.');
      return;
    }
    tasks[currentListType].push({ text, checked: false });
    saveTasks();
    renderTasks();
    taskInput.value = '';
  });

  // Switch list type
  function switchListType(type) {
    currentListType = type;
    todoBtn.classList.toggle('active', type === 'todo');
    shoppingBtn.classList.toggle('active', type === 'shopping');
    reminderBtn.classList.toggle('active', type === 'reminder');
    renderTasks();
  }

  todoBtn.addEventListener('click', () => switchListType('todo'));
  shoppingBtn.addEventListener('click', () => switchListType('shopping'));
  reminderBtn.addEventListener('click', () => switchListType('reminder'));

  // Reminder alert for reminder list items
  function checkReminders() {
    if (currentListType !== 'reminder') return;
    tasks.reminder.forEach((task) => {
      if (!task.checked) {
        alert(`Reminder: ${task.text}`);
      }
    });
  }

  // Initial load
  loadTasks();
  renderTasks();

  // Optional: check reminders every 5 minutes
  setInterval(checkReminders, 5 * 60 * 1000);
});
