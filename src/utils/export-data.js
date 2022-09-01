import { formatDate } from "@/utils/format-date";
import { formatBtcAmount } from "@/utils/format-btc-amount";
import { findMinMaxFields } from "@/utils/model";
import { formatShare, formatter } from "@/utils/sourcesFormatter";
import { checkMultiple, getOwnerByType, ownerLabelFormatter } from "@/utils/report-data-formatter";
import { formatFunds } from "@/utils/report-data-formatter";

export const csvExportReport = (
    riskyData = [],
    knownData = [],
    unknownData = [],
    baseData,
    totalFunds = 0,
    reportType = '',
    percent = 0,
    csvName = "report") => {
  
  const RISK_POINT = 55

  const addressIsOwnerByHightRisk = () => {
    return (baseData.tags && baseData.tags.find(tag => tag.score >= RISK_POINT))
        || (baseData.clusterData.tags && baseData.clusterData.tags.find(tag => tag.score >= RISK_POINT))
        || baseData.type && baseData.type.score >= RISK_POINT
        || (baseData.clusterData.type && baseData.clusterData.type.score >= RISK_POINT)
          ? 'Address is owned by a high risk entity'
          : ''
  }
  
  const hasDirectlyMixing = () => {
    return (baseData.type && baseData.type.name === 'mixing')
        || (baseData.clusterData.type && baseData.clusterData.type.name === 'mixing')
        || (baseData.tags && baseData.tags.find(tag => tag.name === 'coin join participant'))
        || (baseData.clusterData.tags && baseData.clusterData.tags.find(tag => tag.name === 'coin join participant'))
          ? 'Address has directly participated in mixing'
          : ''
  }

  const hasTagMoreRiskPoint = () => {
    return (baseData.tags && baseData.tags.find(tag => tag.score >= RISK_POINT))
        || (baseData.clusterData.tags && baseData.clusterData.tags.find(tag => tag.score >= RISK_POINT))
          ? 'Address has directly participated in high risk activities'
          : ''
  }

  const addressAreUnidentified = () => {
    const sum = unknownData.reduce((acc, { share }) => acc + share, 0)

    return sum * 100 >= 75 ? 'More than 75% of sources for the address are unidentified' : ''
  }

  console.log(addressIsOwnerByHightRisk(), hasDirectlyMixing(), hasTagMoreRiskPoint(), addressAreUnidentified())

  const risky = riskyData.map((item) => ({
    amount: formatBtcAmount(item.amount),
    directTx: item.directTx,
    owner: item.owner,
    'type/tag': `${item.funds.type}`,
    depth: findMinMaxFields(item.depth),
    share: formatShare(item.share),
    tx_hash: checkMultiple(item.tx_hash) ? 'Multiple' : item.tx_hash,
  }))

  const known = knownData.map((item) => ({
    amount: formatBtcAmount(item.amount),
    directTx: item.directTx,
    owner: item.owner,
    'type/tag': `${item.funds.type}`,
    depth: findMinMaxFields(item.depth),
    share: formatShare(item.share),
    tx_hash: checkMultiple(item.tx_hash) ? 'Multiple' : item.tx_hash,
  }))

  const unknown = unknownData.map((item) => ({
    amount: formatBtcAmount(item.amount),
    directTx: item.directTx,
    'address/cluster': (checkMultiple(item.cluster) || checkMultiple(item.address)) && item.typeData.name !== 'unidentified service / exchange'
     ? 'Multiple' : getOwnerByType(item).isLink ? getOwnerByType(item).value : getOwnerByType(item),
    'type/tag': `${item.funds.type}`,
    depth: findMinMaxFields(item.depth),
    share: formatShare(item.share),
    tx_hash: checkMultiple(item.tx_hash) ? 'Multiple' : item.tx_hash,
  }))

  const supportArr = (arr) => {
    if (!arr || Array.isArray(arr) && arr.length === 0) return []
    Array.from({ length: Object.keys(arr[0]).length - 1 }, () => ' ')
  }

  const grouppedTitle = (key) => {
    return `GROUPED BY ${key}`
  }

  const riskyTitle = risky.length > 0 ? ['Risky Sources', supportArr(risky)] : ''
  const knownTitle = ['Known Sources', supportArr(known)]
  const unknownTitle = ['Unknown Sources', supportArr(unknown)]
  const txCountLabel = `Report generated by ${baseData.inMonitoring ? '1000' : '10'} tx,`

  const selectionReport = (type) => {
     if (!type) return ''
     if (type === 'address') return txCountLabel + "\n" + "ADDRESS INFORMATION,\n" +
         "WALLET ADDRESS," + baseData.address + "\n" +
         "OWNER,\""+ ownerLabelFormatter(baseData) +"\"\n" +
         "TAGS,\""+ baseData.assumedMeta.map(v => `${v.name}`).join(',') +"\"\n" +
         ",\n" +
         "BALANCE,"+ formatBtcAmount(baseData.balance) +"\n" +
         "TOTAL SENT,\""+ formatBtcAmount(baseData.amountSent) +"\"\n" +
         "TOTAL RECEIVED,\""+ formatBtcAmount(baseData.amountReceived) +"\"\n" +
         "NUMBER OF TXS,"+ baseData.txCount +"\n" +
         "TOTAL TX SENT,"+ baseData.txSentCount +"\n" +
         "TOTAL TX RECEIVED,"+ baseData.txReceivedCount +"\n" +
         "FIRST SEEN," + formatDate(baseData.firstSeen * 1000, 'dd.MM.yyyy hh:mm a') + "\n" +
         "LAST SEEN," + formatDate(baseData.lastSeen * 1000, 'dd.MM.yyyy hh:mm a') + "\n" +
         ",\n" +
         "RISK SCORE,"+ formatFunds(Number(totalFunds), false) +"\n,\n"
         + addressIsOwnerByHightRisk() +"\n,\n"
         + hasDirectlyMixing() +"\n,\n"
         + addressAreUnidentified() +"\n,\n"
         + hasTagMoreRiskPoint()  +"\n,\n"
      if (type === 'tx_hash') return "TRANSACTION INFORMATION,\n" +
          "TX HASH," + baseData.tx_hash + "\n" +
          "TOTAL AMOUNT,\""+ formatBtcAmount(baseData.inputsAmount) +"\"\n" +
          "TOTAL INPUTS,"+ baseData.totalInputs +"\n" +
          "TOTAL OUTPUTS,"+ baseData.totalOutputs +"\n" +
          "TIMESTAMP," + formatDate(baseData.timestamp * 1000, 'dd.MM.yyyy hh:mm a') + "\n" +
          ",\n" +
          "RISK SCORE,"+ formatFunds(Number(totalFunds), false) +"\n,\n"
  }

  const grouppedByType = formatter([...riskyData, ...knownData, ...unknownData], 'funds.type').map((item) => ({
    type: item.funds.type,
    amount: formatBtcAmount(item.amount),
    share: formatShare(item.share),
  })).sort((a, b) => ((a.share < b.share)) ? 1 : -1)

  const grouppedByOwner = formatter([...riskyData, ...knownData, ...unknownData], 'owner')
      .map((item) => ({
        owner: item.owner,
        amount: formatBtcAmount(item.amount),
        share: formatShare(item.share),
      })).sort((a, b) => ((a.share < b.share)) ? 1 : -1)

  let csvContent = "data:text/csv;charset=utf-8, "+ "This report is generated using Global Ledger proprietary technology, research capabilities, and community reports." +"\n,\n "+ selectionReport(reportType) +""
  csvContent += [
    ""+ formatShare(percent) + " of funds comes from risky sources \n",
    grouppedTitle('TYPE'),
    grouppedByType.length > 0 ? Object.keys(grouppedByType[0]).join(",") : '',
    ...(grouppedByType.length > 0 ? grouppedByType.map(item => Object.values(item).join(",")) : ''),
    grouppedTitle('OWNER'),
    grouppedByOwner.length > 0 ? Object.keys(grouppedByOwner[0]).join(",") : '',
    ...(grouppedByOwner.length > 0 ? grouppedByOwner.map(item => Object.values(item).join(",")) : ''),
    risky.length > 0 ? riskyTitle : '',
    risky.length > 0 ? Object.keys(risky[0]).join(",") : '',
    ...(risky.length > 0 ? risky.map(item => Object.values(item).join(",")) : ''),
    unknown.length > 0 ? unknownTitle : '',
    unknown.length > 0 ? Object.keys(unknown[0]).join(",") : '',
    ...(unknown.length > 0 ? unknown.map(item => Object.values(item).join(",")) : ''),
    known.length > 0 ? knownTitle : '',
    known.length > 0 ? Object.keys(known[0]).join(",") : '',
    ...(known.length > 0 ? known.map(item => Object.values(item).join(",")) : ''),
  ]
      .join("\n")
      .replace(/(^\[)|(\]$)/gm, "");

  const data = encodeURI(csvContent);
  const link = document.createElement("a");

  link.setAttribute("href", data);
  link.setAttribute("download", `${csvName}_${formatDate(new Date)}.csv`);
  link.click();
}

export const csvExport = (exportData, csvName = "logs") => {
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += [
    Object.keys(exportData[0]).join(","),
    ...exportData.map((item) =>
        Object.values(item)
            .map(item => `"${item ? item.replace('#', encodeURIComponent('#')) : ''}"`).join(","))
  ]
    .join("\n")
    .replace(/(^\[)|(\]$)/gm, "");

  const data = encodeURI(csvContent);
  const link = document.createElement("a");
    
  link.setAttribute("href", data);
  link.setAttribute("download", `${csvName}_${formatDate(new Date)}.csv`);
  link.click();
}