// ========== 球员位置 ==========
export type PlayerPosition =
  | 'GK'
  | 'CB' | 'LB' | 'RB'
  | 'CDM' | 'CM' | 'CAM' | 'LM' | 'RM'
  | 'LW' | 'RW' | 'ST' | 'CF'

// ========== 球员属性 (FM风格, 1-99) ==========
export interface PlayerAttributes {
  attack: number       // 进攻 (Finishing, Off The Ball, Composure)
  defense: number      // 防守 (Tackling, Marking, Positioning)
  speed: number        // 速度 (Pace, Acceleration)
  stamina: number      // 体能 (Stamina, Natural Fitness, Strength)
  skill: number        // 技术 (Dribbling, First Touch, Technique, Flair)
  shooting: number     // 射门 (Finishing, Long Shots, Penalties)
  passing: number      // 传球 (Passing, Crossing, Vision)
  goalkeeping: number  // 门将 (Handling, Reflexes, Positioning, Aerial)
}

// ========== 球员 ==========
export interface Player {
  id: string
  name: string
  nameEn: string
  number: number
  position: PlayerPosition
  club: string
  attributes: PlayerAttributes
  isStarter: boolean
  isKeyPlayer: boolean
  currentFatigue?: number   // 跨场次累积疲劳 0-100
  isInjured?: boolean       // 是否受伤停赛
  yellowCardsTotal?: number // 累积黄牌
  isSuspended?: boolean     // 是否停赛
}

// ========== 联合会 ==========
export type Confederation = 'UEFA' | 'AFC' | 'CAF' | 'CONCACAF' | 'CONMEBOL' | 'OFC'

// ========== 阵型 ==========
export type Formation = '4-3-3' | '4-4-2' | '3-5-2' | '4-2-3-1' | '3-4-3' | '5-3-2' | '4-1-4-1'

// ========== 战术风格 ==========
export type AttackingStyle = 'possession' | 'direct' | 'counter-attack' | 'wing-play' | 'tiki-taka' | 'route-one'
export type DefensiveStyle = 'high-press' | 'mid-block' | 'low-block' | 'man-marking' | 'zonal'
export type Mentality = 'very-defensive' | 'defensive' | 'balanced' | 'attacking' | 'very-attacking'
export type Tempo = 'slow' | 'normal' | 'fast'
export type PressingIntensity = 'low' | 'medium' | 'high'

// ========== 战术设置 ==========
export interface Tactics {
  mentality: Mentality            // 比赛心态
  attackingStyle: AttackingStyle  // 进攻风格
  defensiveStyle: DefensiveStyle  // 防守风格
  tempo: Tempo                    // 比赛节奏
  pressingIntensity: PressingIntensity // 逼抢强度
  playOutOfDefense: boolean       // 从后场组织
  counterPress: boolean           // 丢球后反抢
  highDefensiveLine: boolean      // 高位防线
}

// ========== 天气 ==========
export type Weather = 'clear' | 'cloudy' | 'rain' | 'heavy-rain' | 'windy' | 'hot' | 'cold'

// ========== 球场因素 ==========
export interface StadiumFactors {
  name: string
  city: string
  capacity: number
  pitchCondition: number    // 草皮质量 1-99
  altitude: number          // 海拔(m), 影响体能
  weather: Weather
  temperature: number       // 摄氏度
  humidity: number          // 湿度 %
  homeSupport: number       // 主场支持度 0-100
}

// ========== 比赛上下文 ==========
export interface MatchContext {
  stadium: StadiumFactors
  isKnockout: boolean
  awayGoalsRule?: boolean   // 客场进球规则
}

// ========== 球员比赛状态 ==========
export interface PlayerMatchState {
  playerId: string
  fatigue: number           // 当前疲劳度 0-100 (100=精疲力竭)
  morale: number            // 士气 1-99
  isOnPitch: boolean
  yellowCards: number       // 本场黄牌数
  isSentOff: boolean
  injuryRisk: number        // 受伤风险 0-100
}

// ========== 场上位置定义 ==========
export interface FieldPosition {
  id: string
  label: string
  x: number
  y: number
  allowedRoles: PlayerPosition[]
  playerId?: string
}

// ========== 阵容 ==========
export interface Squad {
  teamId: string
  formation: Formation
  starters: string[]
  substitutes: string[]
  captainId: string
}

// ========== 比赛事件 ==========
export type MatchEventType = 'goal' | 'yellowCard' | 'redCard' | 'substitution' | 'penaltyGoal' | 'ownGoal' | 'penaltyMiss' | 'injury' | 'weatherEffect' | 'tacticalChange'

export interface MatchEvent {
  minute: number
  type: MatchEventType
  teamId: string
  playerId: string
  playerOutId?: string     // 换人时被换下球员
  description: string
}

// ========== 比赛轮次 ==========
export type MatchRound = 'group' | 'round32' | 'round16' | 'quarter' | 'semi' | 'third' | 'final'

// ========== 比赛 ==========
export interface Match {
  id: string
  round: MatchRound
  group?: string
  homeTeamId: string
  awayTeamId: string
  homeScore: number | null
  awayScore: number | null
  homePenalties?: number | null
  awayPenalties?: number | null
  events: MatchEvent[]
  isSimulated: boolean
  winnerId?: string
  date?: string
  context: MatchContext
  homeTactics: Tactics
  awayTactics: Tactics
  homePlayerStates: PlayerMatchState[]
  awayPlayerStates: PlayerMatchState[]
  substitutions: Substitution[]   // 预排和实时换人
  isUserMatch: boolean            // 是否用户参与的比赛
  userTeamSide?: 'home' | 'away'  // 用户是主队还是客队
}

// ========== 换人记录 ==========
export interface Substitution {
  minute: number
  teamId: string
  playerOutId: string
  playerInId: string
}

// ========== 小组积分 ==========
export interface GroupStanding {
  teamId: string
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  points: number
}

// ========== 淘汰赛节点 ==========
export interface KnockoutNode {
  id: string
  round: MatchRound
  matchId?: string
  teamAId?: string
  teamBId?: string
  scoreA?: number | null
  scoreB?: number | null
  penaltiesA?: number | null
  penaltiesB?: number | null
  winnerId?: string
  left?: KnockoutNode
  right?: KnockoutNode
}

// ========== 球队 ==========
export interface TeamData {
  id: string
  name: string
  nameEn: string
  flag: string           // 国旗 emoji (降级方案)
  countryCode: string    // ISO 3166-1 alpha-2 国家代码, 用于加载真实国旗图片
  confederation: Confederation
  fifaRank: number
  group: string
  players: Player[]
}

// ========== 赛事阶段 ==========
export type TournamentPhase = 'setup' | 'group-stage' | 'knockout' | 'finished'

// ========== 小组信息 ==========
export interface GroupInfo {
  name: string
  teams: string[]
}
