/*
    1、这里存放需要进行全局进行监听和渲染的数据；
    2、这里只存放数据类型，不包括其他内容
*/
const state = {
    searchBox: false,
    user: {
        auth: 1
    },
    focusArr: [],
    likeArr: [],
    lastestVisited: [],
    lastestWatch: [],
    chatList: [], // 聊天列表
}
  
export default state