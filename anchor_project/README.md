# TODO

----> TESTS FILE DUE TO TIME REQUIREMENT BIG NUMBERS FAILING CHECKING AGAINST
SLOTS. TRY to use if statements instead.

----> Create a key pair and test if signer different than the poll owner can
initialize a candidate

----> To make sure a voter doesnt vote more than once, add a voters: Vec<Pubkey>
to the Poll account you are going to need a max_len (maximum of pubkeys) this
maximum of pubkeys will be the maxiun of voters too You will need to thinkg on
an alternative

----> Token gate the voters

//

//**\*\***\*\***\*\***\*\*\*\***\*\***\*\***\*\***
**\*\*\*\***\*\*\*\***\*\*\*\***\*\*\***\*\*\*\***\*\*\*\***\*\*\*\***//

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
