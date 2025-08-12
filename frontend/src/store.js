import { legacy_createStore as createStore } from 'redux'

const initialState = {
  sidebarShow: true,
  theme: 'light',
  isAuthenticated: false,
  user: null,
}

const changeState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'set':
      return { ...state, ...rest }
    case 'LOGIN_SUCCESS':
      return { 
        ...state, 
        isAuthenticated: true,
        user: rest.user
      }
    case 'LOGOUT':
      return { 
        ...state, 
        isAuthenticated: false,
        user: null
      }
    default:
      return state
  }
}

// Check for existing token on app load
const token = localStorage.getItem('userToken')
const userData = JSON.parse(localStorage.getItem('userData') || 'null')
const persistedState = token && userData 
  ? { ...initialState, isAuthenticated: true, user: userData } 
  : initialState

const store = createStore(changeState, persistedState)

export default store
