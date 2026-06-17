/**
 * 首页 - 2026美加墨世界杯推演
 */

import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useTournamentStore } from '../../store/tournament'
import './index.scss'

const FLAG_BASE = 'https://flagcdn.com/w80'

export default function Index() {
  const phase = useTournamentStore(s => s.phase)
  const userTeamId = useTournamentStore(s => s.userTeamId)
  const teams = useTournamentStore(s => s.teams)
  const reset = useTournamentStore(s => s.reset)
  const selectTeam = useTournamentStore(s => s.selectTeam)
  const selectedTeamData = teams.find(t => t.id === userTeamId)

  const handleStart = () => {
    if (!userTeamId) {
      Taro.showToast({ title: '请先选择你的球队', icon: 'none' })
      return
    }
    Taro.navigateTo({ url: '/pages/squad/squad' })
  }

  const handleSelectTeam = () => {
    Taro.navigateTo({ url: '/pages/teams/teams' })
  }

  const handleContinue = () => {
    if (phase === 'group-stage') {
      Taro.navigateTo({ url: '/pages/group-stage/group-stage' })
    } else if (phase === 'knockout') {
      Taro.navigateTo({ url: '/pages/knockout/knockout' })
    }
  }

  return (
    <View className='page-container home-page'>
      <View className='hero-section'>
        <Text className='hero-icon'>🏆</Text>
        <Text className='hero-title'>2026 世界杯推演</Text>
        <Text className='hero-subtitle'>美国 · 加拿大 · 墨西哥</Text>
        <Text className='hero-date'>6/11 — 7/19</Text>
      </View>

      {selectedTeamData ? (
        <View className='card selected-team-card'>
          <Text className='card-label'>你执教的球队</Text>
          <View className='flex-between'>
            <View className='flex-center' style={{ gap: '16rpx' }}>
              <Image className='flag-main' src={`${FLAG_BASE}/${selectedTeamData.countryCode}.png`} mode='aspectFit' style={{ width: 64, height: 48 }} />
              <View>
                <Text className='team-name-main'>{selectedTeamData.name}</Text>
                <Text className='text-dim'>小组 {selectedTeamData.group} · #{selectedTeamData.fifaRank}</Text>
              </View>
            </View>
            <Text className='text-primary' style={{ fontSize: '24rpx' }} onClick={handleSelectTeam}>更换</Text>
          </View>
        </View>
      ) : (
        <View className='card select-prompt' onClick={handleSelectTeam}>
          <Text className='prompt-icon'>⚽</Text>
          <Text className='prompt-text'>选择你的球队，开启世界杯之旅</Text>
          <Text className='text-dim'>48支球队，由你指挥</Text>
        </View>
      )}

      <View className='action-buttons'>
        {selectedTeamData && phase === 'setup' && (
          <View className='btn btn-primary' onClick={handleStart}>
            <Text>设置阵容 · 开始征程</Text>
          </View>
        )}
        {(phase === 'group-stage' || phase === 'knockout') && (
          <View className='btn btn-primary' onClick={handleContinue}>
            <Text>{phase === 'group-stage' ? '继续小组赛' : '继续淘汰赛'}</Text>
          </View>
        )}
        <View className='btn btn-outline' onClick={handleSelectTeam}>
          <Text>{selectedTeamData ? '更换球队' : '选择球队'}</Text>
        </View>
        {phase !== 'setup' && (
          <View className='btn btn-outline btn-reset' onClick={reset}>
            <Text>重新开始</Text>
          </View>
        )}
      </View>

      <View className='stats-row'>
        <View className='stat-item'><Text className='stat-num'>48</Text><Text className='stat-lbl'>参赛球队</Text></View>
        <View className='stat-item'><Text className='stat-num'>12</Text><Text className='stat-lbl'>小组</Text></View>
        <View className='stat-item'><Text className='stat-num'>104</Text><Text className='stat-lbl'>场比赛</Text></View>
        <View className='stat-item'><Text className='stat-num'>16</Text><Text className='stat-lbl'>城市</Text></View>
      </View>
    </View>
  )
}
