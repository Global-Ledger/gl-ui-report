import { riskScoreList } from "@/assets/js/riskScoreList";

export const hex2rgba = (hex, alpha = 1) => {
    const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16));
    return `rgba(${r},${g},${b},${alpha})`;
}

export const isValidEthAddress = (address) => {
    return /^0x[0-9a-fA-F]{40}$/.test(address);
}

export const isValidEthHash = (hash) => {
    return /^0x[0-9a-fA-F]{64}$/.test(hash);
}


export const findColorByTypeScore = (val) => {
    if (val !== 0 && (!val || val < 0)) {
        return riskScoreList[0]
    } else if (val >= 0 && val <= 10) {
        return riskScoreList[1]
    } else if (val > 10 && val <= 20) {
        return riskScoreList[2]
    } else if (val > 20 && val <= 30) {
        return riskScoreList[3]
    } else if (val > 30 && val <= 40) {
        return riskScoreList[4]
    } else if (val > 40 && val <= 50) {
        return riskScoreList[5]
    } else if (val > 50 && val <= 60) {
        return riskScoreList[6]
    } else if (val > 60 && val <= 70) {
        return riskScoreList[7]
    } else if (val > 70 && val <= 80) {
        return riskScoreList[8]
    } else if (val > 80 && val <= 90) {
        return riskScoreList[9]
    } else if (val > 90) {
        return riskScoreList[10]
    } else {
        return riskScoreList[0]
    }
}
