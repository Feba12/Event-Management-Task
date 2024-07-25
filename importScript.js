const fileInput = document.getElementById("csv-input");
let delimiter = ",";
let newLine = "\n";

const readFile = () => {
  if (!fileInput) {
    let noFileFound = "Please upload a file!";
    alertPopUp(noFileFound);
  }

  const reader = new FileReader();

  reader.onload = () => {
    localStorage.setItem("csvData", JSON.stringify(reader.result));
  };

  let content = reader.readAsText(fileInput.files[0]);
  toTable(content);
};

function toTable(content) {
  let rows = content.split(newLine);
  let CSVHeader = rows.shift().split(delimiter);
}

function alertPopUp(errorMsg) {
  var snackbar = document.getElementById("snackbar");
  snackbar.className = "show";
  snackbar.textContent = errorMsg;
  setTimeout(function () {
    snackbar.className = snackbar.className.replace("show", "");
  }, 3000);
}





document.getElementById('csv-input').addEventListener('change', readFile);

function readFile() {
  const fileInput = document.getElementById('csv-input');
  const fileType = document.getElementById('csv-input-type').value;
  const file = fileInput.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = function(event) {
      const csvData = event.target.result;
      processCSV(csvData, fileType);
    };
    reader.readAsText(file);
  } else {
    showSnackbar("Please select a file to upload.");
  }
}

function processCSV(data, fileType) {
  const rows = data.split('\n');
  const headers = rows[0].split(',');

  const expectedHeadersEvent = ['Event Id', 'Event Name', 'Start Date', 'End Date'];
  const expectedHeadersTask = ['Task Id', 'Task Name', 'Event Name'];

  let isValid = false;

  if (fileType === 'Event') {
    isValid = validateHeaders(headers, expectedHeadersEvent);
  } else if (fileType === 'Task') {
    isValid = validateHeaders(headers, expectedHeadersTask);
  }

  if (!isValid) {
    showSnackbar("CSV file headers do not match the expected headers.");
    return;
  }

  storeCSVData(fileType, rows);
  showSnackbar("File imported successfully.", true);
}

function validateHeaders(headers, expectedHeaders) {
  for (const expectedHeader of expectedHeaders) {
    if (!headers.includes(expectedHeader)) {
      return false;
    }
  }
  return true;
}

function storeCSVData(type, rows) {
  const data = rows.slice(1).map(row => row.split(','));
  localStorage.setItem(type + 'Data', JSON.stringify(data));
}

function showSnackbar(message, success = false) {
  const snackbar = document.getElementById('snackbar');
  snackbar.className = "show";
  snackbar.textContent = message;
  snackbar.style.backgroundColor = success ? "green" : "red";
  setTimeout(function() {
    snackbar.className = snackbar.className.replace("show", "");
  }, 3000);
}
