// CHO的世界杯小站 - Static Data

const TEAMS = [
  // ===== GROUP A =====
  {id:"MEX",name:"Mexico",cn:"墨西哥",flag:"🇲🇽",grp:"A",seed:"host",rk:18,att:76,def:72,best:"8强(1970,1986)",apps:17,stars:["Giménez","Lozano","Ochoa"],conf:"CONCACAF",recent:"2024美洲杯小组赛",news:"东道主揭幕战压力巨大",inj:""},
  {id:"RSA",name:"South Africa",cn:"南非",flag:"🇿🇦",grp:"A",seed:"4",rk:57,att:66,def:65,best:"小组赛",apps:3,stars:["Tau","Foster","Mokoena"],conf:"CAF",recent:"2023非洲杯季军",news:"揭幕战对阵东道主",inj:""},
  {id:"KOR",name:"South Korea",cn:"韩国",flag:"🇰🇷",grp:"A",seed:"2",rk:22,att:76,def:74,best:"4强(2002)",apps:11,stars:["Son","Kim Min-jae","Lee Kang-in"],conf:"AFC",recent:"2023亚洲杯4强",news:"孙兴慜领衔，防守稳固",inj:""},
  {id:"CZE",name:"Czechia",cn:"捷克",flag:"🇨🇿",grp:"A",seed:"3",rk:30,att:72,def:71,best:"亚军(1962)",apps:9,stars:["Schick","Souček","Hložek"],conf:"UEFA",recent:"2024欧洲杯小组赛",news:"绍切克中场核心",inj:""},

  // ===== GROUP B =====
  {id:"CAN",name:"Canada",cn:"加拿大",flag:"🇨🇦",grp:"B",seed:"host",rk:28,att:72,def:68,best:"小组赛",apps:2,stars:["Davies","David","Buchanan"],conf:"CONCACAF",recent:"2024美洲杯4强",news:"戴维斯腿筋伤势需关注",inj:"Davies小腿伤疑"},
  {id:"BIH",name:"Bosnia & Herz.",cn:"波黑",flag:"🇧🇦",grp:"B",seed:"4",rk:55,att:68,def:65,best:"小组赛",apps:1,stars:["Džeko","Pjanić","Tahirović"],conf:"UEFA",recent:"附加赛淘汰意大利晋级",news:"历史性淘汰意大利晋级",inj:""},
  {id:"QAT",name:"Qatar",cn:"卡塔尔",flag:"🇶🇦",grp:"B",seed:"3",rk:42,att:68,def:66,best:"小组赛",apps:1,stars:["Afif","Ali","Al-Haydos"],conf:"AFC",recent:"2023亚洲杯冠军",news:"亚洲杯冠军渴望证明自己",inj:""},
  {id:"SUI",name:"Switzerland",cn:"瑞士",flag:"🇨🇭",grp:"B",seed:"1",rk:12,att:78,def:78,best:"8强(1954)",apps:12,stars:["Akanji","Xhaka","Embolo"],conf:"UEFA",recent:"2024欧洲杯8强",news:"实力均衡出线热门",inj:""},

  // ===== GROUP C =====
  {id:"BRA",name:"Brazil",cn:"巴西",flag:"🇧🇷",grp:"C",seed:"1",rk:3,att:91,def:84,best:"冠军(1958,62,70,94,2002)",apps:22,stars:["Vinícius Jr","Raphinha","Alisson"],conf:"CONMEBOL",recent:"安切洛蒂执教",news:"内马尔小腿伤疑，罗德里戈ACL报销",inj:"🔴 Rodrygo ACL报销; Neymar小腿伤疑"},
  {id:"MAR",name:"Morocco",cn:"摩洛哥",flag:"🇲🇦",grp:"C",seed:"2",rk:14,att:78,def:79,best:"4强(2022)",apps:6,stars:["Hakimi","Brahim Díaz","El Khannouss"],conf:"CAF",recent:"2023非洲杯16强",news:"后防核心阿格德缺阵",inj:"🔴 Aguerd pubalgia; Mazraoui肩伤; 🔴 Ez Abde膝伤"},
  {id:"HAI",name:"Haiti",cn:"海地",flag:"🇭🇹",grp:"C",seed:"4",rk:72,att:62,def:60,best:"小组赛",apps:1,stars:["Pierrot","Nazon","Lambese"],conf:"CONCACAF",recent:"首次晋级(除1974)",news:"世界杯新人",inj:""},
  {id:"SCO",name:"Scotland",cn:"苏格兰",flag:"🏴󠁧󠁢󠁳󠁣󠁴󠁿",grp:"C",seed:"3",rk:35,att:70,def:69,best:"小组赛",apps:8,stars:["Robertson","McGinn","McTominay"],conf:"UEFA",recent:"2024欧洲杯小组赛",news:"身体对抗强悍",inj:""},

  // ===== GROUP D =====
  {id:"USA",name:"United States",cn:"美国",flag:"🇺🇸",grp:"D",seed:"host",rk:13,att:76,def:74,best:"季军(1930)",apps:11,stars:["Pulisic","McKennie","Reyna"],conf:"CONCACAF",recent:"2024美洲杯小组赛",news:"东道主签运不错",inj:""},
  {id:"PAR",name:"Paraguay",cn:"巴拉圭",flag:"🇵🇾",grp:"D",seed:"4",rk:50,att:66,def:68,best:"8强(2010)",apps:8,stars:["Almirón","Enciso","Sosa"],conf:"CONMEBOL",recent:"2024美洲杯小组赛",news:"南美预选惊险晋级",inj:""},
  {id:"AUS",name:"Australia",cn:"澳大利亚",flag:"🇦🇺",grp:"D",seed:"3",rk:29,att:70,def:69,best:"16强(2006,2022)",apps:6,stars:["Souttar","Irankunda","Goodwin"],conf:"AFC",recent:"2023亚洲杯8强",news:"连续第6次参赛",inj:""},
  {id:"TUR",name:"Türkiye",cn:"土耳其",flag:"🇹🇷",grp:"D",seed:"2",rk:25,att:74,def:70,best:"季军(2002)",apps:3,stars:["Çalhanoğlu","Güler","Yıldız"],conf:"UEFA",recent:"2024欧洲杯8强",news:"年轻天才居勒尔值得关注",inj:""},

  // ===== GROUP E =====
  {id:"GER",name:"Germany",cn:"德国",flag:"🇩🇪",grp:"E",seed:"1",rk:5,att:86,def:82,best:"冠军(1954,74,90,2014)",apps:20,stars:["Musiala","Wirtz","Kimmich"],conf:"UEFA",recent:"2024欧洲杯8强",news:"东道主之一，格纳布里伤缺",inj:"🔴 Gnabry adductor"},
  {id:"CUW",name:"Curaçao",cn:"库拉索",flag:"🇨🇼",grp:"E",seed:"4",rk:85,att:60,def:58,best:"首次参赛",apps:0,stars:["Bacuna","Janga","Kastaneer"],conf:"CONCACAF",recent:"历史首次晋级",news:"世界杯新军",inj:""},
  {id:"CIV",name:"Ivory Coast",cn:"科特迪瓦",flag:"🇨🇮",grp:"E",seed:"3",rk:40,att:74,def:70,best:"小组赛",apps:3,stars:["Haller","Adingra","Fofana"],conf:"CAF",recent:"2023非洲杯冠军",news:"非洲杯冠军势头正盛",inj:""},
  {id:"ECU",name:"Ecuador",cn:"厄瓜多尔",flag:"🇪🇨",grp:"E",seed:"2",rk:24,att:72,def:73,best:"16强(2006)",apps:4,stars:["Caicedo","Estupiñán","Páez"],conf:"CONMEBOL",recent:"2024美洲杯8强",news:"凯塞多中场核心",inj:""},

  // ===== GROUP F =====
  {id:"NED",name:"Netherlands",cn:"荷兰",flag:"🇳🇱",grp:"F",seed:"1",rk:7,att:84,def:81,best:"亚军(1974,78,2010)",apps:11,stars:["van Dijk","Gakpo","de Jong"],conf:"UEFA",recent:"2024欧洲杯4强",news:"伤病潮严重！西蒙斯、廷贝尔、德利赫特均缺阵",inj:"🔴 Simons ACL; 🔴 Timber groin; 🔴 de Ligt back"},
  {id:"JPN",name:"Japan",cn:"日本",flag:"🇯🇵",grp:"F",seed:"2",rk:17,att:79,def:77,best:"16强(2002,10,22)",apps:7,stars:["Kubo","Ueda","Tomiyasu"],conf:"AFC",recent:"6连胜(含巴西、英格兰)",news:"三笘薰缺阵！但近期6连胜状态火热",inj:"🔴 Mitoma hamstring; 🔴 Endō foot"},
  {id:"SWE",name:"Sweden",cn:"瑞典",flag:"🇸🇪",grp:"F",seed:"3",rk:23,att:74,def:73,best:"亚军(1958)",apps:12,stars:["Isak","Kulusevski","Gyökeres"],conf:"UEFA",recent:"未晋级2024欧洲杯",news:"伊萨克+哲凯赖什双锋犀利",inj:""},
  {id:"TUN",name:"Tunisia",cn:"突尼斯",flag:"🇹🇳",grp:"F",seed:"4",rk:44,att:68,def:68,best:"小组赛",apps:6,stars:["Msakni","Talbi","Jaziri"],conf:"CAF",recent:"2023非洲杯小组赛",news:"非洲常客寻求突破",inj:""},

  // ===== GROUP G =====
  {id:"BEL",name:"Belgium",cn:"比利时",flag:"🇧🇪",grp:"G",seed:"1",rk:8,att:83,def:78,best:"季军(2018)",apps:14,stars:["De Bruyne","Doku","Trossard"],conf:"UEFA",recent:"2024欧洲杯16强",news:"德布劳内最后一届大赛，德巴斯特缺阵",inj:"🔴 Debast thigh"},
  {id:"EGY",name:"Egypt",cn:"埃及",flag:"🇪🇬",grp:"G",seed:"2",rk:33,att:74,def:72,best:"小组赛",apps:3,stars:["Salah","Marmoush","Elneny"],conf:"CAF",recent:"2023非洲杯16强",news:"萨拉赫+Marmoush双核",inj:""},
  {id:"IRN",name:"Iran",cn:"伊朗",flag:"🇮🇷",grp:"G",seed:"3",rk:31,att:68,def:71,best:"小组赛",apps:6,stars:["Taremi","Jahanbakhsh","Ghoddos"],conf:"AFC",recent:"2023亚洲杯4强",news:"阿兹蒙被移出国家队",inj:"🔴 Azmoun被移出国家队"},
  {id:"NZL",name:"New Zealand",cn:"新西兰",flag:"🇳🇿",grp:"G",seed:"4",rk:52,att:64,def:63,best:"小组赛",apps:2,stars:["Wood","Cacace","Just"],conf:"OFC",recent:"2024大洋洲杯冠军",news:"大洋洲代表",inj:""},

  // ===== GROUP H =====
  {id:"ESP",name:"Spain",cn:"西班牙",flag:"🇪🇸",grp:"H",seed:"1",rk:2,att:88,def:86,best:"冠军(2010)",apps:16,stars:["Rodri","Pedri","Yamal"],conf:"UEFA",recent:"2024欧洲杯冠军",news:"亚马尔+尼科首战不会首发，费尔明报销",inj:"🔴 Fermín López foot; 🔴 Yamal hamstring; 🔴 Nico Williams hamstring"},
  {id:"CPV",name:"Cape Verde",cn:"佛得角",flag:"🇨🇻",grp:"H",seed:"4",rk:63,att:63,def:62,best:"首次参赛",apps:0,stars:["Mendes","Tavares","Bebé"],conf:"CAF",recent:"历史首次晋级",news:"世界杯新军",inj:""},
  {id:"KSA",name:"Saudi Arabia",cn:"沙特",flag:"🇸🇦",grp:"H",seed:"3",rk:37,att:68,def:66,best:"16强(1994)",apps:6,stars:["Al-Dawsari","Al-Buraikan","Al-Shehri"],conf:"AFC",recent:"2023亚洲杯16强",news:"新帅4月上任磨合不足",inj:"Al-Aqidi hamstring"},
  {id:"URU",name:"Uruguay",cn:"乌拉圭",flag:"🇺🇾",grp:"H",seed:"2",rk:10,att:80,def:82,best:"冠军(1930,1950)",apps:14,stars:["Valverde","Núñez","Bentancur"],conf:"CONMEBOL",recent:"贝尔萨执教，2024美洲杯季军",news:"阿劳霍+希门尼斯缺阵首战，赛前24h才抵达",inj:"🔴 Araújo muscle; 🔴 Giménez; 🔴 De Arrascaeta; 🔴 Piquerez ankle"},

  // ===== GROUP I (Group of Death!) =====
  {id:"FRA",name:"France",cn:"法国",flag:"🇫🇷",grp:"I",seed:"1",rk:1,att:90,def:86,best:"冠军(1998,2018)",apps:16,stars:["Mbappé","Dembélé","Olise"],conf:"UEFA",recent:"德尚最后一届, 2024欧洲杯4强",news:"身价最高阵容€1.76B！死亡之组",inj:"🔴 Ekitike Achilles"},
  {id:"SEN",name:"Senegal",cn:"塞内加尔",flag:"🇸🇳",grp:"I",seed:"2",rk:20,att:78,def:76,best:"8强(2002)",apps:3,stars:["Mané","Jackson","Koulibaly"],conf:"CAF",recent:"2023非洲杯16强",news:"库利巴利大腿血肿疑缺，2002年曾胜法国",inj:"Koulibaly thigh hematoma; Gueye injury"},
  {id:"IRQ",name:"Iraq",cn:"伊拉克",flag:"🇮🇶",grp:"I",seed:"4",rk:60,att:64,def:63,best:"小组赛",apps:1,stars:["Ali Al-Hamadi","Hussein Ali","Amyn"],conf:"AFC",recent:"40年来首次晋级",news:"40年首次回归世界杯",inj:""},
  {id:"NOR",name:"Norway",cn:"挪威",flag:"🇳🇴",grp:"I",seed:"3",rk:15,att:82,def:72,best:"16强(1998)",apps:3,stars:["Haaland","Ødegaard","Sørloth"],conf:"UEFA",recent:"1998年后首次晋级",news:"哈兰德+厄德高！26年来首次晋级",inj:""},

  // ===== GROUP J =====
  {id:"ARG",name:"Argentina",cn:"阿根廷",flag:"🇦🇷",grp:"J",seed:"1",rk:1,att:91,def:87,best:"冠军(1978,86,2022)",apps:18,stars:["Messi","Álvarez","Enzo"],conf:"CONMEBOL",recent:"卫冕冠军, 2024美洲杯冠军",news:"梅西管理腿筋，帕雷德斯+塔利亚菲科缺阵",inj:"Messi腿筋管理; 🔴 Paredes hamstring; 🔴 Tagliafico calf"},
  {id:"ALG",name:"Algeria",cn:"阿尔及利亚",flag:"🇩🇿",grp:"J",seed:"2",rk:38,att:73,def:69,best:"16强(2014)",apps:4,stars:["Mahrez","Amoura","Gouiri"],conf:"CAF",recent:"2023非洲杯小组赛",news:"本塞拜尼缺阵，齐达内戴护面出战",inj:"🔴 Bensebaini foot; Zidane jaw fracture"},
  {id:"AUT",name:"Austria",cn:"奥地利",flag:"🇦🇹",grp:"J",seed:"3",rk:16,att:76,def:74,best:"季军(1954)",apps:7,stars:["Sabitzer","Baumgartner","Seiwald"],conf:"UEFA",recent:"2024欧洲杯16强",news:"鲍姆加特纳报销，阿拉巴疑缺",inj:"🔴 Baumgartner tournament; Alaba questionable"},
  {id:"JOR",name:"Jordan",cn:"约旦",flag:"🇯🇴",grp:"J",seed:"4",rk:68,att:63,def:62,best:"首次参赛",apps:0,stars:["Al-Taamari","Olwan","Al-Naimat"],conf:"AFC",recent:"2023亚洲杯亚军",news:"亚洲杯亚军，世界杯新军",inj:""},

  // ===== GROUP K =====
  {id:"POR",name:"Portugal",cn:"葡萄牙",flag:"🇵🇹",grp:"K",seed:"1",rk:6,att:85,def:82,best:"季军(1966)",apps:8,stars:["Ronaldo","B.Fernandes","Leão"],conf:"UEFA",recent:"2024欧洲杯8强",news:"C罗41岁第6届世界杯",inj:""},
  {id:"COD",name:"DR Congo",cn:"民主刚果",flag:"🇨🇩",grp:"K",seed:"4",rk:58,att:65,def:64,best:"小组赛",apps:1,stars:["Bakambu","Wissa","Kakuta"],conf:"CAF",recent:"2023非洲杯4强",news:"非洲杯4强，黑马潜力",inj:""},
  {id:"UZB",name:"Uzbekistan",cn:"乌兹别克",flag:"🇺🇿",grp:"K",seed:"3",rk:54,att:66,def:65,best:"首次参赛",apps:0,stars:["Shomurodov","Masharipov","Fayzullaev"],conf:"AFC",recent:"历史首次晋级",news:"世界杯新军",inj:""},
  {id:"COL",name:"Colombia",cn:"哥伦比亚",flag:"🇨🇴",grp:"K",seed:"2",rk:9,att:80,def:78,best:"8强(2014)",apps:6,stars:["Díaz","James","Durán"],conf:"CONMEBOL",recent:"2024美洲杯亚军",news:"美洲杯亚军势头强劲",inj:""},

  // ===== GROUP L =====
  {id:"ENG",name:"England",cn:"英格兰",flag:"🏴󠁧󠁢󠁥󠁮󠁧󠁿",grp:"L",seed:"1",rk:4,att:87,def:84,best:"冠军(1966)",apps:16,stars:["Kane","Bellingham","Saka"],conf:"UEFA",recent:"图赫尔执教, 2024欧洲杯亚军",news:"福登+帕尔默落选引争议！阵容€1.51B",inj:"🔴 Ben White MCL"},
  {id:"CRO",name:"Croatia",cn:"克罗地亚",flag:"🇭🇷",grp:"L",seed:"2",rk:11,att:79,def:79,best:"亚军(2018)",apps:6,stars:["Modrić","Gvardiol","Kovačić"],conf:"UEFA",recent:"2024欧洲杯小组赛",news:"莫德里奇最后一届世界杯",inj:""},
  {id:"GHA",name:"Ghana",cn:"加纳",flag:"🇬🇭",grp:"L",seed:"3",rk:43,att:70,def:67,best:"8强(2010)",apps:4,stars:["Kudus","Partey","Williams"],conf:"CAF",recent:"2023非洲杯小组赛",news:"帕尔特伊签证问题缺席首战",inj:"🔴 Partey签证问题缺席"},
  {id:"PAN",name:"Panama",cn:"巴拿马",flag:"🇵🇦",grp:"L",seed:"4",rk:48,att:65,def:64,best:"小组赛",apps:1,stars:["Murillo","Carrasquilla","Waterman"],conf:"CONCACAF",recent:"2024美洲杯8强",news:"美洲杯8强证明实力",inj:""},
];

const GROUPS = ['A','B','C','D','E','F','G','H','I','J','K','L'];

const TACTICAL = {
  // Group A — 真实数据：FIFA官方大名单+世预赛+近期比赛分析
  MEX: {manager:'Javier Aguirre',style:'high_press',formation:'4-3-3',tempo:8,width:7,pressing:8,setPiece:6,transition:7,physical:7,technique:5,
    strength:'高压迫+快速节奏+东道主气势',weakness:'进球困难（近7场仅1次进球超1个）',qualifying:'东道主自动晋级',note:'Giménez恢复中, Marcel Ruiz十字韧带撕裂缺阵'},
  RSA: {manager:'Hugo Broos',style:'possession',formation:'4-2-3-1',tempo:5,width:6,pressing:5,setPiece:6,transition:5,physical:7,technique:5,
    strength:'非洲杯62%控球+15.5次射门场均',weakness:'控球优势难以转化为进球',qualifying:'非洲区强势晋级',note:'Lyle Foster锋线核心'},
  KOR: {manager:'洪明甫',style:'high_press',formation:'4-3-3/3-4-3',tempo:8,width:8,pressing:8,setPiece:6,transition:8,physical:5,technique:8,
    strength:'孙兴慜+李刚仁+金玟哉顶级班底',weakness:'5-0友谊赛惨败巴西暴露防守问题',qualifying:'亚洲区强势晋级',note:'三中卫与四后卫灵活切换'},
  CZE: {manager:'Miroslav Koubek',style:'direct',formation:'3-4-3/3-5-2',tempo:5,width:7,pressing:5,setPiece:8,transition:5,physical:8,technique:5,
    strength:'身高体壮+Schick/Souček空中威胁',weakness:'缺乏技术型球员',qualifying:'附加赛淘汰爱尔兰+点球胜丹麦',note:'典型的身体流中欧足球'},
  // Group B — 真实战术分析
  CAN: {manager:'Jesse Marsch',style:'high_press',formation:'4-4-2/4-2-3-1',tempo:8,width:8,pressing:9,setPiece:5,transition:8,physical:7,technique:5,
    strength:'Red Bull哲学：极致压迫+快速转换',weakness:'夏季高温下高压可持续性存疑',qualifying:'东道主自动晋级',note:'Davies ACL术后反复肌肉问题'},
  BIH: {manager:'Sergej Barbarez',style:'balanced',formation:'4-4-2/4-2-3-1',tempo:5,width:6,pressing:6,setPiece:7,transition:5,physical:7,technique:6,
    strength:'技术型踢法+战术灵活（附加赛淘汰意大利）',weakness:'整体实力有限',qualifying:'附加赛淘汰威尔士+意大利',note:'40岁Džeko仍是核心'},
  QAT: {manager:'Julen Lopetegui',style:'defensive_block',formation:'4-3-3/4-2-3-1',tempo:3,width:4,pressing:3,setPiece:5,transition:3,physical:4,technique:5,
    strength:'紧缩防守+两线4-5人蹲守',weakness:'近期友谊赛负于津巴布韦和巴勒斯坦',qualifying:'附加赛淘汰阿联酋',note:'Lopetegui坚决4-3-3'},
  SUI: {manager:'Murat Yakin',style:'possession',formation:'4-3-3/4-2-3-1',tempo:7,width:6,pressing:6,setPiece:7,transition:6,physical:7,technique:7,
    strength:'Xhaka组织核心+Akanji防守支柱',weakness:'缺乏顶级终结者',qualifying:'稳定晋级',note:'连续两届欧洲杯8强+世界杯16强'},
  // Group C — 真实战术+首战表现
  BRA: {manager:'Carlo Ancelotti',style:'possession',formation:'4-3-3/4-2-3-1',tempo:8,width:9,pressing:7,setPiece:7,transition:8,physical:7,technique:9,
    strength:'Vinicius Jr边路爆破+控球碾压',weakness:'首战1-1平摩洛哥显示身体对抗落于下风',qualifying:'南美区强势',note:'Rodrygo ACL缺阵, Neymar小腿伤疑'},
  MAR: {manager:'Mohamed Ouahbi',style:'counter',formation:'4-1-4-1',tempo:7,width:8,pressing:8,setPiece:8,transition:8,physical:7,technique:7,
    strength:'高压反抢+快速转换+1-1逼平巴西',weakness:'阵地进攻手段有限',qualifying:'非洲区晋级,2022四强班底',note:'Aguerd/Mazraoui/Az Abde缺阵'},
  HAI: {manager:'Sebastien Migne',style:'defensive_block',formation:'4-4-2',tempo:3,width:5,pressing:3,setPiece:4,transition:4,physical:7,technique:3,
    strength:'拼劲足',weakness:'整体实力明显不足',qualifying:'北美区晋级',note:'Bellegarde/Nazon关键球员'},
  SCO: {manager:'Steve Clarke',style:'direct',formation:'3-4-3',tempo:6,width:8,pressing:7,setPiece:8,transition:6,physical:8,technique:5,
    strength:'身体流+Robertson/Tierney边路',weakness:'技术粗糙+中场创造力不足',qualifying:'欧洲区晋级',note:'28年来首次世界杯胜利(1-0海地)'},
  // Group D — 真实战术+首战
  USA: {manager:'Mauricio Pochettino',style:'high_press',formation:'4-3-3',tempo:8,width:7,pressing:8,setPiece:7,transition:8,physical:7,technique:7,
    strength:'Pulisic核心+Balogun双响4-1巴拉圭',weakness:'大赛经验有限',qualifying:'东道主自动晋级',note:'Pochettino执教带来战术升级'},
  PAR: {manager:'Gustavo Alfaro',style:'defensive_block',formation:'4-4-2',tempo:3,width:5,pressing:3,setPiece:6,transition:4,physical:7,technique:4,
    strength:'防守纪律性强',weakness:'1-4惨败美国暴露实力差距',qualifying:'南美区晋级',note:'Almirón+Enciso速度威胁'},
  AUS: {manager:'Tony Popovic',style:'direct',formation:'4-1-4-1',tempo:6,width:7,pressing:5,setPiece:7,transition:6,physical:8,technique:5,
    strength:'身高优势与技战术传统让定位球成为得分利器。伊兰昆达在2-0胜土耳其的比赛中破门，成为澳大利亚世界杯史上最年轻的进球者',weakness:'技术细腻度不足，面对高压逼抢时后场出球容易失误',qualifying:'亚洲区晋级',note:'Souttar空中霸主'},
  TUR: {manager:'Vincenzo Montella',style:'balanced',formation:'4-2-3-1',tempo:7,width:7,pressing:6,setPiece:7,transition:7,physical:6,technique:7,
    strength:'Güler+Yıldız天才双核',weakness:'0-2澳大利亚暴露防线问题',qualifying:'欧洲区晋级',note:'Çalhanoğlu中场组织'},
  // Group E — 真实战术+首战
  GER: {manager:'Julian Nagelsmann',style:'possession',formation:'4-2-3-1',tempo:8,width:8,pressing:8,setPiece:8,transition:8,physical:7,technique:8,
    strength:'Musiala+Wirtz双核+7-1大胜库拉索',weakness:'面对极致防反历史性吃亏',qualifying:'东道主自动晋级',note:'Gnabry受伤缺阵, Havertz双响'},
  CUW: {manager:'Dick Advocaat',style:'defensive_block',formation:'4-5-1',tempo:2,width:4,pressing:2,setPiece:3,transition:3,physical:5,technique:3,
    strength:'首次世界杯',weakness:'1-7惨败德国,实力悬殊',qualifying:'北美区历史首次晋级',note:'Comenencia打入队史首球'},
  CIV: {manager:'Emerse Faé',style:'balanced',formation:'4-3-3',tempo:7,width:8,pressing:7,setPiece:7,transition:7,physical:8,technique:7,
    strength:'非洲杯冠军班底+1-0绝杀厄瓜多尔',weakness:'大赛淘汰赛经验欠缺',qualifying:'非洲杯冠军',note:'Diallo 90分钟绝杀'},
  ECU: {manager:'Sebastián Beccacece',style:'counter',formation:'4-2-3-1',tempo:6,width:7,pressing:6,setPiece:6,transition:7,physical:7,technique:6,
    strength:'Caicedo中场支柱',weakness:'0-1被科特迪瓦绝杀,进攻效率低',qualifying:'南美区晋级',note:'Estupiñán+Páez年轻才俊'},
  // Group F — 真实战术+首战表现
  NED: {manager:'Ronald Koeman',style:'balanced',formation:'4-3-3/4-1-4-1',tempo:7,width:8,pressing:6,setPiece:8,transition:7,physical:7,technique:8,
    strength:'边路爆破+Van Dijk头球威胁',weakness:'三主力伤缺+2-2被日本绝平暴露防守漏洞',qualifying:'欧洲区晋级',note:'Simons/Timber/de Ligt全缺阵'},
  JPN: {manager:'森保一',style:'high_press',formation:'3-4-2-1',tempo:8,width:8,pressing:9,setPiece:6,transition:9,physical:5,technique:8,
    strength:'极致跑动+2-2逼平荷兰,89分钟绝平',weakness:'身体对抗弱+Mitoma缺阵+久保受伤',qualifying:'亚洲区强势(胜巴西英格兰德国)',note:'目标夺冠,至少八强'},
  SWE: {manager:'Graham Potter',style:'direct',formation:'3-4-1-2',tempo:7,width:8,pressing:6,setPiece:8,transition:7,physical:8,technique:7,
    strength:'Isak+Gyökeres双锋5-1大胜突尼斯',weakness:'预选赛垫底靠附加赛晋级',qualifying:'欧国联附加赛晋级',note:'Potter 2025年10月上任后焕然一新'},
  TUN: {manager:'Sabri Lamouchi',style:'defensive_block',formation:'4-2-3-1',tempo:3,width:5,pressing:3,setPiece:6,transition:4,physical:7,technique:5,
    strength:'预选赛全程零失球(22-0)历史性防守',weakness:'1-5惨败瑞典,门将选择重大失误',qualifying:'非洲区惊人防守记录',note:'换门将决策受质疑'},
  // Group G — 真实战术分析
  BEL: {manager:'Rudi Garcia',style:'possession',formation:'4-2-3-1',tempo:6,width:7,pressing:6,setPiece:7,transition:6,physical:7,technique:8,
    strength:'De Bruyne最后一届+直塞穿透',weakness:'黄金一代老化,防线转身慢',qualifying:'欧洲区晋级',note:'Lukaku+De Ketelaere双锋选择'},
  EGY: {manager:'Hossam Hassan',style:'counter',formation:'4-3-3/4-2-3-1',tempo:6,width:7,pressing:5,setPiece:7,transition:7,physical:6,technique:7,
    strength:'Salah+Marmoush双核反击',weakness:'中场控制力不足',qualifying:'非洲区晋级',note:'萨拉赫恢复健康'},
  IRN: {manager:'Amir Ghalenoei',style:'defensive_block',formation:'4-4-2/4-5-1',tempo:3,width:5,pressing:3,setPiece:8,transition:5,physical:8,technique:5,
    strength:'防守铁桶+身体+定位球',weakness:'控球能力差+平均年龄偏高',qualifying:'亚洲区强势',note:'Taremi+Azmoun双锋'},
  NZL: {manager:'Darren Bazeley',style:'direct',formation:'4-4-2/4-3-3',tempo:5,width:7,pressing:4,setPiece:6,transition:5,physical:8,technique:4,
    strength:'Chris Wood头球支点',weakness:'16年首次重返,整体差距明显',qualifying:'大洋洲冠军',note:'拼劲+团队精神'},
  // Group H — 真实战术分析
  ESP: {manager:'Luis de la Fuente',style:'possession',formation:'4-3-3/4-2-3-1',tempo:8,width:9,pressing:9,setPiece:7,transition:8,physical:5,technique:10,
    strength:'进化版传控:更快速高效+欧预赛21球仅失2球',weakness:'高位防线易被反击+Yamal/Nico伤愈+Rodri ACL恢复',qualifying:'欧洲区强势(5胜1平)',note:'游戏5.50头号热门'},
  CPV: {manager:'Pedro Bubista Brito',style:'defensive_block',formation:'4-2-3-1',tempo:4,width:5,pressing:6,setPiece:5,transition:5,physical:7,technique:4,
    strength:'预选赛7胜2平1负+防守稳固',weakness:'人口50万岛国首次参赛',qualifying:'非洲区D组第一历史首晋',note:'团队凝聚力强'},
  KSA: {manager:'Georgios Donis',style:'possession',formation:'4-3-3',tempo:5,width:7,pressing:6,setPiece:5,transition:5,physical:5,technique:6,
    strength:'高位防线+协同逼抢+Al-Dawsari核心',weakness:'0-4惨败埃及暴露防守巨大问题',qualifying:'亚洲区第三(超日澳)',note:'新帅4月上任磨合时间短'},
  URU: {manager:'Marcelo Bielsa',style:'high_press',formation:'4-4-2/4-3-3',tempo:8,width:7,pressing:9,setPiece:8,transition:8,physical:8,technique:7,
    strength:'Bielsa体系:让对手无法喘息+胜巴西阿根廷',weakness:'四连不胜+4名防线主力缺阵+Suarez公开批评',qualifying:'南美区第四(胜巴西阿根廷)',note:'Valverde中场核心'},
  // Group I — 死亡之组
  FRA: {manager:'Didier Deschamps',style:'possession',formation:'4-2-3-1/4-3-3',tempo:9,width:9,pressing:8,setPiece:8,transition:9,physical:8,technique:10,
    strength:'阵容€1.76B+Mbappé队长+Dembélé金球奖',weakness:'Deschamps最后一届+偶尔保守',qualifying:'欧洲区强势',note:'Ekitike跟腱缺阵'},
  SEN: {manager:'Pape Thiaw',style:'counter',formation:'4-3-3',tempo:7,width:8,pressing:7,setPiece:7,transition:8,physical:8,technique:7,
    strength:'Mané+Jackson+Sarr速度反击',weakness:'防线偶尔不够集中',qualifying:'非洲区晋级',note:'2002年曾1-0爆冷法国'},
  IRQ: {manager:'Graham Arnold',style:'defensive_block',formation:'4-5-1',tempo:3,width:4,pressing:3,setPiece:5,transition:3,physical:6,technique:4,
    strength:'40年来首归世界杯',weakness:'整体实力+经验有限',qualifying:'亚洲区晋级',note:'Arnold执教带来澳洲式组织'},
  NOR: {manager:'Ståle Solbakken',style:'balanced',formation:'4-3-3',tempo:7,width:7,pressing:7,setPiece:8,transition:7,physical:7,technique:8,
    strength:'Haaland终结者+Ødegaard创造力',weakness:'26年首次参赛经验为零',qualifying:'欧洲区晋级',note:'Haaland预选赛16球'},
  // Group J — 卫冕冠军
  ARG: {manager:'Lionel Scaloni',style:'possession',formation:'4-3-3',tempo:8,width:8,pressing:8,setPiece:8,transition:8,physical:6,technique:10,
    strength:'Messi六届世界杯+卫冕冠军班底',weakness:'Tagliafico缺阵+防线偏老',qualifying:'南美区冠军',note:'7连胜中'},
  ALG: {manager:'Vladimir Petkovic',style:'balanced',formation:'4-3-3',tempo:6,width:7,pressing:6,setPiece:7,transition:6,physical:6,technique:7,
    strength:'Mahrez+Amoura+Gouiri三叉戟',weakness:'Bensebaini缺阵防守削弱',qualifying:'非洲区晋级',note:'附加赛磨合成型'},
  AUT: {manager:'Ralf Rangnick',style:'high_press',formation:'4-2-3-1',tempo:8,width:7,pressing:10,setPiece:7,transition:8,physical:7,technique:7,
    strength:'Rangnick体系:极致压迫+全队统一',weakness:'面对冷静传控型球队消耗大',qualifying:'欧洲区表现出色',note:'Alaba+Sabitzer领袖'},
  JOR: {manager:'Jamal Sellami',style:'defensive_block',formation:'4-4-2',tempo:3,width:5,pressing:3,setPiece:6,transition:4,physical:6,technique:5,
    strength:'2023亚洲杯亚军黑马底蕴',weakness:'首次参赛+实力有限',qualifying:'亚洲区历史首晋',note:'Al-Taamari核心'},
  // Group K — C罗最后一舞
  POR: {manager:'Roberto Martinez',style:'balanced',formation:'4-3-3',tempo:7,width:8,pressing:7,setPiece:8,transition:7,physical:6,technique:9,
    strength:'B费+B席+Leão技术型中场',weakness:'C罗41岁高龄+防线稳定性',qualifying:'欧洲区晋级',note:'Ronaldo六届世界杯'},
  COD: {manager:'Sébastien Desabre',style:'counter',formation:'4-3-3',tempo:6,width:7,pressing:5,setPiece:6,transition:7,physical:7,technique:6,
    strength:'非洲杯4强+Wan-Bissaka+Bakambu',weakness:'战术纪律较差',qualifying:'非洲区晋级',note:'Wissa速度型前锋'},
  UZB: {manager:'未公布',style:'direct',formation:'4-2-3-1',tempo:5,width:6,pressing:5,setPiece:6,transition:5,physical:6,technique:5,
    strength:'首次参赛无包袱',weakness:'未知因素+整体差距',qualifying:'亚洲区历史首晋',note:'Shomurodov队长'},
  COL: {manager:'Néstor Lorenzo',style:'balanced',formation:'4-3-3',tempo:7,width:8,pressing:7,setPiece:8,transition:7,physical:7,technique:8,
    strength:'Díaz边路+James创造+2024美洲杯亚军',weakness:'防线回追慢',qualifying:'南美区晋级',note:'美洲杯亚军势头'},
  // Group L — 图赫尔英格兰
  ENG: {manager:'Thomas Tuchel',style:'possession',formation:'4-2-3-1',tempo:8,width:8,pressing:8,setPiece:9,transition:8,physical:8,technique:8,
    strength:'Kane终结+Bellingham中场+深度阵容',weakness:'大赛决赛心理关+Foden/Palmer落选',qualifying:'欧洲区完美战绩',note:'Ben White MCL缺阵'},
  CRO: {manager:'Zlatko Dalić',style:'balanced',formation:'4-3-3',tempo:6,width:6,pressing:6,setPiece:7,transition:6,physical:7,technique:8,
    strength:'Modrić最后一舞+中场铁三角',weakness:'锋线终结能力已退化',qualifying:'欧洲区晋级',note:'Budimir锋线首选'},
  GHA: {manager:'Carlos Queiroz',style:'counter',formation:'4-3-3',tempo:7,width:7,pressing:6,setPiece:7,transition:7,physical:8,technique:6,
    strength:'Kudus+Partey非洲速度',weakness:'战术纪律不足',qualifying:'非洲区晋级',note:'Queiroz经验丰富'},
  PAN: {manager:'Thomas Christiansen',style:'defensive_block',formation:'5-4-1',tempo:3,width:5,pressing:3,setPiece:5,transition:4,physical:7,technique:4,
    strength:'2024美洲杯8强+五后卫大巴',weakness:'攻击力严重不足',qualifying:'北美区晋级',note:'Murillo核心后卫'},
};

const STYLE_MATCHUP = {
  'high_press':  {'possession':0.04, 'balanced':0.02, 'counter':-0.01, 'direct':0.02, 'defensive_block':0.06, 'high_press':0},
  'possession':  {'high_press':-0.04, 'balanced':0.02, 'counter':0.01, 'direct':0.03, 'defensive_block':-0.02, 'possession':0},
  'counter':     {'high_press':0.05, 'possession':0.03, 'balanced':0.02, 'direct':0.01, 'defensive_block':-0.04, 'counter':0},
  'direct':      {'high_press':-0.02, 'possession':-0.03, 'balanced':0.01, 'counter':0.02, 'defensive_block':0.05, 'direct':0},
  'defensive_block': {'high_press':-0.06, 'possession':0.02, 'balanced':-0.03, 'counter':0.04, 'direct':-0.05, 'defensive_block':0},
  'balanced':    {'high_press':-0.02, 'possession':-0.02, 'balanced':0, 'counter':-0.02, 'direct':-0.01, 'defensive_block':0.03},
};

const STARTING_XI = {
  // Group A
  MEX: {f:'4-3-3',g:'Ochoa',d:['J.Sánchez','Montes','Vásquez','Arteaga'],m:['E.Álvarez(C)','Chávez','Ruiz'],fwd:['Antuna','Giménez','Huerta'],subs:'Lozano,Jiménez,Pineda',note:'Giménez伤愈恢复中'},
  RSA: {f:'4-2-3-1',g:'Williams',d:['Mudau','Kekana','Mvala','Modiba'],m:['Mokoena','Sithole'],fwd:['Tau','Zwane','Foster'],st:'Makgopa',subs:'Mofokeng,Lorch',note:'Foster主力中锋'},
  KOR: {f:'4-3-3',g:'Kim Seung-gyu',d:['Kim Moon-hwan','Kim Min-jae','Kim Young-gwon','Lee Ki-je'],m:['Hwang In-beom','Park Yong-woo','Lee Kang-in'],fwd:['Hwang Hee-chan','Son(C)','Jeong Woo-yeong'],subs:'Oh Hyeon-gyu,Cho Gue-sung',note:'首战2-1捷克 黄仁范一传一射'},
  CZE: {f:'3-4-3',g:'Staněk',d:['Holeš','Krejčí','Zima'],m:['Coufal','Souček(C)','Sadílek','Jurásek'],fwd:['Černý','Schick','Hložek'],subs:'Kuchta,Provod',note:'身体流三中卫体系'},
  // Group B
  CAN: {f:'4-4-2',g:'Crépeau',d:['Johnston','Bombito','Cornelius','Davies(C)'],m:['Buchanan','Eustáquio','Koné','Millar'],fwd:['David','Larin'],subs:'Osorio,Ahmed',note:'Davies伤疑但预计首发'},
  BIH: {f:'4-2-3-1',g:'Šehić',d:['Dedić','Ahmedhodžić','Kolašinac','Gazzibeković'],m:['Tahirović','Cimirot'],fwd:['Demirović','Pjanić','Hadžiahmetović'],st:'Džeko(C)',subs:'Prevljak,Gojak',note:'40岁Džeko仍核心'},
  QAT: {f:'4-3-3',g:'Barsham',d:['Pedro Miguel','Khoukhi','Mohammad','Ahmed'],m:['Al-Haydos','Boudiaf','Afif'],fwd:['Alaaeldin','Ali','Mazeed'],subs:'Al-Rawi,Waad',note:'Lopetegui四后卫体系'},
  SUI: {f:'4-3-3',g:'Kobel',d:['Widmer','Akanji','Elvedi','Rodríguez'],m:['Freuler','Xhaka(C)','Zakaria'],fwd:['Ndoye','Embolo','Vargas'],subs:'Amdouni,Okafor',note:'Xhaka组织核心'},
  // Group C
  BRA: {f:'4-3-3',g:'Alisson',d:['Wesley','Marquinhos(C)','Gabriel','Douglas Santos'],m:['Casemiro','Bruno Guimarães','Paquetá'],fwd:['Raphinha','Cunha','Vinícius Jr'],subs:'Neymar,Endrick,Martinelli',note:'Neymar替补待命 Rodrygo伤缺'},
  MAR: {f:'4-1-4-1',g:'Bono',d:['Hakimi','Riad','Abqar','Mazraoui'],m:['Amrabat'],fwd:['El Khannouss','Ounahi','Brahim Díaz','Saibari'],st:'En-Nesyri',subs:'Adli,Ezzalzouli',note:'Aguerd伤缺 Mazraoui肩伤疑'},
  HAI: {f:'4-4-2',g:'Placide',d:['Lambese','Ricardo Adé','Duverne','Christian'],m:['Alceus','Bellegarde','Picault','Etienne'],fwd:['Nazon','Pierrot'],subs:'Isidor,Antoine',note:'Bellegarde中场核心'},
  SCO: {f:'3-4-3',g:'Gordon',d:['Hendry','Hanley','Tierney'],m:['Patterson','McGinn','McTominay','Robertson(C)'],fwd:['Christie','Adams','Doak'],subs:'Gilmour,Shankland',note:'28年来首胜(1-0海地)'},
  // Group D
  USA: {f:'4-3-3',g:'Turner',d:['Dest','Richards','Ream','A.Robinson'],m:['McKennie','Cardoso','Reyna'],fwd:['Weah','Balogun','Pulisic(C)'],subs:'Pepi,Aaronson',note:'首战4-1巴拉圭 Balogun梅开二度'},
  PAR: {f:'4-4-2',g:'Coronel',d:['R.Rojas','Gómez(C)','Balbuena','Alderete'],m:['Villasanti','Gómez','Almirón','Enciso'],fwd:['Sanabria','Sosa'],subs:'Ávalos,Romero',note:'首战1-4负美国'},
  AUS: {f:'4-1-4-1',g:'Ryan(C)',d:['Atkinson','Souttar','Rowles','Behich'],m:['Irvine'],fwd:['Boyle','McGree','Genreau','Goodwin'],st:'Irankunda',subs:'Duke,Mabil',note:'首战2-0土耳其 Irankunda最年轻进球'},
  TUR: {f:'4-2-3-1',g:'Çakır',d:['Çelik','Demiral','Bardakcı','Kadıoğlu'],m:['Çalhanoğlu(C)','Kökçü'],fwd:['Güler','Yazıcı','Yıldız'],st:'Ünal',subs:'Aktürkoğlu,Güler',note:'首战0-2澳大利亚'},
  // Group E
  GER: {f:'4-2-3-1',g:'Neuer(C)',d:['Kimmich','Rüdiger','Schlotterbeck','Raum'],m:['Pavlović','Goretzka'],fwd:['Musiala','Wirtz','Havertz'],st:'Undav',subs:'Sané,Beier',note:'首战7-1库拉索 Havertz梅开二度'},
  CUW: {f:'4-5-1',g:'Room',d:['Martina','Bazoer','Van Ewijk','Floranus'],m:['Bacuna(C)','Leerdam','Anita','Kastaneer','Chong'],st:'Janga',subs:'Antonisse,Gorré',note:'首战1-7德国 Comenencia破门'},
  CIV: {f:'4-3-3',g:'Fofana',d:['Singo','Ndicka','Boly','Konan'],m:['Kessié','Fofana(C)','Traoré'],fwd:['Adingra','Haller','Diallo'],subs:'Pépé,Konaté',note:'首战1-0厄瓜多尔 Diallo 90分绝杀'},
  ECU: {f:'4-2-3-1',g:'Domínguez',d:['Preciado','Torres','Hincapié','Estupiñán'],m:['Caicedo(C)','Gruezo'],fwd:['Mena','Páez','Sarmiento'],st:'Valencia',subs:'Rodríguez,Plata',note:'首战0-1科特迪瓦'},
  // Group F
  NED: {f:'4-3-3',g:'Verbruggen',d:['Dumfries','Van Hecke','Van Dijk(C)','Van de Ven'],m:['De Jong','Gravenberch','Reijnders'],fwd:['Summerville','Depay','Gakpo'],subs:'Malen,Koopmeiners',note:'Simons/Timber/de Ligt伤缺 首战2-2日本'},
  JPN: {f:'3-4-2-1',g:'Suzuki',d:['Tomiyasu','Yoshida','Itakura'],m:['Dōan','Tanaka','Morita','Nakamura'],am:['Kubo','Kamada'],st:'Ueda',subs:'Maeda,J.Ito',note:'Mitoma伤缺 久保膝盖伤疑 首战2-2荷兰'},
  SWE: {f:'3-4-1-2',g:'Johansson',d:['Starfelt','Lindelöf','Hien'],m:['Holm','Svanberg','Bergvall','Gudmundsson'],am:'Ayari',fwd:['Isak','Gyökeres'],subs:'Kulusevski,Elanga',note:'首战5-1突尼斯 Ayari梅开二度'},
  TUN: {f:'4-2-3-1',g:'Dahmen',d:['Dräger','Talbi','Meriah','Abdi'],m:['Skhiri','Laïdouni'],fwd:['Mejbri','Ben Slimane','Gharbi'],st:'Jaziri',subs:'Rafia,Sassi',note:'首战1-5瑞典 门将争议'},
  // Group G
  BEL: {f:'4-2-3-1',g:'Courtois',d:['Meunier','Ngoy','Mechele','Castagne'],m:['Onana','Tielemans'],fwd:['Trossard','De Bruyne(C)','Doku'],st:'De Ketelaere',subs:'Lukaku,Openda',note:'Debast伤缺 De Bruyne最后一届'},
  EGY: {f:'4-3-3',g:'El Shenawy',d:['Hany','Ibrahim','Fathy','Fatouh'],m:['Lasheen','Attia','Ashour'],fwd:['Trezeguet','Salah(C)','Marmoush'],subs:'Zizo,Mostafa',note:'Salah身体恢复'},
  IRN: {f:'4-4-2',g:'Beiranvand',d:['Moharrami','Kanaani','Khalilzadeh','Hajsafi'],m:['Jahanbakhsh','Ezatolahi','Ghoddos','Gholizadeh'],fwd:['Taremi','Torabi'],subs:'Ansarifard,Mohebi',note:'Azmoun被移出国家队'},
  NZL: {f:'4-4-2',g:'Crocombe',d:['Boxall(C)','Pijnaker','Tuiloma','Cacace'],m:['Garbett','Stamenić','Bell','Singh'],fwd:['Wood','McCowatt'],subs:'Just,Rojas',note:'16年重返世界杯'},
  // Group H
  ESP: {f:'4-3-3',g:'Unai Simón',d:['Llorente','Cubarsí','Laporte','Cucurella'],m:['Rodri','Fabián Ruiz','Pedri'],fwd:['Ferran Torres','Oyarzabal','Baena'],subs:'Yamal,Nico Williams,Olmo',note:'Yamal+尼科替补待命，费尔明报销'},
  CPV: {f:'4-2-3-1',g:'Vozinha',d:['Diney','L.Costa','Stopira','Paulo'],m:['Rocha Santos','Pina'],fwd:['Mendes','Monteiro','Tavares'],st:'Bebé',subs:'Andrade,Semedo',note:'首战世界杯'},
  KSA: {f:'4-3-3',g:'Al-Owais',d:['Abdulhamid','Al-Tambakti','Al-Bulaihi','Al-Shahrani'],m:['Al-Malki','Kanno','Al-Dawsari(C)'],fwd:['Al-Buraikan','Al-Shehri','Ghareeb'],subs:'Al-Aqidi,Radif',note:'新帅Donis 4月上任'},
  URU: {f:'4-4-2',g:'Muslera',d:['Varela','Cáceres','S.Bueno','Olivera'],m:['Valverde(C)','Ugarte','Bentancur','M.Araujo'],fwd:['Núñez','Viñas'],subs:'Pellistri,Rodríguez',note:'Araújo/Giménez伤缺 Bielsa体系'},
  // Group I (Group of Death)
  FRA: {f:'4-2-3-1',g:'Maignan',d:['Koundé','Upamecano','Saliba','T.Hernández'],m:['Tchouaméni','Kanté'],fwd:['Dembélé','Olise','Doué'],st:'Mbappé(C)',subs:'Thuram,Barcola,Cherki',note:'€1.76B身价最高 Ekitike伤缺'},
  SEN: {f:'4-3-3',g:'É.Mendy',d:['A.Mendy','Koulibaly(C)','Niakhaté','Jakobs'],m:['Camara','P.Sarr','Guèye'],fwd:['I.Sarr','Jackson','Mané'],subs:'Dia,Simons',note:'2002年曾胜法国'},
  IRQ: {f:'4-5-1',g:'J.Hassan',d:['Adnan','Natiq','Sulaka','Allée'],m:['Al Ammari','Rasan','Bayesh','Iqbal','Jasim'],st:'Al Hamadi',subs:'H.Ali,Mohanad',note:'40年首归 Arnold执教'},
  NOR: {f:'4-3-3',g:'Nyland',d:['Ryerson','Ajer','Østigård','Bjørsol'],m:['Ødegaard(C)','Berge','Aursnes'],fwd:['Nusa','Haaland','Sørloth'],subs:'Bobb,Thorstvedt',note:'Haaland预选赛16球 26年首归'},
  // Group J
  ARG: {f:'4-3-3',g:'E.Martínez',d:['Molina','Romero','Otamendi','Medina'],m:['De Paul','Enzo Fernández','Mac Allister'],fwd:['Messi(C)','Álvarez','Almada'],subs:'La.Martínez,González',note:'Tagliafico伤缺 7连胜中'},
  ALG: {f:'4-3-3',g:'L.Zidane',d:['Atal','Mandi','Tougai','Aït-Nouri'],m:['Bentaleb','Boudaoui','Zorgane'],fwd:['Mahrez(C)','Gouiri','Amoura'],subs:'Chaïbi,Bounedjah',note:'Bensebaini伤缺'},
  AUT: {f:'4-2-3-1',g:'Pentz',d:['Mwene','Danso','Lienhart','Prass'],m:['Seiwald','Grillitsch'],fwd:['Wimmer','Sabitzer(C)','Baumgartner'],st:'Arnautović',subs:'Gregoritsch,Schmid',note:'Rangnick极致压迫体系'},
  JOR: {f:'4-4-2',g:'Abu Laila',d:['Nasib','Al-Arab','Al-Dmeiri','Al-Ajalin'],m:['Al-Taamari','Al-Rawabdeh','Al-Mardi','Olwan'],fwd:['Al-Naimat','Al-Dardour'],subs:'Samir,Rashdan',note:'2023亚洲杯亚军'},
  // Group K
  POR: {f:'4-3-3',g:'Diogo Costa',d:['Cancelo','Rúben Dias','Gonçalo Inácio','Nuno Mendes'],m:['Bernardo Silva','João Neves','Bruno Fernandes(C)'],fwd:['Pedro Neto','Ronaldo','Leão'],subs:'Jota,Vitinha',note:'Ronaldo第6届 豪华中场'},
  COD: {f:'4-3-3',g:'Mpasi',d:['Wan-Bissaka','Mbemba(C)','Inonga','Masuaku'],m:['Moutoussamy','Kayembe','Kakuta'],fwd:['Wissa','Bakambu','Bongonda'],subs:'Mayele,Batubinsika',note:'非洲杯4强'},
  UZB: {f:'4-2-3-1',g:'Nematov',d:['Alijonov','Khusanov','Ashurmatov','Sayfiev'],m:['Khamrobekov','Shukurov'],fwd:['Masharipov','Fayzullaev','Turgunboev'],st:'Shomurodov(C)',subs:'Urunov,Erkinov',note:'首次世界杯'},
  COL: {f:'4-3-3',g:'Vargas',d:['Muñoz','D.Sánchez','Cuesta','Mojica'],m:['Uribe','Lerma','James Rodríguez(C)'],fwd:['Díaz','Durán','Sinisterra'],subs:'Córdoba,Carrascal',note:'2024美洲杯亚军'},
  // Group L
  ENG: {f:'4-2-3-1',g:'Pickford',d:['Reece James','Stones','Guéhi','O\'Reilly'],m:['Rice','Mainoo'],fwd:['Saka','Bellingham','Rashford'],st:'Kane(C)',subs:'Gordon,Eze,Watkins',note:'Foden/Palmer落选 Ben White伤缺'},
  CRO: {f:'4-3-3',g:'Livaković',d:['Stanišić','Gvardiol','Šutalo','Sosa'],m:['Modrić(C)','Kovačić','Brozović'],fwd:['Pašalić','Budimir','Perišić'],subs:'Petković,Majer',note:'莫德里奇最后一届'},
  GHA: {f:'4-3-3',g:'Ati-Zigi',d:['Lamptey','Amartey','Salisu','Mensah'],m:['Nuamah','Kudus','Samed'],fwd:['Williams','Semenyo','Ayew'],subs:'Partey(C),Bukari',note:'Partey(C)签证缺席'},
  PAN: {f:'5-4-1',g:'Mejía',d:['Murillo','Córdoba','Escobar','Cummings','Davis'],m:['Carrasquilla','Godoy','Martínez','Waterman'],st:'Díaz',subs:'Gondola,Yanis',note:'美洲杯8强 五后卫大巴'},
};

const PLAYER_CN = {
  // Goalkeepers
  'Ochoa':'奥乔亚','Williams':'威廉姆斯','Kim Seung-gyu':'金承奎','Staněk':'斯塔涅克',
  'Crépeau':'克雷波','Šehić':'舍希奇','Barsham':'巴沙姆','Kobel':'科贝尔',
  'Alisson':'阿利松','Bono':'布努','Placide':'普拉西德','Gordon':'戈登',
  'Turner':'特纳','Coronel':'科罗内尔','Ryan':'瑞安','Çakır':'恰克尔',
  'Neuer':'诺伊尔','Room':'鲁姆','Fofana':'福法纳','Domínguez':'多明格斯',
  'Verbruggen':'费布吕亨','Suzuki':'铃木彩艳','Johansson':'约翰松','Dahmen':'达门',
  'Courtois':'库尔图瓦','El Shenawy':'谢纳维','Beiranvand':'贝兰万德','Crocombe':'克罗科姆',
  'Unai Simón':'乌奈·西蒙','Vozinha':'沃济尼亚','Al-Owais':'奥韦斯','Muslera':'穆斯莱拉',
  'Maignan':'迈尼昂','É.Mendy':'爱德华·门迪','J.Hassan':'贾拉尔·哈桑','Nyland':'尼兰',
  'E.Martínez':'达米安·马丁内斯','L.Zidane':'卢卡·齐达内','Pentz':'彭茨','Abu Laila':'阿布莱拉',
  'Diogo Costa':'迪奥戈·科斯塔','Mpasi':'姆帕西','Nematov':'内马托夫','Vargas':'巴尔加斯',
  'Pickford':'皮克福德','Livaković':'利瓦科维奇','Ati-Zigi':'阿蒂-齐吉','Mejía':'梅希亚',
  // Defenders
  'J.Sánchez':'豪尔赫·桑切斯','Montes':'蒙特斯','Vásquez':'巴斯克斯','Arteaga':'阿特亚加',
  'Mudau':'穆道','Kekana':'凯卡纳','Mvala':'姆瓦拉','Modiba':'莫迪巴',
  'Kim Moon-hwan':'金纹焕','Kim Min-jae':'金玟哉','Kim Young-gwon':'金英权','Lee Ki-je':'李记帝',
  'Holeš':'霍莱什','Krejčí':'克雷伊奇','Zima':'齐马','Coufal':'曹法尔','Jurásek':'尤拉塞克',
  'Johnston':'约翰斯顿','Bombito':'邦比托','Cornelius':'科尼利厄斯','Davies':'戴维斯',
  'Dedić':'德迪奇','Ahmedhodžić':'艾哈迈德霍季奇','Kolašinac':'科拉希纳茨','Gazzibeković':'加齐贝科维奇',
  'Pedro Miguel':'佩德罗·米格尔','Khoukhi':'胡希','Mohammad':'穆罕默德','Ahmed':'艾哈迈德',
  'Widmer':'威德默','Akanji':'阿坎吉','Elvedi':'埃尔韦迪','Rodríguez':'罗德里格斯',
  'Wesley':'韦斯利','Marquinhos':'马尔基尼奥斯','Gabriel':'加布里埃尔','Douglas Santos':'道格拉斯·桑托斯',
  'Hakimi':'阿什拉夫','Riad':'里亚德','Abqar':'阿布卡尔','Mazraoui':'马兹拉维',
  'Lambese':'兰贝斯','Ricardo Adé':'里卡多·阿德','Duverne':'杜韦尔内','Christian':'克里斯蒂安',
  'Hendry':'亨德利','Hanley':'汉利','Tierney':'蒂尔尼','Patterson':'帕特森','Robertson':'罗伯逊',
  'Dest':'德斯特','Richards':'理查兹','Ream':'里姆','A.Robinson':'安东尼·罗宾逊',
  'R.Rojas':'罗伯特·罗哈斯','Gómez':'戈麦斯','Balbuena':'巴尔武埃纳','Alderete':'阿尔德雷特',
  'Atkinson':'阿特金森','Souttar':'苏塔','Rowles':'罗尔斯','Behich':'贝希奇',
  'Çelik':'切利克','Demiral':'德米拉尔','Bardakcı':'巴尔达克奇','Kadıoğlu':'卡德奥卢',
  'Kimmich':'基米希','Rüdiger':'吕迪格','Schlotterbeck':'施洛特贝克','Raum':'劳姆',
  'Martina':'马蒂纳','Bazoer':'巴祖尔','Van Ewijk':'范埃韦克','Floranus':'弗洛拉努斯',
  'Singo':'辛戈','Ndicka':'恩迪卡','Boly':'博利','Konan':'科南',
  'Preciado':'普雷西亚多','Torres':'托雷斯','Hincapié':'因卡皮耶','Estupiñán':'埃斯图皮尼安',
  'Dumfries':'邓弗里斯','Van Hecke':'范黑克','Van Dijk':'范戴克','Van de Ven':'范德文',
  'Tomiyasu':'富安健洋','Yoshida':'吉田麻也','Itakura':'板仓滉',
  'Starfelt':'斯塔费尔特','Lindelöf':'林德勒夫','Hien':'希恩',
  'Dräger':'德雷格尔','Talbi':'塔尔比','Meriah':'梅里亚','Abdi':'阿卜迪',
  'Meunier':'默尼耶','Ngoy':'恩戈伊','Mechele':'梅赫勒','Castagne':'卡斯塔涅',
  'Hany':'哈尼','Ibrahim':'易卜拉欣','Fathy':'法蒂','Fatouh':'法图',
  'Moharrami':'穆哈拉米','Kanaani':'卡纳尼','Khalilzadeh':'哈利勒扎德','Hajsafi':'哈伊萨菲',
  'Boxall':'博克索尔','Pijnaker':'派纳克','Tuiloma':'图伊洛马','Cacace':'卡卡切',
  'Carvajal':'卡瓦哈尔','Le Normand':'勒诺尔芒','Laporte':'拉波尔特','Cucurella':'库库雷利亚',
  'Diney':'迪内','L.Costa':'洛根·科斯塔','Stopira':'斯托皮拉','Paulo':'保罗',
  'Abdulhamid':'阿卜杜勒哈米德','Al-Tambakti':'坦巴克蒂','Al-Bulaihi':'布莱希','Al-Shahrani':'沙赫拉尼',
  'Varela':'巴雷拉','Cáceres':'卡塞雷斯','S.Bueno':'圣地亚哥·布埃诺','Olivera':'奥利韦拉',
  'Koundé':'孔德','Upamecano':'于帕梅卡诺','Saliba':'萨利巴','T.Hernández':'特奥·埃尔南德斯',
  'A.Mendy':'阿卜杜·门迪','Koulibaly':'库利巴利','Niakhaté':'尼亚凯特','Jakobs':'雅各布斯',
  'Adnan':'阿德南','Natiq':'纳提克','Sulaka':'苏拉卡','Allée':'阿莱',
  'Ryerson':'赖尔森','Ajer':'阿耶尔','Østigård':'厄斯蒂高','Bjørsol':'比约索尔',
  'Molina':'莫利纳','Romero':'罗梅罗','Otamendi':'奥塔门迪','Medina':'梅迪纳',
  'Atal':'阿塔尔','Mandi':'曼迪','Tougai':'图加伊','Aït-Nouri':'艾特-努里',
  'Mwene':'姆韦内','Danso':'丹索','Lienhart':'林哈特','Prass':'普拉斯',
  'Nasib':'纳西布','Al-Arab':'阿拉布','Al-Dmeiri':'德梅里','Al-Ajalin':'阿贾林',
  'Cancelo':'坎塞洛','Rúben Dias':'鲁本·迪亚斯','Gonçalo Inácio':'贡萨洛·伊纳西奥','Nuno Mendes':'努诺·门德斯',
  'Wan-Bissaka':'万-比萨卡','Mbemba':'姆本巴','Inonga':'伊农加','Masuaku':'马苏亚库',
  'Alijonov':'阿利若诺夫','Khusanov':'胡萨诺夫','Ashurmatov':'阿舒尔马托夫','Sayfiev':'萨菲耶夫',
  'Muñoz':'穆尼奥斯','D.Sánchez':'达文森·桑切斯','Cuesta':'库埃斯塔','Mojica':'莫希卡',
  'Reece James':'里斯·詹姆斯','Stones':'斯通斯','Guéhi':'格希',"O'Reilly":"奥莱利",
  'Stanišić':'斯塔尼希奇','Gvardiol':'格瓦迪奥尔','Šutalo':'舒塔洛','Sosa':'索萨',
  'Lamptey':'兰普泰','Amartey':'阿马泰','Salisu':'萨利苏','Mensah':'门萨',
  'Murillo':'穆里略','Córdoba':'科尔多瓦','Escobar':'埃斯科瓦尔','Cummings':'卡明斯','Davis':'戴维斯',
  // Midfielders
  'E.Álvarez':'埃德松·阿尔瓦雷斯','Chávez':'查韦斯','Ruiz':'鲁伊斯',
  'Mokoena':'莫凯纳','Sithole':'西托莱',
  'Hwang In-beom':'黄仁范','Park Yong-woo':'朴镕宇','Lee Kang-in':'李刚仁',
  'Souček':'绍切克','Sadílek':'萨迪莱克',
  'Buchanan':'布坎南','Eustáquio':'欧斯塔基奥','Koné':'科内','Millar':'米勒',
  'Tahirović':'塔希罗维奇','Cimirot':'齐米罗特','Pjanić':'皮亚尼奇','Hadžiahmetović':'哈吉艾哈迈托维奇',
  'Al-Haydos':'海多斯','Boudiaf':'布迪亚夫','Afif':'阿菲夫',
  'Freuler':'弗罗伊勒','Xhaka':'扎卡','Zakaria':'扎卡里亚',
  'Casemiro':'卡塞米罗','Bruno Guimarães':'布鲁诺·吉马良斯','Paquetá':'帕奎塔',
  'Amrabat':'阿姆拉巴特','Ounahi':'欧纳希','Brahim Díaz':'卜拉欣·迪亚斯','Saibari':'赛巴里',
  'Alceus':'阿尔塞乌斯','Bellegarde':'贝勒加德','Picault':'皮科','Etienne':'艾蒂安',
  'McGinn':'麦金','McTominay':'麦克托米奈',
  'McKennie':'麦肯尼','Cardoso':'卡多索','Reyna':'雷纳',
  'Villasanti':'比利亚桑蒂','Almirón':'阿尔米隆','Enciso':'恩西索',
  'Irvine':'欧文','McGree':'麦格里','Genreau':'让罗','Goodwin':'古德温',
  'Çalhanoğlu':'恰尔汗奥卢','Kökçü':'柯克曲','Yazıcı':'亚泽哲',
  'Pavlović':'帕夫洛维奇','Goretzka':'格雷茨卡',
  'Bacuna':'巴库纳','Leerdam':'利尔丹','Anita':'阿尼塔','Kastaneer':'卡斯塔内尔','Chong':'钟塔西',
  'Kessié':'凯西','Traoré':'特拉奥雷',
  'Caicedo':'凯塞多','Gruezo':'格鲁埃索',
  'De Jong':'德容','Gravenberch':'赫拉芬贝赫','Reijnders':'赖因德斯',
  'Dōan':'堂安律','Tanaka':'田中碧','Morita':'守田英正','Nakamura':'中村敬斗','Kubo':'久保建英','Kamada':'镰田大地',
  'Svanberg':'斯万贝里','Bergvall':'贝里瓦尔','Gudmundsson':'古德蒙德松','Ayari':'阿亚里',
  'Skhiri':'斯希里','Laïdouni':'莱杜尼','Mejbri':'梅布里','Ben Slimane':'本·苏莱曼','Gharbi':'加尔比',
  'Onana':'奥纳纳','Tielemans':'蒂勒曼斯',
  'Lasheen':'拉希恩','Attia':'阿提亚','Ashour':'阿舒尔',
  'Jahanbakhsh':'贾汉巴赫什','Ezatolahi':'埃扎托拉希','Ghoddos':'戈多斯','Gholizadeh':'戈利扎德',
  'Garbett':'加伯特','Stamenić':'斯塔梅尼奇','Bell':'贝尔','Singh':'辛格',
  'Rodri':'罗德里','Fabián Ruiz':'法比安·鲁伊斯','Pedri':'佩德里',
  'Rocha Santos':'罗沙·桑托斯','Pina':'皮纳',
  'Al-Malki':'马尔基','Kanno':'卡诺','Al-Dawsari':'达瓦萨里',
  'Valverde':'巴尔韦德','Ugarte':'乌加特','Bentancur':'本坦库尔','M.Araujo':'马克西·阿劳霍',
  'Tchouaméni':'楚阿梅尼','Kanté':'坎特',
  'Camara':'卡马拉','P.Sarr':'帕佩·萨尔','Guèye':'盖耶',
  'Al Ammari':'阿马里','Rasan':'拉桑','Bayesh':'巴耶什','Iqbal':'伊克巴尔','Jasim':'贾西姆',
  'Ødegaard':'厄德高','Berge':'贝格','Aursnes':'奥尔斯内斯',
  'De Paul':'德保罗','Enzo Fernández':'恩佐·费尔南德斯','Mac Allister':'麦卡利斯特',
  'Bentaleb':'本塔莱布','Boudaoui':'布道伊','Zorgane':'佐尔加内',
  'Seiwald':'赛瓦尔德','Grillitsch':'格里利奇','Sabitzer':'萨比策','Baumgartner':'鲍姆加特纳',
  'Al-Taamari':'塔马里','Al-Rawabdeh':'拉瓦布德','Al-Mardi':'马尔迪','Olwan':'奥尔万',
  'Bernardo Silva':'贝尔纳多·席尔瓦','João Neves':'若昂·内维斯','Bruno Fernandes':'布鲁诺·费尔南德斯',
  'Moutoussamy':'穆图萨米','Kayembe':'卡延贝','Kakuta':'卡库塔',
  'Khamrobekov':'哈姆罗别科夫','Shukurov':'舒库罗夫','Masharipov':'马沙里波夫','Fayzullaev':'法伊祖拉耶夫','Turgunboev':'图尔贡博耶夫',
  'Uribe':'乌里韦','Lerma':'莱尔马','James Rodríguez':'哈梅斯·罗德里格斯',
  'Rice':'赖斯','Mainoo':'梅努',
  'Modrić':'莫德里奇','Kovačić':'科瓦契奇','Brozović':'布罗佐维奇',
  'Partey':'帕尔特伊','Kudus':'库杜斯','Samed':'萨梅德',
  'Carrasquilla':'卡拉斯基亚','Godoy':'戈多伊','Martínez':'马丁内斯','Waterman':'沃特曼',
  // Wingers & Attackers
  'Antuna':'安图纳','Giménez':'希门尼斯','Huerta':'韦尔塔',
  'Tau':'塔乌','Zwane':'兹瓦内','Foster':'福斯特','Makgopa':'马克戈帕',
  'Hwang Hee-chan':'黄喜灿','Son':'孙兴慜','Jeong Woo-yeong':'郑优营',
  'Černý':'切尔尼','Schick':'希克','Hložek':'赫洛泽克',
  'David':'乔纳森·戴维','Larin':'拉林',
  'Demirović':'德米罗维奇','Džeko':'哲科',
  'Alaaeldin':'阿拉丁','Ali':'阿里','Mazeed':'马齐德',
  'Ndoye':'恩多耶','Embolo':'恩博洛','Vargas':'巴尔加斯',
  'Raphinha':'拉菲尼亚','Cunha':'库尼亚','Vinícius Jr':'维尼修斯',
  'El Khannouss':'汉努斯','En-Nesyri':'恩内斯里',
  'Nazon':'纳宗','Pierrot':'皮埃罗',
  'Christie':'克里斯蒂','Adams':'亚当斯','Doak':'多克',
  'Weah':'维阿','Balogun':'巴洛贡','Pulisic':'普利西奇',
  'Sanabria':'萨纳夫里亚','Sosa':'索萨',
  'Boyle':'博伊尔','Irankunda':'伊兰昆达',
  'Güler':'居莱尔','Yıldız':'伊尔迪兹','Ünal':'于纳尔',
  'Musiala':'穆西亚拉','Wirtz':'维尔茨','Havertz':'哈弗茨','Undav':'温达夫',
  'Janga':'扬加',
  'Adingra':'阿丁格拉','Haller':'阿莱','Diallo':'阿马德·迪亚洛',
  'Mena':'梅纳','Páez':'派斯','Sarmiento':'萨米恩托','Valencia':'恩纳·瓦伦西亚',
  'Summerville':'萨默维尔','Depay':'德佩','Gakpo':'加克波',
  'Ueda':'上田绮世',
  'Holm':'霍尔姆','Isak':'伊萨克','Gyökeres':'哲凯赖什',
  'Jaziri':'贾齐里',
  'Trossard':'特罗萨德','De Bruyne':'德布劳内','Doku':'多库','De Ketelaere':'德凯特拉雷',
  'Trezeguet':'特雷泽盖','Salah':'萨拉赫','Marmoush':'马尔穆什',
  'Taremi':'塔雷米','Azmoun':'阿兹蒙',
  'Wood':'克里斯·伍德','McCowatt':'麦考瓦特',
  'Yamal':'亚马尔','Oyarzabal':'奥亚萨瓦尔','Ferran Torres':'费兰·托雷斯',
  'Mendes':'门德斯','Monteiro':'蒙泰罗','Tavares':'塔瓦雷斯','Bebé':'贝贝',
  'Al-Buraikan':'布赖坎','Al-Shehri':'谢赫里','Ghareeb':'加里卜',
  'Núñez':'努涅斯','Viñas':'比尼亚斯',
  'Dembélé':'登贝莱','Olise':'奥利塞','Doué':'杜埃','Mbappé':'姆巴佩',
  'I.Sarr':'伊斯梅拉·萨尔','Jackson':'杰克逊','Mané':'马内',
  'Al Hamadi':'哈马迪',
  'Nusa':'努萨','Haaland':'哈兰德','Sørloth':'瑟洛特',
  'Messi':'梅西','Álvarez':'胡利安·阿尔瓦雷斯','Almada':'阿尔马达',
  'Mahrez':'马赫雷斯','Gouiri':'古伊里','Amoura':'阿穆拉',
  'Wimmer':'维默','Arnautović':'阿瑙托维奇',
  'Al-Naimat':'奈马特','Al-Dardour':'达尔杜尔',
  'Pedro Neto':'佩德罗·内托','Ronaldo':'C罗','Leão':'莱昂',
  'Wissa':'维萨','Bakambu':'巴坎布','Bongonda':'邦贡达',
  'Shomurodov':'肖穆罗多夫',
  'Díaz':'路易斯·迪亚斯','Durán':'杜兰','Sinisterra':'西尼斯特拉',
  'Saka':'萨卡','Bellingham':'贝林厄姆','Rashford':'拉什福德','Kane':'凯恩',
  'Pašalić':'帕沙利奇','Budimir':'布迪米尔','Perišić':'佩里希奇',
  'Williams':'伊尼亚基·威廉姆斯','Semenyo':'塞门约','Ayew':'阿尤',
  'Díaz':'迪亚斯',
  // Subs
  'Lozano':'洛萨诺','Jiménez':'劳尔·希门尼斯','Pineda':'皮内达',
  'Mofokeng':'莫福肯','Lorch':'洛奇',
  'Oh Hyeon-gyu':'吴贤揆','Cho Gue-sung':'曹圭成',
  'Kuchta':'库赫塔','Provod':'普罗沃德',
  'Osorio':'奥索里奥','Ahmed':'艾哈迈德',
  'Prevljak':'普雷夫利亚克','Gojak':'戈亚克',
  'Al-Rawi':'拉维','Waad':'瓦德',
  'Amdouni':'阿姆杜尼','Okafor':'奥卡福',
  'Neymar':'内马尔','Endrick':'恩德里克','Martinelli':'马丁内利',
  'Adli':'阿德利','Ezzalzouli':'埃扎洛佐利',
  'Isidor':'伊西多尔','Antoine':'安托万',
  'Gilmour':'吉尔摩','Shankland':'尚克兰',
  'Pepi':'佩皮','Aaronson':'阿伦森',
  'Ávalos':'阿瓦洛斯','Romero':'罗梅罗',
  'Duke':'杜克','Mabil':'马比尔',
  'Aktürkoğlu':'阿克图尔科格鲁',
  'Sané':'萨内','Beier':'拜尔',
  'Antonisse':'安东尼塞','Gorré':'戈雷',
  'Pépé':'佩佩','Konaté':'科纳特',
  'Rodríguez':'罗德里格斯','Plata':'普拉塔',
  'Malen':'马伦','Koopmeiners':'科普迈纳斯',
  'Maeda':'前田大然','J.Ito':'伊东纯也',
  'Kulusevski':'库卢塞夫斯基','Elanga':'埃兰加',
  'Rafia':'拉菲亚','Sassi':'萨西',
  'Lukaku':'卢卡库','Openda':'奥彭达',
  'Zizo':'齐佐','Mostafa':'穆斯塔法',
  'Torabi':'托拉比','Ansarifard':'安萨里法德',
  'Just':'贾斯特','Rojas':'罗哈斯',
  'Nico Williams':'尼科·威廉姆斯','Olmo':'奥尔莫','Grimaldo':'格里马尔多',
  'Andrade':'安德拉德','Semedo':'塞梅多',
  'Al-Aqidi':'阿奇迪','Radif':'拉迪夫',
  'Pellistri':'佩利斯特里',
  'Thuram':'图拉姆','Barcola':'巴尔科拉','Cherki':'谢尔基',
  'Dia':'迪亚','Simons':'西蒙斯',
  'H.Ali':'侯赛因·阿里','Mohanad':'穆哈纳德',
  'Bobb':'博布','Thorstvedt':'托斯特韦特',
  'La.Martínez':'劳塔罗·马丁内斯','González':'尼古拉斯·冈萨雷斯',
  'Chaïbi':'沙伊比','Bounedjah':'布内贾',
  'Gregoritsch':'格雷戈里奇','Schmid':'施密德',
  'Samir':'萨米尔','Rashdan':'拉什丹',
  'Jota':'若塔','Vitinha':'维蒂尼亚',
  'Mayele':'马耶莱','Batubinsika':'巴图宾西卡',
  'Urunov':'乌鲁诺夫','Erkinov':'埃尔基诺夫',
  'Córdoba':'科尔多瓦','Carrascal':'卡拉斯卡尔',
  'Gordon':'安东尼·戈登','Eze':'埃泽','Watkins':'沃特金斯',
  'Petković':'佩特科维奇','Majer':'马耶尔',
  'Nuamah':'努瓦马','Bukari':'布卡里',
  'Gondola':'贡多拉','Yanis':'亚尼斯',
};

const JERSEY_NUM = {
  // Argentina
  'E.Martínez':23,'Molina':26,'Romero':13,'Otamendi':19,'Medina':3,
  'De Paul':7,'Enzo Fernández':24,'Mac Allister':20,
  'Messi':10,'Álvarez':9,'Almada':16,'La.Martínez':22,'González':15,
  // France
  'Maignan':16,'Koundé':5,'Upamecano':4,'Saliba':17,'T.Hernández':22,
  'Tchouaméni':8,'Kanté':13,'Dembélé':11,'Olise':20,'Doué':14,'Mbappé':10,
  'Thuram':9,'Barcola':25,'Cherki':18,
  // Brazil
  'Alisson':1,'Wesley':13,'Marquinhos':3,'Gabriel':14,'Douglas Santos':6,
  'Casemiro':5,'Bruno Guimarães':8,'Paquetá':7,'Raphinha':11,'Cunha':21,'Vinícius Jr':10,
  'Neymar':10,'Endrick':9,'Martinelli':26,
  // Spain
  'Unai Simón':23,'Carvajal':2,'Le Normand':3,'Laporte':14,'Cucurella':17,
  'Rodri':16,'Fabián Ruiz':8,'Pedri':10,'Yamal':19,'Oyarzabal':21,'Ferran Torres':11,
  'Nico Williams':20,'Olmo':25,'Grimaldo':12,
  // England
  'Pickford':1,'Reece James':2,'Stones':5,'Guéhi':6,"O'Reilly":12,
  'Rice':4,'Mainoo':17,'Saka':7,'Bellingham':10,'Rashford':11,'Kane':9,
  'Gordon':18,'Eze':21,'Watkins':19,
  // Germany
  'Neuer':1,'Kimmich':6,'Rüdiger':2,'Schlotterbeck':4,'Raum':3,
  'Pavlović':8,'Goretzka':23,'Musiala':10,'Wirtz':17,'Havertz':7,'Undav':9,
  'Sané':19,'Beier':14,
  // Netherlands
  'Verbruggen':1,'Dumfries':22,'Van Hecke':3,'Van Dijk':4,'Van de Ven':5,
  'De Jong':21,'Gravenberch':8,'Reijnders':14,'Summerville':19,'Depay':10,'Gakpo':11,
  'Malen':18,'Koopmeiners':20,
  // Portugal
  'Diogo Costa':1,'Cancelo':2,'Rúben Dias':3,'Gonçalo Inácio':14,'Nuno Mendes':19,
  'Bernardo Silva':10,'João Neves':15,'Bruno Fernandes':8,'Pedro Neto':7,'Ronaldo':7,'Leão':17,
  'Jota':21,'Vitinha':23,
  // Belgium
  'Courtois':1,'Meunier':15,'Ngoy':4,'Mechele':16,'Castagne':21,
  'Onana':6,'Tielemans':8,'Trossard':17,'De Bruyne':7,'Doku':11,'De Ketelaere':20,
  'Lukaku':9,'Openda':19,
  // Japan
  'Suzuki':1,'Tomiyasu':22,'Yoshida':3,'Itakura':4,
  'Dōan':10,'Tanaka':5,'Morita':13,'Nakamura':17,'Kubo':20,'Kamada':8,
  'Ueda':9,'Maeda':25,'J.Ito':14,
  // Croatia
  'Livaković':1,'Stanišić':2,'Gvardiol':4,'Šutalo':6,'Sosa':3,
  'Modrić':10,'Kovačić':8,'Brozović':11,'Pašalić':15,'Budimir':9,'Perišić':14,
  'Petković':17,'Majer':7,
  // Uruguay
  'Muslera':1,'Varela':13,'Cáceres':3,'S.Bueno':2,'Olivera':16,
  'Valverde':15,'Ugarte':5,'Bentancur':6,'M.Araujo':20,'Núñez':9,'Viñas':18,
  'Pellistri':11,'Rodríguez':10,
  // Colombia
  'Vargas':12,'Muñoz':21,'D.Sánchez':3,'Cuesta':2,'Mojica':17,
  'Uribe':15,'Lerma':16,'James Rodríguez':10,'Díaz':7,'Durán':9,'Sinisterra':19,
  'Córdoba':24,'Carrascal':8,
  // Norway
  'Nyland':1,'Ryerson':2,'Ajer':4,'Østigård':3,'Bjørsol':14,
  'Ødegaard':10,'Berge':6,'Aursnes':8,'Nusa':20,'Haaland':9,'Sørloth':19,
  'Bobb':17,'Thorstvedt':18,
  // Morocco
  'Bono':1,'Hakimi':2,'Riad':6,'Abqar':5,'Mazraoui':3,
  'Amrabat':4,'El Khannouss':8,'Ounahi':23,'Brahim Díaz':10,'Saibari':7,'En-Nesyri':19,
  'Adli':17,'Ezzalzouli':16,
  // USA
  'Turner':1,'Dest':2,'Richards':4,'Ream':13,'A.Robinson':5,
  'McKennie':8,'Cardoso':15,'Reyna':7,'Weah':21,'Balogun':20,'Pulisic':10,
  'Pepi':9,'Aaronson':11,
  // Mexico
  'Ochoa':13,'J.Sánchez':2,'Montes':3,'Vásquez':5,'Arteaga':23,
  'E.Álvarez':4,'Chávez':18,'Ruiz':14,'Antuna':21,'Giménez':9,'Huerta':17,
  'Lozano':11,'Jiménez':22,'Pineda':7,
  // South Korea
  'Kim Seung-gyu':1,'Kim Moon-hwan':15,'Kim Min-jae':4,'Kim Young-gwon':19,'Lee Ki-je':3,
  'Hwang In-beom':6,'Park Yong-woo':5,'Lee Kang-in':18,'Hwang Hee-chan':11,'Son':7,'Jeong Woo-yeong':17,
  'Oh Hyeon-gyu':9,'Cho Gue-sung':20,
  // Sweden
  'Johansson':1,'Starfelt':3,'Lindelöf':4,'Hien':5,
  'Holm':2,'Svanberg':7,'Bergvall':18,'Gudmundsson':8,'Ayari':21,'Isak':9,'Gyökeres':17,
  'Kulusevski':10,'Elanga':19,
  // Switzerland
  'Kobel':1,'Widmer':3,'Akanji':5,'Elvedi':4,'Rodríguez':13,
  'Freuler':8,'Xhaka':10,'Zakaria':6,'Ndoye':23,'Embolo':9,'Vargas':7,
  'Amdouni':19,'Okafor':11,
  // Senegal
  'É.Mendy':16,'A.Mendy':2,'Koulibaly':3,'Niakhaté':4,'Jakobs':22,
  'Camara':6,'P.Sarr':17,'Guèye':5,'I.Sarr':18,'Jackson':7,'Mané':10,
  'Dia':9,'Simons':13,
  // Egypt
  'El Shenawy':1,'Hany':3,'Ibrahim':4,'Fathy':2,'Fatouh':13,
  'Lasheen':17,'Attia':14,'Ashour':8,'Trezeguet':10,'Salah':7,'Marmoush':22,'Zizo':11,'Mostafa':9,
  // Canada
  'Crépeau':18,'Johnston':2,'Bombito':4,'Cornelius':13,'Davies':19,
  'Buchanan':17,'Eustáquio':7,'Koné':8,'Millar':23,'David':20,'Larin':9,'Osorio':21,
  // Austria
  'Pentz':1,'Mwene':2,'Danso':4,'Lienhart':3,'Prass':8,
  'Seiwald':6,'Grillitsch':20,'Wimmer':19,'Sabitzer':9,'Baumgartner':7,'Arnautović':10,
  'Gregoritsch':11,'Schmid':18,
  // Ghana
  'Ati-Zigi':1,'Lamptey':2,'Amartey':4,'Salisu':6,'Mensah':14,
  'Partey':5,'Kudus':10,'Samed':8,'Williams':9,'Semenyo':19,'Ayew':7,
  'Nuamah':13,'Bukari':17,
  // Turkey
  'Çakır':1,'Çelik':2,'Demiral':3,'Bardakcı':4,'Kadıoğlu':20,
  'Çalhanoğlu':10,'Kökçü':6,'Güler':8,'Yazıcı':11,'Yıldız':19,'Ünal':9,
  'Aktürkoğlu':7,
  // Cote d'Ivoire
  'Fofana':1,'Singo':2,'Ndicka':3,'Boly':4,'Konan':5,
  'Kessié':8,'Fofana':6,'Traoré':14,'Adingra':11,'Haller':9,'Diallo':7,'Pépé':19,'Konaté':17,
  // Others – position-based defaults
};

var PLAYER_IMPORTANCE = {
  // 阿根廷
  'Messi':5,'梅西':5,'Álvarez':4,'Enzo Fernández':4,'Mac Allister':4,'De Paul':4,'E.Martínez':4,'Romero':4,'Paredes':3,'Tagliafico':3,'Molina':3,'Otamendi':3,'Almada':3,'La.Martínez':3,
  // 法国
  'Mbappé':5,'姆巴佩':5,'Dembélé':4,'Saliba':4,'Tchouaméni':4,'Kanté':4,'Maignan':4,'Olise':4,'Koundé':3,'Upamecano':3,'T.Hernández':3,'Doué':3,'Thuram':3,'Barcola':3,
  // 巴西
  'Vinícius Jr':5,'Rodrygo':5,'Alisson':4,'Marquinhos':4,'Raphinha':4,'Bruno Guimarães':4,'Casemiro':3,'Paquetá':3,'Gabriel':3,'Neymar':4,'内马尔':4,'Endrick':3,
  // 西班牙
  'Rodri':5,'Yamal':5,'亚马尔':5,'Pedri':4,'Nico Williams':4,'尼科·威廉斯':4,'Carvajal':3,'Laporte':3,'Cucurella':3,'Unai Simón':3,'Fabián Ruiz':3,'Ferran Torres':3,'Oyarzabal':3,'Olmo':3,'Fermín López':2,'费尔明':2,
  // 英格兰
  'Kane':5,'Bellingham':5,'贝林厄姆':5,'Saka':4,'Rice':4,'Foden':4,'Palmer':3,'Pickford':3,'Stones':3,'Rashford':3,'Mainoo':3,'Reece James':3,
  // 德国
  'Musiala':5,'Wirtz':5,'维尔茨':5,'Kimmich':4,'Neuer':4,'Havertz':4,'Rüdiger':3,'Goretzka':3,'Undav':3,'Gnabry':3,
  // 荷兰
  'Van Dijk':5,'De Jong':4,'Gakpo':4,'Simons':4,'Gravenberch':3,'Depay':3,'Dumfries':3,'Van de Ven':3,'Summerville':3,'Timber':3,'de Ligt':3,
  // 葡萄牙
  'Ronaldo':5,'C罗':5,'Bruno Fernandes':5,'B费':5,'Bernardo Silva':4,'Rúben Dias':4,'Leão':4,'Cancelo':3,'Diogo Costa':3,'João Neves':3,'Jota':3,'Vitinha':3,
  // 比利时
  'De Bruyne':5,'德布劳内':5,'Courtois':4,'Doku':4,'Lukaku':4,'Trossard':3,'Tielemans':3,'Onana':3,'De Ketelaere':3,
  // 阿根廷(续)
  'Díaz':4,'James Rodríguez':4,'哈梅斯':4,'Durán':3,
  // 乌拉圭
  'Valverde':4,'巴尔韦德':4,'Núñez':4,'Araújo':4,'阿劳霍':4,'Giménez':4,'希门尼斯':4,'Ugarte':3,'Bentancur':3,'De Arrascaeta':3,'Muslera':3,
  // 日本
  'Kubo':4,'久保':4,'Mitoma':4,'三笘薰':4,'Tomiyasu':3,'Endō':3,'远藤航':3,'Kamada':3,'Ueda':3,'Dōan':3,
  // 韩国
  'Son':5,'孙兴慜':5,'Kim Min-jae':4,'金玟哉':4,'Lee Kang-in':4,'李刚仁':4,'Hwang Hee-chan':3,'Hwang In-beom':3,
  // 摩洛哥
  'Hakimi':4,'阿什拉夫':4,'Brahim Díaz':4,'Bono':3,'Amrabat':3,'En-Nesyri':3,'Aguerd':3,'Mazraoui':3,
  // 塞内加尔
  'Mané':5,'马内':5,'Koulibaly':4,'Jackson':4,'É.Mendy':3,'I.Sarr':3,
  // 埃及
  'Salah':5,'萨拉赫':5,'Marmoush':4,'马尔穆什':4,'Trezeguet':3,
  // 挪威
  'Haaland':5,'哈兰德':5,'Ødegaard':5,'厄德高':5,'Sørloth':3,'Nusa':3,'Bobb':3,
  // 瑞典
  'Isak':5,'伊萨克':5,'Gyökeres':4,'哲凯赖什':4,'Kulusevski':3,'Lindelöf':3,
  // 伊朗
  'Taremi':4,'塔雷米':4,'Azmoun':4,'阿兹蒙':4,'Jahanbakhsh':3,'贾汉巴赫什':3,'Beiranvand':3,
  // 沙特
  'Al-Dawsari':4,'达瓦萨里':4,'Al-Buraikan':3,'Al-Shehri':3,
  // 卡塔尔
  'Afif':4,'阿菲夫':4,'Ali':3,'Al-Haydos':3,
  // 澳大利亚
  'Souttar':3,'Irankunda':3,'Ryan':3,'Goodwin':3,
  // 加拿大
  'Davies':5,'戴维斯':5,'David':4,'乔纳森·戴维':4,'Buchanan':3,'Larin':3,
  // 美国
  'Pulisic':4,'普利西奇':4,'Balogun':3,'McKennie':3,'Reyna':3,'Dest':3,
  // 墨西哥
  'Giménez':3,'Ochoa':3,'Lozano':3,'Álvarez':3,
  // 克罗地亚
  'Modrić':5,'莫德里奇':5,'Gvardiol':4,'格瓦迪奥尔':4,'Kovačić':3,'Brozović':3,'Perišić':3,
  // 瑞士
  'Xhaka':4,'扎卡':4,'Akanji':4,'阿坎吉':4,'Embolo':3,'Kobel':3,
  // 奥地利
  'Sabitzer':4,'萨比策':4,'Alaba':4,'阿拉巴':4,'Baumgartner':3,'鲍姆加特纳':3,'Arnautović':3,
  // 土耳其
  'Çalhanoğlu':4,'Güler':4,'居莱尔':4,'Yıldız':4,'Demiral':3,
  // 其他
  'Mahrez':4,'马赫雷斯':4,'Amoura':3,'Gouiri':3,'Bensebaini':3,
  'Schick':3,'Souček':3,'绍切克':3,'Hložek':3,
  'McGinn':3,'McTominay':3,'Robertson':3,'Tierney':3,
  'Džeko':4,'哲科':4,'Pjanić':3,
  'Caicedo':4,'凯塞多':4,'Estupiñán':3,'Hincapié':3,
  'Kessié':3,'Haller':3,'Adingra':3,'Diallo':3,
  'Wood':4,'克里斯·伍德':4,'Cacace':3,
  // 通用: 门将默认重要性略低
}

const TEAM_ODDS = {
  // Group A
  MEX: {odds:67.0, opta:1.8}, RSA: {odds:351.0, opta:0.2}, KOR: {odds:126.0, opta:0.8}, CZE: {odds:151.0, opta:0.6},
  // Group B
  CAN: {odds:126.0, opta:0.8}, BIH: {odds:301.0, opta:0.2}, QAT: {odds:251.0, opta:0.3}, SUI: {odds:81.0, opta:1.1},
  // Group C
  BRA: {odds:9.0, opta:6.7}, MAR: {odds:51.0, opta:1.8}, HAI: {odds:1001.0, opta:0.1}, SCO: {odds:151.0, opta:0.6},
  // Group D
  USA: {odds:67.0, opta:2.1}, PAR: {odds:351.0, opta:0.2}, AUS: {odds:201.0, opta:0.4}, TUR: {odds:101.0, opta:0.9},
  // Group E
  GER: {odds:15.0, opta:5.7}, CUW: {odds:3501.0, opta:0.0}, CIV: {odds:81.0, opta:1.1}, ECU: {odds:126.0, opta:0.7},
  // Group F
  NED: {odds:21.0, opta:3.7}, JPN: {odds:51.0, opta:1.8}, SWE: {odds:81.0, opta:1.0}, TUN: {odds:251.0, opta:0.3},
  // Group G
  BEL: {odds:34.0, opta:2.4}, EGY: {odds:101.0, opta:0.9}, IRN: {odds:151.0, opta:0.5}, NZL: {odds:501.0, opta:0.1},
  // Group H
  ESP: {odds:5.5, opta:16.4}, CPV: {odds:1001.0, opta:0.1}, KSA: {odds:301.0, opta:0.2}, URU: {odds:67.0, opta:2.0},
  // Group I (Group of Death)
  FRA: {odds:6.0, opta:12.8}, SEN: {odds:67.0, opta:1.5}, IRQ: {odds:751.0, opta:0.1}, NOR: {odds:26.0, opta:3.2},
  // Group J
  ARG: {odds:10.0, opta:10.4}, ALG: {odds:151.0, opta:0.5}, AUT: {odds:101.0, opta:0.9}, JOR: {odds:501.0, opta:0.1},
  // Group K
  POR: {odds:9.0, opta:6.9}, COD: {odds:301.0, opta:0.2}, UZB: {odds:401.0, opta:0.1}, COL: {odds:34.0, opta:3.0},
  // Group L
  ENG: {odds:7.5, opta:11.3}, CRO: {odds:51.0, opta:1.7}, GHA: {odds:151.0, opta:0.5}, PAN: {odds:501.0, opta:0.1},
};

const MATCH_ODDS = {
  // June 12
  m001: {h:1.95, d:3.40, a:3.80}, m002: {h:2.10, d:3.20, a:3.50},
  // June 13
  m003: {h:2.05, d:3.30, a:3.60}, m004: {h:2.05, d:3.20, a:3.90},
  // June 14
  m005: {h:18.90, d:5.60, a:1.25}, m006: {h:1.58, d:3.64, a:5.50}, m007: {h:6.00, d:4.60, a:1.42}, m008: {h:4.20, d:3.59, a:1.75},
  // June 15
  m009: {h:1.02, d:12.00, a:34.00}, m010: {h:1.90, d:3.57, a:3.51}, m011: {h:3.70, d:2.70, a:2.23}, m012: {h:1.88, d:3.25, a:3.98},
  // June 16
  m013: {h:1.08, d:8.30, a:23.00}, m014: {h:1.60, d:3.82, a:4.90}, m015: {h:15.70, d:4.10, a:1.49}, m016: {h:1.82, d:3.41, a:4.10},
  // June 17
  m017: {h:1.42, d:4.30, a:6.60}, m018: {h:19.20, d:6.00, a:1.23}, m019: {h:1.40, d:4.10, a:7.50}, m020: {h:1.31, d:5.00, a:7.80},
  // June 18
  m021: {h:1.24, d:5.50, a:9.80}, m022: {h:1.71, d:3.60, a:4.33}, m023: {h:1.94, d:3.59, a:3.38}, m024: {h:17.60, d:4.30, a:1.38},
  // June 19 (MD2) — estimated
  m025: {h:2.50, d:3.10, a:2.80}, m026: {h:1.92, d:3.30, a:4.00}, m027: {h:1.35, d:4.50, a:8.50}, m028: {h:1.85, d:3.50, a:4.00},
  // June 20
  m029: {h:2.10, d:3.20, a:3.50}, m030: {h:1.75, d:3.60, a:4.50}, m031: {h:1.08, d:9.00, a:21.00}, m032: {h:1.55, d:3.80, a:5.80},
  // June 21
  m033: {h:1.28, d:4.80, a:9.50}, m034: {h:1.18, d:6.00, a:14.00}, m035: {h:1.75, d:3.50, a:4.40}, m036: {h:1.35, d:4.40, a:8.00},
  // June 22
  m037: {h:1.45, d:4.00, a:6.80}, m038: {h:1.15, d:7.00, a:16.00}, m039: {h:1.06, d:9.50, a:26.00}, m040: {h:1.08, d:8.50, a:23.00},
  // June 23
  m041: {h:1.04, d:11.00, a:36.00}, m042: {h:2.40, d:3.30, a:2.85}, m043: {h:1.38, d:4.20, a:8.00}, m044: {h:1.82, d:3.50, a:4.10},
  // June 24
  m045: {h:1.08, d:9.00, a:21.00}, m046: {h:1.36, d:4.30, a:8.50}, m047: {h:1.25, d:5.00, a:10.50}, m048: {h:1.55, d:3.80, a:5.80},
  // June 25-28 (MD3) — estimated
  m049: {h:1.90, d:3.30, a:4.10}, m050: {h:1.62, d:3.70, a:5.20}, m051: {h:2.60, d:3.30, a:2.55}, m052: {h:2.90, d:3.40, a:2.30},
  m053: {h:1.18, d:6.50, a:13.00}, m054: {h:1.05, d:12.00, a:30.00}, m055: {h:1.45, d:4.10, a:6.80}, m056: {h:1.35, d:4.50, a:8.40},
  m057: {h:1.30, d:5.00, a:9.00}, m058: {h:2.15, d:3.30, a:3.20}, m059: {h:1.95, d:3.40, a:3.70}, m060: {h:4.00, d:3.50, a:1.85},
  m061: {h:1.08, d:9.00, a:21.00}, m062: {h:1.70, d:3.50, a:4.80}, m063: {h:1.61, d:3.70, a:5.40}, m064: {h:4.50, d:4.00, a:1.65},
  m065: {h:1.53, d:4.10, a:5.50}, m066: {h:1.15, d:7.00, a:15.00}, m067: {h:1.06, d:10.00, a:28.00}, m068: {h:2.30, d:3.30, a:2.95},
  m069: {h:2.00, d:3.40, a:3.50}, m070: {h:1.62, d:3.80, a:5.00}, m071: {h:1.12, d:8.00, a:18.00}, m072: {h:1.55, d:3.90, a:5.80},
};

const MATCH_SCHEDULE = [
  {id:"m001",date:"2026-06-12",time:"03:00",home:"MEX",away:"RSA",grp:"A",stage:"group",matchday:1,venue:"Estadio Azteca, Mexico City",featured:true},
  {id:"m002",date:"2026-06-12",time:"10:00",home:"KOR",away:"CZE",grp:"A",stage:"group",matchday:1,venue:"Estadio Akron, Guadalajara",featured:true},
  {id:"m003",date:"2026-06-13",time:"03:00",home:"CAN",away:"BIH",grp:"B",stage:"group",matchday:1,venue:"BMO Field, Toronto",featured:true},
  {id:"m004",date:"2026-06-13",time:"09:00",home:"USA",away:"PAR",grp:"D",stage:"group",matchday:1,venue:"SoFi Stadium, Inglewood",featured:true},
  {id:"m005",date:"2026-06-14",time:"03:00",home:"QAT",away:"SUI",grp:"B",stage:"group",matchday:1,venue:"Levi's Stadium, Santa Clara"},
  {id:"m006",date:"2026-06-14",time:"06:00",home:"BRA",away:"MAR",grp:"C",stage:"group",matchday:1,venue:"MetLife Stadium, East Rutherford"},
  {id:"m007",date:"2026-06-14",time:"09:00",home:"HAI",away:"SCO",grp:"C",stage:"group",matchday:1,venue:"Gillette Stadium, Boston"},
  {id:"m008",date:"2026-06-14",time:"12:00",home:"AUS",away:"TUR",grp:"D",stage:"group",matchday:1,venue:"BC Place, Vancouver"},
  {id:"m009",date:"2026-06-15",time:"01:00",home:"GER",away:"CUW",grp:"E",stage:"group",matchday:1,venue:"NRG Stadium, Houston"},
  {id:"m010",date:"2026-06-15",time:"04:00",home:"NED",away:"JPN",grp:"F",stage:"group",matchday:1,venue:"AT&T Stadium, Arlington"},
  {id:"m011",date:"2026-06-15",time:"07:00",home:"CIV",away:"ECU",grp:"E",stage:"group",matchday:1,venue:"Lincoln Financial Field, Philadelphia"},
  {id:"m012",date:"2026-06-15",time:"10:00",home:"SWE",away:"TUN",grp:"F",stage:"group",matchday:1,venue:"Estadio BBVA, Monterrey"},
  {id:"m013",date:"2026-06-16",time:"00:00",home:"ESP",away:"CPV",grp:"H",stage:"group",matchday:1,venue:"Mercedes-Benz Stadium, Atlanta"},
  {id:"m014",date:"2026-06-16",time:"03:00",home:"BEL",away:"EGY",grp:"G",stage:"group",matchday:1,venue:"Lumen Field, Seattle"},
  {id:"m015",date:"2026-06-16",time:"06:00",home:"KSA",away:"URU",grp:"H",stage:"group",matchday:1,venue:"Hard Rock Stadium, Miami Gardens"},
  {id:"m016",date:"2026-06-16",time:"09:00",home:"IRN",away:"NZL",grp:"G",stage:"group",matchday:1,venue:"SoFi Stadium, Inglewood"},
  {id:"m017",date:"2026-06-17",time:"03:00",home:"FRA",away:"SEN",grp:"I",stage:"group",matchday:1,venue:"MetLife Stadium, East Rutherford"},
  {id:"m018",date:"2026-06-17",time:"06:00",home:"IRQ",away:"NOR",grp:"I",stage:"group",matchday:1,venue:"Gillette Stadium, Boston"},
  {id:"m019",date:"2026-06-17",time:"09:00",home:"ARG",away:"ALG",grp:"J",stage:"group",matchday:1,venue:"Arrowhead Stadium, Kansas City"},
  {id:"m020",date:"2026-06-17",time:"12:00",home:"AUT",away:"JOR",grp:"J",stage:"group",matchday:1,venue:"Levi's Stadium, Santa Clara"},
  {id:"m021",date:"2026-06-18",time:"01:00",home:"POR",away:"COD",grp:"K",stage:"group",matchday:1,venue:"NRG Stadium, Houston"},
  {id:"m022",date:"2026-06-18",time:"04:00",home:"ENG",away:"CRO",grp:"L",stage:"group",matchday:1,venue:"AT&T Stadium, Arlington"},
  {id:"m023",date:"2026-06-18",time:"07:00",home:"GHA",away:"PAN",grp:"L",stage:"group",matchday:1,venue:"BMO Field, Toronto"},
  {id:"m024",date:"2026-06-18",time:"10:00",home:"UZB",away:"COL",grp:"K",stage:"group",matchday:1,venue:"Estadio Azteca, Mexico City"},
  {id:"m025",date:"2026-06-19",time:"00:00",home:"CZE",away:"RSA",grp:"A",stage:"group",matchday:2,venue:"Mercedes-Benz Stadium, Atlanta",featured:true},
  {id:"m026",date:"2026-06-19",time:"03:00",home:"SUI",away:"BIH",grp:"B",stage:"group",matchday:2,venue:"SoFi Stadium, Los Angeles"},
  {id:"m027",date:"2026-06-19",time:"06:00",home:"CAN",away:"QAT",grp:"B",stage:"group",matchday:2,venue:"BC Place, Vancouver"},
  {id:"m028",date:"2026-06-19",time:"09:00",home:"MEX",away:"KOR",grp:"A",stage:"group",matchday:2,venue:"Estadio Akron, Guadalajara"},
  {id:"m029",date:"2026-06-20",time:"03:00",home:"USA",away:"AUS",grp:"D",stage:"group",matchday:2,venue:"Lumen Field, Seattle"},
  {id:"m030",date:"2026-06-20",time:"06:00",home:"SCO",away:"MAR",grp:"C",stage:"group",matchday:2,venue:"Gillette Stadium, Boston"},
  {id:"m031",date:"2026-06-20",time:"08:30",home:"BRA",away:"HAI",grp:"C",stage:"group",matchday:2,venue:"Lincoln Financial Field, Philadelphia"},
  {id:"m032",date:"2026-06-20",time:"11:00",home:"TUR",away:"PAR",grp:"D",stage:"group",matchday:2,venue:"Levi's Stadium, San Francisco Bay Area"},
  {id:"m033",date:"2026-06-21",time:"01:00",home:"NED",away:"SWE",grp:"F",stage:"group",matchday:2,venue:"NRG Stadium, Houston"},
  {id:"m034",date:"2026-06-21",time:"04:00",home:"GER",away:"CIV",grp:"E",stage:"group",matchday:2,venue:"BMO Field, Toronto"},
  {id:"m035",date:"2026-06-21",time:"08:00",home:"ECU",away:"CUW",grp:"E",stage:"group",matchday:2,venue:"Arrowhead Stadium, Kansas City"},
  {id:"m036",date:"2026-06-21",time:"12:00",home:"TUN",away:"JPN",grp:"F",stage:"group",matchday:2,venue:"Estadio BBVA, Monterrey"},
  {id:"m037",date:"2026-06-22",time:"00:00",home:"ESP",away:"KSA",grp:"H",stage:"group",matchday:2,venue:"Mercedes-Benz Stadium, Atlanta"},
  {id:"m038",date:"2026-06-22",time:"03:00",home:"BEL",away:"IRN",grp:"G",stage:"group",matchday:2,venue:"SoFi Stadium, Los Angeles"},
  {id:"m039",date:"2026-06-22",time:"06:00",home:"URU",away:"CPV",grp:"H",stage:"group",matchday:2,venue:"Hard Rock Stadium, Miami"},
  {id:"m040",date:"2026-06-22",time:"09:00",home:"NZL",away:"EGY",grp:"G",stage:"group",matchday:2,venue:"BC Place, Vancouver"},
  {id:"m041",date:"2026-06-23",time:"01:00",home:"ARG",away:"AUT",grp:"J",stage:"group",matchday:2,venue:"AT&T Stadium, Dallas"},
  {id:"m042",date:"2026-06-23",time:"05:00",home:"FRA",away:"IRQ",grp:"I",stage:"group",matchday:2,venue:"Lincoln Financial Field, Philadelphia"},
  {id:"m043",date:"2026-06-23",time:"08:00",home:"NOR",away:"SEN",grp:"I",stage:"group",matchday:2,venue:"MetLife Stadium, New York New Jersey"},
  {id:"m044",date:"2026-06-23",time:"11:00",home:"JOR",away:"ALG",grp:"J",stage:"group",matchday:2,venue:"Levi's Stadium, San Francisco Bay Area"},
  {id:"m045",date:"2026-06-24",time:"01:00",home:"POR",away:"UZB",grp:"K",stage:"group",matchday:2,venue:"NRG Stadium, Houston"},
  {id:"m046",date:"2026-06-24",time:"04:00",home:"ENG",away:"GHA",grp:"L",stage:"group",matchday:2,venue:"Gillette Stadium, Boston"},
  {id:"m047",date:"2026-06-24",time:"07:00",home:"PAN",away:"CRO",grp:"L",stage:"group",matchday:2,venue:"BMO Field, Toronto"},
  {id:"m048",date:"2026-06-24",time:"10:00",home:"COL",away:"COD",grp:"K",stage:"group",matchday:2,venue:"Estadio Akron, Guadalajara"},
  {id:"m049",date:"2026-06-25",time:"03:00",home:"SUI",away:"CAN",grp:"B",stage:"group",matchday:3,venue:"BC Place, Vancouver"},
  {id:"m050",date:"2026-06-25",time:"03:00",home:"BIH",away:"QAT",grp:"B",stage:"group",matchday:3,venue:"Lumen Field, Seattle"},
  {id:"m051",date:"2026-06-25",time:"06:00",home:"MAR",away:"HAI",grp:"C",stage:"group",matchday:3,venue:"Mercedes-Benz Stadium, Atlanta"},
  {id:"m052",date:"2026-06-25",time:"06:00",home:"SCO",away:"BRA",grp:"C",stage:"group",matchday:3,venue:"Hard Rock Stadium, Miami"},
  {id:"m053",date:"2026-06-25",time:"09:00",home:"CZE",away:"MEX",grp:"A",stage:"group",matchday:3,venue:"Estadio Azteca, Mexico City"},
  {id:"m054",date:"2026-06-25",time:"09:00",home:"RSA",away:"KOR",grp:"A",stage:"group",matchday:3,venue:"Estadio BBVA, Monterrey"},
  {id:"m055",date:"2026-06-26",time:"04:00",home:"ECU",away:"GER",grp:"E",stage:"group",matchday:3,venue:"MetLife Stadium, New York New Jersey"},
  {id:"m056",date:"2026-06-26",time:"04:00",home:"CUW",away:"CIV",grp:"E",stage:"group",matchday:3,venue:"Lincoln Financial Field, Philadelphia"},
  {id:"m057",date:"2026-06-26",time:"07:00",home:"JPN",away:"SWE",grp:"F",stage:"group",matchday:3,venue:"AT&T Stadium, Dallas"},
  {id:"m058",date:"2026-06-26",time:"07:00",home:"TUN",away:"NED",grp:"F",stage:"group",matchday:3,venue:"Arrowhead Stadium, Kansas City"},
  {id:"m059",date:"2026-06-26",time:"10:00",home:"TUR",away:"USA",grp:"D",stage:"group",matchday:3,venue:"SoFi Stadium, Los Angeles"},
  {id:"m060",date:"2026-06-26",time:"10:00",home:"PAR",away:"AUS",grp:"D",stage:"group",matchday:3,venue:"Levi's Stadium, San Francisco Bay Area"},
  {id:"m061",date:"2026-06-27",time:"03:00",home:"SEN",away:"IRQ",grp:"I",stage:"group",matchday:3,venue:"BMO Field, Toronto"},
  {id:"m062",date:"2026-06-27",time:"03:00",home:"NOR",away:"FRA",grp:"I",stage:"group",matchday:3,venue:"Gillette Stadium, Boston"},
  {id:"m063",date:"2026-06-27",time:"08:00",home:"URU",away:"ESP",grp:"H",stage:"group",matchday:3,venue:"Estadio Akron, Guadalajara"},
  {id:"m064",date:"2026-06-27",time:"08:00",home:"CPV",away:"KSA",grp:"H",stage:"group",matchday:3,venue:"NRG Stadium, Houston"},
  {id:"m065",date:"2026-06-27",time:"11:00",home:"EGY",away:"IRN",grp:"G",stage:"group",matchday:3,venue:"Lumen Field, Seattle"},
  {id:"m066",date:"2026-06-27",time:"11:00",home:"NZL",away:"BEL",grp:"G",stage:"group",matchday:3,venue:"BC Place, Vancouver"},
  {id:"m067",date:"2026-06-28",time:"05:00",home:"CRO",away:"GHA",grp:"L",stage:"group",matchday:3,venue:"Lincoln Financial Field, Philadelphia"},
  {id:"m068",date:"2026-06-28",time:"05:00",home:"PAN",away:"ENG",grp:"L",stage:"group",matchday:3,venue:"MetLife Stadium, New York New Jersey"},
  {id:"m069",date:"2026-06-28",time:"07:30",home:"COL",away:"POR",grp:"K",stage:"group",matchday:3,venue:"Hard Rock Stadium, Miami"},
  {id:"m070",date:"2026-06-28",time:"07:30",home:"COD",away:"UZB",grp:"K",stage:"group",matchday:3,venue:"Mercedes-Benz Stadium, Atlanta"},
  {id:"m071",date:"2026-06-28",time:"10:00",home:"ALG",away:"AUT",grp:"J",stage:"group",matchday:3,venue:"Arrowhead Stadium, Kansas City"},
  {id:"m072",date:"2026-06-28",time:"10:00",home:"JOR",away:"ARG",grp:"J",stage:"group",matchday:3,venue:"AT&T Stadium, Dallas"},

  // ===== ROUND OF 32 (from API dates) =====
  {id:"m073",date:"2026-06-29",time:"03:00",home:"RSA",away:"CAN",grp:"KO",stage:"r32",venue:"MetLife Stadium, East Rutherford"},
  {id:"m076",date:"2026-06-29",time:"05:00",home:"USA",away:"BIH",grp:"KO",stage:"r32",venue:"SoFi Stadium, Los Angeles"},
  {id:"m074",date:"2026-06-30",time:"02:00",home:"BRA",away:"JPN",grp:"KO",stage:"r32",venue:"AT&T Stadium, Dallas"},
  {id:"m075",date:"2026-06-30",time:"05:00",home:"NED",away:"MAR",grp:"KO",stage:"r32",venue:"Mercedes-Benz Stadium, Atlanta"},
  {id:"m078",date:"2026-06-30",time:"08:00",home:"GER",away:"PAR",grp:"KO",stage:"r32",venue:"Gillette Stadium, Boston"},
  {id:"m077",date:"2026-07-01",time:"02:00",home:"CIV",away:"NOR",grp:"KO",stage:"r32",venue:"Arrowhead Stadium, Kansas City"},
  {id:"m079",date:"2026-07-01",time:"05:00",home:"FRA",away:"SWE",grp:"KO",stage:"r32",venue:"BC Place, Vancouver"},
  {id:"m082",date:"2026-07-01",time:"08:00",home:"MEX",away:"ECU",grp:"KO",stage:"r32",venue:"Levi's Stadium, San Francisco"},
  {id:"m083",date:"2026-07-02",time:"02:00",home:"ENG",away:"COD",grp:"KO",stage:"r32",venue:"NRG Stadium, Houston"},
  {id:"m084",date:"2026-07-02",time:"05:00",home:"BEL",away:"SEN",grp:"KO",stage:"r32",venue:"Lincoln Financial Field, Philadelphia"},
  {id:"m085",date:"2026-07-02",time:"08:00",home:"POR",away:"CRO",grp:"KO",stage:"r32",venue:"MetLife Stadium, East Rutherford"},
  {id:"m087",date:"2026-07-03",time:"02:00",home:"ESP",away:"AUT",grp:"KO",stage:"r32",venue:"AT&T Stadium, Dallas"},
  {id:"m088",date:"2026-07-03",time:"05:00",home:"SUI",away:"ALG",grp:"KO",stage:"r32",venue:"Gillette Stadium, Boston"},
  {id:"m080",date:"2026-07-03",time:"08:00",home:"AUS",away:"EGY",grp:"KO",stage:"r32",venue:"Hard Rock Stadium, Miami"},
  {id:"m081",date:"2026-07-03",time:"23:00",home:"ARG",away:"CPV",grp:"KO",stage:"r32",venue:"Levi's Stadium, San Francisco"},
  {id:"m086",date:"2026-07-04",time:"02:00",home:"COL",away:"GHA",grp:"KO",stage:"r32",venue:"AT&T Stadium, Dallas"},

  // ===== ROUND OF 16 (7/4 - 7/6) =====
  {id:"m089",date:"2026-07-04",time:"23:00",home:"?",away:"?",grp:"KO",stage:"r16",venue:"Arrowhead Stadium, Kansas City"},
  {id:"m090",date:"2026-07-05",time:"02:00",home:"?",away:"?",grp:"KO",stage:"r16",venue:"Gillette Stadium, Boston"},
  {id:"m091",date:"2026-07-05",time:"05:00",home:"?",away:"?",grp:"KO",stage:"r16",venue:"BC Place, Vancouver"},
  {id:"m092",date:"2026-07-05",time:"08:00",home:"?",away:"?",grp:"KO",stage:"r16",venue:"Lumen Field, Seattle"},
  {id:"m093",date:"2026-07-05",time:"23:00",home:"?",away:"?",grp:"KO",stage:"r16",venue:"Levi's Stadium, San Francisco"},
  {id:"m094",date:"2026-07-06",time:"02:00",home:"?",away:"?",grp:"KO",stage:"r16",venue:"Hard Rock Stadium, Miami"},
  {id:"m095",date:"2026-07-06",time:"05:00",home:"?",away:"?",grp:"KO",stage:"r16",venue:"NRG Stadium, Houston"},
  {id:"m096",date:"2026-07-06",time:"08:00",home:"?",away:"?",grp:"KO",stage:"r16",venue:"Lincoln Financial Field, Philadelphia"},

  // ===== QUARTER-FINALS (7/8 - 7/11) =====
  {id:"m097",date:"2026-07-08",time:"23:00",home:"?",away:"?",grp:"KO",stage:"qf",venue:"MetLife Stadium, East Rutherford"},
  {id:"m098",date:"2026-07-09",time:"23:00",home:"?",away:"?",grp:"KO",stage:"qf",venue:"AT&T Stadium, Dallas"},
  {id:"m099",date:"2026-07-10",time:"23:00",home:"?",away:"?",grp:"KO",stage:"qf",venue:"Mercedes-Benz Stadium, Atlanta"},
  {id:"m100",date:"2026-07-11",time:"23:00",home:"?",away:"?",grp:"KO",stage:"qf",venue:"SoFi Stadium, Los Angeles"},

  // ===== SEMI-FINALS (7/14 - 7/15) =====
  {id:"m101",date:"2026-07-14",time:"23:00",home:"?",away:"?",grp:"KO",stage:"sf",venue:"AT&T Stadium, Dallas"},
  {id:"m102",date:"2026-07-15",time:"23:00",home:"?",away:"?",grp:"KO",stage:"sf",venue:"Mercedes-Benz Stadium, Atlanta"},

  // ===== FINAL (7/18 - 7/19) =====
  {id:"m103",date:"2026-07-18",time:"23:00",home:"?",away:"?",grp:"KO",stage:"tpp",venue:"MetLife Stadium, East Rutherford"},
  {id:"m104",date:"2026-07-19",time:"23:00",home:"?",away:"?",grp:"KO",stage:"final",venue:"MetLife Stadium, East Rutherford"}
];
function cnName(englishName) {
  var clean = englishName.replace('(C)','').trim();
  if (PLAYER_CN[clean]) return PLAYER_CN[clean];
  return clean;
}
function getTeamOdds(teamId) { return TEAM_ODDS[teamId] || { odds: 500, opta: 0.1 }; }

const ODDS_FINE = {
  "1.1-1.2":{"n":76,"H":0.8289,"D":0.1447,"A":0.0263},
  "1.2-1.3":{"n":141,"H":0.7801,"D":0.1844,"A":0.0355},
  "1.3-1.4":{"n":234,"H":0.7436,"D":0.1667,"A":0.0897},
  "1.4-1.5":{"n":287,"H":0.7143,"D":0.1916,"A":0.0941},
  "1.5-1.6":{"n":418,"H":0.6244,"D":0.201,"A":0.1746},
  "1.6-1.7":{"n":503,"H":0.5805,"D":0.2783,"A":0.1412},
  "1.7-1.8":{"n":512,"H":0.5645,"D":0.2422,"A":0.1934},
  "1.8-1.9":{"n":561,"H":0.5419,"D":0.2656,"A":0.1925},
  "1.9-2.0":{"n":606,"H":0.4917,"D":0.2591,"A":0.2492},
  "2.0-2.1":{"n":542,"H":0.4613,"D":0.2934,"A":0.2454},
  "2.1-2.2":{"n":526,"H":0.4506,"D":0.2814,"A":0.2681},
  "2.2-2.3":{"n":655,"H":0.4122,"D":0.3008,"A":0.287},
  "2.3-2.4":{"n":525,"H":0.4362,"D":0.2743,"A":0.2895},
  "2.4-2.5":{"n":374,"H":0.3984,"D":0.3075,"A":0.2941},
  "2.5-2.6":{"n":349,"H":0.3811,"D":0.3095,"A":0.3095},
  "2.6-2.7":{"n":320,"H":0.3625,"D":0.2906,"A":0.3469},
  "2.7-2.8":{"n":360,"H":0.3139,"D":0.3167,"A":0.3694},
  "2.8-2.9":{"n":310,"H":0.3,"D":0.3194,"A":0.3806},
  "2.9-3.0":{"n":146,"H":0.3425,"D":0.2945,"A":0.363},
  "3.0-3.1":{"n":212,"H":0.3208,"D":0.3019,"A":0.3774},
  "3.1-3.2":{"n":187,"H":0.3048,"D":0.2513,"A":0.4439},
  "3.2-3.3":{"n":212,"H":0.3349,"D":0.2264,"A":0.4387},
  "3.3-3.4":{"n":122,"H":0.1885,"D":0.3279,"A":0.4836},
  "3.4-3.5":{"n":125,"H":0.24,"D":0.304,"A":0.456},
  "3.5-3.6":{"n":98,"H":0.2245,"D":0.2143,"A":0.5612},
  "3.6-3.7":{"n":123,"H":0.2764,"D":0.252,"A":0.4715},
  "3.7-3.8":{"n":94,"H":0.3085,"D":0.2979,"A":0.3936},
  "3.8-3.9":{"n":87,"H":0.2759,"D":0.2299,"A":0.4943},
  "4.0-4.1":{"n":110,"H":0.2,"D":0.2364,"A":0.5636},
  "4.2-4.3":{"n":105,"H":0.2571,"D":0.219,"A":0.5238},
  "4.3-4.4":{"n":71,"H":0.1268,"D":0.2535,"A":0.6197},
  "4.5-4.6":{"n":63,"H":0.2063,"D":0.3016,"A":0.4921},
  "4.7-4.8":{"n":89,"H":0.2584,"D":0.2584,"A":0.4831},
  "5-6":{"n":128,"H":0.1562,"D":0.2422,"A":0.6016},
  "5.0-5.1":{"n":63,"H":0.1905,"D":0.2698,"A":0.5397},
  "6-7":{"n":74,"H":0.0541,"D":0.2162,"A":0.7297},
  "7-8":{"n":50,"H":0.1,"D":0.32,"A":0.58},
  "8-9":{"n":32,"H":0.25,"D":0.0938,"A":0.6562},
  "9-10":{"n":20,"H":0.1,"D":0,"A":0.9},
  "10+":{"n":20,"H":0.1,"D":0.15,"A":0.75}
};

const ODDS_STATS = {
  "1.01-1.15":{"n":54,"H":0.8889,"D":0.0741,"A":0.037},
  "1.16-1.25":{"n":141,"H":0.7872,"D":0.1844,"A":0.0284},
  "1.26-1.40":{"n":382,"H":0.7513,"D":0.1675,"A":0.0812},
  "1.41-1.55":{"n":483,"H":0.6563,"D":0.1967,"A":0.147},
  "1.56-1.70":{"n":786,"H":0.5802,"D":0.2583,"A":0.1616},
  "1.71-1.85":{"n":902,"H":0.5477,"D":0.2616,"A":0.1907},
  "1.86-2.00":{"n":898,"H":0.4822,"D":0.2706,"A":0.2472},
  "2.01-2.20":{"n":1114,"H":0.4408,"D":0.2944,"A":0.2648},
  "2.21-2.50":{"n":1415,"H":0.4141,"D":0.2919,"A":0.294},
  "2.51-3.00":{"n":1498,"H":0.3311,"D":0.3051,"A":0.3638},
  "3.01-4.00":{"n":1163,"H":0.27,"D":0.258,"A":0.4721},
  "4.01-6.00":{"n":560,"H":0.1893,"D":0.25,"A":0.5607},
  "6.01-10.00":{"n":141,"H":0.1206,"D":0.1915,"A":0.6879},
  "10.01+":{"n":20,"H":0.1,"D":0.15,"A":0.75}
};

const NEWS_SOURCES = [
  'https://www.espn.com/espn/rss/soccer/news',
  'https://feeds.bbci.co.uk/sport/football/rss.xml',
  'https://www.skysports.com/rss/12040',
];

const DEFAULT_NEWS = [
  '🔴 西班牙亚马尔+尼科·威廉斯首战不会首发，费尔明缺席整届赛事',
  '🔴 阿根廷梅西腿筋管理出场时间，帕雷德斯伤缺，塔利亚菲科疑缺',
  '🔴 伊朗阿兹蒙因签证落选大名单，贾汉巴赫什等多人伤疑',
  '🔴 乌拉圭阿劳霍+希门尼斯双双缺阵首战，贝尔萨防线告急',
  '🔴 塞内加尔库利巴利大腿血肿出战成疑，盖耶也存疑',
  '🔴 阿尔及利亚本塞拜尼足部伤缺，齐达内戴护面出战',
  '🔴 奥地利鲍姆加特纳整届赛事报销，阿拉巴疑缺',
  '🔴 荷兰西蒙斯ACL+廷贝尔腹股沟+德利赫特背伤三主力缺阵',
  '🔴 日本三笘薰腘绳肌伤缺，远藤航足部伤退出国家队',
  '🔴 巴西罗德里戈ACL报销，内马尔小腿伤疑',
  '法国萨利巴背部伤愈恢复训练，预计首发',
  '🔥 德国7-1狂胜库拉索，哈弗茨梅开二度',
  '🔥 日本2-2逼平荷兰，89分钟镰田大地绝平',
  '🔥 卡塔尔补时94分钟绝平瑞士，队史首个世界杯积分',
  '🔥 美国4-1大胜巴拉圭，巴洛贡梅开二度',
  '🔥 瑞典5-1突尼斯，伊萨克+哲凯赖什双锋发威',
  '🔥 巴西1-1平摩洛哥，维尼修斯破门难救主',
  '⭐ C罗41岁第6届世界杯，葡萄牙身价排第6',
  '🔴 意大利连续两届无缘世界杯，被波黑附加赛淘汰',
];

const HISTORICAL_WC = [
  // ===== 2022 World Cup =====
  {odds:[1.67,3.50,5.50],r:'H',s:'group',m:'Netherlands vs Senegal',y:2022},{odds:[1.25,5.50,12.0],r:'H',s:'group',m:'England vs Iran',y:2022},{odds:[2.15,3.10,3.60],r:'D',s:'group',m:'USA vs Wales',y:2022},{odds:[1.44,4.00,8.00],r:'H',s:'group',m:'Argentina vs Saudi Arabia',y:2022},
  {odds:[2.50,3.10,2.90],r:'D',s:'group',m:'Denmark vs Tunisia',y:2022},{odds:[1.50,3.80,7.00],r:'D',s:'group',m:'Mexico vs Poland',y:2022},{odds:[1.30,5.00,10.0],r:'H',s:'group',m:'France vs Australia',y:2022},{odds:[2.00,3.20,4.00],r:'D',s:'group',m:'Morocco vs Croatia',y:2022},
  {odds:[1.62,3.60,5.80],r:'A',s:'group',m:'Germany vs Japan',y:2022},{odds:[1.36,4.50,9.00],r:'H',s:'group',m:'Spain vs Costa Rica',y:2022},{odds:[1.73,3.50,5.00],r:'D',s:'group',m:'Belgium vs Canada',y:2022},{odds:[1.44,4.00,7.50],r:'A',s:'group',m:'Switzerland vs Cameroon',y:2022},
  {odds:[1.55,3.75,6.50],r:'A',s:'group',m:'Uruguay vs South Korea',y:2022},{odds:[1.40,4.20,8.50],r:'H',s:'group',m:'Portugal vs Ghana',y:2022},{odds:[1.36,4.50,9.00],r:'H',s:'group',m:'Brazil vs Serbia',y:2022},{odds:[2.50,3.00,3.00],r:'D',s:'group',m:'Wales vs Iran',y:2022},
  {odds:[2.10,3.20,3.60],r:'A',s:'group',m:'Qatar vs Senegal',y:2022},{odds:[1.80,3.40,4.50],r:'H',s:'group',m:'Netherlands vs Ecuador',y:2022},{odds:[1.36,4.50,9.00],r:'D',s:'group',m:'England vs USA',y:2022},{odds:[2.75,3.10,2.62],r:'A',s:'group',m:'Tunisia vs Australia',y:2022},
  {odds:[1.83,3.30,4.50],r:'H',s:'group',m:'Poland vs Saudi Arabia',y:2022},{odds:[1.36,4.50,9.00],r:'H',s:'group',m:'France vs Denmark',y:2022},{odds:[1.08,9.00,23.0],r:'H',s:'group',m:'Argentina vs Mexico',y:2022},{odds:[2.40,3.20,3.00],r:'D',s:'group',m:'Japan vs Costa Rica',y:2022},
  {odds:[1.57,3.75,6.00],r:'D',s:'group',m:'Belgium vs Morocco',y:2022},{odds:[2.25,3.20,3.25],r:'H',s:'group',m:'Croatia vs Canada',y:2022},{odds:[1.50,3.80,7.00],r:'D',s:'group',m:'Spain vs Germany',y:2022},{odds:[2.62,3.10,2.75],r:'H',s:'group',m:'Cameroon vs Serbia',y:2022},
  {odds:[2.00,3.20,4.00],r:'H',s:'group',m:'South Korea vs Ghana',y:2022},{odds:[1.40,4.20,8.50],r:'H',s:'group',m:'Brazil vs Switzerland',y:2022},{odds:[1.67,3.50,5.50],r:'H',s:'group',m:'Portugal vs Uruguay',y:2022},{odds:[3.75,3.30,2.00],r:'A',s:'group',m:'Wales vs England',y:2022},
  {odds:[3.60,3.25,2.10],r:'A',s:'group',m:'Iran vs USA',y:2022},{odds:[1.11,8.00,21.0],r:'H',s:'group',m:'Netherlands vs Qatar',y:2022},{odds:[2.25,3.40,3.10],r:'H',s:'group',m:'Ecuador vs Senegal',y:2022},{odds:[8.50,4.50,1.36],r:'A',s:'group',m:'Saudi Arabia vs Mexico',y:2022},
  {odds:[2.50,3.30,2.80],r:'A',s:'group',m:'Poland vs Argentina',y:2022},{odds:[6.00,3.75,1.57],r:'A',s:'group',m:'Tunisia vs France',y:2022},{odds:[9.00,4.50,1.36],r:'A',s:'group',m:'Australia vs Denmark',y:2022},{odds:[2.90,3.00,2.62],r:'H',s:'group',m:'Japan vs Spain',y:2022},
  {odds:[8.00,4.50,1.40],r:'A',s:'group',m:'Costa Rica vs Germany',y:2022},{odds:[2.62,3.40,2.62],r:'D',s:'group',m:'Canada vs Morocco',y:2022},{odds:[3.00,3.30,2.37],r:'D',s:'group',m:'Croatia vs Belgium',y:2022},{odds:[5.50,4.00,1.57],r:'A',s:'group',m:'Cameroon vs Brazil',y:2022},
  {odds:[1.91,3.30,4.33],r:'A',s:'group',m:'Ghana vs Uruguay',y:2022},{odds:[4.50,3.40,1.83],r:'A',s:'group',m:'South Korea vs Portugal',y:2022},{odds:[3.50,3.20,2.15],r:'H',s:'group',m:'Serbia vs Switzerland',y:2022},
  // KO 2022
  {odds:[1.83,3.30,4.75],r:'H',s:'ko',m:'Netherlands vs USA R16',y:2022},{odds:[1.22,6.00,13.0],r:'H',s:'ko',m:'Argentina vs Australia R16',y:2022},{odds:[1.40,4.20,9.00],r:'H',s:'ko',m:'France vs Poland R16',y:2022},{odds:[1.44,4.00,8.00],r:'H',s:'ko',m:'England vs Senegal R16',y:2022},
  {odds:[5.00,3.60,1.72],r:'A',s:'ko',m:'Japan vs Croatia R16',y:2022},{odds:[1.33,4.80,9.50],r:'H',s:'ko',m:'Brazil vs South Korea R16',y:2022},{odds:[2.60,3.00,2.90],r:'D',s:'ko',m:'Morocco vs Spain R16',y:2022},{odds:[1.95,3.30,4.00],r:'H',s:'ko',m:'Portugal vs Switzerland R16',y:2022},
  {odds:[1.80,3.25,4.00],r:'D',s:'ko',m:'Netherlands vs Argentina QF',y:2022},{odds:[2.87,2.90,2.75],r:'A',s:'ko',m:'Morocco vs Portugal QF',y:2022},{odds:[1.83,3.30,4.75],r:'H',s:'ko',m:'England vs France QF',y:2022},{odds:[1.90,3.40,4.20],r:'H',s:'ko',m:'Argentina vs Croatia SF',y:2022},
  {odds:[1.50,3.80,7.50],r:'H',s:'ko',m:'France vs Morocco SF',y:2022},{odds:[2.40,3.20,3.00],r:'D',s:'ko',m:'Argentina vs France F',y:2022},

  // ===== 2018 World Cup =====
  {odds:[1.47,4.00,7.00],r:'H',s:'group',m:'Russia vs Saudi Arabia',y:2018},{odds:[1.61,3.50,6.00],r:'D',s:'group',m:'Egypt vs Uruguay',y:2018},{odds:[2.30,3.00,3.30],r:'D',s:'group',m:'Morocco vs Iran',y:2018},{odds:[1.30,5.00,10.0],r:'D',s:'group',m:'Portugal vs Spain',y:2018},
  {odds:[1.36,4.50,9.00],r:'H',s:'group',m:'France vs Australia',y:2018},{odds:[1.44,4.00,8.00],r:'D',s:'group',m:'Argentina vs Iceland',y:2018},{odds:[5.00,3.50,1.72],r:'A',s:'group',m:'Peru vs Denmark',y:2018},{odds:{h:2.50,d:3.00,a:3.00},r:'D',s:'group',m:'Croatia vs Nigeria',y:2018},
  {odds:[3.75,3.25,2.05],r:'A',s:'group',m:'Costa Rica vs Serbia',y:2018},{odds:[1.33,5.00,9.00],r:'D',s:'group',m:'Germany vs Mexico',y:2018},{odds:[1.25,5.50,12.0],r:'H',s:'group',m:'Brazil vs Switzerland',y:2018},{odds:[2.25,3.00,3.50],r:'D',s:'group',m:'Sweden vs South Korea',y:2018},
  {odds:[1.50,3.75,7.50],r:'H',s:'group',m:'Belgium vs Panama',y:2018},{odds:[2.10,3.10,3.75],r:'H',s:'group',m:'Tunisia vs England',y:2018},{odds:{h:5.00,d:3.50,a:1.72},r:'H',s:'group',m:'Poland vs Senegal',y:2018},{odds:[1.67,3.40,5.80],r:'A',s:'group',m:'Colombia vs Japan',y:2018},
  {odds:[2.37,3.10,3.10],r:'H',s:'group',m:'Russia vs Egypt',y:2018},{odds:[1.67,3.40,6.00],r:'H',s:'group',m:'Portugal vs Morocco',y:2018},{odds:[1.61,3.60,5.80],r:'A',s:'group',m:'Uruguay vs Saudi Arabia',y:2018},{odds:[2.50,3.10,2.90],r:'A',s:'group',m:'Iran vs Spain',y:2018},
  {odds:[2.60,3.00,2.87],r:'D',s:'group',m:'Denmark vs Australia',y:2018},{odds:[1.28,5.00,11.0],r:'H',s:'group',m:'France vs Peru',y:2018},{odds:{h:3.40,d:3.20,a:2.15},r:'A',s:'group',m:'Argentina vs Croatia',y:2018},{odds:[1.36,4.50,9.00],r:'H',s:'group',m:'Brazil vs Costa Rica',y:2018},
  {odds:[4.00,3.40,1.91],r:'A',s:'group',m:'Nigeria vs Iceland',y:2018},{odds:[2.37,3.25,3.00],r:'H',s:'group',m:'Serbia vs Switzerland',y:2018},{odds:[2.60,3.00,2.87],r:'H',s:'group',m:'South Korea vs Germany',y:2018},{odds:{h:1.30,d:5.00,a:10.0},r:'A',s:'group',m:'Mexico vs Sweden',y:2018},
  {odds:[5.00,3.75,1.66],r:'A',s:'group',m:'Switzerland vs Brazil',y:2018},{odds:[1.30,5.00,10.0],r:'H',s:'group',m:'England vs Panama',y:2018},{odds:[5.00,3.40,1.72],r:'H',s:'group',m:'Japan vs Poland',y:2018},{odds:[2.37,3.25,3.00],r:'H',s:'group',m:'Senegal vs Colombia',y:2018},
  {odds:[1.30,5.00,10.0],r:'H',s:'group',m:'Belgium vs Tunisia',y:2018},{odds:[1.83,3.30,4.50],r:'H',s:'group',m:'England vs Belgium',y:2018},
  // KO 2018
  {odds:[1.30,4.75,11.0],r:'H',s:'ko',m:'France vs Argentina R16',y:2018},{odds:[1.44,4.00,8.00],r:'A',s:'ko',m:'Uruguay vs Portugal R16',y:2018},{odds:[2.75,2.90,2.87],r:'D',s:'ko',m:'Russia vs Spain R16',y:2018},{odds:{h:1.40,d:4.00,a:9.00},r:'D',s:'ko',m:'Croatia vs Denmark R16',y:2018},
  {odds:[1.36,4.50,9.00],r:'H',s:'ko',m:'Brazil vs Mexico R16',y:2018},{odds:[1.30,5.00,10.0],r:'H',s:'ko',m:'Belgium vs Japan R16',y:2018},{odds:[2.50,3.10,2.87],r:'H',s:'ko',m:'Sweden vs Switzerland R16',y:2018},{odds:{h:2.37,d:3.10,a:3.10},r:'D',s:'ko',m:'Colombia vs England R16',y:2018},
  {odds:[1.83,3.30,4.50],r:'A',s:'ko',m:'Uruguay vs France QF',y:2018},{odds:[1.53,3.75,6.50],r:'A',s:'ko',m:'Brazil vs Belgium QF',y:2018},{odds:[2.10,3.00,4.00],r:'H',s:'ko',m:'Sweden vs England QF',y:2018},{odds:{h:2.75,d:3.00,a:2.75},r:'D',s:'ko',m:'Russia vs Croatia QF',y:2018},
  {odds:[1.50,3.80,7.50],r:'H',s:'ko',m:'France vs Belgium SF',y:2018},{odds:[2.37,3.10,3.10],r:'A',s:'ko',m:'Croatia vs England SF',y:2018},{odds:[1.57,4.00,5.80],r:'A',s:'ko',m:'Belgium vs England 3P',y:2018},{odds:[1.36,4.50,9.00],r:'H',s:'ko',m:'France vs Croatia F',y:2018},

  // ===== 2014 World Cup =====
  {odds:[1.30,5.00,10.0],r:'H',s:'group',m:'Brazil vs Croatia',y:2014},{odds:[2.50,3.10,2.90],r:'H',s:'group',m:'Mexico vs Cameroon',y:2014},{odds:[1.44,4.00,7.50],r:'A',s:'group',m:'Spain vs Netherlands',y:2014},{odds:{h:2.20,d:3.20,a:3.30},r:'H',s:'group',m:'Chile vs Australia',y:2014},
  {odds:[2.37,3.10,3.10],r:'A',s:'group',m:'Colombia vs Greece',y:2014},{odds:{h:1.67,d:3.50,a:5.50},r:'A',s:'group',m:'Uruguay vs Costa Rica',y:2014},{odds:[1.25,5.50,12.0],r:'H',s:'group',m:'England vs Italy',y:2014},{odds:{h:3.75,d:3.30,a:2.00},r:'H',s:'group',m:'Ivory Coast vs Japan',y:2014},
  {odds:[1.36,4.50,9.00],r:'H',s:'group',m:'Switzerland vs Ecuador',y:2014},{odds:[1.30,5.00,10.0],r:'H',s:'group',m:'France vs Honduras',y:2014},{odds:[1.36,4.50,9.00],r:'H',s:'group',m:'Argentina vs Bosnia',y:2014},{odds:[2.90,3.10,2.50],r:'A',s:'group',m:'Iran vs Nigeria',y:2014},
  {odds:[1.40,4.20,8.50],r:'D',s:'group',m:'Germany vs Ghana',y:2014},{odds:{h:1.83,d:3.50,a:4.20},r:'H',s:'group',m:'Belgium vs Algeria',y:2014},{odds:[1.44,4.00,7.50],r:'D',s:'group',m:'Brazil vs Mexico',y:2014},{odds:{h:6.00,d:3.80,a:1.57},r:'A',s:'group',m:'Australia vs Netherlands',y:2014},
  {odds:[2.50,3.20,2.80],r:'A',s:'group',m:'Spain vs Chile',y:2014},{odds:[2.10,3.20,3.60],r:'H',s:'group',m:'Croatia vs Cameroon',y:2014},{odds:[1.25,5.50,12.0],r:'H',s:'group',m:'Argentina vs Iran',y:2014},{odds:{h:2.37,d:3.25,a:3.00},r:'D',s:'group',m:'Germany vs USA',y:2014},
  {odds:[2.60,3.25,2.70],r:'H',s:'group',m:'Algeria vs Russia',y:2014},{odds:[1.30,5.00,10.0],r:'H',s:'group',m:'Belgium vs South Korea',y:2014},
  // KO 2014
  {odds:[1.30,5.00,10.0],r:'D',s:'ko',m:'Brazil vs Chile R16',y:2014},{odds:[1.30,5.00,9.00],r:'H',s:'ko',m:'Netherlands vs Mexico R16',y:2014},{odds:{h:2.00,d:3.20,a:4.00},r:'A',s:'ko',m:'Colombia vs Uruguay R16',y:2014},{odds:[1.57,3.75,6.00],r:'H',s:'ko',m:'France vs Nigeria R16',y:2014},
  {odds:[1.44,4.00,7.50],r:'H',s:'ko',m:'Germany vs Algeria R16',y:2014},{odds:[1.40,4.00,8.50],r:'H',s:'ko',m:'Argentina vs Switzerland R16',y:2014},{odds:{h:1.67,d:3.50,a:5.50},r:'A',s:'ko',m:'Belgium vs USA R16',y:2014},{odds:[1.61,3.60,6.00],r:'D',s:'ko',m:'Costa Rica vs Greece R16',y:2014},
  {odds:[1.91,3.30,4.20],r:'H',s:'ko',m:'Brazil vs Colombia QF',y:2014},{odds:{h:1.53,d:3.80,a:6.50},r:'H',s:'ko',m:'France vs Germany QF',y:2014},{odds:[1.36,4.50,9.00],r:'H',s:'ko',m:'Argentina vs Belgium QF',y:2014},{odds:{h:1.72,d:3.50,a:5.00},r:'H',s:'ko',m:'Netherlands vs Costa Rica QF',y:2014},
  {odds:[1.61,3.60,6.00],r:'A',s:'ko',m:'Brazil vs Germany SF',y:2014},{odds:[2.50,3.10,2.90],r:'D',s:'ko',m:'Netherlands vs Argentina SF',y:2014},{odds:[1.61,3.75,5.50],r:'A',s:'ko',m:'Brazil vs Netherlands 3P',y:2014},{odds:{h:1.67,d:3.50,a:5.80},r:'A',s:'ko',m:'Germany vs Argentina F',y:2014},

  // ===== 2010 World Cup =====
  {odds:[1.36,4.50,9.00],r:'D',s:'group',m:'South Africa vs Mexico',y:2010},{odds:{h:2.50,d:3.10,a:2.87},r:'D',s:'group',m:'Uruguay vs France',y:2010},{odds:[1.57,3.50,6.50],r:'H',s:'group',m:'Argentina vs Nigeria',y:2010},{odds:{h:2.00,d:3.20,a:4.00},r:'D',s:'group',m:'South Korea vs Greece',y:2010},
  {odds:[1.25,5.50,12.0],r:'D',s:'group',m:'England vs USA',y:2010},{odds:{h:3.10,d:3.20,a:2.30},r:'A',s:'group',m:'Slovenia vs Algeria',y:2010},{odds:[1.57,3.75,6.00],r:'A',s:'group',m:'Serbia vs Ghana',y:2010},{odds:[1.30,5.00,10.0],r:'H',s:'group',m:'Germany vs Australia',y:2010},
  {odds:[1.40,4.00,9.00],r:'H',s:'group',m:'Netherlands vs Denmark',y:2010},{odds:{h:1.50,d:3.80,a:7.00},r:'D',s:'group',m:'Japan vs Cameroon',y:2010},{odds:[1.30,5.00,10.0],r:'H',s:'group',m:'Italy vs Paraguay',y:2010},{odds:[1.57,3.60,6.50],r:'D',s:'group',m:'Netherlands vs Japan',y:2010},
  {odds:[1.57,3.75,6.00],r:'A',s:'group',m:'Spain vs Switzerland',y:2010},{odds:[1.30,5.00,10.0],r:'D',s:'group',m:'Brazil vs Portugal',y:2010},
  // KO 2010
  {odds:[1.30,5.00,10.0],r:'H',s:'ko',m:'Netherlands vs Slovakia R16',y:2010},{odds:[1.36,4.50,9.00],r:'H',s:'ko',m:'Brazil vs Chile R16',y:2010},{odds:[1.50,3.80,7.00],r:'H',s:'ko',m:'Argentina vs Mexico R16',y:2010},{odds:{h:3.00,d:3.10,a:2.37},r:'A',s:'ko',m:'Germany vs England R16',y:2010},
  {odds:[1.50,3.80,7.00],r:'D',s:'ko',m:'Paraguay vs Japan R16',y:2010},{odds:{h:1.30,d:5.00,a:9.00},r:'H',s:'ko',m:'Spain vs Portugal R16',y:2010},{odds:[1.53,3.75,6.50],r:'A',s:'ko',m:'Netherlands vs Brazil QF',y:2010},{odds:[1.36,4.50,9.00],r:'H',s:'ko',m:'Spain vs Paraguay QF',y:2010},
  {odds:[2.15,3.20,3.50],r:'A',s:'ko',m:'Uruguay vs Ghana QF',y:2010},{odds:[1.36,4.50,9.00],r:'H',s:'ko',m:'Germany vs Argentina QF',y:2010},{odds:{h:1.83,d:3.30,a:4.50},r:'H',s:'ko',m:'Uruguay vs Netherlands SF',y:2010},{odds:[2.20,3.10,3.40],r:'A',s:'ko',m:'Germany vs Spain SF',y:2010},
  {odds:[1.95,3.30,4.00],r:'H',s:'ko',m:'Uruguay vs Germany 3P',y:2010},{odds:{h:2.30,d:3.10,a:3.20},r:'A',s:'ko',m:'Netherlands vs Spain F',y:2010},
];

function getLineup(teamId) {
  var suspended = getSuspendedPlayers(teamId);
  var suspensionNote = suspended.length > 0 ? '停赛:' + suspended.join(',') : '';
  // 1. Check match-details.json for latest actual lineup
  var latestLu = null;
  var latestDate = '';
  var team = TEAMS.find(function(t){return t.id === teamId});
  Object.keys(matchDetails).forEach(function(mid) {
    var d = matchDetails[mid];
    if (!d || !d.lineups) return;
    var hLu = d.lineups.home, aLu = d.lineups.away;
    var lu = null;
    if (hLu && d.homeTeam === (team ? team.name : '')) lu = hLu;
    if (aLu && d.awayTeam === (team ? team.name : '')) lu = aLu;
    if (lu && d.date > latestDate) {
      latestDate = d.date;
      latestLu = lu;
    }
  });
  if (latestLu && latestLu.startXI && latestLu.startXI.length > 0) {
    var gk = '', defs = [], mids = [], fwds = [];
    latestLu.startXI.forEach(function(p) {
      var pos = p.player.pos || '';
      var name = p.player.name;
      if (suspended.indexOf(name) >= 0) return; // skip suspended
      if (pos === 'G') gk = name;
      else if (pos === 'D') defs.push(name);
      else if (pos === 'M') mids.push(name);
      else if (pos === 'F') fwds.push(name);
      else mids.push(name);
    });
    return { f: latestLu.formation || '?', g: gk, d: defs, m: mids, fwd: fwds, source: suspensionNote || '上轮实际首发', date: latestDate };
  }
  // 2. Fallback to hardcoded
  var hc = STARTING_XI[teamId];
  if (hc && suspensionNote) hc = Object.assign({}, hc, {note: suspensionNote});
  return hc || null;
}

module.exports = {
  TEAMS, GROUPS, TACTICAL, STYLE_MATCHUP, STARTING_XI,
  PLAYER_CN, JERSEY_NUM, PLAYER_IMPORTANCE,
  TEAM_ODDS, MATCH_ODDS, MATCH_SCHEDULE,
ODDS_STATS, ODDS_FINE,
  HISTORICAL_WC, DEFAULT_NEWS, NEWS_SOURCES,
  getLineup, cnName, getTeamOdds
};
