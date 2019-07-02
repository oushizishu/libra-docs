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

Resources represent assets of the blockchain. As such, there are certain restrictions over these types that do not apply to normal values. Intuitively, resource values cannot be copied and must be used by the end of the transaction (this means moved to global storage or destroyed). Concretely, the following restrictions apply:

* `CopyLoc` and `StLoc` require the type of local is not of resource kind.
* `WriteRef`, `Eq`, and `Neq` require the type of the reference is not of resource kind.
* At the end of a function (when `Ret` is reached), no any local whose type is of resource kind must be empty, i.e., the value must have been moved out of the local.

As mentioned above, this last rule around `Ret` implies that the resource *must* have been either:

* Moved to global storage via `MoveToSender`.
* Destroyed via `Unpack`.

Both of `MoveToSender` and `Unpack` are internal to the module in which the resource is declared.

## Reference Safety

References are first-class in the bytecode language.  Fresh references become available to a function in several ways:

* Input parameters.
* Taking address of the value in a local variable.
* Taking address of the globally published value in an address.
* Taking address of a field from a reference to the containing struct.
* Return value from a function.

The goal of reference safety checking is to ensure that there are no dangling references.  Here are some examples of dangling references:

* Local variable `y` contains a reference to the value in a local variable `x`; `x` is then moved.
* Local variable `y` contains a reference to the value in a local variable `x`; `x` is then bound to a new value.
* Reference is taken to a local variable that has not been initialized.
* Reference to a value in a local variable is returned from a function.
* Reference `r` is taken to a globally published value `v`; `v` is then unpublished.

References can be either exclusive or shared; the latter allow only read access.  A secondary goal of reference safety checking is to ensure that in the execution context of the bytecode program  — including the entire evaluation stack and all function frames — if there are two distinct storage locations containing references `r1` and `r2` such that `r2` extends `r1`, then both of the following conditions hold:

* If `r1` is tagged exclusive, then it must be inactive, i.e. it is impossible to reach a control location where `r1` is dereferenced or mutated.
* If `r1` is shared, then `r2` is shared.

The two conditions above establish the property of referential transparency, important for scalable program verification, which looks roughly as follows: consider the piece of code `v1 = *r; S; v2 = *r`, where `S` is an arbitrary computation that does not perform any write through the syntactic reference `r` (and no writes to any `r'` that extends `r`).  Then `v1 == v2`.

**Analysis Setup.** The reference safety analysis is set up as a flow analysis (or abstract interpretation for those that are familiar with the concept).  An abstract state is defined for abstractly executing the code of a basic block.  A map is maintained from basic blocks to abstract states.  Given an abstract state *S* at the beginning of a basic block *B*, the abstract execution of *B* results in state *S'*.  This state *S'* is propagated to all successors of *B* and recorded in the map.  If a state already existed for a block, the freshly propagated state is “joined” with the existing state.  The join might fail in which case an error is reported.  If the join succeeds but the abstract state remains unchanged, no further propagation is done.  Otherwise, the state is updated and propagated again through the block.  An error may also be reported when an instruction is processed during propagation of abstract state through a block.  This propagation terminates because ...

**Abstract State.** The abstract state has three components:

* A partial map from locals to abstract values.  Locals not in the domain of this map are unavailable.  Availability is a generalization of the concept of being initialized.  A local variable may become unavailable subsequent to initialization as a result of being moved.  An abstract value is either *Reference*(*n*) (for variables of reference type) or *Value*(*ns*) (for variables of value type), where *n* is a nonce and *ns* is a set of nonces.  A nonce is a constant used to represent a reference.  Let *Nonce* represent the set of all nonces.  If a local variable *l* is mapped to *Value*(*ns*), it means that there are outstanding borrowed references pointing into the value stored in *l*.  For each member *n* of *ns*, there must be a local variable *l* mapped to *Reference*(*n*).  If a local variable *x* is mapped to *Reference*(*n*) and there are local variables *y* and *z* mapped to *Value*(*ns1*) and *Value*(*ns2*) respectively, then it is possible that *n* is a member of both *ns1* and *ns2*.  This simply means that the analysis is lossy.  The special case when *l* is mapped to *Value*({}) means that there are no borrowed references to *l*, and, therefore, *l* may be destroyed or moved.
* The partial map from locals to abstract values is not enough by itself to check bytecode programs because values manipulated by the bytecode can be large nested structures with references pointing into the middle.  A reference pointing into the middle of a value could be extended to get another reference.  Some extensions should be allowed but others should not.  To keep track of relative extensions among references, we have a second component to the abstract state.  This component is a map from nonces to one of two kinds of borrow information: either a set of nonces or a map from fields to sets of nonces.  The current implementation stores this information as two separate maps with disjoint domains:
  1. *borrowed_by* maps from *Nonce* to *Set*<*Nonce*>.
  2. *fields_borrowed_by* maps from *Nonce* to *Map*<*Field*, *Set*<*Nonce*>>.
      * If *n2* in *borrowed_by*[*n1*], then it means that the reference represented by *n2* is an extension of the reference represented by *n1*.
      * If *n2* in *fields_borrowed_by*[*n1*][*f*], it means that the reference represented by *n2* is an extension of the *f*-extension of the reference represented by *n1*.  Based on this intuition, it is a sound overapproximation to move a nonce *n* from the domain of *fields_borrowed_by* to the domain of *borrowed_by* by taking the union of all nonce sets corresponding to all fields in the domain of *fields_borrowed_by*[*n*].
* To propagate an abstract state across the instructions in a block, the values and references on the stack must also be modeled.  We had earlier described how we model the usable stack suffix as a stack of types.  We now augment the contents of this stack to be a structure containing a type and an abstract value.  We maintain the invariant that non-reference values on the stack cannot have pending borrows on them.  Therefore, if there is an abstract value *Value*(*ns*) on the stack, then *ns* is empty.

**Values and References.** Let us take a closer look at how values and references, shared and exclusive, are modeled.

* A non-reference value is modeled as *Value*(*ns*) where *ns* is a set of nonces representing borrowed references.  Destruction/move/copy of this value is deemed safe only if *ns* is empty.  Values on the stack trivially satisfy this property, but values in local variables may not.
* A reference is modeled as *Reference*(*n*), where *n* is a nonce.  If the reference is tagged shared, then read accesses are always allowed and write accesses are never allowed.  If a reference *Reference*(*n*) is tagged exclusive, write access is allowed only if *n* does not have a borrow, and read access is allowed if all nonces that borrow from *n* reside in references that are tagged as shared.  Furthermore, the rules for constructing references guarantee that an extension of a reference tagged shared must also be tagged shared.  Together, these checks provide the property of referential transparency mentioned earlier.

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
