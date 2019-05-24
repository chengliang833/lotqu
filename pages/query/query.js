// pages/query/query.js

//输入位置上一列焦点
let lastfocus = {};
//输入位置上一行焦点
let lastLineFocus;
//开奖号码位置上一列焦点
let bomlastfocus;
//用户输入号码组
let usernums = [[]];
//开奖号码组
let boomnums = [];
//光标闪烁定时器id
let animIntervalId;
//输入栏上次光标位置
let lastCursor;
//全局动画
let animation = wx.createAnimation({duration:500, timingFunction:"step-start"});
//自动换行后,禁止触发blur
let allowblur = true;

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
  return {id,rednum,nums,focus:false, value:""};
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
//   value: 1112131415,
//   focus: false,
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
  // console.log(allinpus);
  let usernums = [[]];
  for(let i=0,line=0,ord=0,len=cont.length; i<len;){
    let value = cont.substring(i, i+2);
    if(ord < 7){
      allinpus[line].nums[ord].value = value;
      allinpus[line].value = allinpus[line].value + value;
      usernums[line][ord] = value;
      ord++;
    }else{
      line++;
      allinpus.push(constdata("a"+line, rednum));
      usernums.push([]);
      ord = 0;
      allinpus[line].nums[ord].value = value;
      allinpus[line].value = allinpus[line].value + value;
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
    periodsvalue: "",
    boominpvalue: "",
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
  
  showKeyBoard(e){
    let id = e.currentTarget.id; //a0
    let line = id.substring(id.indexOf("a")+1)*1;
    let allinpus = this.data.allinpus;
    
    if(lastLineFocus != undefined){
      allinpus[lastLineFocus].focus = false;
    }
    allinpus[line].focus = true;
    lastLineFocus = line;
    
    if(allinpus[line].value.length > 0){
      lastfocus = {line:line, ord:Math.ceil(allinpus[line].value.length/2.0)-1};
    }else{
      lastfocus = {line:line, ord:0};
    }

    this.setData({allinpus});
    console.log(e);
  },

  showBoomKeyBoard(e){
    let boominpfocus = true;
    if(this.data.boominpvalue.length > 0){
      bomlastfocus = Math.ceil(this.data.boominpvalue.length/2.0)-1;
    }else{
      bomlastfocus = 0;
    }
    this.setData({boominpfocus});
  },

  listenblur(e){
    // console.log("heiheihei");
    if(allowblur && lastfocus.line != undefined){
      // console.log("allow?");
      let allinpus = this.data.allinpus;
      allinpus[lastfocus.line].focus = false;
      allinpus[lastfocus.line].nums[lastfocus.ord].focus = false;
      animation.opacity(0).step();
      allinpus[lastfocus.line].nums[lastfocus.ord].anim = animation.export();
      lastfocus = {};
      this.setData({allinpus});
    }
  },

  boominpblur(e){
    if(bomlastfocus != undefined){
      let boominpfocus = false;
      let booms = this.data.booms;
      booms[bomlastfocus].focus = false;
      animation.opacity(0).step();
      booms[bomlastfocus].anim = animation.export();
      bomlastfocus = undefined;
      this.setData({boominpfocus, booms});
    }
  },

  listeninput(e){
    console.log(e);
    let allvalue = e.detail.value;  //111213141516
    // console.log(allvalue);
    let id = e.currentTarget.id; //a0
    let line = id.substring(id.indexOf("a")+1)*1;
    // let ord = id.substring(id.indexOf("n")+1)*1;
    let value;
    let ord;
    if(allvalue.length == 0){
      ord = 0;
      value = "";
    }else if(allvalue.length%2 == 0){
      ord = Math.ceil(allvalue.length/2.0)-1;
      value = allvalue.substring(allvalue.length - 2);
    }else{
      ord = Math.ceil(allvalue.length/2.0)-1;
      value = allvalue.substring(allvalue.length - 1);
    }
    let allinpus = this.data.allinpus;
    // console.log(allinpus[line].nums[ord+1]);
    // console.log(allinpus[line+1]);
    if(allinpus[line].nums[ord+1]){
      allinpus[line].nums[ord+1].value = "";
      usernums[line][ord+1] = "";
    }
    // else if(allinpus[line+1]){
    //   allinpus[line+1].nums[0].value = "";
    //   usernums[line+1][0] = "";
    // }
    allinpus[line].nums[ord].value = value;
    allinpus[line].value = allvalue;
    usernums[line][ord] = value;
    // console.log(ord);
    // console.log(lastfocus);
    // console.log(lastfocus.keys);
    if(value.length == 2){
      lastCursor = e.detail.cursor;
      if(ord < 6){
        if(lastfocus.line != undefined){
          allinpus[lastfocus.line].nums[lastfocus.ord].focus = false;
        }
        allinpus[line].nums[ord+1].focus = true;
        //focus true的元素
        lastfocus = {line, ord:ord+1};
      lastCursor = e.detail.cursor;
      }else if(line < allinpus.length-1){
        allowblur = false;
        console.log("change line...");
        //换行专用, ==2才检查
        if(lastLineFocus != undefined){
          allinpus[lastLineFocus].focus = false;
        }
        if(lastfocus.line != undefined){
          allinpus[lastfocus.line].nums[lastfocus.ord].focus = false;
        }
        allinpus[line+1].focus = true;
        console.log(allinpus[line+1].focus);
        lastLineFocus = line + 1;

        // console.log(line+1);
        // console.log(allinpus[line+1].focus);
        // console.log(allinpus[line+1]);
        // allinpus[line+1]["focus2"] = true;
        // console.log("2...");
        // console.log(allinpus[line+1]);
        // console.log(allinpus);
        // console.log(allinpus[line+1].focus);
        // console.log(allinpus);
        
        if(allinpus[line+1].value.length > 0){
          lastfocus = {line:line+1, ord:Math.ceil(allinpus[line+1].value.length/2.0)-1};
          allinpus[line+1].nums[lastfocus.ord].focus = true;
        }else{
          lastfocus = {line:line+1, ord:0};
          allinpus[line+1].nums[0].focus = true;
        }
        lastCursor = 0;
        setTimeout(function(){
          allowblur = true;
        }, 500);
      }else{
        console.log("no other input...");
      }
    }else if(value.length == 1){
      // console.log(lastCursor);
      // console.log(e.detail.cursor);
      if(lastCursor != undefined && lastCursor > e.detail.cursor){
        console.log("hei...");
        if(lastfocus.line != undefined){
          allinpus[lastfocus.line].nums[lastfocus.ord].focus = false;
        }
        allinpus[line].nums[ord].focus = true;
        lastfocus = {line, ord};
      }
      console.log("hi...");
      lastCursor = e.detail.cursor;
    }
    this.setData({allinpus});
    // this.setData({allnums:[]});
    // console.log(usernums);
    // console.log(allinpus);
  },

  listenbominput(e){
    let allvalue = e.detail.value;
    // let id = e.currentTarget.id;
    let ord;
    let value;

    if(allvalue.length == 0){
      ord = 0;
      value = "";
    }else if(allvalue.length%2 == 0){
      ord = Math.ceil(allvalue.length/2.0)-1;
      value = allvalue.substring(allvalue.length - 2);
    }else{
      ord = Math.ceil(allvalue.length/2.0)-1;
      value = allvalue.substring(allvalue.length - 1);
    }
    
    let booms = this.data.booms;

    if(booms[ord+1]){
      booms[ord+1].value = "";
      boomnums[ord+1] = "";
    }
    let boominpvalue = allvalue;

    booms[ord].value = value;
    boomnums[ord] = value;
    if(value.length >= 2){
      // let ord = id.substring(id.indexOf("n")+1)*1;
      if(ord < 6){
        // console.log(bomlastfocus);
        if(bomlastfocus != undefined){
          // console.log(booms[bomlastfocus].focus);
          booms[bomlastfocus].focus = false;
          // console.log(booms[bomlastfocus].focus);
        }
        booms[ord+1].focus = true;
        bomlastfocus = ord+1;
      }else{
        console.log("no other input...");
      }
    }else if(value.length == 1){
      if(bomlastfocus != undefined){
        booms[bomlastfocus].focus = false;
      }
      booms[ord].focus = true;
      bomlastfocus = ord;
    }
    this.setData({booms, boominpvalue});
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
    this.setData({allinpus, booms, allnums:[], boominpvalue:""});
  },

  inpbomper(e){
    this.setData({periodsvalue: e.detail.value});
  },

  querysingbooms(){
    // console.log(this.data.periodsvalue);
    if(this.data.periodsvalue.length != 5){
      wx.$alert("期数有误");
      return;
    }
    let that = this;
    let requestUrl;
    if(this.data.rednum == 5){
      requestUrl = 'https://m.500.com/info/kaijiang/dlt/'+this.data.periodsvalue+'.shtml';
    }else{
      requestUrl = 'https://m.500.com/info/kaijiang/ssq/'+this.data.periodsvalue+'.shtml';
    }
    wx.request({
      url: requestUrl,
      // data: {   //param
      //   x: '',
      //   y: ''
      // },
      method: "GET",
      header: {
        'content-type': 'text/html' // 默认值
      },
      success(res) {
        // console.log(res);
        // console.log(res.data.replace(/\r|\n/g, "").substring(res.data.indexOf("直播回放")));
        let data = res.data.replace(/\r|\n/g, "");
        if(data.match(/.*直播回放(.*(\d{2})<\/li>).*/)){
          // console.log(data.replace(/.*直播回放.*(\d{2})<\/li>.*(\d{2})<\/li>.*(\d{2})<\/li>.*(\d{2})<\/li>.*(\d{2})<\/li>.*(\d{2})<\/li>.*(\d{2})<\/li>.*/,"$1$2$3$4$5$6$7"));
          let boominpvalue = data.replace(/.*直播回放.*(\d{2})<\/li>.*(\d{2})<\/li>.*(\d{2})<\/li>.*(\d{2})<\/li>.*(\d{2})<\/li>.*(\d{2})<\/li>.*(\d{2})<\/li>.*/,"$1$2$3$4$5$6$7");
          let booms = constBomData(5);
          boomnums = [];
          for(let i=0; i<7; i++){
            booms[i].value = boominpvalue.substring(2*i, 2*i+2);
            boomnums[i] = boominpvalue.substring(2*i, 2*i+2);
          }
          that.setData({booms, boominpvalue});
        }else{
          wx.$alert("期数有误");
        }
      },
      fail(res) {
        console.log(res);
      }
    })
  },

  goto500(){
    if(this.data.rednum == 5){
      console.log(555);
      wx.setStorageSync("boomurl", "https://m.500.com/info/kaijiang/dlt");
    }else{
      console.log(666);
      wx.setStorageSync("boomurl", "https://m.500.com/info/kaijiang/ssq");
    }
    wx.navigateTo({url: '../webview/webview'});
  },

  queryboom(){
    // console.log(usernums);
    // console.log(boomnums);
    if(this.data.allinpus[0].value.length < 14){
      // wx.showToast({
      //   title: '输入的号码有误',
      //   icon: 'none',
      //   duration: 1500
      // })
      wx.$alert("输入的号码有误");
      return;
    }
    if(this.data.boominpvalue.length < 14){
      // wx.showToast({
      //   title: '开奖号码有误',
      //   icon: 'none',
      //   duration: 1500
      // })
      wx.$alert("开奖号码有误");
      return;
    }
    let allnums = [];
    for(let i=0,len=usernums.length; i<len; i++){
      if(usernums[i].length == 7){
        let temp = lotmatch(usernums[i], boomnums, this.data.rednum);
        temp.id = "resultnum"+i;
        temp.rednum = this.data.rednum;
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
    
    let lastop = 0;
    let intervalLastShow = {};
    let bomstop = 0;
    let bomIntervalShow;
    animIntervalId = setInterval(function () {
      // console.log(111);
      // console.log(lastfocus);
      // console.log(intervalLastShow);
      let allinpus = this.data.allinpus;
      if(lastfocus.line != undefined){
        if(intervalLastShow.line != undefined && (intervalLastShow.line != lastfocus.line || intervalLastShow.ord != lastfocus.ord)){
          animation.opacity(0).step();
          lastop = 0;
          allinpus[intervalLastShow.line].nums[intervalLastShow.ord].anim = animation.export();
        }
        intervalLastShow.line = lastfocus.line;
        intervalLastShow.ord = lastfocus.ord;
        if(lastop == 0){
          animation.opacity(1).step();
          lastop = 1;
        }else if(lastop == 1){
          animation.opacity(0).step();
          lastop = 0;
        }
        allinpus[lastfocus.line].nums[lastfocus.ord].anim = animation.export();
        // allinpus[lastfocus.line].nums[lastfocus.ord]["a"+lastfocus.line+"_n"+lastfocus.ord] = animation.export();
        // temp["a"+lastfocus.line+"_n"+lastfocus.ord] = animation.export();
        // temp.anim = animation.export();
        // console.log(allinpus);
      }
      
      let booms = this.data.booms;
      if(bomlastfocus != undefined){
        // console.log("...");
        if(bomIntervalShow != undefined && bomIntervalShow != bomlastfocus){
          animation.opacity(0).step();
          bomstop = 0;
          booms[bomIntervalShow].anim = animation.export();
        }
        bomIntervalShow = bomlastfocus;
        if(bomstop == 0){
          // console.log("000");
          animation.opacity(1).step();
          bomstop = 1;
        }else if(bomstop == 1){
          // console.log(111);
          animation.opacity(0).step();
          bomstop = 0;
        }
        booms[bomlastfocus].anim = animation.export();
      }
      
      this.setData({allinpus,booms});
    }.bind(this), 500);
  },
  
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(animIntervalId);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(animIntervalId);
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