---
id: crypto
title: Crypto
custom_edit_url: https://github.com/libra/libra/edit/master/crypto/legacy_crypto/README.md
---

加密组件承载我们在Libra中使用的关于加密所有实现：散列，签名和密钥派生/生成。 NextGen目录包含将在即将到来的版本中使用的关于加密的实现：新的加密API实施类型安全，可验证的随机函数，BLS签名。

## 概要

Libra 使用几种密码算法:

* SHA-3 作为主要的哈希函数。它在 [FIPS 202](https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.202.pdf) 标准化. 它基于 [tiny_keccak](https://docs.rs/tiny-keccak/1.4.2/tiny_keccak/) 库。
* X25519 执行密钥交换。 它通过使用 [Noise Protocol Framework](http://www.noiseprotocol.org/noise.html). 保护验证器之间的通信。 它基于x25519-dalek库。
* Ed25519 执行签名。 它既用于共识签名，也用于交易签名。 计划将EdDSA添加到 [NIST SP 800-133 Rev. 1](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-133r1-draft.pdf) 中提到的FIPS 186的下一版本中。 它基于 [ed25519-dalek](https://docs.rs/ed25519-dalek/1.0.0-pre.1/ed25519_dalek/) 库以及其他安全检查（例如，为了扩展性）。
* HKDF: 基于HMAC的Extract-and-Expand密钥衍生函数（HKDF），基于 [RFC 5869](https://tools.ietf.org/html/rfc5869).  它用于从salt（可选），种子和application-info（可选）生成密钥。

## 这个模块是怎样的？
```
    legacy_crypto/src
    ├── signing.rs          # Ed25519 signature scheme
    ├── hash.rs             # Hash function (SHA-3)
    ├── hkdf.rs             # HKDF implementation (HMAC-based Extract-and-Expand Key Derivation Function based on RFC 5869)
    ├── x25519.rs           # X25519 keys generation
    ├── macros/             # Derivations for SilentDebug and SilentDisplay
    ├── utils.rs            # Serialization utility functions
    ├── unit_tests          # Tests
    └── lib.rs
```

目前 `x25519.rs` 只用于公开管理密钥的逻辑。 Noise Protocol Framework 相关加密原语属于 [snow](https://docs.rs/snow/0.5.2/snow/) 之下。
