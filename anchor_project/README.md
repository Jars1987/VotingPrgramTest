# TODO

----> Time stamps and poll times are other way around

----> Create a key pair and test if signer different than the poll owner can
initialize a candidate

----> To make sure a voter doesnt vote more than once,create a Vote PDA account
with seeds of poll.key, candidate.key and signer key. This way when you try to
vote again you can't because it can't initialize the account again.

----> Token gate the voters

//

//**\*\***\*\***\*\***\*\*\*\***\*\***\*\***\*\***
**\*\*\*\***\*\*\*\***\*\*\*\***\*\*\***\*\*\*\***\*\*\*\***\*\*\*\***//
instalation: run cargo build run anchor build run npm i

To test the Program Localy initiale a local validator by running the command:

```solana-test-validator -r

```

You will need to kill and re-run the validator everytime you want to re-run the
tests or it will fail with error that some accounts already exist (already
innitialez).

To test the program, after the local validator is running, run the following
command:

```ancho-test --skip-local-validator

```
