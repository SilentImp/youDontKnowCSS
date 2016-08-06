/* jRound v0.1.2: device-radius polyfill
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
    var jRound = {};
    var respond = {}; // use the Respond.js opensource (https://github.com/scottjehl/Respond)
    respond.regex = {
        media: /@media[^\{]+\{([^\{\}]*\{[^\}\{]*\})+/gi,
        comments: /\/\*[^*]*\*+([^/][^*]*\*+)*\//gi,
        urls: /(url\()['"]?([^\/\)'"][^:\)'"]+)['"]?(\))/g,
        findStyles: /@media *([^\{]+)\{([\S\s]+?)$/,
        only: /(only\s+)?([a-zA-Z]+)\s?/,
        mindr: /\(\s*min\-device-radius\s*:\s*(\s*[0-9\.]+)(px|%)\s*\)/,
        maxdr: /\(\s*max\-device-radius\s*:\s*(\s*[0-9\.]+)(px|%)\s*\)/,
        minmaxdr: /\(\s*m(in|ax)\-device-radius\s*:\s*(\s*[0-9\.]+)(px|%)\s*\)/gi,
        other: /\([^\)]*\)/g
    };
    var doc = w.document,
        docElem = doc.documentElement,
        mediastyles = [],
        rules = [],
        appendedEls = [],
        parsedSheets = {},
        head = doc.getElementsByTagName("head")[0] || docElem,
        base = doc.getElementsByTagName("base")[0],
        links = head.getElementsByTagName("link");

    var isUnsupportedMediaQuery = function(query) {
            return query.replace(respond.regex.minmaxdr, "").match(respond.regex.other);
    },
    // convert % to px
    convertPercentageToPixel = function(mediastyle) {
        var screen_length, pValue;
        if (jRound.screen.width < jRound.screen.height) {
            screen_length = jRound.screen.width;
        } else {
            screen_length = jRound.screen.height;
        }
        if (typeof mediastyle.maxdr !== "null" && typeof mediastyle.maxdr == "string" && mediastyle.maxdr.indexOf("%") > 0) {
            pValue = parseFloat(mediastyle.maxdr) / 100.0;
            mediastyle.maxdr = (screen_length * pValue);
        }
        if (typeof mediastyle.mindr !== "null" && typeof mediastyle.mindr == "string" && mediastyle.mindr.indexOf("%") > 0) {
            pValue = parseFloat(mediastyle.mindr) / 100.0;
            mediastyle.mindr = (screen_length * pValue);
        }
    },
    // Check a media conditions and apply the stylesheets
    applyMedia = function(href) {
        var styleBlocks = {},
            lastLink = links[links.length - 1];
        for (var i in mediastyles) {
            if (mediastyles.hasOwnProperty(i)) {
                convertPercentageToPixel(mediastyles[i]);
                var thisstyle = mediastyles[i],
                    min = thisstyle.mindr,
                    max = thisstyle.maxdr,
                    minnull = min === null,
                    maxnull = max === null;
                if (!thisstyle.hasquery || (!minnull || !maxnull) && (minnull || jRound.screen.radius[0] >= parseFloat(min)) && (maxnull || jRound.screen.radius[0] <= parseFloat(max))) {
                    if (!styleBlocks[thisstyle.media]) {
                        styleBlocks[thisstyle.media] = [];
                    }
                    styleBlocks[thisstyle.media].push(rules[thisstyle.rules]);
                }
            }
        }
        for (var j in appendedEls) {
            if (appendedEls.hasOwnProperty(j)) {
                if (appendedEls[j] && appendedEls[j].parentNode === head) {
                    head.removeChild(appendedEls[j]);
                }
            }
        }
        appendedEls.length = 0;
        for (var k in styleBlocks) {
            if (styleBlocks.hasOwnProperty(k)) {
                var ss = doc.createElement("style"),
                    css = styleBlocks[k].join("\n");
                ss.type = "text/css";
                ss.media = k;
                head.insertBefore(ss, lastLink.nextSibling);
                if (ss.styleSheet) {
                    ss.styleSheet.cssText = css;
                } else {
                    ss.appendChild(doc.createTextNode(css));
                }
                appendedEls.push(ss);
            }
        }
    },
    // generate mediastyles(media and conditions) and rules(cssText)
    translate = function(styles, href, media) {
        var qs = styles.replace(respond.regex.comments, "").match(respond.regex.media),
            ql = qs && qs.length || 0;
        href = href.substring(0, href.lastIndexOf("/"));
        var repUrls = function(css) {
                return css.replace(respond.regex.urls, "$1" + href + "$2$3");
            },
            useMedia = !ql && media;
        if (href.length) {
            href += "/";
        }
        if (useMedia) {
            ql = 1;
        }
        for (var i = 0; i < ql; i++) {
            var fullq, thisq, eachq, eql;
            if (useMedia) {
                fullq = media;
                rules.push(repUrls(styles));
            } else {
                fullq = qs[i].match(respond.regex.findStyles) && RegExp.$1;
                rules.push(RegExp.$2 && repUrls(RegExp.$2));
            }
            eachq = fullq.split(",");
            eql = eachq.length;
            for (var j = 0; j < eql; j++) {
                thisq = eachq[j];
                if (isUnsupportedMediaQuery(thisq)) {
                    continue;
                }
                mediastyles.push({
                    media: thisq.split("(")[0].match(respond.regex.only) && RegExp.$2 || "all",
                    rules: rules.length - 1,
                    hasquery: thisq.indexOf("(") > -1,
                    mindr: thisq.match(respond.regex.mindr) && parseFloat(RegExp.$1) + (RegExp.$2 || ""),
                    maxdr: thisq.match(respond.regex.maxdr) && parseFloat(RegExp.$1) + (RegExp.$2 || "")
                });
            }
        }
        applyMedia(href);
    },
    // XHR Processing
    makeRequests = function(requestQueue) {
        if (requestQueue.length) {
            var thisRequest = requestQueue.shift();
            jRound.ajax(thisRequest.href, function(styles) {
                translate(styles, thisRequest.href, thisRequest.media);
                parsedSheets[thisRequest.href] = true;
                w.setTimeout(function() {
                    makeRequests(requestQueue);
                }, 0);
            });
        }
    },
    // Main
    init = function() {
        var requestQueue = [];
        var param = location.search.substring(1);
        if (param.indexOf("round") == 0) {
            var round = param.substring(param.indexOf("=") + 1);
            if (round == "true") {
                jRound.screen = {
                    "width": 330,
                    "height": 330,
                    "radius": [165, 165]
                };
            } else if (round == "false") {
                jRound.screen = {
                    "width": 330,
                    "height": 330,
                    "radius": [0, 0],
                };
            }
        }
        for (var i = 0; i < links.length; i++) {
            var sheet = links[i],
                href = sheet.href,
                media = sheet.media,
                isCSS = sheet.rel && sheet.rel.toLowerCase() === "stylesheet";
            if (!!href && isCSS && !parsedSheets[href]) {
                if (sheet.styleSheet && sheet.styleSheet.rawCssText) {
                    translate(sheet.styleSheet.rawCssText, href, media);
                    parsedSheets[href] = true;
                } else {
                    if (!/^([a-zA-Z:]*\/\/)/.test(href) && !base || href.replace(RegExp.$1, "").split("/")[0] === w.location.host) {
                        if (href.substring(0, 2) === "//") {
                            href = w.location.protocol + href;
                        }
                        requestQueue.push({
                            href: href,
                            media: media
                        });
                    }
                }
            }
        }
        makeRequests(requestQueue);
    };
    window.addEventListener("load", function() {
        if (typeof w.jRound === "undefined") {
            w.jRound = {};
        }
        jRound = w.jRound;
        jRound.initDeviceRadius = init;
        jRound.screen = {
            "width": 330,
            "height": 330,
            "radius": [165, 165],
        };
        init();
    });
})(this);