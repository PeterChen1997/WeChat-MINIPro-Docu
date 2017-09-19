const postsData = require('../../../data/post-data.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        postData: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let postId = options.id;
        
        let postData = postsData.postList[postId];

        let postsCollected = wx.getStorageSync(postsCollected);
        if(postsCollected){
            let collected = postsCollected[postId];
            this.setData({
                collected:true
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



        wx.setStorageSync("", "");
    },


    onCollectionTap:function(event) {
        let postsCollected = wx.getStorageSync("postsCollected");
        let postCollected = postsCollected[this.data.postId];
        postCollected = !postCollected;
        postsCollected[this.data.postId] = postCollected;
        wx.setStorageSync("postsCollected", postsCollected);

        this.setData({
            collected:!this.data.collected
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
    }


})