/**
 * 分享海报页 - 生成世界杯推演结果分享图
 */

import { View, Text, Image, Canvas } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useTournamentStore } from '../../store/tournament'
import { getTeamById } from '../../data'
import './share.scss'

const FLAG_BASE = 'https://flagcdn.com/w80'

export default function Share() {
  const { userTeamId, knockoutTree, phase } = useTournamentStore()
  const team = getTeamById(userTeamId || '')

  const handleShareToChat = () => {
    Taro.showToast({ title: '分享功能开发中', icon: 'none' })
  }

  const handleSaveImage = () => {
    Taro.showToast({ title: '海报保存功能开发中', icon: 'none' })
  }

  // 找用户最终战绩
  let result = '小组赛'
  if (knockoutTree) {
    const findResult = (node: any): string | null => {
      if (node.winnerId === userTeamId && node.round === 'final') return '🏆 冠军！'
      if (node.winnerId === userTeamId && node.round === 'third') return '🥉 季军'
      if (node.winnerId === userTeamId && node.round === 'semi') return '决赛'
      if (node.teamAId === userTeamId || node.teamBId === userTeamId) {
        if (node.winnerId && node.winnerId !== userTeamId) {
          const roundNames: Record<string, string> = { round32: '32强', round16: '16强', quarter: '8强', semi: '4强' }
          return roundNames[node.round] || node.round
        }
      }
      if (node.left) { const r = findResult(node.left); if (r) return r }
      if (node.right) { const r = findResult(node.right); if (r) return r }
      return null
    }
    const r = findResult(knockoutTree)
    if (r) result = r
  }

  return (
    <View className='page-container share-page'>
      <Text className='section-title'>📊 我的世界杯推演结果</Text>

      {/* 海报预览 */}
      <View className='poster-preview'>
        <View className='poster-bg'>
          <Text className='poster-title'>🏆 2026 世界杯</Text>
          <Text className='poster-subtitle'>我的推演之旅</Text>

          {team && (
            <View className='poster-team'>
              <Image className='poster-flag' src={`${FLAG_BASE}/${team.countryCode}.png`} mode='aspectFit' style={{ width: 80, height: 60 }} />
              <Text className='poster-team-name'>{team.name}</Text>
            </View>
          )}

          <View className='poster-result'>
            <Text className='result-label'>最终战绩</Text>
            <Text className='result-value'>{result}</Text>
          </View>

          <Text className='poster-footer'>⚽ 2026 美加墨世界杯推演</Text>
        </View>
      </View>

      <View className='share-actions'>
        <View className='btn btn-primary' onClick={handleSaveImage}>
          <Text>💾 保存海报</Text>
        </View>
        <View className='btn btn-outline' onClick={handleShareToChat}>
          <Text>💬 分享给朋友</Text>
        </View>
      </View>
    </View>
  )
}
