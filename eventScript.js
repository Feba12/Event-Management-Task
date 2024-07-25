const eventTable = document
  .getElementById("event-table")
  .getElementsByTagName("tbody")[0];
const eventData = JSON.parse(localStorage.getItem("EventData")) || [];

eventData.forEach((event) => {
  const row = eventTable.insertRow();

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

  const statusDropdown = document.createElement("select");
  const statuses = ["Failed", "In Progress", "Completed"];
  statuses.forEach((status) => {
    const option = document.createElement("option");
    option.value = status;
    option.textContent = status;
    statusDropdown.appendChild(option);
  });
  cellStatus.appendChild(statusDropdown);

  const actionButton = document.createElement("button");
  actionButton.textContent = "View Tasks";
  actionButton.addEventListener("click", function () {
    localStorage.setItem("SelectedEvent", event[1]);
    window.location.href = "taskListing.html";
  });
  cellAction.appendChild(actionButton);
});