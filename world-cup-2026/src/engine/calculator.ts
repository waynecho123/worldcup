/**
 * 球队实力计算器
 * 基于 FM 风格球员属性 + 战术修正 + 疲劳修正
 */

import { Player, PlayerAttributes, Tactics, PlayerMatchState } from '../types'

const POSITION_WEIGHTS: Record<string, { attack: number; defense: number; midfield: number }> = {
  GK:  { attack: 0.0, defense: 0.30, midfield: 0.0 },
  CB:  { attack: 0.05, defense: 0.30, midfield: 0.05 },
  LB:  { attack: 0.10, defense: 0.15, midfield: 0.10 },
  RB:  { attack: 0.10, defense: 0.15, midfield: 0.10 },
  CDM: { attack: 0.05, defense: 0.20, midfield: 0.15 },
  CM:  { attack: 0.15, defense: 0.10, midfield: 0.20 },
  CAM: { attack: 0.20, defense: 0.05, midfield: 0.20 },
  LM:  { attack: 0.15, defense: 0.10, midfield: 0.15 },
  RM:  { attack: 0.15, defense: 0.10, midfield: 0.15 },
  LW:  { attack: 0.20, defense: 0.05, midfield: 0.10 },
  RW:  { attack: 0.20, defense: 0.05, midfield: 0.10 },
  ST:  { attack: 0.30, defense: 0.00, midfield: 0.05 },
  CF:  { attack: 0.25, defense: 0.00, midfield: 0.10 },
}

export interface TeamStrength {
  attackScore: number
  defenseScore: number
  midfieldScore: number
  overallScore: number
  goalkeeperScore: number
  staminaScore: number
  speedScore: number
}

/** 计算单个球员综合评分 */
export function calculatePlayerOverall(attr: PlayerAttributes, position: string): number {
  if (position === 'GK') {
    return Math.round(attr.goalkeeping * 0.5 + attr.defense * 0.2 + attr.stamina * 0.1 + attr.speed * 0.1 + attr.passing * 0.1)
  }
  return Math.round(attr.attack * 0.25 + attr.defense * 0.15 + attr.speed * 0.15 + attr.stamina * 0.1 + attr.skill * 0.15 + attr.shooting * 0.1 + attr.passing * 0.1)
}

/** 计算球队基础实力 */
export function calculateTeamStrength(
  players: Player[],
  playerStates?: PlayerMatchState[],
  tactics?: Tactics
): TeamStrength {
  if (players.length === 0) {
    return { attackScore: 50, defenseScore: 50, midfieldScore: 50, overallScore: 50, goalkeeperScore: 50, staminaScore: 50, speedScore: 50 }
  }

  let attackSum = 0, defenseSum = 0, midfieldSum = 0
  let gkSum = 0, staminaSum = 0, speedSum = 0
  let totalWeight = 0

  for (const player of players) {
    const w = POSITION_WEIGHTS[player.position] || { attack: 0.1, defense: 0.1, midfield: 0.1 }
    const weight = w.attack + w.defense + w.midfield

    // 疲劳修正: 疲劳度越高，属性越低
    const state = playerStates?.find(s => s.playerId === player.id)
    const fatigueFactor = state ? 1 - (state.fatigue / 200) : 1  // 100疲劳 → 50%属性
    const attr = player.attributes

    attackSum += attr.attack * w.attack * fatigueFactor
    defenseSum += attr.defense * w.defense * fatigueFactor
    midfieldSum += (attr.skill + attr.passing) / 2 * w.midfield * fatigueFactor
    gkSum += attr.goalkeeping * fatigueFactor
    staminaSum += attr.stamina * fatigueFactor
    speedSum += attr.speed * fatigueFactor
    totalWeight += weight
  }

  const gkPlayer = players.find(p => p.position === 'GK')
  let goalkeeperScore = gkPlayer ? gkPlayer.attributes.goalkeeping : 60

  let result: TeamStrength = {
    attackScore: Math.round(attackSum / (totalWeight || 1)),
    defenseScore: Math.round(defenseSum / (totalWeight || 1)),
    midfieldScore: Math.round(midfieldSum / (totalWeight || 1)),
    overallScore: Math.round((attackSum + defenseSum + midfieldSum) / (totalWeight * 3 || 1) * 100),
    goalkeeperScore,
    staminaScore: Math.round(staminaSum / (players.length || 1)),
    speedScore: Math.round(speedSum / (players.length || 1)),
  }

  // 战术修正
  if (tactics) {
    result = applyTacticsModifier(result, tactics)
  }

  return result
}

/** 战术修正 */
function applyTacticsModifier(strength: TeamStrength, tactics: Tactics): TeamStrength {
  const mod = { ...strength }

  // 心态修正
  switch (tactics.mentality) {
    case 'very-attacking': mod.attackScore += 8; mod.defenseScore -= 10; break
    case 'attacking': mod.attackScore += 4; mod.defenseScore -= 4; break
    case 'defensive': mod.attackScore -= 4; mod.defenseScore += 6; break
    case 'very-defensive': mod.attackScore -= 8; mod.defenseScore += 10; break
  }

  // 进攻风格修正
  switch (tactics.attackingStyle) {
    case 'possession': mod.midfieldScore += 3; mod.attackScore += 1; break
    case 'direct': mod.attackScore += 3; mod.midfieldScore -= 2; break
    case 'counter-attack': mod.speedScore += 5; mod.midfieldScore -= 1; break
    case 'wing-play': mod.speedScore += 3; mod.attackScore += 2; break
    case 'tiki-taka': mod.midfieldScore += 5; mod.attackScore += 2; mod.defenseScore -= 2; break
    case 'route-one': mod.attackScore += 3; mod.defenseScore += 2; mod.midfieldScore -= 4; break
  }

  // 防守风格修正
  switch (tactics.defensiveStyle) {
    case 'high-press': mod.defenseScore += 4; mod.staminaScore -= 5; break
    case 'low-block': mod.defenseScore += 3; mod.attackScore -= 2; break
    case 'man-marking': mod.defenseScore += 2; break
    case 'zonal': mod.defenseScore += 1; mod.midfieldScore += 1; break
  }

  // 节奏修正
  switch (tactics.tempo) {
    case 'fast': mod.speedScore += 3; mod.staminaScore -= 3; break
    case 'slow': mod.midfieldScore += 2; mod.staminaScore += 2; mod.speedScore -= 2; break
  }

  // 逼抢强度
  switch (tactics.pressingIntensity) {
    case 'high': mod.defenseScore += 3; mod.staminaScore -= 8; break
    case 'low': mod.staminaScore += 3; mod.defenseScore -= 3; break
  }

  // 后场组织
  if (tactics.playOutOfDefense) {
    mod.midfieldScore += 2; mod.defenseScore -= 1
  }

  // 丢球反抢
  if (tactics.counterPress) {
    mod.defenseScore += 2; mod.staminaScore -= 4
  }

  // 高位防线
  if (tactics.highDefensiveLine) {
    mod.defenseScore += 2; mod.staminaScore -= 3
  }

  mod.overallScore = Math.round((mod.attackScore + mod.defenseScore + mod.midfieldScore) / 3)
  return mod
}
