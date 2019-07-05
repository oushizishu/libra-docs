---
id: consensus
title: 共识协议
---

共识协议组件使用LibraBFT共识协议进行状态机复制。

## 概述

共识协议允许一组验证器来创建单数据库的逻辑模型。共识协议在验证器之间复制提交的交易，在当前的数据库基础上执行一些待加入的交易，以及对交易排序和执行结果达成一致。因此，所有的验证器都可以在 [状态机复制规范](https://dl.acm.org/citation.cfm?id=98167) 之下对于给定的版本号维护相同的数据库。 Libra 区块链使用 [HotStuff 共识协议](https://arxiv.org/pdf/1803.05069.pdf) 的变体, 这是最新的一种拜占庭容错 ([BFT](https://en.wikipedia.org/wiki/Byzantine_fault)) 共识协议, 称为LibraBFT。在Dwork，Lynch和Stockmeyer([DLS](https://groups.csail.mit.edu/tds/papers/Lynch/jacm88.pdf)) 的论文（"Consensus in the Presence of Partial Synchrony"）中论述了在部分同步模型中也提供安全性（所有诚实的验证者会确认提案和执行）和存活性（可持续产生提案），这个共识在新协议 [PBFT](http://pmg.csail.mit.edu/papers/osdi99.pdf) （如 [Tendermint](https://arxiv.org/abs/1807.04938) ）中也使用了。
 在本文档中，我们从高层次描述 LibraBFT协议，并讨论代码的组成。 请参阅[这篇论文](https://learnblockchain.cn/docs/libra/docs/the-libra-blockchain-paper/) 了解LibraBFT如何配合Libra区块链。 有关LibraBFT的规范和证明的详细信息，可以阅读完整的[技术论文](https://learnblockchain.cn/docs/libra/docs/state-machine-replication-paper/).

即使存在拜占庭式故障，也必须在验证者之间达成数据库状态的一致，拜占庭故障模型允许一些验证器在没有约束的情况下随意偏离协议，不过依然会有计算限制（假设密码学是无法破解）。拜占庭故障最坏情况是其中验证者串通并且试图恶意破坏系统一致性。拜占庭容错的共识协议，则能容忍由恶意或被黑客控制的验证器引起的问题，缓解相关的硬件和软件故障。

LibraBFT前提假设一组有 3f + 1 的投票分布在一组验证器中，这些验证器可能是诚实的，也可能是拜占庭式（恶意）的。 不超过 f 票是由拜占庭验证器控制的话（也就意味着至少有 2f+1 票是诚实的），这时候LibraBFT仍然是安全的，能够阻止如双花和分叉的攻击。只要存在全局稳定时间（GST），LibraBFT就会保持在线，客户端可提交交易，所有消息都会在最大网络延迟 $\Delta$ 内在诚实的验证器之间得到传递，(在[DLS 论文](https://groups.csail.mit.edu/tds/papers/Lynch/jacm88.pdf) 中有介绍）。除了传统的保证之外，LibraBFT在验证器崩溃和重启时仍然保持安全 - 即使所有验证器同时重启。

### LibraBFT 概要

在LibraBFT中，验证器接收来自客户机的交易，并通过共享的内存池协议彼此共享。然后LibraBFT协议按回合轮次进行。每一个回合，一个验证者会扮演领导者的角色，并提案一个交易区块，以扩展经过认证（请参考下面介绍的法定证明人数投票）的块序列，这个快序列里包含先前完整的交易历史。验证器接收提议的块并检查其投票规则，以确定是否应该投票认证该块。这些简单的规则确保了LibraBFT的安全性，并且它们的实现可以被清晰地分离和审计。如果验证器打算为该块投票，它会以推测方式（speculatively）执行块的交易，而不会产生外部影响。数据库的验证器（authenticator）的计算结果和区块的执行结果一致的话，然后验证器把对块的签名投票和数据库验证者（authenticator）发送给领导者。领导者收集这些投票来生成一个超过法定$\ge$ 2f + 1 证明人数的投票证明，并将法定人数证明广播给所有验证人。

当连续三次在链上提交提议满足规则，将区块会的到确认，即如果这个块（假设为 k 回合的块）具有法定人数证明并且在其后2个回合 k+1 和 k+2 也具有法定人数证明，则第k轮的块得到确认。提交规则最终允许诚实的验证器提交块。 LibraBFT保证所有诚实的验证器最终都会提交块（并且延长之前链接的块序列）。 一旦块被提交确认，执行交易后的结果状态就会永久存储，并形成一个复制数据库。

### HotStuff 优点

我们从性能、可靠性、安全性、健壮实现的简易性以及验证器操作开销几个维度评估了几种基于BFT的协议。我们的目标是选择初期支持至少100个验证器的协议，并且它能够随着时间的推移演进到可支持500-1000个验证器。 选择HotStuff协议作为LibraBFT的基础有三个原因： (i) 简单和模块化; (ii) 方便将共识与执行集成的能力; (iii) 在早期实验中表现良好。

HotStuff协议分解为安全模块（投票和提交规则）和存活模块（“复活起搏器”）。 这种解耦提供了开发和实验两套可独立并行运行环境的能力。 由于简单的投票和提交规则，协议安全性易于实现和验证。 将执行作为共识的一部分进行集成也是很自然的，这可以避免基于领导的协议的非确定性执行而产生分叉的问题。 最后，我们的早期原型也确认了[HotStuff]((https://arxiv.org/pdf/1803.05069.pdf)) 满足高吞吐量和低交易延迟（独立的检测），我们没有考虑基于工作量证明的协议，例如 [Bitcoin](https://bitcoin.org/bitcoin.pdf), 因为它们低性能和高能耗（以及环境）成本。

### HotStuff 扩展和修改

在LibraBFT中，为了更好地支持Libra生态系统的目标，我们以多种方式扩展和调整了核心HotStuff协议和实现。重要的是，我们重新定义了安全条件，并提供了安全、存活度和更高响应度的扩展证明。我们还实现了一些附加功能。首先，通过让验证器对块的结果状态(而不仅仅是交易序列)进行集体签名，我们使协议更能抵抗非确定性错误。 还允许客户端使用法定人数证书来验证读取的数据库。 其次，我们设计了一个发出明确超时的起搏器，验证器依靠法定人数来进入下一轮 - 不需要同步时钟。 第三，我们打算设计一个不可预测的领导者选举机制，其中一轮的领导者由最新提交的块的提议者使用可验证的随机函数[VRF](https://people.csail.mit.edu/silvio/Selected%20Scientific%20Papers/Pseudo%20Randomness/Verifiable_Random_Functions.pdf) 确定。 这种机制限制了攻击者可以针对领导者发起有效拒绝服务攻击的时间窗口。 第四，我们使用聚合签名来保留签署仲裁证书的验证者的身份。 这使我们能够为有助于仲裁证书的验证人提供激励。 聚合签名也不需要复杂的 [密钥阈值设置](https://www.cypherpunks.ca/~iang/pubs/DKG.pdf).

## 实现细节

共识组件主要在 [Actor](https://en.wikipedia.org/wiki/Actor_model) 程序模块中实现 &mdash; 即，它使用消息传递在不同的子组件之间进行通信，其中 [tokio](https://tokio.rs/) 框架用作任务运行时。actor模型的主要例外是(因为它是由几个子组件并行访问的)是共识数据结构 *BlockStore* ，它管理块、执行、仲裁证书和其他共享数据结构。共识组件中的主要子组件是：

* **TxnManager** 是内存池组件的接口，支持拉取交易以及删除已提交的交易。 提议者使用来自内存池中的按需拉取交易来形成提议块。
* **StateComputer** 是访问执行组件的接口。 它可以执行块，提交块，并可以同步状态。
* **BlockStore** 维护提议块树，块执行，投票，仲裁证书和持久存储。 它负责维护这些数据结构组合的一致性，并且可以由其他子组件同时访问。 
* **EventProcessor** 负责处理各个事件 (例如, process_new_round, process_proposal, process_vote). 它公开每个事件类型的异步处理函数和驱动协议。
* **Pacemaker** 负责共识协议的活跃性。 它由于超时证书或仲裁证书而改变轮次，并在它是当前轮次的提议者时提出阻止。
* **SafetyRules** 负责共识协议的安全性。 它处理仲裁证书和分类信息以了解新的提交，并保证遵循两个投票规则 &mdash; 即使在重启的情况下（因为所有安全数据都持久保存到本地存储）。

所有共识消息都由其创建者签名，并由其接收者验证。消息验证发生在离网络层最近的地方，以避免无效或不必要的数据进入协商一致协议。

## 这个模块是怎样的？

```
    consensus
    ├── src
    │   └── chained_bft                # Implementation of the LibraBFT protoocol
    │       ├── block_storage          # In-memory storage of blocks and related data structures
    │       ├── consensus_types        # Consensus data types (i.e. quorum certificates)
    │       ├── consensusdb            # Database interaction to persist consensus data for safety and liveness
    │       ├── liveness               # Pacemaker, proposer, and other liveness related code
    │       ├── safety                 # Safety (voting) rules
    │       └── test_utils             # Mock implementations that are used for testing only
    └── state_synchronizer             # Synchronization between validators to catch up on committed state
```
