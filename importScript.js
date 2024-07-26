let fileInput = document.getElementById("csv-input");
let fileType;
let fileInputType;
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

  const reader = new FileReader();
  reader.onload = function (event) {
    const csvData = event.target.result;
    processCSV(csvData, fileType);
  };
  reader.readAsText(file);
}

function processCSV(data, fileType) {
  const rows = data.split(newLine);
  const headers = rows
    .shift()
    .split(delimiter)
    .map((header) => header.trim());
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
  const data = rows.map((row) =>
    row.split(delimiter).map((cell) => cell.trim())
  );
  const validData = [];
  let isValidData = true;

  if (type === "Event") {
    data.forEach((element, index) => {
      if (element.includes("") || element.length !== 4) {
        alertPopUp(
          `Invalid data: Null or empty value found in the entry ${index + 1}.`
        );
        isValidData = false;
        return;
      }

      const startDate = new Date(element[2]);
      const endDate = new Date(element[3]);
      if (startDate > endDate) {
        alertPopUp(
          `Invalid date inputs! The start date is after the end date for the entry ${
            index + 1
          }.`
        );
        isValidData = false;
        return;
      }

      validData.push(element);
    });
  } else if (type === "Task") {
    data.forEach((element, index) => {
      if (element.includes("") || element.length !== 3) {
        alertPopUp(
          `Invalid data: Null or empty value found in the entry ${index + 1}.`
        );
        isValidData = false;
        return;
      }

      validData.push(element);
    });
  }

  if (isValidData) {
    localStorage.setItem(type + "Data", JSON.stringify(validData));
    alertPopUp("File imported successfully.");
  }
}

function alertPopUp(errorMsg) {
  var snackbar = document.getElementById("snackbar");
  snackbar.className = "show";
  snackbar.textContent = errorMsg;
  setTimeout(function () {
    snackbar.className = snackbar.className.replace("show", "");
  }, 3000);
}
