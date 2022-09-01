import { trancateString } from '@/utils/text-formatter'

export const formatFunds = (fund, withPercent = true) => {
    const formatted = Math.ceil(fund)

    if (withPercent) {
        return formatted === '0.00' ? '< 0.01%' : formatted + '%'
    } else {
        return formatted === '0.00' ? '< 0.01' : formatted
    }
}

export const getOwnerByType = (data) => {
    if (data.typeData && data.typeData.name && data.typeData.name.toLowerCase() === 'unidentified service / exchange') {
        return data.cluster || data.owner
    }

    if (data.typeData && data.typeData.name && data.typeData.name.toLowerCase() === 'small transactions') {
        return 'Multiple'
    }

    if (data.typeData && data.typeData.name && data.typeData.name.toLowerCase() === 'unknown single wallet service') {
        return data.address
            ? {
                owner: trancateString(data.address, 8),
                value: data.address,
                isLink: true
            }
            : data.owner
    }

    if (data.typeData && data.typeData.name && data.typeData.name.toLowerCase() === 'unknown wallet / otc / service') {
        return data.address
            ? {
                owner: trancateString(data.address, 8),
                value: data.address,
                isLink: true
            }
            : data.owner
    }

    if (data.typeData && data.typeData.name && data.typeData.name.toLowerCase() === 'maximum depth reached' || data.typeData && data.typeData.name && data.typeData.name.toLowerCase() === 'small transactions') {
        return '--'
    }

    return data.owner || '--'
}

export const checkMultiple = (val) => {
    return val === null
}

export const ownerLabelFormatter = (addressData) => {
    if (addressData.owner || (addressData.clusterData && addressData.clusterData.owner)) {
        if (addressData.owner === addressData.clusterData.owner) {
            return addressData.owner
        }

        if (addressData.owner && addressData.clusterData.owner) {
            return `${addressData.owner}, ${addressData.clusterData.owner}`
        }

        if (addressData.clusterData.owner) {
            return addressData.clusterData.owner
        }

        if (addressData.owner) {
            return addressData.owner
        }
    }

    return 'Not identified'
}