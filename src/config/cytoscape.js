import Color from 'color'
// import { colors } from './colors'
import { ethTypesColors } from './colors'
import { layoutConfig } from './cola'
import { getNodeLabel } from '@/utils/get-node-label'
import { findColorByTypeScore } from "@/utils/cytoskape-ui-rules";
// import { getIsTxHash } from '@/utils/get-is-tx-hash'

const getColorByEthType = ele => {
  const { ethType } = ele.data()
  return ethTypesColors[ethType] || '#15c3c4'
}


const getElementColorByType = ele => {
  const { color } = ele.data()

  if (color) return color

  if (ele.data().type === 'eth') {
    return !ele.data('nodeData').riskScore || ele.data('nodeData').riskScore === -1
        ? '#15c3c4'
        : findColorByTypeScore(ele.data('nodeData').riskScore);
  }

  if (ele.data().type === 'wallet') {
    return !ele.data().addressData || ele.data().addressData.riskScore === -1
        ? '#15c3c4'
        : findColorByTypeScore(ele.data().addressData.riskScore)
  }

  if (ele.data().type === 'cluster') {
    return ele.data().clusterData.riskScore === -1
        ? '#15c3c4'
        : findColorByTypeScore(ele.data().clusterData.riskScore)
  }

  return findColorByTypeScore(-1)
}

const getClickedState = node => {
  if (node.data('type') === 'eth') {
    return node.data('nodeData').clicked
        && node.data('nodeData').prevHashes.length === 0
        && node.data('nodeData').nextHashes.length === 0
  }

  if (node.data('searchMode') === 'tx' || node.data('searchMode') === 'address') {
    return (((!node.data('prevTxHash') || node.data('prevTxHash').length === 0)
        && (!node.data('nextTxHash') || node.data('nextTxHash').length === 0)) || node.data('clicked'))
  }
}

export const config = {
  elements: [],
  style: [
    {
      selector: 'core',
      style: {
        'active-bg-color': '#5a78ea',
        'selection-box-color': '#9caff2',
        'selection-box-border-color': '#5a78ea',
      },
    },
    {
      selector: 'node',
      style: {
        'font-family': 'Montserrat',
        'font-size': '8px',
        'text-halign': 'center',
        'text-valign': 'center',
        'text-wrap': 'wrap',
        color: '#1b1f3b',
      },
    },
    {
      selector: 'node.cluster',
      style: {
        label: ele => {
          const { clusterData } = ele.data()
          return clusterData && clusterData.owner ? clusterData.owner.toUpperCase() : ele.id()
        },
        'font-size': '10px',
        'text-valign': 'top',
        'text-halign': 'center',
        'text-margin-y': 16,
        'text-max-width': function(ele) {
          return ele.width() + 40
        },
        'text-wrap': 'ellipsis',
        'compound-sizing-wrt-labels': 'exclude',
        // 'background-image':
        //   'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAMSURBVBhXY/j//z8ABf4C/qc1gYQAAAAASUVORK5CYII=',
        'background-position-x': '0',
        'background-position-y': '0',
        'background-repeat': 'no-repeat',
        'background-clip': 'none',
        'background-width': '100%',
        'background-height': '20px',
        'background-fit': 'contain',
        'background-color': ele => Color(getElementColorByType(ele)).mix(Color("#f0f2f9"), 0.95).hex(),
        'border-color': ele => getElementColorByType(ele),
        'border-width': 1,
        shape: 'roundrectangle',
        'color':  "#18181818",
        padding: '20px',
      },
    },

		{
			selector: 'node.cluster:selected',
			style: {
				'border-width': 3,
				padding: '25px',
			},
		},

    {
      selector: 'node.collapsed',
      style: {
        'background-color': ele => getElementColorByType(ele),
      },
    },
    {
      selector: 'node.root',
      style: {
        'border-width': 2,
        'border-color': '#fff',
      },
    },
    {
      selector: '.locked',
      style: {
        'border-width': 2,
        'border-color': '#000',
      },
    },
    {
      selector: 'node.wallet:selected',
      style: {
        'border-width': 30,
        'border-color': function(ele) {
          return ele.style('background-color')
        },
        'border-opacity': 0.38,
      },
    },
    {
      selector: 'node.wallet',
      style: {
        // "text-outline-color": "#fff",
        // "text-outline-width": "1px",
        'background-color': ele => ele.data('risk') || (ele.data('addressData') && ele.data('addressData').risk) || (ele.data('clusterData') && ele.data('clusterData').risk)
            ? getElementColorByType(ele)
            : ele.data('coinbase')
                ? '#B9E6EC'
                : Color(getElementColorByType(ele))
          //TODO temp fix
          .mix(Color("#f0f2f9"), getClickedState(ele)  ? 0.75 : 0).hex(),
        'overlay-color': ele => ele.style('background-color'),
        label: ele => getNodeLabel(ele.data(), true, false),
      },
    },
    {
      selector: 'node.undecoded',
      style: {
        'background-color': '#15c3c4',
      },
    },
    {
      selector: '.hidden',
      style: {
        visibility: 'hidden',
      },
    },
    {
      selector: 'edge',
      css: {
        'font-family': 'Montserrat',
        'control-point-step-size': 40,
        'curve-style': 'bezier',
        'line-color': function(ele) {
          return getColorByEthType(ele)
        },
        'target-arrow-color': function(ele) {
          return getColorByEthType(ele)
        },
        'target-arrow-shape': 'triangle',
        width: function (ele) {
          if (ele.data().ethType && ele.data().ethType === 'parent') {
            return 2
          } return 1
        },
        opacity: 0.5,
        'edge-text-rotation': 'bottom-center',
        'font-size': '8px',
      },
    },
    // {
    //   selector: "edge.danger",
    //   style: {
    //     "line-color": "#ecdc2f",
    //     "target-arrow-color": "#ecdc2f"
    //   }
    // },
    {
      selector: 'edge.loop',
      style: {
        'line-color': '#5a78ea',
        'target-arrow-color': '#5a78ea',
      },
    },
    {
      selector: '.dotted',
      style: {
        'line-style': 'dotted',
        width: 3
      },
    },
    {
      selector: 'edge:selected',
      style: {
        width: 5,
      },
    },
    {
      selector: '.isContract',
      style: {
        shape: 'round-rectangle'
      }
    },
    {
      selector: '.hasSymbol',
      style: {
        shape: 'round-pentagon'
      }
    },
    {
      selector: '.isSystem',
      style: {
        "background-color": '#207542',
        shape: 'ellipse',
        color: '#fff'
      }
    },
    {
      selector: '.nonTxs',
      style: {
        opacity: 0.6,
      }
    },
  ],
  layout: layoutConfig,
  zoom: 1,
  pan: { x: 0, y: 0 },

  // interaction options:
  minZoom: 0.2,
  maxZoom: 10,
  zoomingEnabled: true,
  userZoomingEnabled: true,
  panningEnabled: true,
  userPanningEnabled: true,
  motionBlur: true,
  textureOnViewport: false,
}
