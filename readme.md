# [Parity](https://ethcore.io/parity.html) e-mail verification

[![Join the chat at https://gitter.im/ethcore/parity][gitter-image]][gitter-url] [![GPLv3][license-image]][license-url]

[gitter-image]: https://badges.gitter.im/Join%20Chat.svg
[gitter-url]: https://gitter.im/ethcore/parity
[license-image]: https://img.shields.io/badge/license-GPL%20v3-green.svg
[license-url]: https://www.gnu.org/licenses/gpl-3.0.en.html

The following process **ties an account to an email address**:

```
           confirm(token)
         +-------------------> +--------+
         |                     |contract|   puzzle(address, sha(token), sha(email))
         |       +-----------> +--------+ <-----------+
         |       |                                    |
         |       | request(sha(email))                |
         |       |                                    |
         |       |                                    |
         |   +------+  POST /?email=…&address=…   +------+
         +-+ |client| +-------------------------> |server| code=rand()
             +------+                             +------+ token=sha(code)
token=sha(code)  ^           e-mail with code         |
                 +------------------------------------+
```

1. client requests verification (`request(sha(email))`)
2. client calls verification server (`POST /?email=…&address=…`)
3. server generates `code` and computes `token`
4. server posts challenge (`puzzle(address, sha(token), sha(email))`)
5. server sends e-mail to client (with `code`)
6. client computes `token`
7. client posts response (`confirm(token)`)

Now, anyone can easily **check if an account is verified by calling `certified(address)`** on the contract.

## Installation

```shell
git clone https://github.com/ethcore/email-verification.git
cd email-verification
npm install --production
```

## Usage

**The account calling `puzzle` has to be the `owner` of the contract.**

1. Set up an account and put its password in a file.
2. Run Parity with `--jsonrpc-apis eth,personal,parity`, `--unlock <account-address> --password <account-password-file>`.
3. Create a config file `config/<env>.json`, which partially overrides `config/default.json`.
4. `export NODE_ENV=<env>; node index.js`

---

To run on both testnet and mainnet, just create two config files. Make sure to use

- separate Parity processes listening on different ports (`parity.host`)
- separate `db` files
- separate ports to listen on (`http.port`)

I usually run a testnet & a mainnet Parity in parallel like this:

```shell
screen -S parity-testnet -t parity-testnet -- ./parity/target/release/parity --chain testnet --port 40303 --jsonrpc-apis eth,personal,parity --no-ui --no-dapps --jsonrpc-port 18545 --unlock … --password …
screen -S parity-mainnet -t parity-mainnet -- ./parity/target/release/parity --chain mainnet --port 30303 --jsonrpc-apis eth,personal,parity --no-ui --no-dapps --jsonrpc-port 8545 --unlock … --password …
```

