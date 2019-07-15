---
id: move-language
title: Move Language
custom_edit_url: https://github.com/libra/libra/edit/master/language/README.md
---

Move是一种新的编程语言，旨在为Libra区块链提供安全可编程的基础。

## 组织

Move 语言目录由五个部分组成:

- [虚拟机](https://github.com/libra/libra/tree/master/language/vm) (VM), 它包含字节码格式、字节码解释器和执行交易块的基础设施。该目录还包含生成创世区块的基础结构

- [字节码验证器](https://github.com/libra/libra/tree/master/language/bytecode_verifier), 其中包含一个静态分析工具，用于拒绝无效的Move字节码。虚拟机在执行前遇到的任何新的Move代码上运行字节码验证器。编译器在其输出上运行字节码验证器，并将错误显示给程序员。

- Move中间层表示 (IR) [compiler](https://github.com/libra/libra/tree/master/language/stdlib), 它将可读的程序文本编译成Move字节码. *警告:IR编译器是一个测试工具。它可以生成将被Move字节码验证器拒绝的无效字节码。IR语法是一个正在进行的工作，将经历重大的变化。*

- [标准库](https://github.com/libra/libra/tree/master/language/stdlib), 其中包含 `LibraAccount` 和 `LibraCoin` 等核心系统模块的Move IR代码。

- [测试](https://github.com/libra/libra/tree/master/language/functional_tests) 用于虚拟机，字节码验证程序和编译器。 这些测试是在Move IR中编写的，由测试框架运行，该测试框架从注释中编码的特殊指令解析运行测试的预期结果。

## Move语言嵌入Libra Core

Libra Core组件通过VM与语言组件交互。 具体来说， [准入控制](https://github.com/libra/libra/tree/master/admission_control) 组件使用有限的只读 VM 虚拟机的子功能 [子集](https://github.com/libra/libra/tree/master/vm_validator) 在被允许进入内存池并达成共识之前丢弃无效的交易。 [执行](https://github.com/libra/libra/tree/master/execution) 使用VM执行一个交易块。

### 认识Move IR

* 你可以在 [测试](https://github.com/libra/libra/tree/master/language/functional_tests/tests/testsuite) 中找到很多小型的Move IR示例.  尝试使用Move IR的最简单方法是在此目录中创建一个新测试，并按照运行测试的说明进行操作。
* 可以在 [标准库](https://github.com/libra/libra/tree/master/language/stdlib/modules) 中找到更实际的示例。 最值得注意的两个是 [LibraAccount.mvir](https://github.com/libra/libra/blob/master/language/stdlib/modules/libra_account.mvir), 它实现了Libra区块链上的账户, 以及 [LibraCoin.mvir](https://github.com/libra/libra/blob/master/language/stdlib/modules/libra_coin.mvir), 它实现了 Libra coin.
* Libra testnet支持四个交易脚本也在directiory中。 它们是 [点对点交易](https://github.com/libra/libra/blob/master/language/stdlib/transaction_scripts/peer_to_peer_transfer.mvir), [创建账户](https://github.com/libra/libra/blob/master/language/stdlib/transaction_scripts/create_account.mvir), [铸币 Libra](https://github.com/libra/libra/blob/master/language/stdlib/transaction_scripts/mint.mvir) (仅适用于具有适当权限的帐户), and [密钥轮换](https://github.com/libra/libra/blob/master/language/stdlib/transaction_scripts/rotate_authentication_key.mvir).
* Move IR语法最完整的文档是 [语法](https://github.com/libra/libra/blob/master/language/compiler/src/parser/mod.rs). 您还可以查看 [Move IR解释器](https://github.com/libra/libra/blob/master/language/compiler/src/parser/syntax.lalrpop).
* 查看 [IR 编译器说明文件](https://github.com/libra/libra/blob/master/language/compiler/README.md) 了解有关编写Move IR代码的更多详细信息。

### 目录组织

```
├── README.md          # This README
├── bytecode_verifier  # The bytecode verifier
├── functional_tests   # Testing framework for the Move language
├── compiler           # The IR to Move bytecode compiler
├── stdlib             # Core Move modules and transaction scripts
├── test.sh            # Script for running all the language tests
└── vm
    ├── cost_synthesis # Cost synthesis for bytecode instructions
    ├── src            # Bytecode language definitions, serializer, and deserializer
    ├── tests          # VM tests
    ├── vm_genesis     # The genesis state creation, and blockchain genesis writeset
    └── vm_runtime     # The bytecode interpreter
```
