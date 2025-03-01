use anchor_lang::prelude::*;

declare_id!("Cu1Ty3HxTkKsrsLZfCy46BXtGUke7gjyYX6FhrQEWUr9");

#[program]
pub mod goal_tracker {
    use super::*;

    pub fn stake_task(ctx: Context<StakeTask>, task_id: u64, deadline: i64, stake_amount: u64) -> Result<()> {
        let task = &mut ctx.accounts.task;
        task.user = ctx.accounts.user.key();
        task.task_id = task_id;
        task.deadline = deadline;
        task.completed = false;
        task.staked_amount = stake_amount;
        Ok(())
    }
    

    pub fn complete_task(ctx: Context<CompleteTask>) -> Result<()> {
        require!(Clock::get()?.unix_timestamp <= ctx.accounts.task.deadline, CustomError::DeadlinePassed);
        ctx.accounts.task.completed = true;
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(task_id: u64)]
pub struct StakeTask<'info> {
    #[account(
        init,
        payer = user,
        space = Task::LEN,
        seeds = [b"task", user.key().as_ref(), &task_id.to_le_bytes()],
        bump
    )]
    pub task: Account<'info, Task>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CompleteTask<'info> {
    #[account(mut, has_one = user, close = user)]
    pub task: Account<'info, Task>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Task {
    pub user: Pubkey,
    pub task_id: u64,
    pub deadline: i64,
    pub completed: bool,
    pub staked_amount: u64,
}

impl Task {
    pub const LEN: usize = 8 + 32 + 8 + 8 + 1 + 8; // Account discriminator + fields
}

#[error_code]
pub enum CustomError {
    #[msg("Task deadline has passed")]
    DeadlinePassed,
}
