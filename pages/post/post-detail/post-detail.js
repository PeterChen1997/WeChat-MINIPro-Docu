const postsData = require('../../../data/post-data.js');
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        postData: {},
        isPlayingMusic:false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let postId = options.id;
        
        let postData = postsData.postList[postId];

        let postsCollected = wx.getStorageSync("postsCollected");
        if(postsCollected){
            let collected = postsCollected[postId];
            this.setData({
                collected: collected
            });
        }else {
            let postsCollected = {};
            postsCollected[postId] = false;
            wx.setStorageSync("postsCollected", postsCollected)
        }
            


        this.setData({
            postData: postData,
            postId:postId
        });

        console.log(app.globalData.g_currentMusicPostId,postId);
        if (app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId===postId) {
            this.setData({
                isPlayingMusic:true
            });
        }
        this.setMusicMonitor();
 
    },


    setMusicMonitor:function() {
        //由框架api控制播放
        let that = this;
        wx.onBackgroundAudioPlay(function () {
            that.setData({
                isPlayingMusic: true
            });
            app.globalData.g_isPlayingMusic = true;
            app.globalData.g_currentMusicPostId = that.data.postId;
            console.log(app.globalData.g_currentMusicPostId);
        });
        wx.onBackgroundAudioPause(function () {
            that.setData({
                isPlayingMusic: false
            });
            app.globalData.g_isPlayingMusic = false;
            app.globalData.g_currentMusicPostId = null;
        });
    },

    onCollectionTap:function(event) {
        let postsCollected = wx.getStorageSync("postsCollected");
        let postCollected = postsCollected[this.data.postId];
        postCollected = !postCollected;
        postsCollected[this.data.postId] = postCollected;
        wx.setStorageSync("postsCollected", postsCollected);

        this.setData({
            collected: postCollected
        });

        wx.showToast({
            title: this.data.collected?'收藏成功':'取消收藏成功',
        })
    },

    onShareTap:function(event){
        let itemList = [
            "分享给微信好友",
            "分享到QQ"
        ];
        wx.showActionSheet({
            itemList: itemList,
            itemColor:"#405f80",
            success:function(res){
                // res.cancel
                // res.tapIndex
                wx.showModal({
                    title: '用户分享到了' + itemList[res.tapIndex],
                    content: '',
                })
            }
        })
    },

    onMusicTap:function(event){
        let postId = this.data.postId;
        let isPlayingMusic = this.data.isPlayingMusic;
        let postData = postsData.postList[postId];
        if(isPlayingMusic){
            wx.pauseBackgroundAudio();
            this.setData({
                isPlayingMusic:false
            });
        }else {
            wx.playBackgroundAudio({
                dataUrl: postData.music.url,
                title: postData.music.title,
                coverImgUrl: postData.music.coverImg,
            });
            this.setData({
                isPlayingMusic: true
            });
        }
        
        

    }


})