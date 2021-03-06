const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

function convertToStarsArray(stars) {
    let num = stars.toString().substring(0, 1);
    let array = [];
    for (let i = 1; i <= 5; i++) {
        if (i <= num) {
            array.push(1);
        }
        else {
            array.push(0);
        }
    }
    return array;
}

function http (title,callBack) {
    wx.request({
        url: 'https://api.douban.com' + title,
        header: {
            "content-type": "application/xml"
        },
        success: function (res) {
            callBack(res.data);
        }

    })
}

function convertToCastString(casts) {
    let castsjoin = "";
    for(let idx in casts) {
        castsjoin = castsjoin + casts[idx].name + " / ";
    }
    //去除最后一个斜杠
    return castsjoin.substring(0,castsjoin.length-2);
}

function convertToCastInfos(casts) {
    let castsArray = [];
    for(let idx in casts) {
        let cast = {
            img: casts[idx].avatars? casts[idx].avatars.large:"",
            name:casts[idx].name 
        }
        castsArray.push(cast);
    }
    return castsArray;
}

module.exports = {
    formatTime: formatTime,
    convertToStarsArray: convertToStarsArray,
    convertToCastInfos: convertToCastInfos,
    convertToCastString: convertToCastString,
    http:http
}
