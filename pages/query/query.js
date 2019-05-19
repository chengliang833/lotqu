// pages/query/query.js

// const query = wx.createSelectorQuery();
// const allfal = [false, false, false, false, false, false, false];
let lastfocus = "";
let itemnums = [];
let boomnums = [];

// 数组传入
function lottoMatch(buys, booms){
  // 先红球
  let orboom = [];
  let rednum = 0;
  for(let i=0; i<5; i++){
    for(let j=0; j<5; j++){
      if(booms[i] == buys[j]){
        orboom.push({boom: true, ord:i, num: booms[i]});
        rednum++;
        break;
      }
      if(j == 4){
        orboom.push({boom: false, ord:i, num: booms[i]});
      }
    }
  }
  let bluenum = 0;
  for(let i=5; i<7; i++){
    for(let j=5; j<7; j++){
      if(booms[i] == buys[j]){
        orboom.push({boom: true, ord:i, num: booms[i]});
        bluenum++;
        break;
      }
      if(j == 6){
        orboom.push({boom: false, ord:i, num: booms[i]});
      }
    }
  }
  return {rednum,bluenum,orboom};
}

function tcMatch(buys, booms){

}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // inpfs: allfal
    inpf1: false,
    inpf2: false,
    inpf3: false,
    inpf4: false,
    inpf5: false,
    inpf6: false,
    inpf7: false,
    // allnums: [{id:"first", arr:itemnums}]
  },

  listeninput(e){
    // console.log(e);
    let value = e.detail.value;
    let id = e.currentTarget.id;
    if(value.length >= 2){
      let ord = id.substring(id.length - 1)*1+1;
      itemnums[ord-1] = value;
      let ordid = "inpf" + ord;
      // console.log(ord);
      if(ord < 7){
        let temp = {};
        if(lastfocus){
          // console.log(lastfocus);
          temp[ordid] = false;
        }
        lastfocus = ordid;
        temp[ordid] = true;
        this.setData(temp);
        // this.data.inpfs = allfal;
        // this.data.inpfs[id.substring(id.length - 1)*1] = true;
        // console.log(this.data.inpfs);
        // console.log(allfal);
        // this.setData({inpfs:allfal});
      }else{
        console.log("no other input...");
      }
    }
    // console.log(itemnums);
  },
  listenbominput(e){
    let value = e.detail.value;
    let id = e.currentTarget.id;
    if(value.length >= 2){
      let ord = id.substring(id.length - 1)*1+1;
      boomnums[ord-1] = value;
      let ordid = "inpbomf" + ord;
      if(ord < 7){
        let temp = {};
        if(lastfocus){
          temp[ordid] = false;
        }
        lastfocus = ordid;
        temp[ordid] = true;
        this.setData(temp);
      }else{
        console.log("no other input...");
      }
    }
    // console.log(boomnums);
  },



  // boominput(e){
  //   boomnums = e.detail.value;
  // },

  queryboom(){
    if(itemnums.length < 7){
      wx.showToast({
        title: '输入的号码有误',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    if(boomnums.length < 7){
      wx.showToast({
        title: '开奖号码有误',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    // console.log(boomnum);
    // let arr = [];
    // for(let i=0; i<7; i++){
    //   arr.push(boomnum.substring(2*i, 2*i+2));
    // }
    // arr = [11,12,13,14,15,8,9];
    // itemnums = [11,12,13,15,17,7,8];
    // console.log(arr);
    let result = lottoMatch(itemnums, boomnums);
    console.log(result);
    this.setData({allnums: [{id:"first", nums:result.orboom}]});
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})