---
id: move-paper
title: Move: 可编程资源语言
---

<!-- hide the table of contents --><style>.toc-headings {display: none !important; visibility: hidden !important;}</style>

## 摘要

我们提出Move语言，一种安全灵活的Libra 区块链编程语言。 Move是一种可执行的字节码语言，用于实现自定义交易和智能合约。 Move的关键特性能够使用具有线性逻辑的语法自定义资源类型：资源永远不会被复制或隐藏丢弃，只能在程序的存储位置之间移动。这些安全性由Move的类型系统在静态编译时得到保证。不单有这些特殊保护，资源也作为一个原生的程序值 - 可以存储在数据结构中，还是能作为参数传递给过程（procedures）程序，等等。 资源作为“一等公民”，程序员不仅可以使用它来实现安全的数字资产，还可以编写正确的业务逻辑来包装资产和实施访问控制策略。 Move语言的的安全性和表达力，使我们能使用Move来实现Libra协议的重要部分，包括Libra Coin，交易处理和验证器管理。

### 下载论文

[![Move: A Language With Programmable Resources PDF Download](assets/illustrations/move-language-pdf.png){: .download}](assets/papers/libra-move-a-language-with-programmable-resources.pdf)
