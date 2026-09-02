import { expect } from 'bun:test'
import { aesGcmDecrypt, aesGcmEncrypt } from 'seismic-viem'
import type { Hex } from 'viem'

const stubClient = (data: Hex) => ({
  call: async () => ({ data }),
})

const aesKey =
  '0x000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f' as Hex

export const testAesGcmEncryptPreservesLeadingZeroBytes = async () => {
  const ciphertext = '0x00a1b2c3d4e5f60718293a4b5c6d7e8f' as Hex
  const result = await aesGcmEncrypt(stubClient(ciphertext), {
    aesKey,
    nonce: 1,
    plaintext: 'hello',
  })

  expect(result).toBe(ciphertext)
}

export const testAesGcmDecryptPreservesLeadingNulPlaintext = async () => {
  const plaintextWithNul = '\x00hello'
  const plaintextHex = `0x${Buffer.from(plaintextWithNul, 'utf8').toString('hex')}` as Hex

  const result = await aesGcmDecrypt(
    stubClient(plaintextHex),
    {
      aesKey,
      nonce: 1,
      ciphertext: `0x${'00'.repeat(32)}` as Hex,
    }
  )

  expect(result).toBe(plaintextWithNul)
}
