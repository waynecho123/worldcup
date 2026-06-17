/**
 * 淘汰赛页面 - 对阵树展示
 */

import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useTournamentStore } from '../../store/tournament'
import { getTeamById } from '../../data'
import { KnockoutNode } from '../../types'
import './knockout.scss'

const FLAG_BASE = 'https://flagcdn.com/w80'

function KnockoutMatchNode({ node }: { node: KnockoutNode }) {
  const teamA = node.teamAId ? getTeamById(node.teamAId) : null
  const teamB = node.teamBId ? getTeamById(node.teamBId) : null
  const isDone = !!node.winnerId

  const roundLabel: Record<string, string> = {
    round32: '32强', round16: '16强', quarter: '8强',
    semi: '半决赛', third: '三四名', final: '决赛'
  }

  return (
    <View className='kn-match-node'>
      <Text className='kn-round'>{roundLabel[node.round] || node.round}</Text>
      <View className='kn-teams'>
        <View className={`kn-team ${node.winnerId === node.teamAId ? 'winner' : ''}`}>
          {teamA && <Image className='flag-micro' src={`${FLAG_BASE}/${teamA.countryCode}.png`} mode='aspectFit' style={{width:24,height:18}} />}
          <Text className='kn-team-name'>{teamA?.name || node.teamAId || '待定'}</Text>
          {isDone && <Text className='kn-score'>{node.scoreA}</Text>}
        </View>
        <View className={`kn-team ${node.winnerId === node.teamBId ? 'winner' : ''}`}>
          {teamB && <Image className='flag-micro' src={`${FLAG_BASE}/${teamB.countryCode}.png`} mode='aspectFit' style={{width:24,height:18}} />}
          <Text className='kn-team-name'>{teamB?.name || node.teamBId || '待定'}</Text>
          {isDone && <Text className='kn-score'>{node.scoreB}</Text>}
        </View>
      </View>
      {node.penaltiesA !== undefined && (
        <Text className='kn-pens'>点球 ({node.penaltiesA}-{node.penaltiesB})</Text>
      )}
      {(node.left || node.right) && (
        <View className='kn-children'>
          {node.left && <KnockoutMatchNode node={node.left} />}
          {node.right && <KnockoutMatchNode node={node.right} />}
        </View>
      )}
    </View>
  )
}

export default function Knockout() {
  const knockoutTree = useTournamentStore(s => s.knockoutTree)
  const phase = useTournamentStore(s => s.phase)

  if (phase === 'setup') {
    return <View className='page-container'><Text className='text-dim'>请先完成小组赛</Text></View>
  }

  return (
    <View className='page-container knockout-page'>
      <Text className='section-title'>🏆 淘汰赛对阵图</Text>
      <ScrollView scrollX scrollY className='bracket-scroll'>
        {knockoutTree ? (
          <KnockoutMatchNode node={knockoutTree} />
        ) : (
          <Text className='text-dim'>尚未生成淘汰赛对阵</Text>
        )}
      </ScrollView>
    </View>
  )
}
