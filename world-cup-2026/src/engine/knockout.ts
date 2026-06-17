/**
 * 淘汰赛引擎
 * Round of 32 → 16 → 8 → 4 → Final
 */

import { TeamData, Match, KnockoutNode } from '../types'
import { simulateFullMatch } from './simulator'
import { generateMatchContext } from './environment'

/** 构建淘汰赛树 (初始空树) */
export function buildKnockoutTree(groupWinners: string[], groupRunnersUp: string[], bestThirds: string[]): KnockoutNode {
  // 32强所有队伍
  const qualified = [...groupWinners, ...groupRunnersUp, ...bestThirds]
  // 前24自动晋级 (小组前2), 后8是最佳第三
  // 对阵按FIFA规则分配 (简化为: 小组第1 vs 随机第3/第2)
  return buildBracket(qualified)
}

function buildBracket(teams: string[]): KnockoutNode {
  if (teams.length === 2) {
    return {
      id: `kn_${teams[0]}_${teams[1]}`,
      round: 'final',
      teamAId: teams[0],
      teamBId: teams[1],
    }
  }

  const mid = Math.ceil(teams.length / 2)
  const left = buildBracket(teams.slice(0, mid))
  const right = buildBracket(teams.slice(mid))
  const round = left.round === right.round ? left.round : getParentRound(left.round, right.round)

  return {
    id: `kn_node_${Math.random().toString(36).slice(2, 6)}`,
    round,
    left,
    right,
  }
}

function getParentRound(a: string, b: string): string {
  const order = ['round32', 'round16', 'quarter', 'semi', 'third', 'final']
  const idxA = order.indexOf(a), idxB = order.indexOf(b)
  return order[Math.max(idxA, idxB) + 1] || 'final'
}

/** 模拟一轮淘汰赛 */
export function simulateKnockoutRound(
  node: KnockoutNode,
  teamsMap: Map<string, TeamData>,
  userTeamId?: string
): Match[] {
  const matches: Match[] = []

  function simulateNode(n: KnockoutNode): void {
    if (n.left && n.right) {
      simulateNode(n.left)
      simulateNode(n.right)
      n.teamAId = n.left.winnerId
      n.teamBId = n.right.winnerId
    }

    if (n.teamAId && n.teamBId) {
      const teamA = teamsMap.get(n.teamAId)
      const teamB = teamsMap.get(n.teamBId)
      if (!teamA || !teamB) return

      const isUserMatch = !!(userTeamId && (n.teamAId === userTeamId || n.teamBId === userTeamId))
      const context = generateMatchContext(true)

      const match = simulateFullMatch(
        teamA, teamB, n.round, context,
        undefined, undefined, undefined,
        isUserMatch, userTeamId ? (n.teamAId === userTeamId ? 'home' : 'away') : undefined
      )

      match.id = `match_${n.id}`
      n.matchId = match.id
      n.winnerId = match.winnerId
      n.scoreA = match.homeScore
      n.scoreB = match.awayScore
      n.penaltiesA = match.homePenalties
      n.penaltiesB = match.awayPenalties
      matches.push(match)
    }
  }

  simulateNode(node)
  return matches
}

/** 找用户参与的淘汰赛比赛 */
export function findUserKnockoutMatch(node: KnockoutNode, userTeamId: string): KnockoutNode | null {
  function search(n: KnockoutNode): KnockoutNode | null {
    if (n.teamAId === userTeamId || n.teamBId === userTeamId) {
      // 如果还没结果且双方都有对手
      if (!n.winnerId && n.teamAId && n.teamBId) return n
    }
    if (n.left) {
      const found = search(n.left)
      if (found) return found
    }
    if (n.right) {
      const found = search(n.right)
      if (found) return found
    }
    return null
  }
  return search(node)
}
