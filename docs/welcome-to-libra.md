---
id: welcome-to-libra
title: 来到 Libra 世界
---

**欢迎来到Libra开发者网站**！ Libra的使命是为全球数十亿人建立一个简单的全球货币和金融基础设施。

> 世界真正需要的是一种可靠的数字货币和可以实现“货币互联网”承诺的基础设施。能够在移动设备上简单直观的保护我们的金融资产。在全球范围内，不论在哪里，做什么、赚多少钱，资金的转移应该像发送短信或者分享照片一样简单且具有低成本也更加安全可靠。 —  [Libra 白皮书](https://libra.org/zh-CN/white-paper/) 

Libra建立在一个安全可靠且可扩展的区块链上，它由一系列有内在价值的资产来支支撑价值，并有独立的Libra协会负责运营发展 Libra 生态。

> Libra 区块链的目标是成为金融服务的坚实基础，已满足全球数十亿人日常财务需求的全新的全球货币。Libra 区块链是从零开始构建，其优先考虑扩展性、安全性、存储、吞吐量效率及未来的适应性 —  [Libra 白皮书](https://libra.org/zh-CN/white-paper/) 



Libra 货币建立在Libra区块链上。文档中的Libra Core ，是Libra协议的原型实现的开源项目 ，该项目为这个新的区块链提供支持，文档中的 [测试网络 testnet](https://learnblockchain.cn/docs/libra/docs/reference/glossary/#testnet)，这是Libra系统的一个演示环境，和未来Libra上线的[主网](https://learnblockchain.cn/docs/libra/docs/reference/glossary/#mainnet)对比，testnet使用的是没有价值的数字货币。



文档的内容包含：

* 如何在testnet通过[发送交易](https://learnblockchain.cn/docs/libra/docs/my-first-transaction/)来体验原型

* 学习 Libra协议、Move语言，LibraBFT 等新的技术
* 如何成为Libra生态社区的一部分

<blockquote class="block_note">

**注意**：Libra项目目前处于早期原型阶段。Libra协议和Libra Core API不是最终正式版。原型的关键任务之一就是确定正式的协议和API。目前，我们的重点是基础架构和构建CLI客户端。我们的直接路线图中包含公共API和相关的库。我们欢迎在testnet对软件进行相关测试，但开发人员可以使用这些API来发布应用程序，我们也会朝找发布稳定的APIs 前进。


</blockquote>

## Move: 一种新的区块链编程语言



Move是一种新的编程语言，用于在Libra区块链上实现自定义的交易逻辑和“智能合约”。由于Libra的目标是在有朝一日为数十亿人服务，因此 Move的设计的最高优先级是安全。

通过借鉴过去智能合约安全事件，创建了新的语言Move，Move语言使作者编写代码更加容易，可降低发生意外错误或安全事件的风险。具体来说，Move可防止资产被复制。“资源类型”使数字资产能够限制为与物理资产相同的属性：资源只有单一所有者，且只能使用一次，并且新资源的创建受到限制。



Move 让关键交易代码开发更加容易，它可以安全地实现Libra生态治理策略，例如Libra货币和网络验证节点的管理。我们预计开发人员创建可用合约的能力将随时间的推移不断加强。这将为Move的演进提供支持。

进一步参考[了解 Move 语言](https://learnblockchain.cn/docs/libra/docs/move-overview/) 




## Libra系统生态

Libra生态系统由下面几个部分组成：

* [客户端](#客户端)
* [验证器节点](#验证器节点)
* [开发者](#开发者)

### 客户端

Libra客户端：

* 是一种能够与Libra 区块链交互的软件
* 由最终用户或者用户代表来运行(例如：一个保管人客户端). 
* 允许用户构建，签名并将交易提交给[验证程序节点](reference/glossary.md#validator-node)
* 可以向Libra区块链发出查询（通过验证程序节点），请求交易或帐户的状态，并验证响应。

Libra Core包含一个客户端，可以将事务提交到testnet。. [Libra上的第一笔交易](my-first-transaction.md) 指导我们使用Libra CLI客户端在Libra区块链上执行第一个交易。

### 验证器节点  

[验证器节点](reference/glossary.md#validator-node) 是Libra生态系统中的实体，它们共同决定将哪些交易添加到Libra区块链中。 验证器使用[共识协议](reference/glossary.md#consensus-protocol) 以便它们可以容忍恶意验证器的存在。 验证器节点维护区块链上所有交易的历史记录。 在内部，验证器节点需要保持当前状态以执行交易并计算下一个状态。我们将在[交易生命周期](life-of-a-transaction)了解有关验证器节点组件的更多信息。



测试网络testnet是一组公开可用的验证器节点，可用于尝试系统。也可以使用Libra Core自行运行验证程序节点。



### 开发者

Libra生态系统支持各种各样的开发人员，从贡献Libra Core的人到使用区块链的构建应用程序的人。  开发人员可能如下：

* 建立Libra客户端的人
* 构建与Libra客户端进行交互的应用程序的人
* 编写在区块链上运行的智能合约。
* 为Libra区块链软件做出贡献的人。



## 参考

* [Libra 协议: 概念](libra-protocol.md) &mdash; 介绍Libra协议的基本概念。
* [Libra上的第一笔交易](my-first-transaction.md) &mdash; 指导使用Libra CLI客户端在Libra区块链上执行第一笔交易。
* [了解 Move 语言](move-overview.md) &mdash;  介绍新区块链编程语言Move。
* [交易的生命周期](life-of-a-transaction.md) &mdash; 提供交易提交和执行时“幕后”发生的事情。
* [Libra Core 概要](libra-core-overview.md) &mdash; Libra Core 组件的概念和实现细节。
* [CLI 指南](reference/libra-cli.md) &mdash; 列出Libra CLI客户端的命令及其用法。
* [Libra 术语表](reference/glossary.md) &mdash; 提供Libra术语的快速参考。
