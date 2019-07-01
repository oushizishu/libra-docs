---
id: my-first-transaction
title: Libra上的第一笔交易
---

本文档将指导您在Libra 区块链上执行您的第一笔交易。 在执行第一笔交易的步骤之前，我们建议您阅读以下文档，以熟悉Libra生态系统和Libra协议的关键方面：

* [欢迎页](welcome-to-libra.md)
* [Libra协议核心概念](libra-protocol.md)

我们提供了一个命令行界面（CLI）客户端来与区块链进行交互。

## 约定准备条件

本文档中的所有命令均假定已经完成如下准备：

* 您运行的是Linux（基于Red Hat或Debian）或macOS系统。
* 可以稳定地连接到互联网。
* `git` 已在您的系统上安装。
* macOS上已安装Homebrew。
* `yum`或者 `apt-get` 已在您的Linux系统上安装。

## 提交交易的步骤

在这个例子中，我们将下载必要的Libra组件并在两个用户（Alice和Bob）之间执行一个交易操作。
执行以下步骤将交易提交到Libra testnet上的验证程序节点：

1. [克隆并构建Libra Core](#clone-and-build-libra-core).
2. [编译Libra CLI客户端并连接到testnet](#build-libra-cli-client-and-connect-to-the-testnet).
3. [创建Alice和Bob的帐户](#create-alice-s-and-bob-s-account).
4. [铸币并添加到Alice和Bob的账户](#add-libra-coins-to-alice-s-and-bob-s-accounts).
5. [提交交易](#submit-a-transaction).

## 克隆并编译Libra Core

### 克隆Libra Core库

```bash
git clone https://github.com/libra/libra.git
```

### 安装Libra Core

要安装Libra Core，请切换到`libra`目录并运行安装脚本来安装相关的依赖项，如下所示：

```
cd libra
./scripts/dev_setup.sh
```
安装脚本执行以下操作：

* 安装rustup ＆mdash; rustup是Rust编程语言的安装程序，Libra Core是基于Rust实现的。
* 安装版本所需的rust-toolchain.
* 安装CMake &mdash; 用于编译项目。
* 安装protoc &mdash; 缓冲区编译器。
* 安装Go &mdash; 用于编译缓冲区编译器。

如果您的安装失败，详见[故障排除说明](#setup)

## 编译Libra CLI客户端并连接到Testnet

运行客户端，连接到Libra testnet网络的验证器节点，如下图所示：

```bash
./scripts/cli/start_cli_testnet.sh
```

使用cargo（Rust的包管理器）编译和运行客户端，并将客户端连接到testnet上的验证器节点。

客户端连接到testnet上的节点后，您将看到以下输出。 要随时退出客户端，请使用`quit`命令。

```
usage: <command> <args>

Use the following commands:

account | a
  Account operations
query | q
  Query operations
transfer | transferb | t | tb
  <sender_account_address>|<sender_account_ref_id> <receiver_account_address>|<receiver_account_ref_id> <number_of_coins> [gas_unit_price (default=0)] [max_gas_amount (default 10000)] Suffix 'b' is for blocking.
  Transfer coins from account to another.
help | h
  Prints this help
quit | q!
  Exit this client


Please, input commands:

libra%
```
如果您在编译运行客户端和连接到testnet时遇到问题，请参阅[故障排除说明](#client-build-and-run).

<blockquote class="block_note">

**注意**: 如果要在系统上本地运行验证器节点，请按照[运行本地验证](#run-a-local-validator-node)中的说明进行操作。 创建帐户，铸币和执行交易的说明与testnet上的节点相同。

</blockquote>

## 创建Alice和Bob的账户

将客户端连接到testnet后，可以运行CLI命令来创建新帐户。这里为两个用户（Alice和Bob）创建帐户。

### 步骤1：检查CLI客户端是否在您的系统上运行

出现一个 **libra%** 命令行提示符表示您的Libra CLI客户端正在运行。 要查看`account`命令的帮助信息，请输入“account”，如下所示：

```plaintext
libra% account
usage: account <arg>

Use the following args for this command:

create | c
  Create an account. Returns reference ID to use in other operations
list | la
  Print all accounts that were created or loaded
recover | r <file path>
  Recover Libra wallet from the file path
write | w <file name>
  Save Libra wallet mnemonic recovery seed to disk
mint | mintb | m | mb <receiver account> <number of coins>
  Mint coins to the account. Suffix 'b' is for blocking
```

### 步骤2： 创建Alice账户

请注意，使用CLI创建帐户不会更新区块链，只会创建本地密钥对。

要创建Alice的帐户，请输入以下命令：

`libra% account create`

成功后输出如下：

```plaintext
>> Creating/retrieving next account from wallet
Created/retrieved account #0 address 3ed8e5fafae4147b2a105a0be2f81972883441cfaaadf93fc0868e7a0253c4a8
```

＃0是Alice帐户的索引，十六进制字符串是Alice帐户的地址。 索引只是引用Alice帐户的一种方式。 帐户索引是本地CLI索引，可以在其他CLI命令中使用，以便用户方便地引用他们创建的帐户。 该指数对区块链毫无意义。 只有当通过铸币将任何一笔钱添加到Alice的账户时，才会在区块链上创建Alice的账户，或者通过来自另一个用户的转账将钱转移到Alice的账户。 请注意，您也可以在CLI命令中使用十六进制地址。 帐户索引只是帐户地址的方便显示。

### 步骤3: 创建Bob的账户

要创建Bob的帐户，请重复之前帐户创建命令：

`libra% account create`

成功后输出如下：

```plaintext
>> Creating/retrieving next account from wallet
Created/retrieved account #1 address 8337aac709a41fe6be03cad8878a0d4209740b1608f8a81566c9a7d4b95a2ec7
```

#1 是Bob帐户的索引，十六进制字符串是Bob帐户的地址。
有关索引的更多详细信息，请参阅[创建Alice的账户](#step-2-create-alice-s-account)

### 步骤4 (可选): 账户列表

要列出您创建的帐户，请输入以下命令：

`libra% account list`

成功后输出如下：
```plaintext
User account index: 0, address: 3ed8e5fafae4147b2a105a0be2f81972883441cfaaadf93fc0868e7a0253c4a8, sequence number: 0
User account index: 1, address: 8337aac709a41fe6be03cad8878a0d4209740b1608f8a81566c9a7d4b95a2ec7, sequence number: 0
```
帐户中的序列号表示从该帐户发送的交易数。 每次从该帐户发送的交易被执行后并存储在区块链中时，它会递增。 要了解更多信息，请参阅 [序列号](reference/glossary.md#sequence-number).

## 添加Libra Coin到Alice和Bob账户

Minting and adding coins to accounts on testnet is done via Faucet. Faucet is a service that runs along with the testnet. This service only exists to facilitate minting coins for testnet and will not exist for [mainnet](reference/glossary.md#mainnet). It creates Libra with no real-world value. Assuming you have [created Alice’s and Bob’s account](#create-alice-s-and-bob-s-account), with index 0 and index 1 respectively, you can follow the steps below to add Libra to both accounts.

### Step 1: Add 110 Libra to Alice’s Account

To mint Libra and add to Alice’s account, enter this command:

`libra% account mint 0 110`

* 0 is the index of Alice’s account.
* 110  is the amount of Libra to be added to Alice’s account.

A successful account mint command will also create Alice’s account on the blockchain.

Sample output on success:

```plaintext
>> Minting coins
Mint request submitted
```
Note that when the request is submitted, it means that it has been added to the mempool (of a validator node on testnet) successfully. It does not necessarily imply that it will be successfully completed. Later, we will query the account balance to confirm if minting was successful.

If your account mint command did not submit your request successfully, refer to
[Troubleshooting](#minting-and-adding-money-to-account)

### Step 2: Add 52 Libra to Bob’s Account

To mint Libra and add to Bob’s account, enter this command:

`libra% account mint 1 52`

* 1 is the index of Bob’s account.
* 52 is the amount of Libra to be added to Bob’s account.
* A successful account mint command will also create Bob’s account on the blockchain. Another way to create Bob’s account on the blockchain is to transfer money from Alice’s account to Bob’s account.

Sample output on success:

```plaintext
>> Minting coins
Mint request submitted
```
If your account mint command did not submit your request successfully, refer to
[Troubleshooting](#minting-and-adding-money-to-account)

### Step 3: Check the Balance

To check the balance in Alice’s account, enter this command:

`libra% query balance 0`

Sample output on success:

`Balance is: 110`

To check the balance in Bob’s account, enter this command:

`libra% query balance 1`

Sample output on success:

`Balance is: 52`

## Submit a Transaction

Before we submit a transaction to transfer Libra from Alice’s account to Bob’s account, we will query the sequence number of each account. This will help us understand how executing a transaction changes the sequence number of each account.

### Query the Accounts’ Sequence Numbers

```plaintext
libra% query sequence 0
>> Getting current sequence number
Sequence number is: 0
libra% query sequence 1
>> Getting current sequence number
Sequence number is: 0
```

In `query sequence 0`, 0 is the index of Alice’s account. A sequence number of 0 for both Alice’s and Bob’s accounts indicates that no transactions from either Alice’s or Bob’s account has been executed so far.

### Transfer Money

To submit a transaction to transfer 10 Libra from Alice’s account to Bob’s account, enter this command:

`libra% transfer 0 1 10`

* 0 is the index of Alice’s account.
* 1 is the index of Bob’s account.
* 10 is the number of Libra to transfer from Alice’s account to Bob’s account.

Sample output on success:

```plaintext
>> Transferring
Transaction submitted to validator
To query for transaction status, run: query txn_acc_seq 0 0 <fetch_events=true|false>
```

You can use the command `query txn_acc_seq 0 0 true` (transaction by account and sequence number) to retrieve the information about the transaction you just submitted. The first parameter is the local index of the sender account, and the second parameter is the sequence number of the account. To see a sample output of this command refer to [Sample Outputs](#query-transaction-by-account-and-sequence-number).

You just submitted your transaction to a validator node on testnet, and it was included in the [mempool](reference/glossary.md#mempool) of the validator. This doesn't necessarily mean your transaction has been executed. In theory, if the system were slow or overloaded, it would take some time to see the results, and you may have to check multiple times by querying the accounts. To query an account with index 0, you can use the command  `query account_state 0.` The expected output is shown in the [Sample Outputs](#query-events) section

To troubleshoot the transfer command, refer to [Troubleshooting](#the-transfer-command).

**The Blocking Transfer Command**: You can use the `transferb` command (as shown below), instead of the `transfer` command. `transferb` will submit the transaction and return to the client prompt only after the transaction has been committed to the blockchain. An example is shown below:

`libra% transferb 0 1 10`

Refer to [Life of a Transaction](life-of-a-transaction.md) for an understanding of the lifecycle of a transaction from submission to execution and storage.

### Query Sequence Number After Transfer

```plaintext
libra% query sequence 0
>> Getting current sequence number
Sequence number is: 1
libra% query sequence 1
>> Getting current sequence number
Sequence number is: 0
```

The sequence number of 1 for Alice’s account (index 0) indicates that one transaction has been sent from Alice’s account so far. The sequence number of 0 for Bob’s account (index 1) indicates that no transaction has been sent from Bob’s account so far. Every time a transaction is sent from an account, the sequence number is incremented by 1.

### Check the Balance in Both Accounts After Transfer

To check the final balance in both accounts, query the balance again for each account as you did in [this step](#step-3-check-the-balance). If your transaction (transfer) executed successfully, you should see 100 Libra in Alice’s account and 62 Libra in Bob’s account.

```plaintext
libra% query balance 0
Balance is: 100
libra% query balance 1
Balance is: 62
```

### Congratulations!

You have successfully executed your transaction on the Libra testnet and transferred 10 Libra from Alice’s account to Bob’s account!

## Troubleshooting

### Setup

* Update Rust:
    * Run `rustup update` from your libra directory.
* Re-run setup script from your libra directory:
    * `./scripts/dev_setup.sh`

### Client Build and Run

If you are experiencing build failures, try to remove the cargo lock file from the libra directory:

* `rm Cargo.lock`

If your client did not connect to the testnet:

* Check your internet connection.
* Ensure that you are using the latest version of the client. Pull the latest Libra Core and rerun the client:
    * `./scripts/cli/start_cli_testnet.sh`


### Minting and Adding Money to Account

* If the validator node you connected to on testnet is unavailable, you will get a “Server unavailable” message as shown below:

  ```plaintext
  libra% account mint 0 110
  >> Minting coins
  [ERROR] Error minting coins: Server unavailable, please retry and/or check **if** host passed to the client is running
  ```
* If your balance was not updated after submitting a transaction, wait a moment and query the balance again. There may be a delay if the blockchain is experiencing a very high volume of transactions.  If your balance still is not updated, please try minting again.

* To check if an account exists, query the account state. For an account with index 0 enter this:

  `libra% query account_state 0`

### The Transfer Command

If the testnet validator node (your client was connected to) is unavailable or your connection to the testnet has timed-out, you will see this error:

```plaintext
libra% transfer 0 1 10
>> Transferring
[ERROR] Failed to perform transaction: Server unavailable, please retry and/or check if host passed to the client is running
```
To troubleshoot transfer errors:

* Check the connection to testnet.
* Query the sender account to make sure it exists. Use the following command for an account with index 0:
    * `query account_state 0`
* You can try quitting the client using `quit` or `q!`, and rerun the following command to connect to the testnet:
    * `./scripts/cli/start_cli_testnet.sh` from the libra directory

## Sample Outputs of Additional Query Commands

### Query Transaction by Account and Sequence Number

This example will query for a single transaction's details using the account and sequence number.

```plaintext
libra% query txn_acc_seq 0 0 true
>> Getting committed transaction by account and sequence number
Committed transaction: SignedTransaction {
 { raw_txn: RawTransaction {
    sender: 3ed8e5fafae4147b2a105a0be2f81972883441cfaaadf93fc0868e7a0253c4a8,
    sequence_number: 0,
    payload: {,
      transaction: peer_to_peer_transaction,
      args: [
        {ADDRESS: 8337aac709a41fe6be03cad8878a0d4209740b1608f8a81566c9a7d4b95a2ec7},
        {U64: 10000000},
      ]
    },
    max_gas_amount: 10000,
    gas_unit_price: 0,
    expiration_time: 1560466424s,
},
 public_key: 55af3fe3f28550a2f1e5ebf073ef193feda44344d94c463b48be202aa0b3255d,
 signature: Signature( R: CompressedEdwardsY: [210, 23, 214, 62, 228, 179, 64, 147, 81, 159, 180, 138, 100, 211, 111, 139, 178, 148, 81, 1, 240, 135, 148, 145, 104, 234, 227, 239, 198, 153, 13, 199], s: Scalar{
  bytes: [203, 76, 105, 49, 64, 130, 162, 81, 22, 237, 159, 26, 80, 181, 111, 94, 84, 6, 152, 126, 181, 192, 62, 103, 130, 94, 246, 174, 139, 214, 3, 15],
} ),
 }
 }
Events:
ContractEvent { access_path: AccessPath { address: 3ed8e5fafae4147b2a105a0be2f81972883441cfaaadf93fc0868e7a0253c4a8, type: Resource, hash: "217da6c6b3e19f1825cfb2676daecce3bf3de03cf26647c78df00b371b25cc97", suffix: "/sent_events_count/" } , index: 0, event_data: AccountEvent { account: 8337aac709a41fe6be03cad8878a0d4209740b1608f8a81566c9a7d4b95a2ec7, amount: 10000000 } }
ContractEvent { access_path: AccessPath { address: 8337aac709a41fe6be03cad8878a0d4209740b1608f8a81566c9a7d4b95a2ec7, type: Resource, hash: "217da6c6b3e19f1825cfb2676daecce3bf3de03cf26647c78df00b371b25cc97", suffix: "/received_events_count/" } , index: 0, event_data: AccountEvent { account: 3ed8e5fafae4147b2a105a0be2f81972883441cfaaadf93fc0868e7a0253c4a8, amount: 10000000 } }
```

Note that the transaction amount is shown in microlibra.

### Query Events

In the following example, we will query for “sent” events from the account at reference index 0.  You will notice there is a single event since we sent one transaction from this account.  The proof of the current state is also returned so that verification can be performed that no events are missing - this is done when the query does not return “limit” events.

```plaintext
libra% query event 0 sent 0 true 10
>> Getting events by account and event type.
EventWithProof {
  transaction_version: 3,
  event_index: 0,
  event: ContractEvent { access_path: AccessPath { address: e7460e02058b36d28e8eef03f0834c605d3d6c57455b8ec9c3f0a3c8b89f248b, type: Resource, hash: "217da6c6b3e19f1825cfb2676daecce3bf3de03cf26647c78df00b371b25cc97", suffix: "/sent_events_count/" } , index: 0, event_data: AccountEvent { account: 46efbad798a739c088e0e98dd9d592c27c7eb45ba1f8ccbdfc00bd4d7f2947f3, amount: 10000000 } },
  proof: EventProof { ledger_info_to_transaction_info_proof: AccumulatorProof { siblings: [HashValue(62570ae9a994bcb20c03c055667a4966fa50d0f17867dd5819465072fd2c58ba), HashValue(cce2cf325714511e7d04fa5b48babacd5af943198e6c1ac3bdd39c53c87cb84c)] }, transaction_info: TransactionInfo { signed_transaction_hash: HashValue(69bed01473e0a64140d96e46f594bc4b463e88e244b694e962b7e19fde17f30d), state_root_hash: HashValue(5809605d5eed94c73e57f615190c165b11c5e26873012285cc6b131e0817c430), event_root_hash: HashValue(645df3dee8f53a0d018449392b8e9da814d258da7346cf64cd96824f914e68f9), gas_used: 0 }, transaction_info_to_event_proof: AccumulatorProof { siblings: [HashValue(5d0e2ebf0952f0989cb5b38b2a9b52a09e8d804e893cb99bf9fa2c74ab304bb1)] } }
}
Last event state: Some(
    AccountStateWithProof {
        version: 3,
        blob: Some(
            AccountStateBlob {
             Raw: 0x010000002100000001217da6c6b3e19f1825cfb2676daecce3bf3de03cf26647c78df00b371b25cc974400000020000000e7460e02058b36d28e8eef03f0834c605d3d6c57455b8ec9c3f0a3c8b89f248b00e1f50500000000000000000000000001000000000000000100000000000000
             Decoded: Ok(
                AccountResource {
                    balance: 100000000,
                    sequence_number: 1,
                    authentication_key: 0xe7460e02058b36d28e8eef03f0834c605d3d6c57455b8ec9c3f0a3c8b89f248b,
                    sent_events_count: 1,
                    received_events_count: 0,
                },
            )
             },
        ),
        proof: AccountStateProof {
            ledger_info_to_transaction_info_proof: AccumulatorProof {
                siblings: [
                    HashValue(62570ae9a994bcb20c03c055667a4966fa50d0f17867dd5819465072fd2c58ba),
                    HashValue(cce2cf325714511e7d04fa5b48babacd5af943198e6c1ac3bdd39c53c87cb84c),
                ],
            },
            transaction_info: TransactionInfo {
                signed_transaction_hash: HashValue(69bed01473e0a64140d96e46f594bc4b463e88e244b694e962b7e19fde17f30d),
                state_root_hash: HashValue(5809605d5eed94c73e57f615190c165b11c5e26873012285cc6b131e0817c430),
                event_root_hash: HashValue(645df3dee8f53a0d018449392b8e9da814d258da7346cf64cd96824f914e68f9),
                gas_used: 0,
            },
            transaction_info_to_account_proof: SparseMerkleProof {
                leaf: Some(
                    (
                        HashValue(c0fbd63b0ae4abfe57c8f24f912f164ba0537741e948a65f00d3fae0f9373981),
                        HashValue(fc45057fd64606c7ca40256b48fbe486660930bfef1a9e941cafcae380c25871),
                    ),
                ),
                siblings: [
                    HashValue(4136803b3ba779bb2c1daae7360f3f839e6fef16ae742590a6698b350a5fc376),
                    HashValue(5350415253455f4d45524b4c455f504c414345484f4c4445525f484153480000),
                    HashValue(a9a6bda22dd6ee78ddd3a42da152b9bd39797b7da738e9d6023f407741810378),
                ],
            },
        },
    },
)
```

### Query Account State

In this example, we will query for the state of a single account.

```plaintext
libra% query account_state 0
>> Getting latest account state
Latest account state is:
 Account: 3ed8e5fafae4147b2a105a0be2f81972883441cfaaadf93fc0868e7a0253c4a8
 State: Some(
    AccountStateBlob {
     Raw: 0x010000002100000001217da6c6b3e19f1825cfb2676daecce3bf3de03cf26647c78df00b371b25cc9744000000200000003ed8e5fafae4147b2a105a0be2f81972883441cfaaadf93fc0868e7a0253c4a800e1f50500000000000000000000000001000000000000000100000000000000
     Decoded: Ok(
        AccountResource {
            balance: 100000000,
            sequence_number: 1,
            authentication_key: 0x3ed8e5fafae4147b2a105a0be2f81972883441cfaaadf93fc0868e7a0253c4a8,
            sent_events_count: 1,
            received_events_count: 0,
        },
    )
     },
)
 Blockchain Version: 3
```

## Run a Local Validator Node

To start a validator node locally on your computer and create your own local blockchain network (not connected to the Libra testnet), ensure that you have run the build script as described in [Setup Libra Core](#setup-libra-core), change to the root directory of the Libra Core repository, and run `libra_swarm` as shown below:

```bash
$ cd ~/libra
$ cargo run -p libra_swarm -- -s
```

`-p libra_swarm` - causes cargo to run the libra_swarm package, which starts a local blockchain consisting of one node.

`-s` option starts a local client to connect to the local blockchain.

To see additional options for starting a node and connecting to the Libra Blockchain, run:

`$ cargo run -p libra_swarm -- -h`

The cargo run command may take some time to run. If the execution of this command completes without errors, an instance of the Libra CLI client and a Libra validator node is running on your system. Upon successful execution, you should see an output containing the CLI client menu and the `libra%` prompt.

## Life of a Transaction

Once you have executed your first transaction, you may refer to the document [Life of a Transaction](life-of-a-transaction.md) for:

* A look "under the hood" at the lifecycle of a transaction from submission to execution.
* An understanding of the interactions between each logical component of a Libra validator as transactions get submitted and executed in the Libra ecosystem.

## Reference

* [Welcome page](welcome-to-libra.md).
* [Libra Protocol: Key Concepts](libra-protocol.md) &mdash; Introduces you to the fundamental concepts of the Libra protocol.
* [Getting Started With Move](move-overview.md) &mdash; Introduces you to a new blockchain programming language called Move.
* [Life of a Transaction](life-of-a-transaction.md) &mdash; Provides a look at what happens "under the hood" when a transaction is submitted and executed.
* [Libra Core Overview](libra-core-overview.md) &mdash; Provides the concept and implementation details of the Libra Core components through READMEs.
* [CLI Guide](reference/libra-cli.md) &mdash; Lists the commands (and their usage) of the Libra CLI client.
* [Libra Glossary](reference/glossary.md) &mdash; Provides a quick reference to Libra terminology.
