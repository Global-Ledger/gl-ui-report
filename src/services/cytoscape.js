import { layoutConfig } from '@/config/cola'
import { formatBtcAmount, formatHash } from '@/utils/format-btc-amount'
import { formatHashAndAmount } from '@/utils/format-hash-and-amount'
import { toComaSeparate } from '@/utils/formatNumber'
import { getEthNodeLabel, getNodeLabel } from '@/utils/get-node-label'
import { randomizeValue } from '@/utils/randomize-value'

const ZOOM_STEP = 0.5

const coinbaseAddress = 'COINBASE (NEWLY GENERATED COINS)'

class CytoscapeService {
  constructor(cy, viewMode = 'address', searchType = 'address') {
    this.cy = cy
    this.viewMode = viewMode
    this.searchType = searchType
    this.history = []
    this.undoStoryItem = null
    this.redoStory = []
    this.redoStoryItem = null
    this.search = null
    this.PARENT = 'parent'
    this.LOG = 'log'
    this.INTERNAL = 'internal'
    this.redoStoryEntity = {}
    this.trasingCount = 0
    this.phiPositionDiff = 150
  }

  resize() {
    this.cy.resize()
  }

  setSearchValue(val) {
    this.search = val
  }

  changeZoom(mode) {
    const currentZoom = this.cy.zoom()
    this.cy.zoom({
      level: mode === 'in' ? currentZoom + ZOOM_STEP : currentZoom - ZOOM_STEP,
    })
  }

  runLayoutForCollection(fit = false) {
    //TODO temporary solution
    this.rerunLayout(fit)
    //this.cy.elements(selector).layout(layoutConfig).run()
  }

  rerunLayout(fit = false, nodeSpacing = 15) {
    layoutConfig.nodeSpacing = nodeSpacing
    this.cy.layout({...layoutConfig, fit }).stop().destroy().run()

    this.cy.ready(() => {
      setTimeout(() => this.cy.edges().forEach(v => {
        // console.log(v.data('txHash'))
        this.checkFulledDisplayingTX(v.data('txHash'))
        this.unlockNodes()
      }), 100)
    })

    if (this.trasingCount > 0 && this.trasingCount < 2) {
      this.cy.ready(() => {
        setTimeout(() => {
          this.cy.center(this.cy.elements())
          this.unlockNodes()
        }, 100)
      })
    }
  }

  formatterAmount(data, input, output) {
    if (input.coinbase) return output.amount

    if (output.amount === data.outputsAmount) {
      return input.amount
    } else {
      return (output.amount / data.inputsAmount) * input.amount
    }
  }

  updateData(id, paginationData) {
    const a = this.cy.edges().find(edge => edge.data('txHash'))

    a.data({ paginationData })
  }

  visualizeTransactionData(data, directionData = {}, fit = true) {
    this.setStory()
    this.lockNodes()
    data.inputs.forEach(input => {
      const inputsList = data.inputs.filter(item => item.address === input.address)
      this.createNode(input, data.tx_hash, directionData, inputsList)
    })
    data.outputs.forEach(output => {
      const outputsList = data.outputs.filter(item => item.address === output.address)
      this.createNode(output, data.tx_hash, directionData, outputsList)
    })
    data.inputs.forEach(input => {
      data.outputs.forEach(output => {
        this.createEdge(
            input.coinbase ? coinbaseAddress  : input.address,
          output.address,
          input.cluster,
          output.cluster,
          data.tx_hash,
            this.formatterAmount(data, input, output),
          data.tx_hash,
          data.inputsAmount,
          data)
      })
    })
    this.trasingCount += 1
    this.rerunLayout(fit)
    // this.setStory()
    // this.addHistoryEntry(data.tx_hash, data.tx_hash, 'tx_hash')
  }

  visualizeNew(address, data, positionData, clicked = false, fit = false) {
    this.setStory()
    this.lockNodes()
    this.cy.nodes(`#${ address }`).data({ ['clicked']: clicked })
    const timestamp = Date.now()
    data.forEach(item => {
      const inputInfo = item.inputs;
      const outputsInfo = item.outputs;

      const sortedInputs = [];
      const sortedOutputs = [];
      inputInfo.map(input => {
        outputsInfo.map(output => {
          if (input.address === output.address) {
            sortedInputs.push(input);
            sortedOutputs.push(output);
          }
        });
      });

      inputInfo.map(input => {
        !sortedInputs.find(s => s.address === input.address) && sortedInputs.push(input);
      });
      outputsInfo.map(output => {
        !sortedOutputs.find(s => s.address === output.address) && sortedOutputs.push(output);
      });

      const pInputs = sortedInputs.slice(0, 10)
      const pOutputs = sortedOutputs.slice(0, 10)
      const inputsCount = item.inputsCount || item.inputs.length
      const outputsCount = item.outputsCount || item.outputs.length

      const pItem = {
        ...item,
        outputsCount,
        inputsCount,
      }


      pInputs.forEach(input => {
        this.createNode(input, timestamp, positionData, clicked)
      })
      pOutputs.forEach(output => {
        this.createNode(output, timestamp, positionData, clicked)
      })
      pInputs.forEach(input => {
        pOutputs.forEach(output => {
          this.createEdge(
            input.coinbase ? coinbaseAddress  : input.address,
            output.address,
            input.cluster,
            output.cluster,
            item.tx_hash,
              this.formatterAmount(item, input, output),
              timestamp,
            item.inputsAmount,
            pItem)
        })
      })
    })
    this.trasingCount += 1
    this.runLayoutForCollection(fit)
    // this.addHistoryEntry(address, address, 'address', timestamp)
  }

  visualizeNextTransactionData(node, data, positionData) {
    this.setStory()
    this.lockNodes()
    this.cy.nodes(`#${ node.address }`).data({ ['clicked']: true })
    const timestamp = Date.now()
    const { id, cluster } = node.data()
    // this.setPreviousNextTxHash(node, { nextTxHash: [] })
    data.outputs.forEach(output => {
      this.createNode(output, timestamp, positionData)
      this.createEdge(output.coinbase ? coinbaseAddress  : id, output.address, cluster, output.cluster, data.tx_hash,
    output.amount === data.outputsAmount
        ? data.inputs.find(item => item.address === id)
            ? data.inputs.find(item => item.address === id).amount
            : output.amount
        // output.amount
        : (output.amount / data.outputsAmount) * data.inputs.find(item => item.address === id).amount,
        timestamp,
        data.inputsAmount,
        data)
      if (node.data('nextTxHash') && Array.isArray(node.data('nextTxHash'))) {
        node.data({ nextTxHash:  node.data('nextTxHash').filter(el => el !== data.tx_hash)})
      }
    })
    this.trasingCount += 1
    this.runLayoutForCollection()
  }

  visualizePreviousTransactionData(node, data, positionData) {
    this.setStory()
    this.lockNodes()
    this.cy.nodes(`#${ node.address }`).data({ ['clicked']: true })
    const timestamp = Date.now()
    const { id, cluster } = node.data()
    // this.setPreviousNextTxHash(node, { prevTxHash: [] })
      data.inputs.forEach(input => {
        this.createNode(input, timestamp, positionData)
        this.createEdge(input.coinbase ? coinbaseAddress : input.address, id, input.cluster, cluster, data.tx_hash,
          input.amount === data.inputsAmount
              ? data.outputs.find(item => item.address === id)
                  ? data.outputs.find(item => item.address === id).amount
                  : input.amount
              : input.amount,
          timestamp,
          data.outputsAmount,
          data)
        if (node.data('prevTxHash') && Array.isArray(node.data('prevTxHash'))) {
          node.data({ prevTxHash:  node.data('prevTxHash').filter(el => el !== data.tx_hash)})
        }
      })
    this.trasingCount += 1
    this.runLayoutForCollection()
  }

  setStory() {
    let elements = this.cy.elements().jsons()
    this.history.push(elements)
    this.history = this.history.filter(ele => ele.length !== 0)
  }

  getClickedState(data) {
    const { prev_tx_hash, next_tx_hash } = data

    // if (prev_tx_hash && prev_tx_hash.length > 0 && Array.isArray(prev_tx_hash) && prev_tx_hash.every(ele => this.searchElements(ele, false, false).length > 0) && next_tx_hash && next_tx_hash.length > 0 && Array.isArray(next_tx_hash) && next_tx_hash.every(ele => this.searchElements(ele, false, false).length > 0)) {
    //   return true
    // }
    //
    // return next_tx_hash && next_tx_hash.length > 0 && Array.isArray(next_tx_hash) && next_tx_hash.every(ele => this.searchElements(ele, false, false).length > 0);
    return (prev_tx_hash && prev_tx_hash.length > 0 && Array.isArray(prev_tx_hash) && prev_tx_hash.every(ele => this.searchElements(ele, false, false).length > 0)
        && next_tx_hash && next_tx_hash.length > 0 && Array.isArray(next_tx_hash) && next_tx_hash.every(ele => this.searchElements(ele, false, false).length > 0))
  }

  findParentInLogs(data, fromData, key = 'fromData') {
    const { from, to, value } = data.find(item => item.txType === this.PARENT)
    const parentInLogsFromData = data
        .filter(item => item.txType === this.LOG)
        .find(log => log.from === from && log.to === to && log.value === value)

    if (parentInLogsFromData) {
      return parentInLogsFromData[key]
    }

    return fromData
  }

  comparisonWithParent(parentNode, comparisonNode) {
    if (comparisonNode.txType === this.PARENT) return comparisonNode

    return !(parentNode.from === comparisonNode.from
        && parentNode.to === comparisonNode.to
        && parentNode.value === comparisonNode.value);
  }

  replaceTxHash(address, txHash, direction = 'prev') {
    let node = this.cy.nodes(`[id="${ address }"]`)

    if (direction === 'prev' && node.data(`${direction}TxHash`)
        && Array.isArray(node.data(`${direction}TxHash`))) {
      node.data({ prevTxHash:  node.data(`${direction}TxHash`).filter(el => el !== txHash)})
    } else if (node.data(`${direction}TxHash`)
        && Array.isArray(node.data(`${direction}TxHash`))) {
      node.data({ nextTxHash:  node.data(`${direction}TxHash`).filter(el => el !== txHash)})
    }
  }

  setTxHash(address, txHash, direction = 'prev') {
    const node = this.cy.nodes(`[id="${ address }"]`)

    direction === 'prev' ? node.data({ prevTxHash:  node.data(`${direction}TxHash`).push(txHash)})
        : node.data({ nextTxHash:  node.data(`${direction}TxHash`).push(txHash)})

    this.rerunLayout()
  }

  visualizeEthData(address, data, positionData, prevNextInfo) {
    this.setStory()
    this.lockNodes()
    const parentNode = data.find(item => item.txType === this.PARENT)
    const parentTxHash = data.find(item => item.txType === this.PARENT).tx_hash

    data.forEach(node => {
      if (node.txType === this.PARENT) {
        node.fromData = this.findParentInLogs(data, node.fromData)
        node.contractData = this.findParentInLogs(data, node.contractData, 'contractData')
      }

      this.createEthNode(
          node.from,
          address,
          {
            ...node,
            riskScore: node?.fromData?.riskScore || -1,
            name: node.fromData && node.fromData.name ? node.fromData.name : '',
            owner: node.fromData && node.fromData.owner ? node.fromData.owner : '',
            isContract: node.fromData && node.fromData.isContract ? node.fromData.isContract : false,
            hasSymbol: node.fromData && node.fromData.symbol ? node.fromData.symbol : false,
            risk: node.fromData && node.fromData.risk ? node.fromData.risk : false,
            isFrom: true,
            simpleView: Boolean(node.simpleView),
            disabled: Boolean(prevNextInfo.disabled.find(el => el === node.from)),
            prevHashes: [],
            nextHashes: [],
          },
          node.prevTx,
          node.nextTx,
          positionData
      )

      this.createEthNode(
          node.to,
          address,
          {
            ...node,
            riskScore: node?.toData?.riskScore || -1,
            name: node.toData && node.toData.name ? node.toData.name : '',
            owner: node.toData && node.toData.owner ? node.toData.owner : '',
            isContract: node.toData && node.toData.isContract ? node.toData.isContract : false,
            hasSymbol: node.toData && node.toData.symbol ? node.toData.symbol : false,
            risk: node.toData && node.toData.risk ? node.toData.risk : false,
            isTo: true,
            simpleView: Boolean(node.simpleView),
            disabled: Boolean(prevNextInfo.disabled.find(el => el === node.to)),
            prevHashes: [],
            nextHashes: [],
          },
          node.prevTx,
          node.nextTx,
          positionData
      )

      if (this.comparisonWithParent(parentNode, node)) {
        this.createEthEdge(
            node.from,
            node.to,
            this.getDecimalVal(node, node.value > 0 ? Number(node.value) : Number(node.valueEth) || 0),
            parentTxHash,
            'eth',
            this.getContractSymbol(node),
            {
              ...node,
              id: node._id,
              type: node.txType,
              timestamp: node.timestamp,
            },
            this.getTxLabel(node)
        )
        this.toggleSimpleView(true, parentTxHash)
      }
    })

    this.trasingCount += 1
    this.rerunLayout(false)
  }

  getDecimalVal(addressData, amount) {
    const defDecimal = 18
    const decimal = addressData
        && addressData.contractData
        && addressData.contractData.decimals

    return Number(amount) / Math.pow(10, decimal || defDecimal)
  }

  checkTxOnGraph() {
    this.cy.nodes().forEach(node => {
      if (node.data().nodeData.nextTx.every(tx => this.searchElements(tx, false, false).length > 0)
          && node.data().nodeData.prevTx.every(tx => this.searchElements(tx, false, false).length > 0)) {
        node.addClass('nonTxs')
      }
    })
  }

  getContractSymbol(node) {
    if (node.txType === this.PARENT) {
      return 'ETH'
    }

    if (node.value && node.valueEth && node.value === node.valueEth) {
      return ''
    }

    if (node.contractData && node.contractData.symbol) {
      return node.contractData.symbol
    }

    if (node.fromData && node.fromData.symbol) {
      return node.fromData.symbol
    }

    if (node.toData && node.toData.symbol) {
      return node.toData.symbol
    }

    return ''
  }

  getTxLabel(node) {
    if (node.value > 0) {
      return ''
    }

    if (node.method_name) {
      return node.method_name
    }

    if (node.txType === this.INTERNAL) {
      return node.type || node.origType ||  ''
    }

    if (node.txType === this.LOG) {
      return node.value ? '' : node.amount
    }

    return ''
  }

  checkNonTxsClass(node) {
    if (((node.data('nodeData').nextTx.length > 0 || node.data('nodeData').prevTx.length > 0) && !node.data('nodeData').clicked) && !node.data('nodeData').disabled) {
      node.removeClass('nonTxs')
    } else if ((node.data('nodeData').nextTx.length === 0 && node.data('nodeData').prevTx.length === 0) || node.data('nodeData').disabled) {
      node.addClass('nonTxs')
    }
  }

  replaceTx(hash, tx) {
    const replaceCheckNode = this.cy.nodes().find(node => node.data('id') === hash)

    if (replaceCheckNode.length > 0) {
      replaceCheckNode.data('nodeData').prevHashes = replaceCheckNode.data('nodeData').prevHashes.filter(txHash => txHash !== tx)
      replaceCheckNode.data('nodeData').nextHashes = replaceCheckNode.data('nodeData').nextHashes.filter(txHash => txHash !== tx)

      this.checkNonTxsClass(replaceCheckNode)
    }
  }

  createEthNode(input, address, nodeData, prev, next ,{ position = { x: 0, y: 0 } } = {}) {
    try {
      const existed = this.cy.$id(input)
      if (existed.length) {
        if (nodeData.prevHashes.length > 0 && nodeData.isFrom) {
          existed.data('nodeData').prevHashes = [...new Set(existed.data('nodeData').prevHashes.concat(nodeData.prevHashes))]
        }

        if (nodeData.nextHashes.length > 0 && nodeData.isTo) {
          existed.data('nodeData').nextTx = [...new Set(existed.data('nodeData').nextHashes.concat(nodeData.nextHashes))]
        }

        existed.data('nodeData').clicked = false

        this.checkNonTxsClass(existed)
        return
      }

      nodeData = {
        ...nodeData,
        nextTx: nodeData.nextTx || [],
        prevTx: nodeData.prevTx || [],
      }

      const node = this.cy.add({
        data: {
          id: input,
          type: 'eth',
          nodeData,
        },
        position: {
          x: randomizeValue(position.x),
          y: randomizeValue(position.y),
        },
        classes: [
          'wallet',
          nodeData.isContract ? 'isContract' : '',
          nodeData.hasSymbol ? 'hasSymbol' : '',
          !nodeData.simpleView ? 'hidden' : '',
          input === '0x0000000000000000000000000000000000000000' ? 'isSystem' : '',
          ((nodeData.prevTx && nodeData.prevTx.length === 0) && (nodeData.nextTx && nodeData.nextTx.length === 0)
              || nodeData.disabled)
              ? 'nonTxs'
              : '',
        ],
      })

      if (this.viewMode === 'cluster') this.moveInCollapsedClusterIfNeeded(node)
    } catch (e) {
      console.log(e, 'err createEthNode')
    }
  }

  searchAndHideEthElementsByTxHash(value) {
    const edges = this.cy.edges().filter(elem => elem.data('txHash') === value)
    edges.remove()

    this.cy.nodes('[type="eth"]').forEach(ele =>
        {
          if (ele.connectedEdges().length === 0) {
            ele.remove()
          }
        }
    )

    this.removeEmptyClusters()
  }

  createEthEdge(sourceAddress, targetAddress, amount, txHash, searchType, contract, additionalData, label) {
    const edgeId = `${ sourceAddress }-${ txHash }-${ targetAddress }-${additionalData.id}`
    const existed = this.cy.$id(edgeId)
    if (existed.length) return

    this.cy.add({
      data: {
        id: edgeId,
        source: sourceAddress,
        target: targetAddress,
        sourceAddress,
        targetAddress,
        txHash,
        ethType: additionalData.type,
        contract,
        additionalData,
        amount,
        simpleView: Boolean(additionalData.simpleView),
        label: label ? label : undefined,
        type: 'tx',
        searchType,
      },
      classes: [
        !additionalData.simpleView ? 'advanced' : '',
        !additionalData.simpleView ? 'hidden' : '',
      ],
    })
  }

  getNodeParent(clusterId, clusterData, address) {
    if (!clusterId) return null
    if (this.viewMode === 'cluster') {
      if (!this.cy.nodes(`[type="cluster"][id="${ clusterId }"]`).length) {
        this.createCluster(clusterId, clusterData, address)
      }
      return clusterId
    }
    return null
  }

  addOutput(val, txHash, txData) {
    let position = {}

    this.cy.edges(`[txHash="${ txHash }"]`)[0].source().map(el => {
      position = {
        x: randomizeValue(el.position().x + this.phiPositionDiff),
        y: randomizeValue(el.position().y + this.phiPositionDiff),
      }
    })

    this.createNode(val, [], { position })

    let nodesList = this.cy.edges(`[txHash="${ txHash }"]`).map(el => {
      return el.data('source')
    })

    nodesList = [...new Set(nodesList)]

    nodesList = nodesList.map(el => this.cy.nodes(`#${el}`).data())

    nodesList.forEach(input => {
      this.createEdge(
          input.coinbase ? coinbaseAddress  : input.id,
          val.address,
          input.cluster,
          val.cluster,
          txData.tx_hash,
          val.amount === txData.outputsAmount
              ? input.coinbase ? val.amount : input.amountA
              : (val.amount / txData.inputsAmount) * input.amountA,
          txData.tx_hash,
          txData.inputsAmount,
          txData)
    })

    // Temp solution for check performance
    // this.rerunLayout()
  }

  addInput(val, txHash, txData) {

    let position = {}

    this.cy.edges(`[txHash="${ txHash }"]`)[0].target().map(el => {
      position = {
        x: randomizeValue(el.position().x + this.phiPositionDiff),
        y: randomizeValue(el.position().y + this.phiPositionDiff),
      }
    })

    this.createNode(val, [], { position })

    let nodesList = this.cy.edges(`[txHash="${ txHash }"]`).map(el => {
      return el.data('target')
    })

    nodesList = [...new Set(nodesList)]


    nodesList = nodesList.map(el => this.cy.nodes(`#${el}`).data())

    nodesList.forEach(output => {
      this.createEdge(
          val.coinbase ? coinbaseAddress  : val.address,
          output.id,
          val.cluster,
          output.cluster,
          txData.tx_hash,
          output.amountA === txData.outputsAmount
              ? val.coinbase ? output.amountA : val.amount
              : (output.amountA / txData.inputsAmount) * val.amount,
          txData.tx_hash,
          txData.inputsAmount,
          txData)
    })

    // Temp solution for check performance
    // this.rerunLayout()
  }

  removeInputOrOutput(address) {
    this.cy.nodes().forEach(node => {
      if (node.data('id') === address) {
        node.remove()
      }
    })
    this.cy.nodes('[type="wallet"]').forEach(ele =>
        {
          if (ele.connectedEdges().length === 0) {
            ele.remove()
          }
        }
    )
    this.removeEmptyClusters()
  }

  //TODO provide better name for arg
  createNode(input, historyEntry, { position = { x: 0, y: 0 } } = {}, txsList = [], clicked) {
    const existed = this.cy.$id(input.coinbase ? coinbaseAddress : input.address)
    if (existed.length) {
      this.setPreviousNextTxHash(existed, { prevTxHash: input.prev_tx_hash, nextTxHash: input.next_tx_hash })
      this.setClicked(existed, input)
      return
    }

    const node = this.cy.add({
      data: {
        id: input.coinbase ? coinbaseAddress : input.address,
        prevTxHash: input.prev_tx_hash || [],
        nextTxHash: input.next_tx_hash || [],
        type: 'wallet',
        risk: input.risk,
        riskScore: input.riskScore,
        cluster: input.cluster
          || (input.clusterData && input.clusterData.cluster)
          || (input.addressData && input.addressData.cluster),
        clusterData: input.clusterData,
        addressData: input.addressData,
        coinbase: input.coinbase,
        inputData: input,
        historyEntry,
        viewMode: this.viewMode,
        searchMode: this.searchMode,
        clicked,
        amountA: input.amount,
        txsList,
        parent: this.getNodeParent(input.cluster
          || (input.clusterData && input.clusterData.cluster)
          || (input.addressData && input.addressData.cluster), input.clusterData, input.address),
      },
      position: {
        x: randomizeValue(position.x),
        y: randomizeValue(position.y),
      },
      classes: ['wallet', input.coinbase ? 'isCoinbase' : ''],
    })

    if (this.viewMode === 'cluster') this.moveInCollapsedClusterIfNeeded(node)

    return node
  }

  createEdge(sourceAddress, targetAddress, sourceCluster, targetCluster, txHash, amount, historyEntry, inputsAmount, itemData = null) {
    const edgeId = `${ sourceAddress }-${ txHash }-${ targetAddress }`
    const existed = this.cy.$id(edgeId)
    if (existed.length) {
      this.cy.edges().find(edge => edge.data().id === edgeId).data().amount = amount
      this.setEdgeLabels({ amount: amount, hash: txHash })
      return
    }
      this.cy.add({
        data: {
          id: edgeId,
          // Need test
          source: sourceAddress || sourceCluster,
          target: targetAddress || targetCluster,
          sourceAddress,
          targetAddress,
          sourceCluster,
          targetCluster,
          inputsAmount,
          txHash,
          amount,
          type: 'tx',
          historyEntry,
          inputsCount: itemData ? itemData.inputsCount : null,
          outputsCount: itemData ? itemData.outputsCount : null,
        },
        classes: [this.checkFulledDisplayingTX(txHash) ? 'dotted' : ''],
      })

  }

  checkFulledDisplayingTX(txHash) {
    const a = []
    const b = []
    let txData = this.cy.edges().find(edge => edge.data('txHash') === txHash) || null
    txData = txData ? txData.data() : null

    this.cy.edges(`[txHash="${txHash}"]`).forEach(v => {
      a.push(v.data('source'))
    })

    this.cy.edges(`[txHash="${txHash}"]`).forEach((v) => {
      b.push(v.data('target'))
    })

    let displayInputsTotal = a.filter((v, i) => a.indexOf(v) === i).length
    let displayOutputsTotal = b.filter((v, i) => b.indexOf(v) === i).length

    if ((txData && txData.inputsCount && txData.inputsCount !== displayInputsTotal)
      ||  (txData && txData.outputsCount && txData.outputsCount !== displayOutputsTotal)) {
      this.cy.edges(`[txHash="${txHash}"]`).forEach((v) => {
        v.addClass('dotted')
      })
    } else {
      this.cy.edges(`[txHash="${txHash}"]`).forEach((v) => {
        v.removeClass('dotted')
      })
    }

    return (txData && txData.inputsCount && txData.inputsCount !== displayInputsTotal) ||  (txData && txData.outputsCount && txData.outputsCount !== displayOutputsTotal)
  }

  createCluster(id, clusterData, address) {
    this.cy.add({
      data: {
        id,
        clusterData,
        address,
        type: 'cluster',
        collapsed: false,
      },
      classes: ['cluster'],
    })
  }

  setViewMode(viewMode) {
    this.viewMode = viewMode
    if (viewMode === 'cluster') {
      this.clusterizeNodes()
    } else {
      this.unclusterizeNodes()
    }
  }

  setSearchMode(searchMode) {
    this.searchMode = searchMode
  }

  clusterizeNodes() {
    const clustersArray = this.cy.nodes('[type="cluster"]').map((node) => node.id())
    this.cy.startBatch()
    this.cy.nodes('[?cluster][type="wallet"]').forEach(node => {
      if (node.isOrphan()) {
        const clusterId = node.data('cluster')
        if (!clustersArray.includes(clusterId)) {
          clustersArray.push(clusterId)
          this.createCluster(clusterId, node.data('clusterData'), node.data('id'))
        }
        node.move({ parent: clusterId })
      }
    })
    this.cy.endBatch()
    this.rerunLayout(false)
  }

  unclusterizeNodes() {
    this.cy.nodes('[type="cluster"][?collapsed]').forEach(cluster => this.collapseCluster(cluster))
    this.cy.nodes('[?cluster]').move({ parent: null })
    this.cy.nodes('[type="cluster"]').remove()
    this.rerunLayout(true)
  }

  collapseCluster(cluster) {
    cluster.toggleClass('collapsed')
    if (cluster.data('collapsed')) {
      cluster.data('clusterElements').restore()
      this.cy.edges(`[sourceCluster = ${ cluster.id() }][targetCluster != ${ cluster.id() }]`).forEach(edge => edge.move({
        source: edge.data('sourceAddress'),
      }))
      this.cy.edges(`[targetCluster = ${ cluster.id() }][sourceCluster != ${ cluster.id() }]`).forEach(edge => edge.move({
        target: edge.data('targetAddress'),
      }))
      cluster.data({ clusterElements: null, collapsed: false })
      this.rerunLayout()
      return
    }
    this.cy.edges(`[sourceCluster = ${ cluster.id() }][targetCluster != ${ cluster.id() }]`).move({ source: cluster.id() })
    this.cy.edges(`[targetCluster = ${ cluster.id() }][sourceCluster != ${ cluster.id() }]`).move({ target: cluster.id() })
    const clusterElements = this.cy.nodes(`[cluster = ${ cluster.id() }]`)
      .union(this.cy.edges(`[sourceCluster = ${ cluster.id() }][targetCluster = ${ cluster.id() }]`))
      .remove()
    cluster.data({ clusterElements, collapsed: true })
  }

  moveInCollapsedClusterIfNeeded(node) {
    if (!node.data('cluster')) return
    const cluster = this.cy.nodes(`[type="cluster"][id="${ node.data('cluster') }"]`)
    const { clusterElements, collapsed } = cluster.data()
    if (collapsed) {
      cluster.data({ clusterElements: clusterElements.union(node) })
      node.remove()
    }
  }

  removeEmptyClusters() {
    this.cy.nodes('[type="cluster"]').forEach(node => {
      if (node.children().length === 0) node.remove()
    })
  }

  async exportToPng() {
    return await this.cy.png({
      output: 'blob-promise',
      bg: 'white',
      full: true,
      scale: 2
    })
  }

  async exportToBase64() {
    const nodesCount = this.cy.nodes().length
    const scale = nodesCount > 40 ? 0.1 : 0.6
    return await this.cy.png({
      output: 'base64',
      bg: 'white',
      full: true,
      scale,
    })
  }

  exportToCsv() {
    return this.cy.edges().reduce((a, edge) => {
      const { txHash, source, target, amount } = edge.data()
      return a.concat(`${ txHash }, ${ source }, ${ target }, ${ formatBtcAmount(amount) }\n`)
    }, 'tx_hash, from, to, amount\n')
  }

  exportToJson() {
    this.cy.nodes('[type="cluster"][?collapsed]').forEach(cluster => this.collapseCluster(cluster))
    return this.cy.json()
  }

  setNodeLabels({ address, label }) {
    this.cy.startBatch()
    this.cy.style()
      .selector('node.wallet')
      .style('label', ele => {
        return ele.data().type === 'eth' ? getEthNodeLabel(ele.data(), label, ele.data().id, ele) : getNodeLabel(ele.data(), label, address)
      })
      .update()
    this.cy.endBatch()
  }

  setEdgeLabels({ amount, hash }) {
    this.cy.startBatch()
    this.cy.style()
        .selector('edge')
        .style('label', ele => {
          if (ele.data('label') && ele.data('label') !== '') {
            return ele.data('label')
          }
          if (amount && hash) {
            return formatHashAndAmount(toComaSeparate(formatBtcAmount((ele.data('amount')), true, ele.data('searchType'), ele.data('contract'))), formatHash(ele.data('txHash')))
          }

          if (amount) {
            return toComaSeparate(formatBtcAmount((ele.data('amount')),true, ele.data('searchType'), ele.data('contract')))
          }

          if (hash) {
            return formatHash(ele.data('txHash'))
          }

          if (!amount && !hash) return ''
        })
        .update()
    this.cy.endBatch()
  }

  lockNodes(selector) {
    if (selector === ':selected') {
      const nodes = this.cy.nodes(selector)
      nodes.forEach(v => v.addClass('locked'))
      const clustersChild = nodes.children()
      nodes.lock()
      clustersChild.forEach(v => v.addClass('locked'))
      clustersChild.lock()
    } else {
      const nodes = this.cy.nodes(selector)
      const clustersChild = nodes.children()
      nodes.lock()
      clustersChild.lock()
    }
  }

  unlockNodes(selector) {
    if (selector === ':selected') {
      const nodes = this.cy.nodes(selector)
      nodes.forEach(v => v.removeClass('locked'))
      const clustersChild = nodes.children()
      nodes.unlock()
      clustersChild.forEach(v => v.removeClass('locked'))
      clustersChild.unlock()
    } else {
      const nodes = this.cy.nodes(selector).filter(v => !v.hasClass('locked'))
      const clustersChild = nodes.children()
      nodes.unlock()
      clustersChild.forEach(v => v.removeClass('locked'))
      clustersChild.unlock()
    }
  }

  hideNodes(selector) {
    this.setStory()
    const nodes = this.cy.nodes(selector)
    const clustersChild = nodes.children()
    const clusterChildEdges = clustersChild.connectedEdges()
    const clusterNodes = nodes.parent().children()
    if (clusterNodes.length === 1) {
      const singleCluster = clusterNodes.parent()
      const singleClusterEdges = singleCluster.children().connectedEdges()
      this.cy.scratch('_userHiddenNodes', singleCluster.union(this.cy.scratch('_userHiddenNodes')))
      this.cy.scratch('_userHiddenEdges', singleClusterEdges.union(this.cy.scratch('_userHiddenEdges')))
      this.cy.remove(singleCluster)
    }
    const edges = nodes.connectedEdges()
    this.cy.scratch('_userHiddenNodes', nodes.union(this.cy.scratch('_userHiddenNodes')))
    this.cy.scratch('_userHiddenNodes', clustersChild.union(this.cy.scratch('_userHiddenNodes')))
    this.cy.scratch('_userHiddenEdges', edges.union(this.cy.scratch('_userHiddenEdges')))
    this.cy.scratch('_userHiddenEdges', clusterChildEdges.union(this.cy.scratch('_userHiddenEdges')))
    this.cy.remove(edges)
    this.cy.remove(nodes)
    this.removeEmptyClusters()
  }

  showHiddenNodes() {
    if (this.cy.scratch('_userHiddenNodes')) {
      this.cy.add(this.cy.nodes().diff(this.cy.scratch('_userHiddenNodes')).right)
      this.cy.removeScratch('_userHiddenNodes')
    }
    if (this.cy.scratch('_userHiddenEdges')) {
      this.cy.add(this.cy.edges().diff(this.cy.scratch('_userHiddenEdges')).right)
      this.cy.removeScratch('_userHiddenEdges')
    }
    this.cy.layout(layoutConfig).run()
  }

  resetGraph() {
    this.cy.removeScratch('_userHiddenNodes')
    this.cy.removeScratch('_userHiddenEdges')
    this.cy.remove(this.cy.elements())
    this.history = []
    this.redoStory = []
  }

  searchElements(value, zoom = true, select = true,) {
    const elements = this.cy.filter(elem => elem.id().includes(value))
    if (select) {
      elements.select()
    }
    if (zoom) this.cy.zoom(1).center(elements)
    return elements
  }

  searchElement(value, zoom = true, select = true,) {
    const element = this.cy.filter(elem => elem.id().toLowerCase() === value.toLowerCase())
    if (select) {
      element.select()
    }
    if (zoom) this.cy.zoom(1).center(element)
    return element
  }

  searchAndHideElementsByTxHash(hash, currData) {
    const edges = this.cy.edges().filter(elem => elem.data('txHash') === hash)

    if (edges.length) {
      edges.forEach(edge => {
        edge.remove()
      })

      this.cy.nodes('[type="wallet"]').forEach(ele =>
        {
          if (ele.connectedEdges().length === 0) {
            ele.remove()
          }
        }
      )

      this.removeEmptyClusters()

      return
    }

    // Now in pause, test upper code
    edges.forEach(edge => {
      let [from, to] = edge.connectedNodes().map(ele => {
        return ele.data('id')
      })

      let a = [currData.inputs, currData.outputs].flat().map(ele => ele.address)

      if (a.includes(from) || a.includes(to)) {
        edge.remove()
      }
    })


    this.cy.nodes('[type="wallet"]').forEach(ele =>
      {
        if (ele.connectedEdges().length === 0) {
          ele.remove()
        }
      }
    )

    this.removeEmptyClusters()
  }

  checkConnectAddressByHash(address, hash) {
    const node = this.cy.nodes(`#${address}`)[0]

    if (node) {
      const edgeData = node.connectedEdges().find(el => el.data('txHash') === hash)

      return node.connectedEdges().find(el => el.data('txHash') === hash)
        ? node.connectedEdges().find(el => el.data('txHash') === hash).length > 0 && (edgeData.data(`source`) === address || edgeData.data(`target`) === address )
        : false
    }
  }

  nodeHasManyTxsHash(address) {
    const node = this.cy.nodes(`#${address}`)[0]

    if (node) {
      const arr = node.connectedEdges().map(el => el.data('txHash'))
      return arr.filter((item, pos) => {
        return arr.indexOf(item) === pos;
      }).length > 1

    } else return false
  }

  isCircleTx(address) {
    const node = this.cy.nodes(`#${address}`)[0]

    if (node) {
      return node.connectedEdges().find(el => el.data('source') === el.data('target') && address === el.data('source'))
    } else return false
  }

  setPreviousNextTxHash(node, { prevTxHash, nextTxHash }) {
    if (node.data('prevTxHash') && node.data('prevTxHash').length > 0 && prevTxHash && prevTxHash.length > 0) {
      if (typeof prevTxHash === 'string') {
        prevTxHash = [prevTxHash]
      }

      if (typeof node.data('prevTxHash') === 'string') {
        node.data({ prevTxHash: [node.data('prevTxHash')] })
      }
      prevTxHash.forEach((tx) => {
        node.data('prevTxHash').push(tx)
      })
    } else {
      if (prevTxHash !== undefined && prevTxHash.length !== 0) node.data({ prevTxHash })
    }

    if (node.data('nextTxHash') && node.data('nextTxHash').length > 0 && nextTxHash && nextTxHash.length > 0) {
      if (typeof nextTxHash === 'string') {
        nextTxHash = [nextTxHash]
      }

      if (typeof node.data('nextTxHash') === 'string') {
        node.data({ nextTxHash: [node.data('nextTxHash')] })
      }

      nextTxHash.forEach((tx) => {
        node.data('nextTxHash').push(tx)
      })
    } else {
      if (nextTxHash !== undefined && nextTxHash.length !== 0) node.data({ nextTxHash })
    }
  }

  toggleFullView(val, txHash) {
    this.cy.edges(`[txHash="${ txHash }"]`).forEach(edge => {
      if (edge.data('amount') === 0 && !val) {
        edge.addClass('hidden')
      } else if (edge.data('amount') === 0 && val) {
        edge.removeClass('hidden')
      }
    })

    this.cy.nodes().forEach(node => {
      if (node.connectedEdges().every(item => item.hasClass('hidden'))) {
        node.addClass('hidden')
      } else {
        node.removeClass('hidden')
      }
    })
  }

  toggleSimpleView(val, txHash) {
    this.cy.edges(`[txHash="${ txHash }"]`).forEach(edge => {
      if (!edge.data('simpleView') && val) {
        edge.addClass('hidden')
      } else if (!edge.data('simpleView') && edge.data('amount') > 0 &&  !val) {
        edge.removeClass('hidden')
      }
    })

    this.cy.nodes().forEach(node => {
      if (node.connectedEdges().every(item => item.hasClass('hidden'))) {
        node.addClass('hidden')
      } else {
        node.removeClass('hidden')
      }
    })
  }

  setClicked(node, data) {
    node.data({ clicked: this.getClickedState(data) })
  }

  //type 'prevTxHash', 'nextTxHash', 'address'
  addHistoryEntry(value, clickedNode, type, uuid) {
    console.log('ADD STORY', value)
    this.history.push({ value, clickedNode, type, uuid })
    this.undoStoryItem = this.cy.elements().filter(elem => elem.data('historyEntry') === uuid)
    console.log('UNDO STORY', this.undoStoryItem)
  }

  canUndo() {
    return this.undoStoryItem !== null
  }

  canRedo() {
    return this.redoStoryItem !== null
  }

  undoLastVisualization() {
    if (this.history.length) {
      let elements = this.cy.elements().jsons()
      this.redoStory.push(elements)
      const visualizeData = this.history.pop()
      this.cy.json({ elements: visualizeData })

      return visualizeData
    }
  }

  visualizeFromJson(elements) {
    this.cy.json({ elements })
  }

  redoLastVisualization() {
    if (this.redoStory.length) {
      let elements = this.cy.elements().jsons()
      this.history.push(elements)
      const visualizeData = this.redoStory.pop()
      this.cy.json({ elements: visualizeData })

      return visualizeData
    }
  }

  selectIncomers(selector) {
    this.cy.nodes(selector).incomers().select()
  }

  hasIncomers(selector) {
      return Boolean(this.searchElements(selector, false, false).incomers().length > 0)
  }

  hasOutgoers(selector) {
    return Boolean(this.searchElements(selector, false, false).outgoers().length > 0)
  }

  selectOutgoers(selector) {
    this.cy.nodes(selector).outgoers().select()
  }

  deselectNode(nodeId) {
		this.cy.nodes(`#${nodeId}`).deselect()
	}

  aStar(from, to) {
    const elementsFrom = this.cy.filter(elem => elem.id().includes(from))
    const elementsTo = this.cy.filter(elem => elem.id().includes(to))

    if (elementsFrom.length === 0 || elementsTo.length === 0) return { found: false }
    if (!this.cy.nodes(`node#${ from }, node#${ to }`).length) return { found: false }
    const { found, distance, path } = this.cy.elements()
      .aStar({ root: `node#${ from }`, goal: `node#${ to }`, directed: true })
    if (found) path.select()
    return { found, distance, path }
  }
}

export { CytoscapeService }
