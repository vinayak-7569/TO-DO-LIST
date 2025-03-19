 // Get references to HTML elements
const taskInput = document.getElementById("taskInput");
const taskDate = document.getElementById("taskDate");
const taskTime = document.getElementById("taskTime");
const addButton = document.getElementById("addButton");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const filterPriority = document.createElement("select");  // Dropdown for filtering by priority

// Adding filter options for priority
filterPriority.innerHTML = `
    <option value="">Filter by Priority</option>
    <option value="Low">Low</option>
    <option value="Medium">Medium</option>
    <option value="High">High</option>
`;

document.querySelector('.container').insertBefore(filterPriority, taskList);

// Array to store tasks
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Function to add a task to the list
function addTask() {
    const taskDescription = taskInput.value.trim();
    const taskDateValue = taskDate.value;
    const taskTimeValue = taskTime.value;
    const priority = document.querySelector('input[name="priority"]:checked')?.value || "Low"; // Default to Low if no radio button selected

    // Validate the input fields
    if (taskDescription === "" || taskDateValue === "" || taskTimeValue === "") {
        alert("Please fill in all fields.");
        return;
    }

    // Create a new task object
    const newTask = {
        description: taskDescription,
        date: taskDateValue,
        time: taskTimeValue,
        priority: priority,
        completed: false // Task starts as not completed
    };

    // Add the task to the array
    tasks.push(newTask);
    
    // Save tasks to localStorage
    localStorage.setItem("tasks", JSON.stringify(tasks));

    // Reset input fields
    taskInput.value = "";
    taskDate.value = "";
    taskTime.value = "";
    
    // Update the task list and total count
    updateTaskList();
    updateTaskCount();
}

// Function to update the task list in the UI
function updateTaskList() {
    // Clear the existing list
    taskList.innerHTML = "";

    // Filter tasks by priority if selected
    const filteredTasks = filterPriority.value ? tasks.filter(task => task.priority === filterPriority.value) : tasks;

    // Loop through all tasks and add them to the list
    filteredTasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.classList.add("task-item");

        // Add task details to the list item
        li.innerHTML = `
            <p><strong>Task:</strong> ${task.description}</p>
            <p><strong>Date:</strong> ${task.date}</p>
            <p><strong>Time:</strong> ${task.time}</p>
            <p><strong>Priority:</strong> ${task.priority}</p>
            <button onclick="deleteTask(${index})">Delete</button>
            <button onclick="editTask(${index})">Edit</button>
            <button onclick="toggleCompleted(${index})">${task.completed ? 'Unmark Completed' : 'Mark Completed'}</button>
        `;

        // Mark task as completed (if applicable)
        if (task.completed) {
            li.style.backgroundColor = '#A2DFF7'; // Change background color when completed
            li.style.textDecoration = 'line-through'; // Strike-through for completed tasks
        }

        // Append the list item to the task list
        taskList.appendChild(li);
    });
}

// Function to update the total task count
function updateTaskCount() {
    taskCount.textContent = `Total tasks: ${tasks.length}`;
}

// Function to delete a task
function deleteTask(index) {
    // Remove the task from the array
    tasks.splice(index, 1);

    // Save tasks to localStorage
    localStorage.setItem("tasks", JSON.stringify(tasks));

    // Update the task list and count
    updateTaskList();
    updateTaskCount();
}

// Function to edit a task
function editTask(index) {
    const task = tasks[index];

    // Populate the input fields with the current task data
    taskInput.value = task.description;
    taskDate.value = task.date;
    taskTime.value = task.time;
    
    // Show the priority (reset to Low if no priority is selected)
    document.querySelector(`input[name="priority"][value="${task.priority}"]`).checked = true;

    // Remove the task after editing it
    deleteTask(index);
}

// Function to toggle the task completion status
function toggleCompleted(index) {
    tasks[index].completed = !tasks[index].completed;
    // Save tasks to localStorage
    localStorage.setItem("tasks", JSON.stringify(tasks));
    // Update the task list
    updateTaskList();
}

// Add event listener to the "Add Task" button
addButton.addEventListener("click", addTask);

// Add event listener to filter tasks by priority
filterPriority.addEventListener("change", updateTaskList);

