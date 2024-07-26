let eventId = localStorage.getItem("SelectedEventId");
let eventName = localStorage.getItem("SelectedEventName");

if (eventId) {
  let taskData = JSON.parse(localStorage.getItem("TaskData")) || [];
  let taskStatusData = JSON.parse(localStorage.getItem("TaskStatusData")) || {};
  let filteredTasks = taskData.filter((task) => task[2] === eventId);

  let taskTableBody = document.getElementById("task-table-body");

  filteredTasks.forEach((task) => {
    const row = taskTableBody.insertRow();

    const cellTaskId = row.insertCell(0);
    const cellTaskName = row.insertCell(1);
    const cellStatus = row.insertCell(2);

    cellTaskId.textContent = task[0];
    cellTaskName.textContent = task[1];

    const statusDropdown = document.createElement("select");
    statusDropdown.onchange = function () {
      taskStatusSetter(this, task[0]);
    };

    const statuses = ["Not Started", "In Progress", "Completed"];
    statuses.forEach((status) => {
      const option = document.createElement("option");
      option.value = status;
      option.textContent = status;

      if (taskStatusData[task[0]] === status) {
        option.selected = true;
      }

      statusDropdown.appendChild(option);
    });

    cellStatus.appendChild(statusDropdown);
  });

  document.getElementById("event-name-value").textContent = eventName;

  disableInProgressOptions();
} else {
  document.getElementById("event-name-value").textContent = "No event selected";
}
function taskStatusSetter(selectedOption, taskId) {
  const taskStatusData =
    JSON.parse(localStorage.getItem("TaskStatusData")) || {};
  taskStatusData[taskId] = selectedOption.value;
  localStorage.setItem("TaskStatusData", JSON.stringify(taskStatusData));

  disableInProgressOptions();
  updateEventStatus(localStorage.getItem("SelectedEventId"));
}

function disableInProgressOptions() {
  const taskTableBody = document.getElementById("task-table-body");
  const taskStatusData =
    JSON.parse(localStorage.getItem("TaskStatusData")) || {};
  let inProgressFound = false;

  for (let taskId in taskStatusData) {
    if (taskStatusData[taskId] === "In Progress") {
      inProgressFound = true;
      break;
    }
  }

  for (i = 0; i < taskTableBody.rows.length; i++) {
    const row = taskTableBody.rows[i];
    const statusDropdown = row.cells[2].querySelector("select");

    for (j = 0; j < statusDropdown.options.length; j++) {
      if (statusDropdown.options[j].value === "In Progress") {
        statusDropdown.options[j].disabled =
          inProgressFound && statusDropdown.value !== "In Progress";
      }
    }
  }
}
