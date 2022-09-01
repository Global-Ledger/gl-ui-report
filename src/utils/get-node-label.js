export const getNodeLabel = ({ clusterData, addressData, cluster, id, description }, showLabel, showAddress) => {
	if (!showLabel && !showAddress) return ''
	const labelValue = showLabel && clusterData && clusterData.owner || showLabel && addressData && addressData.description || showLabel && addressData && addressData.owner
	? getLabelValue(clusterData, addressData, cluster, id, description) 
	: showLabel 
		? getLabelValue(clusterData, addressData, cluster, id, description)
		: ''
	const addressValue = showAddress ? id : '';

	return labelValue === addressValue ? labelValue : `${labelValue}\n${addressValue}`
}

export const getEthNodeLabel = ({ nodeData },label, address, ele) => {
	if (ele.data('description')) return ele.data('description')
	if (nodeData.name) return nodeData.name
	if (nodeData.owner) return nodeData.owner
	return address
}

const formattingScoringList = (data) => {
	let SCORING_LIST = []

	if (data.addressData && data.addressData.tags) {
		SCORING_LIST = [...SCORING_LIST, ...data.addressData.tags]
	}

	if (data.clusterData && data.clusterData.tags) {
		SCORING_LIST = [...SCORING_LIST, ...data.clusterData.tags]
	}

	if (data.addressData && data.addressData.type) {
		SCORING_LIST = [...SCORING_LIST, ...data.addressData.type]
	}

	if (data.clusterData && data.clusterData.type) {
		SCORING_LIST = [...SCORING_LIST, ...data.clusterData.type]
	}

	SCORING_LIST = SCORING_LIST.flat().filter((v) => v) > 0 ? SCORING_LIST.filter((v,i,a)=>a.findIndex(t=>(t.name===v.name))===i) : []

	SCORING_LIST.sort((a, b) => ((a.score < b.score)) ? 1 : -1)

	return SCORING_LIST.flat().length > 0 ? getMaxScore(SCORING_LIST) : null
}

const getMaxScore = (scores) => {
	return scores.reduce((prev, current) => {
		return (prev.score > current.score) ? prev : current
	})
}

const getLabelValue = (clusterData, addressData, cluster, id, description) => {

	if (id === '1DxQCmhamsEC8KuWZiFqYGhYKZEgmNjTD2') {
		console.log(clusterData, addressData, cluster, id, description, 'findNodefindNodefindNode')
	}
  if (description) return description
  if (addressData && addressData.owner) return addressData.owner
  if (clusterData && clusterData.owner) return clusterData.owner
  if (formattingScoringList({ clusterData, addressData })) {
	return formattingScoringList({ clusterData, addressData }).name
  }
  if (addressData && addressData.type && addressData.type.name) return `Unidentified ${addressData.type.name}`
  if (clusterData && clusterData.type && clusterData.type.name) return `Unidentified ${clusterData.type}`
	if (cluster) return cluster
	if (addressData && addressData.description) return addressData.description
	if (clusterData && clusterData.entity) return clusterData.entity
  return id
}