// Cloud function: fetch latest World Cup news
const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

// News data - updated with latest from the tournament
const NEWS_ITEMS = [
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
  '✅ 法国萨利巴背部伤愈恢复训练，预计首发',
  '🔥 德国7-1狂胜库拉索，哈弗茨梅开二度',
  '🔥 日本2-2逼平荷兰，89分钟镰田大地绝平',
  '🔥 卡塔尔补时94分钟绝平瑞士，队史首个世界杯积分',
  '🔥 美国4-1大胜巴拉圭，巴洛贡梅开二度',
  '🔥 瑞典5-1突尼斯，伊萨克+哲凯赖什双锋发威',
  '🔥 巴西1-1平摩洛哥，维尼修斯破门难救主',
  '⭐ C罗41岁第6届世界杯，葡萄牙身价排第6',
  '🔴 意大利连续两届无缘世界杯，被波黑附加赛淘汰',
  '📊 夺冠指数更新：西班牙5.50居首，法国6.00紧随其后',
  '🏟️ 2026世界杯48队首次扩军，12组×4队全新赛制',
  '⭐ 姆巴佩戴法国队长袖标，德尚确认最后一届执教',
  '🔥 挪威26年来首次晋级，哈兰德预选赛轰入16球'
];

exports.main = async (event) => {
  const items = event.items || NEWS_ITEMS;
  const data = {
    _id: 'latest',
    items: items,
    total: items.length,
    updatedAt: new Date().toISOString()
  };

  // Upsert: remove then add
  try {
    await db.collection('worldcup_news').doc('latest').remove();
  } catch (e) {
    // Not existing yet, that's fine
  }

  await db.collection('worldcup_news').add({ data });

  return {
    ok: true,
    count: items.length,
    updatedAt: data.updatedAt
  };
};
