/**
 * 小组赛页面 - 展示12个小组的积分榜和比赛结果
 */

import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useTournamentStore } from '../../store/tournament'
import { getTeamById } from '../../data'
import { GROUPS } from '../../data/tournament'
import './group-stage.scss'

const FLAG_BASE = 'https://flagcdn.com/w80'

export default function GroupStage() {
  const allMatches = useTournamentStore(s => s.allMatches)
  const allStandings = useTournamentStore(s => s.allStandings)
  const userTeamId = useTournamentStore(s => s.userTeamId)
  const advancePhase = useTournamentStore(s => s.advancePhase)

  const handleAdvance = () => {
    advancePhase()
    Taro.showToast({ title: '进入淘汰赛！', icon: 'success' })
    Taro.navigateTo({ url: '/pages/knockout/knockout' })
  }

  const handleMatchClick = (matchId: string) => {
    Taro.navigateTo({ url: `/pages/match/match?id=${matchId}` })
  }

  return (
    <View className='page-container group-page'>
      <Text className='section-title'>小组赛积分榜</Text>

      <ScrollView scrollY className='groups-container'>
        {GROUPS.map(group => {
          const standings = allStandings.get(group.name) || []
          const groupMatches = allMatches.filter(m => m.group === group.name)

          return (
            <View key={group.name} className='card group-card'>
              <Text className='group-header'>小组 {group.name}</Text>

              {/* 积分表 */}
              <View className='standings-table'>
                <View className='standings-header'>
                  <Text className='col-team'>球队</Text>
                  <Text className='col-stat'>赛</Text>
                  <Text className='col-stat'>胜</Text>
                  <Text className='col-stat'>平</Text>
                  <Text className='col-stat'>负</Text>
                  <Text className='col-stat'>GD</Text>
                  <Text className='col-pts'>分</Text>
                </View>
                {standings.map((s, idx) => {
                  const team = getTeamById(s.teamId)
                  const isUser = s.teamId === userTeamId
                  const isQualified = idx < 2
                  const isThird = idx === 2
                  return (
                    <View key={s.teamId} className={`standings-row ${isUser ? 'user-row' : ''} ${isQualified ? 'qualified' : ''} ${isThird ? 'third' : ''}`}>
                      <Text className='col-team'>
                        {team && <Image className='flag-mini' src={`${FLAG_BASE}/${team.countryCode}.png`} mode='aspectFit' style={{ width: 32, height: 24 }} />}
                        <Text className='team-label'>{idx + 1}. {team?.name || s.teamId}</Text>
                      </Text>
                      <Text className='col-stat'>{s.played}</Text>
                      <Text className='col-stat'>{s.won}</Text>
                      <Text className='col-stat'>{s.drawn}</Text>
                      <Text className='col-stat'>{s.lost}</Text>
                      <Text className='col-stat'>{s.goalDifference > 0 ? '+' : ''}{s.goalDifference}</Text>
                      <Text className='col-pts'>{s.points}</Text>
                    </View>
                  )
                })}
              </View>

              {/* 比赛结果 */}
              {groupMatches.length > 0 && (
                <View className='match-results'>
                  {groupMatches.map(m => {
                    const homeTeam = getTeamById(m.homeTeamId)
                    const awayTeam = getTeamById(m.awayTeamId)
                    const isUserMatch = m.isUserMatch
                    return (
                      <View
                        key={m.id}
                        className={`match-row ${isUserMatch ? 'user-match' : ''}`}
                        onClick={() => handleMatchClick(m.id)}
                      >
                        <Text className='match-team'>{homeTeam?.name || m.homeTeamId}</Text>
                        <Text className={`match-score ${m.isSimulated ? '' : 'pending'}`}>
                          {m.isSimulated ? `${m.homeScore} - ${m.awayScore}` : 'VS'}
                        </Text>
                        <Text className='match-team'>{awayTeam?.name || m.awayTeamId}</Text>
                        {isUserMatch && <Text className='user-badge'>⚽</Text>}
                      </View>
                    )
                  })}
                </View>
              )}
            </View>
          )
        })}
      </ScrollView>

      <View className='btn btn-primary' style={{ marginTop: 32 }} onClick={handleAdvance}>
        <Text>进入淘汰赛 →</Text>
      </View>
    </View>
  )
}
