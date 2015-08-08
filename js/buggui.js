'use strict';

// Main entry point for the app

window.addEventListener('load', function () {
    var sceneGraphModule = createSceneGraphModule();
    var appContainer = document.getElementById('app-container');

    var canvas = appContainer.querySelector("#scene-graph-canvas"); // Canvas to draw in
    var ctx = canvas.getContext("2d"); // Canvas context

    var scene = new sceneGraphModule.SceneNode();
    var car = new sceneGraphModule.CarNode();
    scene.addChild(car);

    var carBodyAndChasis = new sceneGraphModule.CarBodyAndChasisNode();
    car.addChild(carBodyAndChasis);

    var frontAxle = new sceneGraphModule.AxleNode(sceneGraphModule.FRONT_AXLE_PART);
    var backAxle = new sceneGraphModule.AxleNode(sceneGraphModule.BACK_AXLE_PART);
    carBodyAndChasis.addChild(frontAxle);
    carBodyAndChasis.addChild(backAxle);

    var frontLeftWheel = new sceneGraphModule.WheelNode(sceneGraphModule.FRONT_LEFT_WHEEL_PART);
    var frontRightWheel = new sceneGraphModule.WheelNode(sceneGraphModule.FRONT_RIGHT_WHEEL_PART);
    var backLeftWheel = new sceneGraphModule.WheelNode(sceneGraphModule.BACK_LEFT_WHEEL_PART);
    var backRightWheel = new sceneGraphModule.WheelNode(sceneGraphModule.BACK_RIGHT_WHEEL_PART);
    var frontLeftTire = new sceneGraphModule.TireNode(sceneGraphModule.FRONT_LEFT_TIRE_PART);
    var frontRightTire = new sceneGraphModule.TireNode(sceneGraphModule.FRONT_RIGHT_TIRE_PART);
    var backLeftTire = new sceneGraphModule.TireNode(sceneGraphModule.BACK_LEFT_TIRE_PART);
    var backRightTire = new sceneGraphModule.TireNode(sceneGraphModule.BACK_RIGHT_TIRE_PART);
    var frontLeftTireTop = new sceneGraphModule.TireTopNode(sceneGraphModule.FRONT_LEFT_TIRE_TOP_PART);
    var frontRightTireTop = new sceneGraphModule.TireTopNode(sceneGraphModule.FRONT_RIGHT_TIRE_TOP_PART);
    var backLeftTireTop = new sceneGraphModule.TireTopNode(sceneGraphModule.BACK_LEFT_TIRE_TOP_PART);
    var backRightTireTop = new sceneGraphModule.TireTopNode(sceneGraphModule.BACK_RIGHT_TIRE_TOP_PART);

    frontLeftWheel.addChild(frontLeftTire);
    frontRightWheel.addChild(frontRightTire);
    backLeftWheel.addChild(backLeftTire);
    backRightWheel.addChild(backRightTire);
    frontLeftTire.addChild(frontLeftTireTop);
    frontRightTire.addChild(frontRightTireTop);
    backLeftTire.addChild(backLeftTireTop);
    backRightTire.addChild(backRightTireTop);
    frontAxle.addChild(frontLeftWheel);
    frontAxle.addChild(frontRightWheel);
    backAxle.addChild(backLeftWheel);
    backAxle.addChild(backRightWheel);

    var carBody = new sceneGraphModule.CarBodyNode();
    carBodyAndChasis.addChild(carBody);

    var frontBumper = new sceneGraphModule.BumperNode(sceneGraphModule.FRONT_BUMPER_PART);
    var backBumper = new sceneGraphModule.BumperNode(sceneGraphModule.BACK_BUMPER_PART);
    var leftBumper = new sceneGraphModule.BumperNode(sceneGraphModule.LEFT_BUMPER_PART);
    var rightBumper = new sceneGraphModule.BumperNode(sceneGraphModule.RIGHT_BUMPER_PART);
    carBody.addChild(frontBumper);
    carBody.addChild(backBumper);
    carBody.addChild(leftBumper);
    carBody.addChild(rightBumper);

    var headlights = new sceneGraphModule.HeadlightsNode();
    frontBumper.addChild(headlights);

    var mainFrontPart = new sceneGraphModule.MainNode(sceneGraphModule.MAIN_FRONT_PART);
    var mainBackPart = new sceneGraphModule.MainNode(sceneGraphModule.MAIN_BACK_PART);
    var translatePart = new sceneGraphModule.TranslateNode();
    carBody.addChild(mainFrontPart);
    carBody.addChild(mainBackPart);
    carBody.addChild(translatePart);

    scene.render(ctx);

    // Helper functions for actual transformations
    var scaleXTo = function (newVal) {
        var computedWidth = sceneGraphModule.CAR_BODY_WIDTH * newVal;
        if (computedWidth < sceneGraphModule.MIN_CAR_BODY_WIDTH || computedWidth > sceneGraphModule.MAX_CAR_BODY_WIDTH) {
            return;
        }
        carBody.objectTransform.setToScale(newVal, sceneGraphModule.getCarScaleY());
        sceneGraphModule.setCarScaleX(newVal);
        scene.render(ctx);
    };
    var scaleYTo = function (newVal) {
        var computedHeight = sceneGraphModule.CAR_BODY_HEIGHT * newVal;
        if (computedHeight < sceneGraphModule.MIN_CAR_BODY_HEIGHT || computedHeight > sceneGraphModule.MAX_CAR_BODY_HEIGHT) {
            return;
        }
        carBody.objectTransform.setToScale(sceneGraphModule.getCarScaleX(), newVal);
        sceneGraphModule.setCarScaleY(newVal);
        scene.render(ctx);
    };
    var carRotation = 0;
    var rotateTo = function (newVal) {
        carRotation = newVal;

        // Clamp rotation
        while (carRotation > 360) {
            carRotation -= 360;
        }
        while (carRotation < 0) {
            carRotation += 360;
        }

        carBodyAndChasis.objectTransform.setToRotation(carRotation * Math.PI / 180, 0, 0);
        scene.render(ctx);
    };
    var translateXBy = function (newVal) {
        car.objectTransform.translate(newVal, 0);
        scene.render(ctx);
    };
    var translateYBy = function (newVal) {
        car.objectTransform.translate(0, newVal);
        scene.render(ctx);
    };
    var translateToOrigin = function () {
        car.objectTransform.setToTranslation(0, 0);
        scene.render(ctx);
    };
    var changeAxleWidthTo = function (newVal) {
        if (newVal < sceneGraphModule.MIN_AXLE_WIDTH || newVal > sceneGraphModule.MAX_AXLE_WIDTH) {
            return;
        }
        sceneGraphModule.setAxleWidth(newVal);
        scene.render(ctx);
    };
    var rotateTiresTo = function (newVal) {
        if (newVal < sceneGraphModule.MIN_TIRE_ANGLE || newVal > sceneGraphModule.MAX_TIRE_ANGLE) {
            return;
        }
        var rads = newVal * Math.PI / 180;
        frontLeftTire.objectTransform.setToRotation(rads, 0, 0);
        frontRightTire.objectTransform.setToRotation(rads, 0, 0);
        scene.render(ctx);
    };

    // Reset button
    var reset = function () {
        scaleXTo(1);
        scaleYTo(1);
        rotateTo(0);
        translateToOrigin();
        changeAxleWidthTo(sceneGraphModule.DEFAULT_AXLE_WIDTH);
        rotateTiresTo(0);
    };
    var resetBtn = appContainer.querySelector(".reset-button");
    resetBtn.addEventListener("click", reset);

    // Randomize button
    var random = function () {
        reset();

        scaleXTo(getRandomInt(
            sceneGraphModule.MIN_CAR_BODY_WIDTH / sceneGraphModule.CAR_BODY_WIDTH,
            sceneGraphModule.MAX_CAR_BODY_WIDTH / sceneGraphModule.CAR_BODY_WIDTH));
        scaleYTo(getRandomInt(
            sceneGraphModule.MIN_CAR_BODY_HEIGHT / sceneGraphModule.CAR_BODY_HEIGHT,
            sceneGraphModule.MAX_CAR_BODY_HEIGHT / sceneGraphModule.CAR_BODY_HEIGHT));
        rotateTo(getRandomInt(-180, 180));
        changeAxleWidthTo(getRandomInt(sceneGraphModule.MIN_AXLE_WIDTH, sceneGraphModule.MAX_AXLE_WIDTH));
        rotateTiresTo(getRandomInt(sceneGraphModule.MIN_TIRE_ANGLE, sceneGraphModule.MAX_TIRE_ANGLE));
    };
    var randomBtn = appContainer.querySelector(".random-button");
    randomBtn.addEventListener("click", random);

    // Get coord relative to canvas (thanks to: http://www.html5canvastutorials.com/advanced/html5-canvas-mouse-coordinates/)
    var getCanvasMousePosition = function (e) {
        var boundingRect = canvas.getBoundingClientRect();
        return {
            x: Math.round((e.clientX - boundingRect.left) / (boundingRect.right - boundingRect.left) * canvas.width),
            y: Math.round((e.clientY - boundingRect.top) / (boundingRect.bottom - boundingRect.top) * canvas.height)
        };
    };

    var getTransformFor = function (object) {
        var m = object.startPositionTransform.clone();
        m = m.concatenate(object.objectTransform.clone());
        return m;
    };

    var getTransformedPoint = function (p, transform) {
        var src = [p.x, p.y];
        var dst = [];
        transform.transform(src, 0, dst, 0, 1);

        return {
            x: dst[0],
            y: dst[1]
        }
    };

    var mouseInObject = function (e, object) {
        var p = getTransformedPoint(getCanvasMousePosition(e), object.hitInverse);
        return object.pointInObject(p);
    };

    // Hit inverses are used for hit detection
    var updateAllHitInverses = function (root, currentTransform) {
        var m = getTransformFor(root).clone();
        var currTransform = currentTransform.clone();
        currTransform.concatenate(m);

        root.hitInverse = currTransform.createInverse(); // Inverse used for hit detection

        _.each(
            _.values(root.children),
            function (child) {
                updateAllHitInverses(child, currTransform.clone());
            }
        );
    };

    var objectFocus = null; // To determine what we are dragging (if anything)
    var startP = {x: 0, y: 0}; // Starting point of the drag event
    var prevP = {x: 0, y: 0}; // Previous point in the dragging

    // Do any dragging-related things while moving the mouse
    var mousemoveListenerFn = function (e) {
        e.preventDefault();

        if (objectFocus == null) return;

        // First make sure all hit inverses for hit detection are fresh
        updateAllHitInverses(scene, new AffineTransform());

        // Get current mouse position
        var currP = getCanvasMousePosition(e);

        // This transform can be used to reverse rotation for calculations
        var rotate = (carBodyAndChasis.objectTransform.clone()).createInverse();

        // This transform can be used to calculate the center of the car
        var trans = car.hitInverse.createInverse();

        if (objectFocus == translatePart) {
            var diffX = currP.x - prevP.x;
            var diffY = currP.y - prevP.y;
            translateXBy(diffX);
            translateYBy(diffY);
        } else if (objectFocus == frontBumper) {
            var h = sceneGraphModule.CAR_BODY_HEIGHT * sceneGraphModule.getCarScaleY();

            var rotatedPrevP = getTransformedPoint(prevP, rotate);
            var rotatedCurrP = getTransformedPoint(currP, rotate);

            var diffY = rotatedPrevP.y - rotatedCurrP.y;
            var hNew = h + (diffY * 2);
            var scale = hNew / sceneGraphModule.CAR_BODY_HEIGHT;

            scaleYTo(scale);
        } else if (objectFocus == backBumper) {
            var h = sceneGraphModule.CAR_BODY_HEIGHT * sceneGraphModule.getCarScaleY();

            var rotatedPrevP = getTransformedPoint(prevP, rotate);
            var rotatedCurrP = getTransformedPoint(currP, rotate);

            var diffY = rotatedCurrP.y - rotatedPrevP.y;
            var hNew = h + (diffY * 2);
            var scale = hNew / sceneGraphModule.CAR_BODY_HEIGHT;

            scaleYTo(scale);
        } else if (objectFocus == rightBumper) {
            var w = sceneGraphModule.CAR_BODY_WIDTH * sceneGraphModule.getCarScaleX();

            var rotatedPrevP = getTransformedPoint(prevP, rotate);
            var rotatedCurrP = getTransformedPoint(currP, rotate);

            var diffX = rotatedCurrP.x - rotatedPrevP.x;
            var wNew = w + (diffX * 2);
            var scale = wNew / sceneGraphModule.CAR_BODY_WIDTH;

            scaleXTo(scale);
        } else if (objectFocus == leftBumper) {
            var w = sceneGraphModule.CAR_BODY_WIDTH * sceneGraphModule.getCarScaleX();

            var rotatedPrevP = getTransformedPoint(prevP, rotate);
            var rotatedCurrP = getTransformedPoint(currP, rotate);

            var diffX = rotatedPrevP.x - rotatedCurrP.x;
            var wNew = w + (diffX * 2);
            var scale = wNew / sceneGraphModule.CAR_BODY_WIDTH;

            scaleXTo(scale);
        } else if (objectFocus == mainFrontPart) { // Rotate towards
            var carCenterP = getTransformedPoint({x: 0, y: 0}, trans);
            var rotation = Math.atan2(currP.x - carCenterP.x, -(currP.y - carCenterP.y)) * (180 / Math.PI);
            rotateTo(rotation);
        } else if (objectFocus == mainBackPart) { // Rotate away from
            var carCenterP = getTransformedPoint({x: 0, y: 0}, trans);
            var rotation = Math.atan2(currP.x - carCenterP.x, -(currP.y - carCenterP.y)) * (180 / Math.PI) - 180;
            rotateTo(rotation);
        } else if (objectFocus == frontRightTireTop || objectFocus == frontLeftTireTop) { // Rotate to point where the mouse is
            var carCenterP = getTransformedPoint({x: 0, y: 0}, trans);
            var angle = (Math.atan2(currP.x - carCenterP.x, -(currP.y - carCenterP.y)) * (180 / Math.PI));
            if (angle < 0) {
                angle = 360 + angle;
            }
            var rotation = angle - carRotation;
            if (rotation < 0) {
                rotation = 360 + rotation;
            }

            if (rotation > 180) {
                rotation = rotation - 360;
            }
            rotateTiresTo(rotation);
        } else if (objectFocus == frontRightTire || objectFocus == backRightTire) {
            var rotatedPrevP = getTransformedPoint(prevP, rotate);
            var rotatedCurrP = getTransformedPoint(currP, rotate);

            var diffX = rotatedCurrP.x - rotatedPrevP.x;

            changeAxleWidthTo(sceneGraphModule.getAxleWidth() + diffX);
        } else if (objectFocus == frontLeftTire || objectFocus == backLeftTire) {
            var rotatedPrevP = getTransformedPoint(prevP, rotate);
            var rotatedCurrP = getTransformedPoint(currP, rotate);

            var diffX = rotatedPrevP.x - rotatedCurrP.x;

            changeAxleWidthTo(sceneGraphModule.getAxleWidth() + diffX);
        }

        // Set the previous mouse drag position to the current position for possible future use
        prevP = getCanvasMousePosition(e);
    };

    var mousedownListenerFn = function (e) {
        e.preventDefault();

        // First make sure all hit inverses for hit detection are fresh
        updateAllHitInverses(scene, new AffineTransform());

        startP = getCanvasMousePosition(e);
        prevP = getCanvasMousePosition(e);

        canvas.removeEventListener("mousedown", mousedownListenerFn);
        window.addEventListener("mouseup", mouseupListenerFn);

        window.addEventListener("mousemove", mousemoveListenerFn);

        styleCursor(e);

        if (mouseInObject(e, translatePart)) {
            objectFocus = translatePart;
            return;
        } else if (mouseInObject(e, frontBumper)) {
            objectFocus = frontBumper;
            return;
        } else if (mouseInObject(e, backBumper)) {
            objectFocus = backBumper;
            return;
        } else if (mouseInObject(e, rightBumper)) {
            objectFocus = rightBumper;
            return;
        } else if (mouseInObject(e, leftBumper)) {
            objectFocus = leftBumper;
            return;
        } else if (mouseInObject(e, mainFrontPart)) {
            objectFocus = mainFrontPart;
            return;
        } else if (mouseInObject(e, mainBackPart)) {
            objectFocus = mainBackPart;
            return;
        } else if (mouseInObject(e, frontRightTireTop)) {
            objectFocus = frontRightTireTop;
            return;
        } else if (mouseInObject(e, frontLeftTireTop)) {
            objectFocus = frontLeftTireTop;
            return;
        } else if (mouseInObject(e, frontRightTire)) {
            objectFocus = frontRightTire;
            return;
        } else if (mouseInObject(e, backRightTire)) {
            objectFocus = backRightTire;
            return;
        } else if (mouseInObject(e, frontLeftTire)) {
            objectFocus = frontLeftTire;
            return;
        } else if (mouseInObject(e, backLeftTire)) {
            objectFocus = backLeftTire;
            return;
        }

        // Nothing is being focused on - so disregard the event
        window.removeEventListener("mousemove", mousemoveListenerFn);
    };

    var mouseupListenerFn = function (e) {
        e.preventDefault();

        // First make sure all hit inverses for hit detection are fresh
        updateAllHitInverses(scene, new AffineTransform());

        // We no longer need to listen for any mouseup events (until there is another mousedown event)
        window.removeEventListener("mouseup", mouseupListenerFn);

        // Stop firing "pseudo-dragging" event
        if (objectFocus != null) {
            canvas.removeEventListener("mousemove", mousemoveListenerFn);
            objectFocus = null;
        }

        canvas.style.cursor = "default";

        // We again would like to listen for a mousedown even within the canvas
        canvas.addEventListener("mousedown", mousedownListenerFn);
    };

    // Add initial mousedown event
    canvas.addEventListener("mousedown", mousedownListenerFn);

    // Hover icon effect
    var styleCursor = function (e) {
        if (mouseInObject(e, translatePart)) {
            canvas.style.cursor = "move";
        } else if (mouseInObject(e, frontBumper)) {
            canvas.style.cursor = "ns-resize";
        } else if (mouseInObject(e, backBumper)) {
            canvas.style.cursor = "ns-resize";
        } else if (mouseInObject(e, rightBumper)) {
            canvas.style.cursor = "ew-resize";
        } else if (mouseInObject(e, leftBumper)) {
            canvas.style.cursor = "ew-resize";
        } else if (mouseInObject(e, mainFrontPart)) {
            canvas.style.cursor = "alias";
        } else if (mouseInObject(e, mainBackPart)) {
            canvas.style.cursor = "alias";
        } else if (mouseInObject(e, frontRightTireTop)) {
            canvas.style.cursor = "alias";
        } else if (mouseInObject(e, frontLeftTireTop)) {
            canvas.style.cursor = "alias";
        } else if (mouseInObject(e, frontRightTire)) {
            canvas.style.cursor = "ew-resize";
        } else if (mouseInObject(e, backRightTire)) {
            canvas.style.cursor = "ew-resize";
        } else if (mouseInObject(e, frontLeftTire)) {
            canvas.style.cursor = "ew-resize";
        } else if (mouseInObject(e, backLeftTire)) {
            canvas.style.cursor = "ew-resize";
        } else {
            canvas.style.cursor = "default";
        }
    };

    canvas.addEventListener("mousemove", function (e) {
        e.preventDefault();

        // Don't change the cursor while an action is taking place
        if (objectFocus != null) {
            return;
        }

        // First make sure all hit inverses for hit detection are fresh
        updateAllHitInverses(scene, new AffineTransform());

        styleCursor(e);
    });
});
