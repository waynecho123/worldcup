/**
 * 2026 美加墨世界杯赛事结构定义
 * 48支球队, 12个小组, 每组4队
 */

import { GroupInfo } from '../types'

// ========== 12个小组分组结果 ==========
export const GROUPS: GroupInfo[] = [
  { name: 'A', teams: ['mexico', 'south-africa', 'south-korea', 'czech-republic'] },
  { name: 'B', teams: ['canada', 'bosnia', 'qatar', 'switzerland'] },
  { name: 'C', teams: ['brazil', 'morocco', 'haiti', 'scotland'] },
  { name: 'D', teams: ['united-states', 'paraguay', 'australia', 'turkey'] },
  { name: 'E', teams: ['germany', 'curacao', 'ivory-coast', 'ecuador'] },
  { name: 'F', teams: ['netherlands', 'japan', 'sweden', 'tunisia'] },
  { name: 'G', teams: ['belgium', 'egypt', 'iran', 'new-zealand'] },
  { name: 'H', teams: ['spain', 'cape-verde', 'saudi-arabia', 'uruguay'] },
  { name: 'I', teams: ['france', 'senegal', 'iraq', 'norway'] },
  { name: 'J', teams: ['argentina', 'algeria', 'austria', 'jordan'] },
  { name: 'K', teams: ['portugal', 'dr-congo', 'uzbekistan', 'colombia'] },
  { name: 'L', teams: ['england', 'croatia', 'ghana', 'panama'] },
]

// ========== 小组赛对阵安排 (每组4队单循环, 共6场) ==========
export const GROUP_FIXTURES = [
  { home: 0, away: 1 },  // Team1 vs Team2
  { home: 2, away: 3 },  // Team3 vs Team4
  { home: 0, away: 2 },  // Team1 vs Team3
  { home: 1, away: 3 },  // Team2 vs Team4
  { home: 0, away: 3 },  // Team1 vs Team4
  { home: 1, away: 2 },  // Team2 vs Team3
]

// ========== 淘汰赛32强对阵表 (按FIFA规则) ==========
// 小组第1/2名 + 8个最佳小组第3 -> 32强
// 对阵基于: 1A vs 3C/D/E/F, 1B vs 3A/E/F/G, etc.
export const ROUND32_MATCHUPS = [
  { match: 1, teamA: '1A', teamB: '3C/D/E/F' },
  { match: 2, teamA: '1B', teamB: '3A/E/F/G' },
  { match: 3, teamA: '1C', teamB: '3A/B/F/G' },
  { match: 4, teamA: '1D', teamB: '3B/C/E/F' },
  { match: 5, teamA: '1E', teamB: '3A/B/C/D' },
  { match: 6, teamA: '1F', teamB: '3C/D/E/G' },
  { match: 7, teamA: '1G', teamB: '3A/C/D/E' },
  { match: 8, teamA: '1H', teamB: '3B/D/F/G' },
  { match: 9, teamA: '1I', teamB: '3A/B/D/G' },
  { match: 10, teamA: '1J', teamB: '3C/E/F/G' },
  { match: 11, teamA: '1K', teamB: '3A/B/C/D' },
  { match: 12, teamA: '1L', teamB: '3E/F/G/H' },
  { match: 13, teamA: '2A', teamB: '2B' },
  { match: 14, teamA: '2C', teamB: '2D' },
  { match: 15, teamA: '2E', teamB: '2F' },
  { match: 16, teamA: '2G', teamB: '2H' },
  { match: 17, teamA: '2I', teamB: '2J' },
  { match: 18, teamA: '2K', teamB: '2L' },
  { match: 19, teamA: '1A', teamB: '3C/D/E/F' }, // alternate pairing
  { match: 20, teamA: '1B', teamB: '3A/E/F/G' },
]

// 简化的32强对阵 (实际由小组结果动态决定)
// 这里定义淘汰赛树结构
export const KNOCKOUT_ROUNDS: string[] = [
  'round32', 'round16', 'quarter', 'semi', 'third', 'final'
]

// 赛事时间节点 (2026年6月11日 - 7月19日)
export const TOURNAMENT_SCHEDULE = {
  startDate: '2026-06-11',
  finalDate: '2026-07-19',
  groupStageEnd: '2026-06-28',
  round32Start: '2026-06-30',
  round16Start: '2026-07-05',
  quarterStart: '2026-07-10',
  semiStart: '2026-07-14',
  thirdPlace: '2026-07-18',
  final: '2026-07-19',
}
