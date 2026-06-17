#!/bin/bash
# 使用火山引擎即梦 API 生成小程序头像
set -e

AK="AKLTZDBhYzIwM2JjZTZjNDA4MzkyM2FmZjZkNzdhZjNkNzk"
SK="Wm1VME5EZGtZVGhtWVRFME5EazNaR0psTVRBMFkyUXdNV1F5TkRGbVlUVQ=="
REGION="cn-north-1"
SERVICE="cv"

# 生成时间戳
TIMESTAMP=$(date -u +"%Y%m%dT%H%M%SZ")
DATE=$(date -u +"%Y%m%d")

# API 参数
ACTION="CVSync2AsyncSubmitTask"
VERSION="2022-08-31"
HOST="visual.volcengineapi.com"
CONTENT_TYPE="application/json"

# 请求Body
BODY='{"req_key":"jimeng_t2i_v40","prompt":"A professional round app icon design for a soccer World Cup simulator game. Golden FIFA World Cup trophy at center, glowing. Dark navy blue background with star particles. The text ROAD TO WORLD CUP in cyan neon at bottom. Style: flat minimal app icon, circular, clean lines, high contrast, gaming aesthetic. No realistic photos.","width":1024,"height":1024,"seed":42,"return_url":true}'

# ========== 签名计算 ==========
# 1. Hashed Payload
HASHED_PAYLOAD=$(echo -n "$BODY" | openssl dgst -sha256 | cut -d' ' -f2)

# 2. Canonical Request
CANONICAL_URI="/"
CANONICAL_QUERY="Action=${ACTION}&Version=${VERSION}"
CANONICAL_HEADERS="content-type:${CONTENT_TYPE}
host:${HOST}
x-date:${TIMESTAMP}
"
SIGNED_HEADERS="content-type;host;x-date"

CANONICAL_REQUEST="POST
${CANONICAL_URI}
${CANONICAL_QUERY}
${CANONICAL_HEADERS}
${SIGNED_HEADERS}
${HASHED_PAYLOAD}"

HASHED_CANONICAL=$(echo -n "$CANONICAL_REQUEST" | openssl dgst -sha256 | cut -d' ' -f2)

# 3. String to Sign
CREDENTIAL_SCOPE="${DATE}/${REGION}/${SERVICE}/request"
STRING_TO_SIGN="HMAC-SHA256
${TIMESTAMP}
${CREDENTIAL_SCOPE}
${HASHED_CANONICAL}"

# 4. Signing Key
kDate=$(echo -n "${DATE}" | openssl dgst -sha256 -hmac "${SK}" | cut -d' ' -f2)
kRegion=$(echo -n "${REGION}" | openssl dgst -sha256 -mac HMAC -macopt hexkey:${kDate} | cut -d' ' -f2)
kService=$(echo -n "${SERVICE}" | openssl dgst -sha256 -mac HMAC -macopt hexkey:${kRegion} | cut -d' ' -f2)
kSigning=$(echo -n "request" | openssl dgst -sha256 -mac HMAC -macopt hexkey:${kService} | cut -d' ' -f2)

# 5. Signature
SIGNATURE=$(echo -n "${STRING_TO_SIGN}" | openssl dgst -sha256 -mac HMAC -macopt hexkey:${kSigning} | cut -d' ' -f2)

AUTH_HEADER="HMAC-SHA256 Credential=${AK}/${CREDENTIAL_SCOPE}, SignedHeaders=${SIGNED_HEADERS}, Signature=${SIGNATURE}"

echo "📤 提交图片生成请求..."
echo "   Timestamp: $TIMESTAMP"
echo ""

RESPONSE=$(curl -s -X POST "https://${HOST}/?${CANONICAL_QUERY}" \
  -H "Host: ${HOST}" \
  -H "Content-Type: ${CONTENT_TYPE}" \
  -H "X-Date: ${TIMESTAMP}" \
  -H "Authorization: ${AUTH_HEADER}" \
  -d "${BODY}")

echo "响应:"
echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"

# 提取 task_id
TASK_ID=$(echo "$RESPONSE" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('data',{}).get('task_id',''))" 2>/dev/null)
if [ -z "$TASK_ID" ]; then
  echo ""
  echo "❌ 未能获取 task_id"
  exit 1
fi

echo ""
echo "📋 任务ID: $TASK_ID"
echo "⏳ 等待生成完成..."

# 轮询结果
for i in $(seq 1 30); do
  sleep 3

  # 重新签名查询请求
  TIMESTAMP=$(date -u +"%Y%m%dT%H%M%SZ")
  DATE=$(date -u +"%Y%m%d")

  QUERY_BODY="{\"req_key\":\"jimeng_t2i_v40\",\"task_id\":\"${TASK_ID}\"}"
  HASHED_PAYLOAD=$(echo -n "$QUERY_BODY" | openssl dgst -sha256 | cut -d' ' -f2)

  CANONICAL_HEADERS="content-type:${CONTENT_TYPE}
host:${HOST}
x-date:${TIMESTAMP}
"

  CANONICAL_REQUEST="POST
${CANONICAL_URI}
${CANONICAL_QUERY}
${CANONICAL_HEADERS}
${SIGNED_HEADERS}
${HASHED_PAYLOAD}"

  HASHED_CANONICAL=$(echo -n "$CANONICAL_REQUEST" | openssl dgst -sha256 | cut -d' ' -f2)
  CREDENTIAL_SCOPE="${DATE}/${REGION}/${SERVICE}/request"
  STRING_TO_SIGN="HMAC-SHA256
${TIMESTAMP}
${CREDENTIAL_SCOPE}
${HASHED_CANONICAL}"

  kDate=$(echo -n "${DATE}" | openssl dgst -sha256 -hmac "${SK}" | cut -d' ' -f2)
  kRegion=$(echo -n "${REGION}" | openssl dgst -sha256 -mac HMAC -macopt hexkey:${kDate} | cut -d' ' -f2)
  kService=$(echo -n "${SERVICE}" | openssl dgst -sha256 -mac HMAC -macopt hexkey:${kRegion} | cut -d' ' -f2)
  kSigning=$(echo -n "request" | openssl dgst -sha256 -mac HMAC -macopt hexkey:${kService} | cut -d' ' -f2)
  SIGNATURE=$(echo -n "${STRING_TO_SIGN}" | openssl dgst -sha256 -mac HMAC -macopt hexkey:${kSigning} | cut -d' ' -f2)

  AUTH_HEADER="HMAC-SHA256 Credential=${AK}/${CREDENTIAL_SCOPE}, SignedHeaders=${SIGNED_HEADERS}, Signature=${SIGNATURE}"

  RESULT=$(curl -s -X POST "https://${HOST}/?${CANONICAL_QUERY}" \
    -H "Host: ${HOST}" \
    -H "Content-Type: ${CONTENT_TYPE}" \
    -H "X-Date: ${TIMESTAMP}" \
    -H "Authorization: ${AUTH_HEADER}" \
    -d "${QUERY_BODY}")

  STATUS=$(echo "$RESULT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('data',{}).get('status','unknown'))" 2>/dev/null)
  echo "  轮询 ${i}/30: status=${STATUS}"

  if [ "$STATUS" = "done" ]; then
    IMAGE_URL=$(echo "$RESULT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('data',{}).get('image_url',''))" 2>/dev/null)
    echo ""
    echo "✅ 生成完成！"
    echo "🔗 图片URL: ${IMAGE_URL}"

    # 下载图片
    OUTPUT_DIR="$(cd "$(dirname "$0")/.." && pwd)/src/assets"
    mkdir -p "$OUTPUT_DIR"
    OUTPUT_PATH="${OUTPUT_DIR}/app-icon.png"
    curl -s -o "$OUTPUT_PATH" "$IMAGE_URL"
    echo "📥 已保存到: ${OUTPUT_PATH}"
    echo "   大小: 1024×1024"
    exit 0
  fi

  if [ "$STATUS" = "failed" ] || [ "$STATUS" = "not_found" ]; then
    echo ""
    echo "❌ 生成失败: $STATUS"
    echo "$RESULT" | python3 -m json.tool 2>/dev/null
    exit 1
  fi
done

echo "⏰ 轮询超时"
exit 1