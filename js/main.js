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

  /* 联系表单：前端校验 + 演示提示（不真实提交） */
  var form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var note = document.getElementById("form-note");
      var name = form.querySelector("#name");
      var phone = form.querySelector("#phone");
      var msg = form.querySelector("#msg");
      var ok = true;
      [name, phone, msg].forEach(function (el) {
        if (!el.value.trim()) {
          el.style.borderColor = "#c0392b";
          ok = false;
        } else {
          el.style.borderColor = "";
        }
      });
      if (!ok) {
        if (note) note.textContent = "请完整填写带 * 的必填项后再提交。";
        return;
      }
      if (note) {
        note.style.color = "#1f6f6b";
        note.textContent = "提交成功（演示）！我们会尽快与您联系。正式上线请接入后端或表单服务。";
      }
      form.reset();
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
