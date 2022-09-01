export default {
  SET_HISTORY(state, data) {
    state.history = data
  },
  ADD_HISTORY_ENTRY(state, data){
    state.history.unshift({...data, createdAt: new Date().toJSON()})
    state.history.pop()
	},
	SET_VALIDATE_HASH(state, data) {
		state.isHash = data
	},
	SET_STEPPED_STATE(state, { undo, redo }) {
		state.canUndo = undo
		state.canRedo = redo
	},
	SET_VALIDATE_ADDRESS(state, data) {
		state.isAddress = data
	},
	SET_SEARCH_VALUE(state, data) {
		state.searchValue = data
	},
	SET_SEARCH_TYPE(state, data) {
		state.searchType = data
	},
	SET_COIN_TYPE(state, data) {
		state.coinType = data
	},
}
