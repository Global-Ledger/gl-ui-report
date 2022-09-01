// import usersState from "@/store/modules/users/state";
// import analyticsState from "@/store/modules/analytics/state"

export const formatHash = hash => {
	let startSubStr = hash.substring(0,7)
	let endSubStr = hash.slice(-7)

	return `${startSubStr}...${endSubStr}`
}
export const formatBtcAmount = (amount, withBtc = true, searchType = '', hasContracts = false) => {
	let contract = ''
	let del = 100000000
	// let isNeedSubDel = false
	// const subDel = 1000000

	if (searchType === 'eth') {
		del = 1

		// Contract
		if (hasContracts) {
			contract = hasContracts
		} else {
			contract = 'ETH'
		}
	}

	if (!searchType) contract = 'BTC'

	const formattedAmount = (fAmount, fDel, fixedVal) => {
		let val = (fAmount / fDel).toFixed(fixedVal)

		// val = parseFloat(val)

		return val
	}

	return amount
		? `${searchType === 'eth'
			? formattedAmount(amount, del, 12)
			: formattedAmount(amount, del, 8)} ${withBtc
			? `${contract}`
			: ''}`
		: searchType === 'eth'
			? ''
			: 0
}

// export const formatHash = hash => {
// 	let startSubStr = hash.substring(0,7)
// 	let endSubStr = hash.slice(-7)
//
// 	return `${startSubStr}...${endSubStr}`
// }
// export const formatBtcAmount = (amount, withBtc = true, decimal = 8) => {
// 	let del = 100000000
//
// 	return amount ? `${(amount / del).toFixed(decimal)} ${withBtc ?  'BTC' : ''}` : 0
// }
