/**
 * 小组赛引擎
 * 12组 × 4队, 单循环, 前2 + 8佳小组第三 → 32强
 */

import { TeamData, Match, GroupStanding, MatchContext } from '../types'
import { simulateFullMatch } from './simulator'
import { generateMatchContext } from './environment'
import { GROUPS, GROUP_FIXTURES } from '../data/tournament'

export function initGroupStandings(teams: string[]): GroupStanding[] {
  return teams.map(teamId => ({
    teamId, played: 0, won: 0, drawn: 0, lost: 0,
    goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0,
  }))
}

/** 模拟一个小组所有比赛 */
export function simulateGroup(
  groupName: string,
  teamIds: string[],
  teamsMap: Map<string, TeamData>,
  userTeamId?: string
): { matches: Match[]; standings: GroupStanding[] } {
  const standings = initGroupStandings(teamIds)
  const matches: Match[] = []

  for (const fixture of GROUP_FIXTURES) {
    const homeTeamId = teamIds[fixture.home]
    const awayTeamId = teamIds[fixture.away]
    const homeTeam = teamsMap.get(homeTeamId)
    const awayTeam = teamsMap.get(awayTeamId)
    if (!homeTeam || !awayTeam) continue

    const isUserMatch = !!(userTeamId && (homeTeamId === userTeamId || awayTeamId === userTeamId))
    const isKnockout = false
    const context: MatchContext = generateMatchContext(isKnockout)

    const match = simulateFullMatch(
      homeTeam, awayTeam, 'group', context,
      undefined, undefined, groupName,
      isUserMatch, userTeamId ? (homeTeamId === userTeamId ? 'home' : 'away') : undefined
    )
    matches.push(match)
    updateStandings(standings, match)
  }

  standings.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor
    return 0
  })

  return { matches, standings }
}

function updateStandings(standings: GroupStanding[], match: Match): void {
  const home = standings.find(s => s.teamId === match.homeTeamId)
  const away = standings.find(s => s.teamId === match.awayTeamId)
  if (!home || !away || match.homeScore === null || match.awayScore === null) return

  home.played++; away.played++
  home.goalsFor += match.homeScore; home.goalsAgainst += match.awayScore
  away.goalsFor += match.awayScore; away.goalsAgainst += match.homeScore
  home.goalDifference = home.goalsFor - home.goalsAgainst
  away.goalDifference = away.goalsFor - away.goalsAgainst

  if (match.homeScore > match.awayScore) {
    home.won++; home.points += 3; away.lost++
  } else if (match.homeScore < match.awayScore) {
    away.won++; away.points += 3; home.lost++
  } else {
    home.drawn++; away.drawn++; home.points++; away.points++
  }
}

/** 模拟全部12个小组 */
export function simulateAllGroups(
  teamsMap: Map<string, TeamData>,
  userTeamId?: string
): { allMatches: Match[]; allStandings: Map<string, GroupStanding[]> } {
  const allMatches: Match[] = []
  const allStandings = new Map<string, GroupStanding[]>()

  for (const group of GROUPS) {
    const { matches, standings } = simulateGroup(group.name, group.teams, teamsMap, userTeamId)
    allMatches.push(...matches)
    allStandings.set(group.name, standings)
  }

  return { allMatches, allStandings }
}

/** 选出32强 */
export function getQualifiedTeams(allStandings: Map<string, GroupStanding[]>): {
  groupWinners: string[]; groupRunnersUp: string[]; bestThirds: string[]
} {
  const groupWinners: string[] = [], groupRunnersUp: string[] = []
  const allThirds: GroupStanding[] = []

  for (const [, standings] of allStandings) {
    groupWinners.push(standings[0].teamId)
    groupRunnersUp.push(standings[1].teamId)
    allThirds.push(standings[2])
  }

  allThirds.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor
    return 0
  })

  const bestThirds = allThirds.slice(0, 8).map(t => t.teamId)
  return { groupWinners, groupRunnersUp, bestThirds }
}

/** 用户参与的下一场比赛 */
export function findNextUserMatch(
  groupName: string,
  teamIds: string[],
  teamsMap: Map<string, TeamData>,
  playedMatches: Match[],
  userTeamId: string
): { fixtureIndex: number; homeTeam: TeamData; awayTeam: TeamData; isHome: boolean } | null {
  for (let i = 0; i < GROUP_FIXTURES.length; i++) {
    const fixture = GROUP_FIXTURES[i]
    const homeId = teamIds[fixture.home]
    const awayId = teamIds[fixture.away]
    if (homeId !== userTeamId && awayId !== userTeamId) continue

    // 检查是否已模拟
    const alreadyPlayed = playedMatches.some(m =>
      m.homeTeamId === homeId && m.awayTeamId === awayId
    )
    if (alreadyPlayed) continue

    const homeTeam = teamsMap.get(homeId)
    const awayTeam = teamsMap.get(awayId)
    if (!homeTeam || !awayTeam) return null

    return { fixtureIndex: i, homeTeam, awayTeam, isHome: homeId === userTeamId }
  }
  return null
}
