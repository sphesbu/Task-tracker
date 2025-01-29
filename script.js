let tasks = []; // Array to store tasks
let timers = {}; // Object to store timers

// Load tasks from local storage on page load
function loadTasks() {
  const storedTasks = localStorage.getItem("tasks");
  tasks = storedTasks ? JSON.parse(storedTasks) : [];
  updateTasks();
}

// Add a new task
function addTask() {
  const taskInput = document.getElementById("taskInput");
  const taskText = taskInput.value.trim();
  if (taskText) {
    tasks.push({ text: taskText, time: 0, running: false });
    localStorage.setItem("tasks", JSON.stringify(tasks));
    updateTasks();
    taskInput.value = "";
  }
}

// Remove a task from the list
function removeTask(index) {
  clearInterval(timers[index]); // Stop the timer if running
  tasks.splice(index, 1); // Remove task from array
  localStorage.setItem("tasks", JSON.stringify(tasks)); // Update local storage
  updateTasks();
}

// Start or pause the timer for a task
function toggleTimer(index) {
  if (tasks[index].running) {
    clearInterval(timers[index]); // Pause timer
    tasks[index].running = false;
  } else {
    timers[index] = setInterval(() => {
      tasks[index].time++; // Increment time
      updateTasks();
    }, 1000);
    tasks[index].running = true;
  }
  localStorage.setItem("tasks", JSON.stringify(tasks)); // Update storage
  updateTasks();
}

// Format time in minutes and seconds
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

// Update the displayed task list
function updateTasks() {
  const taskList = document.getElementById("tasks");
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.innerHTML = `${task.text} - <span>${formatTime(task.time)}</span>`;
    
    const timerButton = document.createElement("button");
    timerButton.textContent = task.running ? "Pause" : "Start";
    timerButton.className = "timer-btn";
    timerButton.onclick = () => toggleTimer(index);
    
    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.onclick = () => removeTask(index);
    
    li.appendChild(timerButton);
    li.appendChild(removeButton);
    taskList.appendChild(li);
  });
}

// Load tasks when the page loads
window.onload = loadTasks;