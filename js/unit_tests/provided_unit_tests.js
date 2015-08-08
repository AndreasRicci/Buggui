'use strict';

var expect = chai.expect;

describe("Unit Test 1", function () {
    it("GraphNode: Constructor", function () {
        var sceneGraphModule = createSceneGraphModule();

        var node = new sceneGraphModule.GraphNode();

        expect(node.nodeName.length, "nodeName wrong").to.equal(0);
        expect(node.startPositionTransform, "startPositionTransform wrong").to.equal(null);
        expect(node.objectTransform, "objectTransform wrong").to.equal(null);
        expect(node.hitInverse, "hitInverse wrong").to.equal(null);
        expect(node.width, "width wrong").to.equal(0);
        expect(node.height, "height wrong").to.equal(0);
    });
});

describe("Unit Test 2", function () {
    it("GraphNode: initGraphNode", function () {
        var sceneGraphModule = createSceneGraphModule();

        var node = new sceneGraphModule.GraphNode();
        node.initGraphNode(new AffineTransform(), "test");

        expect(node.nodeName, "nodeName wrong").to.equal("test");
        expect(node.startPositionTransform, "startPositionTransform wrong").to.not.equal(null);
        expect(node.objectTransform, "objectTransform wrong").to.not.equal(null);
        expect(node.hitInverse, "hitInverse wrong").to.not.equal(null);
        expect(node.width, "width wrong").to.equal(0);
        expect(node.height, "height wrong").to.equal(0);
    });
});

describe("Unit Test 3", function () {
    it("GraphNode: addChild", function () {
        var sceneGraphModule = createSceneGraphModule();

        var root = new sceneGraphModule.GraphNode();
        root.initGraphNode(new AffineTransform(), "root");

        var child1 = new sceneGraphModule.GraphNode();
        child1.initGraphNode(new AffineTransform(), "child1");
        var child2 = new sceneGraphModule.GraphNode();
        child2.initGraphNode(new AffineTransform(), "child2");

        root.addChild(child1);

        expect(root.children[child1.nodeName].nodeName, "child1 nodeName wrong").to.equal(child1.nodeName);

        root.addChild(child2);

        expect(root.children[child2.nodeName].nodeName, "child2 nodeName wrong").to.equal(child2.nodeName);
    });
});

describe("Unit Test 4", function () {
    it("GraphNode: replaceGraphNode", function () {
        var sceneGraphModule = createSceneGraphModule();

        var root = new sceneGraphModule.GraphNode();
        root.initGraphNode(new AffineTransform(), "root");

        var child1 = new sceneGraphModule.GraphNode();
        child1.initGraphNode(new AffineTransform(), "child1");
        var child2 = new sceneGraphModule.GraphNode();
        child2.initGraphNode(new AffineTransform(), "child2");

        var grandchild1 = new sceneGraphModule.GraphNode();
        grandchild1.initGraphNode(new AffineTransform(), "grandchild1");
        var grandchild2 = new sceneGraphModule.GraphNode();
        grandchild2.initGraphNode(new AffineTransform(), "grandchild2");

        root.addChild(child1);
        root.addChild(child2);

        child1.addChild(grandchild1);

        expect(child1.children[grandchild1.nodeName].nodeName, "grandchild1 nodeName wrong").to.equal(grandchild1.nodeName);

        root.replaceGraphNode(grandchild1.nodeName, grandchild2);

        expect(child1.children[grandchild1.nodeName].nodeName, "grandchild2 nodeName wrong").to.equal(grandchild2.nodeName);
    });
});

describe("Unit Test 5", function () {
    it("GraphNode: pointInObject", function () {
        var sceneGraphModule = createSceneGraphModule();

        var node = new sceneGraphModule.GraphNode();
        node.initGraphNode(new AffineTransform(), "test");

        expect(node.nodeName, "nodeName wrong").to.equal("test");
        expect(node.startPositionTransform, "startPositionTransform wrong").to.not.equal(null);
        expect(node.objectTransform, "objectTransform wrong").to.not.equal(null);
        expect(node.hitInverse, "hitInverse wrong").to.not.equal(null);
        expect(node.width, "width wrong").to.equal(0);
        expect(node.height, "height wrong").to.equal(0);

        node.width = 100;
        node.height = 50;

        expect(node.pointInObject({x: 0, y: 0}), " should be inside object").to.equal(true);
        expect(node.pointInObject({x: -45, y: 2}), " should be inside object").to.equal(true);
        expect(node.pointInObject({x: -50, y: 25}), " should be inside object").to.equal(true);
        expect(node.pointInObject({x: -51, y: 25}), " should not be inside object").to.equal(false);
        expect(node.pointInObject({x: -51, y: 24}), " should not be inside object").to.equal(false);
        expect(node.pointInObject({x: 54, y: 2}), " should not be inside object").to.equal(false);
        expect(node.pointInObject({x: 43, y: -226}), " should not be inside object").to.equal(false);

        var child1 = new sceneGraphModule.GraphNode();
        child1.initGraphNode(new AffineTransform(), "child1");
        child1.width = 1000;
        child1.height = 1000;
        node.addChild(child1);

        expect(child1.pointInObject({x: 43, y: -226}), " should be inside object").to.equal(true);
        expect(node.pointInObject({x: 43, y: -226}), " should be inside object").to.equal(true);

        expect(child1.pointInObject({x: 4433, y: -226}), " should be inside object").to.equal(false);
        expect(node.pointInObject({x: 4433, y: -226}), " should be inside object").to.equal(false);
    });
});
