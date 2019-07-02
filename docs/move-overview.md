---
id: move-overview
title: 了解 Move 语言
---

Move是一种新的编程语言，为 Libra 区块链提供安全、可编程的基础。 Libra区块链中的帐户作为容器，包含了任意数量的Move资源和Move模块。 提交给 Libra 区块链的每个交易都使用 Move 编写的交易脚本来实现其逻辑。 交易脚本可以通过调用模块声明的过程（procedures）来更新区块链的全局状态。

> 译者注：Move 的过程（procedure）可以理解为其他语言的的函数。

在本指南的第一部分中，我们从上层的角度介绍 Move语言的主要功能：

1. [可编程的Move交易脚本](#可编程的move交易脚本)
2. [可组合智能合约的Move模块](#可组合智能合约的move模块)
3. [Move的一等资源](#move的一等资源)

有兴趣的读者，可以进一步于都[Move技术手册](move-paper.md) 了解有关该语言的各种细节。

在本指南的第二部分中，我们将“深入”并向您展示如何在[Move中间表示层](#move中间表示层-ir)中编写自己的Move程序. 初始版本的testnet测试网络不支持自定义Move程序，但这些功能可以在本地使用。

## Move的主要特性

### 可编程的Move交易脚本

* 每一个Libra区块链上交易都包含 **Move交易脚本** 用来对交易逻辑的编码，同时验证器据此验证客户端的行为（例如，将Libra币从Alice的帐户移动到Bob的帐户）。 
* 交易脚本通过调用一个或者多个[Move模块](#可组合智能合约的move模块)的过程和Libra区块链全局存储中发布的 [Move资源](#move的一等资源) 进行交互。
* 交易脚本不存储在区块链的全局状态中，其他的交易脚本也无法调用它，这是一次性程序。
* 我们在[编写交易脚本](#编写交易脚本) 中提供了几个交易脚本示例。

### 可组合智能合约的Move模块

Move模块（Modules）定义了更新 Libra 区块链全局状态的规则。 这些模块与其他区块链系统中与智能合约相同。 模块声明可以在用户帐户下发布的 [资源](#move的一等资源) 类型。Libra 区块链中的每个帐户都是一个容器，可以容纳任意数量的资源和模块。

* 模块声明两种结构类型（包括资源，这是一种特殊的结构）和过程。
* Move模块的过程定义了创建，访问和销毁它声明的类型的规则。
* 模块可重复使用。 在一个模块中声明的结构类型可以使用在另一个模块中，并且在一个模块中声明的过程可以在另一个模块中声明的公共过程中调用。 模块可以调用其他Move模块中声明的过程。 交易脚本可以调用已发布模块的任何公共过程。
* 最终，Libra用户将能够在自己的帐户下发布模块。

### Move的一等资源

* Move的关键功能是能自定义资源类型。 资源类型通过编码具有丰富可编程性和安全性。
* 资源是语言中的普通类型值。 它们可以存储为数据结构，作为参数传递给过程，从过程返回，等等。
* Move的系统为资源提供特殊的安全性保证。 Move资源永远不会被复制，重用或丢弃。 资源类型只能由定义类型的模块创建或销毁。 这些保证由[Move虚拟机](reference/glossary.md#move-virtual-machine-mvm) 通过字节码静态验证，Move虚拟机将拒绝运行未通过字节码验证的程序代码。
* Libra货币实现为名为 `LibraCoin.T` 的资源类型。 `LibraCoin.T` 在语言中没有特殊的地位; 每个Move资源都享有相同的保护。

## Move: 底层

### Move中间表示层(IR)

本节介绍如何在Move中间表示层（IR：intermediate representation）中编写 [交易脚本](#编写交易脚本)和[模块](#编写模块) 我们提醒读者，IR是即将推出的Move语言的早期（且不稳定） (详见 [未来开发体验](#未来的开发者体验) 更新相关详细信息). Move IR是一个覆盖于Move字节码之上的轻量语法层，用于测试字节码验证器和虚拟机，它对开发人员不是特别友好。开发人员可基于它编写高级别的可读代码，但又足够底层可以直接编译Move字节码。尽管如此，我们还是对Move语言感到兴奋，并希望开发人员能够尝试一下IR，尽管它还存在一些不足之处。

我们将继续介绍重要评论的Move IR的细节。 我们鼓励读者通过在本地编译，运行和修改示例来跟随这些示例。 `libra/language/README.md` 和 `libra/language/ir_to_bytecode/README.md` 下的README文件解释了如何执行此操作。

### 编写交易脚本

正如我们在 [启用可编程Move交易脚本](#可编程的move交易脚本) 中所描述的, 用户编写交易脚本以请求更新Libra 区块链的全局存储。 几乎任何交易脚本中都会出现两个重要的构建块 `LibraAccount.T` 和 `LibraCoin.T` 。 `LibraAccount` 是模块的名称, `T` 是该模块声明的资源的名称。这是Move中常见的命名规则; 模块声明的“main”类型通常命名为 `T`. 

当我们说用户 "在Libra区块链上有一个地址为 `0xff` 开头的帐号" 时, 我们的意思是地址 `0xff` 拥有 `LibraAccount.T` 资源的实例。 每个非空地址都有一个 `LibraAccount.T` 资源。 此资源存储帐户数据，例如序列号，身份验证密钥和余额。 在Libra区块链上想要与帐户有任何交互都必须通过从 `LibraAccount.T` 资源读取数据或调用 `LibraAccount` 模块来实现.

账户余额是 `LibraCoin.T` 类型的资源. 正如我们在 [Move的一等资源](#move的一等资源) 中所解释的那样，这是Libra
 Coin类型。 与任何其他Move资源一样，此类型是语言中的“一等公民”。 `LibraCoin.T` 类型的资源可以存储在程序变量中，在程序之间传递，等等。

我们鼓励感兴趣的读者在 `libra/language/stdlib/modules/` 目录下的 `LibraAccount` 和 `LibraCoin` 模块中检查这两个关键资源的Move IR定义。

现在让我们看看程序员如何在交易脚本中与这些模块和资源进行交互。

```move
// Simple peer-peer payment example.

// Use LibraAccount module published on the blockchain at account address
// 0x0...0 (with 64 zeroes). 0x0 is shorthand that the IR pads out to
// 256 bits (64 digits) by adding leading zeroes.
import 0x0.LibraAccount;
import 0x0.LibraCoin;
main(payee: address, amount: u64) {
  // The bytecode (and consequently, the IR) has typed locals.  The scope of
  // each local is the entire procedure. All local variable declarations must
  // be at the beginning of the procedure. Declaration and initialization of
  // variables are separate operations, but the bytecode verifier will prevent
  // any attempt to use an uninitialized variable.
  let coin: R#LibraCoin.T;
  // The R# part of the type above is one of two *kind annotation* R# and V#
  // (shorthand for "Resource" and "unrestricted Value"). These annotations
  // must match the kind of the type declaration (e.g., does the LibraCoin
  // module declare `resource T` or `struct T`?).

  // Acquire a LibraCoin.T resource with value `amount` from the sender's
  // account.  This will fail if the sender's balance is less than `amount`.
  coin = LibraAccount.withdraw_from_sender(move(amount));
  // Move the LibraCoin.T resource into the account of `payee`. If there is no
  // account at the address `payee`, this step will fail
  LibraAccount.deposit(move(payee), move(coin));

  // Every procedure must end in a `return`. The IR compiler is very literal:
  // it directly translates the source it is given. It will not do fancy
  // things like inserting missing `return`s.
  return;
}
```

这个交易脚本有一个不好的地方 &mdash; 如果 `收款人` 地址下没有帐户，它将失败。 我们将通过修改脚本来为 `收款人` 创建帐户（如果账户不存在）来解决此问题。

```move
// A small variant of the peer-peer payment example that creates a fresh
// account if one does not already exist.

import 0x0.LibraAccount;
import 0x0.LibraCoin;
main(payee: address, amount: u64) {
  let coin: R#LibraCoin.T;
  let account_exists: bool;

  // Acquire a LibraCoin.T resource with value `amount` from the sender's
  // account.  This will fail if the sender's balance is less than `amount`.
  coin = LibraAccount.withdraw_from_sender(move(amount));

  account_exists = LibraAccount.exists(copy(payee));

  if (!move(account_exists)) {
    // Creates a fresh account at the address `payee` by publishing a
    // LibraAccount.T resource under this address. If theres is already a
    // LibraAccount.T resource under the address, this will fail.
    create_account(copy(payee));
  }

  LibraAccount.deposit(move(payee), move(coin));
  return;
}
```

让我们看一个更复杂的例子。 在此示例中，我们将使用交易脚本面向多个接收人。

```move
// Multiple payee example. This is written in a slightly verbose way to
// emphasize the ability to split a `LibraCoin.T` resource. The more concise
// way would be to use multiple calls to `LibraAccount.withdraw_from_sender`.

import 0x0.LibraAccount;
import 0x0.LibraCoin;
main(payee1: address, amount1: u64, payee2: address, amount2: u64) {
  let coin1: R#LibraCoin.T;
  let coin2: R#LibraCoin.T;
  let total: u64;

  total = move(amount1) + copy(amount2);
  coin1 = LibraAccount.withdraw_from_sender(move(total));
  // This mutates `coin1`, which now has value `amount1`.
  // `coin2` has value `amount2`.
  coin2 = LibraCoin.withdraw(&mut coin1, move(amount2));

  // Perform the payments
  LibraAccount.deposit(move(payee1), move(coin1));
  LibraAccount.deposit(move(payee2), move(coin2));
  return;
}
```

这就结束了我们对交易脚本的“浏览”。 有关更多示例，包括初始testnet中支持的交易脚本，请参阅 `libra/language/stdlib/transaction_scripts`.

### 编写模块

我们现在将注意力转向编写自己的Move模块，而不是仅仅重用现有的 `LibraAccount` 和 `LibraCoin` 模块。 考虑这种情况：
Bob将在未来的某个时间点在地址*a*创建一个帐户。 Alice希望向Bob“指定”一些资金，这样一旦Bob的账户创建好了，她就可以把这些资金转到他的账户中。但她也希望，如果Bob从未创建过账户，她也能收回自己的资金。

为了解决Alice的这个问题，我们将编写一个模块 `EarmarkedLibraCoin` ：
* 声明一个新的资源类型 `EarmarkedLibraCoin.T` 包含Libra Coin和接收人地址。
* 允许Alice创建这样的类型并在她的帐户下发布它（`create`过程）。
* 允许Bob声明资源（`claim_for_recipient`过程）。
* 允许任何拥有 `EarmarkedLibraCoin.T` 的人销毁它并获得之前“指定”（质押）资金（`unwrap`程序）。

```move
// A module for earmarking a coin for a specific recipient
module EarmarkedLibraCoin {
  import 0x0.LibraCoin;

  // A wrapper containing a Libra coin and the address of the recipient the
  // coin is earmarked for.
  resource T {
    coin: R#LibraCoin.T,
    recipient: address
  }

  // Create a new earmarked coin with the given `recipient`.
  // Publish the coin under the transaction sender's account address.
  public create(coin: R#LibraCoin.T, recipient: address) {
    let t: R#Self.T;

    // Construct or "pack" a new resource of type T. Only procedures of the
    // `EarmarkedCoin` module can create an `EarmarkedCoin.T`.
    t = T {
      coin: move(coin),
      recipient: move(recipient),
    };

    // Publish the earmarked coin under the transaction sender's account
    // address. Each account can contain at most one resource of a given type; 
    // this call will fail if the sender already has a resource of this type.
    move_to_sender<T>(move(t));
    return;
  }

  // Allow the transaction sender to claim a coin that was earmarked for her.
  public claim_for_recipient(earmarked_coin_address: address): R#Self.T {
    let t: R#Self.T;
    let t_ref: &R#Self.T;
    let sender: address;

    // Remove the earmarked coin resource published under `earmarked_coin_address`.
    // If there is resource of type T published under the address, this will fail.
    t = move_from<T>(move(earmarked_coin_address));

    t_ref = &t;
    // This is a builtin that returns the address of the transaction sender.
    sender = get_txn_sender();
    // Ensure that the transaction sender is the recipient. If this assertion
    // fails, the transaction will fail and none of its effects (e.g.,
    // removing the earmarked coin) will be committed.  99 is an error code
    // that will be emitted in the transaction output if the assertion fails.
    assert(*(&move(t_ref).recipient) == move(sender), 99);

    return move(t);
  }

  // Allow the creator of the earmarked coin to reclaim it.
  public claim_for_creator(): R#Self.T {
    let t: R#Self.T;
    let coin: R#LibraCoin.T;
    let recipient: address;
    let sender: address;

    sender = get_txn_sender();
    // This will fail if no resource of type T under the sender's address.
    t = move_from<T>(move(sender));
    return move(t);
  }

  // Extract the Libra coin from its wrapper and return it to the caller.
  public unwrap(t: R#Self.T): R#LibraCoin.T {
    let coin: R#LibraCoin.T;
    let recipient: address;

    // This "unpacks" a resource type by destroying the outer resource, but
    // returning its contents. Only the module that declares a resource type
    // can unpack it.
    T { coin, recipient } = move(t);
    return move(coin);
  }

}
```

Alice可以通过创建一个交易脚本为Bob创建一个专用币，该脚本包括Bob的地址*a*和同时在她拥有的  `LibraCoin.T`  上调用`create`。 一旦*a*创建，Bob就可以通过从*a*发送交易来获得币。 这将调用`claim_for_recipient`，将结果传递给`unwrap`，并将返回的`LibraCoin` 的结果存储。 如果Bob花费太长时间在*a*下创建一个帐户，这时候Alice想要收回她的资金，她可以通过使用`claim_for_creator`然后使用`unwrap`来实现。

细心的读者可能已经注意到，该模块中的代码与`LibraCoin.T`的内部结构无关。 它可以很容易地使用程序泛型来编写（例如，`resource T <AnyResource：R> {coin：AnyResource，...}`）。 我们目前正致力于为Move添加对这种参数多态的支持。

### 未来的开发者体验

在不久的将来，IR将稳定下来，编译和验证程序的用户体检将更好。 此外，将跟踪来自IR源的位置信息并将其传递给验证程序，使得错误消息更易于调试。 但是，IR将继续作为测试Move字节码的工具。 它意味着是底层字节码的语义更加透明。 为了进行有效的测试，IR编译器会生成一些错误的代码，这些代码将被字节码验证程序拒绝或在运行时在编译器中失败。 友好的用户源语言会做出不同的选择; 它应该拒绝编译将在后续步骤中失败的代码。

将来，我们将拥有更高级别的Move源语言。 该源语言旨在安全轻松地表达常见的Move惯用语法和编程模式。 由于Move是一种新语言，而Libra 区块链是一种新的编程环境，我们对应该支持的惯用语法和模式的理解仍在不断发展。 Move源语言还处于开发的早期阶段，我们还没有发布它的时间表。
