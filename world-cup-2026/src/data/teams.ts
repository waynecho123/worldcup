/**
 * 2026 世界杯 球队数据 Part 1: Groups A-D (16 teams)
 * 球员数据基于真实球员, 属性参考 FM 体系 (1-99)
 * countryCode = ISO 3166-1 alpha-2, 用于加载真实国旗
 */

import { TeamData } from '../types'

const teams: TeamData[] = [
  // ==================== GROUP A ====================
  {
    id: 'mexico', name: '墨西哥', nameEn: 'Mexico', flag: '🇲🇽', countryCode: 'mx',
    confederation: 'CONCACAF', fifaRank: 14, group: 'A',
    players: [
      { id: 'mex-gk-ochoa', name: '奥乔亚', nameEn: 'Guillermo Ochoa', number: 13, position: 'GK', club: 'América', isStarter: true, isKeyPlayer: true, attributes: { attack: 25, defense: 78, speed: 45, stamina: 72, skill: 55, shooting: 20, passing: 45, goalkeeping: 82 } },
      { id: 'mex-cb-alvarez', name: '阿尔瓦雷斯', nameEn: 'Edson Álvarez', number: 4, position: 'CB', club: 'West Ham', isStarter: true, isKeyPlayer: true, attributes: { attack: 55, defense: 82, speed: 68, stamina: 80, skill: 65, shooting: 50, passing: 70, goalkeeping: 10 } },
      { id: 'mex-st-gimenez', name: '希门内斯', nameEn: 'Santiago Giménez', number: 9, position: 'ST', club: 'AC Milan', isStarter: true, isKeyPlayer: true, attributes: { attack: 85, defense: 30, speed: 78, stamina: 75, skill: 80, shooting: 86, passing: 62, goalkeeping: 8 } },
      { id: 'mex-cf-jimenez', name: '希门尼斯', nameEn: 'Raúl Jiménez', number: 11, position: 'CF', club: 'Fulham', isStarter: true, isKeyPlayer: false, attributes: { attack: 80, defense: 30, speed: 70, stamina: 72, skill: 78, shooting: 82, passing: 68, goalkeeping: 8 } },
      { id: 'mex-rw-mora', name: '莫拉', nameEn: 'Gilberto Mora', number: 20, position: 'RW', club: 'Tijuana', isStarter: false, isKeyPlayer: true, attributes: { attack: 72, defense: 25, speed: 88, stamina: 68, skill: 78, shooting: 65, passing: 60, goalkeeping: 5 } },
      { id: 'mex-cm-guardado', name: '瓜尔达多', nameEn: 'Andrés Guardado', number: 18, position: 'CM', club: 'Real Betis', isStarter: true, isKeyPlayer: false, attributes: { attack: 65, defense: 68, speed: 55, stamina: 70, skill: 75, shooting: 60, passing: 78, goalkeeping: 8 } },
      { id: 'mex-lb-gallardo', name: '加利亚多', nameEn: 'Jesús Gallardo', number: 3, position: 'LB', club: 'Monterrey', isStarter: true, isKeyPlayer: false, attributes: { attack: 62, defense: 74, speed: 76, stamina: 78, skill: 65, shooting: 48, passing: 66, goalkeeping: 8 } },
      { id: 'mex-cb-montes', name: '蒙特斯', nameEn: 'César Montes', number: 5, position: 'CB', club: 'Almería', isStarter: true, isKeyPlayer: false, attributes: { attack: 45, defense: 80, speed: 65, stamina: 74, skill: 55, shooting: 42, passing: 60, goalkeeping: 10 } },
    ]
  },
  {
    id: 'south-africa', name: '南非', nameEn: 'South Africa', flag: '🇿🇦', countryCode: 'za',
    confederation: 'CAF', fifaRank: 60, group: 'A',
    players: [
      { id: 'rsa-gk-williams', name: '威廉姆斯', nameEn: 'Ronwen Williams', number: 1, position: 'GK', club: 'Mamelodi Sundowns', isStarter: true, isKeyPlayer: true, attributes: { attack: 20, defense: 74, speed: 50, stamina: 70, skill: 50, shooting: 18, passing: 42, goalkeeping: 78 } },
      { id: 'rsa-st-foster', name: '福斯特', nameEn: 'Lyle Foster', number: 9, position: 'ST', club: 'Burnley', isStarter: true, isKeyPlayer: true, attributes: { attack: 76, defense: 28, speed: 82, stamina: 72, skill: 70, shooting: 74, passing: 55, goalkeeping: 8 } },
      { id: 'rsa-rw-mofokeng', name: '莫弗肯', nameEn: 'Relebohile Mofokeng', number: 7, position: 'RW', club: 'Orlando Pirates', isStarter: true, isKeyPlayer: true, attributes: { attack: 70, defense: 22, speed: 85, stamina: 68, skill: 75, shooting: 62, passing: 58, goalkeeping: 5 } },
      { id: 'rsa-cm-mokoena', name: '莫科纳', nameEn: 'Teboho Mokoena', number: 8, position: 'CM', club: 'Mamelodi Sundowns', isStarter: true, isKeyPlayer: false, attributes: { attack: 62, defense: 65, speed: 68, stamina: 76, skill: 68, shooting: 58, passing: 72, goalkeeping: 8 } },
    ]
  },
  {
    id: 'south-korea', name: '韩国', nameEn: 'South Korea', flag: '🇰🇷', countryCode: 'kr',
    confederation: 'AFC', fifaRank: 25, group: 'A',
    players: [
      { id: 'kor-lw-son', name: '孙兴慜', nameEn: 'Son Heung-min', number: 7, position: 'LW', club: 'LAFC', isStarter: true, isKeyPlayer: true, attributes: { attack: 88, defense: 30, speed: 86, stamina: 82, skill: 86, shooting: 90, passing: 76, goalkeeping: 5 } },
      { id: 'kor-cb-kim', name: '金玟哉', nameEn: 'Kim Min-jae', number: 4, position: 'CB', club: 'Bayern Munich', isStarter: true, isKeyPlayer: true, attributes: { attack: 50, defense: 86, speed: 78, stamina: 80, skill: 60, shooting: 45, passing: 65, goalkeeping: 10 } },
      { id: 'kor-cam-lee', name: '李刚仁', nameEn: 'Lee Kang-in', number: 10, position: 'CAM', club: 'PSG', isStarter: true, isKeyPlayer: true, attributes: { attack: 80, defense: 38, speed: 76, stamina: 68, skill: 86, shooting: 74, passing: 84, goalkeeping: 5 } },
      { id: 'kor-rw-hwang', name: '黄喜灿', nameEn: 'Hwang Hee-chan', number: 11, position: 'RW', club: 'Wolves', isStarter: true, isKeyPlayer: false, attributes: { attack: 78, defense: 35, speed: 88, stamina: 78, skill: 76, shooting: 76, passing: 65, goalkeeping: 5 } },
      { id: 'kor-cm-hwang-in', name: '黄仁范', nameEn: 'Hwang In-beom', number: 6, position: 'CM', club: 'Feyenoord', isStarter: true, isKeyPlayer: false, attributes: { attack: 65, defense: 62, speed: 70, stamina: 78, skill: 72, shooting: 60, passing: 76, goalkeeping: 8 } },
    ]
  },
  {
    id: 'czech-republic', name: '捷克', nameEn: 'Czech Republic', flag: '🇨🇿', countryCode: 'cz',
    confederation: 'UEFA', fifaRank: 40, group: 'A',
    players: [
      { id: 'cze-st-schick', name: '希克', nameEn: 'Patrik Schick', number: 10, position: 'ST', club: 'Bayer Leverkusen', isStarter: true, isKeyPlayer: true, attributes: { attack: 84, defense: 28, speed: 74, stamina: 72, skill: 80, shooting: 86, passing: 62, goalkeeping: 8 } },
      { id: 'cze-cm-soucek', name: '绍切克', nameEn: 'Tomáš Souček', number: 8, position: 'CDM', club: 'West Ham', isStarter: true, isKeyPlayer: true, attributes: { attack: 68, defense: 76, speed: 62, stamina: 84, skill: 66, shooting: 65, passing: 70, goalkeeping: 10 } },
      { id: 'cze-am-sulc', name: '苏尔克', nameEn: 'Pavel Šulc', number: 7, position: 'CAM', club: 'Lyon', isStarter: true, isKeyPlayer: true, attributes: { attack: 76, defense: 35, speed: 74, stamina: 70, skill: 80, shooting: 70, passing: 78, goalkeeping: 5 } },
      { id: 'cze-cb-krejci', name: '克雷伊奇', nameEn: 'Ladislav Krejčí', number: 3, position: 'CB', club: 'Wolves', isStarter: true, isKeyPlayer: false, attributes: { attack: 45, defense: 78, speed: 66, stamina: 72, skill: 55, shooting: 42, passing: 58, goalkeeping: 10 } },
    ]
  },

  // ==================== GROUP B ====================
  {
    id: 'canada', name: '加拿大', nameEn: 'Canada', flag: '🇨🇦', countryCode: 'ca',
    confederation: 'CONCACAF', fifaRank: 30, group: 'B',
    players: [
      { id: 'can-lb-davies', name: '阿方索·戴维斯', nameEn: 'Alphonso Davies', number: 19, position: 'LB', club: 'Bayern Munich', isStarter: true, isKeyPlayer: true, attributes: { attack: 78, defense: 74, speed: 94, stamina: 86, skill: 84, shooting: 62, passing: 76, goalkeeping: 5 } },
      { id: 'can-st-david', name: '乔纳森·大卫', nameEn: 'Jonathan David', number: 9, position: 'ST', club: 'Juventus', isStarter: true, isKeyPlayer: true, attributes: { attack: 86, defense: 30, speed: 82, stamina: 78, skill: 82, shooting: 88, passing: 66, goalkeeping: 8 } },
      { id: 'can-cm-eustaquio', name: '欧斯塔基奥', nameEn: 'Stephen Eustaquio', number: 7, position: 'CM', club: 'LAFC', isStarter: true, isKeyPlayer: false, attributes: { attack: 65, defense: 68, speed: 68, stamina: 80, skill: 72, shooting: 58, passing: 74, goalkeeping: 8 } },
    ]
  },
  {
    id: 'bosnia', name: '波黑', nameEn: 'Bosnia & Herz.', flag: '🇧🇦', countryCode: 'ba',
    confederation: 'UEFA', fifaRank: 64, group: 'B',
    players: [
      { id: 'bih-st-dzeko', name: '哲科', nameEn: 'Edin Džeko', number: 11, position: 'ST', club: 'Schalke', isStarter: true, isKeyPlayer: true, attributes: { attack: 78, defense: 32, speed: 48, stamina: 60, skill: 76, shooting: 82, passing: 68, goalkeeping: 8 } },
      { id: 'bih-cb-kolasinac', name: '科拉希纳茨', nameEn: 'Sead Kolašinac', number: 5, position: 'CB', club: 'Atalanta', isStarter: true, isKeyPlayer: true, attributes: { attack: 55, defense: 80, speed: 66, stamina: 76, skill: 62, shooting: 48, passing: 65, goalkeeping: 10 } },
      { id: 'bih-st-demirovic', name: '德米罗维奇', nameEn: 'Ermedin Demirović', number: 9, position: 'ST', club: 'Stuttgart', isStarter: true, isKeyPlayer: false, attributes: { attack: 80, defense: 28, speed: 74, stamina: 72, skill: 74, shooting: 78, passing: 60, goalkeeping: 5 } },
    ]
  },
  {
    id: 'qatar', name: '卡塔尔', nameEn: 'Qatar', flag: '🇶🇦', countryCode: 'qa',
    confederation: 'AFC', fifaRank: 56, group: 'B',
    players: [
      { id: 'qat-lw-afif', name: '阿菲夫', nameEn: 'Akram Afif', number: 11, position: 'LW', club: 'Al Sadd', isStarter: true, isKeyPlayer: true, attributes: { attack: 78, defense: 25, speed: 80, stamina: 74, skill: 80, shooting: 74, passing: 72, goalkeeping: 5 } },
      { id: 'qat-st-ali', name: '阿里', nameEn: 'Almoez Ali', number: 9, position: 'ST', club: 'Al Duhail', isStarter: true, isKeyPlayer: true, attributes: { attack: 76, defense: 25, speed: 76, stamina: 70, skill: 72, shooting: 78, passing: 58, goalkeeping: 5 } },
    ]
  },
  {
    id: 'switzerland', name: '瑞士', nameEn: 'Switzerland', flag: '🇨🇭', countryCode: 'ch',
    confederation: 'UEFA', fifaRank: 19, group: 'B',
    players: [
      { id: 'sui-cm-xhaka', name: '扎卡', nameEn: 'Granit Xhaka', number: 10, position: 'CM', club: 'Sunderland', isStarter: true, isKeyPlayer: true, attributes: { attack: 72, defense: 72, speed: 58, stamina: 82, skill: 78, shooting: 72, passing: 85, goalkeeping: 8 } },
      { id: 'sui-cb-akanji', name: '阿坎吉', nameEn: 'Manuel Akanji', number: 5, position: 'CB', club: 'Inter Milan', isStarter: true, isKeyPlayer: true, attributes: { attack: 50, defense: 86, speed: 78, stamina: 80, skill: 65, shooting: 45, passing: 68, goalkeeping: 10 } },
      { id: 'sui-st-embolo', name: '恩博洛', nameEn: 'Breel Embolo', number: 9, position: 'ST', club: 'Rennes', isStarter: true, isKeyPlayer: false, attributes: { attack: 78, defense: 28, speed: 84, stamina: 74, skill: 74, shooting: 76, passing: 58, goalkeeping: 8 } },
      { id: 'sui-gk-kobel', name: '科贝尔', nameEn: 'Gregor Kobel', number: 1, position: 'GK', club: 'Dortmund', isStarter: true, isKeyPlayer: true, attributes: { attack: 20, defense: 82, speed: 48, stamina: 78, skill: 55, shooting: 18, passing: 48, goalkeeping: 86 } },
    ]
  },

  // ==================== GROUP C ====================
  {
    id: 'brazil', name: '巴西', nameEn: 'Brazil', flag: '🇧🇷', countryCode: 'br',
    confederation: 'CONMEBOL', fifaRank: 6, group: 'C',
    players: [
      { id: 'bra-lw-vini', name: '维尼修斯', nameEn: 'Vinícius Júnior', number: 7, position: 'LW', club: 'Real Madrid', isStarter: true, isKeyPlayer: true, attributes: { attack: 92, defense: 28, speed: 94, stamina: 82, skill: 94, shooting: 84, passing: 78, goalkeeping: 5 } },
      { id: 'bra-cf-neymar', name: '内马尔', nameEn: 'Neymar', number: 10, position: 'CF', club: 'Santos', isStarter: true, isKeyPlayer: true, attributes: { attack: 90, defense: 22, speed: 82, stamina: 65, skill: 96, shooting: 86, passing: 88, goalkeeping: 5 } },
      { id: 'bra-rw-raphinha', name: '拉菲尼亚', nameEn: 'Raphinha', number: 11, position: 'RW', club: 'Barcelona', isStarter: true, isKeyPlayer: true, attributes: { attack: 86, defense: 35, speed: 88, stamina: 82, skill: 86, shooting: 82, passing: 80, goalkeeping: 5 } },
      { id: 'bra-gk-alisson', name: '阿利松', nameEn: 'Alisson', number: 1, position: 'GK', club: 'Liverpool', isStarter: true, isKeyPlayer: true, attributes: { attack: 20, defense: 86, speed: 50, stamina: 82, skill: 60, shooting: 20, passing: 52, goalkeeping: 90 } },
      { id: 'bra-cb-marquinhos', name: '马尔基尼奥斯', nameEn: 'Marquinhos', number: 4, position: 'CB', club: 'PSG', isStarter: true, isKeyPlayer: true, attributes: { attack: 52, defense: 88, speed: 74, stamina: 82, skill: 65, shooting: 48, passing: 68, goalkeeping: 10 } },
      { id: 'bra-cb-gabriel', name: '加布里埃尔', nameEn: 'Gabriel Magalhães', number: 3, position: 'CB', club: 'Arsenal', isStarter: true, isKeyPlayer: false, attributes: { attack: 55, defense: 86, speed: 72, stamina: 84, skill: 60, shooting: 50, passing: 62, goalkeeping: 10 } },
      { id: 'bra-cm-guimaraes', name: '吉马良斯', nameEn: 'Bruno Guimarães', number: 8, position: 'CM', club: 'Newcastle', isStarter: true, isKeyPlayer: false, attributes: { attack: 72, defense: 70, speed: 68, stamina: 82, skill: 82, shooting: 65, passing: 84, goalkeeping: 8 } },
      { id: 'bra-st-endrick', name: '恩德里克', nameEn: 'Endrick', number: 21, position: 'ST', club: 'Real Madrid', isStarter: false, isKeyPlayer: true, attributes: { attack: 82, defense: 25, speed: 86, stamina: 72, skill: 80, shooting: 84, passing: 60, goalkeeping: 5 } },
    ]
  },
  {
    id: 'morocco', name: '摩洛哥', nameEn: 'Morocco', flag: '🇲🇦', countryCode: 'ma',
    confederation: 'CAF', fifaRank: 8, group: 'C',
    players: [
      { id: 'mar-rb-hakimi', name: '阿什拉夫', nameEn: 'Achraf Hakimi', number: 2, position: 'RB', club: 'PSG', isStarter: true, isKeyPlayer: true, attributes: { attack: 78, defense: 78, speed: 94, stamina: 88, skill: 82, shooting: 68, passing: 80, goalkeeping: 5 } },
      { id: 'mar-am-diaz', name: '迪亚斯', nameEn: 'Brahim Díaz', number: 10, position: 'CAM', club: 'Real Madrid', isStarter: true, isKeyPlayer: true, attributes: { attack: 84, defense: 35, speed: 82, stamina: 72, skill: 88, shooting: 78, passing: 82, goalkeeping: 5 } },
      { id: 'mar-gk-bono', name: '布努', nameEn: 'Yassine Bounou', number: 1, position: 'GK', club: 'Al-Hilal', isStarter: true, isKeyPlayer: true, attributes: { attack: 20, defense: 82, speed: 48, stamina: 76, skill: 58, shooting: 18, passing: 45, goalkeeping: 86 } },
    ]
  },
  {
    id: 'haiti', name: '海地', nameEn: 'Haiti', flag: '🇭🇹', countryCode: 'ht',
    confederation: 'CONCACAF', fifaRank: 83, group: 'C',
    players: [
      { id: 'hai-st-nazon', name: '纳松', nameEn: 'Duckens Nazon', number: 9, position: 'ST', club: 'Esteghlal', isStarter: true, isKeyPlayer: true, attributes: { attack: 72, defense: 25, speed: 76, stamina: 68, skill: 66, shooting: 72, passing: 52, goalkeeping: 5 } },
      { id: 'hai-cm-bellegarde', name: '贝勒加尔德', nameEn: 'Jean-Ricner Bellegarde', number: 8, position: 'CM', club: 'Wolves', isStarter: true, isKeyPlayer: true, attributes: { attack: 68, defense: 60, speed: 74, stamina: 74, skill: 72, shooting: 62, passing: 68, goalkeeping: 8 } },
    ]
  },
  {
    id: 'scotland', name: '苏格兰', nameEn: 'Scotland', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', countryCode: 'gb-sct',
    confederation: 'UEFA', fifaRank: 42, group: 'C',
    players: [
      { id: 'sco-lb-robertson', name: '罗伯逊', nameEn: 'Andy Robertson', number: 3, position: 'LB', club: 'Liverpool', isStarter: true, isKeyPlayer: true, attributes: { attack: 74, defense: 78, speed: 82, stamina: 88, skill: 74, shooting: 55, passing: 82, goalkeeping: 5 } },
      { id: 'sco-cm-mctominay', name: '麦克托米奈', nameEn: 'Scott McTominay', number: 4, position: 'CM', club: 'Napoli', isStarter: true, isKeyPlayer: true, attributes: { attack: 74, defense: 72, speed: 68, stamina: 84, skill: 72, shooting: 74, passing: 70, goalkeeping: 8 } },
      { id: 'sco-lm-mcginn', name: '麦金', nameEn: 'John McGinn', number: 7, position: 'LM', club: 'Aston Villa', isStarter: true, isKeyPlayer: false, attributes: { attack: 72, defense: 58, speed: 70, stamina: 82, skill: 74, shooting: 68, passing: 72, goalkeeping: 8 } },
    ]
  },

  // ==================== GROUP D ====================
  {
    id: 'united-states', name: '美国', nameEn: 'United States', flag: '🇺🇸', countryCode: 'us',
    confederation: 'CONCACAF', fifaRank: 16, group: 'D',
    players: [
      { id: 'usa-lw-pulisic', name: '普利西奇', nameEn: 'Christian Pulisic', number: 10, position: 'LW', club: 'AC Milan', isStarter: true, isKeyPlayer: true, attributes: { attack: 86, defense: 35, speed: 86, stamina: 80, skill: 86, shooting: 82, passing: 80, goalkeeping: 5 } },
      { id: 'usa-cdm-adams', name: '亚当斯', nameEn: 'Tyler Adams', number: 6, position: 'CDM', club: 'Bournemouth', isStarter: true, isKeyPlayer: true, attributes: { attack: 58, defense: 80, speed: 74, stamina: 84, skill: 66, shooting: 55, passing: 68, goalkeeping: 10 } },
      { id: 'usa-lb-robinson', name: '罗宾逊', nameEn: 'Antonee Robinson', number: 5, position: 'LB', club: 'Fulham', isStarter: true, isKeyPlayer: false, attributes: { attack: 68, defense: 76, speed: 88, stamina: 84, skill: 72, shooting: 52, passing: 74, goalkeeping: 8 } },
      { id: 'usa-cm-mckennie', name: '麦肯尼', nameEn: 'Weston McKennie', number: 8, position: 'CM', club: 'Juventus', isStarter: true, isKeyPlayer: false, attributes: { attack: 68, defense: 68, speed: 72, stamina: 84, skill: 74, shooting: 66, passing: 72, goalkeeping: 8 } },
      { id: 'usa-rw-weah', name: '维阿', nameEn: 'Tim Weah', number: 11, position: 'RW', club: 'Juventus', isStarter: true, isKeyPlayer: false, attributes: { attack: 74, defense: 38, speed: 90, stamina: 76, skill: 74, shooting: 70, passing: 65, goalkeeping: 5 } },
      { id: 'usa-st-balogun', name: '巴洛贡', nameEn: 'Folarin Balogun', number: 9, position: 'ST', club: 'Monaco', isStarter: false, isKeyPlayer: false, attributes: { attack: 78, defense: 25, speed: 84, stamina: 72, skill: 74, shooting: 78, passing: 58, goalkeeping: 5 } },
    ]
  },
  {
    id: 'paraguay', name: '巴拉圭', nameEn: 'Paraguay', flag: '🇵🇾', countryCode: 'py',
    confederation: 'CONMEBOL', fifaRank: 41, group: 'D',
    players: [
      { id: 'par-cam-enciso', name: '恩西索', nameEn: 'Julio Enciso', number: 10, position: 'CAM', club: 'Brighton', isStarter: true, isKeyPlayer: true, attributes: { attack: 76, defense: 32, speed: 80, stamina: 72, skill: 80, shooting: 72, passing: 72, goalkeeping: 5 } },
      { id: 'par-rw-almiron', name: '阿尔米隆', nameEn: 'Miguel Almirón', number: 7, position: 'RW', club: 'Newcastle', isStarter: true, isKeyPlayer: true, attributes: { attack: 74, defense: 42, speed: 88, stamina: 80, skill: 76, shooting: 68, passing: 68, goalkeeping: 5 } },
      { id: 'par-cb-gomez', name: '戈麦斯', nameEn: 'Gustavo Gómez', number: 4, position: 'CB', club: 'Palmeiras', isStarter: true, isKeyPlayer: false, attributes: { attack: 48, defense: 80, speed: 64, stamina: 74, skill: 55, shooting: 45, passing: 58, goalkeeping: 10 } },
    ]
  },
  {
    id: 'australia', name: '澳大利亚', nameEn: 'Australia', flag: '🇦🇺', countryCode: 'au',
    confederation: 'AFC', fifaRank: 27, group: 'D',
    players: [
      { id: 'aus-gk-ryan', name: '瑞恩', nameEn: 'Mathew Ryan', number: 1, position: 'GK', club: 'Levante', isStarter: true, isKeyPlayer: true, attributes: { attack: 20, defense: 74, speed: 48, stamina: 72, skill: 52, shooting: 18, passing: 44, goalkeeping: 76 } },
      { id: 'aus-cb-souttar', name: '苏塔尔', nameEn: 'Harry Souttar', number: 5, position: 'CB', club: 'Leicester', isStarter: true, isKeyPlayer: true, attributes: { attack: 48, defense: 76, speed: 58, stamina: 72, skill: 52, shooting: 45, passing: 55, goalkeeping: 10 } },
      { id: 'aus-rw-irankunda', name: '伊兰昆达', nameEn: 'Nestory Irankunda', number: 11, position: 'RW', club: 'Watford', isStarter: true, isKeyPlayer: true, attributes: { attack: 72, defense: 25, speed: 90, stamina: 68, skill: 74, shooting: 68, passing: 55, goalkeeping: 5 } },
    ]
  },
  {
    id: 'turkey', name: '土耳其', nameEn: 'Türkiye', flag: '🇹🇷', countryCode: 'tr',
    confederation: 'UEFA', fifaRank: 25, group: 'D',
    players: [
      { id: 'tur-cm-calhanoglu', name: '恰尔汗奥卢', nameEn: 'Hakan Çalhanoğlu', number: 10, position: 'CM', club: 'Inter Milan', isStarter: true, isKeyPlayer: true, attributes: { attack: 78, defense: 60, speed: 66, stamina: 76, skill: 84, shooting: 78, passing: 88, goalkeeping: 8 } },
      { id: 'tur-cam-guler', name: '居莱尔', nameEn: 'Arda Güler', number: 11, position: 'CAM', club: 'Real Madrid', isStarter: true, isKeyPlayer: true, attributes: { attack: 82, defense: 30, speed: 78, stamina: 65, skill: 90, shooting: 78, passing: 84, goalkeeping: 5 } },
    ]
  },
]

export default teams
