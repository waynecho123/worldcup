/**
 * 球队详情页 - 球员列表 + 能力值展示
 */

import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useTournamentStore } from '../../store/tournament'
import { getTeamById } from '../../data'
import { calculatePlayerOverall } from '../../engine/calculator'
import { Player, PlayerAttributes } from '../../types'
import './team-detail.scss'

const FLAG_BASE = 'https://flagcdn.com/w80'

const POS_CN: Record<string, string> = {
  GK: '门将', CB: '中卫', LB: '左后卫', RB: '右后卫',
  CDM: '后腰', CM: '中场', CAM: '前腰', LM: '左中场', RM: '右中场',
  LW: '左边锋', RW: '右边锋', ST: '前锋', CF: '影锋'
}

function AttrBar({ label, value, color = '#00d2ff' }: { label: string; value: number; color?: string }) {
  return (
    <View className='attr-row'>
      <Text className='attr-label'>{label}</Text>
      <View className='attr-bar-bg'>
        <View className='attr-bar-fill' style={{ width: `${value}%`, backgroundColor: color }} />
      </View>
      <Text className='attr-value'>{value}</Text>
    </View>
  )
}

function PlayerRow({ player, isStarter }: { player: Player; isStarter: boolean }) {
  const ovr = calculatePlayerOverall(player.attributes, player.position)
  const ovrColor = ovr >= 85 ? '#ffd700' : ovr >= 78 ? '#00d2ff' : ovr >= 70 ? '#4caf50' : '#8e8e93'

  return (
    <View className={`player-row ${isStarter ? 'starter' : ''}`}>
      <View className='player-left'>
        <Text className='player-number'>{player.number}</Text>
        <View className='player-info'>
          <Text className='player-name'>{player.name}</Text>
          <Text className='player-club'>{player.club}</Text>
        </View>
      </View>
      <View className='player-right'>
        <Text className='player-pos'>{POS_CN[player.position] || player.position}</Text>
        <Text className='player-ovr' style={{ color: ovrColor }}>{ovr}</Text>
        {player.isKeyPlayer && <Text className='key-badge'>⭐</Text>}
      </View>
    </View>
  )
}

export default function TeamDetail() {
  const userTeamId = useTournamentStore(s => s.userTeamId)
  const { teams } = useTournamentStore()
  const params = Taro.getCurrentInstance().router?.params as { id?: string } || {}
  const teamId = params.id || userTeamId
  const team = getTeamById(teamId || '')

  if (!team) {
    return <View className='page-container'><Text>球队未找到</Text></View>
  }

  const starters = team.players.filter(p => p.isStarter)
  const subs = team.players.filter(p => !p.isStarter)

  return (
    <View className='page-container team-detail-page'>
      {/* 球队头部 */}
      <View className='team-header'>
        <Image className='team-flag-lg' src={`${FLAG_BASE}/${team.countryCode}.png`} mode='aspectFit' style={{ width: 80, height: 60 }} />
        <View className='team-header-info'>
          <Text className='th-name'>{team.name}</Text>
          <Text className='th-subtitle'>小组 {team.group} · 世界排名 #{team.fifaRank}</Text>
          <Text className='th-subtitle'>{team.players.length} 名球员</Text>
        </View>
      </View>

      {/* 首发阵容 */}
      <Text className='section-title'>首发阵容 ({starters.length})</Text>
      <ScrollView scrollY className='players-list'>
        {starters.map(p => (
          <PlayerRow key={p.id} player={p} isStarter />
        ))}
        {starters.length === 0 && <Text className='text-dim'>尚未设置首发阵容</Text>}
      </ScrollView>

      {/* 替补球员 */}
      {subs.length > 0 && (
        <>
          <Text className='section-title'>替补球员 ({subs.length})</Text>
          <ScrollView scrollY className='players-list'>
            {subs.map(p => (
              <PlayerRow key={p.id} player={p} isStarter={false} />
            ))}
          </ScrollView>
        </>
      )}
    </View>
  )
}
