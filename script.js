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
