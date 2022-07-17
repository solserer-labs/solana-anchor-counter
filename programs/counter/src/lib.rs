use anchor_lang::prelude::*;

declare_id!("F48dBMHg9auQacc51avYooqu6JvWmoBY3WR5GZyUQT17");

#[program]
pub mod counter {
    use super::*;

    pub fn initialize_counter(ctx: Context<InitializeCounter>, id: u64) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.count = 0;
        counter.counter_bump = *ctx.bumps.get("counter").unwrap();
        counter.counter_id = id;
        Ok(())
    }

    pub fn increment_counter(ctx: Context<IncrementCounter>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.count = counter.count.checked_add(1).unwrap();
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(id: u64)]
pub struct InitializeCounter<'info> {
    #[account(
        mut,
    )]
    pub creator: Signer<'info>,
    #[account(
        init,
        seeds = [creator.key().as_ref(), id.to_string().as_bytes()],
        bump,
        payer = creator,
        space=144
    )]
    pub counter: Box<Account<'info, Counter>>,
    #[account(address = anchor_lang::system_program::ID)]
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct IncrementCounter<'info> {
    #[account(
        mut,
    )]
    pub creator: Signer<'info>,
    #[account(
        mut,
        seeds = [creator.key().as_ref(), counter.counter_id.to_string().as_bytes()],
        bump = counter.counter_bump
    )]
    pub counter: Box<Account<'info, Counter>>,
    #[account(address = anchor_lang::system_program::ID)]
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[account]
#[derive(Default)]
pub struct Counter {
    pub count: u64,
    pub counter_bump: u8,
    pub counter_id: u64
}
