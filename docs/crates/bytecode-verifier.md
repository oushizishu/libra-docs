---
id: bytecode-verifier
title: Bytecode Verifier
custom_edit_url: https://github.com/libra/libra/edit/master/language/bytecode_verifier/README.md
---

### 字节码验证程序：用于检查堆栈使用，类型，资源及引用的安全性

编译后的模块中每个函数的主体分别进行单独验证，同时验证信任模块中函数签名的正确性。 检查每个函数签名是否匹配其自定义内容，单独执行验证。 函数体是一系列字节码指令。 这个指令在下面描述的几个阶段中检查。

## CFG构建

通过将指令集拆解为一组基本块，构造一个控制流程图。每个基本块包含一系列连续的指令; 所有指令集都存在于块中。每个块以分支或返回指令结束。块的分解可确保分支只在某个块的开头处。 分解还试图确保生成的块是最大的。 但是，分析的可靠性不依赖于最大化。

## 堆栈安全

块的执行发生在局部变量数组和堆栈中。函数的参数是局部变量数组的前缀。跨函数调用传递参数和返回值都是通过堆栈完成的。当函数开始执行时，其参数已经加载到其参数中。假设函数开始执行时堆栈高度为*n*;那么有效的字节码必须强制不执行，也就是执行开始，基本块的堆栈高度为*n*。此外，在返回指令处，堆栈高度必须是*n* + *k*，其中*k*，s.t。 *k*> = 0是返回值的数量。第一阶段通过分别分析每个块来检查是否保持了这个高度不变，计算块中每个指令对堆栈高度的影响，检查高度是否低于*n*，并且保留在*n*或*n* + *k*（取决于块的最终指令和函数的返回类型）

## 类型安全

分析第二阶段检查是否使用原始函数或已定义函数的参数来调用每个操作。 操作的操作数是位于局部变量或堆栈中的值。 字节码中已经提供了函数的局部变量类型。 但是，需要堆栈值的类型。 可以针对每个块单独地进行该推断和每个操作的类型检查。 由于每个块开始时的堆栈高度为*n*并且在执行块期间不会低于*n*，因此我们只需要对从*n*开始的堆栈的后缀进行检查，以便对块指令进行类型检查。 我们使用一堆类型对此后缀进行检查，在处理块中的指令流时，在这些类型上推送和返回类型。 堆栈类型和静态已知类型的局部变量键入来检查每条指令。

## 资源安全

资源代表区块链上的资产。 因此，对这些类型存在某些限制，这些限制不适用于正常值。 直观地说，资源值无法复制，必须在交易结束时使用（这意味着到达全局存储或销毁）。 具体而言，有以下限制：

* `CopyLoc` 和 `StLoc` 要求本地类型不是资源类型。
* `WriteRef`, `Eq`, 和 `Neq` 要求引用的类型不属于资源类型。
* 在函数结束时 (达到 `Ret`), 任何类型为资源类型的局部变量都不能为空，即该值必须已从本地移出。

如上所述，围绕 `Ret` 的最后一条规则意味着资源**必须**是：

* 通过 `MoveToSender` 移动到全局存储。
* 通过 `Unpack` 销毁。

`MoveToSender` 和 `Unpack` 都位于资源模块内部。

## 安全参考

引用在字节码语言中是一等的。函数可以通过以下几种方式获得新的引用:

* 输入参数。
* 获取局部变量中地址值。
* 获取全局发布地址值。
* 从对包含结构的引用中获取地址的字段。
* 函数返回值。

引用安全性检查的目的是确保没有空引用。下面是空引用的一些例子:

* 局部变量 `y` 包含对局部变量 `x` 中的值的引用; 然后移动 `x` 。
* 局部变量 `y` 包含对局部变量 `x` 中的值的引用; 然后将 `x` 绑定到一个新值。
* 引用尚未初始化的局部变量。
* 从函数返回中对局部变量中的值引用。
* 引用 `r` 指向全局发布的值 `v`;  `v` 则未发布。

引用可以是独占的，也可以是共享的; 后者只允许读访问。 参考安全检查的第二个目标就是确保在字节码程序执行中 - 包括整个堆栈和所有功能框架 - 如果有两个不同的存储位置包含了引用`r1`和`r2`，那么`r2 `扩展`r1`，然后满足以下两个条件：

* 如果 `r1` 被标记为独占，则它必须是不活动的，即 `r1` 不能被解除引用或变更位置。
* 如果 `r1` 是共享的, 那么 `r2` 也是共享的。

上述两个条件确立了引用透明的特性，这对于可扩展程序验证很重要，其大致如下：考虑一段代码`v1 = * r; S; v2 = * r`，其中`S`是一个任意计算，它不通过语法引用 `r` 执行任何写操作（并且没有写任何扩展 `r` 的 `r'` ）。 然后 `v1 == v2` 。

**设置分析.** 参考安全性分析设置为流分析（或者对那些熟悉概念的人进行抽象解释）。 抽象状态是为抽象地执行基本块的代码而定义的。 从基本块到抽象状态映射维护。 给定基本块 *B* 开头的抽象状态为 *S*，*B* 的抽象执行导致状态 *S’*。 该状态 *S'* 传播到 *B* 的所有后续并记录在映射中。 如果某个状态已经存在，则新广播的状态将与现有状态“连接”。 连接可能会失败，在这种情况下会报告错误。 如果连接成功但抽象状态保持不变，则不再进行广播。 否则，状态将更新并再次通过块传播。 在抽象状态通过块传播期间处理指令时，也可能报告错误。 这种传播终止是因为 ...

**抽象状态.** 抽象状态有三个组成部分：

* 从本地到抽象值的部分映射。不在此映射范围内的本地不可用。可用性是初始化概念的概括。由于被移动，局部变量在初始化之后可能变得不可用。抽象值是 *Reference*(*n*)（对于引用类型的变量）或 *Value*(*ns*)（对于值类型的变量），其中*n*是nonce， *ns*是一组nonces。nonce是一个常量，用于表示引用。设 *Nonce* 表示所有nonce的集合。如果局部变量 *l* 映射到 *Value*(*ns*)，则意味着有未完成的引用指向存储在 *l* 中的值。对于 *ns* 中的每个成员 *n*，必须有一个局部变量 *l* 映射到 *Reference*(*n*)。如果局部变量 *x* 映射到 *Reference*(*n*)并且局部变量 *y* 和 *z* 分别映射到 *Value*(*ns1*)和 *Value*(*ns2*) ，那么 *n* 可能是 *ns1* 和 *ns2* 的成员。这仅仅意味着分析是有损的。 *l* 映射到 *Value*（{}）时的特殊情况意味着没有对 *l* 的引用，因此 *l* 可能被销毁或移动。
* 从本地到抽象值的部分映射，本身不检查字节码程序，因为字节码操做的值可以是大型嵌套结构，引用指向中间。 可以扩展指向值中间的引用以获取另一个引用。 允许一些扩展，但其他扩展不支持。 为了跟踪引用之间的扩展，我们有一个抽象状态的第二个组件。 此组件是从nonce到两种借用信息之一的映射：一组nonce或从字段到nonces组的映射。 当前实现将此信息存储为具有不相交的两个单独的映射：
  1. *borrowed_by* 从 *Nonce* 映射到 *Set* <*Nonce*>。
  2. *fields_borrowed_by* 从 *Nonce* 映射到 *Map* <*Field*，*Set* <*Nonce* >>。
      * 如果 *n2* 在 *borrowed_by* [*n1*]，则表示由 *n2* 表示的引用是由 *n1* 表示的引用的扩展名。
      * 如果 *fields_borrowed_by* [*n1*][*f*] 中的 *n2*，则由 *n2* 表示的引用是由 *n1* 表示的引用的 *f*  - 扩展后的扩展。 基于这种方式，将一个 nonce *n* 从 *fields_borrowed_by* 的域移动到 *borrowed_by* 的域是一个合理的扩展，通过采用对应于 *fields_borrowed_by* 域中所有字段的所有nonce集的并集[*N*]。
* 要在块的指令之间传播抽象状态，还必须对堆栈上的值和引用进行创建。 我们之前已经描述了如何将可用堆栈后缀创建为一堆类型。 我们现在将此堆栈的内容扩充为包含类型和抽象值的结构。 我们维护不变量，即堆栈上的非引用值不能对它们进行挂起。 因此，如果堆栈上有一个抽象值 *Value*(*ns*)，则 *ns* 为空。

**值和引用.** 让我们仔细看看共享和独占的值和引用是如何建模的。

* 非参考值被建模为 *Value*(*ns*)，其中*ns*是表示借用引用的一组nonce。 仅当*ns*为空时，才会认为此值的销毁/移动/复制是安全的。 堆栈上的值通常满足此属性，但局部变量中的值可能不满足。
* 引用被建模为*Reference*(*n*)，其中 *n* 是随机数。 如果引用被标记为共享，则始终允许读访问，并且永远不允许写访问。 如果引用 *Reference*(*n*)  被标记为独占，则仅当 *n* 没有借用时才允许写访问，如果从 *n* 借用的所有随机数驻留在被标记的引用中，则允许读访问和共享。 此外，构造引用的规则保证了引用标记共享的扩展也必须被标记为共享。 这些检查共同提供了前面提到的参考透明性。

At the moment, the bytecode language does not contain any direct constructors for shared references. `BorrowLoc` and `BorrowGlobal` create exclusive references.  `BorrowField` creates a reference that inherits its tag from the source reference.  Move (when applied to a local containing a reference) moves the reference from a local variable to the stack.  `FreezeRef` is used to convert an existing exclusive reference to a shared reference. In the future, we may add a version of `BorrowGlobal` that generates a shared reference

**Errors.** As mentioned before, an error is reported by the checker in one of the following situations:

* An instruction cannot be proved safe during propagating of abstract state through a block.
* Join of abstract states propagated via different incoming edges into a block fails.

Let us take a closer look at the second reason for error reporting above.  Note that the stack of type and abstract value pairs representing the usable stack suffix is empty at the beginning of a block.  So, the join occurs only over the abstract state representing the available local variables and the borrow information.  The join fails only in the situation when the set of available local variables is different on the two edges.  If the set of available variables is identical, the join itself is straightforward---the borrow sets are unioned point-wise.   There are two subtleties worth mentioning though:

* The set of nonces used in the abstract states along the two edges may not have any connection with each other.  Since the actual nonce values are immaterial, the nonces are canonically mapped to fixed integers (indices of local variables containing the nonces) before performing the join.
* During the join, if a nonce *n* is in the domain of borrowed_by on one side and in the domain of fields_borrowed_by on the other side, *n* is moved from fields_borrowed_by to borrowed_by before doing the join.

**Borrowing References.** Each of the reference constructors ---`BorrowLoc`, `BorrowField`, `BorrowGlobal`, `FreezeRef`, and `CopyLoc`--- is modeled via the generation of a fresh nonce.  While `BorrowLoc` borrows from a value in a local variable, `BorrowGlobal` borrows from the global pool of values.  `BorrowField`, `FreezeRef`, and `CopyLoc` (when applied to a local containing a reference) borrow from the source reference.  Since each fresh nonce is distinct from all previously-generated nonces, the analysis maintains the invariant that all available local variables and stack locations of reference type have distinct nonces representing their abstract value.  Another important invariant is that every nonce referred to in the borrow information must reside in some abstract value representing a local variable or a stack location.

**Releasing References.** References, both global and local, are released by the `ReleaseRef` operation.  References must be explicitly released.  It is an error to return from a function with unreleased references in a local variable of the function.  All references must be explicitly released.  Therefore, it is an error to overwrite an available reference using the `StLoc` operation.

References are implicitly released when consumed by the operations `ReadRef`, `WriteRef`, `Eq`, `Neq`, and `EmitEvent`.

**Global References.** The safety of global references depends on a combination of static and dynamic analysis.  The static analysis does not distinguish between global and local references.  But the dynamic analysis distinguishes between them and performs reference counting on the global references as follows: the bytecode interpreter maintains a map `M` from a pair of Address and fully-qualified resource type to a union (Rust enum) comprising the following values:

* `Empty`
* `RefCount(n)` for some `n` >= 0

Extra state updates and checks are performed by the interpreter for the following operations.  In the code below, assert failure indicates programmer error, and panic failure indicates internal error in interpreter.

```text
MoveFrom<T>(addr) {
    assert M[addr, T] == RefCount(0);
    M[addr, T] := Empty;
}

MoveToSender<T>(addr) {
    assert M[addr, T] == Empty;
    M[addr, T] := RefCount(0);
}

BorrowGlobal<T>(addr) {
    if let RefCount(n) = M[addr, T] then {
        assert n == 0;
        M[addr, T] := RefCount(n+1);
    } else {
        assert false;
    }
}

CopyLoc(ref) {
    if let Global(addr, T) = ref {
        if let RefCount(n) = M[addr, T] then {
            assert n > 0;
            M[addr, T] := RefCount(n+1);
        } else {
            panic false;
        }
    }
}

ReleaseRef(ref) {
    if let Global(addr, T) = ref {
        if let RefCount(n) = M[addr, T] then {
            assert n > 0;
            M[addr, T] := RefCount(n-1);
        } else {
            panic false;
        }
    }
}
```

A subtle point not explicated by the rules above is that `BorrowField` and `FreezeRef`, when applied to a global reference, leave the reference count unchanged.  The reason is because these instructions consume the reference at the top of the stack while producing an extension of it at the top of the stack.  Similarly, since `ReadRef`, `WriteRef`, `Eq`, `Neq`, and `EmitEvent` consume the reference at the top of the stack, they will reduce the reference count by 1.

## How is this module organized?

```text
*
├── invalid_mutations  # Library used by proptests
├── src                # Core bytecode verifier files
├── tests              # Proptests
```
