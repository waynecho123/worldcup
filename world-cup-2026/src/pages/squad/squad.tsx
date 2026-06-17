/**
 * 阵容编辑页 - 选择阵型、排布首发、设置队长和战术
 */

import { useState, useMemo } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useTournamentStore } from '../../store/tournament'
import { getTeamById } from '../../data'
import {
  Formation, PlayerPosition, Tactics, Player,
  Mentality, AttackingStyle, DefensiveStyle, Tempo, PressingIntensity
} from '../../types'
import { calculatePlayerOverall } from '../../engine/calculator'
import './squad.scss'

// ========== 阵型对应的场上位置定义 ==========
const FORMATION_POSITIONS: Record<Formation, { label: string; x: number; y: number; roles: PlayerPosition[] }[]> = {
  '4-3-3': [
    { label: 'GK', x: 50, y: 92, roles: ['GK'] },
    { label: 'LB', x: 15, y: 70, roles: ['LB', 'RB'] },
    { label: 'CB', x: 38, y: 75, roles: ['CB'] },
    { label: 'CB', x: 62, y: 75, roles: ['CB'] },
    { label: 'RB', x: 85, y: 70, roles: ['RB', 'LB'] },
    { label: 'CM', x: 28, y: 48, roles: ['CM', 'CDM', 'CAM'] },
    { label: 'CDM', x: 50, y: 55, roles: ['CDM', 'CM'] },
    { label: 'CM', x: 72, y: 48, roles: ['CM', 'CAM'] },
    { label: 'LW', x: 15, y: 22, roles: ['LW', 'RW', 'ST'] },
    { label: 'ST', x: 50, y: 15, roles: ['ST', 'CF'] },
    { label: 'RW', x: 85, y: 22, roles: ['RW', 'LW'] },
  ],
  '4-4-2': [
    { label: 'GK', x: 50, y: 92, roles: ['GK'] },
    { label: 'LB', x: 15, y: 70, roles: ['LB'] },
    { label: 'CB', x: 38, y: 75, roles: ['CB'] },
    { label: 'CB', x: 62, y: 75, roles: ['CB'] },
    { label: 'RB', x: 85, y: 70, roles: ['RB'] },
    { label: 'LM', x: 15, y: 48, roles: ['LM', 'LW'] },
    { label: 'CM', x: 38, y: 50, roles: ['CM', 'CDM'] },
    { label: 'CM', x: 62, y: 50, roles: ['CM', 'CAM'] },
    { label: 'RM', x: 85, y: 48, roles: ['RM', 'RW'] },
    { label: 'ST', x: 35, y: 18, roles: ['ST', 'CF'] },
    { label: 'ST', x: 65, y: 18, roles: ['ST', 'CF'] },
  ],
  '3-5-2': [
    { label: 'GK', x: 50, y: 92, roles: ['GK'] },
    { label: 'CB', x: 25, y: 72, roles: ['CB'] },
    { label: 'CB', x: 50, y: 78, roles: ['CB'] },
    { label: 'CB', x: 75, y: 72, roles: ['CB'] },
    { label: 'LM', x: 10, y: 50, roles: ['LM', 'LW'] },
    { label: 'CM', x: 32, y: 48, roles: ['CM'] },
    { label: 'CM', x: 50, y: 44, roles: ['CM', 'CAM', 'CDM'] },
    { label: 'CM', x: 68, y: 48, roles: ['CM'] },
    { label: 'RM', x: 90, y: 50, roles: ['RM', 'RW'] },
    { label: 'ST', x: 35, y: 18, roles: ['ST', 'CF'] },
    { label: 'ST', x: 65, y: 18, roles: ['ST', 'CF'] },
  ],
  '4-2-3-1': [
    { label: 'GK', x: 50, y: 92, roles: ['GK'] },
    { label: 'LB', x: 15, y: 70, roles: ['LB'] },
    { label: 'CB', x: 38, y: 75, roles: ['CB'] },
    { label: 'CB', x: 62, y: 75, roles: ['CB'] },
    { label: 'RB', x: 85, y: 70, roles: ['RB'] },
    { label: 'CDM', x: 35, y: 55, roles: ['CDM', 'CM'] },
    { label: 'CDM', x: 65, y: 55, roles: ['CDM', 'CM'] },
    { label: 'LW', x: 18, y: 30, roles: ['LW', 'RW'] },
    { label: 'CAM', x: 50, y: 32, roles: ['CAM', 'CM'] },
    { label: 'RW', x: 82, y: 30, roles: ['RW', 'LW'] },
    { label: 'ST', x: 50, y: 14, roles: ['ST', 'CF'] },
  ],
  '3-4-3': [
    { label: 'GK', x: 50, y: 92, roles: ['GK'] },
    { label: 'CB', x: 25, y: 72, roles: ['CB'] },
    { label: 'CB', x: 50, y: 78, roles: ['CB'] },
    { label: 'CB', x: 75, y: 72, roles: ['CB'] },
    { label: 'LM', x: 12, y: 48, roles: ['LM', 'LW'] },
    { label: 'CM', x: 38, y: 48, roles: ['CM', 'CDM'] },
    { label: 'CM', x: 62, y: 48, roles: ['CM'] },
    { label: 'RM', x: 88, y: 48, roles: ['RM', 'RW'] },
    { label: 'LW', x: 18, y: 20, roles: ['LW', 'ST'] },
    { label: 'ST', x: 50, y: 14, roles: ['ST', 'CF'] },
    { label: 'RW', x: 82, y: 20, roles: ['RW', 'ST'] },
  ],
  '5-3-2': [
    { label: 'GK', x: 50, y: 92, roles: ['GK'] },
    { label: 'LWB', x: 12, y: 65, roles: ['LB', 'LM'] },
    { label: 'CB', x: 32, y: 75, roles: ['CB'] },
    { label: 'CB', x: 50, y: 80, roles: ['CB'] },
    { label: 'CB', x: 68, y: 75, roles: ['CB'] },
    { label: 'RWB', x: 88, y: 65, roles: ['RB', 'RM'] },
    { label: 'CM', x: 25, y: 48, roles: ['CM', 'CDM'] },
    { label: 'CM', x: 50, y: 44, roles: ['CM', 'CAM'] },
    { label: 'CM', x: 75, y: 48, roles: ['CM'] },
    { label: 'ST', x: 35, y: 18, roles: ['ST', 'CF'] },
    { label: 'ST', x: 65, y: 18, roles: ['ST', 'CF'] },
  ],
  '4-1-4-1': [
    { label: 'GK', x: 50, y: 92, roles: ['GK'] },
    { label: 'LB', x: 15, y: 70, roles: ['LB'] },
    { label: 'CB', x: 38, y: 75, roles: ['CB'] },
    { label: 'CB', x: 62, y: 75, roles: ['CB'] },
    { label: 'RB', x: 85, y: 70, roles: ['RB'] },
    { label: 'CDM', x: 50, y: 58, roles: ['CDM', 'CM'] },
    { label: 'LM', x: 15, y: 42, roles: ['LM', 'LW'] },
    { label: 'CM', x: 38, y: 38, roles: ['CM'] },
    { label: 'CM', x: 62, y: 38, roles: ['CM', 'CAM'] },
    { label: 'RM', x: 85, y: 42, roles: ['RM', 'RW'] },
    { label: 'ST', x: 50, y: 15, roles: ['ST', 'CF'] },
  ],
}

const FORMATIONS: Formation[] = ['4-3-3', '4-4-2', '4-2-3-1', '3-5-2', '3-4-3', '5-3-2', '4-1-4-1']

export default function Squad() {
  const { userTeamId, setUserSquad, simulateGroupStage } = useTournamentStore()
  const team = getTeamById(userTeamId || '')

  const [formation, setFormation] = useState<Formation>('4-3-3')
  const [starters, setStarters] = useState<(string | null)[]>(Array(11).fill(null))
  const [captainId, setCaptainId] = useState<string>('')
  const [tactics, setTactics] = useState<Tactics>({
    mentality: 'balanced',
    attackingStyle: 'possession',
    defensiveStyle: 'zonal',
    tempo: 'normal',
    pressingIntensity: 'medium',
    playOutOfDefense: true,
    counterPress: false,
    highDefensiveLine: false,
  })
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null)

  const positions = FORMATION_POSITIONS[formation]

  // 可用球员 (未被选为首发的)
  const availablePlayers = useMemo(() => {
    if (!team) return []
    return team.players.filter(p => {
      // 如果已选为首发或替补的球员不出现在可用列表
      // 简化: 显示所有球员，标记是否已选
      return true
    })
  }, [team, starters])

  const handleSlotClick = (index: number) => {
    setSelectedSlot(selectedSlot === index ? null : index)
  }

  const handlePlayerSelect = (player: Player) => {
    if (selectedSlot === null) return

    // 检查球员是否适合该位置
    const slot = positions[selectedSlot]
    if (!slot.roles.includes(player.position)) {
      Taro.showToast({ title: `${player.name} 不擅长此位置`, icon: 'none' })
      return
    }

    // 检查是否已被选
    if (starters.includes(player.id)) {
      Taro.showToast({ title: '该球员已在首发阵容中', icon: 'none' })
      return
    }

    const newStarters = [...starters]
    newStarters[selectedSlot] = player.id
    setStarters(newStarters)

    if (!captainId) setCaptainId(player.id)
    setSelectedSlot(null)
  }

  const handleSave = () => {
    if (!team || !userTeamId) return

    // 验证所有位置已填
    if (starters.some(s => !s)) {
      Taro.showToast({ title: '请为所有位置选择球员', icon: 'none' })
      return
    }

    // 标记首发球员
    const starterIds = starters.filter(Boolean) as string[]
    team.players.forEach(p => {
      p.isStarter = starterIds.includes(p.id)
    })

    setUserSquad({
      teamId: userTeamId,
      formation,
      starters: starterIds,
      substitutes: team.players.filter(p => !starterIds.includes(p.id)).map(p => p.id),
      captainId: captainId || starterIds[0],
    })

    Taro.showToast({ title: '阵容保存成功！', icon: 'success' })
    simulateGroupStage()
    Taro.navigateTo({ url: '/pages/group-stage/group-stage' })
  }

  if (!team) {
    return <View className='page-container'><Text>请先选择球队</Text></View>
  }

  return (
    <View className='page-container squad-page'>
      {/* 阵型选择 */}
      <ScrollView scrollX className='formation-bar'>
        {FORMATIONS.map(f => (
          <View
            key={f}
            className={`formation-chip ${formation === f ? 'active' : ''}`}
            onClick={() => { setFormation(f); setStarters(Array(11).fill(null)); setSelectedSlot(null) }}
          >
            <Text>{f}</Text>
          </View>
        ))}
      </ScrollView>

      {/* 足球场 */}
      <View className='pitch'>
        <View className='pitch-markings'>
          <View className='pitch-center-circle' />
          <View className='pitch-center-line' />
          <View className='pitch-box pitch-box-top' />
          <View className='pitch-box pitch-box-bottom' />
        </View>

        {positions.map((pos, idx) => {
          const player = starters[idx] ? team.players.find(p => p.id === starters[idx]) : null
          return (
            <View
              key={idx}
              className={`pitch-slot ${selectedSlot === idx ? 'selected' : ''} ${player ? 'filled' : ''}`}
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              onClick={() => handleSlotClick(idx)}
            >
              {player ? (
                <View className='slot-player'>
                  <Text className='slot-name'>{player.name.slice(0, 3)}</Text>
                  <Text className='slot-ovr'>{calculatePlayerOverall(player.attributes, player.position)}</Text>
                  {player.id === captainId && <Text className='captain-armband'>C</Text>}
                </View>
              ) : (
                <Text className='slot-label'>{pos.label}</Text>
              )}
            </View>
          )
        })}
      </View>

      {/* 球员选择 / 战术设置 */}
      {selectedSlot !== null ? (
        <View className='player-select'>
          <Text className='section-title'>选择 {positions[selectedSlot].label} 位置球员</Text>
          <ScrollView scrollY className='player-list'>
            {availablePlayers
              .filter(p => positions[selectedSlot].roles.includes(p.position))
              .sort((a, b) => calculatePlayerOverall(b.attributes, b.position) - calculatePlayerOverall(a.attributes, a.position))
              .map(p => (
                <View key={p.id} className='player-row' onClick={() => handlePlayerSelect(p)}>
                  <Text>{p.number}. {p.name}</Text>
                  <Text className='text-dim'>{p.position}</Text>
                  <Text className='text-primary'>{calculatePlayerOverall(p.attributes, p.position)}</Text>
                </View>
              ))
            }
          </ScrollView>
        </View>
      ) : (
        <View className='tactics-panel'>
          <Text className='section-title'>战术设置</Text>
          <View className='tactic-row'>
            <Text className='tactic-label'>比赛心态</Text>
            <View className='tactic-options'>
              {(['very-defensive', 'defensive', 'balanced', 'attacking', 'very-attacking'] as Mentality[]).map(m => (
                <View key={m} className={`chip ${tactics.mentality === m ? 'active' : ''}`} onClick={() => setTactics({ ...tactics, mentality: m })}>
                  <Text>{m === 'balanced' ? '均衡' : m === 'attacking' ? '进攻' : m === 'defensive' ? '防守' : m === 'very-attacking' ? '猛攻' : '死守'}</Text>
                </View>
              ))}
            </View>
          </View>
          <View className='tactic-row'>
            <Text className='tactic-label'>进攻风格</Text>
            <View className='tactic-options'>
              {(['possession', 'counter-attack', 'wing-play', 'direct'] as AttackingStyle[]).map(s => (
                <View key={s} className={`chip ${tactics.attackingStyle === s ? 'active' : ''}`} onClick={() => setTactics({ ...tactics, attackingStyle: s })}>
                  <Text>{s === 'possession' ? '传控' : s === 'counter-attack' ? '防反' : s === 'wing-play' ? '边路' : '长传'}</Text>
                </View>
              ))}
            </View>
          </View>
          <View className='tactic-row'>
            <Text className='tactic-label'>防守风格</Text>
            <View className='tactic-options'>
              {(['high-press', 'mid-block', 'low-block'] as DefensiveStyle[]).map(s => (
                <View key={s} className={`chip ${tactics.defensiveStyle === s ? 'active' : ''}`} onClick={() => setTactics({ ...tactics, defensiveStyle: s })}>
                  <Text>{s === 'high-press' ? '高位逼抢' : s === 'mid-block' ? '中场拦截' : '低位防守'}</Text>
                </View>
              ))}
            </View>
          </View>
          <View className='tactic-row'>
            <Text className='tactic-label'>比赛节奏</Text>
            <View className='tactic-options'>
              {(['slow', 'normal', 'fast'] as Tempo[]).map(t => (
                <View key={t} className={`chip ${tactics.tempo === t ? 'active' : ''}`} onClick={() => setTactics({ ...tactics, tempo: t })}>
                  <Text>{t === 'slow' ? '慢节奏' : t === 'normal' ? '正常' : '快节奏'}</Text>
                </View>
              ))}
            </View>
          </View>
          <View className='tactic-row'>
            <Text className='tactic-label'>逼抢强度</Text>
            <View className='tactic-options'>
              {(['low', 'medium', 'high'] as PressingIntensity[]).map(p => (
                <View key={p} className={`chip ${tactics.pressingIntensity === p ? 'active' : ''}`} onClick={() => setTactics({ ...tactics, pressingIntensity: p })}>
                  <Text>{p === 'low' ? '低' : p === 'medium' ? '中' : '高'}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      )}

      <View className='save-bar'>
        <View className='btn btn-primary' onClick={handleSave}>
          <Text>保存阵容 · 开始小组赛</Text>
        </View>
      </View>
    </View>
  )
}
