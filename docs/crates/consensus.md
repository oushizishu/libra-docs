---
id: consensus
title: Consensus
custom_edit_url: https://github.com/libra/libra/edit/master/consensus/README.md
---

共识组件使用LibraBFT共识协议进行状态机复制。

## 概述

共识协议允许一组验证器来创建单个数据库的逻辑模型。共识协议在验证器之间复制提交交易，针对当前的数据库中执行一些发起未确认的交易，然后对交易排序并对执行达成初步的结果。因此，所有的验证器都可以在 [状态机复制规范](https://dl.acm.org/citation.cfm?id=98167) 之后为给定的版本号维护相同的数据库。 Libra 区块链使用 [HotStuff 共识协议](https://arxiv.org/pdf/1803.05069.pdf) 的变体, 这是最新的一种拜占庭容错 ([BFT](https://en.wikipedia.org/wiki/Byzantine_fault)) 共识协议, 称为LibraBFT. 它在Dwork，Lynch和Stockmeyer的论文中“部分同步存在中的共识”中定义的部分同步模型中提供安全性（所有诚实的验证者都同意提交和执行）和活跃性（持续产生提交） ([DLS](https://groups.csail.mit.edu/tds/papers/Lynch/jacm88.pdf)) 并在 [PBFT](http://pmg.csail.mit.edu/papers/osdi99.pdf) 中使用，以及 [Tendermint](https://arxiv.org/abs/1807.04938) 等新协议。 在本文档中，我们提供了LibraBFT协议的高级描述，并讨论了代码的组成。 请参阅 [here](https://developers.libra.org/docs/the-libra-blockchain-paper) 了解LibraBFT如何适应Libra区块链。 有关LibraBFT的规格和证明的详细信息，请阅读完整的 [技术报告](https://developers.libra.org/docs/state-machine-replication-paper).

即使无法避免拜占庭式的错误，我们也必须在验证者之间达成关于数据库状态的一致的协议，拜占庭故障模型允许一些验证器在没有约束的情况下随意偏离协议，但计算限制除外（因此加密假设无法破解）。拜占庭故障是最坏情况，其中验证者串通并且恶意行为以试图破坏系统一致性。拜占庭故障的共识协议，则能容忍由恶意或被黑客控制的验证器引起的问题，也可以缓解相关的硬件和软件故障。

LibraBFT前提假设一组有 3f + 1 的投票分布在一组验证器中，这些验证器可能是诚实的，也可能是未知的。这时候LibraBFT仍然是安全的，能够防止攻击，如双花和分叉，最多 f 票是由拜占庭验证器控制 &mdash; 也就意味着至少有2f+1票是诚实的。只要存在全局稳定时间（GST），LibraBFT仍然在线，从客户端进行交易，之后诚实验证器之间的所有消息都会在最大网络延迟 $\Delta$ 内传递给其他诚实的验证器(这是部分同步 [DLS](https://groups.csail.mit.edu/tds/papers/Lynch/jacm88.pdf))中介绍的模型。除了传统的保证之外，LibraBFT在验证器崩溃和重启时仍然保持安全 - 即使所有验证器同时重启。

### LibraBFT 概要

在LibraBFT中，验证器接收来自客户机的交易，并通过共享的内存池协议彼此共享它们。然后LibraBFT协议按顺序进行。然后LibraBFT协议以一系列轮次进行。在每一轮中，验证者扮演领导者的角色，并提出一个交易块，以扩展包含完整先前交易历史的经过认证的块序列（请参阅下面的法定人数证书）。验证器接收提议的块并检查其投票规则，以确定是否应该投票支持对该块进行验证。这些简单的规则确保LibraBFT的安全性，并且它们的实现可以被清晰地分离和审计。如果验证器打算为该块投票，它会以推测方式执行块的交易，而不会产生外部影响。这将导致对数据库的验证器的计算，该验证器是由块执行产生的。验证器然后将块的签名投票和数据库验证器发送给领导者。领导者收集这些投票以形成法定人数证书，为该区块提供 $\ge$ 2f + 1 票的证据，并将法定人数证书广播给所有验证人。

当满足连续三次在链上提交规则，将会提交区块，如果它具有仲裁证书并且在轮次k + 1和k + 2处由另外两个块和仲裁证书确认，则提交第k轮的块。提交规则最终允许诚实的验证器提交块。 LibraBFT保证所有诚实的验证器最终都会提交块（以及从它链接的块序列）。 一旦提交了一系列块，就可以保持执行其交易后产生的状态并形成一个状态复制后的数据库。

### HotStuff 范例的优点

我们根据性能，可靠性，安全性，健壮实现的简易性以及验证器的操作开销评估了几种基于BFT的协议。我们的目标是选择最初支持至少100个验证器的协议，并且能够随着时间的推移而发展以支持500-1,000个验证器。 选择HotStuff协议作为LibraBFT的基础有三个原因： (i) 简单性和模块性; (ii) 共识与执行易于结合起来的能力; (iii) 在早期实验中表现良好。

HotStuff协议分解为安全模块（投票和提交规则）和活跃（起搏器）。 这种解耦提供了独立开发和实验两套环境，且能并行地在不同模块上进行实验的能力。 由于简单的投票和提交规则，协议安全性易于实现和验证。 将执行作为共识的一部分进行集成是很简单的，以避免由于领导在协议中的非确定性执行而产生问题。 最后，我们的早期原型确认了高吞吐量和低事务延迟，这在 [HotStuff]((https://arxiv.org/pdf/1803.05069.pdf)) 进行了独立的验证， 我们没有考虑基于工作量的协议，例如 [Bitcoin](https://bitcoin.org/bitcoin.pdf), 因为它们的性能和高能耗（和环境）成本。

### HotStuff 扩展和修改

在LibraBFT中，为了更好地支持Libra生态系统的目标，我们以多种方式扩展和调整了核心HotStuff协议和实现。重要的是，我们重新定义了安全条件，并提供了安全、活力和多样化响应性的扩展证明。我们还实现了一些附加功能。首先，通过让验证器对块的结果状态(而不仅仅是交易序列)进行集体签名，我们使协议更能抵抗非确定性错误。 这还允许客户端使用仲裁证书来验证数据库中的读取。 其次，我们设计了一个发出明确超时的起搏器，验证器依靠法定人数来进入下一轮 - 不需要同步时钟。 第三，我们打算设计一个不可预测的领导者选举机制，其中一轮的领导者由最新提交的块的提议者使用可验证的随机函数[VRF](https://people.csail.mit.edu/silvio/Selected%20Scientific%20Papers/Pseudo%20Randomness/Verifiable_Random_Functions.pdf) 确定。 这种机制限制了攻击者可以针对领导者发起有效拒绝服务攻击的时间窗口。 第四，我们使用聚合签名来保留签署仲裁证书的验证者的身份。 这使我们能够为有助于仲裁证书的验证人提供激励。 聚合签名也不需要复杂的 [密钥阈值设置](https://www.cypherpunks.ca/~iang/pubs/DKG.pdf).

## 实施细节

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
