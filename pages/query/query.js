// pages/query/query.js

let lastfocus = {};
let bomlastfocus;
let usernums = [[]];
let boomnums = [];

// 数组传入
function lotmatch(buys, booms, rednum){
  // 先红球
  let orboom = [];
  let redboom = 0;
  for(let i=0; i<rednum; i++){
    for(let j=0; j<rednum; j++){
      if(booms[i] == buys[j]){
        orboom.push({boom: true, ord:i, num: booms[i]});
        redboom++;
        break;
      }
      if(j == rednum-1){
        orboom.push({boom: false, ord:i, num: booms[i]});
      }
    }
  }
  let blueboom = 0;
  for(let i=rednum; i<7; i++){
    for(let j=rednum; j<7; j++){
      if(booms[i] == buys[j]){
        orboom.push({boom: true, ord:i, num: booms[i]});
        blueboom++;
        break;
      }
      if(j == 6){
        orboom.push({boom: false, ord:i, num: booms[i]});
      }
    }
  }
  return {redboom,blueboom,orboom};
}

function constdata(id, rednum){
  let nums = [];
  for(let i=0; i<7; i++){
    nums.push({id: id+"_n"+i, ord: i, value: "", focus: false});
  }
  return {id,rednum,nums};
}

function constBomData(rednum){
  let nums = [];
  for(let i=0; i<7; i++){
    nums.push({id: "n"+i, ord: i, value: "", focus: false, rednum: rednum});
  }
  return nums;
}

// {
//   id: "a0",
//   rednum: 5,
//   nums: [
//     {
//       id: "a0n0",
//       ord: "0",
//       value: "",
//       focus: false
//     }
//   ]
// }

function initnums(cont, rednum){
  let allinpus = [constdata("a0", rednum)];
  console.log(allinpus);
  let usernums = [[]];
  for(let i=0,line=0,ord=0,len=cont.length; i<len;){
    let value = cont.substring(i, i+2);
    if(ord < 7){
      allinpus[line].nums[ord].value = value;
      usernums[line][ord] = value;
      ord++;
    }else{
      line++;
      allinpus.push(constdata("a"+line, rednum));
      usernums.push([]);
      ord = 0;
      allinpus[line].nums[ord].value = value;
      usernums[line][ord] = value;
      ord++;
    }
    i = i + 2;
  }
  // console.log(allinpus);
  // console.log(usernums);
  return {allinpus, usernums};
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    rednum: 5,
    allinpus: [
      constdata("a0", 5)
    ],
    booms: constBomData(5)
  },

  radioChange(e){
    let rednum;
    if(e.detail.value == "lotto"){
      rednum = 5;
    }else if(e.detail.value == "twocol"){
      rednum = 6;
      // let allinpus = this.data.allinpus;
      // for(let i=0,len=allinpus.length; i<len; i++){
      //   allinpus[i].rednum = 6;
      // }
      // this.setData({rednum:6, allinpus});
    }
    let allinpus = this.data.allinpus;
    let booms = this.data.booms;
    for(let i=0,len=allinpus.length; i<len; i++){
      allinpus[i].rednum = rednum;
    }
    for(let i=0,len=booms.length; i<len; i++){
      booms[i].rednum = rednum;
    }
    this.setData({rednum:rednum, allinpus, booms});
  },

  listeninput(e){
    // console.log(e);
    let value = e.detail.value;
    let id = e.currentTarget.id;
    let line = id.substring(id.indexOf("a")+1, id.indexOf("_"))*1;
    let ord = id.substring(id.indexOf("n")+1)*1;
    let allinpus = this.data.allinpus;
    allinpus[line].nums[ord].value = value;
    usernums[line][ord] = value;
    // console.log(ord);
    // console.log(lastfocus);
    // console.log(lastfocus.keys);
    if(value.length >= 2){
      if(ord < 6){
        let temp = {};
        if(lastfocus.line != undefined){
          allinpus[lastfocus.line].nums[lastfocus.ord].focus = false;
        }
        allinpus[line].nums[ord+1].focus = true;
        //focus true的元素
        lastfocus = {line, ord:ord+1};
        this.setData({allinpus});
      }else if(line < allinpus.length-1){
        if(lastfocus.line != undefined){
          allinpus[lastfocus.line].nums[lastfocus.ord].focus = false;
        }
        allinpus[line+1].nums[0].focus = true;
        lastfocus = {line:line+1, ord:0};
        this.setData({allinpus});
      }else{
        console.log("no other input...");
      }
    }
    // this.setData({allnums:[]});
    // console.log(usernums);
    // console.log(allinpus);
  },

  listenbominput(e){
    let value = e.detail.value;
    let id = e.currentTarget.id;
    let booms = this.data.booms;
    if(value.length >= 2){
      let ord = id.substring(id.indexOf("n")+1)*1;
      booms[ord].value = value;
      boomnums[ord] = value;
      if(ord < 6){
        // console.log(bomlastfocus);
        if(bomlastfocus != undefined){
          // console.log(booms[bomlastfocus].focus);
          booms[bomlastfocus].focus = false;
          // console.log(booms[bomlastfocus].focus);
        }
        booms[ord+1].focus = true;
        bomlastfocus = ord+1;
        this.setData({booms});
      }else{
        console.log("no other input...");
      }
    }
    // this.setData({allnums:[]});
    // console.log(booms);
  },

  addlinefuc(){
    usernums.push([]);
    let allinpus = this.data.allinpus;
    allinpus.push(constdata("a"+allinpus.length, this.data.rednum));
    this.setData({allinpus,allnums:[]});
  },
  
  dellinefuc(){
    wx.removeStorageSync("pastetextcont");
    usernums.pop();
    let allinpus = this.data.allinpus;
    allinpus.pop();
    this.setData({allinpus,allnums:[]});
  },

  clearlinefuc(){
    wx.removeStorageSync("pastetextcont");
    lastfocus = {};
    bomlastfocus = undefined;
    usernums = [[]];
    boomnums = [];
    let allinpus = [constdata("a0", this.data.rednum)];
    let booms = constBomData(this.data.rednum);
    this.setData({allinpus, booms, allnums:[]});
  },

  queryboom(){
    if(usernums[0].length < 7){
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
    let allnums = [];
    for(let i=0,len=usernums.length; i<len; i++){
      if(usernums[i].length == 7){
        let temp = lotmatch(usernums[i], boomnums, this.data.rednum);
        temp.id = "resultnum"+i;
        allnums.push(temp);
      }
    }
    // console.log(allnums);
    this.setData({allnums});
  },

  pastetext(){
    this.setData({allnums:[]});
    wx.navigateTo({url: '../pastetext/pastetext'});
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
    let pastetextcont = wx.getStorageSync("pastetextcont");
    // wx.removeStorageSync("pastetextcont");
    if(pastetextcont){
      let result = initnums(pastetextcont, this.data.rednum);
      usernums = result.usernums;
      this.setData({allinpus:result.allinpus});
    }
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
    return {
      title: '彩票中奖查询',
      path: '/pages/query/query'
    }
  }
})