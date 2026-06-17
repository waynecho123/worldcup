/**
 * 比赛环境生成器
 * 为每场比赛生成真实的球场/天气/环境因素
 */

import { StadiumFactors, Weather, MatchContext } from '../types'
import { pick, randInt } from '../utils/random'

// 2026世界杯 16个主办城市/球场
const STADIUMS: Omit<StadiumFactors, 'weather'>[] = [
  { name: '阿兹特克球场', city: '墨西哥城', capacity: 87523, pitchCondition: 82, altitude: 2240, temperature: 22, humidity: 45, homeSupport: 95 },
  { name: '大都会人寿球场', city: '纽约/新泽西', capacity: 82500, pitchCondition: 90, altitude: 10, temperature: 28, humidity: 60, homeSupport: 70 },
  { name: 'AT&T球场', city: '达拉斯', capacity: 80000, pitchCondition: 88, altitude: 130, temperature: 35, humidity: 55, homeSupport: 65 },
  { name: '索菲球场', city: '洛杉矶', capacity: 70240, pitchCondition: 92, altitude: 30, temperature: 25, humidity: 50, homeSupport: 75 },
  { name: '梅赛德斯-奔驰球场', city: '亚特兰大', capacity: 71000, pitchCondition: 95, altitude: 320, temperature: 32, humidity: 65, homeSupport: 60 },
  { name: 'NRG球场', city: '休斯顿', capacity: 72220, pitchCondition: 84, altitude: 13, temperature: 34, humidity: 70, homeSupport: 55 },
  { name: '李维斯球场', city: '旧金山', capacity: 68500, pitchCondition: 86, altitude: 5, temperature: 22, humidity: 55, homeSupport: 60 },
  { name: 'Lumen Field', city: '西雅图', capacity: 68740, pitchCondition: 80, altitude: 50, temperature: 18, humidity: 65, homeSupport: 65 },
  { name: 'BMO球场', city: '多伦多', capacity: 30000, pitchCondition: 78, altitude: 76, temperature: 26, humidity: 58, homeSupport: 90 },
  { name: 'BC Place', city: '温哥华', capacity: 54500, pitchCondition: 85, altitude: 2, temperature: 20, humidity: 60, homeSupport: 85 },
]

// 天气类型及其影响
const WEATHERS: Weather[] = ['clear', 'clear', 'clear', 'cloudy', 'cloudy', 'rain', 'rain', 'windy', 'hot', 'cold']

export function generateStadium(): StadiumFactors {
  const stadium = { ...pick(STADIUMS) }
  return {
    ...stadium,
    weather: pick(WEATHERS),
  }
}

export function generateMatchContext(isKnockout: boolean, homeTeamId?: string): MatchContext {
  return {
    stadium: generateStadium(),
    isKnockout,
  }
}

/** 计算天气对技术型打法的影响 */
export function getWeatherImpact(weather: Weather): { skillPenalty: number; speedPenalty: number; staminaDrain: number } {
  switch (weather) {
    case 'rain':        return { skillPenalty: 5, speedPenalty: 2, staminaDrain: 8 }
    case 'heavy-rain':  return { skillPenalty: 12, speedPenalty: 5, staminaDrain: 12 }
    case 'hot':         return { skillPenalty: 0, speedPenalty: 3, staminaDrain: 15 }
    case 'cold':        return { skillPenalty: 3, speedPenalty: 5, staminaDrain: 5 }
    case 'windy':       return { skillPenalty: 3, speedPenalty: 0, staminaDrain: 3 }
    case 'cloudy':      return { skillPenalty: 0, speedPenalty: 0, staminaDrain: 0 }
    default:            return { skillPenalty: 0, speedPenalty: 0, staminaDrain: 0 }
  }
}

/** 高海拔对体能的影响 */
export function getAltitudeImpact(altitude: number): number {
  if (altitude > 1500) return 12
  if (altitude > 800) return 5
  return 0
}
