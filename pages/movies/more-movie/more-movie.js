// pages/movies/more-movie/more-movie.js
const util = require('../../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        movies: {},
        navigateTitle: "",
        requestUrl: "",
        totalCount: 0,
        isEmpty: true
    },

    onMovieTap: function (event) {
        wx.navigateTo({
            url: 'movie-detail/movie-detail?movieId=' + event.currentTarget.dataset.movieid
        });
    },
    onScrollLower: function (event) {
        let nextUrl = this.data.requestUrl + "?start=" + this.data.totalCount + "&count=20";
        util.http(nextUrl, this.processDoubanData);
        wx.showNavigationBarLoading();
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    scrollHeight: res.windowHeight
                });
            }
        });




        let category = options.category;
        this.setData({
            navigateTitle: category
        });
        console.log(category);
        let dataUrl = "";

        switch (category) {
            case "正在热映":
                dataUrl = "/v2/movie/in_theaters";
                break;
            case "即将上映":
                dataUrl = "/v2/movie/coming_soon";
                break;
            case "豆瓣Top250":
                dataUrl = "/v2/movie/top250";
                break;
        }
        util.http(dataUrl, this.processDoubanData);
        this.data.requestUrl = dataUrl;
    },

    processDoubanData: function (moviesData) {

        let movies = [];
        for (let idx in moviesData.subjects) {
            let subject = moviesData.subjects[idx];
            let title = subject.title;
            if (title.length > 6) {
                title = title.substring(0, 6) + '...';
            }

            let temp = {
                stars: util.convertToStarsArray(subject.rating.stars),
                title: title,
                average: subject.rating.average,
                coverageUrl: subject.images.large,
                movieId: subject.id,

            };
            movies.push(temp);

        }
        let totalMovies = {};

//加载新数据后和旧数据合并
        if (!this.data.isEmpty) {
            totalMovies = this.data.movies.concat(movies);
        } else {
            totalMovies = movies;
            this.data.isEmpty = false;
        }
        this.setData({
            movies: totalMovies
        });
        this.data.totalCount += 20;

        wx.hideNavigationBarLoading();

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        //在页面渲染完成后，才能设置
        wx.setNavigationBarTitle({
            title: this.data.navigateTitle,
            success: function (res) {

            }
        });
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