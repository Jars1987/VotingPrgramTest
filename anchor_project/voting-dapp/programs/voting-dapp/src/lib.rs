pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;

pub use constants::*;
pub use instructions::*;
pub use state::*;

declare_id!("HH6z4hgoYg2ZsSkceAUxPZUJdWt8hLqUm1SoEmWqYhPh");

#[program]
pub mod voting_dapp {
    use super::*;

    pub fn initialize_poll(context: Context<InitializePoll>, 
        poll_id: u64, 
        name: String,
        description: String,
        poll_start: u64,
        poll_end: u64,
    ) -> Result<()> {
            initialize_poll::initialize_poll(context, poll_id, name, description, poll_start, poll_end)?;
            Ok(())
        }

    pub fn initialize_candidate(context: Context<InitializeCandidate>, 
        candidate_name: String,
        poll_id: u64,) -> Result<()> {
            initialize_candidate::initialize_candidate(context, candidate_name, poll_id)?;
            Ok(())
        }

    pub fn vote(context: Context<Vote>, 
        poll_id: u64, 
        candidate_name: String) -> Result<()> {
            vote::vote(context, poll_id, candidate_name)?;
            Ok(())
        }
    
}

