var url = require('url');
var queryString = require('querystring');
var crypto = require('crypto');
var request = require('request');
var xml2jsparseString = require('xml2js').parseString;
// 引入项目的配置信息
var config = require('../../config/default.json').wx;

function WechatPay(userInfo) {
  this.sort = function(obj){
    let keys = Object.keys(obj);
    keys = keys.sort();
    let newObj = {};
    let str2 = '';
    keys.forEach((key){
        newObj[key] = obj[key];
    });
    return newObj;
  }
  /**
   * 获取微信统一下单的接口数据
   */
  this.getPackage = function(obj){
    let that = this;
    let newObj = that.sort(obj);
    let str = '';
    for(let k in newObj) {
      str += '&' + k + '=' + newObj[k];
      str2 += '&'+ k + '='+ newObj[k].encodeURIComponent()
    }
    str = str+'#'+config.partner
    let signValue = crypto.createHash('md5').update(str).digest("hex").toUpperCase();
    return str2+'&sign=' signValue;
  }

  /**
     * 获取微信支付的签名
     * @param payParams
     */
  this.getSign = function(signParams){
    let signParams = sort(signParams);
    let str = '';
    for(let k in signParams) {
      str += '&' + k.toLowerCase() + '=' + signParams[k];
    }

    return crypto.createHash('sha1').update(str).digest('hex');
  }

  /**
     * 微信支付的所有参数
     * @param req 请求的资源, 获取必要的数据
     * @returns {{appId: string, timeStamp: Number, nonceStr: *, package: string, signType: string, paySign: *}}
     */
  this.getBrandWCPayParams = function( obj, callback ){
    console.log('getBrandWCPayParams');
    var that = this;
    // 生成统一下单接口参数
    var UnifiedorderParams = {
      bank_type: 'WX',
      body : obj.body,
      attach : obj.attach,
      partner : config.partner,
      out_trade_no : obj.out_trade_no, //订单号
      total_fee : obj.total_fee,
      fee_type: 1, //支付币种
      notify_url : obj.notify_url,// 微信付款后的回调地址
      spbill_create_ip : obj.spbill_create_ip,
      input_charset: 'UTF-8'
    };
    var prepay_id = that.getPackage(obj);

    var wcPayParams = {
      "appId" : config.app_id,     //公众号名称，由商户传入
      "timeStamp" : parseInt(new Date().getTime() / 1000).toString(),         //时间戳，自1970年以来的秒数
      "nonceStr" : that.createNonceStr(), //随机串
      // 通过统一下单接口获取
      "package" : prepay_id,
      "appkey" : config.wxpaykey,
    };
    wcPayParams.paySign = that.getSign(wcPayParams); //微信支付签名
    wcPayParams.Type = 'SHA';
    callback(null, wcPayParams);
  }
}

module.exports = WechatPay;