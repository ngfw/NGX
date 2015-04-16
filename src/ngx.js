/**
 * NGX 
 * Tiny Javascript Framework
 * Copyright (c) Nick Gejadze
 * Licensed under the GPL.
 */
(function() {
    var NG = {}, fx = {};
    extend = function(obj, props) {
        for (var prop in props) {
            if (props.hasOwnProperty(prop)) {
                obj[prop] = props[prop];
            }
        }
    }
    NG.ready = function(callback) {
        // check if DOM is ready
        var checkDOM = setInterval(function() {
            if (document.readyState === "complete") {
                clearInterval(checkDOM);
                if (typeof plugin !== "undefined") {
                    extend(fx, plugin);
                }
                // Register all methods
                for (var prop in fx) {
                    NG.NGX[prop] = fx[prop];
                }
                // Register FW
                $ = NG.NGX;
                // EXECUTE
                callback();
            }
        }, 50);
    }
    NG.NGX = function() {
        if (arguments.length == 0) {
            return this;
        } else if (arguments.length == 1) {
            NG.NGX.selector(arguments[0]);
        } else {
            NG.NGX.selector(arguments.join(","));
        }
        return NG.NGX;
    }
    NG.NGX.this = [];
    fx.selector = function(selector) {
        if (typeof selector !== "undefined") {
            var selectors = selector.split(',');
            NG.NGX.this = [];
            var c = selectors.length;
            while (c--) {
                var selector = NG.NGX.trim(selectors[c]),
                    TmpElements = [];
                if (selector.substr(0, 1) == '#') {
                    NG.NGX.this.push(NG.NGX.getById(selector.substr(1)));
                } else if (selector.substr(0, 1) == '.') {
                    TmpElements = NG.NGX.getByClass(selector.substr(1));
                    NG.NGX.this = NG.NGX.this.concat(TmpElements);
                } else {
                    TmpElements = document.getElementsByTagName(selector);
                    var tc = TmpElements.length;
                    while (tc--) {
                        NG.NGX.this.push(TmpElements[tc]);
                    }
                }
            }
            NG.NGX.this.reverse();
        }
        return NG.NGX;
    }
    fx.getById = function(id) {
        return document.getElementById(id);
    }
    fx.getByClass = function(className) {
        var elements = [],
            expr = new RegExp('\\b' + className + '\\b'),
            allElements = document.getElementsByTagName('*');
        var c = allElements.length;
        while (c--) {
            if (expr.test(allElements[c].className)) {
                elements.push(allElements[c]);
            }
        }
        return elements;
    }
    fx.html = function(html) {
        var c = NG.NGX.this.length;
        if (typeof html !== "undefined") {
            while (c--) {
                NG.NGX.this[c].innerHTML = html;
            }
            return NG.NGX;
        } else {
            return NG.NGX.this[0].innerHTML;
        }
    }
    fx.append = function(html) {
        var c = NG.NGX.this.length;
        while (c--) {
            NG.NGX.this[c].innerHTML = NG.NGX.this[c].innerHTML + html;
        }
        return NG.NGX;
    }
    fx.prepend = function(html) {
        var c = NG.NGX.this.length;
        while (c--) {
            NG.NGX.this[c].innerHTML = html + NG.NGX.this[c].innerHTML;
        }
        return NG.NGX;
    }
    fx.text = function(text) {
        var c = NG.NGX.this.length;
        while (c--) {
            NG.NGX.this[c].innerHTML = NG.NGX.safeHtml(text);
        }
        return NG.NGX;
    }
    fx.appendText = function(text) {
        var c = NG.NGX.this.length;
        while (c--) {
            NG.NGX.this[c].innerHTML = NG.NGX.this[c].innerHTML + NG.NGX.safeHtml(text);
        }
        return NG.NGX;
    }
    fx.value = function(val) {
        var c = NG.NGX.this.length,
            ec = NG.NGX.this.length;
        while (c--) {
            if (NG.NGX.this[c].nodeType == 1 && (NG.NGX.this[c].type == 'checkbox' || NG.NGX.this[c].type == 'radio')) {
                val ? NG.NGX.this[c].checked = true : NG.NGX.this[c].checked = false;
            } else {
                if (val) {
                    NG.NGX.this[c].value = val;
                    return NG.NGX.this[c].value;
                } else {
                    return NG.NGX.this[c].value;
                }
            }
        }
        return NG.NGX;
    }
    fx.hasClass = function(cls) {
        return NG.NGX.this[0].className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
    }
    fx.addClass = function(cls) {
        var c = NG.NGX.this.length;
        while (c--) {
            NG.NGX.this[c].className += ' ' + cls;
        }
        return NG.NGX;
    }
    fx.removeClass = function(cls) {
        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
        NG.NGX.this[0].className = NG.NGX.this[0].className.replace(reg, '');
        return NG.NGX;
    }
    fx.css = function(style) {
        var c = NG.NGX.this.length;
        while (c--) {
            for (var s in style) {
                NG.NGX.this[c].style[s] = style[s];
            }
        }
        return NG.NGX;
    }
    fx.bind = function(action, callback) {
        if (NG.NGX.this[0].addEventListener) {
            var c = NG.NGX.this.length;
            while (c--) {
                NG.NGX.this[c].addEventListener(action, callback, false);
            }
        } else if (NG.NGX.this[0].attachEvent) {
            var c = NG.NGX.this.length;
            while (c--) {
                NG.NGX.this[c].attachEvent('bind' + action, callback);
            }
        }
        return NG.NGX;
    },
    //nbind events from the elements
    fx.unbind = function(action, callback) {
        if (NG.NGX.this[0].removeEventListener) {
            var c = ELEMENTS.length;
            while (c--) {
                NG.NGX.this[c].removeEventListener(action, callback, false);
            }
        } else { //IE
            var c = NG.NGX.this.length;
            while (c--) {
                NG.NGX.this[c].detachEvent('bind' + action, callback);
            }
        }
        return NG.NGX;
    }
    fx.trim = function(str) {
        var str = str.replace(/^\s\s*/, ''),
            ws = /\s/,
            i = str.length;
        while (ws.test(str.charAt(--i)));
        return str.slice(0, i + 1);
    }
    fx.safeHtml = function(html) {
        var text = document.createTextNode(html);
        return new XMLSerializer().serializeToString(text);
    },
    
    fx.opacity = function(level) {
        var c = NG.NGX.this.length;
        while (c--) {
            if (level >= 0 && level <= 100) {
                NG.NGX.this[c].style.opacity = (level / 100);
                NG.NGX.this[c].style.filter = 'alpha(opacity=' + level + ')';
            }
        }
        return NG.NGX;
    }
    fx.fadeOut = function(time) {
        var level = 100;
        var interval = setInterval(function() {
            NG.NGX.opacity(--level);
            if (level == 0) {
                clearInterval(interval);
            }
        }, time / 100);
        return NG.NGX;
    }
    fx.fadeIn = function(time) {
        var level = 0;
        var interval = setInterval(function() {
            NG.NGX.opacity(level++);
            if (level == 0) {
                clearInterval(interval);
            }
        }, time / 100);
        return NG.NGX;
    }
    fx.each = function(v, callback) {
        if (typeof v === "function") {
            callback = v;
            var tmpHolder = NG.NGX.this;
            for (var i = 0; i < tmpHolder.length; i++) {
                NG.NGX.this = [];
                NG.NGX.this.push(tmpHolder[i])
                callback(NG.NGX, i);
            }
        } else {
            for (var i = 0; i < v.length; i++) {
                callback(v[i], i);
            }
        }
        return NG.NGX;
    }
    
    fx.methods = {}
    fx.methods.done = function() {}
    fx.methods.error = function() {}
    
    fx.get = function(url, params, callback) {
        return NG.NGX.ajax(url, 'GET', params, callback);
    }
    fx.post = function(url, data, callback) {
        return NG.NGX.ajax(url, 'POST', data, callback);
    }
    fx.ajax = function(url, method, params, callback) {
        var xhr = new XMLHttpRequest();
        var dt;
        if (params) {
            var ar = [];
            for (var prm in params) {
                ar.push(prm + '=' + encodeURIComponent(params[prm]));
            }
            dt = ar.join('&');
        }
        if(method.toUpperCase() == "GET" && dt != ""){
            url+="?"+dt;
            var dt=null;
        }
        xhr.open(method.toUpperCase(), url || '', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.addEventListener('readystatechange', function(){
            if (xhr.readyState === 0) {
                // beforeSend ??
            }else if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    var Response = NG.NGX.parseResponse(xhr.responseText);
                    callback(Response);
                    return NG.NGX.methods.done(NG.NGX.parseResponse(xhr.responseText));
                }
                NG.NGX.methods.error(NG.NGX.parseResponse(xhr.responseText));
            }
        }, false);
        xhr.send(dt);
        return NG.NGX.registerMethods();
    }
   
    fx.parseResponse = function(response) {
        var result;
        try {
            result = JSON.parse(response);
        } catch (e) {
            result = response;
        }
        return result;
    }
    fx.registerMethods = function() {
        return {
            done: function done(callback) {
                NG.NGX.methods.done = callback;
                return this;
            },
            error: function error(callback) {
                NG.NGX.methods.error = callback;
                return this;
            }
        }
    }
    if (!window.$) {
        $ = window.$ = NG.ready;
    }
})();