window.addEventListener("load", () => new CanvasWrapper());


class CanvasWrapper {
    private canvas : HTMLCanvasElement;
    private ctx : CanvasRenderingContext2D;

    dragging : boolean;
    lastPos : number[];
    center : number[];

    cube : Cube;

    constructor() {
        this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
        this.ctx = this.canvas.getContext("2d");
        this.addMouseEvents();

        this.center = [this.canvas.width/2, 0, this.canvas.height/2];


        this.cube = new Cube();

        this.drawFrame();
    }

    step() {
        
        
        window.requestAnimationFrame(() => this.step());
    }

    handleMouseDown(x : number, y : number) {
        this.dragging = true;
        this.lastPos = [x, y];
    }

    handleMouseMove(x : number, y : number) {
        if (this.dragging) {
            let angleH = 6*(this.lastPos[0] - x)/this.canvas.width;
            let angleV = 6*(y - this.lastPos[1])/this.canvas.width;
            
            this.cube.rotate(angleH, angleV);

            this.drawFrame();
            this.lastPos = [x, y];
        }
    }

    handleMouseUp() {
        this.dragging = false;
    }

    addMouseEvents() {
        this.canvas.addEventListener("mousedown", (event) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            this.handleMouseDown(x, y);
        })
        this.canvas.addEventListener("mousemove", (event) => {
            const rect = this.canvas.getBoundingClientRect()
            const x = event.clientX - rect.left
            const y = event.clientY - rect.top
            this.handleMouseMove(x, y);
        })
        this.canvas.addEventListener("mouseup", () => this.handleMouseUp());
    }

    drawFrame() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.beginPath();
        for (let i = 0; i < 12; i++) {
            let v1 = Vec3.scale(new Array(3), this.cube.V[this.cube.E[i][0]], 100);
            let v2 = Vec3.scale(new Array(3), this.cube.V[this.cube.E[i][1]], 100);

            Vec3.add(v1, v1, this.center);
            Vec3.add(v2, v2, this.center);
            
            this.ctx.moveTo(v1[0], v1[2]);
            this.ctx.lineTo(v2[0], v2[2]);
        }
        this.ctx.stroke();
    }
}

class Cube {
    V : number[][];
    E : number[][];

    constructor() {
        this.V = new Array(8);
        this.E = new Array(12);

        let edgeNumber = 0;
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
                for (let k = 0; k < 2; k++) {
                    let index = i + 2*j + 4*k;
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

    rotate(angleH : number, angleV : number) {
        for (let i = 0; i < 8; i++) {
            Vec3.rotate(this.V[i], Vec3.copy(this.V[i]), angleH, angleV);
        }
    }
}

class Vec3 {
    static copy(x : number[]) {
        return [x[0], x[1], x[2]];
    }

    static add(out: number[], x: number[], y: number[]) {
        out[0] = x[0] + y[0];
        out[1] = x[1] + y[1];
        out[2] = x[2] + y[2];
        return out;
    }

    static subtract(out: number[], x: number[], y: number[]) {
        out[0] = x[0] - y[0];
        out[1] = x[1] - y[1];
        out[2] = x[2] - y[2];
        return out;
    }

    static multiply(out: number[], x: number[], y: number[]) {
        out[0] = x[0] * y[0];
        out[1] = x[1] * y[1];
        out[2] = x[2] * y[2];
        return out;
    }

    static divide(out: number[], x: number[], y: number[]) {
        out[0] = x[0] / y[0];
        out[1] = x[1] / y[1];
        out[2] = x[2] / y[2];
        return out;
    }

    static scale(out : number[], x: number[], a: number) {
        out[0] = x[0] * a;
        out[1] = x[1] * a;
        out[2] = x[2] * a;
        return out;
    }

    static scaleAndShift(out : number[], x: number[], a: number, b : number) {
        out[0] = x[0] * a + b;
        out[1] = x[1] * a + b;
        out[2] = x[2] * a + b;
        return out;
    }

    static distance(x: number[], y: number[]) {
        return Math.sqrt((x[0]-y[0])**2 + (x[1]-y[1])**2 + (x[2]-y[2])**2);
    }

    static rotate(out : number[], x : number[], angleH : number, angleV : number) {
        out[0] = x[0]*Math.cos(angleH) - x[1]*Math.sin(angleH);
        out[1] = x[0]*Math.sin(angleH) + x[1]*Math.cos(angleH);
        let new1 = out[1];
        out[1] = new1*Math.cos(angleV) - x[2]*Math.sin(angleV);
        out[2] = new1*Math.sin(angleV) + x[2]*Math.cos(angleV);
        return out;
    }
}