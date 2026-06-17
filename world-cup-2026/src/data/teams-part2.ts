/**
 * 2026 世界杯 球队数据 Part 2: Groups E-L (32 teams)
 * countryCode = ISO 3166-1 alpha-2
 */

import { TeamData } from '../types'

const teamsPart2: TeamData[] = [
  // ==================== GROUP E ====================
  {
    id: 'germany', name: '德国', nameEn: 'Germany', flag: '🇩🇪', countryCode: 'de',
    confederation: 'UEFA', fifaRank: 10, group: 'E',
    players: [
      { id: 'ger-cam-musiala', name: '穆西亚拉', nameEn: 'Jamal Musiala', number: 10, position: 'CAM', club: 'Bayern Munich', isStarter: true, isKeyPlayer: true, attributes: { attack: 88, defense: 35, speed: 86, stamina: 78, skill: 92, shooting: 82, passing: 84, goalkeeping: 5 } },
      { id: 'ger-cm-wirtz', name: '维尔茨', nameEn: 'Florian Wirtz', number: 7, position: 'CM', club: 'Liverpool', isStarter: true, isKeyPlayer: true, attributes: { attack: 86, defense: 40, speed: 80, stamina: 76, skill: 90, shooting: 80, passing: 88, goalkeeping: 8 } },
      { id: 'ger-cdm-kimmich', name: '基米希', nameEn: 'Joshua Kimmich', number: 6, position: 'CDM', club: 'Bayern Munich', isStarter: true, isKeyPlayer: true, attributes: { attack: 72, defense: 80, speed: 68, stamina: 86, skill: 80, shooting: 62, passing: 86, goalkeeping: 10 } },
      { id: 'ger-gk-neuer', name: '诺伊尔', nameEn: 'Manuel Neuer', number: 1, position: 'GK', club: 'Bayern Munich', isStarter: true, isKeyPlayer: true, attributes: { attack: 25, defense: 84, speed: 45, stamina: 72, skill: 58, shooting: 20, passing: 62, goalkeeping: 84 } },
      { id: 'ger-st-havertz', name: '哈弗茨', nameEn: 'Kai Havertz', number: 9, position: 'ST', club: 'Arsenal', isStarter: true, isKeyPlayer: false, attributes: { attack: 82, defense: 35, speed: 76, stamina: 78, skill: 84, shooting: 80, passing: 74, goalkeeping: 8 } },
      { id: 'ger-cb-rudiger', name: '吕迪格', nameEn: 'Antonio Rüdiger', number: 2, position: 'CB', club: 'Real Madrid', isStarter: true, isKeyPlayer: false, attributes: { attack: 50, defense: 88, speed: 80, stamina: 82, skill: 62, shooting: 48, passing: 65, goalkeeping: 10 } },
    ]
  },
  {
    id: 'curacao', name: '库拉索', nameEn: 'Curaçao', flag: '🇨🇼', countryCode: 'cw',
    confederation: 'CONCACAF', fifaRank: 85, group: 'E',
    players: [
      { id: 'cuw-st-locadia', name: '洛卡迪亚', nameEn: 'Jürgen Locadia', number: 9, position: 'ST', club: 'Inter Miami', isStarter: true, isKeyPlayer: true, attributes: { attack: 70, defense: 25, speed: 72, stamina: 66, skill: 68, shooting: 70, passing: 52, goalkeeping: 5 } },
    ]
  },
  {
    id: 'ivory-coast', name: '科特迪瓦', nameEn: 'Ivory Coast', flag: '🇨🇮', countryCode: 'ci',
    confederation: 'CAF', fifaRank: 30, group: 'E',
    players: [
      { id: 'civ-cm-kessie', name: '凯西', nameEn: 'Franck Kessié', number: 8, position: 'CM', club: 'Al Ahli', isStarter: true, isKeyPlayer: true, attributes: { attack: 72, defense: 75, speed: 72, stamina: 86, skill: 74, shooting: 68, passing: 72, goalkeeping: 8 } },
      { id: 'civ-rw-diallo', name: '迪亚洛', nameEn: 'Amad Diallo', number: 11, position: 'RW', club: 'Man United', isStarter: true, isKeyPlayer: true, attributes: { attack: 80, defense: 32, speed: 85, stamina: 74, skill: 84, shooting: 72, passing: 74, goalkeeping: 5 } },
      { id: 'civ-cb-ndicka', name: '恩迪卡', nameEn: 'Evan Ndicka', number: 5, position: 'CB', club: 'Roma', isStarter: true, isKeyPlayer: false, attributes: { attack: 48, defense: 82, speed: 74, stamina: 76, skill: 58, shooting: 42, passing: 58, goalkeeping: 10 } },
    ]
  },
  {
    id: 'ecuador', name: '厄瓜多尔', nameEn: 'Ecuador', flag: '🇪🇨', countryCode: 'ec',
    confederation: 'CONMEBOL', fifaRank: 20, group: 'E',
    players: [
      { id: 'ecu-cdm-caicedo', name: '凯塞多', nameEn: 'Moisés Caicedo', number: 23, position: 'CDM', club: 'Chelsea', isStarter: true, isKeyPlayer: true, attributes: { attack: 68, defense: 82, speed: 74, stamina: 86, skill: 76, shooting: 60, passing: 74, goalkeeping: 10 } },
      { id: 'ecu-cb-hincapie', name: '因卡皮耶', nameEn: 'Piero Hincapié', number: 3, position: 'CB', club: 'Bayer Leverkusen', isStarter: true, isKeyPlayer: true, attributes: { attack: 52, defense: 84, speed: 76, stamina: 78, skill: 64, shooting: 45, passing: 64, goalkeeping: 10 } },
      { id: 'ecu-cam-paez', name: '派斯', nameEn: 'Kendry Páez', number: 10, position: 'CAM', club: 'Chelsea', isStarter: true, isKeyPlayer: true, attributes: { attack: 74, defense: 30, speed: 78, stamina: 68, skill: 82, shooting: 66, passing: 74, goalkeeping: 5 } },
    ]
  },

  // ==================== GROUP F ====================
  {
    id: 'netherlands', name: '荷兰', nameEn: 'Netherlands', flag: '🇳🇱', countryCode: 'nl',
    confederation: 'UEFA', fifaRank: 7, group: 'F',
    players: [
      { id: 'ned-cb-van-dijk', name: '范迪克', nameEn: 'Virgil van Dijk', number: 4, position: 'CB', club: 'Liverpool', isStarter: true, isKeyPlayer: true, attributes: { attack: 55, defense: 92, speed: 72, stamina: 84, skill: 68, shooting: 52, passing: 72, goalkeeping: 10 } },
      { id: 'ned-cm-de-jong', name: '德容', nameEn: 'Frenkie de Jong', number: 21, position: 'CM', club: 'Barcelona', isStarter: true, isKeyPlayer: true, attributes: { attack: 74, defense: 68, speed: 76, stamina: 78, skill: 88, shooting: 62, passing: 88, goalkeeping: 8 } },
      { id: 'ned-lw-gakpo', name: '加克波', nameEn: 'Cody Gakpo', number: 8, position: 'LW', club: 'Liverpool', isStarter: true, isKeyPlayer: true, attributes: { attack: 84, defense: 32, speed: 82, stamina: 80, skill: 82, shooting: 84, passing: 74, goalkeeping: 5 } },
      { id: 'ned-st-depay', name: '德佩', nameEn: 'Memphis Depay', number: 10, position: 'ST', club: 'Atlético Madrid', isStarter: true, isKeyPlayer: false, attributes: { attack: 82, defense: 25, speed: 78, stamina: 72, skill: 82, shooting: 80, passing: 72, goalkeeping: 5 } },
    ]
  },
  {
    id: 'japan', name: '日本', nameEn: 'Japan', flag: '🇯🇵', countryCode: 'jp',
    confederation: 'AFC', fifaRank: 15, group: 'F',
    players: [
      { id: 'jpn-rw-kubo', name: '久保建英', nameEn: 'Takefusa Kubo', number: 10, position: 'RW', club: 'Real Sociedad', isStarter: true, isKeyPlayer: true, attributes: { attack: 82, defense: 32, speed: 84, stamina: 72, skill: 88, shooting: 74, passing: 80, goalkeeping: 5 } },
      { id: 'jpn-cdm-endo', name: '远藤航', nameEn: 'Wataru Endo', number: 6, position: 'CDM', club: 'Liverpool', isStarter: true, isKeyPlayer: true, attributes: { attack: 62, defense: 80, speed: 66, stamina: 86, skill: 68, shooting: 55, passing: 70, goalkeeping: 10 } },
      { id: 'jpn-cb-tomiyasu', name: '富安健洋', nameEn: 'Takehiro Tomiyasu', number: 3, position: 'CB', club: 'Ajax', isStarter: true, isKeyPlayer: false, attributes: { attack: 52, defense: 82, speed: 72, stamina: 74, skill: 62, shooting: 45, passing: 65, goalkeeping: 10 } },
      { id: 'jpn-cb-ito', name: '伊藤洋辉', nameEn: 'Hiroki Ito', number: 4, position: 'CB', club: 'Bayern Munich', isStarter: true, isKeyPlayer: false, attributes: { attack: 48, defense: 80, speed: 72, stamina: 76, skill: 62, shooting: 45, passing: 64, goalkeeping: 10 } },
    ]
  },
  {
    id: 'sweden', name: '瑞典', nameEn: 'Sweden', flag: '🇸🇪', countryCode: 'se',
    confederation: 'UEFA', fifaRank: 25, group: 'F',
    players: [
      { id: 'swe-st-gyokeres', name: '约克雷斯', nameEn: 'Viktor Gyökeres', number: 9, position: 'ST', club: 'Arsenal', isStarter: true, isKeyPlayer: true, attributes: { attack: 88, defense: 30, speed: 84, stamina: 84, skill: 82, shooting: 88, passing: 66, goalkeeping: 8 } },
      { id: 'swe-st-isak', name: '伊萨克', nameEn: 'Alexander Isak', number: 14, position: 'ST', club: 'Newcastle', isStarter: true, isKeyPlayer: true, attributes: { attack: 86, defense: 28, speed: 86, stamina: 80, skill: 84, shooting: 86, passing: 68, goalkeeping: 5 } },
      { id: 'swe-rw-elanga', name: '埃兰加', nameEn: 'Anthony Elanga', number: 11, position: 'RW', club: 'Nottingham Forest', isStarter: true, isKeyPlayer: false, attributes: { attack: 74, defense: 35, speed: 92, stamina: 78, skill: 74, shooting: 66, passing: 62, goalkeeping: 5 } },
    ]
  },
  {
    id: 'tunisia', name: '突尼斯', nameEn: 'Tunisia', flag: '🇹🇳', countryCode: 'tn',
    confederation: 'CAF', fifaRank: 35, group: 'F',
    players: [
      { id: 'tun-cm-mejbri', name: '梅杰布里', nameEn: 'Hannibal Mejbri', number: 10, position: 'CM', club: 'Burnley', isStarter: true, isKeyPlayer: true, attributes: { attack: 68, defense: 58, speed: 74, stamina: 76, skill: 74, shooting: 62, passing: 70, goalkeeping: 8 } },
      { id: 'tun-cdm-skhiri', name: '斯基里', nameEn: 'Ellyes Skhiri', number: 6, position: 'CDM', club: 'Frankfurt', isStarter: true, isKeyPlayer: true, attributes: { attack: 60, defense: 76, speed: 66, stamina: 82, skill: 66, shooting: 55, passing: 68, goalkeeping: 10 } },
    ]
  },

  // ==================== GROUP G ====================
  {
    id: 'belgium', name: '比利时', nameEn: 'Belgium', flag: '🇧🇪', countryCode: 'be',
    confederation: 'UEFA', fifaRank: 9, group: 'G',
    players: [
      { id: 'bel-cm-de-bruyne', name: '德布劳内', nameEn: 'Kevin De Bruyne', number: 7, position: 'CM', club: 'Napoli', isStarter: true, isKeyPlayer: true, attributes: { attack: 88, defense: 50, speed: 70, stamina: 78, skill: 92, shooting: 86, passing: 96, goalkeeping: 8 } },
      { id: 'bel-gk-courtois', name: '库尔图瓦', nameEn: 'Thibaut Courtois', number: 1, position: 'GK', club: 'Real Madrid', isStarter: true, isKeyPlayer: true, attributes: { attack: 20, defense: 88, speed: 48, stamina: 80, skill: 60, shooting: 18, passing: 48, goalkeeping: 92 } },
      { id: 'bel-st-lukaku', name: '卢卡库', nameEn: 'Romelu Lukaku', number: 9, position: 'ST', club: 'Napoli', isStarter: true, isKeyPlayer: true, attributes: { attack: 86, defense: 30, speed: 74, stamina: 78, skill: 76, shooting: 86, passing: 62, goalkeeping: 8 } },
      { id: 'bel-lw-doku', name: '多库', nameEn: 'Jérémy Doku', number: 11, position: 'LW', club: 'Man City', isStarter: true, isKeyPlayer: false, attributes: { attack: 80, defense: 28, speed: 92, stamina: 72, skill: 86, shooting: 68, passing: 66, goalkeeping: 5 } },
    ]
  },
  {
    id: 'egypt', name: '埃及', nameEn: 'Egypt', flag: '🇪🇬', countryCode: 'eg',
    confederation: 'CAF', fifaRank: 30, group: 'G',
    players: [
      { id: 'egy-rw-salah', name: '萨拉赫', nameEn: 'Mohamed Salah', number: 10, position: 'RW', club: 'Al-Ittihad', isStarter: true, isKeyPlayer: true, attributes: { attack: 92, defense: 30, speed: 88, stamina: 82, skill: 88, shooting: 92, passing: 80, goalkeeping: 5 } },
      { id: 'egy-st-marmoush', name: '马尔穆什', nameEn: 'Omar Marmoush', number: 7, position: 'ST', club: 'Man City', isStarter: true, isKeyPlayer: true, attributes: { attack: 84, defense: 25, speed: 86, stamina: 78, skill: 84, shooting: 84, passing: 72, goalkeeping: 5 } },
    ]
  },
  {
    id: 'iran', name: '伊朗', nameEn: 'Iran', flag: '🇮🇷', countryCode: 'ir',
    confederation: 'AFC', fifaRank: 22, group: 'G',
    players: [
      { id: 'irn-st-taremi', name: '塔雷米', nameEn: 'Mehdi Taremi', number: 9, position: 'ST', club: 'Olympiacos', isStarter: true, isKeyPlayer: true, attributes: { attack: 82, defense: 30, speed: 72, stamina: 74, skill: 78, shooting: 84, passing: 68, goalkeeping: 8 } },
      { id: 'irn-rw-jahanbakhsh', name: '贾汉巴赫什', nameEn: 'Alireza Jahanbakhsh', number: 7, position: 'RW', club: 'Feyenoord', isStarter: true, isKeyPlayer: false, attributes: { attack: 72, defense: 35, speed: 76, stamina: 72, skill: 74, shooting: 68, passing: 66, goalkeeping: 5 } },
    ]
  },
  {
    id: 'new-zealand', name: '新西兰', nameEn: 'New Zealand', flag: '🇳🇿', countryCode: 'nz',
    confederation: 'OFC', fifaRank: 90, group: 'G',
    players: [
      { id: 'nzl-st-wood', name: '伍德', nameEn: 'Chris Wood', number: 9, position: 'ST', club: 'Nottingham Forest', isStarter: true, isKeyPlayer: true, attributes: { attack: 76, defense: 28, speed: 58, stamina: 70, skill: 66, shooting: 78, passing: 55, goalkeeping: 8 } },
    ]
  },

  // ==================== GROUP H ====================
  {
    id: 'spain', name: '西班牙', nameEn: 'Spain', flag: '🇪🇸', countryCode: 'es',
    confederation: 'UEFA', fifaRank: 2, group: 'H',
    players: [
      { id: 'esp-rw-yamal', name: '亚马尔', nameEn: 'Lamine Yamal', number: 19, position: 'RW', club: 'Barcelona', isStarter: true, isKeyPlayer: true, attributes: { attack: 88, defense: 28, speed: 90, stamina: 74, skill: 94, shooting: 82, passing: 84, goalkeeping: 5 } },
      { id: 'esp-lw-williams', name: '威廉姆斯', nameEn: 'Nico Williams', number: 11, position: 'LW', club: 'Athletic Bilbao', isStarter: true, isKeyPlayer: true, attributes: { attack: 84, defense: 32, speed: 94, stamina: 78, skill: 86, shooting: 76, passing: 74, goalkeeping: 5 } },
      { id: 'esp-cm-pedri', name: '佩德里', nameEn: 'Pedri', number: 8, position: 'CM', club: 'Barcelona', isStarter: true, isKeyPlayer: true, attributes: { attack: 78, defense: 55, speed: 74, stamina: 78, skill: 90, shooting: 68, passing: 90, goalkeeping: 8 } },
      { id: 'esp-cdm-rodri', name: '罗德里', nameEn: 'Rodri', number: 16, position: 'CDM', club: 'Man City', isStarter: true, isKeyPlayer: true, attributes: { attack: 72, defense: 86, speed: 62, stamina: 82, skill: 82, shooting: 72, passing: 86, goalkeeping: 10 } },
      { id: 'esp-cb-cubarsi', name: '库巴西', nameEn: 'Pau Cubarsí', number: 4, position: 'CB', club: 'Barcelona', isStarter: true, isKeyPlayer: false, attributes: { attack: 48, defense: 82, speed: 70, stamina: 74, skill: 66, shooting: 42, passing: 70, goalkeeping: 10 } },
    ]
  },
  {
    id: 'cape-verde', name: '佛得角', nameEn: 'Cape Verde', flag: '🇨🇻', countryCode: 'cv',
    confederation: 'CAF', fifaRank: 75, group: 'H',
    players: [
      { id: 'cpv-lw-mendes', name: '门德斯', nameEn: 'Ryan Mendes', number: 7, position: 'LW', club: 'Al-Nasr', isStarter: true, isKeyPlayer: true, attributes: { attack: 66, defense: 30, speed: 76, stamina: 68, skill: 68, shooting: 62, passing: 58, goalkeeping: 5 } },
    ]
  },
  {
    id: 'saudi-arabia', name: '沙特阿拉伯', nameEn: 'Saudi Arabia', flag: '🇸🇦', countryCode: 'sa',
    confederation: 'AFC', fifaRank: 55, group: 'H',
    players: [
      { id: 'ksa-lw-al-dawsari', name: '达瓦萨里', nameEn: 'Salem Al-Dawsari', number: 10, position: 'LW', club: 'Al-Hilal', isStarter: true, isKeyPlayer: true, attributes: { attack: 74, defense: 28, speed: 76, stamina: 72, skill: 74, shooting: 72, passing: 66, goalkeeping: 5 } },
    ]
  },
  {
    id: 'uruguay', name: '乌拉圭', nameEn: 'Uruguay', flag: '🇺🇾', countryCode: 'uy',
    confederation: 'CONMEBOL', fifaRank: 14, group: 'H',
    players: [
      { id: 'uru-cm-valverde', name: '巴尔韦德', nameEn: 'Federico Valverde', number: 15, position: 'CM', club: 'Real Madrid', isStarter: true, isKeyPlayer: true, attributes: { attack: 80, defense: 72, speed: 82, stamina: 90, skill: 84, shooting: 82, passing: 84, goalkeeping: 8 } },
      { id: 'uru-st-nunez', name: '努涅斯', nameEn: 'Darwin Núñez', number: 9, position: 'ST', club: 'Liverpool', isStarter: true, isKeyPlayer: true, attributes: { attack: 84, defense: 25, speed: 88, stamina: 80, skill: 76, shooting: 82, passing: 58, goalkeeping: 8 } },
      { id: 'uru-cb-araujo', name: '阿劳霍', nameEn: 'Ronald Araújo', number: 4, position: 'CB', club: 'Barcelona', isStarter: true, isKeyPlayer: true, attributes: { attack: 50, defense: 88, speed: 80, stamina: 82, skill: 62, shooting: 48, passing: 64, goalkeeping: 10 } },
      { id: 'uru-cdm-ugarte', name: '乌加特', nameEn: 'Manuel Ugarte', number: 5, position: 'CDM', club: 'Man United', isStarter: true, isKeyPlayer: false, attributes: { attack: 55, defense: 82, speed: 68, stamina: 84, skill: 66, shooting: 48, passing: 66, goalkeeping: 10 } },
    ]
  },

  // ==================== GROUP I ====================
  {
    id: 'france', name: '法国', nameEn: 'France', flag: '🇫🇷', countryCode: 'fr',
    confederation: 'UEFA', fifaRank: 1, group: 'I',
    players: [
      { id: 'fra-st-mbappe', name: '姆巴佩', nameEn: 'Kylian Mbappé', number: 10, position: 'ST', club: 'Real Madrid', isStarter: true, isKeyPlayer: true, attributes: { attack: 96, defense: 22, speed: 96, stamina: 84, skill: 92, shooting: 94, passing: 80, goalkeeping: 5 } },
      { id: 'fra-rw-dembele', name: '登贝莱', nameEn: 'Ousmane Dembélé', number: 11, position: 'RW', club: 'PSG', isStarter: true, isKeyPlayer: true, attributes: { attack: 86, defense: 28, speed: 92, stamina: 74, skill: 90, shooting: 78, passing: 80, goalkeeping: 5 } },
      { id: 'fra-cb-saliba', name: '萨利巴', nameEn: 'William Saliba', number: 17, position: 'CB', club: 'Arsenal', isStarter: true, isKeyPlayer: true, attributes: { attack: 48, defense: 90, speed: 78, stamina: 82, skill: 65, shooting: 42, passing: 64, goalkeeping: 10 } },
      { id: 'fra-cdm-kante', name: '坎特', nameEn: "N'Golo Kanté", number: 13, position: 'CDM', club: 'Al-Ittihad', isStarter: true, isKeyPlayer: true, attributes: { attack: 62, defense: 86, speed: 72, stamina: 92, skill: 72, shooting: 52, passing: 70, goalkeeping: 10 } },
      { id: 'fra-cam-olise', name: '奥利塞', nameEn: 'Michael Olise', number: 7, position: 'CAM', club: 'Bayern Munich', isStarter: false, isKeyPlayer: true, attributes: { attack: 84, defense: 35, speed: 82, stamina: 74, skill: 88, shooting: 78, passing: 86, goalkeeping: 5 } },
    ]
  },
  {
    id: 'senegal', name: '塞内加尔', nameEn: 'Senegal', flag: '🇸🇳', countryCode: 'sn',
    confederation: 'CAF', fifaRank: 15, group: 'I',
    players: [
      { id: 'sen-lw-mane', name: '马内', nameEn: 'Sadio Mané', number: 10, position: 'LW', club: 'Al Nassr', isStarter: true, isKeyPlayer: true, attributes: { attack: 86, defense: 35, speed: 84, stamina: 78, skill: 86, shooting: 84, passing: 74, goalkeeping: 5 } },
      { id: 'sen-cb-koulibaly', name: '库利巴利', nameEn: 'Kalidou Koulibaly', number: 3, position: 'CB', club: 'Al-Hilal', isStarter: true, isKeyPlayer: true, attributes: { attack: 48, defense: 86, speed: 66, stamina: 76, skill: 58, shooting: 45, passing: 60, goalkeeping: 10 } },
      { id: 'sen-st-jackson', name: '杰克逊', nameEn: 'Nicolas Jackson', number: 9, position: 'ST', club: 'Chelsea', isStarter: true, isKeyPlayer: true, attributes: { attack: 84, defense: 25, speed: 86, stamina: 78, skill: 80, shooting: 82, passing: 62, goalkeeping: 8 } },
    ]
  },
  {
    id: 'iraq', name: '伊拉克', nameEn: 'Iraq', flag: '🇮🇶', countryCode: 'iq',
    confederation: 'AFC', fifaRank: 70, group: 'I',
    players: [
      { id: 'irq-st-hussein', name: '侯赛因', nameEn: 'Aymen Hussein', number: 9, position: 'ST', club: 'Al-Quwa Al-Jawiya', isStarter: true, isKeyPlayer: true, attributes: { attack: 70, defense: 25, speed: 68, stamina: 66, skill: 62, shooting: 72, passing: 50, goalkeeping: 5 } },
    ]
  },
  {
    id: 'norway', name: '挪威', nameEn: 'Norway', flag: '🇳🇴', countryCode: 'no',
    confederation: 'UEFA', fifaRank: 12, group: 'I',
    players: [
      { id: 'nor-st-haaland', name: '哈兰德', nameEn: 'Erling Haaland', number: 9, position: 'ST', club: 'Man City', isStarter: true, isKeyPlayer: true, attributes: { attack: 94, defense: 25, speed: 90, stamina: 86, skill: 82, shooting: 96, passing: 64, goalkeeping: 5 } },
      { id: 'nor-cm-odegaard', name: '厄德高', nameEn: 'Martin Ødegaard', number: 10, position: 'CM', club: 'Arsenal', isStarter: true, isKeyPlayer: true, attributes: { attack: 82, defense: 48, speed: 72, stamina: 78, skill: 90, shooting: 74, passing: 92, goalkeeping: 8 } },
      { id: 'nor-st-sorloth', name: '索尔洛特', nameEn: 'Alexander Sørloth', number: 19, position: 'ST', club: 'Atlético Madrid', isStarter: false, isKeyPlayer: false, attributes: { attack: 80, defense: 28, speed: 72, stamina: 78, skill: 74, shooting: 84, passing: 60, goalkeeping: 5 } },
    ]
  },

  // ==================== GROUP J ====================
  {
    id: 'argentina', name: '阿根廷', nameEn: 'Argentina', flag: '🇦🇷', countryCode: 'ar',
    confederation: 'CONMEBOL', fifaRank: 3, group: 'J',
    players: [
      { id: 'arg-cf-messi', name: '梅西', nameEn: 'Lionel Messi', number: 10, position: 'CF', club: 'Inter Miami', isStarter: true, isKeyPlayer: true, attributes: { attack: 94, defense: 20, speed: 64, stamina: 62, skill: 98, shooting: 94, passing: 94, goalkeeping: 5 } },
      { id: 'arg-st-martinez', name: '劳塔罗', nameEn: 'Lautaro Martínez', number: 9, position: 'ST', club: 'Inter Milan', isStarter: true, isKeyPlayer: true, attributes: { attack: 90, defense: 30, speed: 78, stamina: 80, skill: 84, shooting: 90, passing: 68, goalkeeping: 5 } },
      { id: 'arg-st-alvarez', name: '阿尔瓦雷斯', nameEn: 'Julián Álvarez', number: 11, position: 'ST', club: 'Atlético Madrid', isStarter: true, isKeyPlayer: true, attributes: { attack: 86, defense: 38, speed: 82, stamina: 84, skill: 84, shooting: 86, passing: 70, goalkeeping: 8 } },
      { id: 'arg-gk-martinez', name: '马丁内斯', nameEn: 'Emiliano Martínez', number: 23, position: 'GK', club: 'Aston Villa', isStarter: true, isKeyPlayer: true, attributes: { attack: 22, defense: 84, speed: 45, stamina: 78, skill: 58, shooting: 20, passing: 48, goalkeeping: 90 } },
      { id: 'arg-cm-fernandez', name: '恩佐', nameEn: 'Enzo Fernández', number: 8, position: 'CM', club: 'Chelsea', isStarter: true, isKeyPlayer: false, attributes: { attack: 74, defense: 65, speed: 68, stamina: 80, skill: 82, shooting: 68, passing: 84, goalkeeping: 8 } },
      { id: 'arg-cb-romero', name: '罗梅罗', nameEn: 'Cristian Romero', number: 13, position: 'CB', club: 'Tottenham', isStarter: true, isKeyPlayer: false, attributes: { attack: 52, defense: 86, speed: 72, stamina: 80, skill: 62, shooting: 48, passing: 64, goalkeeping: 10 } },
    ]
  },
  {
    id: 'algeria', name: '阿尔及利亚', nameEn: 'Algeria', flag: '🇩🇿', countryCode: 'dz',
    confederation: 'CAF', fifaRank: 35, group: 'J',
    players: [
      { id: 'alg-rw-mahrez', name: '马赫雷斯', nameEn: 'Riyad Mahrez', number: 7, position: 'RW', club: 'Al Ahli', isStarter: true, isKeyPlayer: true, attributes: { attack: 84, defense: 30, speed: 78, stamina: 72, skill: 90, shooting: 80, passing: 82, goalkeeping: 5 } },
      { id: 'alg-lb-ait-nouri', name: '艾特-努里', nameEn: 'Rayan Aït-Nouri', number: 3, position: 'LB', club: 'Man City', isStarter: true, isKeyPlayer: true, attributes: { attack: 72, defense: 72, speed: 84, stamina: 78, skill: 76, shooting: 55, passing: 70, goalkeeping: 8 } },
      { id: 'alg-st-gouiri', name: '戈伊里', nameEn: 'Amine Gouiri', number: 9, position: 'ST', club: 'Marseille', isStarter: true, isKeyPlayer: false, attributes: { attack: 78, defense: 25, speed: 76, stamina: 72, skill: 78, shooting: 76, passing: 64, goalkeeping: 8 } },
    ]
  },
  {
    id: 'austria', name: '奥地利', nameEn: 'Austria', flag: '🇦🇹', countryCode: 'at',
    confederation: 'UEFA', fifaRank: 23, group: 'J',
    players: [
      { id: 'aut-cb-alaba', name: '阿拉巴', nameEn: 'David Alaba', number: 8, position: 'CB', club: 'Real Madrid', isStarter: true, isKeyPlayer: true, attributes: { attack: 62, defense: 82, speed: 76, stamina: 78, skill: 74, shooting: 62, passing: 76, goalkeeping: 10 } },
      { id: 'aut-cm-sabitzer', name: '萨比策', nameEn: 'Marcel Sabitzer', number: 9, position: 'CM', club: 'Dortmund', isStarter: true, isKeyPlayer: true, attributes: { attack: 74, defense: 58, speed: 74, stamina: 80, skill: 78, shooting: 74, passing: 74, goalkeeping: 8 } },
    ]
  },
  {
    id: 'jordan', name: '约旦', nameEn: 'Jordan', flag: '🇯🇴', countryCode: 'jo',
    confederation: 'AFC', fifaRank: 80, group: 'J',
    players: [
      { id: 'jor-rw-al-tamari', name: '塔马里', nameEn: 'Mousa Al-Tamari', number: 10, position: 'RW', club: 'Rennes', isStarter: true, isKeyPlayer: true, attributes: { attack: 72, defense: 28, speed: 80, stamina: 70, skill: 72, shooting: 66, passing: 62, goalkeeping: 5 } },
    ]
  },

  // ==================== GROUP K ====================
  {
    id: 'portugal', name: '葡萄牙', nameEn: 'Portugal', flag: '🇵🇹', countryCode: 'pt',
    confederation: 'UEFA', fifaRank: 5, group: 'K',
    players: [
      { id: 'por-st-ronaldo', name: 'C罗', nameEn: 'Cristiano Ronaldo', number: 7, position: 'ST', club: 'Al Nassr', isStarter: true, isKeyPlayer: true, attributes: { attack: 90, defense: 25, speed: 68, stamina: 62, skill: 86, shooting: 94, passing: 72, goalkeeping: 5 } },
      { id: 'por-cm-fernandes', name: 'B费', nameEn: 'Bruno Fernandes', number: 8, position: 'CM', club: 'Man United', isStarter: true, isKeyPlayer: true, attributes: { attack: 86, defense: 52, speed: 72, stamina: 84, skill: 86, shooting: 84, passing: 90, goalkeeping: 8 } },
      { id: 'por-cm-silva', name: 'B席', nameEn: 'Bernardo Silva', number: 10, position: 'CM', club: 'Man City', isStarter: true, isKeyPlayer: true, attributes: { attack: 82, defense: 48, speed: 76, stamina: 80, skill: 90, shooting: 74, passing: 86, goalkeeping: 8 } },
      { id: 'por-lw-leao', name: '莱奥', nameEn: 'Rafael Leão', number: 11, position: 'LW', club: 'AC Milan', isStarter: true, isKeyPlayer: true, attributes: { attack: 86, defense: 28, speed: 94, stamina: 76, skill: 88, shooting: 80, passing: 68, goalkeeping: 5 } },
      { id: 'por-cb-dias', name: '迪亚斯', nameEn: 'Rúben Dias', number: 4, position: 'CB', club: 'Man City', isStarter: true, isKeyPlayer: true, attributes: { attack: 48, defense: 90, speed: 66, stamina: 82, skill: 62, shooting: 45, passing: 64, goalkeeping: 10 } },
    ]
  },
  {
    id: 'dr-congo', name: '刚果（金）', nameEn: 'DR Congo', flag: '🇨🇩', countryCode: 'cd',
    confederation: 'CAF', fifaRank: 65, group: 'K',
    players: [
      { id: 'cod-st-bakambu', name: '巴坎布', nameEn: 'Cédric Bakambu', number: 9, position: 'ST', club: 'Real Betis', isStarter: true, isKeyPlayer: true, attributes: { attack: 74, defense: 25, speed: 74, stamina: 68, skill: 68, shooting: 74, passing: 55, goalkeeping: 5 } },
      { id: 'cod-lw-wissa', name: '维萨', nameEn: 'Yoane Wissa', number: 11, position: 'LW', club: 'Brentford', isStarter: true, isKeyPlayer: true, attributes: { attack: 76, defense: 30, speed: 82, stamina: 74, skill: 72, shooting: 72, passing: 60, goalkeeping: 5 } },
    ]
  },
  {
    id: 'uzbekistan', name: '乌兹别克斯坦', nameEn: 'Uzbekistan', flag: '🇺🇿', countryCode: 'uz',
    confederation: 'AFC', fifaRank: 60, group: 'K',
    players: [
      { id: 'uzb-cb-khusanov', name: '库萨诺夫', nameEn: 'Abdukodir Khusanov', number: 5, position: 'CB', club: 'Man City', isStarter: true, isKeyPlayer: true, attributes: { attack: 45, defense: 78, speed: 76, stamina: 74, skill: 58, shooting: 42, passing: 56, goalkeeping: 10 } },
    ]
  },
  {
    id: 'colombia', name: '哥伦比亚', nameEn: 'Colombia', flag: '🇨🇴', countryCode: 'co',
    confederation: 'CONMEBOL', fifaRank: 13, group: 'K',
    players: [
      { id: 'col-lw-diaz', name: '迪亚斯', nameEn: 'Luis Díaz', number: 7, position: 'LW', club: 'Bayern Munich', isStarter: true, isKeyPlayer: true, attributes: { attack: 86, defense: 35, speed: 90, stamina: 84, skill: 86, shooting: 80, passing: 70, goalkeeping: 5 } },
      { id: 'col-st-duran', name: '杜兰', nameEn: 'Jhon Durán', number: 9, position: 'ST', club: 'Aston Villa', isStarter: true, isKeyPlayer: true, attributes: { attack: 82, defense: 25, speed: 84, stamina: 74, skill: 76, shooting: 84, passing: 58, goalkeeping: 5 } },
    ]
  },

  // ==================== GROUP L ====================
  {
    id: 'england', name: '英格兰', nameEn: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', countryCode: 'gb-eng',
    confederation: 'UEFA', fifaRank: 4, group: 'L',
    players: [
      { id: 'eng-st-kane', name: '凯恩', nameEn: 'Harry Kane', number: 9, position: 'ST', club: 'Bayern Munich', isStarter: true, isKeyPlayer: true, attributes: { attack: 94, defense: 30, speed: 66, stamina: 78, skill: 84, shooting: 96, passing: 78, goalkeeping: 5 } },
      { id: 'eng-cm-bellingham', name: '贝林厄姆', nameEn: 'Jude Bellingham', number: 10, position: 'CM', club: 'Real Madrid', isStarter: true, isKeyPlayer: true, attributes: { attack: 86, defense: 65, speed: 80, stamina: 86, skill: 88, shooting: 84, passing: 84, goalkeeping: 8 } },
      { id: 'eng-rw-saka', name: '萨卡', nameEn: 'Bukayo Saka', number: 7, position: 'RW', club: 'Arsenal', isStarter: true, isKeyPlayer: true, attributes: { attack: 86, defense: 45, speed: 84, stamina: 80, skill: 86, shooting: 82, passing: 80, goalkeeping: 5 } },
      { id: 'eng-cdm-rice', name: '赖斯', nameEn: 'Declan Rice', number: 4, position: 'CDM', club: 'Arsenal', isStarter: true, isKeyPlayer: true, attributes: { attack: 68, defense: 82, speed: 72, stamina: 86, skill: 72, shooting: 62, passing: 74, goalkeeping: 10 } },
    ]
  },
  {
    id: 'croatia', name: '克罗地亚', nameEn: 'Croatia', flag: '🇭🇷', countryCode: 'hr',
    confederation: 'UEFA', fifaRank: 11, group: 'L',
    players: [
      { id: 'cro-cm-modric', name: '莫德里奇', nameEn: 'Luka Modrić', number: 10, position: 'CM', club: 'Real Madrid', isStarter: true, isKeyPlayer: true, attributes: { attack: 78, defense: 55, speed: 52, stamina: 62, skill: 94, shooting: 76, passing: 94, goalkeeping: 8 } },
      { id: 'cro-cb-gvardiol', name: '格瓦迪奥尔', nameEn: 'Joško Gvardiol', number: 4, position: 'CB', club: 'Man City', isStarter: true, isKeyPlayer: true, attributes: { attack: 55, defense: 88, speed: 78, stamina: 82, skill: 72, shooting: 52, passing: 70, goalkeeping: 10 } },
      { id: 'cro-cm-kovacic', name: '科瓦契奇', nameEn: 'Mateo Kovačić', number: 8, position: 'CM', club: 'Man City', isStarter: true, isKeyPlayer: false, attributes: { attack: 72, defense: 62, speed: 76, stamina: 76, skill: 86, shooting: 65, passing: 82, goalkeeping: 8 } },
    ]
  },
  {
    id: 'ghana', name: '加纳', nameEn: 'Ghana', flag: '🇬🇭', countryCode: 'gh',
    confederation: 'CAF', fifaRank: 73, group: 'L',
    players: [
      { id: 'gha-rw-williams', name: '威廉姆斯', nameEn: 'Iñaki Williams', number: 9, position: 'RW', club: 'Athletic Bilbao', isStarter: true, isKeyPlayer: true, attributes: { attack: 76, defense: 32, speed: 92, stamina: 82, skill: 74, shooting: 72, passing: 62, goalkeeping: 5 } },
      { id: 'gha-cm-kudus', name: '库杜斯', nameEn: 'Mohammed Kudus', number: 10, position: 'CAM', club: 'West Ham', isStarter: true, isKeyPlayer: true, attributes: { attack: 80, defense: 35, speed: 84, stamina: 78, skill: 82, shooting: 76, passing: 72, goalkeeping: 8 } },
      { id: 'gha-cdm-partey', name: '帕尔特伊', nameEn: 'Thomas Partey', number: 5, position: 'CDM', club: 'Arsenal', isStarter: true, isKeyPlayer: false, attributes: { attack: 64, defense: 78, speed: 66, stamina: 78, skill: 72, shooting: 62, passing: 72, goalkeeping: 10 } },
    ]
  },
  {
    id: 'panama', name: '巴拿马', nameEn: 'Panama', flag: '🇵🇦', countryCode: 'pa',
    confederation: 'CONCACAF', fifaRank: 50, group: 'L',
    players: [
      { id: 'pan-cm-carrasquilla', name: '卡拉斯奎利亚', nameEn: 'Adalberto Carrasquilla', number: 10, position: 'CM', club: 'Houston Dynamo', isStarter: true, isKeyPlayer: true, attributes: { attack: 66, defense: 58, speed: 70, stamina: 74, skill: 72, shooting: 60, passing: 72, goalkeeping: 8 } },
    ]
  },
]

export default teamsPart2
