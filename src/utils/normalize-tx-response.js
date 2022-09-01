export const normalizeTxResponse = tx => {
  return {
    txHash: tx.prev.tx_hash,
    outputs: tx.prev.outputs.map(output => {
      const nextTx = tx.next.find(tx => tx.inputs.find(input => input.address === output.address))
      return {
        address: output.address,
        amount: output.amount,
        nextTxHash: nextTx && nextTx.tx_hash,
        cluster: nextTx && {...nextTx.sources[0], ...nextTx.risky[0]},
      }
    }),
    inputs: tx.prev.inputs.map(input => {
      return {
        address: input.address,
        amount: input.amount,
        prevTxHash: input.prev_tx_hash,
        cluster: {...tx.prev.sources[0], ...tx.prev.risky[0]},
      }
    }),
  }
}
