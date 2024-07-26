let fileInput = document.getElementById("csv-input");
let eventData = JSON.parse(localStorage.getItem("EventData")) || [];
let fileType;
let fileInputType;
let progressCount;
let indexOfFirstOccurence;
let listOfEventsInTask;
let eventIdList;
let delimiter = ",";
let newLine = "\n";

function readFile() {
  fileType = document.getElementById("csv-input-type").value;
  let file = fileInput.files[0];

  if (!fileType || fileType === "Choose Type") {
    alertPopUp("Please select the file type.");
    return;
  }

  if (!file) {
    alertPopUp("Please select a file to upload.");
    return;
  }

  if (file.type !== "text/csv") {
    alertPopUp("Please upload a CSV file.");
    document.getElementById("csv-input").value = "";
    return;
  }

  let reader = new FileReader();
  reader.onload = function (event) {
    let csvData = event.target.result;
    processCSV(csvData, fileType);
  };
  reader.readAsText(file);
}

function processCSV(data, fileType) {
  let rows = data.split(newLine);
  let headers = rows
    .shift()
    .split(delimiter)
    .map((header) => header.trim());

  let expectedHeadersEvent = ["id", "event_name", "start_date", "end_date"];
  let expectedHeadersTask = ["task_id", "task_name", "event_id"];

  let isValidHeader = false;

  if (fileType === "Event") {
    isValidHeader = validateHeaders(headers, expectedHeadersEvent);
  } else if (fileType === "Task") {
    isValidHeader = validateHeaders(headers, expectedHeadersTask);
  }

  if (!isValidHeader) {
    alertPopUp("CSV file headers do not match the expected headers.");
    resetFields();
    return;
  }

  storeCSVData(fileType, rows);
  resetFields();
}

function validateHeaders(headers, expectedHeaders) {
  for (let x of expectedHeaders) {
    if (!headers.includes(x)) {
      return false;
    }
  }
  return true;
}

function storeCSVData(type, rows) {
  let data = rows.map((row) => row.split(delimiter).map((cell) => cell.trim()));
  let validData = [];
  eventIdList = [];
  progressCount = 0;
  let isValidData = true;
  eventData.forEach((event) => {
    eventIdList.push(event[0]);
  });
  
  if (type === "Event") {
    localStorage.clear();
    data.forEach((element, index) => {
      if (element.includes("") || element.length !== 4) {
        alertPopUp(
          `Invalid data: Null or empty value found in the entry ${index + 1}.`
        );
        isValidData = false;
        return;
      }

      let startDate = new Date(element[2]);
      let endDate = new Date(element[3]);
      let currentDate = new Date();

      if (startDate > endDate) {
        alertPopUp(
          `Invalid date inputs! The start date is after the end date for the entry ${
            index + 1
          }.`
        );
        isValidData = false;
        return;
      }

      if (startDate <= currentDate && endDate >= currentDate) {
        progressCount += 1;
      }

      if (progressCount == 1) {
        indexOfFirstOccurence = `${index + 1}`;
      }

      if (progressCount > 1) {
        alertPopUp(
          `No two events can be in progress state at a time. There's already an event in progress entered in the entry ${indexOfFirstOccurence}. Reschedule and upload the file!`
        );
        isValidData = false;
        return;
      }

      validData.push(element);
    });
  } else if (type === "Task") {
    listOfEventsInTask = [];
    data.forEach((element, index) => {
      if (element.includes("") || element.length !== 3) {
        alertPopUp(
          `Invalid data: Null or empty value found in the entry ${index + 1}.`
        );
        isValidData = false;
        return;
      }

      listOfEventsInTask.push(element[2]);
      validData.push(element);
    });

    for (let x in listOfEventsInTask) {
      if (!eventIdList.includes(listOfEventsInTask[x])) {
        alertPopUp(
          "There are tasks for the events not mentioned in the Event CSV."
        );
      }
    }
  }

  if (isValidData) {
    localStorage.setItem(type + "Data", JSON.stringify(validData));
    alertPopUp("File imported successfully.");
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

function resetFields() {
  fileInput.value = "";
  document.getElementById("csv-input-type").value = "Choose Type";
}
