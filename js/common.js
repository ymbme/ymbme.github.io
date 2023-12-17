function load_start() {
  //lay out pages area
  var h1 = document.getElementsByTagName("h1");
  console.log();

  var page = {
    HOME: "home.html",
    下載系統: "index.html",
    上傳系統: "push.html",
    回饋系統: "login.html",
  };

  var page_opt = document.getElementById("page_opt");
  if (h1[0].textContent == "回饋系統Feedback") {
    for (key of Object.keys(page)) {
      var a = document.createElement("a");
      if (key == "回饋系統") {
        a.textContent = "*" + key + "*";
      } else {
        a.textContent = key;
        a.href = page[key];
      }
      page_opt.appendChild(a);
      page_opt.appendChild(document.createElement("br"));
    }
  } else {
    for (key of Object.keys(page)) {
      var a = document.createElement("a");
      if (key == h1[0].textContent.slice(2)) {
        a.textContent = "*" + key + "*";
      } else {
        a.textContent = key;
        a.href = page[key];
      }
      page_opt.appendChild(a);
      page_opt.appendChild(document.createElement("br"));
    }
  }

  var footer = document.getElementsByTagName("footer");
  var p = document.createElement("p");
  p.textContent = "© 2023 Copyright: NYCU BME | Developed by\nNYCU BME DEPT";
  p.style = "text-align: center";
  footer[0].appendChild(p);
}
