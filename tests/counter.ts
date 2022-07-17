import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Counter } from "../target/types/counter";
import * as assert from 'assert'

describe("counter", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider);
  const program = anchor.workspace.Counter as Program<Counter>;

  const COUNTER_ID = Math.floor(Math.random() * 1000000);
  
  it("Is initialized!", async () => {
    // Add your test here.
    let [counterAddress, counterBump] = await anchor.web3.PublicKey.findProgramAddress(
      [provider.wallet.publicKey.toBuffer(), Buffer.from(COUNTER_ID.toString())],
      program.programId
    );
    const tx = await program.methods.initializeCounter(new anchor.BN(COUNTER_ID))
    .accounts({
      creator: provider.wallet.publicKey,
      counter: counterAddress,
      systemProgram: anchor.web3.SystemProgram.programId,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
    })
    .rpc();
    console.log("Your transaction signature", tx);
  });
  it("Is counter increment succesful?", async () => {
    let [counterAddress, counterBump] = await anchor.web3.PublicKey.findProgramAddress(
      [provider.wallet.publicKey.toBuffer(), Buffer.from(COUNTER_ID.toString())],
      program.programId
    );
    let preCounter = await program.account.counter.fetch(counterAddress)
    assert.ok(preCounter.count.toNumber() == 0)
    const tx = await program.methods.incrementCounter()
    .accounts({
      creator: provider.wallet.publicKey,
      counter: counterAddress,
      systemProgram: anchor.web3.SystemProgram.programId,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
    })
    .rpc();
    let postCounter = await program.account.counter.fetch(counterAddress)
    assert.ok(postCounter.count.toNumber() == 1)
  });
});
