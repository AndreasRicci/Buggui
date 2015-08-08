'use strict';

// Returns a regular expression which will match against 1 or more occurrences of a class name
function classMatchingRegex(className) {
    return new RegExp("\\b" + className + "\\b");
}

// Returns true iff the specified element has the specified class name
function hasClass(element, className) {
    return classMatchingRegex(className).test(element.className);
}

// Adds the specified class to the specified element, if the element does not already have the class
function addClass(element, className) {
    if (hasClass(element, className)) return; // Element already has the class - so do not add it
    element.className = element.className === "" ? className : element.className + " " + className;
}

// Removes the specified class from the specified element
function removeClass(element, className) {
    if (!hasClass(element, className)) return; // Element already does not have this class - so nothing to remove
    element.className = element.className.replace(classMatchingRegex(className), "").trim();
}

function removeElement(element) {
    element.parentNode.removeChild(element);
}

function prependChild(child, to) {
    to.insertBefore(child, to.firstChild);
}

function insertBeforeLastChild(child, to) {
    to.insertBefore(child, to.children[to.children.length - 1]);
}

/**
 * From: http://stackoverflow.com/questions/1527803/generating-random-numbers-in-javascript-in-a-specific-range
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var canvasDraw = {
    defaultFillColour: 'black',
    defaultBorderColour: 'black',
    defaultThickness: 0,

    line: function (canvasContext, fromX, fromY, toX, toY, colour, thickness, lineCap) {
        colour = typeof colour !== 'undefined' ? colour : this.defaultBorderColour;
        thickness = typeof thickness !== 'undefined' ? thickness : 4;
        lineCap = typeof lineCap !== 'undefined' ? lineCap : "square";

        canvasContext.save();
        canvasContext.strokeStyle = colour;
        canvasContext.lineWidth = thickness;
        canvasContext.lineCap = lineCap;
        canvasContext.beginPath();
        canvasContext.moveTo(fromX, fromY);
        canvasContext.lineTo(toX, toY);
        canvasContext.closePath();
        canvasContext.stroke();
        canvasContext.restore();
    },

    rectangle: function (canvasContext, centerX, centerY, width, height, fillColour, borderColour, borderThickness) {
        fillColour = typeof fillColour !== 'undefined' ? fillColour : this.defaultFillColour;
        borderColour = typeof borderColour !== 'undefined' ? borderColour : this.defaultBorderColour;
        borderThickness = typeof borderThickness !== 'undefined' ? borderThickness : this.defaultThickness;

        canvasContext.save();
        canvasContext.fillStyle = fillColour;
        canvasContext.strokeStyle = borderColour;
        canvasContext.lineWidth = borderThickness;
        canvasContext.beginPath();
        canvasContext.rect(centerX - width / 2, centerY - height / 2, width, height);
        canvasContext.closePath();
        canvasContext.fill();
        //canvasContext.stroke();
        canvasContext.restore();
    },

    circle: function (canvasContext, centerX, centerY, radius, fillColour, borderColour, borderThickness, startAngle) {
        fillColour = typeof fillColour !== 'undefined' ? fillColour : this.defaultFillColour;
        borderColour = typeof borderColour !== 'undefined' ? borderColour : this.defaultBorderColour;
        borderThickness = typeof borderThickness !== 'undefined' ? borderThickness : this.defaultThickness;
        startAngle = typeof startAngle !== 'undefined' ? startAngle : 2 * Math.PI;

        canvasContext.save();
        canvasContext.fillStyle = fillColour;
        canvasContext.strokeStyle = borderColour;
        canvasContext.lineWidth = borderThickness;
        canvasContext.beginPath();
        canvasContext.arc(centerX, centerY, radius, startAngle, 0, false);
        canvasContext.closePath();
        canvasContext.fill();
        //canvasContext.stroke();
        canvasContext.restore();
    },

    semicircle: function (canvasContext, centerX, centerY, radius, fillColour, borderColour, borderThickness) {
        this.circle(canvasContext, centerX, centerY, radius, fillColour, borderColour, borderThickness, Math.PI);
    }
};
