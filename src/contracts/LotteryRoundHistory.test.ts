import { describe, it, expect } from 'vitest';
import { ethers } from 'hardhat';
import { LotteryRoundHistory } from './LotteryRoundHistory.sol';

describe('LotteryRoundHistory', () => {
  let lotteryRoundHistory: LotteryRoundHistory;
  let owner: any;

  beforeEach(async () => {
    const [signerOwner] = await ethers.getSigners();
    owner = signerOwner;

    const LotteryRoundHistoryFactory = await ethers.getContractFactory('LotteryRoundHistory');
    lotteryRoundHistory = await LotteryRoundHistoryFactory.deploy();
    await lotteryRoundHistory.deployed();
  });

  it('should create and retrieve lottery rounds', async () => {
    // Simulate creating a round
    await lotteryRoundHistory.createNewRound();

    // Get total rounds
    const totalRounds = await lotteryRoundHistory.getTotalRounds();
    expect(totalRounds).toBe(1);

    // Complete the round
    await lotteryRoundHistory.completeRound(
      1, 
      owner.address, 
      ethers.utils.parseEther('10')
    );

    // Retrieve round details
    const round = await lotteryRoundHistory.getLotteryRound(1);
    
    expect(round._roundNumber).toBe(1);
    expect(round._winner).toBe(owner.address);
    expect(round._potSize).toBe(ethers.utils.parseEther('10'));
    expect(round._completed).toBe(true);
  });

  it('should throw error for non-existent round', async () => {
    await expect(
      lotteryRoundHistory.getLotteryRound(999)
    ).rejects.toThrow('Round does not exist');
  });
});