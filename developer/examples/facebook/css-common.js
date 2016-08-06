/* jRound v0.1.2: common function for the css-round-display polyfill
 *
 * Copyright 2015 LG Electronics Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License. */
 
(function(w) {
    "use strict";
    var ajax = function(url, callback) {
        var req = new XMLHttpRequest();
        req.open("GET", url, false);
        req.onreadystatechange = function() {
            if (req.readyState !== 4 || req.status !== 200 && req.status !== 304) {
                return;
            }
            callback(req.responseText);
        };
        if (req.readyState === 4) {
            return;
        }
        req.send(null);
    },
    getRules = function(stylesheets, properties, property_value) {
        var selector = "\\s*([^{}]*[^\\s])\\s*{[^\\}]*";
        var value = "\\s*:\\s*((?:[^;\\(]|\\([^\\)]*\\))*)\\s*;";
        var re, match;
        var rules = [];
        properties.forEach(function(property) {
            re = new RegExp(selector + "(" + property + ")" + value, "ig");
            stylesheets.forEach(function(stylesheet) {
                while ((match = re.exec(stylesheet)) !== null) {
                    if (property_value == match[3] || property_value == "*") {
                        rules.push({
                            selector: match[1],
                            property: match[2],
                            value: match[3]
                        });
                    }
                }
            });
        });
        return rules;
    },
    getSelectors = function(property_id, property_value) {
        var head = head = document.getElementsByTagName("head")[0];
        var links = head.getElementsByTagName("link");
        var idList = [];
        if (typeof property_value === "undefined") {
            property_value = "*";
        }
        for (var i = 0; i < links.length; i++) {
            var sheet = links[i],
                href = sheet.href,
                isCSS = sheet.rel && sheet.rel.toLowerCase() === "stylesheet";
            if (!!href && isCSS) {
                if (!/^([a-zA-Z:]*\/\/)/.test(href) && !base || href.replace(RegExp.$1, "").split("/")[0] === w.location.host) {
                    if (href.substring(0, 2) === "//") {
                        href = w.location.protocol + href;
                    }
                    jRound.ajax(href, function(stylesheet) {
                        var rules = getRules(new Array(stylesheet), new Array(property_id), property_value);
                        idList = idList.concat(rules);
                    });
                }
            }
        }
        return idList;
    };
    if (typeof w.jRound === "undefined") {
        w.jRound = {};
    }
    var jRound = w.jRound;
    jRound.ajax = ajax;
    jRound.getRules = getRules;
    jRound.getSelectors = getSelectors;
    jRound.screen = {
        width: 600, // pixel unit
        height: 400, // pixel unit
        radius: [300, 200],
    };
    // jRound.screen = JSON.parse(shape);
    if (location.protocol.indexOf("file") == 0)
        alert("== css-round-display is not supported in the File Protocol ==");
})(this);