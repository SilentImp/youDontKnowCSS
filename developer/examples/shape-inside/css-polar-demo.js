/* jRound v0.1.2: polar coordinates polyfill
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
    var drawPolar = function(polar_id) {
        var polarElement = document.querySelector(polar_id);

        var containingBlock = polarElement.parentNode;
        var containingBlockSize = {
            width: parseFloat(window.getComputedStyle(containingBlock, null).getPropertyValue("width")),
            height: parseFloat(window.getComputedStyle(containingBlock, null).getPropertyValue("height"))
        };

        if (typeof polarElement.tagName !== 'undefined') {
            var polarElementSize = {
                width: parseFloat(window.getComputedStyle(polarElement, null).getPropertyValue("width")),
                height: parseFloat(window.getComputedStyle(polarElement, null).getPropertyValue("height"))
            };

            if (polarElement.dataset.polarDistance !== undefined) {
                var polarAngle = polarElement.dataset.polarAngle;
                if (polarAngle == undefined)
                    polarAngle = "0deg";

                var polarDistance = polarElement.dataset.polarDistance;
                if (polarDistance == undefined)
                    polarDistance = "0px";

                var polarOrientation = polarElement.dataset.polarOrientation;
                if (polarOrientation == undefined)
                    polarOrientation = "0deg";

                // get polar angle value
                polarAngle = parseFloat(polarAngle);

                // get polar distance value
                var distanceValueList = polarDistance.split(' ');

                if (distanceValueList[0].indexOf("%") > 0) {
                    distanceValueList[0] = (containingBlockSize.width / 2) * (parseFloat(distanceValueList[0]) / 100.0);
                } else { // if (distanceValueList[0].indexOf("px") > 0) {
                    distanceValueList[0] = parseFloat(distanceValueList[0]);
                }

                // anchor point is decided by polar-distance value
                var anchorPoint = getAnchor(distanceValueList[1], containingBlockSize, polarElementSize, polarAngle, distanceValueList[0]);

                // get polar orientation value
                 var translate3d = "translate3d(" + anchorPoint.x + "px, " + anchorPoint.y + "px, 0px)" + setOrientation(polarOrientation, polarAngle);

                polarElement.style.webkitTransform = translate3d;

                //clip elements
                if (polarElement.className == "top-icon" || polarElement.className == "bottom-icon") {
                    clipElement(containingBlock, containingBlockSize.height, polarElement, polarElementSize, polarAngle, distanceValueList[0], polarOrientation);
                }
            }
        }
    },
    setOrientation = function(orientation, angle) {
        var rotationMat;
        if (orientation.indexOf("deg") > 0) {
            rotationMat = "rotateZ("+ parseFloat(orientation) +"deg)";
        } else {
            if (orientation == "center") {
                rotationMat = "rotateZ(" + angle + "deg)";
            } else if (orientation == "counter-center") {
                rotationMat = "rotateZ(" + (angle+180) + "deg)";
            }
        }
        return rotationMat;
    },
    getAnchor = function(valueString, containingBlockSize, elementSize, polarAngle, polarDistance) {
        var anchorPoint = {};

        // options in polar-distance: center | fit
        switch (valueString) {
            case "center":
                anchorPoint.x = elementSize.width/2;
                anchorPoint.y = elementSize.height/2;
                anchorPoint.dist = polarDistance;
                break;
            case "fit":
                anchorPoint.x = elementSize.width/2;
                anchorPoint.y = elementSize.height/2;
                anchorPoint.dist = polarDistance - elementSize.height/2;
                break;
            default:
                anchorPoint.x = elementSize.width/2;
                anchorPoint.y = elementSize.height/2;
                anchorPoint.dist = polarDistance;
                break;
        }

        var point = {
            x: Math.sin(Math.PI / 180 * polarAngle) * anchorPoint.dist + (containingBlockSize.width / 2) - anchorPoint.x,
            y: -Math.cos(Math.PI / 180 * polarAngle) * anchorPoint.dist + (containingBlockSize.height / 2) - anchorPoint.y
        };

        return point;
    },
    clipElement = function(containingBlock, diameter, polarElement, size, polarAngle, polarDistance, polarOrientation) {
        var clipWidth = size.height * size.width / (2 * polarDistance + size.height);
        var clipDeg = clipWidth / size.width * 100;

        if (polarOrientation == "center") {
            polarElement.style.webkitClipPath = "polygon(0% 0%, 100% 0%, "+(100-clipDeg)+"% 100%, "+clipDeg+"% 100%)";
            polarElement.style.clipPath = "polygon(0% 0%, 100% 0%, "+(100-clipDeg)+"% 100%, "+clipDeg+"% 100%)";
        } else if (polarOrientation == "counter-center") {
            polarElement.style.webkitClipPath = "polygon(50% 20%, 75% 15%, 88% 10%, 100% 100%, 0 100%, 12% 10%, 25% 15%)";			
        }
    },
    init = function() {
        var polarOrientation = jRound.getSelectors("polar-orientation", "*");
        for (var i = 0; i < polarOrientation.length; i++) {
            if (document.querySelector(polarOrientation[i].selector)) {
                document.querySelector(polarOrientation[i].selector).dataset.polarOrientation = polarOrientation[i].value;
            }
        }
        var polarDistance = jRound.getSelectors("polar-distance", "*");
        for (var i = 0; i < polarDistance.length; i++) {
            if (document.querySelector(polarDistance[i].selector))
                document.querySelector(polarDistance[i].selector).dataset.polarDistance = polarDistance[i].value;
        }
        var polarAngle = jRound.getSelectors("polar-angle", "*");
        for (var i = 0; i < polarAngle.length; i++) {
            if (document.querySelector(polarAngle[i].selector))
                document.querySelector(polarAngle[i].selector).dataset.polarAngle = polarAngle[i].value;
        }
        var idList = jRound.getSelectors("position", "polar");
        for (var i = 0; i < idList.length; i++) {
            if (document.querySelector(idList[i].selector)) {
                drawPolar(idList[i].selector);
            }
        }
    };
    window.addEventListener("load", function() {
        if (typeof w.jRound === "undefined") {
            w.jRound = {};
        }
        jRound = w.jRound;
        jRound.initBorderBoundary = init;

        init();
    });
})(this);