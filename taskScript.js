let eventId = localStorage.getItem("SelectedEventId");
let eventName = localStorage.getItem("SelectedEventName");
let eventNameValue = document.getElementById("event-name-value");
let doneButton = document.getElementById("done-button");
let eventData = JSON.parse(localStorage.getItem("EventData")) || [];
let taskData = JSON.parse(localStorage.getItem("TaskData")) || [];
let eventStatusData = JSON.parse(localStorage.getItem("EventStatusData")) || [];
let taskStatusData = JSON.parse(localStorage.getItem("TaskStatusData")) || {};
let taskTableBody = document.getElementById("task-table-body");
let eventIndex = eventData.findIndex((event) => event[0] === eventId);
let tasksForEvent = taskData.filter((task) => task[2] === eventId);

if (!eventName) {
  eventNameValue.textContent = "No event selected";
}
eventNameValue.textContent = eventName;

if (eventId) {
  tasksForEvent.forEach((task) => {
    let row = taskTableBody.insertRow();

    let cellTaskId = row.insertCell(0);
    let cellTaskName = row.insertCell(1);
    let cellStatus = row.insertCell(2);

    cellTaskId.textContent = task[0];
    cellTaskName.textContent = task[1];

    let statusDropdown = document.createElement("select");
    statusDropdown.className = "statusDropDown";
    statusDropdown.onchange = function () {
      taskStatusSetter(this, task[0]);
    };

    let statuses = ["Not Started", "In Progress", "Completed"];
    statuses.forEach((status) => {
      let option = document.createElement("option");
      option.value = status;
      option.textContent = status;

      if (taskStatusData[task[0]] === status) {
        option.selected = true;
      }
      statusDropdown.appendChild(option);
    });
    cellStatus.appendChild(statusDropdown);
  });
  disableInProgressOptions();
  if (eventStatusData[eventIndex] == "Failed") {
    failedEventStatusUpdate();
  }
  updateEventStatus(localStorage.getItem("SelectedEventId"));
  doneButtonFunction();
}

function taskStatusSetter(selectedOption, taskId) {
  taskStatusData[taskId] = selectedOption.value;
  localStorage.setItem("TaskStatusData", JSON.stringify(taskStatusData));
  disableInProgressOptions();
}

function disableInProgressOptions() {
  let taskTableBody = document.getElementById("task-table-body");
  let taskStatusData = JSON.parse(localStorage.getItem("TaskStatusData")) || {};
  let inProgressFound = false;

  for (let taskId in taskStatusData) {
    if (taskStatusData[taskId] === "In Progress") {
      inProgressFound = true;
      break;
    }
  }

  for (i = 0; i < taskTableBody.rows.length; i++) {
    let row = taskTableBody.rows[i];
    let statusDropdown = row.cells[2].querySelector("select");

    for (j = 0; j < statusDropdown.options.length; j++) {
      if (statusDropdown.options[j].value === "In Progress") {
        statusDropdown.options[j].disabled =
          inProgressFound && statusDropdown.value !== "In Progress";
      }
    }
  }
}

function doneButtonFunction() {
  doneButton.onclick = function () {
    updateEventStatus(localStorage.getItem("SelectedEventId"));
    window.location.href = "eventListing.html";
  };
}

function updateEventStatus(eventId) {
  let status = "Not Started";
  let inProgressCount = 0;
  let completedCount = 0;
  let notStartedCount = 0;

  tasksForEvent.forEach((task) => {
    let taskId = task[0];
    let taskStatus = taskStatusData[taskId] || "Not Started";

    if (taskStatus === "In Progress") {
      inProgressCount++;
    } else if (taskStatus === "Completed") {
      completedCount++;
    } else {
      notStartedCount++;
    }
  });

  if (inProgressCount == 1) {
    status = "In Progress";
  } else if (notStartedCount >= 1 && completedCount >= 1) {
    status = "In Progress";
  } else if (completedCount === tasksForEvent.length) {
    status = "Completed";
  }

  let duplicateInProgressInEvent = false;
  if (eventStatusData[eventIndex] !== "Failed") {
    duplicateInProgressInEvent = disableDuplicateInProgressInEvent(eventIndex);
    if (
      !duplicateInProgressInEvent ||
      eventStatusData[eventIndex] !== "In Progress"
    ) {
      eventStatusData[eventIndex] = status;
      localStorage.setItem("EventStatusData", JSON.stringify(eventStatusData));

      let statusLabel = document.getElementById(`status-${eventId}`);
      if (statusLabel) {
        statusLabel.textContent = status;
      }
    }
  }
}

function failedEventStatusUpdate() {
  for (i = 0; i < taskTableBody.rows.length; i++) {
    let row = taskTableBody.rows[i];
    let statusDropdown = row.cells[2].querySelector("select");

    for (j = 0; j < statusDropdown.options.length; j++) {
      if (statusDropdown.options[j].value === "In Progress") {
        statusDropdown.options[j].disabled = true;
      }
    }
  }
}

function disableDuplicateInProgressInEvent(eventIndex) {
  let eventStatusData =
    JSON.parse(localStorage.getItem("EventStatusData")) || [];
  let inProgressFound = false;
  for (let event in eventStatusData) {
    if (
      eventStatusData[event] === "In Progress" &&
      eventStatusData[eventIndex] !== "In Progress"
    ) {
      inProgressFound = true;
      alertPopUp("There's already an event in Progress in the event list");
      failedEventStatusUpdate();
      return inProgressFound;
    }
  }
}

function alertPopUp(errorMsg) {
  var popUp = document.getElementById("pop-up");
  popUp.className = "show";
  popUp.textContent = errorMsg;
  setTimeout(function () {
    popUp.className = popUp.className.replace("show", "");
  }, 3000);
}
