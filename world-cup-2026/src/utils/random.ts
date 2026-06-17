/**
 * 带权重的随机工具
 */

/** 返回 [min, max] 范围内的随机整数 */
export function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/** 返回 [0, 1) 的随机浮点数 */
export function rand(): number {
  return Math.random()
}

/** 权重随机: 返回值是否在概率 threshold 内 (0-1) */
export function chance(probability: number): boolean {
  return Math.random() < probability
}

/** 从数组中随机选取一个元素 */
export function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

/** 高斯分布近似 (Box-Muller) */
export function gaussianRandom(mean: number = 0, stdev: number = 1): number {
  let u = 1 - Math.random()
  let v = Math.random()
  let z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
  return z * stdev + mean
}

/** 限制值在范围内 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}
