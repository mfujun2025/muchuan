# 木船.cn — 企业展示静态站

简洁大气的响应式企业展示网站，栏目包含：**首页 / 公司简介 / 产品服务 / 新闻资讯 / 联系方式**。
纯静态（HTML + CSS + 原生 JS，零依赖、零构建），可直接部署到 GitHub Pages 并绑定中文域名 `木船.cn`。

---

## 一、目录结构

```
muchuan-site/
├─ index.html          首页
├─ about.html          公司简介
├─ products.html       产品/服务展示
├─ news.html           新闻资讯列表
├─ news-1~3.html       新闻文章页（SEO 长文）
├─ contact.html        联系方式（含表单与地图）
├─ 404.html            404 页面
├─ css/style.css       全局样式（响应式）
├─ js/main.js          导航交互 + 表单校验
├─ assets/             Logo / 主图 / 图标 / OG 图（SVG）
├─ sitemap.xml         站点地图
├─ robots.txt          爬虫规则
├─ manifest.webmanifest PWA 清单
├─ CNAME               自定义域名（内容为 punycode：xn--4pv951d.cn）
├─ .nojekyll           禁用 Jekyll
└─ README.md           本文件
```

> 说明：所有图片均为本地 SVG，离线可用、加载快（利于 LCP/CLS）。
> 联系表单已接入飞书机器人 Webhook（见 `js/main.js` 的 `FEISHU_WEBHOOK`），提交后消息会推送到你的飞书群。
>
> ⚠️ 飞书 Webhook 地址会出现在网页源码中，任何人都能查看到并往群里发消息。
> 如需防滥用，请在飞书机器人后台开启签名校验（需配套后端代理），或改用飞书表单/第三方表单服务。

---

## 二、本地预览（部署前自检）

在项目根目录执行：

```bash
# 方式一：Python
python -m http.server 8080
# 浏览器访问 http://localhost:8080

# 方式二：Node
npx serve .
```

建议用浏览器开发者工具切换手机视图，确认响应式布局正常。

---

## 三、部署到 GitHub Pages（完整步骤）

目标仓库：`https://github.com/mfujun2025/muchuan`

### 步骤 1：创建仓库（如尚未创建）

1. 登录 GitHub → 右上角 **New repository**。
2. Repository name 填 `muchuan`，选择 **Public**（GitHub Pages 免费版需公开仓库）。
3. 不勾选 "Add a README"，其余保持默认，点击 **Create repository**。
4. 本项目的所有文件即仓库内容（无需额外模板）。

### 步骤 2：上传代码到仓库

**方式 A：Git 命令行（推荐，便于后续更新）**

```bash
# 进入本项目目录
cd muchuan-site

git init
git add -A
git commit -m "feat: 初始化木船.cn 企业展示站"

# 关联远程仓库（替换为你自己的账号）
git remote add origin https://github.com/mfujun2025/muchuan.git
git branch -M main
git push -u origin main
```

**方式 B：网页直接上传**

进入 `https://github.com/mfujun2025/muchuan` → **Add file → Upload files**，将 `muchuan-site` 内全部文件（含子目录 `css/`、`js/`、`assets/`）拖入并提交。
> 注意：`.nojekyll` 和 `CNAME` 是隐藏文件，上传时请确认它们也被包含。

### 步骤 3：开启 GitHub Pages

1. 仓库页 → **Settings → Pages**（左侧）。
2. **Build and deployment → Source** 选择 **Deploy from a branch**。
3. Branch 选择 `main`，目录选 **/ (root)**，点击 **Save**。
4. 等待约 1–2 分钟，GitHub 会给出默认访问地址：
   `https://mfujun2025.github.io/muchuan/`

### 步骤 4：绑定自定义中文域名 `木船.cn`

> 重要：`木船.cn` 是中文（IDN）域名，在 DNS 与 CNAME 文件中**必须使用 punycode 编码** `xn--4pv951d.cn`，浏览器和微信会显示为 `木船.cn`。

**4.1 DNS 解析配置（在你的域名注册商 / DNS 服务商处）**

`木船.cn` 作为根域名（apex），添加 **4 条 A 记录**指向 GitHub Pages：

| 类型 | 主机记录（punycode） | 记录值（GitHub IP） |
|------|----------------------|----------------------|
| A    | `xn--4pv951d.cn` 或 `@` | `185.199.108.153` |
| A    | `xn--4pv951d.cn` 或 `@` | `185.199.109.153` |
| A    | `xn--4pv951d.cn` 或 `@` | `185.199.110.153` |
| A    | `xn--4pv951d.cn` 或 `@` | `185.199.111.153` |

若使用 `www.木船.cn` 子域名，可改用 **CNAME 记录**：

| 类型 | 主机记录 | 记录值 |
|------|----------|--------|
| CNAME | `www.xn--4pv951d.cn` 或 `www` | `mfujun2025.github.io` |

**4.2 在 GitHub 填写自定义域名**

1. 仓库 **Settings → Pages → Custom domain**。
2. 输入 `木船.cn`（GitHub 会自动转为 `xn--4pv951d.cn`）。
3. 勾选 **Enforce HTTPS**（需 DNS 生效后约数分钟至数十分钟才可选）。
4. 保存后，GitHub 会自动向仓库写入/更新 `CNAME` 文件（本项目已内置该文件）。

**4.3 验证**

- 浏览器访问 `https://木船.cn`，应显示本站首页且地址栏出现锁标（HTTPS）。
- 访问 `https://mfujun2025.github.io/muchuan/` 也应正常（并 301 跳转到自定义域名，取决于设置）。

---

## 四、更新与回滚

- **更新内容**：修改对应文件后 `git add -A && git commit -m "..." && git push`，GitHub Pages 会自动重新构建（通常 1 分钟内生效）。
- **回滚**：在仓库 **Settings → Pages** 切换历史部署，或用 `git revert` 回退提交后重新推送。
- **解绑域名**：Settings → Pages → Custom domain 清空并保存，同时删除仓库中的 `CNAME` 文件即可恢复默认 `github.io` 地址。

---

## 五、SEO 与无障碍清单（已落实）

- ✅ 每页独立 `<title>`、`<meta description>`、Open Graph、Canonical
- ✅ JSON-LD 结构化数据（Organization / Article）
- ✅ 语义化标签（header/nav/main/section/article/footer）、跳转链接、表单 label、焦点样式
- ✅ 响应式（移动优先，断点 960 / 760 / 480）
- ✅ sitemap.xml + robots.txt
- ⚠️ 社交分享图当前为 `assets/og-image.svg`；如需最佳兼容（微信/QQ/Twitter），建议另存一张 `1200×630` 的 PNG 并在各页 `<meta property="og:image">` 中替换。

---

## 六、替换示例信息

演示文本（公司名、电话、邮箱、地址、ICP 号）请在以下位置替换为真实内容：

- 所有页面的页脚与头部
- `contact.html` 的联系方式
- `index.html` 底部 JSON-LD
- 各页 `<title>` / `<meta>` 中的关键词与描述

> 本仓库为演示站点，文中企业信息均为示例，不代表真实主体。
