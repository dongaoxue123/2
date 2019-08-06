import { createStore, combineReducers } from 'redux'
// 创建reducer方法,state是当前保存在store中的数据，action是一个容器
const keyReduce = function(state = {key:''}, action) {
    switch (action.type) {
        case 'setKey': {
            return {key:action.data}
        }
        default:
            return state
    }
}
const shopListReduce = function(state = {shopList:{dataShopList: []}}, action) {
    switch (action.type) {
       case 'shopList': {
           return {
               shopList: action.dataList      
           }
       }
       default:
           return state
    }
}
const currentAdminReduce = function(state = {adminId: 0}, action) {
    switch (action.type) {
        case 'set': {
           return {
                adminId: action.adminId      
            }
        }
        default:
           return state
    }
}
const userReduce = function(state = {userInformation:{}}, action) {
    switch (action.type) {
        case 'saveUser' : {
            return {
                userInformation: action.userInformation
            }
        }
        default:
            return state
    }
}
// const nameReduce = function(state = {nameInformation:{}}, action) {
//     switch (action.type) {
//         case 'saveName' : {
//             return {
//                 nameInformation: action.nameInformation
//             }
//         }
//         default:
//             return state
//     }
// }
const allReducers = {
    keyState: keyReduce,
    shopListAll: shopListReduce,
    currentAdminPaper: currentAdminReduce,
    userList : userReduce,
    // nameList : nameReduce
}
// 在一个store中使用combineReducers函数组合多个reducer
const rootReducer = combineReducers(allReducers)
let store = createStore(rootReducer)
export default store