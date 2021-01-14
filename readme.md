E-mail verification
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
## Usage

**The account calling `puzzle` has to be the `owner` of the contract.**

1. Set up an account and put its password in a file.
2. Run Parity with `--jsonrpc-apis net,eth,personal,parity`.
3. Create a config file `config/<env>.json`, which partially overrides `config/default.json`.
4. `env NODE_ENV=<env> node index.js`

Deploy to production using process managers like [forever](https://github.com/foreverjs/forever#readme).

---
