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
                    NG.X[prop] = fx[prop];
                }
                // Register FW
                $ = NG.X;
                // EXECUTE
                callback();
            }
        }, 50);
    }
    NG.X = function() {
        if (arguments.length == 0) {
            return this;
        } else if (arguments.length == 1) {
            NG.X.selector(arguments[0]);
        } else {
            NG.X.selector(arguments.join(","));
        }
        return NG.X;
    }
    NG.X.this = [];
    fx.selector = function(selector) {
        if (typeof selector !== "undefined") {
            var selectors = selector.split(',');
            NG.X.this = [];
            var c = selectors.length;
            while (c--) {
                var selector = NG.X.trim(selectors[c]),
                    TmpElements = [];
                if (selector.substr(0, 1) == '#') {
                    NG.X.this.push(NG.X.getById(selector.substr(1)));
                } else if (selector.substr(0, 1) == '.') {
                    TmpElements = NG.X.getByClass(selector.substr(1));
                    NG.X.this = NG.X.this.concat(TmpElements);
                } else {
                    TmpElements = document.getElementsByTagName(selector);
                    var tc = TmpElements.length;
                    while (tc--) {
                        NG.X.this.push(TmpElements[tc]);
                    }
                }
            }
            NG.X.this.reverse();
        }
        return NG.X;
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
        var c = NG.X.this.length;
        if (typeof html !== "undefined") {
            while (c--) {
                NG.X.this[c].innerHTML = html;
            }
            return NG.X;
        } else {
            return NG.X.this[0].innerHTML;
        }
    }
    fx.append = function(html) {
        var c = NG.X.this.length;
        while (c--) {
            NG.X.this[c].innerHTML = NG.X.this[c].innerHTML + html;
        }
        return NG.X;
    }
    fx.prepend = function(html) {
        var c = NG.X.this.length;
        while (c--) {
            NG.X.this[c].innerHTML = html + NG.X.this[c].innerHTML;
        }
        return NG.X;
    }
    fx.text = function(text) {
        var c = NG.X.this.length;
        while (c--) {
            NG.X.this[c].innerHTML = NG.X.safeHtml(text);
        }
        return NG.X;
    }
    fx.appendText = function(text) {
        var c = NG.X.this.length;
        while (c--) {
            NG.X.this[c].innerHTML = NG.X.this[c].innerHTML + NG.X.safeHtml(text);
        }
        return NG.X;
    }
    fx.value = function(val) {
        var c = NG.X.this.length,
            ec = NG.X.this.length;
        while (c--) {
            if (NG.X.this[c].nodeType == 1 && (NG.X.this[c].type == 'checkbox' || NG.X.this[c].type == 'radio')) {
                val ? NG.X.this[c].checked = true : NG.X.this[c].checked = false;
            } else {
                if (val) {
                    NG.X.this[c].value = val;
                    return NG.X.this[c].value;
                } else {
                    return NG.X.this[c].value;
                }
            }
        }
        return NG.X;
    }
    fx.hasClass = function(cls) {
        return NG.X.this[0].className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
    }
    fx.addClass = function(cls) {
        var c = NG.X.this.length;
        while (c--) {
            NG.X.this[c].className += ' ' + cls;
        }
        return NG.X;
    }
    fx.removeClass = function(cls) {
        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
        NG.X.this[0].className = NG.X.this[0].className.replace(reg, '');
        return NG.X;
    }
    fx.css = function(style) {
        var c = NG.X.this.length;
        while (c--) {
            for (var s in style) {
                NG.X.this[c].style[s] = style[s];
            }
        }
        return NG.X;
    }
    fx.bind = function(action, callback) {
        if (NG.X.this[0].addEventListener) {
            var c = NG.X.this.length;
            while (c--) {
                NG.X.this[c].addEventListener(action, callback, false);
            }
        } else if (NG.X.this[0].attachEvent) {
            var c = NG.X.this.length;
            while (c--) {
                NG.X.this[c].attachEvent('bind' + action, callback);
            }
        }
        return NG.X;
    },
    //nbind events from the elements
    fx.unbind = function(action, callback) {
        if (NG.X.this[0].removeEventListener) {
            var c = ELEMENTS.length;
            while (c--) {
                NG.X.this[c].removeEventListener(action, callback, false);
            }
        } else { //IE
            var c = NG.X.this.length;
            while (c--) {
                NG.X.this[c].detachEvent('bind' + action, callback);
            }
        }
        return NG.X;
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
        var c = NG.X.this.length;
        while (c--) {
            if (level >= 0 && level <= 100) {
                NG.X.this[c].style.opacity = (level / 100);
                NG.X.this[c].style.filter = 'alpha(opacity=' + level + ')';
            }
        }
        return NG.X;
    }
    fx.fadeOut = function(time) {
        var level = 100;
        var interval = setInterval(function() {
            NG.X.opacity(--level);
            if (level == 0) {
                clearInterval(interval);
            }
        }, time / 100);
        return NG.X;
    }
    fx.fadeIn = function(time) {
        var level = 0;
        var interval = setInterval(function() {
            NG.X.opacity(level++);
            if (level == 0) {
                clearInterval(interval);
            }
        }, time / 100);
        return NG.X;
    }
    fx.each = function(v, callback) {
        if (typeof v === "function") {
            callback = v;
            var tmpHolder = NG.X.this;
            for (var i = 0; i < tmpHolder.length; i++) {
                NG.X.this = [];
                NG.X.this.push(tmpHolder[i])
                callback(NG.X, i);
            }
        } else {
            for (var i = 0; i < v.length; i++) {
                callback(v[i], i);
            }
        }
        return NG.X;
    }
    
    fx.methods = {}
    fx.methods.done = function() {}
    fx.methods.error = function() {}
    
    fx.get = function(url, params, callback) {
        return NG.X.ajax(url, 'GET', params, callback);
    }
    fx.post = function(url, data, callback) {
        return NG.X.ajax(url, 'POST', data, callback);
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
        xhr.open(method.toUpperCase(), url, true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.addEventListener('readystatechange', function(){
            if (xhr.readyState === 0) {
                // beforeSend ??
            }else if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    var Response = NG.X.parseResponse(xhr.responseText);
                    callback(Response);
                    return NG.X.methods.done(NG.X.parseResponse(xhr.responseText));
                }
                NG.X.methods.error(NG.X.parseResponse(xhr.responseText));
            }
        }, false);
        xhr.send(dt);
        return NG.X.registerMethods();
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
                NG.X.methods.done = callback;
                return this;
            },
            error: function error(callback) {
                NG.X.methods.error = callback;
                return this;
            }
        }
    }
    if (!window.$) {
        $ = window.$ = NG.ready;
    }
})();