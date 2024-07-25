const eventTableBody = document.getElementById("event-table-body");
const eventData = JSON.parse(localStorage.getItem("EventData")) || [];

eventData.forEach((event) => {
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

  console.log(new Date());
  console.log(new Date(cellStartDate.textContent));

  const status = document.createElement("label");
  if (
    new Date(cellStartDate.textContent) < new Date() &&
    new Date(cellEndDate.textContent) < new Date()
  ) {
    status.textContent = "Failed";
  }

  if (
    new Date(cellStartDate.textContent) > new Date() &&
    new Date(cellEndDate.textContent) > new Date()
  ) {
    status.textContent = "Not Started";
  }

  if (
    new Date(cellStartDate.textContent) < new Date() &&
    new Date(cellEndDate.textContent) > new Date()
  ) {
    status.textContent = "In Progress";
  }

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

function formatDate(date) {
  let day = date.getDate();
  if (day < 10) {
    day = "0" + day;
  }
  let month = date.getMonth() + 1;
  if (month < 10) {
    month = "0" + month;
  }
  let year = date.getFullYear();
  return day + "-" + month + "-" + year;
}
