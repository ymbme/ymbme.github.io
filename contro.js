document.addEventListener("DOMContentLoaded", function () {
  var button = document.getElementById("button_target");

  button.addEventListener("click", function (event) {
    event.preventDefault();
    var table = document.getElementById("table_target");
    while (table.rows.length > 1) {
      table.deleteRow(1);
    }
    var form = document.getElementById("form_target");
    var formData = new FormData(form);
    var formDataObject = {};
    formData.forEach(function (value, key) {
      formDataObject[key] = value;
    });
    console.log(formDataObject);
  });
});

function reset() {
  const gas_api =
    "https://script.google.com/macros/s/AKfycbwGoYBJI2km7jV7PMfBKFMjjnbQZuGSPLM6y55bT-P1B61K7fl-3kjWNmAOr_rbuT9nmQ/exec";
  fetch(gas_api)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      keys = [
        "grade",
        "subject",
        "teacher",
        "season",
        "cls",
        "file_name",
        "file_type",
        "url",
        "file_link",
        "Donor",
      ];
      var table = document.getElementById("table_target");
      for (var i = 0; i < Object.keys(data[keys[0]]).length; i++) {
        newRow = table.insertRow();
        for (key of keys) {
          if (key == "file_name") {
            newRow.insertCell().innerHTML = `<a href='${
              data[`file_link`][i]
            }'>${data[key][i]}</a>`;
          } else {
            if (key == "url") {
              newRow.insertCell().innerHTML = `<a href='${data[key][i]}'>連結</a>`;
            } else {
              if (key == "file_link") {
                continue;
              } else {
                newRow.insertCell().innerHTML = data[key][i];
              }
            }
          }
        }
      }
      gradeElement = document.getElementById("span_grade");
      for (
        var i = gradeElement.length;
        i < Object.keys(data["Opt_grade"]).length;
        i++
      ) {
        var option = document.createElement("option");
        option.value = data["Opt_grade"][i];
        option.textContent = data["Opt_grade"][i];
        option.style.color = "blue";
        gradeElement.appendChild(option);
      }
      subjectElement = document.getElementById("span_subject");
      for (
        var i = subjectElement.length;
        i < Object.keys(data["ALL"]).length;
        i++
      ) {
        var option = document.createElement("option");
        option.value = data["ALL"][i];
        option.textContent = data["ALL"][i];
        option.style.color = "blue";
        subjectElement.appendChild(option);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function setTable(opt) {}

window.onload = function () {
  reset();
};
