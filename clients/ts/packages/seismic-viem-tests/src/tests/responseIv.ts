import { expect } from 'bun:test'
import {
  RESPONSE_FORMAT_VERSION,
  RESPONSE_IV_LENGTH,
  splitResponseIv,
} from 'seismic-viem'
import type { Hex } from 'viem'

const VERSION: Hex = '0x01'
const IV: Hex = '0x7da3a99bf0f90d56551d99ea'
const BODY: Hex = '0xdeadbeef'

const response = (version: Hex, body: Hex): Hex =>
  `${version}${IV.slice(2)}${body.slice(2)}` as Hex

export const testSplitResponseIvSeparatesVersionIvAndBody = () => {
  const { version, iv, body } = splitResponseIv(response(VERSION, BODY))
  expect(version).toBe(RESPONSE_FORMAT_VERSION)
  expect(iv).toBe(IV)
  expect(body).toBe(BODY)
}

export const testSplitResponseIvAcceptsEmptyBody = () => {
  const { iv, body } = splitResponseIv(response(VERSION, '0x'))
  expect(iv).toBe(IV)
  expect(body).toBe('0x')
}

export const testSplitResponseIvRejectsShortResponse = () => {
  const short = `0x01${'ab'.repeat(RESPONSE_IV_LENGTH - 1)}` as Hex
  expect(() => splitResponseIv(short)).toThrow(/too short to carry/)
}

export const testSplitResponseIvRejectsUnknownVersion = () => {
  const wrong = response('0x02', BODY)
  expect(() => splitResponseIv(wrong)).toThrow(
    /unsupported signed-read response format 2/
  )
}
