/**
* @description : Langston's Ant algo representation
*                ref : https://en.wikipedia.org/wiki/Langton's_ant
* @author cxts
* @github https://github.com/cxts
* @date 25/07/2020
* @required Draw.js, misc.js, Vector.js
* @return {VOID} draws the pattern of the ant. You can had new ant by clicking on the screen
*                new ant start pattern design on the clicked location
*
**/

//let factor = Math.ceil(ctx.canvas.width / ctx.canvas.height);
let factor = 3;
let dimW = Math.ceil(width / factor);
let dimH = Math.ceil(height / factor);



let grid = new Array(dimW);


// window.requestAnimationFrame state
let ended = false;

// sets up the grid and fill it with value 0
for(let i = 0; i < grid.length; i++)
    grid[i] = new Array(dimH).fill(0);


// ANT DIRECTIONS
// UP       -> 0
// RIGHT    -> 1
// DOWN     -> 2
// LEFT     -> 3

// number of ants initialized
const ANTS = 1;
// ants array
let ants = [];
// populate ants[] with random ants
for(let i = 0; i < ANTS; i++) {
    let x = getRandom(0, grid.length - 1);
    let y = getRandom(0, grid[0].length - 1);
    let dir = getRandom(0,3);
    let out = false;
    let color = getRandomColor();
    ants.push({'x' : x, 'y' : y, 'dir' : dir, 'out' : out, 'color' : color})
}


// add a ant in ants array on mouse click
window.onclick = function(e) {
    let x = Math.ceil((e.clientX * grid.length) / width);
    let y = Math.ceil((e.clientY * grid[0].length) / height);
    let dir = getRandom(0,3);
    let out = false;
    let color = getRandomColor();
    ants.push({'x' : x, 'y' : y, 'dir' : dir, 'out' : out, 'color' : color});
    if(ended)
        draw();
}



// iteration count
let count = 0;
// <p> element for iteration display
let txt = document.getElementById("count");

// speed of process of iteration. 1 is 1 iteration by draw() call
// the higher the faster
const speed = 10;

/**
* @description : called by window.requestAniamtionFrame(), draw the entire animation on canvas
* @param NONE
* @return {VOID}
*
**/
function draw() {
    // cumulated 'out' states of ants
    var finished = true;
    for(let i = 0; i < speed; i++) {
        //txt.innerHTML = count++;
        for(let a = ants.length -1; a >= 0 ; a--) {
            try {
                drawAnt(ants[a]);
            } catch(error) {
                // if a ant makes trouble, it's poped out the array;
                ants.splice(a, 1);
                continue;
            }
            // collect the 'out' state of each ant in the array
            finished &= ants[a].out;
        }
        if(finished) break;
    }
    if(!finished) {
        // while one of the ants is still runing, animation have to be ran
        window.requestAnimationFrame(draw);
    } else {
        // set the ended value to true. It permits the onclick function to access the anamtion state (halted or not)
        ended = finished;
    }
}
window.requestAnimationFrame(draw);

function drawAnt(ant) {
    if(!ant.out) {
        // ant on a white square
        if(grid[ant.x][ant.y] == 0) {
            turnRight(ant);
            ctx.save();
            ctx.fillStyle = ant.color || "#000";
            ctx.fillRect(ant.x * factor, ant.y * factor, factor, factor);
            ctx.restore();
            switchPix(ant.x, ant.y);
            moveOnCrossEdge(ant);
        } else { // ant on a black square
            turnLeft(ant);
            //ctx.fillRect(ant.x * factor, ant.y * factor, factor, factor);
            ctx.clearRect(ant.x * factor, ant.y * factor, factor, factor);
            switchPix(ant.x, ant.y);
            moveOnCrossEdge(ant);
        }
    }
}

// switch the case state that ant is leaving
// 0 == WHITE
// 1 == BLACK
function switchPix(x, y) {
    grid[x][y] = !grid[x][y]
}

// return true if the ant is out of grid boundaries
function antOut(ant) {
    return (
        ant.x == 0 ||
        ant.y == 0 ||
        ant.x == (grid.length - 1) ||
        ant.y == (grid[0].length - 1)
    );
}

// UP       -> 0
// RIGHT    -> 1
// DOWN     -> 2
// LEFT     -> 3

function turnLeft(ant) {
    ant.dir = (ant.dir + 3) % 4;
}

function turnRight(ant) {
    ant.dir = (ant.dir + 1) % 4;
}

// move the ant in function of its position and heading direction
function moveOn(ant) {
    switch (ant.dir) {
        case 0:
            ant.y = (ant.y > 0) ? ant.y - 1 : 0;
            break;
        case 1:
            ant.x = (ant.x < grid.length - 1) ? ant.x + 1 : grid.length - 1;
            break;
        case 2:
            ant.y = (ant.y < grid[0].length - 1) ? ant.y + 1 : grid[0].length - 1;
            break;
        case 3:
            ant.x = (ant.x > 0) ? ant.x - 1 : 0;
            break;
        default:
            break;
    }
    ant.out = antOut(ant);
}


function moveOnCrossEdge(ant) {
    switch (ant.dir) {
        case 0:
            ant.y = (ant.y > 0) ? ant.y - 1 : grid[0].length - 1;
            break;
        case 1:
            ant.x = (ant.x < grid.length - 1) ? ant.x + 1 : 0;
            break;
        case 2:
            ant.y = (ant.y < grid[0].length - 1) ? ant.y + 1 : 0;
            break;
        case 3:
            ant.x = (ant.x > 0) ? ant.x - 1 : grid.length - 1;
            break;
        default:
            break;
    }
}
