// var inputFile = document.getElementById("customFileInput");

// inputFile.addEventListener("change", function (event) {
//   var fileData = event.target.files[0]; // 檔案資訊
// });

// store all data to avoid lag
var info;

function reset() {
  const gas_pull_api =
    "https://script.google.com/macros/s/AKfycbwGoYBJI2km7jV7PMfBKFMjjnbQZuGSPLM6y55bT-P1B61K7fl-3kjWNmAOr_rbuT9nmQ/exec";
  fetch(gas_pull_api)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      info = data;
      //set selection of grade
      var grade = document.getElementById("grade");
      for (var i = 0; i < info["Opt_grade"].length; i++) {
        var option = document.createElement("option");
        option.value = info["Opt_grade"][i];
        option.textContent = info["Opt_grade"][i];
        option.style.color = "blue";
        grade.appendChild(option);
      }

      //set selection of subject
      subject = document.getElementById("subject");
      //ignore case i=1, because value = all
      for (var i = 1; i < info["ALL"].length; i++) {
        var option = document.createElement("option");
        option.value = info["ALL"][i];
        option.textContent = info["ALL"][i];
        option.style.color = "blue";
        subject.appendChild(option);
      }
      var option = document.createElement("option");
      option.value = "其他Other";
      option.textContent = "其他Other";
      option.style.color = "blue";
      subject.appendChild(option);

      //set selection of season
      season = document.getElementById("season");
      var option = document.createElement("option");
      option.value = "自訂";
      option.textContent = "自訂";
      option.style.color = "blue";
      season.appendChild(option);
      for (var i = 1; i < info["season"].length; i++) {
        var option = document.createElement("option");
        option.value = info["season"][i];
        option.textContent = info["season"][i];
        option.style.color = "blue";
        season.appendChild(option);
      }

      cls = document.getElementById("cls");
      for (var i = 1; i < info["cls"].length; i++) {
        var option = document.createElement("option");
        option.value = info["cls"][i];
        option.textContent = info["cls"][i];
        option.style.color = "blue";
        cls.appendChild(option);
      }
      var option = document.createElement("option");
      option.value = "其他Other";
      option.textContent = "其他Other";
      option.style.color = "blue";
      cls.appendChild(option);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

window.onload = function () {
  //reset
  reset();
  //start common js
  load_start();

  //if grade changed, modify subject selection
  var grade = document.getElementById("grade");
  grade.addEventListener("change", function () {
    var subject = document.getElementById("subject");
    subject.innerHTML = "";
    for (var i = 1; i < info[grade.value].length; i++) {
      var option = document.createElement("option");
      option.value = info[grade.value][i];
      option.textContent = info[grade.value][i];
      option.style.color = "blue";
      subject.appendChild(option);
    }
    var option = document.createElement("option");
    option.value = "其他Other";
    option.textContent = "其他Other";
    option.style.color = "blue";
    subject.appendChild(option);
  });

  //if have new subject, domostrate input box
  var subject = document.getElementById("subject");
  var NewSubElement = document.getElementById("NewSubject");
  subject.addEventListener("change", function () {
    if (subject.value === "其他Other") {
      NewSubElement.style.display = "block";
    } else {
      NewSubElement.style.display = "none";
    }
  });

  //if have no new season, dont't show input box
  var season = document.getElementById("season");
  var NewSeason = document.getElementById("NewSeason");
  season.addEventListener("change", function () {
    if (season.value === "自訂") {
      NewSeason.style.display = "block";
      NewSeason.required = true;
    } else {
      NewSeason.style.display = "none";
      NewSeason.required = false;
    }
  });

  //if have new class, domostrate input box
  var cls = document.getElementById("cls");
  var NewclsElement = document.getElementById("Newcls");
  cls.addEventListener("change", function () {
    if (cls.value === "其他Other") {
      NewclsElement.style.display = "block";
      NewclsElement.required = true;
    } else {
      NewclsElement.style.display = "none";
      NewclsElement.required = false;
    }
  });

  //show data info
  var inputFile = document.getElementById("customFileInput");
  inputFile.addEventListener(
    "change",
    function (e) {
      var fileData = e.target.files[0]; // 檔案資訊
      var fileName = fileData.name; // 檔案名稱
      var fileType = fileData.type; // 檔案類型
      var fileSize = Math.floor(fileData.size * 0.001); // 檔案大小轉成kb
      var fileTime = fileData.lastModifiedDate;

      document.getElementById("file_name").innerText = fileName;
      document.getElementById("file_type").innerText = fileType;
      document.getElementById("file_size").innerText = fileSize + "kb";
      document.getElementById("file_time").innerText = fileTime;

      //no thumbnail
      // document.getElementById("file_thumbnail").src =
      //   URL.createObjectURL(fileData);
    },
    false
  );

  //submit
  var form = document.getElementById("form_target");
  form.addEventListener("submit", function (event) {
    //avoid reload
    event.preventDefault();
    var formData = new FormData(form);
    var data = {};
    formData.forEach(function (value, key) {
      data[key] = value;
    });
    console.log(data);
  });
};
