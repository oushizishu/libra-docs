---
id: admission-control
title: Admission Control
custom_edit_url: https://github.com/libra/libra/edit/master/admission_control/README.md
---

准入控制（AC）是Libra的公共API接口，它用于接收来自客户端的公共gRPC请求。

## 概述
准入控制（AC）处理于来自客户的两种类型的请求:
1. 提交交易  - 向关联的验证器提交交易。
2. 更新最新分布式账本 - 查询存储，例如帐户状态，交易日志，验证等。

## 实施细节
准入控制（AC）实现两个公共API：
1. 提交交易（提交交易请求）
    * 将对请求执行多次验证：
       * 首先检查交易签名。 如果此检查失败，AdmissionControlStatus :: Rejected将返回给客户端。
       * 然后由vm_validator验证交易。 如果失败，则将相应的VMStatus返回给客户端。
    * 一旦交易通过所有验证，AC将从存储中查询发送人的帐户余额和最新序列号，并将其与客户端请求一起发送到内存池。
    * 如果内存池返回 MempoolAddTransactionStatus :: Valid，则会将AdmissionControlStatus :: Accepted 返回给客户端，表示提交成功。 否则，将相应的AdmissionControlStatus返回给客户端。
2. 更新最新分布式账本(更新最新分布式账本请求). 在准入控制AC中不执行额外的处理。
* 请求将直接传递到存储进行查询。

## 文件夹结构
```
    .
    ├── README.md
    ├── admission_control_proto
    │   └── src
    │       └── proto                           # Protobuf definition files
    └── admission_control_service
        └── src                                 # gRPC service source files
            ├── admission_control_node.rs       # Wrapper to run AC in a separate thread
            ├── admission_control_service.rs    # gRPC service and main logic
            ├── main.rs                         # Main entry to run AC as a binary
            └── unit_tests                      # Tests
```

## 该模块与以下内容交互：
内存池组件，用于接收从客户端提交交易。
存储组件，用于查询验证器存储。
