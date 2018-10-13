function openConnection(hi, hiId, webAddress) {
		function validataOS(){
	    	if (navigator.userAgent.indexOf('Window') > 0){
	            return 'Windows';
	     	} else if (navigator.userAgent.indexOf('Mac OS X') > 0) {
	             return 'Mac ';
	     	} else if (navigator.userAgent.indexOf('Linux') > 0) {
	            return 'Linux';
	    	} else {
	            return 'NUll';
	     	}
		}
		if (validataOS() === 'Windows') {
            var f = document.createElement('form');
            document.body.appendChild(f);
            f.setAttribute('action', 'baidu://message');
            var input = document.createElement('input');
            input.setAttribute('name', 'appid');
            input.setAttribute('value', hiId);
            input.setAttribute('type', 'hidden');
            f.appendChild(input);
             f.submit();
            document.body.removeChild(f);
		} else {
			if (webAddress === '') {
				IIT.dialog.alert('系统提示', '该系统暂未支持mac', true);
			} else {
				window.open(webAddress);
			}
		}
		return false;
}
