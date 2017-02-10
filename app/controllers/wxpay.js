'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
* @Author: anziguoer
* @Email: anziguoer@sina.com
* @Date:   2016-09-14 11:40:12
* @Last Modified by:   anziguoer
* @Last Modified time: 2016-09-14 11:40:31
* @Descrition : wechat 微信支付功能
*/

var url = require('url');
var queryString = require('querystring');
var crypto = require('crypto');
var request = require('request');
var xml2jsparseString = require('xml2js').parseString;
// 引入项目的配置信息
var config = require('../../config/default.json').wx;

// wechat 支付类 (使用 es6 的语法)

var WechatPay = function () {
    /**
     * 构造函数
     * @param params 传递进来的方法
     */
    function WechatPay(userInfo) {
        _classCallCheck(this, WechatPay);

        this.userInfo = userInfo;
    }

    /**
     * 获取微信统一下单参数
     */


    _createClass(WechatPay, [{
        key: 'getUnifiedorderXmlParams',
        value: function getUnifiedorderXmlParams(obj) {
            var body = '<xml> ' + '<appid>' + config.app_id + '</appid> ' + '<attach>' + obj.attach + '</attach> ' + '<body>' + obj.body + '</body> ' + '<mch_id>' + config.mch_id + '</mch_id> ' + '<nonce_str>' + obj.nonce_str + '</nonce_str> ' + '<notify_url>' + obj.notify_url + '</notify_url>' + '<openid>' + obj.openid + '</openid> ' + '<out_trade_no>' + obj.out_trade_no + '</out_trade_no>' + '<spbill_create_ip>' + obj.spbill_create_ip + '</spbill_create_ip> ' + '<total_fee>' + obj.total_fee + '</total_fee> ' + '<trade_type>' + obj.trade_type + '</trade_type> ' + '<sign>' + obj.sign + '</sign> ' + '</xml>';
            return body;
        }

        /**
         * 获取微信统一下单的接口数据
         */

    }, {
        key: 'getPrepayId',
        value: function getPrepayId(obj) {
            var that = this;
            // 生成统一下单接口参数
            var UnifiedorderParams = {
                appid: config.app_id,
                attach: obj.attach,
                body: obj.body,
                mch_id: config.mch_id,
                nonce_str: that.createNonceStr(),
                notify_url: obj.notify_url, // 微信付款后的回调地址
                openid: that.userInfo.openid,
                out_trade_no: obj.out_trade_no, //new Date().getTime(), //订单号
                spbill_create_ip: obj.spbill_create_ip,
                total_fee: obj.total_fee,
                trade_type: 'JSAPI'
            };
            // 返回 promise 对象
            return new Promise(function (resolve, reject) {
                // 获取 sign 参数
                UnifiedorderParams.sign = that.getSign(UnifiedorderParams);
                var url = 'https://api.mch.weixin.qq.com/pay/unifiedorder';
                request.post({ url: url, body: JSON.stringify(that.getUnifiedorderXmlParams(UnifiedorderParams)) }, function (error, response, body) {
                    var prepay_id = '';
                    if (!error && response.statusCode == 200) {
                        // 微信返回的数据为 xml 格式， 需要装换为 json 数据， 便于使用
                        xml2jsparseString(body, { async: true }, function (error, result) {
                            prepay_id = result.xml.prepay_id[0];
                            // 放回数组的第一个元素
                            resolve(prepay_id);
                        });
                    } else {
                        reject(body);
                    }
                });
            });
        }

        /**
         * 获取微信支付的签名
         * @param payParams
         */

    }, {
        key: 'getSign',
        value: function getSign(signParams) {
            // 按 key 值的ascll 排序
            var keys = Object.keys(signParams);
            keys = keys.sort();
            var newArgs = {};
            keys.forEach(function (val, key) {
                if (signParams[val]) {
                    newArgs[val] = signParams[val];
                }
            });
            var string = queryString.stringify(newArgs) + '&key=' + config.wxpaykey;
            // 生成签名
            return crypto.createHash('md5').update(queryString.unescape(string), 'utf8').digest("hex").toUpperCase();
        }

        /**
         * 微信支付的所有参数
         * @param req 请求的资源, 获取必要的数据
         * @returns {{appId: string, timeStamp: Number, nonceStr: *, package: string, signType: string, paySign: *}}
         */

    }, {
        key: 'getBrandWCPayParams',
        value: function getBrandWCPayParams(obj, callback) {
            var that = this;
            var prepay_id_promise = that.getPrepayId(obj);
            prepay_id_promise.then(function (prepay_id) {
                var prepay_id = prepay_id;
                var wcPayParams = {
                    "appId": config.app_id, //公众号名称，由商户传入
                    "timeStamp": parseInt(new Date().getTime() / 1000).toString(), //时间戳，自1970年以来的秒数
                    "nonceStr": that.createNonceStr(), //随机串
                    // 通过统一下单接口获取
                    "package": "prepay_id=" + prepay_id,
                    "signType": "MD5" };
                wcPayParams.paySign = that.getSign(wcPayParams); //微信支付签名
                callback(null, wcPayParams);
            }, function (error) {
                callback(error);
            });
        }

        /**
         * 获取随机的NonceStr
         */

    }, {
        key: 'createNonceStr',
        value: function createNonceStr() {
            return Math.random().toString(36).substr(2, 15);
        }
    }, {
        key: 'getAccessToken',


        /**
         * 获取微信的 AccessToken
         */
        value: function getAccessToken(obj, cb) {
            var that = this;
            var getAccessTokenUrl = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=" + config.app_id + "&secret=" + config.app_secret + "&code=" + that.userInfo.code + "&grant_type=authorization_code";
            request.post({ url: getAccessTokenUrl }, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    if (40029 == body.errcode) {
                        cb(error, body);
                    } else {
                        body = JSON.parse(body);
                        that.userInfo.access_token = body.access_token;
                        that.userInfo.expires_in = body.expires_in;
                        that.userInfo.refresh_token = body.refresh_token;
                        that.userInfo.openid = body.openid;
                        that.userInfo.scope = body.scope;
                        // console.log(that.userInfo);
                        // 拼接微信的支付的参数
                        that.getBrandWCPayParams(obj, function (error, responseData) {
                            if (error) {
                                cb(error);
                            } else {
                                cb(null, responseData);
                            }
                        });
                    }
                } else {
                    cb(error);
                }
            });
        }

        /**
         * 获取微信用户的openid
         */

    }, {
        key: 'getOpenid',
        value: function getOpenid(obj, cb) {
            var that = this;
            that.getBrandWCPayParams(obj, function (error, responseData) {
                if (error) {
                    cb(error);
                } else {
                    cb(null, responseData);
                }
            });
        }
    }]);

    return WechatPay;
}();

module.exports = WechatPay;