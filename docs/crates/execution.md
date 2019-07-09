---
id: execution
title: Execution
custom_edit_url: https://github.com/libra/libra/edit/master/execution/README.md
---

## 概要

Libra区块链是一个复制的状态机，那么每个验证机中都存在一个副本，从创世区块状态 S<sub>0</sub>, 每一笔交易
T<sub>i</sub> 将先前状态 S<sub>i-1</sub> 更新为 S<sub>i</sub>. 每
S<sub>i</sub> 是从帐户（由32字节地址表示）映射到
与每个帐户关联的一些数据。

执行之间根据完全有序的交易，通过Move虚拟机来处理每个交易输出，然后将输出应用于先前的状态，并生成一个新的状态，执行组件和共识算法 &mdash; HotStuff 一种基于领导者的算法，协同工作, 帮助它提议一组拟议的交易及其执行达成一致。这样一个交易组是一个块。与其他区块链系统不同，块除了作为一批交易之外没有任何意义 - 每一个交易由其在分类账中的位置来识别，这也是被称为“版本”。 每个共识参与者构建一个块树，如下：

```
                   ┌-- C
          ┌-- B <--┤
          |        └-- D
<--- A <--┤                            (A is the last committed block)
          |        ┌-- F <--- G
          └-- E <--┤
                   └-- H

          ↓  After committing block E

                 ┌-- F <--- G
<--- A <--- E <--┤                     (E is the last committed block)
                 └-- H
```

A block is a list of transactions that should be applied in the given order once
the block is committed. Each path from the last committed block to an
uncommitted block forms a valid chain. Regardless of the commit rule of the
consensus algorithm, there are two possible operations on this tree:

1. 使用给定的父节点向树中添加块，并扩展特定的链 (例如，用块' G '扩展块' F ')。当我们扩展a用一个新的区块链，该区块应该包含正确的执行块中交易的结果，就好像它的所有祖先都是按照同样的顺序提交。然而，所有未提交的块和它们的执行结果保存在某个临时位置，对外部客户端不可见。
2. 提交一个块。随着共识收集到越来越多关于块的选票，它决定根据某些特定的方法提交一个块及其所有祖先规则。然后我们将所有这些块保存到永久存储中，并在同一时间丢弃所有冲突的块。

因此，执行组件提供了两个主要 api— `execute_block` 和 `commit_block`  -以支持上述操作。

## 实施细节

每个版本的状态都表示为存储中的稀疏Merkle树。当一个交易提交修改一个帐户时，该帐户和树中的兄弟帐户将根帐户加载到内存中。例如，如果我们执行一个交易 T<sub>i</sub> 在提交状态之前，并修改账户 `A`,我们最终会得到如下的树:

```
             S_i
            /   \
           o     y
          / \
         x   A
```

其中 `A` 具有帐户的新状态，而 `y` 和 `x` 是兄弟节点从根到树中的 `A` 的路径.  如果下一个交易 T<sub>i+1</sub>
修改了另一个帐户 `B` 它位于 `y` 的子树种, 一棵新的树将会
构建，结构将如下所示：

```
                S_i        S_{i+1}
               /   \      /       \
              /     y   /          \
             / _______/             \
            //                       \
           o                          y'
          / \                        / \
         x   A                      z   B
```

使用这个结构，我们可以查询全局状态，同时考虑到未提交交易的输出。例如，如果我们想执行
另一个交易 T<sub>i+1</sub><sup>'</sup>, 我们可以使用树
S<sub>i</sub>. 如果我们查找帐户A，我们可以在树中找到它的新值。 
否则，我们知道该帐户不存在于树中，我们可以退回到
存储。另一个例子，如果我们想执行交易 T<sub>i+2</sub>, 
我们可以使用树 S<sub>i+1</sub> 它更新了帐户 `A` 
和 `B` 的值.

## 这个组件是怎样的？

    execution
            └── execution_client   # A Rust wrapper on top of GRPC clients.
            └── execution_proto    # All interfaces provided by the execution component.
            └── execution_service  # Execution component as a GRPC service.
            └── executor           # The main implementation of execution component.
