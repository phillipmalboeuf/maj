import { DateTime } from 'luxon'

export const date = (date: string) => {
  return date && DateTime.fromISO(date).toFormat('yyyy.LL.dd')
}