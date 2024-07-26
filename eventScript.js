  const eventTableBody = document.getElementById("event-table-body");
  const eventData = JSON.parse(localStorage.getItem("EventData")) || [];
  const eventStatusData = JSON.parse(localStorage.getItem("EventStatusData")) || [];

  eventData.forEach((event, index) => {
    const row = eventTableBody.insertRow();

    const cellEventId = row.insertCell(0);
    const cellEventName = row.insertCell(1);
    const cellStartDate = row.insertCell(2);
    const cellEndDate = row.insertCell(3);
    const cellStatus = row.insertCell(4);
    const cellAction = row.insertCell(5);

    cellEventId.textContent = event[0];
    cellEventName.textContent = event[1];
    cellStartDate.textContent = event[2];
    cellEndDate.textContent = event[3];

    const status = document.createElement("label");
    status.id = `status-${event[0]}`;
    status.textContent = eventStatusData[index] || calculateInitialStatus(event);
    cellStatus.appendChild(status);

    const actionButton = document.createElement("button");
    actionButton.textContent = "View Tasks";
    actionButton.onclick = function () {
      localStorage.setItem("SelectedEventName", event[1]);
      localStorage.setItem("SelectedEventId", event[0]);
      window.location.href = "taskListing.html";
    };
    cellAction.appendChild(actionButton);
  });

function calculateInitialStatus(event) {
  const startDate = new Date(event[2]);
  const endDate = new Date(event[3]);
  const currentDate = new Date();

  if (startDate < currentDate && endDate < currentDate) {
    return "Failed";
  } else if (startDate > currentDate && endDate > currentDate) {
    return "Not Started";
  } else if (startDate < currentDate && endDate > currentDate) {
    return "In Progress";
  }
  return "Unknown";
}

function updateEventStatus(eventId) {
  const eventData = JSON.parse(localStorage.getItem("EventData")) || [];
  const taskData = JSON.parse(localStorage.getItem("TaskData")) || [];
  const taskStatusData = JSON.parse(localStorage.getItem("TaskStatusData")) || {};
  const eventStatusData = JSON.parse(localStorage.getItem("EventStatusData")) || [];

  const eventIndex = eventData.findIndex(event => event[0] === eventId);
  const tasksForEvent = taskData.filter(task => task[2] === eventId);

  let status = 'Not Started';
  let inProgressCount = 0;
  let completedCount = 0;

  tasksForEvent.forEach(task => {
    const taskId = task[0];
    const taskStatus = taskStatusData[taskId] || 'Not Started';

    if (taskStatus === 'In Progress') {
      inProgressCount++;
    } else if (taskStatus === 'Completed') {
      completedCount++;
    }
  });

  if (inProgressCount == 1) {
    status = 'In Progress';
  } else if (completedCount === tasksForEvent.length) {
    status = 'Completed';
  }

  eventStatusData[eventIndex] = status;
  localStorage.setItem('EventStatusData', JSON.stringify(eventStatusData));

  const statusLabel = document.getElementById(`status-${eventId}`);
  if (statusLabel) {
    statusLabel.textContent = status;
  }
}