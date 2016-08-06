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
				var polarDistance = polarElement.dataset.polarDistance;
				if (polarDistance == undefined)
					polarDistance = "0px";
				var polarAngle = polarElement.dataset.polarAngle;
				if (polarAngle == undefined)
					polarAngle = "0deg";
				var polarAnchor = polarElement.dataset.polarAnchor;
				if (polarAnchor == undefined)
					polarAnchor = "center";
				var polarOrientation = polarElement.dataset.polarOrientation;
				if (polarOrientation == undefined)
					polarOrientation = "0deg";
					
				var center = polarElement.dataset.center;
				if (center == undefined)
					center = "center";

				console.log("distance: " + polarDistance);
				console.log("angle: " + polarAngle);
				console.log("anchor: " + polarAnchor);

				polarAngle = parseFloat(polarAngle);

				if (polarDistance.indexOf("%") > 0) {
					polarDistance = (containingBlockSize.width / 2) * (parseFloat(polarDistance) / 100.0);
				} else { // if (polarDistance.indexOf("px") > 0) {
					polarDistance = parseFloat(polarDistance);
				}

				var anchorPoint = getAnchorPoint(polarAnchor, containingBlockSize, polarElementSize, polarAngle, polarDistance);

				console.log("x: " + anchorPoint.x + " y: " + anchorPoint.y);
				
				var translate3d = "translate3d(" + anchorPoint.x + "px, " + anchorPoint.y + "px, 0px)";

				if (polarOrientation.indexOf("deg") > 0) {
					translate3d = translate3d + "rotateZ("+ parseFloat(polarOrientation) +"deg)";
				} else {
					if (polarOrientation == "center") {
						translate3d = translate3d + "rotateZ(" + polarAngle + "deg)";
					} else if (polarOrientation == "counter-center") {
						translate3d = translate3d + "rotateZ(" + (polarAngle+180) + "deg)";
					}
				}
								
				polarElement.style.transform = translate3d;
			}
		}
    },
	isNumberType = function(value) {
		if (value.indexOf("%") > 0) {
			return "%";
		} else if (value.indexOf("px") > 0) {
			return "px";
		} else {
			return false;
		}
	},
	calculateAnchorPoint = function(parameter, elementSize, anchorPoint){
		if (parameter == "center") {
			anchorPoint.x = elementSize.width/2;
			anchorPoint.y = elementSize.height/2;
		} else if (parameter == "top") {
			anchorPoint.x = elementSize.width/2;
			anchorPoint.y = 0;
		} else if (parameter == "bottom") {
			anchorPoint.x = elementSize.width/2;
			anchorPoint.y = elementSize.height;
		} else if (parameter == "left") {
			anchorPoint.x = 0;
			anchorPoint.y = elementSize.height/2;
		} else if (parameter == "right") {
			anchorPoint.x = elementSize.width;
			anchorPoint.y = elementSize.height/2;
		} else {
			if (parameter.indexOf("%") > 0) {
				anchorPoint.x = elementSize.width * (parseFloat(parameter) / 100.0);
				anchorPoint.y = elementSize.height * (parseFloat(parameter) / 100.0);
			} else if (parameter.indexOf("px") > 0) {
				anchorPoint.x = parseFloat(parameter);
				anchorPoint.y = parseFloat(parameter);
			}
		}
	},
	calculateAnchorPointX = function(edge, value, elementSize, anchorPoint){
		if (edge == "center") {
			anchorPoint.x = elementSize.width/2;
		} else if (edge == "left") {
			if (value.indexOf("%") > 0) {
				anchorPoint.x = elementSize.width * (parseFloat(value) / 100.0);
			} else if (value.indexOf("px") > 0) {
				anchorPoint.x = parseFloat(value);
			}
		} else if (edge == "right") {
			if (value.indexOf("%") > 0) {
				anchorPoint.x = elementSize.width * (1 - (parseFloat(value) / 100.0));
			} else if (value.indexOf("px") > 0) {
				anchorPoint.x = elementSize.width - parseFloat(value);
			}
		}
	},
	calculateAnchorPointY = function(edge, value, elementSize, anchorPoint){
		if (edge == "center") {
			anchorPoint.y = elementSize.height/2;
		} else if (edge == "top") {
			if (value.indexOf("%") > 0) {
				anchorPoint.y = elementSize.height * (parseFloat(value) / 100.0);
			} else if (value.indexOf("px") > 0) {
				anchorPoint.y = parseFloat(value);
			}
		} else if (edge == "bottom") {
			if (value.indexOf("%") > 0) {
				anchorPoint.y = elementSize.height * (1 - (parseFloat(value) / 100.0));
			} else if (value.indexOf("px") > 0) {
				anchorPoint.y = elementSize.height - parseFloat(value);
			}
		}
	},
	getAnchorPoint = function(valueString, containingBlockSize, elementSize, polarAngle, polarDistance) {
		var valueList = valueString.split(' ');

		var anchorPoint = {};

		// Reference from 'background-position'
        switch (valueList.length) {
            case 0:
                calculateAnchorPoint("center", elementSize, anchorPoint);
                break;
            case 1:
				calculateAnchorPoint(valueList[0], elementSize, anchorPoint);
                break;
            case 2:
				if ((valueList[0].indexOf("%") > 0) || (valueList[0].indexOf("px") > 0)) {
					if ((valueList[1].indexOf("%") > 0) || (valueList[1].indexOf("px") > 0)) {
						calculateAnchorPointX("left", valueList[0], elementSize, anchorPoint);
						calculateAnchorPointY("top", valueList[1], elementSize, anchorPoint);
					} else {
						calculateAnchorPointX("left", valueList[0], elementSize, anchorPoint);
						calculateAnchorPointY(valueList[1], "0%", elementSize, anchorPoint);
					}					
				} else {
					if ((valueList[1].indexOf("%") > 0) || (valueList[1].indexOf("px") > 0)) {
						calculateAnchorPointX(valueList[0], valueList[1], elementSize, anchorPoint);
						calculateAnchorPointY("center", "0%", elementSize, anchorPoint);
					} else {
						calculateAnchorPointX(valueList[0], "0%", elementSize, anchorPoint);
						calculateAnchorPointY(valueList[1], "0%", elementSize, anchorPoint);
					}
				}
                break;
            case 3:
				if ((valueList[0].indexOf("%") > 0) || (valueList[0].indexOf("px") > 0)) {
					calculateAnchorPointX("left", valueList[0], elementSize, anchorPoint);
					calculateAnchorPointY(valueList[1], valueList[2], elementSize, anchorPoint);
				} else {
					if ((valueList[1].indexOf("%") > 0) || (valueList[1].indexOf("px") > 0)) {
						calculateAnchorPointX(valueList[0], valueList[1], elementSize, anchorPoint);
						if ((valueList[2].indexOf("%") > 0) || (valueList[2].indexOf("px") > 0)) {
							calculateAnchorPointY("top", valueList[2], elementSize, anchorPoint);
						} else {
							calculateAnchorPointY(valueList[2], "0%", elementSize, anchorPoint);
						}
					} else {
						calculateAnchorPointX(valueList[0], "0%", elementSize, anchorPoint);
						calculateAnchorPointY(valueList[1], valueList[2], elementSize, anchorPoint);
					}
				}
                break;
			case 4:
				//for the horizontal value
				calculateAnchorPointX(valueList[0], valueList[1], elementSize, anchorPoint);

				//for the vertical value
				calculateAnchorPointY(valueList[2], valueList[3], elementSize, anchorPoint);

                break;
        }

		var point = {
			x: Math.sin(Math.PI / 180 * polarAngle) * polarDistance + (containingBlockSize.width / 2) - anchorPoint.x,
			y: -Math.cos(Math.PI / 180 * polarAngle) * polarDistance + (containingBlockSize.height / 2) - anchorPoint.y
		};

		return point;
    },
    init = function() {
		var center = jRound.getSelectors("center", "*");
        for (var i = 0; i < center.length; i++) {
            if (document.querySelector(center[i].selector)) {
                document.querySelector(center[i].selector).dataset.center = center[i].value;
			}
        } 
		
		var polarOrientation = jRound.getSelectors("polar-orientation", "*");
        for (var i = 0; i < polarOrientation.length; i++) {
            if (document.querySelector(polarOrientation[i].selector)) {
                document.querySelector(polarOrientation[i].selector).dataset.polarOrientation = polarOrientation[i].value;
			}
        }
	
		var polarAnchor = jRound.getSelectors("polar-anchor", "*");
        for (var i = 0; i < polarAnchor.length; i++) {
            if (document.querySelector(polarAnchor[i].selector)) {
                document.querySelector(polarAnchor[i].selector).dataset.polarAnchor = polarAnchor[i].value;
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