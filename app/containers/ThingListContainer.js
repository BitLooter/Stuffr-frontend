import { connect } from 'react-redux'
import { showThingInfo } from '../actions'
import ThingList from '../components/ThingList'

const mapStateToProps = (state) => {
  return state
}

const mapDispatchToProps = (dispatch) => {
  return {
    onThingClick: (id) => {
      dispatch(showThingInfo(id))
    }
  }
}

// TODO: Change these to decorators once it's available in babel
const ThingListContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ThingList)
export default ThingListContainer
