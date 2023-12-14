var info;
var now_subject = [];

window.onload = function () {
  load_start();
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
      console.log(info);
      document.getElementById("h1_point").innerHTML = "[總覽]的課程評鑑";
      const table = document.getElementById("table_point");
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
    })
    .catch((error) => {
      console.error("Error:", error);
    });
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
          console.log("使用者資訊：", data);
          var check_data = document.getElementById("checkid");
          check_data.innerText =
            "please check\n id：" +
            data["username"] +
            "\nemail：" +
            data["email"];
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
}
