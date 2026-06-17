/**
 * 比赛详情页 - 展示比赛事件、比分、统计
 */

import { View, Text, ScrollView } from '@tarojs/components'
import { useTournamentStore } from '../../store/tournament'
import { getTeamById } from '../../data'
import { MatchEvent } from '../../types'
import './match.scss'

export default function MatchDetail() {
  const allMatches = useTournamentStore(s => s.allMatches)

  // 获取路由参数中的match id
  const params = {} // Taro.getCurrentInstance().router?.params
  // 简化: 展示最近一场用户比赛
  const match = allMatches.find(m => m.isUserMatch && m.isSimulated) || allMatches.find(m => m.isSimulated)

  if (!match) {
    return (
      <View className='page-container match-page'>
        <Text className='text-dim'>暂无比赛数据</Text>
      </View>
    )
  }

  const homeTeam = getTeamById(match.homeTeamId)
  const awayTeam = getTeamById(match.awayTeamId)
  const events = match.events.sort((a, b) => a.minute - b.minute)

  const homeGoals = events.filter(e => e.teamId === match.homeTeamId && (e.type === 'goal' || e.type === 'penaltyGoal' || e.type === 'ownGoal')).length
  const awayGoals = events.filter(e => e.teamId === match.awayTeamId && (e.type === 'goal' || e.type === 'penaltyGoal' || e.type === 'ownGoal')).length

  const getEventIcon = (type: MatchEvent['type']) => {
    switch (type) {
      case 'goal': return '⚽'
      case 'penaltyGoal': return '🥅'
      case 'ownGoal': return '😱'
      case 'yellowCard': return '🟨'
      case 'redCard': return '🟥'
      case 'substitution': return '🔄'
      case 'injury': return '🏥'
      case 'tacticalChange': return '📋'
      case 'weatherEffect': return '🌧️'
      default: return '•'
    }
  }

  return (
    <View className='page-container match-page'>
      {/* 比分板 */}
      <View className='scoreboard'>
        <View className='sb-team sb-home'>
          <Text className='sb-name'>{homeTeam?.name || match.homeTeamId}</Text>
        </View>
        <View className='sb-score'>
          <Text className='sb-num'>{match.homeScore}</Text>
          <Text className='sb-divider'>:</Text>
          <Text className='sb-num'>{match.awayScore}</Text>
          {match.homePenalties !== undefined && (
            <Text className='sb-pens'>({match.homePenalties}-{match.awayPenalties})</Text>
          )}
        </View>
        <View className='sb-team sb-away'>
          <Text className='sb-name'>{awayTeam?.name || match.awayTeamId}</Text>
        </View>
      </View>

      {match.winnerId && (
        <View className='winner-banner'>
          <Text>🏆 {getTeamById(match.winnerId)?.name || match.winnerId} 获胜！</Text>
        </View>
      )}

      {/* 比赛环境 */}
      <View className='card match-context'>
        <Text className='context-title'>比赛环境</Text>
        <View className='context-grid'>
          <Text className='context-item'>🏟️ {match.context.stadium.name}</Text>
          <Text className='context-item'>📍 {match.context.stadium.city}</Text>
          <Text className='context-item'>🌡️ {match.context.stadium.temperature}°C</Text>
          <Text className='context-item'>💧 {match.context.stadium.humidity}%</Text>
          <Text className='context-item'>
            {match.context.stadium.weather === 'clear' ? '☀️ 晴' :
             match.context.stadium.weather === 'rain' ? '🌧️ 雨' :
             match.context.stadium.weather === 'cloudy' ? '☁️ 多云' :
             match.context.stadium.weather === 'windy' ? '💨 大风' :
             match.context.stadium.weather === 'hot' ? '🔥 炎热' :
             match.context.stadium.weather === 'cold' ? '❄️ 寒冷' : '⛅'}
          </Text>
        </View>
        {match.context.stadium.altitude > 500 && (
          <Text className='altitude-note'>⛰️ 高海拔 ({match.context.stadium.altitude}m) - 影响球员体能</Text>
        )}
      </View>

      {/* 比赛事件时间线 */}
      <View className='card'>
        <Text className='section-title'>比赛事件</Text>
        <ScrollView scrollY className='events-timeline'>
          {events.length === 0 ? (
            <Text className='text-dim'>暂无事件记录</Text>
          ) : (
            events.map((event, idx) => {
              const isHome = event.teamId === match.homeTeamId
              const eventPlayer = event.playerId
              return (
                <View key={idx} className={`event-item ${isHome ? 'event-home' : 'event-away'}`}>
                  <Text className='event-minute'>{event.minute}'</Text>
                  <Text className='event-icon'>{getEventIcon(event.type)}</Text>
                  <View className='event-content'>
                    <Text className='event-desc'>{event.description}</Text>
                  </View>
                </View>
              )
            })
          )}
        </ScrollView>
      </View>

      {/* 战术信息 */}
      <View className='card'>
        <Text className='section-title'>赛前战术</Text>
        <View className='tactics-compare'>
          <View className='tactic-side'>
            <Text className='tactic-team'>{homeTeam?.name}</Text>
            <Text className='tactic-item'>心态: {match.homeTactics.mentality}</Text>
            <Text className='tactic-item'>进攻: {match.homeTactics.attackingStyle}</Text>
            <Text className='tactic-item'>防守: {match.homeTactics.defensiveStyle}</Text>
          </View>
          <Text className='tactic-vs'>VS</Text>
          <View className='tactic-side'>
            <Text className='tactic-team'>{awayTeam?.name}</Text>
            <Text className='tactic-item'>心态: {match.awayTactics.mentality}</Text>
            <Text className='tactic-item'>进攻: {match.awayTactics.attackingStyle}</Text>
            <Text className='tactic-item'>防守: {match.awayTactics.defensiveStyle}</Text>
          </View>
        </View>
      </View>
    </View>
  )
}
