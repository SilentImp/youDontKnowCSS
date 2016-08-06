/* jRound v0.1.2: shape-inside polyfill
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
    var global = {};
    var makeOuterCircle = function(id) {
        // screen info
        var sWidth = jRound.screen.width;
        var sHeight = jRound.screen.height;
        var radius = jRound.screen.radius;
        var node = document.getElementById(id);

        // element info
        var elementInfo = node.getBoundingClientRect();
        var width = window.getComputedStyle(node).getPropertyValue("width");
        var height = window.getComputedStyle(node).getPropertyValue("height");
        var top = elementInfo.top;
        var left = elementInfo.left;

        width = parseInt(width);
        height = parseInt(height);

        var offsetX = -1 * left;
        var offsetY = -1 * top;

        var pnode = node.childNodes[0];

        var lWidth = (sWidth / 2) - left;
        if (lWidth < 0) lWidth = 0;

        var rWidth = width - lWidth;

        var leftNode;
        var _leftNode = document.getElementById("left_" + id);
        if (!_leftNode) {
            leftNode = document.createElement("div");
            node.insertBefore(leftNode, pnode);
        } else
            leftNode = _leftNode;

        leftNode.id = "left_" + id;
        leftNode.style.float = "left";
        leftNode.style.width = lWidth + "px";
        leftNode.style.height = sHeight + "px";
        leftNode.style.overflow = "hidden";

        var rightNode;
        var _rightNode = document.getElementById("right_" + id);
        if (!_rightNode) {
            rightNode = document.createElement("div");
            node.insertBefore(rightNode, pnode);
        } else
            rightNode = _rightNode;

        rightNode.id = "right_" + id;
        rightNode.style.float = "right";
        rightNode.style.width = rWidth + "px";
        rightNode.style.height = sHeight + "px";
        rightNode.style.overflow = "hidden";

        var r1, r2;

        // left top
        r1 = radius[0];
        r2 = radius[1];

        var padding = 3;
        var data;
        data = (offsetX - padding) + "px " + (offsetY - padding) + "px, ";
        data += (sWidth / 2 + offsetX) + "px " + (offsetY - padding) + "px, ";
        data += (sWidth / 2 + offsetX) + "px " + offsetY + "px, ";
        data += (offsetX + r1) + "px " + offsetY + "px, ";

        for (var y = 0; y < r2; y++) {
            var x = r1 - r1 * Math.sqrt(1 - (y - r2) * (y - r2) / (r2 * r2));
            data += (x + offsetX) + "px " + (y + offsetY) + "px, ";
        }

        data += offsetX + "px " + (r2 + offsetY) + "px, ";

        // left bottom
        r1 = radius[0];
        r2 = radius[1];

        for (var y = sHeight - r2; y < sHeight; y++) {
            var x = r1 - r1 * Math.sqrt(1 - (y - (sHeight - r2)) * (y - (sHeight - r2)) / (r2 * r2));
            data += (x + offsetX) + "px " + (y + offsetY) + "px, ";
        }

        data += (r1 + offsetX) + "px " + (sHeight + offsetY) + "px, ";
        data += (sWidth / 2 + offsetX) + "px " + (sHeight + offsetY) + "px, ";
        data += (sWidth / 2 + offsetX) + "px " + (sHeight + offsetY + padding) + "px, ";
        data += offsetX + "px " + (sHeight + offsetY + padding) + "px, ";
        data += offsetX + "px " + (sHeight + offsetY) + "px, ";
        data += (offsetX - padding) + "px " + (sHeight + offsetY) + "px, ";
        data += (offsetX - padding) + "px " + offsetY + "px";

        console.log(data);
        leftNode.style.shapeOutside = "polygon(" + data + ")";
        console.log("out: " + leftNode.style.shapeOutside);
        // right side
        offsetX += ((sWidth / 2) - lWidth);

        // right top
        r1 = radius[0];
        r2 = radius[1];

        data = (sWidth / 2 + offsetX + padding) + "px " + (offsetY - padding) + "px, ";
        data += offsetX + "px " + (offsetY - padding) + "px, ";
        data += offsetX + "px " + (offsetY) + "px, ";
        data += (sWidth / 2 - r1 + offsetX) + "px " + offsetY + "px, ";

        for (var y = 0; y < r2; y++) {
            var x = (sWidth / 2 - r1) + r1 * Math.sqrt(1 - (y - r2) * (y - r2) / (r2 * r2));
            data += (x + offsetX) + "px " + (y + offsetY) + "px, ";
        }

        data += (sWidth / 2 + offsetX) + "px " + (r2 + offsetY) + "px, ";
        data += (sWidth / 2 + offsetX) + "px " + (sHeight - r2 + offsetY) + "px, ";

        // right bottom
        r1 = radius[0];
        r2 = radius[1];

        for (var y = sHeight - r2; y < sHeight; y++) {
            var x = (sWidth / 2 - r1) + r1 * Math.sqrt(1 - (y - (sHeight - r2)) * (y - (sHeight - r2)) / (r2 * r2));
            data += (x + offsetX) + "px " + (y + offsetY) + "px, ";
        }

        data += (sWidth / 2 - r1 + offsetX) + "px " + (sHeight + offsetY) + "px, ";
        data += offsetX + "px " + (sHeight + offsetY) + "px, ";
        data += offsetX + "px " + (sHeight + offsetY + padding) + "px, ";
        data += (sWidth / 2 + offsetX + padding) + "px " + (sHeight + offsetY + padding) + "px, ";
        data += (sWidth / 2 + offsetX + padding) + "px " + (offsetY - padding) + "px";

        rightNode.style.shapeOutside = "polygon(" + data + ")";
    },
    init = function() {
        var idList = global.idList;
        for (var i = 0; i < idList.length; i++) {
            makeOuterCircle(idList[i].selector.substring(1));
        }
    };
    window.addEventListener("load", function() {
        if (typeof w.jRound === "undefined") {
            w.jRound = {};
        }
        jRound = w.jRound;
        jRound.initShape = init;
        jRound.screen = {
            width: 600,
            height: 400,
            radius: [300, 200],
        };
        global.idList = jRound.getSelectors("shape-inside", "display");
        init();
    });
})(this);