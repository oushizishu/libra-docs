---
id: glossary
title: Glossary
---


## A

* * *

### 累加器根哈希

* **accumulator root hash** [Merkle 累加器](https://eprint.iacr.org/2009/625.pdf) 的hash root

### 访问路径

* **access path** 指定特定帐户中资源或Move模块的位置。
* 在Libra 区块链的状态中，帐户被表示为值的访问路径的映射。 Move VM将此表示反序列化为模块和资源。
* 客户端可以使用访问路径来请求资源或存储在资源内的特定数据。

### 账户

* **account** 在Libra区块链中，账户是任意数量的 [Move模块](#move模块) 和 [Move资源](#move资源). 的容器。这实际上意味着每个帐户的状态由代码和数据组成。
* 该帐户由 [账户地址](#账户地址) 来作为标识。

### 账户地址

* **address** Libra账户地址是 256位值。
* 用户可以通过生成加密密钥对来创建地址。
* 帐户地址是用户的公钥的加密散列。
* Libra用户可以创建的地址数量没有限制。

### 准入控制

* **admission control** 在Libra Core中，准入控制是验证器的唯一外部接口。 来自客户端的任何请求（交易提交或查询）都通过准入控制。 客户端不能在不经过AC访问存储或系统中的任何其他组件。 这会过滤请求并保护系统。

* AC 是验证者进行所有客户端交互的入口点。 它对提交的交易执行基本有效性检查。 完成有效性检查后，它将交易传递给 [内存池](#内存池).

* 客户端将使用AC提交交易和执行查询（只读）。

### 密钥验证

* **authentication key** 用于验证用于签署交易的加密密钥。
* 它是存储在区块链上用户帐户中的一段数据。
* 用户可以通过转变身份验证密钥来转变签名密钥。

## B

* * *

### 块

* **block** 是一个或多个交易的有序列表。 验证者使用它来就交易的排序和执行结果达成共识。
* 块是Libra区块链中的内部实现概念，即它们对客户端不可见。 提交给Libra分类帐的所有交易在某个时间点都是块的一部分，但是区块链表示为一系列交易。

### 区块链

* **blockchain** 是一个分布式公共账本。
* Libra区块链由批准的交易和这些交易的执行结果组成。

### 拜占庭(验证者)

* **validator** 验证者不遵循共识协议的规范，并希望损害协议的正确执行。
* 传统的BFT算法最多支持拜占庭验证者持有的三分之一的算法投票权。

### 拜占庭容错

* **Byzantine Fault Tolerance** 拜占庭容错（BFT）是分布式系统在存在故障或 “[拜占庭(验证者)](#拜占庭(验证者)),” 成员低于某个阈值时提供安全和活性保证的能力。
* Libra 区块链使用LibraBFT，这是一个基于 [HotStuff.](#hotstuff)的共识协议。
* BFT算法通常与许多实体一起操作，它们共同持有N个投票（在系统的Libra应用程序中称为“验证器”）。
* 选择N作为一个值来计算为了抵御一些持有f票的恶意验证器。
* 在该配置中，N通常设置为3f + 1。 持有f票的验证人将被允许有错误 &mdash; 离线，恶意，缓慢等等。只要 [诚实](#诚实验证者) 验证者持有2f + 1票，他们就能够就一致的决策达成共识。
* 这意味着BFT共识协议可以正常运行，即使被破坏或失败的验证器节点保留多达三分之一的投票权。

## C

* * *

### 客户端

**client** 客户端是一款能够与Libra 区块链进行交互的软件。

* 它可以允许用户构造，签名并将新交易提交给验证器节点的准入控制组件。
* 它可以向Libra区块链发出查询和请求交易，帐户的状态查询。
* 客户端可以由最终用户或代表最终用户运行（例如，托管钱包）。 

### 共识

**Consensus** 共识组件是验证器节点的一个组件。 
* 共识组件负责所有验证器之间对要执行的交易块、它们的顺序和执行结果的协调和协议。
* Libra区块链是由这些一致的交易及其相应的执行结果组成的。

### 达成一致协议

* **consensus protocol** 共识协议是由n个验证器节点共同执行以接受或拒绝交易，并就交易的顺序和 [执行结果](#执行结果) 达成一致.
* 详见 [拜占庭容错](#拜占庭容错)

### 保管钱包

* **custodial wallet** 在保管钱包模型中，钱包负责保管客户的资金和私钥。

## D

* * *

### 数字货币

* *替代名称:* 加密数字货币。
* Libra上一种数字货币的类型。

## E

* * *

### Ed25519

* **Ed25519** 是我们支持的数字签名方案。 
* 更具体地说，Libra在Ed25519曲线上使用PureEdDSA方案，如RFC 8032中所定义。

### 时期

* **epoch** 时期是一段时间，在该时间段内，共识协议的实例与一组固定的验证者和投票权一起运行。
* 要更改验证器和/或其投票权的集合，当前时期提交特殊/管理智能合约交易结束，并启动新的。

### 事件

* **event** 事件是执行交易的效果并向用户的表示。
* 可以将交易设计为以列表的形式发出任意数量的事件。 例如，点对点支付交易为发件人帐户发出 `SentPaymentEvent` 收件人帐户发出 `ReceivedPaymentEvent` . 
* 在Libra协议中，事件提供了成功执行交易产生特定效果的证据。 `ReceivedPaymentEvent` 在上面的例子中）允许收件人确认他们的帐户收到了付款。
* 事件在区块链上持久存在，通过 [客户端](#客户端) 查询.  

### 执行结果

* 交易的执行结果是以下组合：
    * 交易执行后的区块链上的新状态。
    * 通过执行交易发出的事件
    * 退出代码，表示成功或特定错误。
    * 执行交易时消耗的gas单位数。

### 到期时间

交易在 **expiration time**.到期时间，后不再有效。如果假设：

* Time_C是验证者之间达成一致的当前时间（Time_C不是客户端的本地时间）;
* Time_E是交易T_N的到期时间
* Time_C> Time_E和交易T_N尚未包含在区块链中，

然后保证T_N永远不会包含在区块链中。

## F

* * *

### 水龙头

* **Faucet** 水龙头是在测试网上创建没有真正世界价值的Libra Coin的方法。
* 水龙头是一个与testnet一起运行的服务。 此服务仅用于促进测试网的铸币。
* 你可以通过使用水龙头发送一个创币的请求，并可以将你将币转到指定的账户。

## G

* * *

### Gas

* **Gas** 是一种支付区块链网络计算和存储费用的方法。 Libra网络上的所有交易都需要一定数量的Gas。
* 交易所需的手续费取决于交易的大小，执行交易的计算成本以及交易创建的额外全局状态的量（例如，如果创建新账户）。
* Gas的目的是调节对验证器的有限计算和存储资源的需求，包括防止拒绝服务（DoS）攻击。

### Gas价格

* 每笔交易均指明其愿意支付的**Gas价格**（以微/Gas为单位）。
* 交易所需的Gas价格取决于当前对网络使用的需求。
* Gas成本（以Gas单位计价）固定在某个时间点。

## H

* * *

### 诚实验证者

* 一个忠实地执行共识协议而不是拜占庭式的验证器。

### HotStuff

* **HotStuff** 是最新的 [拜占庭容错](#拜占庭容错) 共识协议的提案。
* Libra的共识算法LibraBFT基于HotStuff。
* 它简化了安全性的推理，并解决了先前共识协议的一些性能限制。

## L

* * *

### LBR

* **LBR** 是Libra货币的缩写

### 领导者

* **leader** 领导者是一个验证者节点，它为共识协议提出一个交易块。
* 在基于领导者的协议中，节点必须就领导者达成一致才能取得进展。
* 领导者由一个函数选择，该函数将当前 [round number](https://fb.quip.com/LkbMAEBIVNbh#ffYACAO6CzD) 作为输入。

### Libra

* **Libra** 是一种全球数字货币。
* 它存储在Libra 区块链上。
* 由资产储备支持。
* 由独立的Libra协会管理。

### Libra协会

* **Libra Association** Libra 协会是一个独立的、非盈利的会员组织，总部设在瑞士日内瓦。协会的宗旨是协调和提供一个网络和储备管理框架。
* 关联由将在Libra网络上运行的验证器节点创建。
* 有关Libra协会的使命，愿景和权限的说明，请参阅 [Libra white paper](https://libra.org/en-us/whitepaper).

### Libra 协会理事会

* Libra 协会理事会是Libra协会的理事机构。
* Libra 协会理事会是Libra协会的一部分。

### LibraBFT

* LibraBFT是Libra协议的BFT一致性算法。
* LibraBFT基于HotStuff。

### Libra 区块链

* **Libra 区块链** 是由Libra网络（验证器节点网络）上的验证器节点商定的不可篡改的分布式分帐本。

### Libra Core

* **Libra Core** 是Libra 协会发布的Libra协议的开源实现软件的官方名称。
* 该软件是Libra协议和Move语言的第一个实现。
* Libra Core 包括验证器和客户端功能。

### Libra 协议

* **Libra 协议** 是在Libra生态系统中如何提交，订购，执行和记录交易的规范。

### Libra 储备

* **Libra reserve** Libra 储备是支持Libra的总货币持有量。
* 要成为Libra协会的验证器节点，就必须对储备进行投资。

### LibraAccount.T

* **`LibraAccount.T`** 是一个Move资源，它包含与帐户关联的所有管理数据，例如序列号，余额和身份验证密钥。
* **`LibraAccount.T`** 是保证每个帐户包含的唯一资源。

### LibraAccount 模块

* **The LibraAccount 模块** 是一个Move模块，其中包含用于操作特定`LibraAccount.T`资源中保存的管理数据的代码。
* LibraAccount模块中包含用于检查或递增序列号，提取或存入货币以及提取gas存量的代码。

### Libra testnet 

* 详见 [testnet](#testnet).

## M

* * *
### 主网

* Libra主网是Libra区块链的主要网络，其数字货币称为 [Libra](#libra). 
* 主网上的Libra货币将由储备资产支持。
* 主网将由独立的 [Libra协会](#libra协会) 管理，其任务是发展生态系统。

### 最大Gas量

* **Maximum Gas Amount** 交易的最大Gas量是发送人准备为交易支付的最大Gas量。
* 收取的Gas等于Gas价格乘以处理此交易所需的工作单位。 如果结果小于最大Gas量，则交易已成功执行。
* 如果交易在执行过程中耗尽了Gas，或者帐户在执行过程中耗尽了Gas，那么将向发送方收取使用了的Gas的费用，交易将失败。

### 内存池

* **Mempool** 内存池是验证器节点的组件之一。 它包含已提交但尚未确定并执行的交易的内存缓冲区。 内存池从 [准入控制](#准入控制) 接收交易.
* 验证器的内存池中的交易是从当前验证器的许可控制（AC）和其他验证器的内存池中添加的。
* 当前验证者是领导者时，其共识从其内存池中提取交易并提出构成块的交易的顺序。 验证者法定人数到达后，对该提案进行投票。

### Merkle Trees

* **Merkle tree** Merkle树是一种经过身份验证的数据结构，可以有效地验证数据完整性和更新。
* Libra网络将整个区块链视为单个数据结构，记录交易历史和状态。
* Merkle树实现了简化访问区块链的应用程序的工作。 它允许应用程序：
    * 从任何时间点读取任何数据。
    * 使用统一的框架验证数据的完整性。

### Merkle 累加器

* [Merkle 累加器](https://www.usenix.org/legacy/event/sec09/tech/full_papers/crosby.pdf) 是一个 _append-only_ Merkle 树，Libra 区块链用它来存储分布式账。
* Merkle累加器可以提供交易包含在链中的证据（“包含证明”）。
* 它们在文献中也被称为 [history trees](http://people.cs.vt.edu/danfeng/courses/cs6204/sp10-papers/crosby.pdf)。

### Move

* **Move** 是一种新的编程语言，用于实现Libra 区块链上的所有交易。
* 它有两种不同的代码 &mdash; [交易脚本](#交易脚本) 和 [Move模块](#move模块).
* 有关“Move”的更多信息，请参阅 [Move技术白皮书](../move-paper.md)

### Move字节码

* Move程序被编译为Move字节码。
* Move字节码用于表示交易脚本和Move模块。

### Move模块

* **Move模块** 定义了更新Libra区块链全局状态的规则。
* 在Libra协议中，Move模块是 **智能合约**.
* 每个用户提交的交易都包含一个交易脚本。 交易脚本调用一个或多个Move模块的过程以根据规则更新区块链的全局状态。

### Move资源

* **Move资源**包含可根据 **Move模块** 中声明的 **程序** 访问数据。
* Move资源永远不会被复制，重用或丢失。这可以防止程序员意外或有意地丢失对资源的跟踪。

### Move 虚拟机 (MVM)

* **Move 虚拟机** 执行用户编写的交易脚本，以 [Move字节码](#Move字节码) 的方式得到 [执行结果](#执行结果). 此结果用于更新区块链 **状态**.
* 虚拟机是 [验证器节点](#验证器节点) 的一部分.

## N

* * *

### 节点

* **节点** 是Libra区块链生态系统的对等实体，用于跟踪Libra区块链的状态。
* Libra节点包括逻辑组件。 [内存池](#内存池), [共识](#共识), 和 [virtual machine](#virtual-machine) 是节点组件的示例。 

## O

* * *

### 开源社区

* **开源社区** 是一个用于开源软件开发人员的术语。 如果您正在阅读本词汇表，那么您就是Libra开发人员社区的一员。

## P

* * *

### 权限许可 vs. 无权限 

* Permissioned和permissionless是节点加入区块链中的验证器集的方式的属性。
* 如果只允许单个实体或组织选择的节点加入委员会，则它是 **有权限被许可** 系统.
* 如果任何节点可以加入委员会，那么这是一个 **无权限** 系统.
* Libra 作为一个需要权限许可的系统启动，并将过渡到无权限。

### 证明

* **证明** 是验证区块链中数据准确性的一种方法。
* Libra区块链中的每个操作都可以通过加密方式验证它确实是正确的并且数据没有被删除或忽略。
* 例如，如果用户查询特定执行交易中的信息，将需要向他们提供加密证据，证明返回给他们的数据确实是正确的。

## R

* * *

### 轮

* **轮** 包括就交易块及其执行结果达成共识。

### 轮序号

* **轮序号** 是用于在共识协议的 [时期](#时期) 期间选择领导者的共享计数器。

## S 

* * *

### 序列号

* **序列号** 帐户的序列号表示从该帐户发送的交易数量。 每次从该帐户发送的交易被执行并存储在区块链中时，它会递增。
* 仅当交易与发件人帐户的当前序列号匹配时才执行交易。 这有助于对来自同一发件人的多个交易进行排序，并防止多重攻击。
* 如果账户A的当前序列号是X，那么只有当T的序列号是X时，才会执行账户A上的交易T.
* 这些交易将保留在内存池中，直到它们是该帐户的下一个序列号（或直到它们过期）。
* 当应用该交易时，帐户的序列号将变为X+1。该帐户具有严格递增的序列号。

### 发送者

* *替代名称*: 发件人地址。
* **发送者** 是交易的发起人帐户的地址。 交易必须由发起人签署。

### 智能合约

* 详见 [Move模块](#move模块).

### 状态

* **状态** Libra协议中的状态是分布式数据库的快照。
* 交易执行修改数据库并生成新的状态。

### 状态root hash

* **状态root hash** 状态根哈希是所有键上的 [Merkle hash](https://en.wikipedia.org/wiki/Merkle_tree) 并且在给定版本中检查Libra 区块链的状态。

## T

* * *
### testnet

* **测试网** 是Libra 区块链软件早期原型的演示，也称为 **Libra Core**. 
* Libra testnet由运行 [Libra Core](#libra-core) 的测试 [验证器节点](#验证器节点) 组成，该软件维护Libra加密货币。
* testnet是为在不干扰或破坏主要加密货币软件的情况下试验新思想而构建的。
* testnet是Libra [主网](#主网), 的前身，但是testnet有一个 _没有现实世界价值_ 的数字货币.

### 交易

* 原始 **交易** 包含以下内容:
    * [发送人 (账户地址)](#账户地址)
    * [交易脚本](#交易脚本)
    * [Gas价格](#Gas价格)
    * [最大Gas量](#最大Gas量)
    * [序列号](#序列号)
    * [到期时间](#到期时间)
* 已签名的交易是具有数字签名的原始交易。
* 执行的交易改变Libra区块链的状态。

### 交易脚本

* 用户提交的每个交易都包括**交易脚本**。
* It represents the operation a client submits to a validator node.  
* The operation could be a request to move coins from user A to user B, or it could involve interactions with published [Move模块](#move模块)/smart contracts.
* The transaction script is an arbitrary program that interacts with resources published in the global storage of the Libra Blockchain by calling the procedures of a module. It encodes the logic for a transaction.
* A single transaction script can send funds to multiple recipients and invoke procedures from several different modules.
* A transaction script **is not** stored in the global state and cannot be invoked by other transaction scripts. It is a single-use program.

## V

* * *

### 验证器节点

* *Alternate name*: Validators.
* A **validator** is an entity of the Libra ecosystem that validates the Libra Blockchain. It receives requests from clients and runs consensus, execution, and storage.
* A validator maintains the history of all the transactions on the blockchain.
* Internally, a validator node needs to keep the current state, to execute transactions and to calculate the next state. 

### Version

* A **version** is also called “height” in blockchain literature. 
* The Libra Blockchain doesn't have an explicit notion of a block &mdash; it only uses blocks for batching and executing transactions.  
* A transaction at height 0 is the first transaction (genesis transaction), and a transaction at height 100 is the 101th transaction in the transaction store.

## W

* * *

### Well Formed Transaction

A Libra transaction is **well formed** if each of the following conditions are true for the transaction:
* The transaction has a valid signature.
* An account exists at the sender address.
* It includes a public key, and the hash of the public key matches the sender account's authentication key. 
* The sequence number of the transaction matches the sender account's sequence number.
* The sender account's balance is greater than the [maximum gas amount](#maximum-gas-amount).
* The expiration time of the transaction has not passed.


