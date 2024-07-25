const eventId = localStorage.getItem("SelectedEventId");
const eventName = localStorage.getItem("SelectedEventName");

if (eventId) {
  const taskData = JSON.parse(localStorage.getItem("TaskData")) || [];
  const filteredTasks = taskData.filter((task) => task[2] === eventId);

  const taskTableBody = document.getElementById("task-table-body");

  filteredTasks.forEach((task) => {
    const row = taskTableBody.insertRow();

    const cellTaskId = row.insertCell(0);
    const cellTaskName = row.insertCell(1);
    const cellStatus = row.insertCell(2);

    cellTaskId.textContent = task[0];
    cellTaskName.textContent = task[1];

    const statusDropdown = document.createElement("select");
    statusDropdown.onchange = function(){
      taskStatusSetter(this);
    }
    const statuses = ["Not Started", "In Progress", "Completed"];
    statuses.forEach((status) => {
      const option = document.createElement("option");
      option.value = status;
      option.textContent = status;
      
      statusDropdown.appendChild(option);
    });

    cellStatus.appendChild(statusDropdown);
  });

  document.getElementById("event-name-value").textContent = eventName;
} else {
  document.getElementById("event-name-value").textContent = "No event selected";
}


function taskStatusSetter(selectedOption){
  console.log(selectedOption.value);
}