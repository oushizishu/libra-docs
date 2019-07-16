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

* **account** 在Libra区块链中，账户是任意数量的 [Move模块](#move-模块) 和 [Move资源](#move-资源). 的容器。这实际上意味着每个帐户的状态由代码和数据组成。
* 该帐户由 [账户地址](#账户地址) 来作为标识。

### 账户地址

* **address** Libra账户地址是 256位值。
* 用户可以通过生成加密密钥对来创建地址。
* 帐户地址是用户的公钥的加密散列。
* Libra用户可以创建的地址数量没有限制。

### 准入控制 (AC)

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

* *Alternate name:* 加密数字货币。
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

### 到期事件

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

### Libra （货币）

* **Libra** 是一种全球数字货币。
* 它存储在Libra 区块链上。
* 由资产储备支持。
* 由独立的Libra协会管理。

### Libra 协会

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

* The Libra mainnet is the main network of the Libra Blockchain with a digital currency known as [Libra](#libra). 
* The Libra currency on mainnet will be backed by a reserve of assets.
* Mainnet will be governed by the independent [Libra Association](#libra-assocition) tasked with evolving the ecosystem. 

### Maximum Gas Amount

* The **Maximum Gas Amount**  of a transaction is the maximum amount of gas the sender is ready to pay for the transaction.
* The gas charged is equal to the gas price multiplied by units of work required to process this transaction. If the result is less than the max gas amount, the transaction has been successfully executed.
* If the transaction runs out of gas while it is being executed or the account runs out of balance during execution, then the sender will be charged for gas used and the transaction will fail. 

### 内存池

* **Mempool** is one of the components of the validator node. It holds an in-memory buffer of transactions that have been submitted but not yet agreed upon and executed. Mempool receives transactions from [admission control](#admission-control).
* Transactions in the mempool of a validator are added from the admission control (AC) of the current validator and from the mempool of other validators.
* When the current validator is the leader, its consensus pulls the transactions from its mempool and proposes the order of the transactions that form a block. The validator quorum then votes on the proposal. 

### Merkle Trees

* **Merkle tree** is a type of authenticated data structure that allows for efficient verification of data integrity and updates.
* Libra network treats the entire blockchain as a single data structure that records the history of transactions and states over time.
* The Merkle tree implementation simplifies the work of apps accessing the blockchain. It allows apps to:
    * Read any data from any point in time. 
    * Verify the integrity of the data using a unified framework.

### Merkle Accumulator

* The [Merkle Accumulator](https://www.usenix.org/legacy/event/sec09/tech/full_papers/crosby.pdf) is an _append-only_ Merkle tree that the Libra Blockchain uses to store the ledger.
* Merkle accumulators can provide proofs that a transaction was included in the chain (“proof of inclusion”).
* They are also called [history trees](http://people.cs.vt.edu/danfeng/courses/cs6204/sp10-papers/crosby.pdf) in literature.

### Move

* **Move** is a new programming language that implements all the transactions on the Libra Blockchain. 
* It has two different kinds of code &mdash; [transaction scripts](#transaction-script) and [Move modules](#move-module).
* For further information on “Move,” refer to the [Move technical paper](../move-paper.md)

### Move Bytecode

* Move programs are compiled into Move bytecode.
* Move bytecode is used to express transaction scripts and Move modules.

### Move模块

* A **Move module** defines the rules for updating the global state of the Libra Blockchain. 
* In the Libra protocol, a Move module is a **smart contract**.
* Each user-submitted transaction includes a transaction script. The transaction script invokes procedures of one or more Move modules to update the global state of the blockchain according to the rules.

### Move资源

* **Move resources** contain data that can be accessed according to the **procedures** declared in a Move **module.**
* Move resources can never be copied, reused, or lost. This protects Move programmers from accidentally or intentionally losing track of a resource.

### Move Virtual Machine (MVM)

* The **Move virtual machine** executes transaction scripts written in [Move bytecode](#move-bytecode) to produce an [execution result](#execution-result). This result is used to update the blockchain **state**.
* The virtual machine is part of a [validator node](#validator-node).

## N

* * *

### Node

* A **node** is a peer entity of the Libra ecosystem that tracks the state of the Libra Blockchain.
* A Libra node comprises of logical components. [Mempool](#mempool), [consensus](#consensus), and [virtual machine](#virtual-machine) are examples of node components. 

## O

* * *

### Open Source Community

* **Open source community** is a term used for a group of developers who work on open-source software. If you're reading this glossary, then you're part of the Libra developer community.

## P

* * *

### Permissioned vs. Permissionless 

* Permissioned and permissionless are attributes of the way by which nodes join the set of validators in a blockchain.
* If only the nodes chosen by a single entity or organization are allowed to join the committee, it's a **permissioned** system.
* If any node can join the committee, it's a **permissionless** system.
* Libra starts as a permissioned system and will transition to permissionless.

### Proof

* A **proof** is a way to verify the accuracy of data in the blockchain. 
* Every operation in the Libra Blockchain can be verified cryptographically that it is indeed correct and that data has not been omitted.
* For example, if a user queries the information within a particular executed transaction, they will be provided with a cryptographic proof that the data returned to them is indeed correct.

## R

* * *

### Round

* A **round** consists of achieving consensus on a block of transactions and their execution results.

### Round Number

* A **round number** is a shared counter used to select leaders during an [epoch](#epoch) of the consensus protocol.

## S 

* * *

### Sequence Number

* The **sequence number** for an account indicates the number of transactions that have been sent from that account. It is incremented every time a transaction sent from that account is executed and stored in the blockchain.
* A transaction is executed only if it matches the current sequence number for the sender account. This helps sequence multiple transactions from the same sender and prevents replay attacks.
* If the current sequence number of an account A is X, then a transaction T on account A will only be executed if T's sequence number is X. 
* These transactions will be held in mempool until they are the next sequence number for that account (or until they expire).
* When the transaction is applied, the sequence number of the account will become X+1. The account has a strictly increasing sequence number.

### Sender

* *Alternate name*: Sender address.
* **Sender** is the address of the originator account for a transaction. A transaction must be signed by the originator.

### Smart Contract

* See [Move Module](#move-module).

### State

* A **state** in the Libra protocol is a snapshot of the distributed database. 
* A transaction modifies the database and produces a new and updated state.

### State Root Hash

* **State root hash** is a [Merkle hash](https://en.wikipedia.org/wiki/Merkle_tree) over all keys and values the state of the Libra Blockchain at a given version.

## T

* * *
### testnet

* The **testnet** is a live demonstration of an early prototype of the Libra Blockchain software, also known as **Libra Core**. 
* The Libra testnet is comprised of test [validator nodes](#validator-node) running [Libra Core](#libra-core), the software which maintains the Libra cryptocurrency. 
* The testnet is built for experimenting with new ideas without disturbing or breaking the main cryptocurrency software. 
* testnet is the predecessor to the Libra [mainnet](#mainnet), but testnet has a digital currency _with no real world value_.

### Transaction

* A raw **transaction** contains the following fields:
    * [Sender (account address)](#account-address)
    * [Transaction script](#transaction-script)
    * [Gas price](#gas-price)
    * [Maximum gas amount](#maximum-gas-amount)
    * [Sequence number](#sequence-number)
    * [Expiration time](#expiration-time)
* A signed transaction is a raw transaction with the digital signature.
* An executed transaction changes the state of the Libra Blockchain.

### Transaction script

* Each transaction submitted by a user includes a **transaction script**.
* It represents the operation a client submits to a validator node.  
* The operation could be a request to move coins from user A to user B, or it could involve interactions with published [Move modules](#move-modules)/smart contracts.
* The transaction script is an arbitrary program that interacts with resources published in the global storage of the Libra Blockchain by calling the procedures of a module. It encodes the logic for a transaction.
* A single transaction script can send funds to multiple recipients and invoke procedures from several different modules.
* A transaction script **is not** stored in the global state and cannot be invoked by other transaction scripts. It is a single-use program.

## V

* * *

### Validator Node

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


