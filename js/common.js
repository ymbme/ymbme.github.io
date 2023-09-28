// window.onload() = function(){

// }

function load_start() {
  //lay out pages area
  var h1 = document.getElementsByTagName("h1");
  console.log();

  var page = {
    HOME: "index.html",
    下載系統: "pull.html",
    上傳系統: "push.html",
  };
  var page_opt = document.getElementById("page_opt");
  for (key of Object.keys(page)) {
    page_opt.appendChild(document.createElement("br"));
    var a = document.createElement("a");
    if (key == h1[0].textContent.slice(2)) {
      a.textContent = "*" + key + "*";
    } else {
      a.textContent = key;
      a.href = page[key];
    }
    page_opt.appendChild(a);
  }
  var footer = document.getElementsByTagName("footer");
  var p = document.createElement("p");
  p.textContent =
    "© 2023 Copyright: NYCU BME | Developed by&nbsp;NYCU BME DEPT";
  p.style = "text-align: center";
  footer[0].appendChild(p);
  //   page_opt.innerHTML = "<br />/*這裡是還沒<br />做好的分頁區*/";
  //   page_opt.innerHTML = "";
}
