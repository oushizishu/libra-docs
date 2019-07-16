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

* **account** 在Libra区块链中，账户是任意数量的 [Move 模块](#move-module) 和 [Move 资源](#move-resources). 的容器。这实际上意味着每个帐户的状态由代码和数据组成。
* 该帐户由 [账户地址](#账户地址) 来作为标识。

### 账户地址

* **address** Libra账户地址是 256位值。
* 用户可以通过生成加密密钥对来创建地址。
* 帐户地址是用户的公钥的加密散列。
* Libra用户可以创建的地址数量没有限制。

### 准入控制 (AC)

* **admission control** 在Libra Core中，准入控制是验证器的唯一外部接口。 来自客户端的任何请求（交易提交或查询）都通过准入控制。 客户端不能在不经过AC访问存储或系统中的任何其他组件。 这会过滤请求并保护系统。

* AC 是验证者进行所有客户端交互的入口点。 它对提交的交易执行基本有效性检查。 完成有效性检查后，它将交易传递给 [内存池](#mempool).

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
* 在该配置中，N通常设置为3f + 1。 持有f票的验证人将被允许有错误 &mdash; 离线，恶意，缓慢等等。只要 [诚实](#honest-validator) 验证者持有2f + 1票，他们就能够就一致的决策达成共识。
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

* **consensus protocol** 共识协议是由n个验证器节点共同执行以接受或拒绝交易，并就交易的顺序和 [执行结果](#execution-result) 达成一致.
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

* An **event** is the user-facing representation of the effects of executing a transaction.
* A transaction may be designed to emit any number of events as a list. For example, a peer-to-peer payment transaction emits a `SentPaymentEvent` for the sender account and a `ReceivedPaymentEvent` for the recipient account. 
* In the Libra protocol, events provide evidence that the successful execution of a transaction resulted in a specific effect. The `ReceivedPaymentEvent` (in the above example) allows the recipient to confirm that a payment was received into their account. 
* Events are persisted on the blockchain and are used to answer queries by [客户端](#客户端).  

### Execution Result

* Execution result of a transaction is a combination of:
    * The new state of the set of accounts affected by the transaction.
    * The events emitted by executing the transaction.
    * The exit code, which indicates either success or a specific error.
    * The number of gas units consumed while executing the transaction.

### Expiration Time

A transaction ceases to be valid after its **expiration time**. If it is assumed that:

* Time_C is the current time that is agreed upon between validators (Time_C is not the local time of the client);
* Time_E is the expiration time of a transaction T_N; and
* Time_C > Time_E and transaction T_N has not been included in the blockchain,

then there is a guarantee that T_N will never be included in the blockchain.

## F

* * *

### Faucet

* **Faucet** is the way to create Libra currency with no real world value, only on our testnet.
* The Faucet is a service running along with the testnet. This service only exists to facilitate minting coins for the testnet.
* You can use the Faucet by sending a request to create coins and transfer them into a given account on your behalf.

## G

* * *

### Gas

* **Gas** is a way to pay for computation and storage on a blockchain network.  All transactions on the Libra network cost a certain amount of gas.
* The gas required for a transaction depends on the size of the transaction, the computational cost of executing the transaction, and the amount of additional global state created by the transaction (e.g., if new accounts are created).
* The purpose of gas is regulating demand for the limited computational and storage resources of the validators, including preventing denial of service (DoS) attacks.

### Gas Price

* Each transaction specifies the **gas price** (in microlibra/gas units) it is willing to pay. 
* The price of gas required for a transaction depends on the current demand for usage of the network.
* The **gas cost** (denominated in gas units) is fixed at a point in time.

## H

* * *

### Honest (Validator)

* A validator that faithfully executes the consensus protocol and is not Byzantine.

### HotStuff

* **HotStuff** is a recent proposal for a [BFT](#byzantine-fault-tolerance-bft) consensus protocol. 
* LibraBFT, Libra's consensus algorithm, is based on HotStuff.
* It simplifies the reasoning about safety, and it addresses some performance limitations of previous consensus protocols.

## L

* * *

### LBR

* **LBR** is the abbreviation for Libra currency.

### Leader

* A **leader** is a validator node that proposes a block of transactions for the consensus protocol.
* In leader-based protocols, nodes must agree on a leader to make progress.
* Leaders are selected by a function that takes the current [round number](https://fb.quip.com/LkbMAEBIVNbh#ffYACAO6CzD) as input. 

### Libra (The Currency)

* **Libra** is a global digital currency.
* It is stored on the Libra Blockchain.
* It is backed by a reserve of assets.
* It is governed by the independent Libra Association.

### Libra Association

* The **Libra Association** is an independent, not-for-profit membership organization, headquartered in Geneva, Switzerland. The association's purpose is to coordinate and provide a framework for governance of the network and reserve. 
* The association is created by the validator nodes who will run on the Libra network.
* Refer to the [Libra white paper](https://libra.org/en-us/whitepaper) for the a description of the mission, vision, and purview of the Libra Association.

### Libra Association Council

* Libra Association Council is the governing body of the Libra Association.
* Libra Association Council is part of the Libra Association.

### LibraBFT

* LibraBFT is the Libra protocol's BFT consensus algorithm.
* LibraBFT is based on HotStuff.

### Libra Blockchain

* The **Libra Blockchain** is a ledger of immutable transactions agreed upon by the validator nodes on the Libra network (the network of validator nodes).

### Libra Core

* **Libra Core** is the official name for the open-source implementation of the Libra protocol published by the Libra Association.
* This software is the first implementation of the Libra protocol and the Move language. 
* Libra Core includes both validator and client functionalities.

### Libra Protocol

* **Libra protocol** is the specification of how transactions are submitted, ordered, executed, and recorded within the Libra ecosystem.

### Libra Reserve

* **Libra reserve** is the total monetary holdings that back Libra.
* To be a validator node for the Libra Association, it is a requirement to invest in the reserve.

### LibraAccount.T

* A **`LibraAccount.T`** is a Move resource that holds all the administrative data associated with an account, such as sequence number, balance, and authentication key.
*  A **`LibraAccount.T`** is the only resource that every account is guaranteed to contain.

### LibraAccount module

* **The LibraAccount module** is a Move module that contains the code for manipulating the administrative data held in a particular `LibraAccount.T` resource.
* Code for checking or incrementing sequence numbers, withdrawing or depositing currency, and extracting gas deposits is included in the LibraAccount module. 

### Libra testnet 

* See [testnet](#testnet).

## M

* * *
### mainnet

* The Libra mainnet is the main network of the Libra Blockchain with a digital currency known as [Libra](#libra). 
* The Libra currency on mainnet will be backed by a reserve of assets.
* Mainnet will be governed by the independent [Libra Association](#libra-assocition) tasked with evolving the ecosystem. 

### Maximum Gas Amount

* The **Maximum Gas Amount**  of a transaction is the maximum amount of gas the sender is ready to pay for the transaction.
* The gas charged is equal to the gas price multiplied by units of work required to process this transaction. If the result is less than the max gas amount, the transaction has been successfully executed.
* If the transaction runs out of gas while it is being executed or the account runs out of balance during execution, then the sender will be charged for gas used and the transaction will fail. 

### Mempool

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

### Move Module

* A **Move module** defines the rules for updating the global state of the Libra Blockchain. 
* In the Libra protocol, a Move module is a **smart contract**.
* Each user-submitted transaction includes a transaction script. The transaction script invokes procedures of one or more Move modules to update the global state of the blockchain according to the rules.

### Move Resources

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


