pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;

pub use constants::*;
pub use instructions::*;
pub use state::*;

declare_id!("AYR8P7KgHZNvV1RT2DBNuJDUVzF9i8dGVYJ65LviggvH");

#[program]
pub mod voting_dapp {
    use super::*;

    pub fn initialize_poll(context: Context<InitializePoll>, 
        poll_id: u64, 
        description: String,
        poll_start: u64,
        poll_end: u64,
    ) -> Result<()> {
        instructions::initialize_poll::initialize_poll(context, poll_id, description, poll_start, poll_end)?;
        Ok(())
      }
    
}

