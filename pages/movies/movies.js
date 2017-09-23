const util = require('../../utils/util.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inTheaters:{},
    comingSoon:{},
    top250:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      let inTheatersUrl = "/v2/movie/in_theaters?start=0&count=3";
      let comingSoon = "/v2/movie/coming_soon?start=0&count=3";
      let top250Url = "/v2/movie/top250?start=0&count=3";
    
    this.getMovieListData(inTheatersUrl,"inTheaters","正在热映");
    this.getMovieListData(comingSoon,"comingSoon","即将上映");
    this.getMovieListData(top250Url,"top250","豆瓣Top250");
  },

  onMoreTap:function(event){
wx.navigateTo({
    url: 'more-movie/more-movie?category=' + event.currentTarget.dataset.category,
})
  },

  getMovieListData: function (title, settedKey, categoryTitle){
      let that = this;
      wx.request({
          url: 'https://api.douban.com' + title,
          header: {
              "content-type": "application/xml"
          },
          success: function (res) {
              that.processDoubanData(res.data, settedKey, categoryTitle);
          }

      })
  },

  processDoubanData:function(moviesData,settedKey,categoryTitle){
    let movies = [];
    for(let idx in moviesData.subjects){
        let subject = moviesData.subjects[idx];
        let title = subject.title;
        if(title.length >6){
            title = title.substring(0,6) + '...';
        }

        let temp = {
            stars:util.converToStarsArray(subject.rating.stars),
            title: title,
            average: subject.rating.average,
            coverageUrl:subject.images.large,
            movieId:subject.id,

        };
        movies.push(temp); 

    }

//利用动态特性
    let moviesArr = {};
    moviesArr[settedKey] = {
        categoryTitle: categoryTitle,
        movies:movies
    }

    this.setData(moviesArr);
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