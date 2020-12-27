/*
    1、这里只存放对 state 中定义的数据进行监听的方法
    2、格式为 方法名(state, val){ 方法体 }
*/
let arr = [
    '_user_',
    '_user_focus_',
    '_user_visit_',
    '_user_watch_',
    '_user_like_',
    '_user_chat_'
]
const mutations = {
    SETSEARCH(state, search){
        state.searchBox = search
    },
    // 用户信息设置
    SETUSER(state, user){
        state.user = {...state.user, ...user}
        localStorage.setItem('_user_', JSON.stringify(state.user))
    },
    DELUSER(state){
        for(let key in state.user){
            state.user[key] = ''
        }
        Object.keys(localStorage).forEach(item => {
            if(arr.includes(item)){
                localStorage.removeItem(item)
            }
        })
    },

    // 关注列表
    ADDFOCUS(state, focusID){
        state.focusArr.push(focusID)
        localStorage.setItem('_user_focus_', JSON.stringify(state.focusArr))
    },
    DELFOCUS(state, focusID){
        let index 
        for(let i = 0; i < state.focusArr.length; i++){
            if(state.focusArr[i] === focusID){
                index = i
                break
            }
        }
        state.focusArr.splice(index, 1)
        localStorage.setItem('_user_focus_', JSON.stringify(state.focusArr))
    },
    INITFOCUS(state, focusList){
        for(let i = 0; i < focusList.length; i++){
            state.focusArr.push(focusList[i].cuid)
        }
        localStorage.setItem('_user_focus_', JSON.stringify(state.focusArr))
    },
    SETFOCUS(state, focus){
        state.focusArr = focus
        localStorage.setItem('_user_focus_', JSON.stringify(state.focusArr))
    },

    // 最近访问
    ADDNEWVISITED(state, user){
        let flag = false // 表示是否已经存在
        for(let i = 0; i < state.lastestVisited.length; i++){
            if(state.lastestVisited[i]._id === (user._id)){
                state.lastestVisited[i] = user
                flag = true
                break
            }
        }
        if(!flag){
            if(state.lastestVisited.length < 5){
                state.lastestVisited.push(user)
            } else {
                state.lastestVisited.shift()
                state.lastestVisited.push(user)
            }
        }
        localStorage.setItem('_user_visit_', JSON.stringify(state.lastestVisited))
    },
    SETVISIT(state, list){
        state.lastestVisited = list
        localStorage.setItem('_user_visit_', JSON.stringify(state.lastestVisited))
    },

    // 最近查看
    ADDNEWWATCH(state, text){
        let flag = false // 表示是否已经存在
        for(let i = 0; i < state.lastestWatch.length; i++){
            if(state.lastestWatch[i]._id === (text._id)){
                state.lastestWatch[i] = text
                flag = true
                break
            }
        }
        if(!flag){
            if(state.lastestWatch.length < 5){
                state.lastestWatch.push(text)
            } else {
                state.lastestWatch.shift()
                state.lastestWatch.push(text)
            }
        }
        localStorage.setItem('_user_watch_', JSON.stringify(state.lastestWatch))
    },
    SETWATCH(state, list){
        state.lastestWatch = list
        localStorage.setItem('_user_watch_', JSON.stringify(state.lastestWatch))
    },
    DELWATCH(state, tid){
        for(let i = 0; i < state.lastestWatch.length; i++){
            if(state.lastestWatch[i]._id === (tid)){
                state.lastestWatch.splice(i, 1)
                break
            }
        }
        localStorage.setItem('_user_watch_', JSON.stringify(state.lastestWatch))
    },

    // 点赞列表
    SETLIKE(state, list){
        state.likeArr = list
        localStorage.setItem('_user_like_', JSON.stringify(state.likeArr))
    },
    ADDLIKE(state, tid){
        state.likeArr.push(tid)
        localStorage.setItem('_user_like_', JSON.stringify(state.likeArr))
    },

    // 聊天列表
    INITCHATLIST(state, list){
        state.chatList = list
        localStorage.setItem('_user_chat_', JSON.stringify(state.chatList))
    },
    ADDCHAT(state, obj){
        state.chatList.unshift(obj)
        localStorage.setItem('_user_chat_', JSON.stringify(state.chatList))
    },
    DELCHAT(state, index){
        state.chatList.splice(index, 1)
        localStorage.setItem('_user_chat_', JSON.stringify(state.chatList))
    },
    UPDSENDCHAT(state, obj){
        for(let i = 0; i < state.chatList.length; i++){
            if(state.chatList[i].user._id === obj.ruser._id){
                state.chatList[i].desc = obj.desc
                state.chatList[i].time = obj.time
                let temp = state.chatList[i]
                state.chatList.splice(i, 1)
                state.chatList.unshift(temp)
                break
            }
        }
        localStorage.setItem('_user_chat_', JSON.stringify(state.chatList))
    },
    UPDRECCHAT(state, obj, bool){
        let flag = false
        for(let i = 0; i < state.chatList.length; i++){
            if(state.chatList[i].user._id === obj.user._id){
                flag = true
                state.chatList[i].desc = obj.desc
                state.chatList[i].time = obj.time
                if(!bool){
                    if(state.chatList[i].readNum){
                        state.chatList[i].readNum++
                    } else {
                        state.chatList[i].readNum = 1
                    }
                }
                let temp = state.chatList[i]
                state.chatList.splice(i, 1)
                state.chatList.unshift(temp)
                break
            }
        }
        if(!flag){
            state.chatList.unshift(obj)
        }
        localStorage.setItem('_user_chat_', JSON.stringify(state.chatList))
    },
    NEWCHAT(state, objArr){
        for (let i = 0; i < objArr.length; i++) {
            let flag = false
            for(let j = 0; j < state.chatList.length; j++){
                if(state.chatList[j].user._id === objArr[i].user[0][0]._id){
                    state.chatList[j].time = objArr[i].time[0]
                    state.chatList[j].desc = objArr[i].desc[0]
                    state.chatList[j].readNum = objArr[i].readNum
                    let temp = state.chatList[j]
                    state.chatList.splice(j, 1)
                    state.chatList.unshift(temp)
                    flag = true
                    break
                }
            }
            if(!flag){
                let obj = {
                    time: objArr[i].time[0],
                    desc: objArr[i].desc[0],
                    user: objArr[i].user[0][0],
                    readNum: objArr[i].readNum
                }
                state.chatList.unshift(obj)
            }
        }
    },
    UPDCHATREAD(state, id){
        for(let i=0; i < state.chatList.length; i++){
            if(state.chatList[i].user._id === id){
                state.chatList[i].readNum = 0
                break
            }
        }
        localStorage.setItem('_user_chat_', JSON.stringify(state.chatList))
    }
}

export default mutations