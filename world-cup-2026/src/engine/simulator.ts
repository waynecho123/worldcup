/**
 * 比赛模拟核心引擎 v2
 * 支持: 战术设置、天气/球场因素、实时换人、疲劳累积、红黄牌停赛
 *
 * 用户流程:
 * 1. 赛前设置战术和首发阵容
 * 2. 比赛中实时观察，做出换人/战术调整决策
 * 3. 比赛结束后查看统计，进入下一轮
 */

import { Player, Match, MatchEvent, TeamData, Tactics, MatchContext, PlayerMatchState, Substitution } from '../types'
import { calculateTeamStrength } from './calculator'
import { getWeatherImpact, getAltitudeImpact } from './environment'
import { rand, gaussianRandom, clamp, pick, randInt, chance } from '../utils/random'

function uid(): string {
  return `match_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

// ========== 默认战术 (AI电脑使用) ==========
const DEFAULT_TACTICS: Tactics = {
  mentality: 'balanced',
  attackingStyle: 'possession',
  defensiveStyle: 'zonal',
  tempo: 'normal',
  pressingIntensity: 'medium',
  playOutOfDefense: true,
  counterPress: false,
  highDefensiveLine: false,
}

/** AI根据球队实力选择战术 */
function aiChooseTactics(teamStrength: number, opponentStrength: number): Tactics {
  const diff = teamStrength - opponentStrength
  if (diff > 15) {
    return { ...DEFAULT_TACTICS, mentality: 'attacking', attackingStyle: 'possession', pressingIntensity: 'high' }
  } else if (diff > 5) {
    return { ...DEFAULT_TACTICS, mentality: 'attacking', tempo: 'fast' }
  } else if (diff < -15) {
    return { ...DEFAULT_TACTICS, mentality: 'defensive', attackingStyle: 'counter-attack', defensiveStyle: 'low-block', tempo: 'fast' }
  } else if (diff < -5) {
    return { ...DEFAULT_TACTICS, mentality: 'defensive', defensiveStyle: 'mid-block' }
  }
  return { ...DEFAULT_TACTICS }
}

export interface SimPhaseResult {
  /** 当前比分 */
  homeScore: number
  awayScore: number
  /** 本阶段发生的事件 */
  events: MatchEvent[]
  /** 是否有球员受伤/红牌 (需要换人) */
  needsSubstitution: boolean
  /** 需要换人的球队和球员 */
  forcedSubOut?: { teamId: string; playerId: string; reason: string }
  /** 建议可能做出的战术调整 */
  suggestedChanges?: string[]
}

/**
 * 分阶段模拟比赛 (支持用户交互)
 * 比赛被分为4个阶段: 0-25', 26-45', 46-70', 71-90' (+加时)
 */
export function simulateMatchPhase(
  match: Match,
  homeTeam: TeamData,
  awayTeam: TeamData,
  phase: number, // 0-3 对应4个阶段
  userTactics?: { home?: Tactics; away?: Tactics },
  pendingSubs?: Substitution[]
): SimPhaseResult {
  const phaseRanges = [{ start: 0, end: 25 }, { start: 26, end: 45 }, { start: 46, end: 70 }, { start: 71, end: 90 }]
  const { start, end } = phaseRanges[phase] || { start: 0, end: 90 }

  // 获取当前场上球员
  const homePlayers = getActivePlayers(homeTeam, match, 'home', pendingSubs?.filter(s => s.minute <= end))
  const awayPlayers = getActivePlayers(awayTeam, match, 'away', pendingSubs?.filter(s => s.minute <= end))

  // 计算实力
  const homeStrength = calculateTeamStrength(
    homePlayers,
    match.homePlayerStates.filter(s => s.isOnPitch),
    userTactics?.home || match.homeTactics
  )
  const awayStrength = calculateTeamStrength(
    awayPlayers,
    match.awayPlayerStates.filter(s => s.isOnPitch),
    userTactics?.away || match.awayTactics
  )

  // 环境修正
  const weather = getWeatherImpact(match.context.stadium.weather)
  const altitude = getAltitudeImpact(match.context.stadium.altitude)

  const phaseMinutes = end - start
  // 每个阶段约25分钟比赛时间
  const timeScale = phaseMinutes / 90

  // 计算本阶段期望进球
  const homeAttack = homeStrength.attackScore - weather.skillPenalty
  const awayAttack = awayStrength.attackScore - weather.skillPenalty
  const homeDefense = homeStrength.defenseScore
  const awayDefense = awayStrength.defenseScore

  let homeXG = clamp((homeAttack - awayDefense + 10) / 15 * timeScale + gaussianRandom(0, 0.3), 0, 2.5)
  let awayXG = clamp((awayAttack - homeDefense + 10) / 15 * timeScale + gaussianRandom(0, 0.3), 0, 2.5)

  // 守门员影响
  homeXG = clamp(homeXG - (awayStrength.goalkeeperScore - 70) / 60, 0, 3)
  awayXG = clamp(awayXG - (homeStrength.goalkeeperScore - 70) / 60, 0, 3)

  // 体能衰减修正 (后期阶段)
  if (phase >= 2) {
    const homeStamina = homeStrength.staminaScore - weather.staminaDrain - altitude
    const awayStamina = awayStrength.staminaScore - weather.staminaDrain - altitude
    if (homeStamina < 65) homeXG *= 0.8
    if (awayStamina < 65) awayXG *= 0.8
  }

  // 高海拔对非适应球队的影响
  if (altitude > 0) {
    homeXG *= 0.92
    awayXG *= 0.92
  }

  // 冷门因子
  if (rand() < 0.06) {
    const underdog = homeStrength.overallScore < awayStrength.overallScore ? 'home' : 'away'
    if (underdog === 'home') homeXG += 0.8
    else awayXG += 0.8
  }

  const homePhaseGoals = poissonSample(homeXG)
  const awayPhaseGoals = poissonSample(awayXG)

  // 生成事件
  const events: MatchEvent[] = []
  generateGoalEvents(events, homeTeam, 'home', homePhaseGoals, start, end, match.homeScore || 0)
  generateGoalEvents(events, awayTeam, 'away', awayPhaseGoals, start, end, match.awayScore || 0)

  // 黄牌 (每阶段1-2张)
  const yellows = randInt(phase >= 2 ? 1 : 0, 2)
  for (let i = 0; i < yellows; i++) {
    const side = pick(['home', 'away']) as 'home' | 'away'
    const team = side === 'home' ? homeTeam : awayTeam
    const player = pick(homePlayers.filter(p => p.position !== 'GK'))
    if (player) {
      events.push({
        minute: randInt(start, end),
        type: 'yellowCard',
        teamId: team.id,
        playerId: player.id,
        description: `${player.name} 吃到黄牌`,
      })
    }
  }

  // 红牌 (3%每阶段)
  let forcedSubOut: SimPhaseResult['forcedSubOut'] = undefined
  if (chance(0.03)) {
    const side = pick(['home', 'away']) as 'home' | 'away'
    const team = side === 'home' ? homeTeam : awayTeam
    const player = pick(homePlayers)
    if (player) {
      const minute = randInt(start, end)
      events.push({
        minute,
        type: 'redCard',
        teamId: team.id,
        playerId: player.id,
        description: `${player.name} 被红牌罚下！`,
      })
      forcedSubOut = { teamId: team.id, playerId: player.id, reason: '红牌罚下' }
    }
  }

  // 受伤 (4%每阶段)
  if (!forcedSubOut && chance(0.04)) {
    const side = pick(['home', 'away']) as 'home' | 'away'
    const team = side === 'home' ? homeTeam : awayTeam
    const player = pick(homePlayers)
    if (player) {
      events.push({
        minute: randInt(start, end),
        type: 'injury',
        teamId: team.id,
        playerId: player.id,
        description: `${player.name} 受伤，可能无法继续比赛`,
      })
    }
  }

  // 应用战术调整事件
  if (userTactics) {
    events.push({
      minute: start,
      type: 'tacticalChange',
      teamId: homeTeam.id,
      playerId: '',
      description: '球队做出战术调整',
    })
  }

  const newHomeScore = (match.homeScore || 0) + homePhaseGoals
  const newAwayScore = (match.awayScore || 0) + awayPhaseGoals

  // 建议
  const suggestedChanges: string[] = []
  if (newHomeScore < newAwayScore && phase >= 1) {
    suggestedChanges.push('比分落后，是否考虑加强进攻？')
  }
  if (phase >= 2 && homeStrength.staminaScore < 65) {
    suggestedChanges.push('球员体能下降，建议考虑换人')
  }
  if (match.homePlayerStates.filter(s => s.yellowCards >= 1).length >= 3) {
    suggestedChanges.push('多名球员身背黄牌，注意防守动作')
  }

  return {
    homeScore: newHomeScore,
    awayScore: newAwayScore,
    events,
    needsSubstitution: !!forcedSubOut || suggestedChanges.length > 0,
    forcedSubOut,
    suggestedChanges,
  }
}

/** 一次性模拟整场比赛 */
export function simulateFullMatch(
  homeTeam: TeamData,
  awayTeam: TeamData,
  round: Match['round'],
  context: MatchContext,
  homeTactics: Tactics = DEFAULT_TACTICS,
  awayTactics?: Tactics,
  groupName?: string,
  isUserMatch: boolean = false,
  userTeamSide?: 'home' | 'away'
): Match {
  // AI对手战术
  const homeStr = calculateTeamStrength(homeTeam.players.filter(p => p.isStarter))
  const awayStr = calculateTeamStrength(awayTeam.players.filter(p => p.isStarter))
  if (!awayTactics) awayTactics = aiChooseTactics(awayStr.overallScore, homeStr.overallScore)

  // 初始化球员状态
  const homePlayerStates: PlayerMatchState[] = homeTeam.players.map(p => ({
    playerId: p.id,
    fatigue: p.currentFatigue || 0,
    morale: 75,
    isOnPitch: p.isStarter,
    yellowCards: 0,
    isSentOff: false,
    injuryRisk: randInt(0, 15),
  }))
  const awayPlayerStates: PlayerMatchState[] = awayTeam.players.map(p => ({
    playerId: p.id,
    fatigue: p.currentFatigue || 0,
    morale: 75,
    isOnPitch: p.isStarter,
    yellowCards: 0,
    isSentOff: false,
    injuryRisk: randInt(0, 15),
  }))

  const match: Match = {
    id: uid(),
    round,
    group: groupName,
    homeTeamId: homeTeam.id,
    awayTeamId: awayTeam.id,
    homeScore: 0,
    awayScore: 0,
    events: [],
    isSimulated: false,
    context,
    homeTactics,
    awayTactics,
    homePlayerStates,
    awayPlayerStates,
    substitutions: [],
    isUserMatch,
    userTeamSide,
  }

  // 分4阶段模拟
  for (let phase = 0; phase < 4; phase++) {
    const result = simulateMatchPhase(match, homeTeam, awayTeam, phase)
    match.homeScore = result.homeScore
    match.awayScore = result.awayScore
    match.events.push(...result.events)
  }

  match.isSimulated = true
  if (match.homeScore! > match.awayScore!) {
    match.winnerId = homeTeam.id
  } else if (match.awayScore! > match.homeScore!) {
    match.winnerId = awayTeam.id
  }
  // 淘汰赛平局 -> 加时+点球
  if (match.homeScore === match.awayScore && context.isKnockout) {
    simulateExtraTimeAndPenalties(match, homeTeam, awayTeam)
  }

  // 更新球员疲劳 (+30-50 每场比赛)
  for (const ps of match.homePlayerStates) {
    const player = homeTeam.players.find(p => p.id === ps.playerId)
    if (player) player.currentFatigue = Math.min(100, (player.currentFatigue || 0) + randInt(25, 45))
  }
  for (const ps of match.awayPlayerStates) {
    const player = awayTeam.players.find(p => p.id === ps.playerId)
    if (player) player.currentFatigue = Math.min(100, (player.currentFatigue || 0) + randInt(25, 45))
  }

  return match
}

/** 执行用户换人 */
export function applySubstitution(
  match: Match,
  teamId: string,
  playerOutId: string,
  playerInId: string,
  minute: number
): Match {
  match.substitutions.push({ minute, teamId, playerOutId, playerInId })

  const playerStates = teamId === match.homeTeamId ? match.homePlayerStates : match.awayPlayerStates
  const outState = playerStates.find(s => s.playerId === playerOutId)
  const inState = playerStates.find(s => s.playerId === playerInId)
  if (outState) outState.isOnPitch = false
  if (inState) inState.isOnPitch = true

  match.events.push({
    minute,
    type: 'substitution',
    teamId,
    playerId: playerInId,
    playerOutId,
    description: `换人调整`,
  })

  return match
}

// ===== 内部辅助函数 =====

function getActivePlayers(team: TeamData, match: Match, side: 'home' | 'away', subs?: Substitution[]): Player[] {
  const playerStates = side === 'home' ? match.homePlayerStates : match.awayPlayerStates
  // 场上球员 = 首发且未被换下/罚下 + 替补换上来的
  const activeIds = playerStates
    .filter(s => s.isOnPitch && !s.isSentOff)
    .map(s => s.playerId)

  // 应用换人
  if (subs) {
    for (const sub of subs) {
      if (sub.teamId === team.id) {
        const outIdx = activeIds.indexOf(sub.playerOutId)
        if (outIdx >= 0) activeIds.splice(outIdx, 1)
        if (!activeIds.includes(sub.playerInId)) activeIds.push(sub.playerInId)
      }
    }
  }

  return team.players.filter(p => activeIds.includes(p.id))
}

function poissonSample(lambda: number): number {
  if (lambda <= 0) return 0
  const L = Math.exp(-lambda)
  let k = 0, p = 1
  while (p > L) { k++; p *= rand() }
  return k - 1
}

function generateGoalEvents(
  events: MatchEvent[], team: TeamData,
  side: string, goals: number,
  start: number, end: number, existingGoals: number
): void {
  for (let i = 0; i < goals; i++) {
    const scorer = pickScorer(team)
    const minute = randInt(start, end)
    events.push({
      minute,
      type: 'goal',
      teamId: team.id,
      playerId: scorer.id,
      description: `${scorer.name} 进球！(${existingGoals + i + 1}-?)`,
    })
  }
}

function pickScorer(team: TeamData): Player {
  const attackers = team.players.filter(p =>
    ['ST', 'CF', 'LW', 'RW', 'CAM'].includes(p.position) && p.isStarter
  )
  const others = team.players.filter(p =>
    !['ST', 'CF', 'LW', 'RW', 'CAM', 'GK'].includes(p.position) && p.isStarter
  )
  if (attackers.length > 0 && rand() < 0.7) return pick(attackers)
  if (others.length > 0) return pick(others)
  return pick(team.players.filter(p => p.isStarter))
}

function simulateExtraTimeAndPenalties(match: Match, homeTeam: TeamData, awayTeam: TeamData): void {
  // 加时赛 (简化: 直接增加期望进球的30%)
  const etHome = poissonSample(0.35)
  const etAway = poissonSample(0.35)
  match.homeScore! += etHome
  match.awayScore! += etAway

  if (match.homeScore === match.awayScore) {
    // 点球大战
    const penResult = simulatePenalties(homeTeam, awayTeam)
    match.homePenalties = penResult.home
    match.awayPenalties = penResult.away
    match.winnerId = penResult.home > penResult.away ? homeTeam.id : awayTeam.id
    match.events.push({
      minute: 120, type: 'penaltyGoal',
      teamId: match.winnerId!, playerId: '',
      description: `点球大战 ${penResult.home}-${penResult.away}，${match.winnerId === homeTeam.id ? homeTeam.name : awayTeam.name} 获胜！`,
    })
  } else {
    match.winnerId = match.homeScore! > match.awayScore! ? homeTeam.id : awayTeam.id
  }
}

function simulatePenalties(homeTeam: TeamData, awayTeam: TeamData): { home: number; away: number } {
  let home = 0, away = 0
  for (let i = 0; i < 5; i++) {
    if (penaltyShot(homeTeam)) home++
    if (penaltyShot(awayTeam)) away++
    if (i >= 4 && home !== away) break
  }
  while (home === away) {
    if (penaltyShot(homeTeam)) home++
    if (penaltyShot(awayTeam)) away++
    if (home !== away) break
  }
  return { home, away }
}

function penaltyShot(team: TeamData): boolean {
  const takers = team.players.filter(p =>
    ['ST', 'CF', 'CAM', 'CM', 'LW', 'RW'].includes(p.position)
  )
  const taker = pick(takers)
  const shootingSkill = taker ? taker.attributes.shooting + taker.attributes.skill : 140
  return rand() < clamp(shootingSkill / 200, 0.65, 0.92)
}
