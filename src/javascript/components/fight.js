import { controls } from '../../constants/controls';

const log = console.log;

export async function fight(firstFighter, secondFighter) {
  return new Promise((resolve) => {
    // resolve the promise with the winner when fight is over
    setupFight(firstFighter, secondFighter, resolve);
  });
}

export function getDamage(attacker, defender) {
  // return damage
  const potentialDamage = getHitPower(attacker) - getBlockPower(defender);
  return Math.max(potentialDamage, 0);
}

export function getHitPower(fighter) {
  // return hit power
  const { attack } = fighter;
  const criticalHitChance = getRandomChance();
  const attackPower = attack * criticalHitChance;
  return attackPower;
}

export function getBlockPower(fighter) {
  // return block power
  const { defense } = fighter;
  const dodgeChance = getRandomChance();
  const blockPower = defense * dodgeChance;
  return blockPower;
}

function getRandomChance() {
  const randomGenerator = (min, max) => (min + (max - min) * Math.random());
  return randomGenerator(1, 2);
}

function heldKeyDetector() {
  // put KeyCode into the Map when key has been pressed and not released yet
  const heldKeysMap = new Map();
  document.addEventListener('keydown', (event) => {
    const { code } = event;
    if (!heldKeysMap.has(code)) {
      heldKeysMap.set(code, true);
    }
  });

  document.addEventListener('keyup', (event) => {
    const { code } = event;
    heldKeysMap.delete(code);
  });

  const heldKeyChecker = (keyToCheck) => {
    return heldKeysMap.has(keyToCheck);
  }

  return heldKeyChecker;
}


function setupFight(firstFighter, secondFighter, finishFightTrigger) {

  // function for checking out is Key held or not - for player's block detection
  const checkIsHeldKey = heldKeyDetector();

  function setPlayerAttackHandlers() {
    const { PlayerOneAttack, PlayerOneBlock, PlayerTwoAttack, PlayerTwoBlock } = controls;
    document.addEventListener('keyup', (event) => {
      const { code } = event;
      const attackData = {
        isFirstPlayerInBlock: checkIsHeldKey(PlayerOneBlock),
        isSecondPlayerInBlock: checkIsHeldKey(PlayerTwoBlock)
      };
  
      if (code === PlayerOneAttack) {
        const firstPlayerViolence = {
          ...attackData,
          isFirstPlayerAttack: true
        };
        attack(firstFighter, secondFighter, firstPlayerViolence, finishFightTrigger);
      } 
  
      if (code === PlayerTwoAttack) {
        const secondPlayerViolence = {
          ...attackData,
          isSecondPlayerAttack: true
        };
        attack(firstFighter, secondFighter, secondPlayerViolence, finishFightTrigger);
      }
    });
  };

  setPlayerAttackHandlers();

  firstFighter.remainingHealth = firstFighter.health;
  secondFighter.remainingHealth = secondFighter.health;
}

function attack(firstFighter, secondFighter, violenceData, finishFightTrigger) {
  const { isFirstPlayerAttack = false, 
    isFirstPlayerInBlock = false, 
    isSecondPlayerAttack = false, 
    isSecondPlayerInBlock = false } = violenceData;

  log(`isFirstPlayerAttack=${isFirstPlayerAttack}; isFirstPlayerInBlock=${isFirstPlayerInBlock}; isSecondPlayerAttack=${isSecondPlayerAttack}; isSecondPlayerInBlock=${isSecondPlayerInBlock}`);

  // Only allow attack from the First Player when he isn't holding a block
  if (isFirstPlayerAttack && !isFirstPlayerInBlock) {
    const damage = getDamage(firstFighter, secondFighter);
    const healthAfterDamage = secondFighter.remainingHealth - damage;
    secondFighter.remainingHealth = Math.max(healthAfterDamage, 0);
    log(`damage = ${damage} secondFighterHealth = ${secondFighter.remainingHealth}`);
  }

  // Only allow attack from the Second Player when he isn't holding a block
  if (isSecondPlayerAttack && !isSecondPlayerInBlock) {
    const damage = getDamage(secondFighter, firstFighter);
    const healthAfterDamage = firstFighter.remainingHealth - damage;
    firstFighter.remainingHealth = Math.max(healthAfterDamage, 0);
    log(`damage = ${damage} firstFighterHealth = ${firstFighter.remainingHealth}`);
  }

  updateHealthBarIndicators(firstFighter, secondFighter);

  if (secondFighter.remainingHealth === 0) {
    finishFightTrigger(firstFighter);
  } else if (firstFighter.remainingHealth === 0) {
    finishFightTrigger(secondFighter);
  }
}


function updateHealthBarIndicators(firstFighter, secondFighter) {
  const firstFightHealthInPercent = Math.ceil(firstFighter.remainingHealth / firstFighter.health * 100);
  const leftFighterIndicator = document.getElementById('left-fighter-indicator');
  leftFighterIndicator.style.width = `${firstFightHealthInPercent}%`;

  const secondFightHealthInPercent = Math.ceil(secondFighter.remainingHealth / secondFighter.health * 100);
  const rightFighterIndicator = document.getElementById('right-fighter-indicator');
  rightFighterIndicator.style.width = `${secondFightHealthInPercent}%`;
}
