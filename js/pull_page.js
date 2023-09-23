var Opt_grade = [];
var Opt_Subject = {};
var info;
var Subject_History = [];
var grade_list = [];

document.addEventListener("DOMContentLoaded", function () {
  //data filter
  var button = document.getElementById("button_target");
  button.addEventListener("click", function (event) {
    event.preventDefault();
    var table = document.getElementById("table_target");
    table.innerHTML =
      "<tr><th>年級</th><th>科目</th><th>老師</th><th>季度</th><th>類別</th><th>檔案下載</th><th>檔案類別</th><th>檔案預覽</th><th>貢獻者</th></tr>";
    var form = document.getElementById("form_target");
    var formData = new FormData(form);
    var sub_list = [];
    formData.forEach(function (value, key) {
      if (key.includes("subject_")) {
        sub_list.push(str_parser(key, 8));
      }
    });
    setTable(sub_list);
  });

  // clear all subject checkbox
  var clear = document.getElementById("clear");
  clear.addEventListener("click", function (event) {
    event.preventDefault();
    var subjectElement = document.getElementById("span_subject");
    var checkboxes = subjectElement.querySelectorAll('input[type="checkbox"]');
    for (var i = 0; i < checkboxes.length; i++) {
      checkboxes[i].checked = false;
    }
  });

  //stupid method, To improve in the future
  var form = document.getElementById("form_target");
  form.addEventListener("change", function (event) {
    var formData = new FormData(form);
    var g_all_flag = 1;
    var g_c_flag = 0;
    var tem_g_list = [];
    var tem_s_list = [];
    formData.forEach(function (value, key) {
      if (key == "grade_ALL") {
        tem_g_list.push(key);
        for (var i = 1; i < Opt_grade.length; i++) {
          var tem = document.getElementById(Opt_grade[i]);
          tem.disabled = true;
          tem.checked = false;
        }
        g_all_flag = 0;
      } else {
        if (key.includes("grade_")) {
          tem_g_list.push(key);
        } else {
          if (key == "subject_ALL") {
            var subjectElement = document.getElementById("span_subject");
            var checkboxes = subjectElement.querySelectorAll(
              'input[type="checkbox"]'
            );
            tem_s_list = [];
            for (var i = 1; i < checkboxes.length; i++) {
              checkboxes[i].checked = true;
              tem_s_list.push(checkboxes[i].name);
            }
            s_all_flag = 0;
          } else {
            tem_s_list.push(key);
          }
        }
      }
    });

    if (tem_g_list.includes("grade_ALL")) {
      tem_g_list = ["grade_ALL"];
    }
    if (tem_g_list.length == grade_list.length) {
      for (var i = 0; i < tem_g_list.length; i++) {
        if (!grade_list.includes(tem_g_list[i])) {
          g_c_flag = 1;
          grade_list = tem_g_list;
          break;
        }
      }
    } else {
      g_c_flag = 1;
      grade_list = tem_g_list;
    }
    if (g_all_flag) {
      for (var i = 1; i < Opt_grade.length; i++) {
        var tem = document.getElementById(Opt_grade[i]);
        tem.disabled = false;
      }
    }

    if (!g_c_flag) {
      if (tem_s_list.length == Subject_History.length) {
        for (var i = 0; i < tem_s_list.length; i++) {
          if (!Subject_History.includes(tem_s_list[i])) {
            Subject_History = tem_s_list;
            break;
          }
        }
      } else {
        Subject_History = tem_s_list;
      }
    }

    if (g_c_flag) {
      setSubject(grade_list, Subject_History);
    }
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
      info = data;
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
              newRow.insertCell().innerHTML = `<a href='${data[key][i]}' target="_blank">預覽</a>`;
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
      for (var i = 0; i < Object.keys(data["Opt_grade"]).length; i++) {
        Opt_grade.push(`grade_${data["Opt_grade"][i]}`);
        Opt_Subject[data["Opt_grade"][i]] = data[data["Opt_grade"][i]];
        var input = document.createElement("input");
        var label = document.createElement("label");
        input.type = "checkbox";
        input.name = `grade_${data["Opt_grade"][i]}`;
        input.id = `grade_${data["Opt_grade"][i]}`;
        label.textContent = `${data["Opt_grade"][i]}\t`;
        gradeElement.appendChild(input);
        gradeElement.appendChild(label);
        if (i % 5 == 0) {
          var br = document.createElement("br");
          gradeElement.appendChild(br);
        }
      }
      subjectElement = document.getElementById("span_subject");
      for (var i = 0; i < Object.keys(data["ALL"]).length + 1; i++) {
        if (!i) {
          var input = document.createElement("input");
          var label = document.createElement("label");
          input.type = "checkbox";
          input.name = `subject_ALL`;
          input.id = `subject_ALL`;
          label.textContent = `ALL\t`;
          subjectElement.appendChild(input);
          subjectElement.appendChild(label);
        } else {
          var input = document.createElement("input");
          var label = document.createElement("label");
          input.type = "checkbox";
          input.name = `subject_${data["ALL"][i - 1]}`;
          input.id = `subject_${data["ALL"][i - 1]}`;
          label.textContent = `${data["ALL"][i - 1]}\t`;
          subjectElement.appendChild(input);
          subjectElement.appendChild(label);
        }
        if (i % 5 == 0) {
          var br = document.createElement("br");
          subjectElement.appendChild(br);
        }
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
function setSubject(list, history) {
  var subjectElement = document.getElementById("span_subject");
  subjectElement.innerHTML = "<legend>科目</legend>";
  var cnt = 0;
  for (var i = 0; i < list.length; i++) {
    var course = str_parser(list[i], 6);
    for (var j = 0; j < Opt_Subject[course].length; j++) {
      if (!cnt) {
        var input = document.createElement("input");
        var label = document.createElement("label");
        input.type = "checkbox";
        input.name = `subject_ALL`;
        input.id = `subject_ALL`;
        label.textContent = `ALL\t`;
        subjectElement.appendChild(input);
        subjectElement.appendChild(label);
      }
      if (cnt % 5 == 0) {
        var br = document.createElement("br");
        subjectElement.appendChild(br);
      }
      var input = document.createElement("input");
      var label = document.createElement("label");
      input.type = "checkbox";
      if (history.includes("subject_" + Opt_Subject[course][j])) {
        input.checked = true;
      }
      input.name = `subject_${Opt_Subject[course][j]}`;
      input.id = `subject_${Opt_Subject[course][j]}`;
      label.textContent = `${Opt_Subject[course][j]}\t`;
      subjectElement.appendChild(input);
      subjectElement.appendChild(label);

      cnt++;
    }
  }
}

function setTable(opt) {
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
  for (var i = 0; i < Object.keys(info[keys[0]]).length; i++) {
    if (opt.includes(info["subject"][i])) {
      newRow = table.insertRow();
      for (key of keys) {
        if (key == "file_name") {
          newRow.insertCell().innerHTML = `<a href='${info[`file_link`][i]}'>${
            info[key][i]
          }</a>`;
        } else {
          if (key == "url") {
            newRow.insertCell().innerHTML = `<a href='${info[key][i]}' target="_blank">預覽</a>`;
          } else {
            if (key == "file_link") {
              continue;
            } else {
              newRow.insertCell().innerHTML = info[key][i];
            }
          }
        }
      }
    }
  }
}

//a tool to parse str easier
function str_parser(str, start, end) {
  ans = "";
  if (start < 0) start = str.length + start;
  if (end && end < 0) end = str.length + end;
  if (end && end < start) str = str.split("").reverse().join("");
  if (end) {
    while (start <= end) {
      ans += str[start];
      start++;
    }
  } else {
    while (start < str.length) {
      ans += str[start];
      start++;
    }
  }

  return ans;
}

window.onload = function () {
  reset();
  //start common js
  load_start();
};
