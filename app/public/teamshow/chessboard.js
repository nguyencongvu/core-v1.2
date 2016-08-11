/*----------------------------
-- Teamshow Chess v1.0
-- createdby Nguyen Cong Vu 
-- Company: Vien Nguyen Software
----------------------------*/

var colors = ['red', 'yellow', 'blue', 'green']; 

var players = [
    {name: "A", email: "", random: 0}, //-- main player
    {name: "B", email: "", random: 1},
    {name: "C", email: "", random: 1},
    {name: "D", email: "", random: 1},
];

//-- lay thu tu chess di 
var chess= [
    'A1', 'B1', 'C1', 'D1',
    'A2', 'B2', 'C2', 'D2',
    'A3', 'B3', 'C3', 'D3',
    'A4', 'B4', 'C4', 'D4'
]; 

//-- lay thu tu score 
var score= [
    //--red1, yellow1, blue1, green1 
    colors[0]+"1", colors[1]+"1", colors[2]+"1", colors[3]+"1", 
    colors[0]+"2", colors[1]+"2", colors[2]+"2", colors[3]+"2", 
    colors[0]+"3", colors[1]+"3", colors[2]+"3", colors[3]+"3", 
    colors[0]+"4", colors[1]+"4", colors[2]+"4", colors[3]+"4", 
    colors[0]+"5", colors[1]+"5", colors[2]+"5", colors[3]+"5", 
    colors[0]+"6", colors[1]+"6", colors[2]+"6", colors[3]+"6", 
    colors[0]+"7", colors[1]+"7", colors[2]+"7", colors[3]+"7", 
    colors[0]+"8", colors[1]+"8", colors[2]+"8", colors[3]+"8", 
    colors[0]+"9", colors[1]+"9", colors[2]+"9", colors[3]+"9", 
];

var grid = 30;
var MAX_HEIGHT = 21*grid;
var MAX_WIDTH = 22*grid;
var _top, _left;

function line(lineColor){
    var rect = new fabric.Rect({
        name: "frame",
        stroke: lineColor, strokeWidth:2, fill: "rgba(0,0,0,0)",
        left: 0, top: 0,
        width: 21*grid, height: MAX_HEIGHT, 
        originX: 'left', originY: 'top',
        selectable: false, hasControls: false,
        lockMovementX: true, lockMovementY: true,
        //shadow: 'rgba(0,0,0,0.4) 2px 2px 3px',
    });

    canvas.add(rect);
    canvas.sendToBack(rect);
}

function gridLine(lineColor){
    /*
    -- Ke khung doc 
    -- Ke khung ngang 
    -- 4 rectangle 4 mau 
    -- Ve 4 cot so tu 1-9 
    */

    //-- Ke khung doc
    for (var i = 0; i < (MAX_WIDTH/grid); i++) {
        canvas.add(new fabric.Line([ i * grid, 0, i * grid, MAX_HEIGHT], 
            { stroke: lineColor, selectable: false}));
    }

    //-- Ke khung ngang 
    for(var i=0; i<(MAX_HEIGHT/grid); i++){
        canvas.add(new fabric.Line([ 0, i * grid, MAX_WIDTH, i * grid], 
            { stroke: lineColor, selectable: false }));
    }

}


function buldBlock1(){ //--red
    _top = 12;
    _left = 10;

    var color = colors[0];
    var text = "";
    var name = "";
    
    for(i=0;i<9; i++){
        var points = i+1;   //value
        name = color+points; //-- red1

        makeAScore(_left*grid, _top*grid, name, points.toString(), color, "#fff");
        // log(name + ":" + getValueByName(name));
        
        _top++;
    }
    
}

function buldBlock2(){ //-- yellow
    _top = 10;
    _left = 0;

    var color = colors[1];
    var text = "";
    var name = "";
    
    for(i=9;i>0; i--){
        var points = i; 
        name = color+points; //-- red1
        makeAScore(_left*grid, _top*grid, name, points.toString(), color, "#666");
        
        _left++;
    }
}


function buldBlock3(){ //-- blue 
    _top = 0;
    _left = 10;

    var color = colors[2];
    var text = "";
    var name = "";
    
    for(i=9;i>0; i--){
        var points = i; 
        name = color+points; //-- red1
        makeAScore(_left*grid, _top*grid, name, points.toString(), color, "#fff");
        _top++;
    }
    
}


function buldBlock4(){ //-- green
    _top = 10;
    _left = 12;

    var color = colors[3];
    var text = "";
    var name = "";
    
    for(i=0;i<9; i++){
        var points = i+1; 
        name = color+points; //-- red1
        
        makeAScore(_left*grid, _top*grid, name, points.toString(), color, "#fff");
        _left++;
    }
    
}


function chessA_StartPosition(){
    _top = 18;
    _left = 0;

    
    for(i=4;i>0; i--){
        var points = 0; 
        name = "A"+i;
        text = "A"+i;
        color = "purple";
        textColor = "#fff";
        
        makeAChess(_left*grid, _top*grid, name, text, color, textColor);
        _left++;
    }

}


function chessB_StartPosition(){
    _top = 2;
    _left = 0;

    for(i=4;i>0; i--){
        var points = 0; 
        name = "B"+i;
        text = "B"+i;
        color = "#666";
        textColor = "#fff";
        
        makeAChess(_left*grid, _top*grid, name, text, color, textColor);
        _left++;
    }

}

function chessC_StartPosition(){
    _top = 2;
    _left = 17;

    for(i=0;i<4; i++){
        var points = 0; 
        var s = i+1;
        name = "C"+s;
        text = "C"+s;
        color = "#ccc";
        textColor = "#000";
        
        makeAChess(_left*grid, _top*grid, name, text, color, textColor);
        _left++;
    }

}

function chessD_StartPosition(){
    _top = 18;
    _left = 17;

    for(i=0;i<4; i++){
        var points = 0; 
        var s = i+1;
        name = "D"+s;
        text = "D"+s;
        
        color = "#aaa";
        textColor = "#333";
        
        makeAChess(_left*grid, _top*grid, name, text, color, textColor);
        _left++;
    }

}



//---------- 
function makeAScore(left, top, name, value, color, textColor){
    
    var rect, text, group;
    
    //-- add Rect 
    rect = new fabric.Rect({
        name: name,
        fill: color, stroke: "#fff", strokeWidth: 1,
        left: left, top: top,
        width: grid, height: grid, 
        originX: 'left', originY: 'top',
        //shadow: 'rgba(0,0,0,0.4) 2px 2px 3px',
    });

    //-- add text 
    text = new fabric.Text(
        value,
        {
            name: name,
            fill: textColor,
            left: left + grid/2, top: top + grid/2,
            fontSize: 18,fontFamily: "Arial",
            originX: 'center', originY: 'center',
        }
    );

    //-- group lock
    group = new fabric.Group([rect, text],{
        name: name,     //--name cua score 
        value : value,  //--gia tri cua score 
        left: left,  top: top,
        lockMovementX: true, lockMovementY: true,
        originX: 'left', originY: 'top',
        selectable: false, hasControls: false,
    });


    canvas.add(group);
    return group;
}

//------------
function makeAChess(left, top, name, value, color, textColor){
    
    var circle, text, group;
    
    circle = new fabric.Circle({ 
        name: name, //custom prop
        left: left,  top: top, 
        radius: grid/2, 
        fill: color, stroke: "#fff", strokeWidth: 2,
        //shadow: 'rgba(0,0,0,0.4) 5px 5px 7px',
        selectable: false, hasControls: false,
    }); 

    //-- add text 
    text = new fabric.Text(
        value,
        {
            name: name,
            fill: textColor,
            left: left + grid/2, top: top + grid/2,
            fontSize: 14, fontFamily: "Arial",
            originX: 'center', originY: 'center',
            selectable: false, hasControls: false
        }
    );

    group = new fabric.Group([circle, text],{
        name: name,
        value: value,
        left: left, top: top,
        lockMovementX: true, lockMovementY: true,
        originX: 'left', originY: 'top',
        selectable: false, hasControls:false,
     });


    canvas.add(group);
    return group;
}

//---------- 
function makeACell(left,top, name, color){
  
    // var cell = new fabric.Rect({
    //     name: name, //--name of cell
    //     width: grid, height: grid, 
    //     fill: color, stroke: '#999', strokeDashArray: [5, 5],
    //     originX: 'left', originY: 'top',
    //     left: left, top: top,
    //     lockMovementX: true, lockMovementY: true,
    //     selectable : false, hasControls: false,
    // });

    var cell = new fabric.Circle({ 
        name: name, //custom prop
        left: left,  top: top, 
        radius: grid/2, 
        fill: "rgba(0,0,0,0)", 
        // fill: 'orange',
        stroke: "orange", strokeWidth: 3,
        strokeDashArray: [5, 2],
        //shadow: 'rgba(0,0,0,0.4) 5px 5px 7px',
        selectable: false, hasControls: false,
    }); 
    
    canvas.add(cell);
    return cell;
}