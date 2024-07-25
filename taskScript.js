const eventName = localStorage.getItem("SelectedEvent");

if (eventName) {
  const taskData = JSON.parse(localStorage.getItem("TaskData")) || [];
  const filteredTasks = taskData.filter((task) => task[2] === eventName);

  const taskTable = document
    .getElementById("task-table")
    .getElementsByTagName("tbody")[0];

  filteredTasks.forEach((task) => {
    const row = taskTable.insertRow();

    const cellTaskId = row.insertCell(0);
    const cellTaskName = row.insertCell(1);
    const cellStatus = row.insertCell(2);

    cellTaskId.textContent = task[0];
    cellTaskName.textContent = task[1];

    const statusDropdown = document.createElement("select");
    const statuses = ["Not Started", "In Progress", "Completed"];
    statuses.forEach((status) => {
      const option = document.createElement("option");
      option.value = status;
      option.textContent = status;
      statusDropdown.appendChild(option);
    });

    cellStatus.appendChild(statusDropdown);
  });

  document.getElementById("event-name").textContent = eventName;
} else {
  // Handle case where eventName is not present
  document.getElementById("event-name").textContent = "No event selected";
}