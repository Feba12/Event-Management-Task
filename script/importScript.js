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

  //If the file type is not chosen as Event or Task
  if (!fileType || fileType === "Choose Type") {
    alertPopUp("Please select the file type.");
    return;
  }

  //If no files are present
  if (!file) {
    alertPopUp("Please select a file to upload.");
    return;
  }

  //If any other format file is uploaded
  if (file.type !== "text/csv") {
    alertPopUp("Please upload a CSV file.");
    document.getElementById("csv-input").value = "";
    return;
  }

  // Read and process the file when there's no errors or mismatches
  let reader = new FileReader();
  reader.onload = function (event) {
    let csvData = event.target.result;
    processCSV(csvData, fileType);
  };
  reader.readAsText(file);
}

function processCSV(data, fileType) {
  //Seperate each line of the CSV data loaded when a newLine is encountered
  let rows = data.split(newLine);
  //Remove the first line and store in an array as header elements after trimming off newline and empty spaces
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
  //check if the headers from csv contains all the expected headers in the same order
  for (let x of expectedHeaders) {
    if (!headers.includes(x)) {
      return false;
    }
  }
  return true;
}

//Function to store the data based on the type of file
function storeCSVData(type, rows) {
  //Store the remaining data after header removal in an array after trimming off newline and empty spaces
  let data = rows.map((row) => row.split(delimiter).map((cell) => cell.trim()));
  let validData = [];
  eventIdList = [];
  progressCount = 0;
  let isValidData = true;
  //Store all the event IDs in the eventIdList
  eventData.forEach((event) => {
    eventIdList.push(event[0]);
  });

  if (type === "Event") {
    //Clear all existing data in the local storage when a new EventCSV is added
    localStorage.clear();
    data.forEach((element, index) => {
      //check if there's any null or extra entries in the data
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

      //check for invalid date entries
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

      //check if there's any event colliding in the same date that is already in progress
      if (progressCount > 1) {
        alertPopUp(
          `No two events can be in progress state at a time. There's already an event in progress entered in the entry ${indexOfFirstOccurence}. Reschedule and upload the file!`
        );
        isValidData = false;
        return;
      }

      //Add all the valid data to the array
      validData.push(element);
    });
  } else if (type === "Task") {
    //array to store the list of events in the task csv
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

    //If there's any task whose event id is not present in the event list, display a message
    for (let x in listOfEventsInTask) {
      if (!eventIdList.includes(listOfEventsInTask[x])) {
        alertPopUp(
          "There are tasks for the events not mentioned in the Event CSV."
        );
      }
    }
  }

  if (isValidData) {
    //Store all the valid data in the local storage
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

//Function to reset the type input and file selection field
function resetFields() {
  fileInput.value = "";
  document.getElementById("csv-input-type").value = "Choose Type";
}
