/**
 * 国旗组件 - 使用 flagcdn.com 加载真实国旗图片
 */
import { Image, View } from '@tarojs/components'
import './index.scss'

interface Props {
  countryCode: string
  size?: number
  showFallback?: boolean
}

const FLAG_BASE = 'https://flagcdn.com/w80'

export default function TeamFlag({ countryCode, size = 36, showFallback = true }: Props) {
  const flagUrl = `${FLAG_BASE}/${countryCode}.png`

  return (
    <View className='team-flag' style={{ width: size, height: size }}>
      <Image
        className='flag-img'
        src={flagUrl}
        mode='aspectFit'
        style={{ width: size, height: size }}
        onError={(e) => {
          // 降级到 emoji (通过父组件处理)
          console.warn('Flag load failed:', countryCode)
        }}
      />
    </View>
  )
}
