var info;
var now_subject = [];

window.onload = function () {
  load_start();
  if (sessionStorage.getItem("userid")) {
    //keeping sign-in state
    setCritic(
      sessionStorage.getItem("userid"),
      sessionStorage.getItem("useremail")
    );
  } else {
    // 取得當前網址
    var currentURL = window.location.href;

    // 解析URL，尋找並取得code參數的值
    function getParameterByName(name, url) {
      if (!url) url = window.location.href;
      name = name.replace(/[\[\]]/g, "\\$&");
      var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return "";
      return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    // 從當前網址中取得code參數的值
    var codeValue = getParameterByName("code", currentURL);

    // 做後續的應用，使用獲得的codeValue進行相應處理
    if (codeValue) {
      // 在這裡可以使用 codeValue 來執行後續的應用邏輯
      console.log("獲得的code值為：", codeValue);
      var tokenEndpoint = "https://id.nycu.edu.tw/o/token/";
      var postData = {
        grant_type: "authorization_code",
        code: codeValue,
        client_id: "FGcGG5HjwMoqTkmafxws1ggDsGG0hPZqSm8k5T0z",
        client_secret:
          "ROkFWhXLGSfECEeqkRtEAOvwHoMOkmh7gbPX7i4HBhm1xw7eza12MxIzQdPmxTLCAtlrYep2FmGw8VJTTBFpeqk3K9kKkEz4QLFGEHgribCr1UuCMeoqRr7KgHX1mVlK",
        redirect_uri: "https://ymbme.github.io/feedback.html", // 授權時使用的重新導向URI
      };
      $.ajax({
        url: tokenEndpoint,
        method: "POST",
        contentType: "application/x-www-form-urlencoded",
        data: postData,
        success: function (response) {
          // 請求成功，得到存取權杖
          var accessToken = response.access_token;
          console.log("獲得的存取權杖：", accessToken);

          // 使用存取權杖來存取受保護的資源等後續操作
          // 可以將 accessToken 用於 API 請求等
          // 使用存取權杖來向身份提供者的端點獲取使用者資訊的URL
          var profileEndpoint = "https://id.nycu.edu.tw/api/profile/";

          // 要發送的 GET 請求
          fetch(profileEndpoint, {
            method: "GET",
            headers: {
              Authorization: "Bearer " + accessToken, // 將存取權杖加入請求的 Authorization 標頭中
            },
          })
            .then((response) => {
              // 請求成功，處理回應
              if (!response.ok) {
                throw new Error("獲取使用者資訊失敗");
              }
              return response.json();
            })
            .then((data) => {
              // 獲得使用者資訊
              sessionStorage.setItem("userid", data["username"]);
              sessionStorage.setItem("useremail", data["email"]);
              setCritic(data["username"], data["email"]);
            })
            .catch((error) => {
              // 處理錯誤
              console.error("錯誤：", error);
            });
        },
        error: function (error) {
          // 請求失敗，處理錯誤
          console.error("取得存取權杖失敗：", error);
        },
      });
    } else {
      const gas_api =
        "https://script.google.com/macros/s/AKfycbwDPQpKkFYCAEJsE1-nuDPo7amVVTAJC1tvlkOjkxuUBpGenlRyEgi7cPgejpUniJdJ/exec";
      fetch(gas_api)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          info = data;
          setTable();
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }
};

function GradeListener(element) {
  element.addEventListener("click", function (event) {
    // 阻止超連結的默認行為
    event.preventDefault();

    //set table
    const table = document.getElementById("table_point");
    table.innerHTML =
      "<tr><th>課程名稱</th><th>學期別</th><th>選別</th><th>給分甜度</th><th>難度</th><th>課本重要程度</th></tr>";

    for (var i = 0; i < info["課程"].length; i += 1) {
      var a = document.getElementById("grade_" + i);
      a.href = "#";
      a.textContent = a.textContent.replace(/^\*|\*$/g, "");
    }
    element.removeAttribute("href");
    element.textContent = "*" + element.textContent + "*";

    var subjectElement = document.getElementById("span_subject");

    //clear the subject
    subjectElement.innerHTML = "";
    var legend = document.createElement("legend");
    legend.textContent = "科目";
    subjectElement.append(legend);
    if (element.textContent != "*總覽*") {
      //grade
      var g = element.textContent.replace(/^\*|\*$/g, "");

      //set title
      document.getElementById("h1_point").innerHTML = `[${g}]的課程評鑑`;

      //convient to set subject
      now_subject = info[g];
      for (var i = 0; i < info[g].length; i += 1) {
        var a = document.createElement("a");
        a.textContent = `${info[g][i]}`;
        a.id = "subject_" + i;
        a.href = "#";
        a.style.padding = "10px";
        subjectElement.appendChild(a);
        SubjectListener(a);
        if (!(i % 5) && i)
          subjectElement.appendChild(document.createElement("br"));
        //set table
        var course = info[g][i];
        if (info["total"][course]) {
          for (season in info["total"][course]) {
            newRow = table.insertRow();
            newRow.insertCell().innerHTML = course;
            newRow.insertCell().innerHTML = season;
            newRow.insertCell().innerHTML = info["total"][course][season][3]; //type
            newRow.insertCell().innerHTML = info["total"][course][season][0]; //sweet
            newRow.insertCell().innerHTML = info["total"][course][season][1]; //difficult
            newRow.insertCell().innerHTML = info["total"][course][season][2]; //important
          }
        }
      }
    } else {
      document.getElementById("table_critic").innerHTML =
        "<tr><th>學期別</th><th>暱稱</th><th>成績</th><th>建議與心得</th></tr>";
      document.getElementById("h1_critic").innerHTML = "";

      document.getElementById("h1_point").innerHTML = "[總覽]的課程評鑑";
      for (course in info["total"]) {
        for (season in info["total"][course]) {
          newRow = table.insertRow();
          newRow.insertCell().innerHTML = course;
          newRow.insertCell().innerHTML = season;
          newRow.insertCell().innerHTML = info["total"][course][season][3]; //type
          newRow.insertCell().innerHTML = info["total"][course][season][0]; //sweet
          newRow.insertCell().innerHTML = info["total"][course][season][1]; //difficult
          newRow.insertCell().innerHTML = info["total"][course][season][2]; //important
        }
      }
    }
  });
}

function SubjectListener(element) {
  element.addEventListener("click", function (event) {
    // 阻止超連結的默認行為
    event.preventDefault();
    document.getElementById(
      "h1_critic"
    ).innerHTML = `${element.textContent} の 過來人心得`;
    var table = document.getElementById("table_critic");
    table.innerHTML =
      "<tr><th>學期別</th><th>暱稱</th><th>成績</th><th>建議與心得</th></tr>";
    var course = element.textContent;
    for (season in info["critic"][course]) {
      for (var i = 0; i < info["critic"][course][season].length; i += 1) {
        newRow = table.insertRow();
        newRow.insertCell().innerHTML = season;
        newRow.insertCell().innerHTML = info["critic"][course][season][i][0]; //name
        newRow.insertCell().innerHTML = info["critic"][course][season][i][1]; //grade
        newRow.insertCell().innerHTML = info["critic"][course][season][i][2]; //critic
      }
    }

    for (var i = 0; i < now_subject.length; i += 1) {
      var a = document.getElementById("subject_" + i);
      a.href = "#";
      a.textContent = a.textContent.replace(/^\*|\*$/g, "");
    }
    element.removeAttribute("href");
    element.textContent = "*" + element.textContent + "*";
  });
}

function ClearListener(Button, row, flag) {
  Button.addEventListener("click", function (event) {
    // 阻止超連結的默認行為
    event.preventDefault();
    if (flag) {
      row.remove();
    } else {
      defaultValues = [];
      const cells = row.getElementsByTagName("td");
      const g = [
        "",
        "A+",
        "A",
        "A-",
        "B+",
        "B",
        "B-",
        "C+",
        "C",
        "C-",
        "D",
        "E",
        "F",
        "P",
        "X",
        "W",
      ];
      //defaultValues[3], name
      var input_name = document.createElement("input");
      input_name.type = "text";
      input_name.maxLength = "8";
      input_name.size = "10";
      defaultValues.push(input_name);

      // defaultValues[4], grade
      var input_grade = document.createElement("select");
      for (i in g) {
        var tem_opt = document.createElement("option");
        tem_opt.value = g[i];
        tem_opt.textContent = g[i];
        input_grade.appendChild(tem_opt);
      }
      defaultValues.push(input_grade);

      // defaultValues[5], sweet
      var select_point = document.createElement("select");
      for (var i = 0; i <= 5; i++) {
        var option = document.createElement("option");
        option.value = i;
        option.textContent = i;
        select_point.appendChild(option);
      }
      defaultValues.push(select_point);

      // defaultValues[6], difficult
      var select_point = document.createElement("select");
      for (var i = 0; i <= 5; i++) {
        var option = document.createElement("option");
        option.value = i;
        option.textContent = i;
        select_point.appendChild(option);
      }
      defaultValues.push(select_point);

      // defaultValues[7], important
      var select_point = document.createElement("select");
      for (var i = 0; i <= 5; i++) {
        var option = document.createElement("option");
        option.value = i;
        option.textContent = i;
        select_point.appendChild(option);
      }
      defaultValues.push(select_point);

      // defaultValues[8], critic
      var input_critic = document.createElement("textarea");
      defaultValues.push(input_critic); //critic

      for (let i = 3; i < cells.length - 1; i++) {
        cells[i].innerHTML = "";
        cells[i].appendChild(defaultValues[i - 3]); // 設置每個單元格的值為預設值
      }
    }
  });
}

function SubmitListener(submit) {
  submit.addEventListener("click", function (event) {
    // 阻止超連結的默認行為
    event.preventDefault();

    if (!submit.dissable) {
      submit.dissable = true;
      var table = document
        .getElementById("form_critic")
        .getElementsByTagName("tbody")[0];
      var success_flag = 1;
      form_data = {};
      form_data["upload"] = {};

      //create user info
      form_data["userid"] = sessionStorage.getItem("userid");
      form_data["useremail"] = sessionStorage.getItem("useremail");

      repeat_list = []; //avoid repeat course
      //parse form data
      var tr = table.getElementsByTagName("tr");
      newrow_list = [];
      //avoid index 1 and last index
      for (var i = 1; i < tr.length - 1; i++) {
        td = tr[i].getElementsByTagName("td");
        select = td[0].getElementsByTagName("select")[0];
        var courseName;
        //creat course name
        if (select) {
          if (select.value == "其他Other") {
            courseName = td[0].getElementsByTagName("input")[0].value;
          } else courseName = select.value;
          newrow_list.push([tr[i], courseName]);
        } else courseName = td[0].textContent;

        //create json and check if repeat written
        if (courseName) {
          if (form_data["upload"][courseName]) {
            //repeat written
            alert(`上傳失敗\n*${courseName}* 重複填寫！請確認`);
            success_flag = 0;
            break;
          } else {
            //success create
            form_data["upload"][courseName] = {};
          }
        } else {
          //course-name in empty
          alert("上傳失敗！！\n你有一些課程名稱未填寫");
          success_flag = 0;
          break;
        }

        //write google-sheet-position
        form_data["upload"][courseName]["pos"] = td[0].value;

        //write season
        form_data["upload"][courseName]["season"] =
          td[1].getElementsByTagName("input")[0].value;

        //write course-type
        form_data["upload"][courseName]["type"] = td[2].textContent;

        //if any data has been writen, flag=1
        //if flag=1 and any data incomplete => error
        var error_flag = 0;

        //write name
        form_data["upload"][courseName]["name"] =
          td[3].getElementsByTagName("input")[0].value;
        if (form_data["upload"][courseName]["name"] != "") error_flag = 1;

        //write grade
        var grade_select = td[4].getElementsByTagName("select")[0];
        form_data["upload"][courseName]["grade"] = grade_select.value;
        if (form_data["upload"][courseName]["grade"] != "") error_flag = 1;

        //write "sweet","difficult","important"
        var point_map = ["sweet", "difficult", "important"];
        for (var j = 5; j <= 7; j++) {
          point_select = td[j].getElementsByTagName("select")[0];
          form_data["upload"][courseName][point_map[j - 5]] =
            point_select.value;
          if (form_data["upload"][courseName][point_map[j - 5]] != "0")
            error_flag = 1;
        }

        //write critic
        form_data["upload"][courseName]["critic"] =
          td[8].getElementsByTagName("textarea")[0].value;
        if (form_data["upload"][courseName]["critic"] != "") error_flag = 1;

        //check currect data again
        if (error_flag) {
          var check_flag = 1;
          for (var j = 0; j < 3; j++) {
            if (form_data["upload"][courseName][point_map[j]] == "0") {
              check_flag = 0;
              break;
            }
          }
          //data incomplete => error
          if (!check_flag) {
            success_flag = 0;
            alert(
              `上傳失敗\n*${courseName}* 的評分未完整\n提示：若有填寫姓名、成績、評論等\n則給分甜度、難度、課本重要程度也要評分完整\n若三個分數有漏填亦會錯誤`
            );
            break;
          }
        }
      }
      // console.log(Object.keys(form_data["upload"]));
      if (success_flag) {
        const gas_api =
          "https://script.google.com/macros/s/AKfycbwDPQpKkFYCAEJsE1-nuDPo7amVVTAJC1tvlkOjkxuUBpGenlRyEgi7cPgejpUniJdJ/exec";
        //準備上傳
        alert("準備上傳中\nfetch google的資料庫需要等待3-4sec請見諒！");
        $.ajax({
          url: gas_api,
          method: "POST",
          // contentType: "application/json",
          data: JSON.stringify(form_data),
          success: function (response) {
            console.log(response);
            info["personal"] = response["status"]["personal"];
            info["選修"] = response["status"]["選修"];
            info["通識"] = response["status"]["通識"];
            resetCritic(
              sessionStorage.getItem("userid"),
              sessionStorage.getItem("useremail"),
              wait_remove_newrow
            );
            setTable();
            submit.dissable = false;
            alert("上傳成功！\n重新載入就能看到你的評論出現在底下了！");
          },
          error: function (xhr, status, error) {
            submit.dissable = false;
            console.log("post失敗");
          },
        });
        console.log(form_data["upload"]);
      } else {
        //不予上傳
        submit.dissable = false;
      }
    } else {
      alert(
        "目前資料還在等待上傳\n因為避免不必要的錯誤\n當他人調取資料庫資料時需等待他人使用完畢"
      );
    }
  });
}

function newSubjectListener(cell) {
  cell.addEventListener("change", function (event) {
    options = cell.getElementsByTagName("option");
    if (cell.value == "其他Other") {
      cell_parent = cell.parentNode;
      var input_course = document.createElement("input");
      input_course.type = "text";
      input_course.placeholder = "請輸入欲新增的課程名稱";
      input_course.size = 20;
      input_course.style.marginTop = "5px";
      input_course.maxLength = "15";
      cell_parent.appendChild(input_course);
    } else {
      var input_course = cell.parentNode.getElementsByTagName("input")[0];
      if (input_course) input_course.remove();
    }
  });
}

function resetCritic(id, useremail, callback) {
  const now = new Date();
  const month = now.getMonth() + 1;

  // Let id to string to avoid school change formation of id
  var grade =
    now.getFullYear() - 1911 - parseInt(id.toString().substring(0, 3));
  var season = now.getFullYear() - 1911;
  map_grade = [
    "肯定是高中生",
    "大一",
    "大二",
    "大三",
    "大四",
    "大五",
    "大六",
    "肯定是碩博士",
  ];
  if (month > 2 && month < 9) {
    //second semester
    // console.log("下學期");
    season -= 1;
    season = season * 10 + 2;
  } else {
    //first semester
    // console.log("上學期");
    season = season * 10 + 1;
    grade += 1;
  }
  var check_data = document.getElementById("checkid");
  check_data.innerText = `please check\n id：${id}\ngrade：${map_grade[grade]}\nemail：${useremail}`;
  var form_critic = document.getElementById("form_critic");
  form_critic.innerHTML = "";
  var table = document.createElement("table");
  table.style.width = "100%";
  // table.className = "demonstrate";
  table.innerHTML =
    "<tr><th>課程名稱</th><th>學期別</th><th>選別</th><th>暱稱</th><th>成績</th><th>給分甜度</th><th>難度</th><th>課本重要程度</th><th>建議與心得</th></tr>";
  form_critic.appendChild(table);

  const g = [
    "",
    "A+",
    "A",
    "A-",
    "B+",
    "B",
    "B-",
    "C+",
    "C",
    "C-",
    "D",
    "E",
    "F",
    "P",
    "X",
    "W",
  ];

  //set required course
  if (info[map_grade[grade]]) {
    for (course in info[map_grade[grade]]) {
      newRow = table.insertRow();
      var arr = [],
        flag = 0;
      if (info["personal"][info[map_grade[grade]][course]]) {
        arr = info["personal"][info[map_grade[grade]][course]];
        delete info["personal"][info[map_grade[grade]][course]];
        flag = Object.keys(arr)[0]; //season in past
      }
      var cell = newRow.insertCell();
      cell.innerHTML = info[map_grade[grade]][course]; //course
      //pos on google sheet
      if (flag) cell.value = arr[flag][7];
      else cell.value = -1;

      var input_season = document.createElement("input");
      input_season.type = "text";
      input_season.maxLength = "4";
      input_season.size = 4;
      if (flag) input_season.value = flag;
      else input_season.value = season;
      newRow.insertCell().appendChild(input_season); //season

      newRow.insertCell().innerHTML = "必修"; //type

      var input_name = document.createElement("input");
      input_name.type = "text";
      input_name.maxLength = "8";
      input_name.size = "10";
      if (flag) input_name.value = arr[flag][1];
      newRow.insertCell().appendChild(input_name); //name

      var input_grade = document.createElement("select");
      for (i in g) {
        var tem_opt = document.createElement("option");
        tem_opt.value = g[i];
        tem_opt.textContent = g[i];
        if (flag && arr[flag][1] == g[i]) tem_opt.selected = true;
        input_grade.appendChild(tem_opt);
      }
      if (flag) input_grade.value = arr[flag][2];
      newRow.insertCell().appendChild(input_grade); //grade

      var select_point = document.createElement("select");
      for (var i = 0; i <= 5; i++) {
        var option = document.createElement("option");
        option.value = i;
        option.textContent = i;
        if (flag && arr[flag][3] == i) option.selected = true;
        select_point.appendChild(option);
      }
      newRow.insertCell().appendChild(select_point); //sweet

      var select_point = document.createElement("select");
      for (var i = 0; i <= 5; i++) {
        var option = document.createElement("option");
        option.value = i;
        option.textContent = i;
        if (flag && arr[flag][4] == i) option.selected = true;
        select_point.appendChild(option);
      }
      newRow.insertCell().appendChild(select_point); //difficult

      var select_point = document.createElement("select");
      for (var i = 0; i <= 5; i++) {
        var option = document.createElement("option");
        option.value = i;
        option.textContent = i;
        if (flag && arr[flag][5] == i) option.selected = true;
        select_point.appendChild(option);
      }
      newRow.insertCell().appendChild(select_point); //important

      var input_critic = document.createElement("textarea");
      input_critic.maxLength = "100";
      if (flag) input_critic.textContent = arr[flag][6];
      newRow.insertCell().appendChild(input_critic); //critic

      var clr = document.createElement("a");
      clr.href = "#";
      clr.textContent = "clear";
      newRow.insertCell().appendChild(clr); //clear
      ClearListener(clr, newRow);
    }
  }

  //set pre-written course
  for (course in info["personal"]) {
    flag = Object.keys(info["personal"][course])[0]; //season

    newRow = table.insertRow();
    var cell = newRow.insertCell();
    cell.innerHTML = course; //course name
    cell.value = info["personal"][course][flag][7]; //pos on google sheet

    var input_season = document.createElement("input");
    input_season.type = "text";
    input_season.maxLength = "4";
    input_season.size = 4;
    if (flag) input_season.value = flag;
    else input_season.value = season;
    newRow.insertCell().appendChild(input_season); //season
    newRow.insertCell().innerHTML = info["personal"][course][flag][0]; //type

    var input_name = document.createElement("input");
    input_name.type = "text";
    input_name.maxLength = "8";
    input_name.size = "10";
    input_name.value = info["personal"][course][flag][1];
    newRow.insertCell().appendChild(input_name); //name

    var input_grade = document.createElement("select");
    for (i in g) {
      var tem_opt = document.createElement("option");
      tem_opt.value = g[i];
      tem_opt.textContent = g[i];
      if (g[i] == info["personal"][course][flag][2]) tem_opt.selected = true;
      input_grade.appendChild(tem_opt);
    }
    newRow.insertCell().appendChild(input_grade); //grade

    var select_point = document.createElement("select");
    for (var i = 0; i <= 5; i++) {
      var option = document.createElement("option");
      option.value = i;
      option.textContent = i;
      if (i == info["personal"][course][flag][3]) option.selected = true;
      select_point.appendChild(option);
    }
    newRow.insertCell().appendChild(select_point); //sweet

    var select_point = document.createElement("select");
    for (var i = 0; i <= 5; i++) {
      var option = document.createElement("option");
      option.value = i;
      option.textContent = i;
      if (i == info["personal"][course][flag][4]) option.selected = true;
      select_point.appendChild(option);
    }
    newRow.insertCell().appendChild(select_point); //difficult

    var select_point = document.createElement("select");
    for (var i = 0; i <= 5; i++) {
      var option = document.createElement("option");
      option.value = i;
      option.textContent = i;
      if (i == info["personal"][course][flag][5]) option.selected = true;
      select_point.appendChild(option);
    }
    newRow.insertCell().appendChild(select_point); //important

    var input_critic = document.createElement("textarea");
    input_critic.maxLength = "100";
    input_critic.textContent = info["personal"][course][flag][6];
    newRow.insertCell().appendChild(input_critic); //critic

    var clr = document.createElement("a");
    clr.href = "#";
    clr.textContent = "clear";
    newRow.insertCell().appendChild(clr); //clear
    ClearListener(clr, newRow);
  }
  //set new subject
  newRow = table.insertRow();
  newRow.insertCell().innerHTML = "";
  newRow.insertCell().innerHTML = "";

  var options = document.createElement("select");
  options.style.fontSize = "large";
  var option = document.createElement("option");
  option.value = "新增一門課";
  option.textContent = "新增一門課";
  option.selected = true;
  options.appendChild(option);
  var option = document.createElement("option");
  option.value = "必修";
  option.textContent = "必修";
  options.appendChild(option);
  var option = document.createElement("option");
  option.value = "選修";
  option.textContent = "選修";
  options.appendChild(option);
  var option = document.createElement("option");
  option.value = "通識";
  option.textContent = "通識";
  options.appendChild(option);
  newRow.insertCell().appendChild(options);
  options.addEventListener("change", function () {
    newRow.remove();
    callback(table, options, season);

    //avoid some wrong
    var tr = table.getElementsByTagName("tr");
    for (var i = 1; i < tr.length - 1; i++) {
      if (
        tr[i].getElementsByTagName("td")[2].getElementsByTagName("select")[0] &&
        !tr[i + 1]
          .getElementsByTagName("td")[2]
          .getElementsByTagName("select")[0]
      ) {
        tr[i].remove();
      }
    }
  });
}

function wait_remove_newrow(table, options, season) {
  append_new_critic(table, options.value, season);
}

function setCritic(id, useremail) {
  const gas_api =
    "https://script.google.com/macros/s/AKfycbwDPQpKkFYCAEJsE1-nuDPo7amVVTAJC1tvlkOjkxuUBpGenlRyEgi7cPgejpUniJdJ/exec";
  $.ajax({
    url: gas_api,
    method: "GET",
    data: {
      userid: id,
    },
    success: function (response) {
      // 處理成功回應
      info = response;
      //set total critic
      setTable();
      //set personal critic
      resetCritic(id, useremail, wait_remove_newrow);
      //set submit buttom
      document
        .getElementById("buttom_container")
        .appendChild(document.createElement("br"));
      var submit = document.createElement("input");
      submit.type = "submit";
      submit.value = "送出表單！";
      document.getElementById("buttom_container").appendChild(submit);
      SubmitListener(submit);
      document
        .getElementById("buttom_container")
        .appendChild(document.createElement("br"));
      document
        .getElementById("buttom_container")
        .appendChild(document.createElement("br"));
    },
    error: function (xhr, status, error) {
      alert("資料載入錯誤");
    },
  });
}

function append_new_critic(table, type, season) {
  newRow = table.insertRow();

  const g = [
    "",
    "A+",
    "A",
    "A-",
    "B+",
    "B",
    "B-",
    "C+",
    "C",
    "C-",
    "D",
    "E",
    "F",
    "P",
    "X",
    "W",
  ];

  //cells[0], course
  var input_course = document.createElement("select");
  input_course.style.width = "175px";
  if (type == "必修") {
    const grade_tem = ["大一", "大二", "大三"];
    for (tem in grade_tem) {
      for (i in info[grade_tem[tem]]) {
        var option = document.createElement("option");
        option.value = info[grade_tem[tem]][i];
        option.textContent = info[grade_tem[tem]][i];
        input_course.appendChild(option);
      }
    }
  } else if (type == "選修") {
    for (i in info["選修"]) {
      var option = document.createElement("option");
      option.value = info["選修"][i];
      option.textContent = info["選修"][i];
      input_course.appendChild(option);
    }
  } else {
    //通識
    for (i in info["通識"]) {
      var option = document.createElement("option");
      option.value = info["通識"][i];
      option.textContent = info["通識"][i];
      input_course.appendChild(option);
    }
  }
  var option = document.createElement("option");
  option.value = "其他Other";
  option.textContent = "其他Other";
  input_course.appendChild(option);
  var CourseCell = newRow.insertCell();
  CourseCell.value = -1;
  CourseCell.appendChild(input_course);

  //if initial value is "other", setting input element
  if (input_course.value == "其他Other") {
    var new_input_course = document.createElement("input");
    new_input_course.type = "text";
    new_input_course.placeholder = "請輸入欲新增的課程名稱";
    new_input_course.size = 20;
    new_input_course.style.marginTop = "5px";
    new_input_course.maxLength = "15";
    CourseCell.appendChild(new_input_course);
  }
  newSubjectListener(input_course);

  //cells[1], season
  var input_season = document.createElement("input");
  input_season.type = "text";
  input_season.value = season;
  input_season.maxLength = "4";
  input_season.size = 4;
  newRow.insertCell().appendChild(input_season);

  //cells[2], type
  var type_text = document.createElement("a");
  type_text.textContent = type;
  newRow.insertCell().appendChild(type_text);

  //cells[3], name
  var input_name = document.createElement("input");
  input_name.type = "text";
  input_name.maxLength = "8";
  input_name.size = "10";
  newRow.insertCell().appendChild(input_name);

  // cells[4], grade
  var input_grade = document.createElement("select");
  for (i in g) {
    var tem_opt = document.createElement("option");
    tem_opt.value = g[i];
    tem_opt.textContent = g[i];
    input_grade.appendChild(tem_opt);
  }
  newRow.insertCell().appendChild(input_grade);

  // cells[5], sweet
  var select_point = document.createElement("select");
  for (var i = 0; i <= 5; i++) {
    var option = document.createElement("option");
    option.value = i;
    option.textContent = i;
    select_point.appendChild(option);
  }
  newRow.insertCell().appendChild(select_point);

  // cells[6], difficult
  var select_point = document.createElement("select");
  for (var i = 0; i <= 5; i++) {
    var option = document.createElement("option");
    option.value = i;
    option.textContent = i;
    select_point.appendChild(option);
  }
  newRow.insertCell().appendChild(select_point);

  // cells[7], important
  var select_point = document.createElement("select");
  for (var i = 0; i <= 5; i++) {
    var option = document.createElement("option");
    option.value = i;
    option.textContent = i;
    select_point.appendChild(option);
  }
  newRow.insertCell().appendChild(select_point);

  // cells[8], critic
  var input_critic = document.createElement("textarea");
  input_critic.maxLength = "100";
  newRow.insertCell().appendChild(input_critic); //critic

  //cell[9], clear
  var clr = document.createElement("a");
  clr.href = "#";
  clr.textContent = "delete";
  newRow.insertCell().appendChild(clr);
  ClearListener(clr, newRow, 1);

  //set new subject
  newRow = table.insertRow();
  newRow.insertCell().innerHTML = "";
  newRow.insertCell().innerHTML = "";

  //set a option that can select if append new course
  var options = document.createElement("select");
  options.style.fontSize = "large";
  var option = document.createElement("option");
  option.value = "新增一門課";
  option.textContent = "新增一門課";
  option.selected = true;
  options.appendChild(option);
  var option = document.createElement("option");
  option.value = "必修";
  option.textContent = "必修";
  options.appendChild(option);
  var option = document.createElement("option");
  option.value = "選修";
  option.textContent = "選修";
  options.appendChild(option);
  var option = document.createElement("option");
  option.value = "通識";
  option.textContent = "通識";
  options.appendChild(option);

  newRow.insertCell().appendChild(options);

  //if select the option, setting new critic line
  options.addEventListener("change", function () {
    newRow.remove();
    append_new_critic(table, options.value, season);
  });
}

function setTable() {
  document.getElementById("h1_point").innerHTML = "[總覽]的課程評鑑";
  const table = document.getElementById("table_point");
  table.innerHTML =
    "<tr><th>課程名稱</th><th>學期別</th><th>選別</th><th>給分甜度</th><th>難度</th><th>課本重要程度</th></tr>";
  var subjectElement = document.getElementById("span_subject");

  //clear the subject
  subjectElement.innerHTML = "";
  var legend = document.createElement("legend");
  legend.textContent = "科目";
  subjectElement.append(legend);

  for (course in info["total"]) {
    for (season in info["total"][course]) {
      newRow = table.insertRow();
      newRow.insertCell().innerHTML = course;
      newRow.insertCell().innerHTML = season;
      newRow.insertCell().innerHTML = info["total"][course][season][3]; //type
      newRow.insertCell().innerHTML = info["total"][course][season][0]; //sweet
      newRow.insertCell().innerHTML = info["total"][course][season][1]; //difficult
      newRow.insertCell().innerHTML = info["total"][course][season][2]; //important
    }
  }
  var gradeElement = document.getElementById("span_grade");
  gradeElement.innerHTML = "";
  var a = document.createElement("a");
  a.textContent = `*${info["課程"][0]}*`;
  a.id = "grade_" + 0;
  a.style.padding = "5px";
  gradeElement.appendChild(a);
  GradeListener(a);
  for (var i = 1; i < info["課程"].length; i += 1) {
    var a = document.createElement("a");
    a.textContent = `${info["課程"][i]}`;
    a.href = "#";
    a.id = "grade_" + i;
    a.style.padding = "5px";
    gradeElement.appendChild(a);
    GradeListener(a);
  }
}
