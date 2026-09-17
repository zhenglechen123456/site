# 郑乐晨 · Judy’s Notes — 纯静态个人主页

一个**零依赖、零构建工具**的静态个人网站：手写 HTML + CSS + 原生 JavaScript，
不引 CDN、不引 Google Fonts、不用任何框架，图标全部是内联 SVG，头像是站主自己的照片 `avatar.jpg`。

- 定位：人工智能本科生的个人主页 + 公开学习笔记
- 风格：极简、克制、学术感，中文为主 + 英文署名
- 预览：可以直接双击 `index.html` 打开，也可以放到任意静态服务器下（GitHub Pages / Netlify / Vercel / Nginx）

---

## 一、本地预览

三种方式，随便挑一种：

```bash
# 方式 1（最简单）：直接在文件管理器里双击 site/index.html
#   优点：零配置；缺点：file:// 下浏览器会拒绝 fetch 本地 data/site.json，
#   但本站目前的页面不依赖它，所以完全能正常浏览。

# 方式 2（推荐）：起一个本地静态服务器，路径和部署后完全一致
cd site
python -m http.server 8000
# 然后浏览器打开 http://localhost:8000/

# 方式 3：如果你装了 Node.js
cd site
npx --yes serve . -l 8000
```

> 建议用方式 2 检查一遍，因为部署到 GitHub Pages 后就是这种「有 http 服务」的环境。

---

## 二、部署到 GitHub Pages（3 步）

**第 1 步：把 `site/` 里的内容推到一个 GitHub 仓库**

```bash
cd site
git init
git add .
git commit -m "init: personal site"
git branch -M main
git remote add origin https://github.com/<你的用户名>/<仓库名>.git
git push -u origin main
```

**第 2 步：在仓库里打开 Pages 开关**

仓库页面 → `Settings` → 左侧 `Pages` → `Build and deployment` →
`Source` 选 **Deploy from a branch** → `Branch` 选 **main**、目录选 **/ (root)** → `Save`。

**第 3 步：等 1 分钟，访问生成的地址**

```
https://<你的用户名>.github.io/<仓库名>/
```

按站主定的部署方式（**把 `site/` 文件夹本身当作仓库根目录**），Pages 地址形如
`https://<你的用户名>.github.io/<仓库名>/`。用户名是 `zhenglechen123456`，
所以**若仓库命名为 `site`**，地址就是：

```
https://zhenglechen123456.github.io/site/
```

> 仓库还没创建，仓库名也还没最终确定：上面的地址是按「仓库名 = `site`」写进
> `links/index.html`「本站信息」卡片与 `data/site.json` 的 `site.url` 的。
> 以 GitHub 仓库 Pages 设置页显示的「Your site is live at …」为准；
> 若最终用了别的仓库名，把这两处的地址同步改一下即可。

几个坑先提醒：

- 仓库名如果取成 `<你的用户名>.github.io`，地址就是 `https://<你的用户名>.github.io/`（根域名，最干净）。
- 目录里的 `.nojekyll` **不要删**：它让 GitHub Pages 跳过 Jekyll 处理，避免下划线开头的文件/目录被忽略。
- 如果你的仓库里 `site/` 只是一层子目录（即仓库根目录不是网站根目录），要把 Pages 的目录改成 `/docs`，
  或者把 `site/` 的内容挪到仓库根目录。最简单的做法是：**把 `site/` 里的东西直接作为仓库根目录**。
- 部署后如果样式没生效，多半是路径大小写问题：GitHub Pages 跑在 Linux 上，**文件名区分大小写**。

---

## 三、我想改 X，要去改哪个文件？

| 我想改… | 去改这个文件 | 具体位置 / 提示 |
| --- | --- | --- |
| 姓名、英文署名、一句话定位 | `index.html` | Hero 区块，搜 `Judy`、`hero__name-zh`、`hero__tagline` |
| 头像 | `assets/img/avatar.jpg` | 真实头像（1280×1101）。换图时同步改各页 `<img src>` 与 `<link rel="icon">`，注意 `../` / `../../` 层级不同 |
| 邮箱 / GitHub 链接 | 每个页面的 Hero 与页脚 | 搜 `3539820258@qq.com`、`github.com/zhenglechen123456` |
| 颜色、字号、间距、圆角、深浅色 | `assets/css/tokens.css` | 全站唯一的变量文件；深色主题在 `[data-theme="dark"]` 里 |
| 正文行宽、行高、reset | `assets/css/base.css` | `--measure`（约 68ch）、`--lh-base` |
| 导航条、卡片、时间线、页脚样式 | `assets/css/components.css` | 按 `1. 顶栏` … `14. 响应式` 分节注释 |
| 首页各分区文字 | `index.html` | 搜 `<!-- TODO` 注释定位 |
| 首页 01-07 的编号与标题 | `index.html` | 每个分区里的 `section__numeral` / `section__title` |
| 研究兴趣 / 项目 / 资料卡片 | `index.html` | 对应的 `.grid` 里复制一个 `<article class="card">` 块即可 |
| 近期动态时间线 | `index.html` | `<ol class="timeline">`，复制 `<li class="timeline__item">` |
| 友链 | `links/index.html`（列表）+ `index.html`（首页 07） | 复制 `<a class="card friend">` 块 |
| 文章列表 | `blog/index.html` | 复制 `<article class="card">` 块，注意日期与链接 |
| 写一篇新文章 | `blog/posts/` 下复制 `paper-reading-notes.html` | 改标题、`<time datetime>` 与正文；再到 `blog/index.html` 加一张卡片 |
| 教程 / 资料页 | `tutorials/index.html` | 三个小节各有自己的 `id`，首页 05 直接链到锚点 |
| 关于页（长版自我介绍） | `about/index.html` | 05 个小节，按需删减 |
| 主题切换 / localStorage 逻辑 | `assets/js/theme.js` | 存储键名是 `theme` |
| 汉堡菜单 / 当前页高亮 / 滚动阴影 | `assets/js/nav.js` | — |
| 入场动画 / 回到顶部 / 年份 | `assets/js/main.js` | 年份元素用 `data-year` 标记 |
| 站点配置（姓名 / 学校 / 社交 / 导航 / 友链数据） | `data/site.json` | 目前页面是静态 HTML，这份 JSON 是给后续 JS 渲染或改模板用的 |
| 页脚版权与年份文案 | 每个页面的 `<footer class="site-footer">` | 年份由 JS 自动填充，其余是静态文字 |

---

## 四、目录结构

```
site/
├── index.html                  # 首页（单页式，01-07 编号分区）
├── blog/
│   ├── index.html              # 写作列表页
│   └── posts/
│       └── paper-reading-notes.html  # 唯一的示例文章（占位，演示文章排版，可替换）
├── tutorials/index.html        # 教程 / 资料列表页
├── links/index.html            # 友链页
├── about/index.html            # 关于页（长版自我介绍）
├── assets/
│   ├── css/tokens.css          # 设计变量：颜色 / 字号 / 间距 / 圆角 / 阴影 / 深浅色
│   ├── css/base.css            # reset、排版、链接、容器、正文
│   ├── css/components.css      # 导航（下划线动画 / 滚动状态 / scroll-spy）、Hero、卡片、时间线、标签、页脚等
│   ├── js/theme.js             # 深/浅色切换 + localStorage + 跟随系统（按钮 aria 同步）
│   ├── js/nav.js               # 汉堡菜单（锁滚动）、当前页高亮、首页 scroll-spy、滚动状态
│   ├── js/main.js              # 入场动画、回到顶部、年份
│   ├── img/avatar.jpg          # 真实头像（1280×1101，页面里以 cover 居中裁切）
│   ├── img/avatar.svg          # 最早的几何占位头像：现已无任何引用，可安全删除（保留备用）
│   ├── img/favicon-16.png      # 标签页图标 16×16（6 个页面都在 <head> 里引用）
│   ├── img/favicon-32.png      # 标签页图标 32×32（同上，主用）
│   ├── img/apple-touch-icon.png # iOS 添加到主屏用的 180×180 图标
│   ├── img/icon-192.png        # 预留给 PWA / 安卓主屏图标，本轮未在 HTML 里引用
│   ├── img/icon-512.png        # 预留给 PWA / 社交分享大图，本轮未在 HTML 里引用
├── data/site.json              # 站点配置：姓名 / 学校 / 邮箱 / GitHub / 部署地址 / 导航 / 友链
├── .nojekyll                   # GitHub Pages 用
└── README.md
```

---

## 五、设计约定（改样式前先看这段）

- **颜色**：只有两套中性底色（深 `#0f1115` 系 / 浅 `#fafafa` 系），
  唯一的强调色是低饱和蓝青（浅色 `#34718c`、深色 `#7bb4ce`），只用在下划线链接、编号、hover、焦点环上。
- **字体**：中文优先的系统字体栈；编号与英文署名用等宽字体栈 `--font-mono`。
- **排版**：正文行高 `1.75`，段落最大宽度 `68ch`，大量留白。
- **卡片**：`1px` 细边框 + hover 轻微抬升（`translateY(-2px)`）+ 边框变强调色，没有重阴影、没有玻璃拟态、没有渐变。
- **编号**：分区标题是「超大号灰色数字 + 小号中文标题」，靠 `.section__numeral` 与 `.section__title` 形成层次。
- **断点**：`≤1024px` 收窄为两列，`≤768px` 导航折叠成汉堡菜单，`≤480px` 单列并隐藏语言占位。
- **无障碍**：语义化 HTML5、`aria-label`、跳转链接、`:focus-visible` 焦点环，
  同时处理 `prefers-color-scheme`（跟随系统深浅色）与 `prefers-reduced-motion`（关闭动画）。
- **渐进增强**：CSS 里的入场动画只对 `html.js` 生效，禁用 JS 时内容默认全部可见，绝不会白屏。

---

## 六、新增一篇文章的步骤

1. 复制 `blog/posts/paper-reading-notes.html` 为 `blog/posts/<你的文件名>.html`。
2. 改 `<title>`、`<meta name="description">`、面包屑、`<h1 class="article__title">`、`<time datetime="…">` 和正文。
3. 在 `blog/index.html` 里复制一个 `<article class="card">` 块，指向新文件。
4. 如果是第一篇文章，顺手把 `index.html` 的 `06 写作` 那张文章卡片换成你的新文章。
5. 相对路径提示：`blog/posts/` 下的页面引用资源要写 `../../assets/...`，站内链接要写 `../../index.html`。

---

## 七、已知取舍（TODO）

- [x] RSS：站主决定暂不提供订阅，页面上已**移除全部 RSS 图标**（含首页头图与 6 个页面的页脚）。将来若生成 `feed.xml`，需要在各页重新加回图标。
- [ ] 语言切换「中 / EN」只是视觉占位，没有双语内容与切换逻辑。
- [ ] 没有评论系统（有意如此，可以后续接 giscus 之类的纯客户端方案）。
- [ ] 文章是手写 HTML，数量多了需要一个构建脚本；`data/site.json` 是为那时准备的。
- [ ] 首页导航里的「关于 / 正在做什么」用的是锚点，未做滚动位置高亮（scroll-spy）。
- [x] 身份信息已填实：姓名「郑乐晨」、英文署名「Judy」、学校「中国人民大学 高瓴人工智能学院」、
      邮箱 `3539820258@qq.com`、GitHub `github.com/zhenglechen123456`、友链已加入「叶耀之」。
- [x] 头像已换成真实照片 `assets/img/avatar.jpg`（1280×1101）。
      **需要站主目视确认**：页面容器是方形(112–144px)与圆形(96px)两种，横向图用 `object-fit: cover`
      居中裁切，左右各会裁掉约 13%。如果主体被切掉了，可以改 `components.css` 里
      `.hero__avatar img` 的尺寸（让它更宽），或换一张接近正方形的图。
- [ ] 仍是占位的部分：首页 01–07 与关于页里的经历 / 成果类文案（课程名、论文、实验室等），
      以及 `author.location`（城市未提供）。友链目前只有一条真实站点（叶耀之）。
- [ ] `assets/img/avatar.svg`（最早的几何占位头像）已无任何引用，可以安全删除，目前保留备用。
- [x] favicon 已换成真正的图标文件（`favicon-16.png` / `favicon-32.png` / `apple-touch-icon.png`，6 个页面各 3 条引用），
      不再让浏览器为一张 94 KB 的照片去画 16×16 的标签页图标。
- [ ] `icon-192.png` / `icon-512.png` 是给 PWA 与社交分享预留的，目前**没有**在 HTML 里引用（避免多下无用资源）；
      将来做 PWA（`manifest.webmanifest`）或补 `og:image` 时再用它们。
- [ ] 部署地址：`links/index.html` 与 `data/site.json` 现在写的是 `https://zhenglechen123456.github.io/site/`，
      对应「`site/` 作为仓库根目录 + 仓库名 `site`」。仓库还没创建，仓库名定了之后按第二节核对一次。
