---
id: the-libra-blockchain-paper
title: Libra 区块链
---

<!-- hide the table of contents --><style>.toc-headings {display: none !important; visibility: hidden !important;}</style>

## 摘要

Libra区块链是一个去中心化、可编程的数据库，其旨在支持一个低波动性的加密数字货币，能够作为服务全世界数十亿人的有效交易媒介。我们提出了一个关于Libra协议的提议，它会实现Libra区块链，旨在创建一个可促进创新、降低进入壁垒，并改善访问金融服务机会的金融基础设施。为了验证Libra协议的设计，我们已构建了一个开源原型实现 —— Libra Core ，并在全球范围内共同推进这一新生态系统。

Libra协议允许来自不同实体的一组副本（称为验证者）共同维护一个可编程资源的数据库。这些资源由经过公钥加密验证的不同用户帐户拥有，并遵守这些资源开发者指定的自定义规则。验证者处理交易（transaction）并相互作用，就数据库的一致状态达成共识。交易是基于预定义的，在未来的版本中，用户自定义的智能合约会使用一种称为**Move**的新编程语言来编写。

我们使用Move语言定义区块链的核心机制，例如货币和验证者成员。这些核心机制能够创建一个独特的治理机制，核心机制建立在早期现有项目已建立的稳定基础之上，但Libra系统会随着时间的推移，完全开放。


### Downloads

[![The Libra Blockchain PDF Download](assets/illustrations/libra-blockchain-pdf.png){: .download}](assets/papers/the-libra-blockchain.pdf)
