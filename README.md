# ypst-template

`ypst-template` is a Typst document theme extracted from
`E:\til\appx\theme.typ`. It provides:

- page layout, CJK typography, and heading styles;
- sidenotes, theorem, lemma, corollary, definition, and proof environments;
- Fletcher diagram and multiline equation helpers;
- theme CSS and sidenotes JavaScript for HTML output.

## Current availability

This package currently supports **local use only**. It has not been published
to Typst Universe.

Install the package at:

```text
%APPDATA%\typst\packages\local\ypst-template\0.1.0\
```

The directory should contain `typst.toml`, `lib.typ`, `html.typ`, `theme.css`,
`sidenotes.css`, and `sidenotes.js`.

Use it from a Typst document:

```typst
#import "@local/ypst-template:0.1.0": template, sidenote, theorem
#show: template.with(theme: "light", layout: "portrait")

#sidenote[Main text][Side note]
```

For HTML output:

```text
typst compile --features html note.typ note.html
```

The package directory layout, manifest, and local package path follow the
standard Typst packages format.

## 使用说明

需要 Typst **0.15.0 或更新版本**。PDF 正文和标题分别使用 `Noto Serif SC`
和 `Noto Sans SC`，代码优先使用 `Fira Code`，建议先安装这些字体。
首次编译还需要获取 `lib.typ` 中导入的 preview 包。

以下示例按需导入对应函数；一份文档只需调用一次 `#show`。模板配置通过
普通参数传入，不会读取 `sys.inputs`。

### 基础排版与编译

```typst
#import "@local/ypst-template:0.1.0": template
#show: template.with(
  theme: "light",
  layout: "portrait",
)
#set document(title: "控制系统笔记")

= 系统设计
正文支持 *加粗*、_强调_ 和 `inline_code`。

== 通信接口
二级标题自动编号。

=== 状态采样
三级标题显示类似 1.1.1 的编号。
```

```sh
# 配置写在文档的 template.with(...) 中
typst compile note.typ note.pdf

# HTML 使用同一份显式配置；样式和旁注脚本会嵌入输出文件
typst compile --features html note.typ note.html
```

`theme` 可选 `light` / `dark`；`layout` 可选 `portrait` / `landscape`，
两者的默认值分别为 `light` 和 `portrait`，所以也可以简写为 `#show: template`。
`layout` 只影响分页输出；HTML 的宽度、字体、代码框和旁注布局由
`theme.css` 控制。例如深色横向双栏 PDF 使用：

```typst
#show: template.with(theme: "dark", layout: "landscape")
```

### 旁注与脚注

```typst
#import "@local/ypst-template:0.1.0": template, sidenote
#show: template

#sidenote[
  主文：控制器周期性提交目标位置。
][
  旁注：位置单位为 degree。
]

正文中的脚注。#footnote[补充说明。]

// 可选：将图片和说明一起放入旁注，路径相对于当前文档。
#sidenote(side-image: "motor.png")[电机结构说明。][图片说明。]
```

`sidenote` 是显式的正文/旁注组合；`footnote` 使用 `[a]`、`[b]` 等编号。
PDF 脚注按页重新编号；HTML 中脚注由附带脚本移到引用段落旁边，窄屏时改为单栏。
旁注内公式默认不编号。

### 定理、引理、定义与证明

```typst
#import "@local/ypst-template:0.1.0": (
  template, theorem, lemma, corollary, definition, proof,
)
#show: template

= 基础结论
#definition[若 $f(x) = a x + b$，称 $f$ 为仿射函数。]
#lemma[若 $a > 0$，则 $f$ 严格单调递增。]
#theorem[若 $a != 0$，则 $f$ 可逆。]
#proof[由 $y = a x + b$，解得 $x = (y - b) / a$。]
#corollary[方程 $f(x) = y$ 有唯一解。]
```

模板提供中文环境名称；PDF 中定理、引理和定义使用带背景的框，证明使用
`ctheorems` 的证明环境。HTML 不保证复现 PDF 中的框线、分页及 QED 排版。

### 多行公式

```typst
#import "@local/ypst-template:0.1.0": template, equate-lines
#show: template

= 运动学
#equate-lines($
  v &= v_0 + a t \
  x &= x_0 + v_0 t + (a t^2) / 2
$)

// 不使用字母子编号。
#equate-lines(sub-numbering: false, $
  p &= m v \
  F &= m a
$)
```

`equate-lines` 封装 `equate`，默认启用字母子编号，并使用带章节前缀的编号函数。
PDF 中普通块级公式也有章节前缀编号，进入新的编号一级标题时重置公式计数。
HTML 使用独立渲染分支，普通公式不会自动继承 PDF 分支的编号配置。

### 图表与引用

```typst
#import "@local/ypst-template:0.1.0": template
#show: template

= 实验结果
#figure(
  table(
    columns: 2,
    table.header([参数], [值]),
    [控制频率], [500 Hz],
    [电机数量], [32],
  ),
  caption: [测试配置],
) <test-config>

配置见 @test-config。
```

图片同样使用 `#figure(image("plot.svg"), caption: [实验曲线])`。
PDF 模板为图片和表格设置 `Fig.` / `Tab.` 及章节前缀编号；HTML 保留原生
`figure` / `table` 结构，其外观与编号配置不完全等同于 PDF。

### 代码与引用块

````typst
#import "@local/ypst-template:0.1.0": template
#show: template

行内代码：`device_id_t`。

```cpp
struct sample_t {
    float position_deg;
};
```

#quote(block: true)[周期控制优先使用最新的状态与目标量。]
````

代码语言由 Typst 解析和高亮。HTML 的 `theme.css` 提供代码背景框、圆角和
横向滚动，不显示额外的语言标签。`mermaid` 等围栏语言没有任何特殊处理，
一律按普通代码块渲染。

### 其他导出与样式入口

- `diagram`：带模板默认配色的 Fletcher 图形入口，参数透传给 Fletcher。
- `node`、`edge`：Fletcher 原始节点和连线函数。
- `fletcher`、`physica`：直接导出的模块，可按需访问它们的 API。
- `lib.typ`：公共函数、字号/颜色变量和 PDF 排版规则。
- `html.typ`：HTML 分支、资源注入及布局适配。
- `theme.css`：浏览器侧字体、标题、代码块和表格样式。
- `sidenotes.css`：HTML 脚注标记与旁注布局样式。
- `sidenotes.js`：HTML 原生脚注到旁注的转换。

通过 `@local/ypst-template:0.1.0` 导入时，读取的是本地包目录中的文件。
修改仓库后需将对应文件同步到该目录，并重新编译 HTML，嵌入的 CSS/脚本才会更新。
