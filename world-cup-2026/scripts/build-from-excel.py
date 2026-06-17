#!/usr/bin/env python3
"""
从 2026世界杯球员名单.xlsx 生成完整 TypeScript 数据文件
球员属性基于 FM2026 体系，根据效力俱乐部匹配
"""
import openpyxl, json, random, re, os, sys

random.seed(42)

# ====== 位置映射: 中文分类 → 具体位置 (轮转分配) ======
POS_MAP = {
    '门将': ['GK'],
    '后卫': ['CB','CB','CB','LB','RB','CB','CB','LB','RB','CB','CB','LB','RB','CB','CB','RB','LB'],
    '中场': ['CM','CM','CDM','CAM','CM','CM','CAM','CDM','LM','RM','CM','CM','CDM','CAM','CM','CM','CAM'],
    '前锋': ['ST','ST','LW','RW','CF','ST','ST','LW','RW','ST','ST','LW','RW','ST','CF','LW','RW'],
}

# ====== 球队中文名 → ID 映射 ======
TEAM_MAP = {
    '墨西哥': 'mexico', '南非': 'south-africa', '韩国': 'south-korea', '捷克': 'czech-republic',
    '加拿大': 'canada', '波黑': 'bosnia', '卡塔尔': 'qatar', '瑞士': 'switzerland',
    '巴西': 'brazil', '摩洛哥': 'morocco', '海地': 'haiti', '苏格兰': 'scotland',
    '美国': 'united-states', '巴拉圭': 'paraguay', '澳大利亚': 'australia', '土耳其': 'turkey',
    '德国': 'germany', '库拉索': 'curacao', '科特迪瓦': 'ivory-coast', '厄瓜多尔': 'ecuador',
    '荷兰': 'netherlands', '日本': 'japan', '瑞典': 'sweden', '突尼斯': 'tunisia',
    '比利时': 'belgium', '埃及': 'egypt', '伊朗': 'iran', '新西兰': 'new-zealand',
    '西班牙': 'spain', '佛得角': 'cape-verde', '沙特阿拉伯': 'saudi-arabia', '乌拉圭': 'uruguay',
    '法国': 'france', '塞内加尔': 'senegal', '伊拉克': 'iraq', '挪威': 'norway',
    '阿根廷': 'argentina', '阿尔及利亚': 'algeria', '奥地利': 'austria', '约旦': 'jordan',
    '葡萄牙': 'portugal', '刚果(金)': 'dr-congo', '乌兹别克斯坦': 'uzbekistan', '哥伦比亚': 'colombia',
    '英格兰': 'england', '克罗地亚': 'croatia', '加纳': 'ghana', '巴拿马': 'panama',
}

# ====== 俱乐部 → 声望等级 (World Reputation 1-10) ======
CLUB_TIER = {}
# 顶级豪门 (Tier 1: WR 9-10)
for c in ['皇家马德里','巴塞罗那','曼城','拜仁慕尼黑','巴黎圣日耳曼','利物浦','阿森纳','切尔西','曼联','国际米兰','尤文图斯','AC米兰','那不勒斯']:
    CLUB_TIER[c] = 1
# 强队 (Tier 2: WR 7-8)
for c in ['马德里竞技','多特蒙德','RB莱比锡','勒沃库森','热刺','纽卡斯尔','阿斯顿维拉','布莱顿','罗马','拉齐奥','亚特兰大','本菲卡','波尔图','PSV埃因霍温','阿贾克斯','费耶诺德','马赛','摩纳哥','里昂','塞维利亚','皇家社会','毕尔巴鄂竞技','里斯本竞技']:
    CLUB_TIER[c] = 2
# 中上游 (Tier 3: WR 5-6)
for c in ['西汉姆联','埃弗顿','狼队','富勒姆','水晶宫','诺丁汉森林','布伦特福德','伯恩茅斯','皇家贝蒂斯','比利亚雷亚尔','瓦伦西亚','塞尔塔','法兰克福','斯图加特','门兴格拉德巴赫','沃尔夫斯堡','霍芬海姆','弗赖堡','美因茨','博洛尼亚','佛罗伦萨','都灵','热那亚','马洛卡','雷恩','里尔','朗斯','尼斯','埃因霍温','特温特','阿尔克马尔','圣彼得堡泽尼特','加拉塔萨雷','费内巴切','贝西克塔斯','凯尔特人','格拉斯哥流浪者','萨尔茨堡红牛','顿涅茨克矿工','布鲁日','安德莱赫特','亨克','奥林匹亚科斯','帕纳辛奈科斯','布拉格斯拉维亚']:
    CLUB_TIER[c] = 3
# 中游 (Tier 4: WR 3-4)
for c in ['利兹联','莱斯特城','南安普顿','伯恩利','谢菲尔德联','沃特福德','米德尔斯堡','桑德兰','斯托克城','加的夫城','西布朗','赫塔菲','西班牙人','巴拉多利德','格拉纳达','奥萨苏纳','科隆','柏林赫塔','不莱梅','汉堡','沙尔克04','奥格斯堡','乌迪内斯','萨索洛','恩波利','维罗纳','卡利亚里','帕尔马','布雷斯特','南特','蒙彼利埃','梅斯','兰斯','斯特拉斯堡','图卢兹','标准列日','巴塞尔','年轻人','哥本哈根','中日德兰','布隆德比','马尔默','AIK索尔纳','佐加顿斯','罗森博格','莫尔德','加拉茨钢铁','克卢日','贝尔格莱德红星','萨格勒布迪纳摩','布拉格斯巴达','莫斯科斯巴达克','莫斯科中央陆军','河床','博卡青年','福塔雷萨','阿尔希拉尔','吉达联合','利雅得胜利']:
    CLUB_TIER[c] = 4
# 低级别 (Tier 5-6) - 默认

def get_tier(club_name):
    if not club_name: return 5
    for c, t in CLUB_TIER.items():
        if c in club_name or club_name in c:
            return t
    # 检测联赛关键词
    for kw in ['英超','西甲','意甲','德甲','法甲','葡超','荷甲','巴甲','阿超']:
        if kw in club_name: return 4
    return 5

def ca_from_tier(tier, is_key=False):
    """根据声望等级计算 Current Ability (FM 1-200 → 转换为 1-99 属性)"""
    base = {1:82, 2:76, 3:70, 4:64, 5:58, 6:52}.get(tier, 52)
    bonus = 5 if is_key else 0
    return min(99, base + bonus + random.randint(-3, 5))

def generate_attrs(position, ca):
    """根据位置和CA生成FM风格属性 (1-99)"""
    b = ca
    r = lambda lo, hi: min(99, max(1, b + random.randint(lo, hi)))
    if position == 'GK':
        return {'attack':r(-55,-40),'defense':r(-2,5),'speed':r(-20,-8),'stamina':r(-12,-2),'skill':r(-15,-5),'shooting':r(-55,-40),'passing':r(-20,-5),'goalkeeping':r(0,8)}
    is_def = position in ['CB','LB','RB','CDM']
    is_mid = position in ['CM','CAM','LM','RM']
    is_fwd = position in ['ST','CF','LW','RW']
    is_wing = position in ['LW','RW','LM','RM']
    return {
        'attack': r(0,5) if is_fwd else (r(-5,3) if is_mid else r(-20,-8)),
        'defense': r(0,5) if is_def else (r(-5,3) if is_mid else r(-25,-10)),
        'speed': r(3,10) if is_wing else r(-5,5),
        'stamina': r(-5,5),
        'skill': r(0,6) if (is_mid or is_fwd) else r(-8,0),
        'shooting': r(0,5) if is_fwd else (r(-8,0) if is_mid else r(-25,-10)),
        'passing': r(0,5) if is_mid else r(-5,5),
        'goalkeeping': random.randint(5, 15),
    }

# ====== 读取 Excel ======
wb = openpyxl.load_workbook('/Users/chenhao/Documents/vibe code/2026世界杯球员名单.xlsx')
ws = wb.active

teams_data = {}  # team_id → { group, name, list of players }
pos_indices = {}  # team_id → { '后卫': idx, '中场': idx, '前锋': idx, '门将': idx }

for row in ws.iter_rows(min_row=2, values_only=True):
    group, team_cn, pos_cn, name_cn, club, note = row
    if not team_cn: continue

    team_id = TEAM_MAP.get(team_cn.strip())
    if not team_id:
        print(f'WARN: Unknown team: {team_cn}')
        continue

    if team_id not in teams_data:
        teams_data[team_id] = {'group': group, 'name': team_cn, 'players': []}
        pos_indices[team_id] = {'门将':0, '后卫':0, '中场':0, '前锋':0}

    # 分配具体位置
    pos_list = POS_MAP.get(pos_cn, ['CM'])
    idx = pos_indices[team_id][pos_cn] % len(pos_list)
    pos_indices[team_id][pos_cn] += 1
    position = pos_list[idx]

    # 计算CA
    tier = get_tier(club if club else '')
    is_key = (note and '核心' in str(note)) or (pos_indices[team_id][pos_cn] <= 3)
    ca = ca_from_tier(tier, is_key)
    attrs = generate_attrs(position, ca)

    teams_data[team_id]['players'].append({
        'name': name_cn.strip() if name_cn else '',
        'position': position,
        'club': club.strip() if club else '',
        'isKeyPlayer': is_key,
        'ca': ca,
        'attrs': attrs,
    })

print(f'Parsed {sum(len(v["players"]) for v in teams_data.values())} players across {len(teams_data)} teams')

# ====== 输出 TypeScript ======
random.seed(42)
ts = """/**
 * 48队×26人 完整球员数据库
 * 球员名单: 2026世界杯官方大名单
 * 属性数据: 基于 FM2026 体系 (俱乐部声望 + 位置匹配)
 */

import { TeamData } from '../types'

const teams: TeamData[] = [
"""

TEAM_IDS = {v:k for k,v in TEAM_MAP.items()}

for team_id in sorted(teams_data.keys()):
    td = teams_data[team_id]
    cn_name = TEAM_IDS.get(team_id, team_id)

    # 内置球队元数据
    team_meta = {
        'mexico':('mx','CONCACAF',14),'south-africa':('za','CAF',60),'south-korea':('kr','AFC',25),'czech-republic':('cz','UEFA',40),
        'canada':('ca','CONCACAF',30),'bosnia':('ba','UEFA',64),'qatar':('qa','AFC',56),'switzerland':('ch','UEFA',19),
        'brazil':('br','CONMEBOL',6),'morocco':('ma','CAF',8),'haiti':('ht','CONCACAF',83),'scotland':('gb-sct','UEFA',42),
        'united-states':('us','CONCACAF',16),'paraguay':('py','CONMEBOL',41),'australia':('au','AFC',27),'turkey':('tr','UEFA',25),
        'germany':('de','UEFA',10),'curacao':('cw','CONCACAF',85),'ivory-coast':('ci','CAF',30),'ecuador':('ec','CONMEBOL',20),
        'netherlands':('nl','UEFA',7),'japan':('jp','AFC',15),'sweden':('se','UEFA',25),'tunisia':('tn','CAF',35),
        'belgium':('be','UEFA',9),'egypt':('eg','CAF',30),'iran':('ir','AFC',22),'new-zealand':('nz','OFC',90),
        'spain':('es','UEFA',2),'cape-verde':('cv','CAF',75),'saudi-arabia':('sa','AFC',55),'uruguay':('uy','CONMEBOL',14),
        'france':('fr','UEFA',1),'senegal':('sn','CAF',15),'iraq':('iq','AFC',70),'norway':('no','UEFA',12),
        'argentina':('ar','CONMEBOL',3),'algeria':('dz','CAF',35),'austria':('at','UEFA',23),'jordan':('jo','AFC',80),
        'portugal':('pt','UEFA',5),'dr-congo':('cd','CAF',65),'uzbekistan':('uz','AFC',60),'colombia':('co','CONMEBOL',13),
        'england':('gb-eng','UEFA',4),'croatia':('hr','UEFA',11),'ghana':('gh','CAF',73),'panama':('pa','CONCACAF',50),
    }
    code, conf, rank = team_meta.get(team_id, ('??','UEFA',50))

    ts += f"""  {{
    id: '{team_id}',
    name: '{cn_name}',
    nameEn: '{cn_name}',
    flag: '',
    countryCode: '{code}',
    confederation: '{conf}',
    fifaRank: {rank},
    group: '{td['group'][0]}',
    players: [
"""

    for i, p in enumerate(td['players']):
        a = p['attrs']
        name_en = p['name']  # Will use Chinese name for both
        is_starter = 'true' if i < 11 else 'false'
        esc = lambda s: s.replace("'", "\\'").replace('\n', ' ')
        ts += f"      {{ id:'{team_id}-p{i+1}', name:'{esc(p['name'])}', nameEn:'{esc(p['name'])}', number:{i+1}, position:'{p['position']}', club:'{esc(p['club'])}', isStarter:{is_starter}, isKeyPlayer:{str(p['isKeyPlayer']).lower()}, attributes:{{attack:{a['attack']},defense:{a['defense']},speed:{a['speed']},stamina:{a['stamina']},skill:{a['skill']},shooting:{a['shooting']},passing:{a['passing']},goalkeeping:{a['goalkeeping']}}} }},\n"

    ts += f"""    ],
  }},
"""

ts += """]

export default teams
"""

output_path = '/Users/chenhao/Documents/vibe code/world-cup-2026/src/data/teams-complete.ts'
with open(output_path, 'w') as f:
    f.write(ts)

stats = [(tid, len(v['players'])) for tid, v in teams_data.items()]
print(f'Output: {output_path}')
print(f'Teams: {len(stats)}, Total players: {sum(s[1] for s in stats)}')
for tid, cnt in sorted(stats):
    tiers = [get_tier(p['club']) for p in teams_data[tid]['players']]
    avg_tier = sum(tiers)/len(tiers) if tiers else 0
    print(f'  {TEAM_IDS.get(tid,tid):10s}: {cnt:2d} players, avg tier={avg_tier:.1f}')
