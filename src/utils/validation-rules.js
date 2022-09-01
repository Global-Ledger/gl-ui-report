import { email, required, confirmed, max, max_value, min } from 'vee-validate/dist/rules'
import { extend } from 'vee-validate'
import wav from 'wallet-address-validator'
import { getIsTxHash } from '@/utils/get-is-tx-hash'

extend('email', email)

extend('max', max)

extend('min', min)

extend('max_value', max_value)

extend('required', { ...required, message: '{_field_} is required.' })

extend('confirmed', { ...confirmed, message: 'Passwords don’t match' })

extend('address', {
  validate(value, { currency }) {
    return wav.validate(value, currency)
  },
  params: ['currency'],
  message: 'Wallet address is not valid'
})

extend('txHash', {
  validate(value) {
    return getIsTxHash(value)
  },
  message: 'tx hash is not valid'
})
