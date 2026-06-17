/**
 * 使用火山引擎 SDK 生成小程序头像
 */
const https = require('https')
const fs = require('fs')
const path = require('path')
const { Signer } = require('@volcengine/openapi')

const AK = 'AKLTZDBhYzIwM2JjZTZjNDA4MzkyM2FmZjZkNzdhZjNkNzk'
const SK = 'Wm1VME5EZGtZVGhtWVRFME5EazNaR0psTVRBMFkyUXdNV1F5TkRGbVlUVQ=='
const HOST = 'visual.volcengineapi.com'

const signer = new Signer({ accessKeyId: AK, secretKey: SK, region: 'cn-north-1', serviceName: 'cv' })

const PROMPT = `A professional round app icon for a soccer World Cup simulator game called "Road to World Cup".
Golden FIFA World Cup trophy glowing at the center. A curved cyan neon road path leading from bottom to the trophy.
Dark navy blue background with small star particles. Text "ROAD TO WORLD CUP" in cyan at bottom.
Style: clean flat app icon, circular, minimal, high contrast, mobile game aesthetic. No realistic faces.`

function request(body) {
  return new Promise((resolve, reject) => {
    const reqBody = JSON.stringify(body)
    const query = { Action: 'CVSync2AsyncSubmitTask', Version: '2022-08-31' }
    const headers = { host: HOST, 'content-type': 'application/json' }

    // Signer 自动添加 X-Date + Authorization
    signer.addAuthorization({ method: 'POST', pathname: '/', query, headers, body: reqBody })

    const qs = Object.entries(query).map(([k, v]) => `${k}=${v}`).join('&')

    const opts = { hostname: HOST, port: 443, path: `/?${qs}`, method: 'POST', headers }

    const req = https.request(opts, res => {
      let d = ''; res.on('data', c => d += c); res.on('end', () => {
        try { resolve(JSON.parse(d)) } catch (e) { resolve(d) }
      })
    })
    req.on('error', reject)
    req.write(reqBody)
    req.end()
  })
}

async function pollResult(taskId) {
  for (let i = 0; i < 30; i++) {
    console.log(`⏳ 查询结果... (${i + 1}/30)`)
    const result = await request({ req_key: 'jimeng_t2i_v40', task_id: taskId })
    const status = result?.data?.status
    if (status === 'done') return result.data
    if (status === 'failed' || status === 'not_found') throw new Error('任务失败: ' + status)
    await new Promise(r => setTimeout(r, 3000))
  }
  throw new Error('轮询超时')
}

async function main() {
  console.log('🖼️  即梦 API - Road to World Cup\n')

  const submit = await request({ req_key: 'jimeng_t2i_v40', prompt: PROMPT, width: 1024, height: 1024, seed: -1, return_url: true })
  const taskId = submit?.data?.task_id

  if (!taskId) {
    console.log('提交响应:', JSON.stringify(submit, null, 2).slice(0, 600))
    throw new Error('未获取到 task_id')
  }

  console.log(`📋 Task: ${taskId}\n`)

  const result = await pollResult(taskId)
  const imageUrl = result?.image_url
  if (!imageUrl) throw new Error('未获取到图片URL')

  console.log(`\n✅ 生成完成!\n🔗 ${imageUrl}\n`)

  const outDir = path.join(__dirname, '..', 'src', 'assets')
  fs.mkdirSync(outDir, { recursive: true })
  const outPath = path.join(outDir, 'app-icon.png')

  // 下载图片
  await new Promise((resolve, reject) => {
    const ws = fs.createWriteStream(outPath)
    https.get(imageUrl, res => {
      res.pipe(ws)
      ws.on('finish', () => { ws.close(); resolve() })
    }).on('error', reject)
  })

  console.log(`📥 保存到: ${outPath}`)
  console.log(`📐 1024×1024 → 缩放到 144×144 用于小程序`)
}

main().catch(e => { console.error('❌', e.message); process.exit(1) })
