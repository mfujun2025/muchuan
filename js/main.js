/* 木船.cn — 交互脚本（无依赖、纯原生） */
(function () {
  "use strict";

  /* 移动端导航菜单 */
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("nav-menu");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    // 点击链接后自动收起
    menu.addEventListener("click", function (e) {
      if (e.target && e.target.tagName === "A") {
        menu.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* 联系表单：前端校验 + 提交到飞书机器人 Webhook
     注意：飞书 Webhook 不返回 CORS 头，浏览器无法读取响应，
     因此使用 mode:"no-cors" 发出请求（请求可达，但读不到返回值）。
     这是纯静态站接入 Webhook 的标准做法。 */
  var FEISHU_WEBHOOK =
    "https://open.feishu.cn/open-apis/bot/v2/hook/a61f2473-8486-45fc-bdd0-3328c552ed40";

  var form = document.getElementById("contact-form");
  if (form) {
    var note = document.getElementById("form-note");
    var btn = document.getElementById("submit-btn");

    var setNote = function (text, color) {
      if (!note) return;
      note.textContent = text;
      note.style.color = color || "";
    };

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var name = form.querySelector("#name");
      var phone = form.querySelector("#phone");
      var msg = form.querySelector("#msg");
      var fields = [name, phone, msg];
      var ok = true;

      fields.forEach(function (el) {
        if (!el || !el.value.trim()) {
          if (el) el.style.borderColor = "#c0392b";
          ok = false;
        } else if (el) {
          el.style.borderColor = "";
        }
      });

      if (!ok) {
        setNote("请完整填写带 * 的必填项后再提交。", "#c0392b");
        return;
      }

      // 组装飞书富文本消息
      var now = new Date();
      var pad = function (n) {
        return n < 10 ? "0" + n : "" + n;
      };
      var stamp =
        now.getFullYear() +
        "-" + pad(now.getMonth() + 1) +
        "-" + pad(now.getDate()) +
        " " +
        pad(now.getHours()) +
        ":" +
        pad(now.getMinutes());

      var payload = {
        msg_type: "text",
        content: {
          text:
            "【木船.cn 新客户咨询】\n" +
            "时间：" + stamp + "\n" +
            "称呼：" + name.value.trim() + "\n" +
            "电话：" + phone.value.trim() + "\n" +
            "需求：" + msg.value.trim(),
        },
      };

      if (btn) {
        btn.disabled = true;
        btn.textContent = "提交中…";
      }
      setNote("正在提交，请稍候…");

      fetch(FEISHU_WEBHOOK, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then(function () {
          // no-cors 模式下 fetch 只会 resolve，无法判断服务端业务结果
          setNote("提交成功！我们已收到您的信息，会在 1 个工作日内与您联系。", "#1f6f6b");
          form.reset();
        })
        .catch(function () {
          setNote(
            "提交失败，请稍后重试，或直接致电 17652523536。",
            "#c0392b"
          );
        })
        .finally(function () {
          if (btn) {
            btn.disabled = false;
            btn.textContent = "提交咨询";
          }
        });
    });
  }

  /* 当前页导航高亮（兜底，HTML 已设置 active） */
  var path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach(function (a) {
    var href = a.getAttribute("href");
    if (href === path && !a.classList.contains("active")) {
      a.classList.add("active");
    }
  });
})();
