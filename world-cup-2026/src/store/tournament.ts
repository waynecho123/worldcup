/**
 * 赛事全局状态管理 (Zustand)
 */

import { create } from 'zustand'
import {
  TeamData, Match, GroupStanding, KnockoutNode,
  TournamentPhase, Tactics, Formation, Squad, Substitution,
} from '../types'
import { getAllTeams, getTeamsMap } from '../data'
import { simulateAllGroups, getQualifiedTeams } from '../engine/group-stage'
import { buildKnockoutTree, simulateKnockoutRound, findUserKnockoutMatch } from '../engine/knockout'
import { simulateFullMatch, applySubstitution } from '../engine/simulator'
import { generateMatchContext } from '../engine/environment'

interface TournamentStore {
  // 基础数据
  teams: TeamData[]
  teamsMap: Map<string, TeamData>

  // 用户选择
  userTeamId: string | null
  phase: TournamentPhase

  // 阵容
  userSquad: Squad | null

  // 小组赛
  allMatches: Match[]
  allStandings: Map<string, GroupStanding[]>

  // 淘汰赛
  knockoutTree: KnockoutNode | null

  // 当前比赛
  currentMatch: Match | null

  // 操作
  selectTeam: (teamId: string) => void
  setUserSquad: (squad: Squad) => void
  simulateGroupStage: () => void
  simulateKnockoutStage: () => void
  simulateUserMatch: (tactics: Tactics) => void
  makeSubstitution: (playerOutId: string, playerInId: string, minute: number) => void
  advancePhase: () => void
  reset: () => void
}

export const useTournamentStore = create<TournamentStore>((set, get) => ({
  teams: getAllTeams(),
  teamsMap: getTeamsMap(),
  userTeamId: null,
  phase: 'setup',
  userSquad: null,
  allMatches: [],
  allStandings: new Map(),
  knockoutTree: null,
  currentMatch: null,

  selectTeam: (teamId: string) => {
    set({ userTeamId: teamId })
  },

  setUserSquad: (squad: Squad) => {
    set({ userSquad: squad })
  },

  simulateGroupStage: () => {
    const { teamsMap, userTeamId } = get()
    const { allMatches, allStandings } = simulateAllGroups(teamsMap, userTeamId || undefined)
    set({ allMatches, allStandings, phase: 'group-stage' })
  },

  simulateKnockoutStage: () => {
    const { allStandings, teamsMap } = get()
    const { groupWinners, groupRunnersUp, bestThirds } = getQualifiedTeams(allStandings)
    const tree = buildKnockoutTree(groupWinners, groupRunnersUp, bestThirds)
    set({ knockoutTree: tree, phase: 'knockout' })
  },

  simulateUserMatch: (tactics: Tactics) => {
    const { teamsMap, userTeamId, currentMatch } = get()
    if (!userTeamId || !currentMatch || !currentMatch.isUserMatch) return

    const userTeam = teamsMap.get(userTeamId)
    const opponentId = currentMatch.homeTeamId === userTeamId ? currentMatch.awayTeamId : currentMatch.homeTeamId
    const opponent = teamsMap.get(opponentId)
    if (!userTeam || !opponent) return

    const isHome = currentMatch.homeTeamId === userTeamId
    const context = { ...currentMatch.context }

    const match = simulateFullMatch(
      isHome ? userTeam : opponent,
      isHome ? opponent : userTeam,
      currentMatch.round,
      context,
      isHome ? tactics : undefined,
      isHome ? undefined : tactics,
      currentMatch.group,
      true,
      isHome ? 'home' : 'away',
    )

    // 更新比赛列表
    const allMatches = get().allMatches.map(m =>
      m.id === currentMatch.id ? match : m
    )

    set({ currentMatch: match, allMatches })
  },

  makeSubstitution: (playerOutId: string, playerInId: string, minute: number) => {
    const { currentMatch, userTeamId } = get()
    if (!currentMatch || !userTeamId) return

    const updated = applySubstitution(currentMatch, userTeamId, playerOutId, playerInId, minute)
    set({ currentMatch: { ...updated } })
  },

  advancePhase: () => {
    const { phase } = get()
    if (phase === 'setup') {
      get().simulateGroupStage()
    } else if (phase === 'group-stage') {
      get().simulateKnockoutStage()
    }
  },

  reset: () => {
    set({
      userTeamId: null,
      phase: 'setup',
      userSquad: null,
      allMatches: [],
      allStandings: new Map(),
      knockoutTree: null,
      currentMatch: null,
    })
  },
}))
