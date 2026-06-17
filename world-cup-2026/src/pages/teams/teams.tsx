/**
 * 球队选择页 - 48支球队按小组展示
 */

import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useTournamentStore } from '../../store/tournament'
import { GROUPS } from '../../data/tournament'
import { getTeamById } from '../../data'
import './teams.scss'

const FLAG_BASE = 'https://flagcdn.com/w80'

export default function Teams() {
  const { teams, userTeamId, selectTeam } = useTournamentStore()

  const handleSelect = (teamId: string) => {
    selectTeam(teamId)
    Taro.showToast({ title: `已选择 ${getTeamById(teamId)?.name || teamId}`, icon: 'success', duration: 1500 })
    setTimeout(() => Taro.navigateBack(), 1200)
  }

  return (
    <View className='page-container teams-page'>
      <Text className='section-title'>选择你的球队，开启世界杯征程 ⚽</Text>

      <ScrollView scrollY className='groups-scroll'>
        {GROUPS.map(group => (
          <View key={group.name} className='group-section'>
            <Text className='group-title'>小组 {group.name}</Text>
            <View className='team-grid'>
              {group.teams.map(teamId => {
                const team = getTeamById(teamId)
                if (!team) return null
                const isSelected = userTeamId === teamId
                return (
                  <View
                    key={teamId}
                    className={`team-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleSelect(teamId)}
                  >
                    <Image
                      className='team-flag-img'
                      src={`${FLAG_BASE}/${team.countryCode}.png`}
                      mode='aspectFit'
                    />
                    <Text className='team-name'>{team.name}</Text>
                    <Text className='team-rank'>#{team.fifaRank}</Text>
                    {isSelected && <Text className='selected-badge'>已选</Text>}
                  </View>
                )
              })}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  )
}
