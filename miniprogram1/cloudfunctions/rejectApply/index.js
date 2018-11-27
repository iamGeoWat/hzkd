// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection('touristApply').doc(event.id).update({
      data: {
        hasHandled: true,
        hasPassed: false,
        handleAdminName: 'Yu', //todo:use real admin name
        handleAdminComment: '不通过'
      },
      success: res => {
        return {
          msg: 1
        }
      },
      fail: res => {
        return {
          msg: 0
        }
      }
    })
  } catch (e) {
    console.error(e)
    return {
      msg: 0
    }
  }
}