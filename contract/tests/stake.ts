import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { assert } from 'chai';
import { GoalTracker } from '../target/types/goal_tracker';
import { BN } from 'bn.js';

describe('goal_tracker', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.GoalTracker as Program<GoalTracker>;

  // We'll use the provider's wallet for our tests.
  const user = provider.wallet;

  // Helper: derive the PDA for the Task account using the seed 'task' and the user's public key.
  async function deriveTaskPDA(): Promise<[anchor.web3.PublicKey, number]> {
    return anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from('task'), user.publicKey.toBuffer()],
      program.programId
    );
  }

  // Clean up any existing task account before each test
  beforeEach(async () => {
    const [taskPDA] = await deriveTaskPDA();
    try {
      // Try to fetch the task account
      const taskAccount = await program.account.task.fetch(taskPDA);
      if (taskAccount) {
        // If it exists, try to complete and close it
        try {
          await program.methods
            .completeTask()
            .accounts({
              task: taskPDA,
              user: user.publicKey,
              systemProgram: anchor.web3.SystemProgram.programId,
            })
            .rpc();
        } catch (err) {
          // Ignore any errors during cleanup
          console.log('Cleanup error (expected):', err.message);
        }
      }
    } catch (err) {
      // Account doesn't exist, which is fine
    }
  });

  it('should stake SOL and create a task', async () => {
    // Set the deadline to 1 hour from now.
    const currentTime = Math.floor(Date.now() / 1000);
    const deadline = new BN(currentTime + 3600);
    
    // Stake amount: 1 SOL (in lamports).
    const stakeAmount = new BN(1_000_000_000); // 1 SOL

    // Derive the PDA for the Task account.
    const [taskPDA] = await deriveTaskPDA();

    // Call the stake_task instruction.
    await program.methods
      .stakeTask(deadline, stakeAmount)
      .accounts({
        task: taskPDA,
        user: user.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    // Fetch the created Task account.
    const taskAccount = await program.account.task.fetch(taskPDA);

    // Verify the account state.
    assert.ok(taskAccount.user.equals(user.publicKey), 'User mismatch');
    assert.equal(taskAccount.deadline.toString(), deadline.toString(), 'Deadline mismatch');
    assert.equal(taskAccount.completed, false, 'Task should not be completed yet');
    assert.equal(taskAccount.stakedAmount.toString(), stakeAmount.toString(), 'Staked amount mismatch');
  });

  it('should complete the task before the deadline and close the task account', async () => {
    // Create a new task for testing completion.
    const currentTime = Math.floor(Date.now() / 1000);
    const deadline = new BN(currentTime + 3600);
    const stakeAmount = new BN(1_000_000_000); // 1 SOL

    // Derive the PDA for the Task account.
    const [taskPDA] = await deriveTaskPDA();

    // Stake the task (create the Task account).
    await program.methods
      .stakeTask(deadline, stakeAmount)
      .accounts({
        task: taskPDA,
        user: user.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    // Complete the task
    await program.methods
      .completeTask()
      .accounts({
        task: taskPDA,
        user: user.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    // After completion, attempting to fetch the account should fail because it has been closed.
    try {
      await program.account.task.fetch(taskPDA);
      assert.fail('Task account should be closed');
    } catch (err) {
      // Expected error; account does not exist.
      assert.ok(err, 'Expected account to be closed');
    }
  });
});
