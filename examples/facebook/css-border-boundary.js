/* jRound v0.1.2: border-boundary polyfill
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
    var paintBorderLine = function(context, x, y, radius, startAngle, endAngle, thickness, style, color) {
        context.beginPath();
        context.strokeStyle = color;
        context.lineWidth = thickness;
        if (style == "none" || style == "hidden") {
            context.setLineDash();
        } else if (style == "dashed") {
            context.setLineDash([13, 12]);
        } else if (style == "dotted") {
            context.setLineDash([4, 5]);
        } else {
            context.setLineDash([0, 0]);
        }
        // apply the real coordinates by multiplying -1
        context.arc(x, y, radius, -1 * startAngle, -1 * endAngle, true);
        context.stroke();
    },
    composition = function(context, x, y, radius, pointList) {
        var startAngle, endAngle, thickness, style, color, middleAngle, contactPointX, contactPointY;
        // Draw arcs using points
        for (var i = 0; i < pointList.length; i++) {
            var points = pointList[i];
            for (var j = 0; j < points.length; j++) {
                startAngle = points[j].theta;
                endAngle = points[(j + 1) % points.length].theta;
                thickness = parseFloat(points[j].bWidth);
                style = points[j].bStyle;
                color = points[j].bColor;

                // check, if the arc is valid
                if (startAngle <= endAngle) {
                    middleAngle = ((startAngle + endAngle) / 2) % (2 * Math.PI);
                } else {
                    middleAngle = ((startAngle + (endAngle + 2 * Math.PI)) / 2) % (2 * Math.PI);
                }
                contactPointX = radius * Math.cos(middleAngle) + jRound.screen.radius[0];
                contactPointY = radius * Math.sin(middleAngle) - jRound.screen.radius[0];
                if (contactPointX >= points[j].figure.x1 && contactPointX <= points[j].figure.x2 &&
                    contactPointY <= points[j].figure.y1 && contactPointY >= points[j].figure.y2) {
                    paintBorderLine(context, x, y, radius, startAngle, endAngle, thickness, style, color);
                }
            }
        }
    },
    // With a tree traversal, get elements that have a valid border property
    getTargetElement = function(idList) {
        var result = [];
        var list = [];
        for (var i = 0; i < idList.length; i++) {
            var element = document.querySelector(idList[i].selector);
            list.push(element);
        }
        var ELEMENT_TYPE = 1,
            ATTRIBUTE_TYPE = 2,
            TEXT_TYPE = 3,
            COMMENT_TYPE = 8;

        var recGetTargetElement = function(element) {
            if (element.nodeType != ELEMENT_TYPE)
                return;
            var border = window.getComputedStyle(element, null).getPropertyValue("border");
            if (border !== null && border.charAt(0) !== "0") {
                // FIXME: result duplicate processing
                result.push({
                    id: element.id,
                    bWidth: window.getComputedStyle(element, null).getPropertyValue("border-width"),
                    bColor: window.getComputedStyle(element, null).getPropertyValue("border-color"),
                    bStyle: window.getComputedStyle(element, null).getPropertyValue("border-style")
                });
            }
            for (var j = 0; j < element.childNodes.length; j++) {
                var node = element.childNodes[j];
                recGetTargetElement(node);
            }
        }
        for (var i = 0; i < list.length; i++) {
            recGetTargetElement(list[i]);
        }
        return result;
    },
    eliminateBorderLine = function(element, n) {
        switch (n) {
            case 0:
                element.style.borderTopColor = "rgba(0,0,0,0)";
                break;
            case 1:
                element.style.borderRightColor = "rgba(0,0,0,0)";
                break;
            case 2:
                element.style.borderBottomColor = "rgba(0,0,0,0)";
                break;
            case 3:
                element.style.borderLeftColor = "rgba(0,0,0,0)";
                break;
        }
    },
    // With a element id, get points of contact between target element and display edge
    getDrawBorderInfo = function(list, origin_x, origin_y) {
        var pointList = [];
        // Iterator for each elements
        for (var i = 0; i < list.length; i++) {
            var element = document.querySelector("#" + list[i].id),
                points = [],
                // Get edges info by starting at a top line and clockwise traversal
                edge_top = {
                    equation: "y",
                    value: element.offsetTop * -1,
                    beginX: element.offsetLeft,
                    endX: element.offsetLeft + element.offsetWidth
                },
                edge_right = {
                    equation: "x",
                    value: element.offsetLeft + element.offsetWidth,
                    beginY: element.offsetTop * -1,
                    endY: (element.offsetTop + element.offsetHeight) * -1
                },
                edge_bottom = {
                    equation: "y",
                    value: (element.offsetTop + element.offsetHeight) * -1,
                    beginX: element.offsetLeft,
                    endX: element.offsetLeft + element.offsetWidth
                },
                edge_left = {
                    equation: "x",
                    value: element.offsetLeft,
                    beginY: element.offsetTop * -1,
                    endY: (element.offsetTop + element.offsetHeight) * -1
                },
                edges = new Array(edge_top, edge_right, edge_bottom, edge_left),
                figure = {
                    x1: edge_top.beginX,
                    x2: edge_top.endX,
                    y1: edge_right.beginY,
                    y2: edge_right.endY
                };

            // Get edges of each elements
            for (var j = 0; j < edges.length; j++) {
                console.log("[" + j + "] " + edges[j].equation + " = " + edges[j].value);
                if (edges[j].equation == "y") {
                    var y = edges[j].value;
                    var x1 = Math.sqrt(Math.pow(jRound.screen.radius[0], 2) - Math.pow(y + jRound.screen.width / 2, 2)) + jRound.screen.width / 2;
                    var x2 = -1 * Math.sqrt(Math.pow(jRound.screen.radius[0], 2) - Math.pow(y + jRound.screen.width / 2, 2)) + jRound.screen.width / 2;
                    if (!!x1 && x1 >= edges[j].beginX && x1 <= edges[j].endX && !!x2 && x2 >= edges[j].beginX && x2 <= edges[j].endX) {
                        if (x1 == x2) {
                            if (y > origin_y) {
                                theta1 = Math.acos((x1 - origin_x) / jRound.screen.radius[0]);
                            } else {
                                theta1 = (2 * Math.PI) - Math.acos((x1 - origin_x) / jRound.screen.radius[0]);
                            }
                            points.push({
                                x: x1,
                                y: y,
                                theta: theta1,
                                bWidth: list[i].bWidth,
                                bColor: list[i].bColor,
                                bStyle: list[i].bStyle,
                                figure: figure
                            });
                            eliminateBorderLine(element, j);
                        } else {
                            if (y > origin_y) {
                                theta1 = Math.acos((x1 - origin_x) / jRound.screen.radius[0]);
                                theta2 = Math.acos((x2 - origin_x) / jRound.screen.radius[0]);
                            } else {
                                theta1 = (2 * Math.PI) - Math.acos((x1 - origin_x) / jRound.screen.radius[0]);
                                theta2 = (2 * Math.PI) - Math.acos((x2 - origin_x) / jRound.screen.radius[0]);
                            }
                            points.push({
                                x: x1,
                                y: y,
                                theta: theta1,
                                bWidth: list[i].bWidth,
                                bColor: list[i].bColor,
                                bStyle: list[i].bStyle,
                                figure: figure
                            });
                            points.push({
                                x: x2,
                                y: y,
                                theta: theta2,
                                bWidth: list[i].bWidth,
                                bColor: list[i].bColor,
                                bStyle: list[i].bStyle,
                                figure: figure
                            });
                        }
                    } else {
                        eliminateBorderLine(element, j);
                    }
                    console.log("x: " + x1 + ", " + x2);
                } else if (edges[j].equation == "x") {
                    var x = edges[j].value;
                    var y1 = Math.sqrt(Math.pow(jRound.screen.radius[0], 2) - Math.pow(x - jRound.screen.height / 2, 2)) - jRound.screen.height;
                    var y2 = -1 * Math.sqrt(Math.pow(jRound.screen.radius[0], 2) - Math.pow(x - jRound.screen.height, 2)) - jRound.screen.height;
                    if (!!y1 && y1 <= edges[j].beginY && y1 >= edges[j].endY && !!y2 && y2 <= edges[j].beginY && y2 >= edges[j].endY) {
                        var theta1 = 0,
                            theta2 = 0;
                        if (y1 == y2) {
                            if (y1 > origin_y) {
                                theta1 = Math.acos((x - origin_x) / jRound.screen.radius[0]);
                            } else {
                                theta1 = (2 * Math.PI) - Math.acos((x - origin_x) / jRound.screen.radius[0]);
                            }
                            points.push({
                                x: x,
                                y: y1,
                                theta: theta1,
                                bWidth: list[i].bWidth,
                                bColor: list[i].bColor,
                                bStyle: list[i].bStyle,
                                figure: figure
                            });
                            eliminateBorderLine(element, j);
                        } else {
                            if (y1 > origin_y) {
                                theta1 = Math.acos(x - origin_x / jRound.screen.radius[0]);
                            } else {
                                theta1 = (2 * Math.PI) - Math.acos((x - origin_x) / jRound.screen.radius[0]);
                            }
                            if (y2 > origin_y) {
                                theta2 = Math.acos(x - origin_x / jRound.screen.radius[0]);
                            } else {
                                theta2 = (2 * Math.PI) - Math.acos((x - origin_x) / jRound.screen.radius[0]);
                            }
                            points.push({
                                x: x,
                                y: y1,
                                theta: theta1,
                                bWidth: list[i].bWidth,
                                bColor: list[i].bColor,
                                bStyle: list[i].bStyle,
                                figure: figure
                            });
                            points.push({
                                x: x,
                                y: y2,
                                theta: theta2,
                                bWidth: list[i].bWidth,
                                bColor: list[i].bColor,
                                bStyle: list[i].bStyle,
                                figure: figure
                            });
                        }
                    } else {
                        eliminateBorderLine(element, j);
                    }
                    console.log("y: " + y1 + ", " + y2);
                }
            }
            // sort a points according to theta values
            points.sort(function(a, b) {
                if (a.theta > b.theta)
                    return 1;
                else if (a.theta < b.theta)
                    return -1;
                else
                    return 0;
            });
            // FIXME: pointList duplicate processing
            pointList.push(points);
        }
        return pointList;
    },
    init = function() {
        // Get Screen Info
        var origin_x = jRound.screen.width / 2;
        var origin_y = jRound.screen.height / 2 * -1;

        // [Step 1] Get Stylesheets from link tag
        var selectorIdList = jRound.getSelectors("border-boundary", "display");

        // [Step 2] Selection of target elements with valid border property
        var targetElementIdList = getTargetElement(selectorIdList);
        console.log("Target Elements: " + targetElementIdList);

        // [Step 3] Get two points of contact between target element and display edge
        console.log("DrawBorder Info: ");
        var drawBorderInfoList = getDrawBorderInfo(targetElementIdList, origin_x, origin_y);

        // [Step 4] Paint a arcs using drawBorderInfoList(point1, point2, border_width, border_color, border_style);
        document.querySelector("#container").innerHTML += '<canvas id="myCanvas" width="' + (jRound.screen.width + 3) +
            'px" height="' + (jRound.screen.height + 3) + 'px"></canvas>';
        var canvas = document.getElementById('myCanvas');
        var context = canvas.getContext('2d');
        var x = jRound.screen.width / 2;
        var y = jRound.screen.height / 2;
        var radius = jRound.screen.radius[0];
        composition(context, x, y, radius, drawBorderInfoList);
    };
    window.addEventListener("load", function() {
        if (typeof w.jRound === "undefined") {
            w.jRound = {};
        }
        jRound = w.jRound;
        jRound.initBorderBoundary = init;
        jRound.screen = {
            "width": 600,
            "height": 600,
            "radius": [300, 300],
        };
        init();
    });
})(this);