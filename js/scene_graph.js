'use strict';

/**
 * A function that creates and returns the scene graph classes and constants.
 */
function createSceneGraphModule() {

    var CANVAS_WIDTH = 800;
    var CANVAS_HEIGHT = 600;

    var MAX_CAR_BODY_WIDTH = 150;
    var MIN_CAR_BODY_WIDTH = 25;
    var MAX_CAR_BODY_HEIGHT = 200;
    var MIN_CAR_BODY_HEIGHT = 50;

    var CAR_BODY_WIDTH = (MAX_CAR_BODY_WIDTH + (2 * MIN_CAR_BODY_WIDTH)) / 2; // Default car body width
    var CAR_BODY_HEIGHT = (MAX_CAR_BODY_HEIGHT + (2 * MIN_CAR_BODY_HEIGHT)) / 2; // Default car body height
    var CAR_BUMPER_WIDTH = CAR_BODY_WIDTH; // Default car bumper width
    var CAR_BUMPER_HEIGHT = CAR_BODY_HEIGHT / 8; // Default car bumper height

    var CAR_MAIN_PART_WIDTH = CAR_BODY_WIDTH - (2 * CAR_BUMPER_HEIGHT);
    var CAR_MAIN_PART_HEIGHT = (CAR_BODY_HEIGHT - (2 * CAR_BUMPER_HEIGHT)) / 2;

    var WHEEL_WIDTH = 14;
    var WHEEL_HEIGHT = 20;

    var MAX_AXLE_WIDTH = 75;
    var MIN_AXLE_WIDTH = (WHEEL_WIDTH / 2) + 2;
    var AXLE_HEIGHT = 4;

    var MIN_TIRE_ANGLE = -45;
    var MAX_TIRE_ANGLE = 45;

    // Part names. Use these to name your different nodes
    var SCENE = 'SCENE'; // Not really a car part - just used to place the car in the scene (so the car can default to (0, 0) center)
    var CAR_PART = 'CAR_PART';
    var CAR_BODY_AND_CHASIS_PART = 'CAR_BODY_AND_CHASIS_PART';
    var CAR_BODY_PART = 'CAR_BODY_PART';
    var FRONT_AXLE_PART = 'FRONT_AXLE_PART';
    var BACK_AXLE_PART = 'BACK_AXLE_PART';
    var FRONT_LEFT_WHEEL_PART = 'FRONT_LEFT_WHEEL_PART';
    var FRONT_RIGHT_WHEEL_PART = 'FRONT_RIGHT_WHEEL_PART';
    var BACK_LEFT_WHEEL_PART = 'BACK_LEFT_WHEEL_PART';
    var BACK_RIGHT_WHEEL_PART = 'BACK_RIGHT_WHEEL_PART';
    var FRONT_LEFT_TIRE_PART = 'FRONT_LEFT_TIRE_PART';
    var FRONT_RIGHT_TIRE_PART = 'FRONT_RIGHT_TIRE_PART';
    var BACK_LEFT_TIRE_PART = 'BACK_LEFT_TIRE_PART';
    var BACK_RIGHT_TIRE_PART = 'BACK_RIGHT_TIRE_PART';
    var FRONT_LEFT_TIRE_TOP_PART = 'FRONT_LEFT_TIRE_TOP_PART';
    var FRONT_RIGHT_TIRE_TOP_PART = 'FRONT_RIGHT_TIRE_TOP_PART';
    var BACK_LEFT_TIRE_TOP_PART = 'BACK_LEFT_TIRE_TOP_PART';
    var BACK_RIGHT_TIRE_TOP_PART = 'BACK_RIGHT_TIRE_TOP_PART';
    var FRONT_BUMPER_PART = 'FRONT_BUMPER_PART';
    var BACK_BUMPER_PART = 'BACK_BUMPER_PART';
    var LEFT_BUMPER_PART = 'LEFT_BUMPER_PART';
    var RIGHT_BUMPER_PART = 'RIGHT_BUMPER_PART';
    var HEADLIGHTS_PART = 'HEADLIGHTS_PART';
    var MAIN_FRONT_PART = 'MAIN_FRONT_PART';
    var MAIN_BACK_PART = 'MAIN_BACK_PART';
    var TRANSLATE_PART = 'TRANSLATE_PART';

    var carScaleX = 1; // Used to reposition children as the car is resized
    var carScaleY = 1; // Used to reposition children as the car is resized
    var setCarScaleX = function (x) {
        carScaleX = x;
    };
    var setCarScaleY = function (y) {
        carScaleY = y;
    };
    var getCarScaleX = function () {
        return carScaleX;
    };
    var getCarScaleY = function () {
        return carScaleY;
    };

    var DEFAULT_AXLE_WIDTH = (MAX_AXLE_WIDTH / 3 + MIN_AXLE_WIDTH) / 2;
    var currAxelWidth = DEFAULT_AXLE_WIDTH; // Used to reposition children as the axles are resized
    var setAxleWidth = function (w) {
        currAxelWidth = w;
    };
    var getAxleWidth = function () {
        return currAxelWidth;
    };

    var GraphNode = function () {
        this.nodeName = "";
        this.startPositionTransform = null;
        this.objectTransform = null;
        this.children = {};
        this.hitInverse = null;
        this.width = 0;
        this.height = 0;
    };

    _.extend(GraphNode.prototype, {

        /**
         * Subclasses should call this function to initialize the object.
         *
         * @param startPositionTransform The transform that should be applied prior
         * to performing any rendering, so that the component can render in its own,
         * local, object-centric coordinate system.
         * @param nodeName The name of the node. Useful for debugging, but also used to uniquely identify each node
         */
        initGraphNode: function (startPositionTransform, nodeName) {
            this.nodeName = nodeName;

            // The transform that will position this object, relative to its parent
            this.startPositionTransform = startPositionTransform;

            // Any additional transforms of this object after the previous transform has been applied
            this.objectTransform = new AffineTransform();

            // Any child nodes of this node
            this.children = {};

            // Add any other properties you need, here
            this.hitInverse = new AffineTransform(); // Used for hit detection
            this.width = 0; // Default width for a node; used for hit detection
            this.height = 0; // Default height for a node; used for hit detection
        },

        addChild: function (graphNode) {
            this.children[graphNode.nodeName] = graphNode;
        },

        /**
         * Swaps a graph node with a new graph node.
         * @param nodeName The name of the graph node
         * @param newNode The new graph node
         */
        replaceGraphNode: function (nodeName, newNode) {
            if (nodeName in this.children) {
                this.children[nodeName] = newNode;
            } else {
                _.each(
                    _.values(this.children),
                    function (child) {
                        child.replaceGraphNode(nodeName, newNode);
                    }
                );
            }
        },

        /**
         * Render this node using the graphics context provided.
         * Prior to doing any painting, the start_position_transform must be
         * applied, so the component can render itself in its local, object-centric
         * coordinate system. See the assignment specs for more details.
         *
         * This method should also call each child's render method.
         * @param context
         */
        render: function (context) {
            // Can be overridden by subclasses if custom rendering is required

            context.save(); // BEGIN: DRAWING OF CURRENT NODE AND RECURSION INTO CHILDREN

            // Concatenate the specific object transform to its default relative position to its parent
            var m = this.startPositionTransform.clone();
            m = m.concatenate(this.objectTransform);

            // Transform the current context for drawing
            context.transform(m.m00_, m.m10_, m.m01_, m.m11_, m.m02_, m.m12_);

            // Call specific drawing function (if it exists)
            if (typeof this.draw === "function") {
                this.draw(context);
            }

            // Render children
            _.each(
                _.values(this.children),
                function (child) {
                    child.render(context);
                }
            );

            context.restore(); // END: DRAWING OF CURRENT NODE AND RECURSION INTO CHILDREN
        },

        /**
         * Determines whether a point lies within this object. Be sure the point is
         * transformed correctly prior to performing the hit test.
         */
        pointInObject: function (point) {
            // Can be overridden by subclasses if custom logic is required

            var x = point.x;
            var y = point.y;

            var rx = this.width / 2;
            var ty = -this.height / 2;
            var lx = -rx;
            var by = -ty;

            if ((x >= lx && x <= rx) && (y >= ty && y <= by)) {
                return true;
            }

            // Check if inside any children
            var inChild = false;
            _.each(
                _.values(this.children),
                function (child) {
                    var m = child.startPositionTransform.clone();
                    m = m.concatenate(child.objectTransform.clone());
                    var transformedPoint = {x: point.x, y: point.y};

                    var getTransformedPoint = function (p, transform) {
                        var src = [p.x, p.y];
                        var dst = [];
                        transform.transform(src, 0, dst, 0, 1);

                        return {
                            x: dst[0],
                            y: dst[1]
                        }
                    };

                    transformedPoint = getTransformedPoint(transformedPoint, m.createInverse());

                    if (child.pointInObject(transformedPoint)) {
                        inChild = true;
                    }
                }
            );

            return inChild;
        }

    });

    // Root scene node
    var SceneNode = function () {
        this.initGraphNode(new AffineTransform(), SCENE);
        this.width = CANVAS_WIDTH;
        this.height = CANVAS_HEIGHT;
    };
    _.extend(SceneNode.prototype, GraphNode.prototype, {
        // Overriding from parent
        render: function (context) {
            context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

            // Render children
            _.each(
                _.values(this.children),
                function (child) {
                    child.render(context);
                }
            );
        },

        // Override
        pointInObject: function (point) {
            return true;
        }
    });

    var CarNode = function () {
        this.initGraphNode((new AffineTransform()).translate(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2), CAR_PART); // Center on screen
        this.width = CAR_BODY_WIDTH;
        this.height = CAR_BODY_HEIGHT;
    };
    _.extend(CarNode.prototype, GraphNode.prototype);

    var CarBodyAndChasisNode = function () {
        this.initGraphNode(new AffineTransform(), CAR_BODY_AND_CHASIS_PART);
        this.width = CAR_BODY_WIDTH;
        this.height = CAR_BODY_HEIGHT;
    };
    _.extend(CarBodyAndChasisNode.prototype, GraphNode.prototype);

    var CarBodyNode = function () {
        this.initGraphNode(new AffineTransform(), CAR_BODY_PART);
        this.width = CAR_BODY_WIDTH;
        this.height = CAR_BODY_HEIGHT;
    };
    _.extend(CarBodyNode.prototype, GraphNode.prototype, {
        draw: function (context) {
            context.save(); // BEGIN: DRAWING OF CURRENT NODE AND RECURSION INTO CHILDREN

            canvasDraw.rectangle(context, 0, 0, this.width, this.height, "#3366CC")

            context.restore(); // END: DRAWING OF CURRENT NODE AND RECURSION INTO CHILDREN
        }
    });

    var BumperNode = function (bumperPartName) {
        this.initGraphNode(new AffineTransform(), bumperPartName);

        if (bumperPartName == FRONT_BUMPER_PART) {
            this.width = CAR_BUMPER_WIDTH;
            this.height = CAR_BUMPER_HEIGHT;
            this.startPositionTransform.translate(0, -(CAR_BODY_HEIGHT / 2) + (this.height / 2));
        } else if (bumperPartName == BACK_BUMPER_PART) {
            this.width = CAR_BUMPER_WIDTH;
            this.height = CAR_BUMPER_HEIGHT;
            this.startPositionTransform.translate(0, (CAR_BODY_HEIGHT / 2) - (this.height / 2));
        } else if (bumperPartName == LEFT_BUMPER_PART) {
            this.width = CAR_BUMPER_HEIGHT;
            this.height = CAR_BODY_HEIGHT - (2 * CAR_BUMPER_HEIGHT);
            this.startPositionTransform.translate(-(CAR_BODY_WIDTH / 2) + (this.width / 2), 0);
        } else if (bumperPartName == RIGHT_BUMPER_PART) {
            this.width = CAR_BUMPER_HEIGHT;
            this.height = CAR_BODY_HEIGHT - (2 * CAR_BUMPER_HEIGHT);
            this.startPositionTransform.translate((CAR_BODY_WIDTH / 2) - (this.width / 2), 0);
        }
    };
    _.extend(BumperNode.prototype, GraphNode.prototype, {
        draw: function (context) {
            context.save(); // BEGIN: DRAWING OF CURRENT NODE AND RECURSION INTO CHILDREN

            canvasDraw.rectangle(context, 0, 0, this.width, this.height,
                (this.nodeName == FRONT_BUMPER_PART || this.nodeName == BACK_BUMPER_PART) ? "#0367c4" : "#6699FF");

            context.restore(); // END: DRAWING OF CURRENT NODE AND RECURSION INTO CHILDREN
        }
    });

    var HeadlightsNode = function () {
        this.initGraphNode(new AffineTransform(), CAR_PART);
        this.width = (CAR_BUMPER_HEIGHT / 2.25) * 2;
        this.height = this.width / 2;
    };
    _.extend(HeadlightsNode.prototype, GraphNode.prototype, {
        draw: function (context) {
            context.save(); // BEGIN: DRAWING OF CURRENT NODE AND RECURSION INTO CHILDREN

            canvasDraw.semicircle(context, -CAR_BUMPER_WIDTH / 2.75, 0, this.width / 2, "Yellow");
            canvasDraw.semicircle(context, CAR_BUMPER_WIDTH / 2.75, 0, this.width / 2, "Yellow");

            context.restore(); // END: DRAWING OF CURRENT NODE AND RECURSION INTO CHILDREN
        }
    });

    var MainNode = function (mainPartName) { // These are used as the "main" part of the car - the rotation controlling parts
        this.initGraphNode(new AffineTransform(), mainPartName);
        this.width = CAR_MAIN_PART_WIDTH;
        this.height = CAR_MAIN_PART_HEIGHT;

        if (mainPartName == MAIN_FRONT_PART) {
            this.startPositionTransform.translate(0, -(CAR_BODY_HEIGHT / 2) + CAR_BUMPER_HEIGHT + (CAR_MAIN_PART_HEIGHT / 2));
        } else if (mainPartName == MAIN_BACK_PART) {
            this.startPositionTransform.translate(0, (CAR_BODY_HEIGHT / 2) - CAR_BUMPER_HEIGHT - (CAR_MAIN_PART_HEIGHT / 2));
        }
    };
    _.extend(MainNode.prototype, GraphNode.prototype);

    var TranslateNode = function () { // Placed at the middle of the car body to allow translations
        this.initGraphNode(new AffineTransform(), TRANSLATE_PART);
        this.width = CAR_MAIN_PART_WIDTH;
        this.height = CAR_MAIN_PART_HEIGHT;
    };
    _.extend(TranslateNode.prototype, GraphNode.prototype, {
        draw: function (context) {
            context.save(); // BEGIN: DRAWING OF CURRENT NODE AND RECURSION INTO CHILDREN

            canvasDraw.rectangle(context, 0, 0, this.width, this.height, "#003399");

            context.restore(); // END: DRAWING OF CURRENT NODE AND RECURSION INTO CHILDREN
        }
    });

    /**
     * @param axlePartName Which axle this node represents
     * @constructor
     */
    var AxleNode = function (axlePartName) {
        this.initGraphNode(new AffineTransform(), axlePartName);
        this.height = AXLE_HEIGHT;
    };
    _.extend(AxleNode.prototype, GraphNode.prototype, {
        // Override
        render: function (context) {
            if (this.nodeName == FRONT_AXLE_PART) {
                this.startPositionTransform.setToTranslation(0, -(CAR_BODY_HEIGHT * carScaleY / 2) + 17);
            } else if (this.nodeName == BACK_AXLE_PART) {
                this.startPositionTransform.setToTranslation(0, (CAR_BODY_HEIGHT * carScaleY / 2) - 17);
            }

            context.save(); // BEGIN: DRAWING OF CURRENT NODE AND RECURSION INTO CHILDREN

            // Concatenate the specific object transform to its default relative position to its parent
            var m = this.startPositionTransform.clone();
            m = m.concatenate(this.objectTransform);

            // Transform the current context for drawing
            context.transform(m.m00_, m.m10_, m.m01_, m.m11_, m.m02_, m.m12_);

            // Draw
            this.width = (CAR_BODY_WIDTH * carScaleX) + (2 * currAxelWidth);
            canvasDraw.line(context, -this.width / 2, 0, this.width / 2, 0);

            // Render children
            _.each(
                _.values(this.children),
                function (child) {
                    child.render(context);
                }
            );

            context.restore(); // END: DRAWING OF CURRENT NODE AND RECURSION INTO CHILDREN
        }
    });

    var WheelNode = function (wheelPartName) {
        this.initGraphNode(new AffineTransform(), wheelPartName);
        this.width = WHEEL_WIDTH;
        this.height = WHEEL_HEIGHT;
    };
    _.extend(WheelNode.prototype, GraphNode.prototype, {
        // Override
        render: function (context) {
            if (this.nodeName == FRONT_RIGHT_WHEEL_PART || this.nodeName == BACK_RIGHT_WHEEL_PART) {
                this.startPositionTransform.setToTranslation(((CAR_BODY_WIDTH * carScaleX) + (2 * currAxelWidth)) / 2, 0);
            } else {
                this.startPositionTransform.setToTranslation(-((CAR_BODY_WIDTH * carScaleX) + (2 * currAxelWidth)) / 2, 0);
            }

            context.save(); // BEGIN: DRAWING OF CURRENT NODE AND RECURSION INTO CHILDREN

            // Concatenate the specific object transform to its default relative position to its parent
            var m = this.startPositionTransform.clone();
            m = m.concatenate(this.objectTransform);

            // Transform the current context for drawing
            context.transform(m.m00_, m.m10_, m.m01_, m.m11_, m.m02_, m.m12_);

            // Render children
            _.each(
                _.values(this.children),
                function (child) {
                    child.render(context);
                }
            );

            context.restore(); // END: DRAWING OF CURRENT NODE AND RECURSION INTO CHILDREN
        }
    });

    /**
     * @param tirePartName Which tire this node represents
     * @constructor
     */
    var TireNode = function (tirePartName) {
        this.initGraphNode(new AffineTransform(), tirePartName);
        this.width = WHEEL_WIDTH;
        this.height = WHEEL_HEIGHT;
    };
    _.extend(TireNode.prototype, GraphNode.prototype, {
        draw: function (context) {
            context.save(); // BEGIN: DRAWING OF CURRENT NODE AND RECURSION INTO CHILDREN

            canvasDraw.rectangle(context, 0, 0, this.width, this.height);

            context.restore(); // END: DRAWING OF CURRENT NODE AND RECURSION INTO CHILDREN
        }
    });

    /**
     * @param tireTopPartName Which tire top this node represents
     * @constructor
     */
    var TireTopNode = function (tireTopPartName) {
        this.initGraphNode(new AffineTransform(), tireTopPartName);
        this.width = WHEEL_WIDTH;
        this.height = WHEEL_HEIGHT / 2.5;
        this.startPositionTransform.translate(0, -WHEEL_HEIGHT / 2 + this.height / 2);
    };
    _.extend(TireTopNode.prototype, GraphNode.prototype, {
        draw: function (context) {
            context.save(); // BEGIN: DRAWING OF CURRENT NODE AND RECURSION INTO CHILDREN

            canvasDraw.rectangle(context, 0, 0, this.width, this.height, "#282828");

            context.restore(); // END: DRAWING OF CURRENT NODE AND RECURSION INTO CHILDREN
        }
    });

    // Return an object containing all of our classes and constants
    return {
        SceneNode: SceneNode,
        GraphNode: GraphNode,
        CarNode: CarNode,
        AxleNode: AxleNode,
        TireNode: TireNode,
        BumperNode: BumperNode,
        HeadlightsNode: HeadlightsNode,
        MainNode: MainNode,
        CarBodyNode: CarBodyNode,
        CarBodyAndChasisNode: CarBodyAndChasisNode,
        WheelNode: WheelNode,
        TranslateNode: TranslateNode,
        TireTopNode: TireTopNode,
        setCarScaleX: setCarScaleX,
        setCarScaleY: setCarScaleY,
        getCarScaleX: getCarScaleX,
        getCarScaleY: getCarScaleY,
        setAxleWidth: setAxleWidth,
        getAxleWidth: getAxleWidth,
        SCENE: SCENE,
        CAR_PART: CAR_PART,
        CAR_BODY_AND_CHASIS_PART: CAR_BODY_AND_CHASIS_PART,
        CAR_BODY_PART: CAR_BODY_PART,
        FRONT_AXLE_PART: FRONT_AXLE_PART,
        BACK_AXLE_PART: BACK_AXLE_PART,
        FRONT_LEFT_WHEEL_PART: FRONT_LEFT_WHEEL_PART,
        FRONT_RIGHT_WHEEL_PART: FRONT_RIGHT_WHEEL_PART,
        BACK_LEFT_WHEEL_PART: BACK_LEFT_WHEEL_PART,
        BACK_RIGHT_WHEEL_PART: BACK_RIGHT_WHEEL_PART,
        FRONT_LEFT_TIRE_PART: FRONT_LEFT_TIRE_PART,
        FRONT_RIGHT_TIRE_PART: FRONT_RIGHT_TIRE_PART,
        BACK_LEFT_TIRE_PART: BACK_LEFT_TIRE_PART,
        BACK_RIGHT_TIRE_PART: BACK_RIGHT_TIRE_PART,
        FRONT_LEFT_TIRE_TOP_PART: FRONT_LEFT_TIRE_TOP_PART,
        FRONT_RIGHT_TIRE_TOP_PART: FRONT_RIGHT_TIRE_TOP_PART,
        BACK_LEFT_TIRE_TOP_PART: BACK_LEFT_TIRE_TOP_PART,
        BACK_RIGHT_TIRE_TOP_PART: BACK_RIGHT_TIRE_TOP_PART,
        FRONT_BUMPER_PART: FRONT_BUMPER_PART,
        BACK_BUMPER_PART: BACK_BUMPER_PART,
        LEFT_BUMPER_PART: LEFT_BUMPER_PART,
        RIGHT_BUMPER_PART: RIGHT_BUMPER_PART,
        HEADLIGHTS_PART: HEADLIGHTS_PART,
        MAIN_FRONT_PART: MAIN_FRONT_PART,
        MAIN_BACK_PART: MAIN_BACK_PART,
        TRANSLATE_PART: TRANSLATE_PART,
        CAR_BODY_WIDTH: CAR_BODY_WIDTH,
        CAR_BODY_HEIGHT: CAR_BODY_HEIGHT,
        MAX_CAR_BODY_WIDTH: MAX_CAR_BODY_WIDTH,
        MIN_CAR_BODY_WIDTH: MIN_CAR_BODY_WIDTH,
        MAX_CAR_BODY_HEIGHT: MAX_CAR_BODY_HEIGHT,
        MIN_CAR_BODY_HEIGHT: MIN_CAR_BODY_HEIGHT,
        MAX_AXLE_WIDTH: MAX_AXLE_WIDTH,
        MIN_AXLE_WIDTH: MIN_AXLE_WIDTH,
        MIN_TIRE_ANGLE: MIN_TIRE_ANGLE,
        MAX_TIRE_ANGLE: MAX_TIRE_ANGLE,
        DEFAULT_AXLE_WIDTH: DEFAULT_AXLE_WIDTH
    };
}