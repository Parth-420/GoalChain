# GoalChain
## Under Process 🚧
**Smart contract integration with Next.js API routes is currently under process.**

---

## Overview
GoalChain is a decentralized application (dApp) built on the Solana blockchain. The core idea behind GoalChain is to enable users to stake SOL as a commitment toward achieving personal goals within a specified deadline. If the goal is met before the deadline, the staked funds (plus any additional logic such as rewards) are returned to the user. Otherwise, the funds remain locked or may be reallocated based on the defined smart contract rules.

---

## Technology Stack
- **Smart Contract:** Solana, Anchor (Rust)
- **Frontend:** Next.js, TailwindCSS 
- **Blockchain:** Solana (using Devnet/Mainnet as needed)
- **Deployment:** Vercel for the frontend, Solana CLI/Anchor for the smart contract

---

## Project Structure
```
goalchain/
├── contract/    # Solana smart contract code (Anchor/Rust)
│   ├── programs/
│   ├── tests/
│   └── Anchor.toml
│
└── ui/          # Next.js frontend application
    ├── app/              # App router pages and layouts
    ├── components/       # Reusable UI components
    ├── hooks/            # Custom React hooks
    ├── lib/              # Utility functions and libraries
    ├── public/           # Static assets
    ├── components.json   # UI component configuration
    ├── next.config.js    # Next.js configuration
    ├── package.json      # Dependencies and scripts
    ├── tailwind.config.ts # Tailwind CSS configuration
    └── tsconfig.json     # TypeScript configuration
```

---

## Smart Contract
The smart contract (written in Anchor) includes the following key instructions:
- **stake_task:** Initializes a new task account (as a PDA) where users stake SOL along with a task deadline and unique task ID.
- **complete_task:** Closes the task account and returns the staked funds to the user if the task is completed before the deadline.
The contract ensures that each task has a unique PDA by including a unique task identifier in the PDA derivation.

---

## Next.js Integration (Under Process)
Our current work-in-progress involves integrating the smart contract with Next.js API routes. The goal is to allow the UI to:
- Trigger a transaction that calls `stake_task` when a user creates a new goal.
- Invoke `complete_task` via an API route when the user marks a goal as completed, returning the funds to their wallet.
This integration is not complete yet, and further updates will be provided as the development progresses.

---

## Setup and Deployment

### Smart Contract Deployment
1. **Build the Program:**
   ```sh
   cd contract
   anchor build
   ```

2. **Deploy to Devnet/Mainnet:**
   ```sh
   anchor deploy
   ```

3. **Verify the Deployment:**
   ```sh
   solana program show <YOUR_PROGRAM_ID>
   ```

### Next.js Setup and Development
1. **Navigate to the UI Directory:**
   ```sh
   cd ui
   ```

2. **Install Dependencies:**
   ```sh
   pnpm install
   ```
3. **Start the Development Server:**
   ```sh
   pnpm  dev
   ```

4. **Build for Production:**
   ```sh
   pnpm  build
   ```


## 🔮 Future Features

- **Enhanced Rewards & Penalties:**
  Implement dynamic rewards or penalties based on task completion status and adherence to deadlines.

- **Multi-User and Community Challenges:**
  Enable users to participate in group challenges and track collective progress toward shared goals.

- **Real-time Notifications:**
  Provide timely notifications as deadlines approach or upon task completion to keep users informed.

- **Advanced Analytics:**
  Offer detailed performance tracking and goal analytics to help users understand their progress and areas for improvement.

---

## 🤝 Contributing
Contributions are welcome! If you have ideas, improvements, or bug fixes, please open an issue or submit a pull request. Collaborative efforts are appreciated to enhance the functionality and user experience of GoalChain.