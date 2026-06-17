/**
 * 数据层索引
 * 整合48支球队数据
 */

import { TeamData } from '../types'
import teams from './teams-complete'

const allTeams: TeamData[] = teams

/** 获取所有球队 */
export function getAllTeams(): TeamData[] {
  return allTeams
}

/** 按ID获取球队 */
export function getTeamById(id: string): TeamData | undefined {
  return allTeams.find(t => t.id === id)
}

/** 按小组获取球队 */
export function getTeamsByGroup(group: string): TeamData[] {
  return allTeams.filter(t => t.group === group)
}

/** 构建球队 Map */
export function getTeamsMap(): Map<string, TeamData> {
  const map = new Map<string, TeamData>()
  for (const team of allTeams) {
    map.set(team.id, team)
  }
  return map
}

export { allTeams }
