window.addEventListener("load", function () { return new CanvasWrapper(); });
var CanvasWrapper = /** @class */ (function () {
    function CanvasWrapper() {
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.addMouseEvents();
        this.center = [this.canvas.width / 2, 0, this.canvas.height / 2];
        this.cube = new Cube();
        this.drawFrame();
    }
    CanvasWrapper.prototype.step = function () {
        var _this = this;
        window.requestAnimationFrame(function () { return _this.step(); });
    };
    CanvasWrapper.prototype.handleMouseDown = function (x, y) {
        this.dragging = true;
        this.lastPos = [x, y];
    };
    CanvasWrapper.prototype.handleMouseMove = function (x, y) {
        if (this.dragging) {
            var angleH = 6 * (this.lastPos[0] - x) / this.canvas.width;
            var angleV = 6 * (y - this.lastPos[1]) / this.canvas.width;
            this.cube.rotate(angleH, angleV);
            this.drawFrame();
            this.lastPos = [x, y];
        }
    };
    CanvasWrapper.prototype.handleMouseUp = function () {
        this.dragging = false;
    };
    CanvasWrapper.prototype.addMouseEvents = function () {
        var _this = this;
        this.canvas.addEventListener("mousedown", function (event) {
            var rect = _this.canvas.getBoundingClientRect();
            var x = event.clientX - rect.left;
            var y = event.clientY - rect.top;
            _this.handleMouseDown(x, y);
        });
        this.canvas.addEventListener("mousemove", function (event) {
            var rect = _this.canvas.getBoundingClientRect();
            var x = event.clientX - rect.left;
            var y = event.clientY - rect.top;
            _this.handleMouseMove(x, y);
        });
        this.canvas.addEventListener("mouseup", function () { return _this.handleMouseUp(); });
    };
    CanvasWrapper.prototype.drawFrame = function () {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.beginPath();
        for (var i = 0; i < 12; i++) {
            var v1 = Vec3.scale(new Array(3), this.cube.V[this.cube.E[i][0]], 100);
            var v2 = Vec3.scale(new Array(3), this.cube.V[this.cube.E[i][1]], 100);
            Vec3.add(v1, v1, this.center);
            Vec3.add(v2, v2, this.center);
            this.ctx.moveTo(v1[0], v1[2]);
            this.ctx.lineTo(v2[0], v2[2]);
        }
        this.ctx.stroke();
    };
    return CanvasWrapper;
}());
var Cube = /** @class */ (function () {
    function Cube() {
        this.V = new Array(8);
        this.E = new Array(12);
        var edgeNumber = 0;
        for (var i = 0; i < 2; i++) {
            for (var j = 0; j < 2; j++) {
                for (var k = 0; k < 2; k++) {
                    var index = i + 2 * j + 4 * k;
                    this.V[index] = Vec3.scaleAndShift(new Array(3), [i, j, k], 2, -1);
                    if (i == 0) {
                        this.E[edgeNumber] = [index, index + 1];
                        edgeNumber++;
                    }
                    if (j == 0) {
                        this.E[edgeNumber] = [index, index + 2];
                        edgeNumber++;
                    }
                    if (k == 0) {
                        this.E[edgeNumber] = [index, index + 4];
                        edgeNumber++;
                    }
                }
            }
        }
    }
    Cube.prototype.rotate = function (angleH, angleV) {
        for (var i = 0; i < 8; i++) {
            Vec3.rotate(this.V[i], Vec3.copy(this.V[i]), angleH, angleV);
        }
    };
    return Cube;
}());
var Vec3 = /** @class */ (function () {
    function Vec3() {
    }
    Vec3.copy = function (x) {
        return [x[0], x[1], x[2]];
    };
    Vec3.add = function (out, x, y) {
        out[0] = x[0] + y[0];
        out[1] = x[1] + y[1];
        out[2] = x[2] + y[2];
        return out;
    };
    Vec3.subtract = function (out, x, y) {
        out[0] = x[0] - y[0];
        out[1] = x[1] - y[1];
        out[2] = x[2] - y[2];
        return out;
    };
    Vec3.multiply = function (out, x, y) {
        out[0] = x[0] * y[0];
        out[1] = x[1] * y[1];
        out[2] = x[2] * y[2];
        return out;
    };
    Vec3.divide = function (out, x, y) {
        out[0] = x[0] / y[0];
        out[1] = x[1] / y[1];
        out[2] = x[2] / y[2];
        return out;
    };
    Vec3.scale = function (out, x, a) {
        out[0] = x[0] * a;
        out[1] = x[1] * a;
        out[2] = x[2] * a;
        return out;
    };
    Vec3.scaleAndShift = function (out, x, a, b) {
        out[0] = x[0] * a + b;
        out[1] = x[1] * a + b;
        out[2] = x[2] * a + b;
        return out;
    };
    Vec3.distance = function (x, y) {
        return Math.sqrt(Math.pow((x[0] - y[0]), 2) + Math.pow((x[1] - y[1]), 2) + Math.pow((x[2] - y[2]), 2));
    };
    Vec3.rotate = function (out, x, angleH, angleV) {
        out[0] = x[0] * Math.cos(angleH) - x[1] * Math.sin(angleH);
        out[1] = x[0] * Math.sin(angleH) + x[1] * Math.cos(angleH);
        var new1 = out[1];
        out[1] = new1 * Math.cos(angleV) - x[2] * Math.sin(angleV);
        out[2] = new1 * Math.sin(angleV) + x[2] * Math.cos(angleV);
        return out;
    };
    return Vec3;
}());
