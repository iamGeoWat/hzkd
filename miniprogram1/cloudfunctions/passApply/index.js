// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    await db.collection('touristApply').doc(event.id).update({
      data: {
        hasHandled: true,
        hasPassed: true,
        handleAdminName: 'Yu', //todo:use real admin name
        handleAdminComment: '通过'
      }
    })
    await db.collection('user').add({
      data: {
        api: '',
        hasSubmitAPI: false,
        name: event.name,
        openid: event.openid,
        operator_request: false,
        operatorid: event.operatorid,
        type: 'normal'
      }
    })
  } catch (e) {
    console.error(e)
    return {
      msg: 0
    }
  }
}