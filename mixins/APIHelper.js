import axios from 'axios'
import md5 from "js-md5"
const API_BASE = process.env.apiBase

export default {
  data () {
    return {
      deviceId: '',
      deviceName: '',
      deviceVersion: '',
      MD5_SALT: 'diceos'
    }
  },
  mounted () {
    this.getDeviceId()
    this.getBrowserInfo()
  },
  methods: {
    getDeviceId () {
      if (!process.server && this.deviceId.length === 0) {
        setTimeout(() => {
          let Fingerprint2 = require('fingerprintjs2')
          new Fingerprint2().get((result, components) => {
            this.deviceId = result.toUpperCase() // a hash, representing your device fingerprint
          }, 100)
        })
      }
    },
    getBrowserInfo () {
      if (!process.server && this.deviceName.length === 0) {
        var nVer = navigator.appVersion;
        var nAgt = navigator.userAgent;
        var browserName = navigator.appName;
        var fullVersion = '' + parseFloat(navigator.appVersion);
        var nameOffset,verOffset;

        // In Opera, the true version is after "Opera" or after "Version"
        if ((verOffset = nAgt.indexOf("Opera")) !== -1) {
           browserName = "Opera";
           fullVersion = nAgt.substring(verOffset + 6);
           if ((verOffset=nAgt.indexOf("Version")) !== -1)
             fullVersion = nAgt.substring(verOffset + 8);
        }
        // In MSIE, the true version is after "MSIE" in userAgent
        else if ((verOffset = nAgt.indexOf("MSIE")) !== -1) {
           browserName = "Microsoft Internet Explorer";
           fullVersion = nAgt.substring(verOffset + 5);
        }
        // In Chrome, the true version is after "Chrome"
        else if ((verOffset = nAgt.indexOf("Chrome")) !== -1) {
           browserName = "Chrome";
           fullVersion = nAgt.substring(verOffset + 7);
        }
        // In Safari, the true version is after "Safari" or after "Version"
        else if ((verOffset = nAgt.indexOf("Safari")) !== -1) {
           browserName = "Safari";
           fullVersion = nAgt.substring(verOffset + 7);
           if ((verOffset = nAgt.indexOf("Version")) !== -1)
             fullVersion = nAgt.substring(verOffset + 8);
        }
        // In Firefox, the true version is after "Firefox"
        else if ((verOffset = nAgt.indexOf("Firefox")) !== -1) {
            browserName = "Firefox";
            fullVersion = nAgt.substring(verOffset + 8);
        }
        // In most other browsers, "name/version" is at the end of userAgent
        else if ( (nameOffset=nAgt.lastIndexOf(' ') + 1) < (verOffset = nAgt.lastIndexOf('/')) ) {
            browserName = nAgt.substring(nameOffset,verOffset);
            fullVersion = nAgt.substring(verOffset + 1);
            if (browserName.toLowerCase() === browserName.toUpperCase()) {
               browserName = navigator.appName;
            }
        }
      }
    },
    formNormalResponse (method, url, fields, cfg = {}) {
      this.getDeviceId()
      this.getBrowserInfo()
      let payload = Object.assign({}, fields)
      var config = {
        method: method,
        url: url,
        headers: {},
        timeout: 10000,
        withCredentials: true
      }
      let thenFn = cfg.then || (() => {})
      delete cfg.then
      if (method === 'get' || method === 'delete') {
        config.params = fields
      } else {
        config.data = payload
      }
      config = Object.assign({}, config, cfg)
      return new Promise((resolve, reject) => {
        axios.request(config)
          .then((resp) => {
            if (resp.data) {
              let data = resp.data
              thenFn.call(this, data)
              resolve(data)
            } else {
              console.error('Incorrect response format.', resp)
            }
          }).catch((err) => {
            window.dd = err
            if (err.status === 401) {
              this.$router.push({name: 'login-page', params: {}})
              return
            }
            reject(err)
          })
      })
    },
    apiAccountVerifyPIN (fields) {
      const url = API_BASE + '/account/pin'
      let payload = {
        pinType: fields.pinType,
        pin: fields.pin,
        newPin: fields.pin
      }
      return this.formNormalResponse('put', url, payload)
    },
    /* Get Records API */
    apiGetRecords (fields) {
      const url = `${API_BASE}/records?status=2,3`
      return this.formNormalResponse('get', url, {})
    },
    /* Get Single Record API */
    apiGetSingleRecord (fields) {
      const url = `${API_BASE}/record/${fields.traceId}`
      return this.formNormalResponse('get', url, {})
    },
    /* Get Assets API */
    apiGetAssets () {
      const url = `${API_BASE}/assets`
      return this.formNormalResponse('get', url, {})
    },
    /* Get Account Assets API */
    apiGetAccountAssets (opts) {
      const url = `${API_BASE}/account/assets`
      return this.formNormalResponse('get', url, {}, {headers: {'Authorization': 'bearer ' + opts.token}})
    },
    /* Get Account Asset detail API */
    apiGetAccountAssetDetail (opts) {
      const url = `${API_BASE}/account/assets/${opts.assetId}`
      return this.formNormalResponse('get', url, {}, {headers: {'Authorization': 'bearer ' + opts.token}})
    },
    /* Roll */
    apiPostAccountRoll (opts) {
      const url = `${API_BASE}/account/dice`
      return this.formNormalResponse('post', url, opts.payload, {headers: {'Authorization': 'bearer ' + opts.token}})
    },
    /* Withdraw */
    apiPostAccountWithdraw (opts) {
      const url = `${API_BASE}/account/withdraw`
      return this.formNormalResponse('post', url, opts.payload, {headers: {'Authorization': 'bearer ' + opts.token}})
    },
    /* Sign up */
    apiSignup (fields) {
      const url = `${API_BASE}/account/register`
      return this.formNormalResponse('post', url, {
        name: fields.username,
        password: md5(this.MD5_SALT + fields.name + fields.password)
      })
    },
    /* Sign in */
    apiLogin (fields) {
      const url = `${API_BASE}/account/login`
      return this.formNormalResponse('post', url, {
        name: fields.username,
        password: md5(this.MD5_SALT + fields.name + fields.password)
      })
    },
    /* error handle */
    apiCrackError (error) {
      // error response by server
      if (error && error.response && error.response.data && error.response.data.code) {
        return {
          code: error.response.data.code,
          text: error.response.data.msg,
          message: this.$t(`error.${error.response.data.msg}`)
        }
      }
      // inner error
      if (error && error.name) {
        return {
          code: -1,
          text: error.name,
          message: error.message
        }
      }
      return {
        code: -1,
        text: 'UNKNOWN_NETWORK_ERROR_MSG',
        message: this.$t(`error.UNKNOWN_NETWORK_ERROR_MSG`) + ' ' + `${error.statusText}(${error.status})`
      }
    },
    apiNotifyError (error, opts = {}) {
      let onclick = opts._onclick || (() => {})
      let formErr = this.apiCrackError(error)
      let notifi = new Notification(formErr.message, { body: '' })
      notifi.onclick = onclick
    }
  }
}
