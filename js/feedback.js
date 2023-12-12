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
    },
    error: function (error) {
      // 請求失敗，處理錯誤
      console.error("取得存取權杖失敗：", error);
    },
  });
}
