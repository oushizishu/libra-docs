---
id: state-machine-replication-paper
title: Libra区块链中的状态机复制
---

<!-- hide the table of contents --><style>.toc-headings {display: none !important; visibility: hidden !important;}</style>

## 摘要

本报告介绍了LibraBFT，这是一个针对Libra 区块链设计的强大高效的状态机复制系统。 LibraBFT基于HotStuff，这是最近的一项协议，利用拜占庭容错（BFT）数十年的科学进步，实现了互联网所需的强大的可扩展性和安全性。 LibraBFT进一步完善了HotStuff协议，引入了明确的活跃度机制，并提供了具体的延迟分析。 为了推动与Libra区块链的集成，本文档提供了从全功能模拟器中提取的规范。 这些规范包括状态复制接口和用于参与者之间的数据传输和状态同步的通信框架。 最后，本文档提供了一个正式的安全证明，它规定了检测BFT节点不良行为的标准，同时还有一个简单的奖励和惩罚机制。

### Downloads

[![State Machine Replication in the Libra Blockchain PDF Download](assets/illustrations/state-machine-pdf.png){: .download}](assets/papers/libra-consensus-state-machine-replication-in-the-libra-blockchain.pdf)
