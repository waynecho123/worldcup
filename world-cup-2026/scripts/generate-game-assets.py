#!/usr/bin/env python3
"""
使用豆包 Seedream API 生成小游戏 UI 素材
需要方舟 API Key (ark_xxx 格式)
"""
import requests, base64, os, sys, time, json

API_KEY = sys.argv[1] if len(sys.argv) > 1 else os.environ.get('ARK_API_KEY', '')
if not API_KEY:
    print('Usage: python3 generate-game-assets.py <ARK_API_KEY>')
    sys.exit(1)

ENDPOINT = 'https://ark.cn-beijing.volces.com/api/v3/images/generations'
OUTPUT = os.path.join(os.path.dirname(__file__), '..', 'game', 'assets')

os.makedirs(OUTPUT, exist_ok=True)

def generate(prompt, filename, size='2048x2048', model='doubao-seedream-4-5-251128'):
    """调用 Seedream API 生成图片"""
    payload = {
        'model': model,
        'prompt': prompt,
        'size': size,
        'response_format': 'b64_json',
        'watermark': False,
    }

    print(f'🎨 生成: {filename}...')
    resp = requests.post(ENDPOINT, json=payload,
        headers={'Content-Type':'application/json','Authorization':f'Bearer {API_KEY}'},
        timeout=180)

    if resp.status_code != 200:
        print(f'  ❌ HTTP {resp.status_code}: {resp.text[:300]}')
        return None

    data = resp.json()
    if 'data' in data and len(data['data']) > 0:
        img_b64 = data['data'][0].get('b64_json', '')
        if img_b64:
            path = os.path.join(OUTPUT, filename)
            with open(path, 'wb') as f:
                f.write(base64.b64decode(img_b64))
            print(f'  ✅ 保存: {path}')
            return path

    print(f'  ❌ 未获取到图片: {json.dumps(data, ensure_ascii=False)[:300]}')
    return None

# ====== 生成素材列表 ======
ASSETS = [
    # 1. App 图标 (1024x1024)
    {
        'prompt': 'Soccer World Cup game app icon design, "Road to World Cup 2026" theme. '
                  'A golden FIFA World Cup trophy glowing at center, with a cyan neon road path '
                  'curving from bottom toward the trophy. Dark navy blue background with subtle star '
                  'particles and football pattern. Flat design style, clean and modern, suitable for '
                  'WeChat mini game icon. Minimalist, high contrast, circular composition. '
                  'No text, no photorealistic faces.',
        'filename': 'app-icon.png', 'size': '2048x2048',
    },
    # 2. 首页背景 (9:16)
    {
        'prompt': 'Mobile game home screen background for a soccer World Cup simulator game. '
                  'Dark navy blue to deep space gradient background. Glowing golden World Cup trophy '
                  'silhouette at upper center. Subtle football field grass texture at bottom. '
                  'Minimal UI-friendly background with negative space for buttons and text. '
                  'Cyan and gold accent colors. Clean, modern, gaming aesthetic. No text overlay.',
        'filename': 'home-bg.png', 'size': '1440x2560',
    },
    # 3. 分享海报模板 (3:4)
    {
        'prompt': 'Elegant share poster template for a soccer World Cup journey result. '
                  'Dark luxury background with subtle gold geometric patterns and football motifs. '
                  'Golden World Cup trophy illustration in the center. Space for team flag, '
                  'team name, and tournament results text. Premium sports design, magazine quality. '
                  'Gradient gold and navy background. Clean typography-friendly layout. '
                  'No actual text, just beautiful background design.',
        'filename': 'share-poster.png', 'size': '1728x2304',
    },
    # 4. 足球场背景 (1:1)
    {
        'prompt': 'Top-down view of a football/soccer field from above, stylized game art style. '
                  'Green grass with white pitch markings visible. Minimalist flat design, '
                  'suitable as a background for a mobile game lineup editor screen. '
                  'Dark green tones with subtle lighting. Clean and simple.',
        'filename': 'pitch-bg.png', 'size': '2048x2048',
    },
    # 5. 比赛卡片背景 (16:9)
    {
        'prompt': 'Sports match result card background design, dark navy and gold theme. '
                  'Stadium lights glow effect, subtle crowd silhouette at bottom. '
                  'Premium football broadcast graphic style. Clean center area for score display. '
                  'Modern UI card design for mobile game.',
        'filename': 'match-card.png', 'size': '2560x1440',
    },
    # 6. Trophy celebration (1:1)
    {
        'prompt': 'Golden FIFA World Cup trophy with dramatic lighting, surrounded by confetti '
                  'and celebration effects. Dark premium background. Used as victory screen in a '
                  'soccer game. Majestic, emotional, high-quality sports illustration.',
        'filename': 'trophy.png', 'size': '2048x2048',
    },
]

print(f'🔥 开始生成 {len(ASSETS)} 个游戏素材...\n')

for i, asset in enumerate(ASSETS):
    print(f'[{i+1}/{len(ASSETS)}]')
    generate(asset['prompt'], asset['filename'], asset['size'])
    if i < len(ASSETS) - 1:
        print('  等待 3 秒...')
        time.sleep(3)

print(f'\n✨ 全部完成! 素材保存在: {OUTPUT}')
print(f'   文件列表:')
for f in os.listdir(OUTPUT):
    size = os.path.getsize(os.path.join(OUTPUT, f))
    print(f'     {f} ({size/1024:.0f} KB)')
