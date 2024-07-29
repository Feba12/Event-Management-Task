let eventTableBody = document.getElementById("event-table-body");
let eventData = JSON.parse(localStorage.getItem("EventData")) || [];
let taskData = JSON.parse(localStorage.getItem("TaskData")) || [];
let eventStatusData = JSON.parse(localStorage.getItem("EventStatusData")) || [];

eventData.forEach((event, index) => {
  let eventIndex = eventData.findIndex((i) => i[0] === event[0]);
  //filter the tasks based on the eventIds
  let filteredTasks = taskData.filter((task) => task[2] === event[0]);

  let row = eventTableBody.insertRow();

  let cellEventId = row.insertCell(0);
  let cellEventName = row.insertCell(1);
  let cellStartDate = row.insertCell(2);
  let cellEndDate = row.insertCell(3);
  let cellStatus = row.insertCell(4);
  let cellAction = row.insertCell(5);

  cellEventId.textContent = event[0];
  cellEventName.textContent = event[1];
  cellStartDate.textContent = event[2];
  cellEndDate.textContent = event[3];

  let status = document.createElement("label");
  status.id = `status-${event[0]}`;

  status.textContent = eventStatusData[index] || calculateInitialStatus(event);
  cellStatus.appendChild(status);

  //update the eventStatusData in the local storage with the initialStatus of each events
  if (eventStatusData[index] == null) {
    eventStatusData[eventIndex] = calculateInitialStatus(event);
    localStorage.setItem("EventStatusData", JSON.stringify(eventStatusData));
  }

  let actionButton = document.createElement("button");
  actionButton.textContent = "View Tasks";
  actionButton.classList.add("actionButton");
  actionButton.onclick = function () {
    localStorage.setItem("SelectedEventName", event[1]);
    localStorage.setItem("SelectedEventId", event[0]);
    //checks if the task data csv is imported before moving to the task list page
    if (taskData.length === 0 || !taskData) {
      alertPopUp("Please import the task file first!");
    }
    //shows a message if no task is assigned for an event
    else if (filteredTasks.length === 0) {
      alertPopUp("No Tasks assigned for this event");
    } else {
      window.location.href = "taskListing.html";
    }
  };
  cellAction.appendChild(actionButton);
});

function calculateInitialStatus(event) {
  let startDate = new Date(event[2]);
  let endDate = new Date(event[3]);
  let currentDate = new Date();

  //if date is already over compared to current date
  if (startDate < currentDate && endDate < currentDate) {
    return "Failed";
  }
  //if date has not yet come
  else if (startDate > currentDate && endDate > currentDate) {
    return "Not Started";
  }
  //if current date falls between the start date and end date of the event
  else if (startDate <= currentDate && endDate >= currentDate) {
    return "In Progress";
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
