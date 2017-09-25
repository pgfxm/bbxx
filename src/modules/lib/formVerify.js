var mod = {
    checkPrice: function(price){
        if(!/^\d+(\.\d*)?$/.test(price)){
            return false;
        }

        return true;
    },

    checkNum: function(num){
        if(!/^\d+$/.test(num)){
            return false;
        }

        return true;
    },

    checkMail: function(str) {
        return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(str)
    },

    checkPhone: function(str) {
        return /^1[34578]\d{9}$/.test('' + str)
    }
}
module.exports = mod;