import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { assert } from 'chai';
import { GoalTracker } from '../target/types/goal_tracker';
import { BN } from 'bn.js';

describe('goal_tracker', () => {
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

  it('should stake SOL and create a task', async () => {
    const taskId = Math.floor(Math.random() * 1000);
    const [taskPDA] = await deriveTaskPDA(taskId);
    const currentTime = Math.floor(Date.now() / 1000);
    const deadline = new BN(currentTime + 3600);
    const stakeAmount = new BN(1_000_000_000); // 1 SOL

    await program.methods
      .stakeTask(new BN(taskId), deadline, stakeAmount)
      .accounts({
        task: taskPDA,
        user: user.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    const taskAccount = await program.account.task.fetch(taskPDA);
    assert.ok(taskAccount.user.equals(user.publicKey), 'User mismatch');
    assert.equal(taskAccount.deadline.toString(), deadline.toString(), 'Deadline mismatch');
    assert.equal(taskAccount.completed, false, 'Task should not be completed yet');
    assert.equal(taskAccount.stakedAmount.toString(), stakeAmount.toString(), 'Staked amount mismatch');
  });

  it('should complete the task before the deadline and close the task account', async () => {
    const taskId = Math.floor(Math.random() * 1000);
    const [taskPDA] = await deriveTaskPDA(taskId);
    const currentTime = Math.floor(Date.now() / 1000);
    const deadline = new BN(currentTime + 3600);
    const stakeAmount = new BN(1_000_000_000); // 1 SOL

    await program.methods
      .stakeTask(new BN(taskId), deadline, stakeAmount)
      .accounts({
        task: taskPDA,
        user: user.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    await program.methods
      .completeTask()
      .accounts({
        task: taskPDA,
        user: user.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    try {
      await program.account.task.fetch(taskPDA);
      assert.fail('Task account should be closed');
    } catch (err) {
      assert.ok(err, 'Expected account to be closed');
    }
  });
});
