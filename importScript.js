let fileInput = document.getElementById("csv-input");
let fileType;
let fileInputType;
let delimiter = ",";
let newLine = "\n";

function readFile() {
  let fileType = document.getElementById("csv-input-type").value;
  let file = fileInput.files[0];
  console.log(file);
  if (file && file.type === "text/csv") {
    const reader = new FileReader();
    reader.onload = function (event) {
      const csvData = event.target.result;
      processCSV(csvData, fileType);
    };
    reader.readAsText(file);
  } else if (fileType != "Event" || fileType != "Task") {
    alertPopUp("Please select the file type.");
  } else if (!file) {
    alertPopUp("Please select a file to upload.");
    document.getElementById("csv-input").value = "";
  } else if (file.type !== "text/csv") {
    alertPopUp("Please upload a CSV file.");
    document.getElementById("csv-input").value = "";
  }
}

function processCSV(data, fileType) {
  const rows = data.split(newLine);
  const headers = rows.shift().split(delimiter);
  console.log(headers);

  const expectedHeadersEvent = ["id", "event_name", "start_date", "end_date"];
  const expectedHeadersTask = ["task_id", "task_name", "event_id"];

  let isValid = false;

  if (fileType === "Event") {
    isValid = validateHeaders(headers, expectedHeadersEvent);
  } else if (fileType === "Task") {
    isValid = validateHeaders(headers, expectedHeadersTask);
  }

  if (!isValid) {
    alertPopUp("CSV file headers do not match the expected headers.");
    fileInput.value = "";
    document.getElementById("csv-input-type").value = "Choose Type";
    return;
  }

  storeCSVData(fileType, rows);
  alertPopUp("File imported successfully.");
  fileInput.value = "";
  document.getElementById("csv-input-type").value = "Choose Type";
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
  const data = rows.map((row) => row.split(","));
  if (type === "Event") {
    data.forEach((element, index) => {
      console.log(new Date(element[2]));
      if (new Date(element[2]) > new Date(element[3])) {
        alertPopUp(
          `Invalid date inputs! The start date is after the end date for the entry ${
            index + 1
          }.`
        );
      } else {
        localStorage.setItem(type + "Data", JSON.stringify(data));
      }
    });
  }
  localStorage.setItem(type + "Data", JSON.stringify(data));
}

function alertPopUp(errorMsg) {
  var snackbar = document.getElementById("snackbar");
  snackbar.className = "show";
  snackbar.textContent = errorMsg;
  setTimeout(function () {
    snackbar.className = snackbar.className.replace("show", "");
  }, 3000);
}
