use anchor_lang::prelude::*;

declare_id!("Cu1Ty3HxTkKsrsLZfCy46BXtGUke7gjyYX6FhrQEWUr9");

#[program]
pub mod goal_tracker {
    use super::*;

    // The user stakes SOL along with providing a task deadline.
    // The staked funds are held in the 'task' account (an escrow account).
    pub fn stake_task(ctx: Context<StakeTask>, task_id: u64, deadline: i64, stake_amount: u64) -> Result<()> {
        // Set up the task account's state.
        let task = &mut ctx.accounts.task;
        task.user = ctx.accounts.user.key();    // Record the owner
        task.task_id = task_id;                    // Record the unique task id
        task.deadline = deadline;                  // Set the task's deadline (unix timestamp)
        task.completed = false;                    // Initially, the task is not complete
        task.staked_amount = stake_amount;         // Record how much SOL was staked

        // The actual transfer of SOL occurs when the task account is created.
        // The client must send enough lamports during account creation (init)
        // so that the task account holds the staked SOL as escrow.
        Ok(())
    }

    // The user triggers task completion.
    // If the current time is before the deadline, the escrow (task) account will be closed,
    // and the remaining funds (staked SOL) are transferred back to the user's wallet.
    pub fn complete_task(ctx: Context<CompleteTask>) -> Result<()> {
        let clock = Clock::get()?;
        let task = &mut ctx.accounts.task;

        // Ensure the task is being completed before the deadline.
        require!(
            clock.unix_timestamp <= task.deadline,
            CustomError::DeadlinePassed
        );

        // Mark the task as completed.
        task.completed = true;
        // With the 'close = user' attribute, the task account will be closed
        // and any remaining lamports will be transferred back to the user's wallet.
        Ok(())
    }
}

// Context for staking the task.
// The task account is created as a PDA with a seed based on the user’s public key and a unique task_id.
#[derive(Accounts)]
#[instruction(task_id: u64, deadline: i64, stake_amount: u64)]
pub struct StakeTask<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + Task::LEN, // 8 bytes for discriminator + size of Task struct
        seeds = [b"task", user.key().as_ref(), &task_id.to_le_bytes()],
        bump,
    )]
    pub task: Account<'info, Task>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

// Context for completing the task.
// The 'close = user' attribute ensures that when this account is closed,
// any lamports remaining in the task account (the staked SOL) are transferred back to the user.
#[derive(Accounts)]
pub struct CompleteTask<'info> {
    #[account(
        mut,
        has_one = user,
        close = user, // Closes the account and sends lamports to 'user'
    )]
    pub task: Account<'info, Task>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

// The Task account holds the task's state and the staked SOL (escrow).
#[account]
pub struct Task {
    pub user: Pubkey,       // The user who staked SOL
    pub task_id: u64,       // Unique identifier for the task
    pub deadline: i64,      // Task deadline as a Unix timestamp
    pub completed: bool,    // Completion status
    pub staked_amount: u64, // Amount of SOL staked (in lamports)
}

// Calculate the space needed for the Task account:
// user: 32 bytes, task_id: 8, deadline: 8, completed: 1, staked_amount: 8
impl Task {
    pub const LEN: usize = 32 + 8 + 8 + 1 + 8;
}

// Custom error to handle deadline issues.
#[error_code]
pub enum CustomError {
    #[msg("Task deadline has passed")]
    DeadlinePassed,
}
