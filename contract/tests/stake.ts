import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { assert } from 'chai';
import { GoalTracker } from '../target/types/goal_tracker';
import { BN } from 'bn.js';

describe('goal_tracker', () => {
  // Initialize the Anchor provider to connect with the local Solana cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.GoalTracker as Program<GoalTracker>;
  const user = provider.wallet;
  
  async function deriveTaskPDA(taskId: number): Promise<[anchor.web3.PublicKey, number]> {
    return anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('task'), user.publicKey.toBuffer(), new BN(taskId).toArrayLike(Buffer, 'le', 8)],
      program.programId
    );
  }
/**
   * Test Case 1: Staking SOL and creating a task
   
   */
  
  it('should stake SOL and create a task', async () => {
    const taskId = Math.floor(Math.random() * 1000); // Generate a random task ID for uniqueness
    const [taskPDA] = await deriveTaskPDA(taskId); // Derive the PDA for this task
    const currentTime = Math.floor(Date.now() / 1000); 
    const deadline = new BN(currentTime + 3600); 
    const stakeAmount = new BN(1_000_000_000); 

    // Call the smart contract method `stakeTask` to create the task.
    await program.methods
      .stakeTask(new BN(taskId), deadline, stakeAmount)
      .accounts({
        task: taskPDA, 
        user: user.publicKey, 
        systemProgram: anchor.web3.SystemProgram.programId, 
      })
      .rpc(); 

    // Fetch the created Task account to verify its state
    const taskAccount = await program.account.task.fetch(taskPDA);

    
    assert.ok(taskAccount.user.equals(user.publicKey), 'User mismatch');
    assert.equal(taskAccount.deadline.toString(), deadline.toString(), 'Deadline mismatch');
    assert.equal(taskAccount.completed, false, 'Task should not be completed yet');
    assert.equal(taskAccount.stakedAmount.toString(), stakeAmount.toString(), 'Staked amount mismatch');
  });

  /**
   * Test Case 2: Completing the task before the deadline
   */
  it('should complete the task before the deadline and close the task account', async () => {
    const taskId = Math.floor(Math.random() * 1000); // Generate a random task ID
    const [taskPDA] = await deriveTaskPDA(taskId); // Derive the PDA for this task
    const currentTime = Math.floor(Date.now() / 1000);
    const deadline = new BN(currentTime + 3600); // Deadline: 1 hour from now
    const stakeAmount = new BN(1_000_000_000); // 1 SOL

    // Step 1: Stake the task (create the Task account).
    await program.methods
      .stakeTask(new BN(taskId), deadline, stakeAmount)
      .accounts({
        task: taskPDA,
        user: user.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    // Step 2: Call the `completeTask` method to complete the task.
    await program.methods
      .completeTask()
      .accounts({
        task: taskPDA, 
        user: user.publicKey, 
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    // Step 3: Verify that the task account is closed after completion.
    try {
      await program.account.task.fetch(taskPDA);
      assert.fail('Task account should be closed'); 
    } catch (err) {
      assert.ok(err, 'Expected account to be closed'); 
    }
  });
});
