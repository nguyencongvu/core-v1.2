var CONFIG = {
    debug: 0,
    animation: 0,
    sound: 0,
    sound_level: 0,
    soundPath: '/teamshow/sound/default/',
    challenge: 0, //-- thach do cau hoi 
    random: 1,
}

var TURN = 0;

var gamePlay = [
    { turn: 0, chess: "", position: "", estScore: 0, score:0, done:0, time: new Date()},
]; 

var cellColor = "#fff"; //-- cellenable

var cells=[
    //  r, b, g, y 
        1, 1, 1, 1
];
var cellCoords = [
    { name: "cellred",      value:1, left: 0, top: 0 },
    { name: "cellyellow",   value:1, left: 0, top: 0 },
    { name: "cellblue",     value:1, left: 0, top: 0 },
    { name: "cellgreen",    value:1, left: 0, top: 0 },
];

var comments = [
    {text: "Bạn có thể chơi Teamshow với các con", link:"http://www.teamshow.vn"},
    {text: "Bạn có thể chơi Teamshow với đồng nghiệp", link:"http://www.teamshow.vn"},
    {text: "Bạn có thể tổ chức teambuilding bằng Teamshow", link:"http://www.teamshow.vn"},
    {text: "Bạn có thể học nghề MC với Teamshow", link:"http://www.teamshow.vn"},
    {text: "Bạn có thể tham gia đào tạo cùng Teamshow", link:"http://www.teamshow.vn"},
    {text: "Bạn có thể tham gia kinh doanh cùng Teamshow", link:"http://www.teamshow.vn"},
];

var _nextChess;
var _gameTimer;
var _objectTimer;

function startGame(){
    /*
    -- countdown 3-2-1
    -- unlock first chess "A1"
    -- enable next 4 cells 
    */
    
    //-- countdown 3-2-1?
    countDownText("3",'orange', 10.5*grid, 10.5*grid); //-- add text name="countdown"
    countDown();
    _objectTimer = setInterval(countDown, 1000);
    
    _nextChess = "A1";
    
    unlockChess(_nextChess);
    enableCells();
    
}

var count = 4;
function countDown(){
    /*
    --- Dem nguoc tu 3,2,1,-1, hien thi 3,2,1, GO
    --- Neu <0 thi end 
    */
    
    count = count -1;
    var s = count; 

    if (count==0)
        s = ""; //-- GO. nhung hien tai khong dung
    
    var text = canvas.getItemByName("countdown");
    text.setText(s.toString());
    canvas.renderAll();

    if (count<0){
        canvas.remove(text);
        clearInterval(_objectTimer);
        return;
    }
}


function enableCells(){
    /*
    -- Bat dau bang cells[1 1 1 1]- theo doi 1,2,1,1 cho de 
    -- Ve cell theo vi tri dung (top, left)
    */
    if (TURN == 0){
        cells=[1,1,1,1]; //-- vi tri enable cell hien tai theo diem so
        prevCells = cells; // saved only
    }
    
    if (endMove()==false){
        
        //-- xoa het prevcesll cu
        for(var i=0;i<prevCells.length;i++){
            var name = "cell"+colors[i]+prevCells[i];  
            removeObject(name);
        }

        //-- ve lai cells moi 
        prevCells = cells; // saved only
        drawCellInRightCoords("#fff");
    }
    else{
        log("","End move");
    } 
}

function drawCellInRightCoords(cellColor){
    /*
    -- cells=[1,2,1,1], phai nhan voi grid cho phu hop 
    */



    for(var i=0;i<cells.length;i++){
        
        if (cells[i]<0) //-- cells[i]=-1000 thi bo qua khong ve cell
            continue;
        
        if (i==0){ //--red
            _left = 9;
            _top = cells[i]+11; 

            var name = cellCoords[i].name + cellCoords[i].value;
            makeACell(_left*grid,_top*grid, name, cellColor);
            cellCoords[i].left = _left; 
            cellCoords[i].top = _top; 
        } 

        if (i==3){ //--green
            _left = cells[i]+11;
            _top = 11;

            var name = cellCoords[i].name + cellCoords[i].value;
            makeACell(_left*grid,_top*grid, name, cellColor);
            cellCoords[i].left = _left; 
            cellCoords[i].top = _top;  
        }
    }

    for(var i=cells.length;i>0;i--){ //-- blue 
        
        if (cells[i]<0) //-- cells[i]=-1000 thi bo qua khong ve cell
            continue;

        if (i==2){ //--blue
            _left = 11;
            _top = 9-cells[i]; 
            
            var name = cellCoords[i].name + cellCoords[i].value;
            makeACell(_left*grid,_top*grid, name, cellColor);
            cellCoords[i].left = _left; 
            cellCoords[i].top = _top; 
        }

        if (i==1){ //-- yellow
            _left = 9-cells[i];
            _top = 9; 

            var name = cellCoords[i].name + cellCoords[i].value;
            makeACell(_left*grid,_top*grid, name, cellColor);
            cellCoords[i].left = _left; 
            cellCoords[i].top = _top; 
        }

    }
    
}

function status(gamePlay){
    if (gamePlay){
        var elem = "<tr>"; 
        elem += "<td>"+(gamePlay.turn+1)+"</td>";
        elem += "<td>"+gamePlay.chess+":"+gamePlay.position+"</td>";
        elem += "<td>"+gamePlay.estScore+"</td>";
        elem += "<td>"+moment(gamePlay.time).format('LT')+"</td>";
        elem += "</tr>"; 
        $("table.gameplay").prepend($(elem));
    }
}

function getComment(comments){
    if (comments){
        var elem = ".comment"; 
        var html = comments.text;
        html += " <a href="+comments.link+">More...</a>";
        $(elem).html(html);
    }
} 

function endMove(){
    if (cells[0]>0 || cells[1]>0 || cells[2]>0  || cells[3]>0){
        return false; 
    }
    else 
        return true;
}

function moveToEnd(name){
    //-- Ket thuc, dua co ve cac vi tri canh bien 
    removeObject("circleX");

    if (name.indexOf("A1")>=0)
        moveObject(name,0,MAX_HEIGHT-grid);
    if (name.indexOf("A2")>=0)
        moveObject(name,1*grid,MAX_HEIGHT-grid);
    if (name.indexOf("A3")>=0)
        moveObject(name,2*grid,MAX_HEIGHT-grid);
    if (name.indexOf("A4")>=0)
        moveObject(name,3*grid,MAX_HEIGHT-grid);

     if (name.indexOf("B1")>=0)
        moveObject(name,0,0);
    if (name.indexOf("B2")>=0)
        moveObject(name,1*grid,0);
    if (name.indexOf("B3")>=0)
        moveObject(name,2*grid,0);
    if (name.indexOf("B4")>=0)
        moveObject(name,3*grid,0);

     if (name.indexOf("C1")>=0)
        moveObject(name,17*grid,0);
    if (name.indexOf("C2")>=0)
        moveObject(name,18*grid,0);
    if (name.indexOf("C3")>=0)
        moveObject(name,19*grid,0);
    if (name.indexOf("C4")>=0)
        moveObject(name,20*grid,0);

     if (name.indexOf("D1")>=0)
        moveObject(name,17*grid,MAX_HEIGHT-grid);
    if (name.indexOf("D2")>=0)
        moveObject(name,18*grid,MAX_HEIGHT-grid);
    if (name.indexOf("D3")>=0)
        moveObject(name,19*grid,MAX_HEIGHT-grid);
    if (name.indexOf("D4")>=0)
        moveObject(name,20*grid,MAX_HEIGHT-grid);
    
    lockChess(name);
    return;
}

function showSponsor(score){
    if (score.indexOf("cellred")>=0)
        $("#my-slider").sliderPro('gotoSlide',0);
    if (score.indexOf("cellyellow")>=0)
        $("#my-slider").sliderPro('gotoSlide',1);
    if (score.indexOf("cellblue")>=0)
        $("#my-slider").sliderPro('gotoSlide',2);
    if (score.indexOf("cellgreen")>=0)
        $("#my-slider").sliderPro('gotoSlide',3);
}

//-- check object top left voi cellCoords thi tang cells[i] tuong ung 
function updateCells(object, left,top){
    /*
    -- Neu object(l,t) khong dung voi enable cells thi lam lai return 
    -- Neu object(l,t) dung voi enable cells thi di tiep 
    -- Neu endMove() thi khong enable cell chuyen sang unlock diem va di chuyen con co 

    */

    if (endMove()==true){
        
        unlockChess(object.name);
        moveToEnd(object.name);

        unlockNextChess(object.name);     
        TURN++; //-- tang Turn neu da dat dung vi tri 
        var p = object.name.substring(0,1);
        getPlayerScore(p);
        return;  //-- phai return o day, da di xong!
    }

    //-- di binh thuong thi phai di dung vi tri moi duoc di tiep
    for(var i=0;i<cellCoords.length;i++){ //-- cellCoords.length = 4
        //-- xac dinh vi tri dung 
        if (cellCoords[i].left == left && cellCoords[i].top == top ){

            lockChess(object.name); //-- lock this chess 
            canvas.bringToFront(object);

            //-- Phai remove o day nua!?
            var name = ""+cellCoords[i].name + cellCoords[i].value;            
            removeObject(name);

            showSponsor(cellCoords[i].name);

            if (CONFIG.sound==1) placeFitSound.play();
            
            // log('.pos',"RIGHT position!");

            var pos = ""+colors[i]+cells[i]; //-- red1
            gamePlay.push({
                turn: TURN, chess: object.name, position: pos, 
                estScore: cells[i], score:0, done: 0,
                time: new Date()
            });

            status(gamePlay[gamePlay.length-1]);
            var l = getRandom(0,comments.length);
            getComment(comments[l]);
            
            prevCells = cells; // saved only
            cellCoords[i].value+=1;
            cells[i]+=1; //-- tang cells[i]

            if (cells[i]>=10){ //-- cells[i] da tang!
                cells[i]=-1000;
                cellCoords[i].value=-1000;
            }
            
            unlockNextChess(object.name);   
            
            TURN++; //-- tang Turn neu da dat dung vi tri 

            getChessScore(object.name);
            var p = object.name.substring(0,1);
            getPlayerScore(p);

            return;  //-- phai return o day, da di xong!
        }
        else {
            wrongPos(object.name); 

        }
        
    }

}

function wrongPos(name){
    // log('.pos',"WRONG position! Try again!");
    unlockChess(name);
}

//-- ROUND  1 tim next boi thischess
function findNextChess(thisChess){
    var res = "A1";
    if (TURN<chess.length-1){
        for(var i=0;i<chess.length-1;i++){
            if (chess[i]==thisChess){
                res = chess[i+1];
                break;
            }
        }
    }
    return res;
}



function unlockNextChess(thisChess){
    /*
    -- Neu so luot chua het thi unlock 
    -- Neu so luot da het thi unlock theo diem so unlockNextChessByScore
    */
    if (TURN<chess.length-1){
                
        _nextChess =findNextChess(thisChess);
        unlockChess(_nextChess);
        // log("","Next 1: "+_nextChess);

        //-- toi D4 la het 

        return;
    }
    else {
        
        unlockNextChessByScore();

    }
}

function findChessInGamePlay(score){
    var res = "";
    var pos = "";
    var turn = 0;
    for(var i=0;i<gamePlay.length;i++){
        if (gamePlay[i].position==score && gamePlay[i].done==0){
            res = gamePlay[i].chess; 
            pos = gamePlay[i].position; //--test
            turn = gamePlay[i].turn; //-- test

            gamePlay[i].done = 1;
            break;
        }
    }

    // log("", "Turn: " + turn + " | Pos: " + pos + " | chess: " + res);

    return res;
}

//-- tim trong gamePlay score nao (red1) thi active chess do (chessA1)
var currentScoreIndex = 0; //-- [0-35] de tim tiep trong gamePlay, tim tu dau se sai
function unlockNextChessByScore(){
   
    var name, scoreName; 
    for(var i=0;i<score.length;i++){
        scoreName = score[i];
        name = findChessInGamePlay(scoreName);

        if (name!=""){
            
            unlockScore(scoreName);
            unlockChess(name);
            // moveToBasket(name,scoreName); //-- challenge ben duoi 

            //-- challenge

            if (CONFIG.challenge==1 && name.indexOf("A")>=0){
                count = 4;
                countDownText("3",'orange', 10.5*grid, 10.5*grid);
                countDown();
                _objectTimer = setInterval(countDown, 1000);
                setTimeout(challenge(name, scoreName),4*1000);
                
                challenge(name, scoreName);
            }
            else{
                moveToBasket(name,scoreName);
            }

            return;
        }
    }
    
    
}


function challenge(name, scoreName){

    setTimeout(function(){   //-- wait de het de count down 
        
        if (CONFIG.sound==1) questionSound.play();

        var q = yesNoQuestion(); //-- get random ques
        var ANSWER = false; 
        
        notie.setOptions({
            // colorSuccess: '#57BF57',
            // colorWarning: '#D6A14D',
            // colorError: '#E1715B',
            // colorInfo: '#4D82D6',
            // colorNeutral: '#A0A0A0',
            // colorText: '#FFFFFF',
            // dateMonths: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'], // For other languages
            // animationDelay: 300, // Be sure to also change "transition: all 0.3s ease" variable in .scss file
            backgroundClickDismiss: false
        })

        notie.confirm(q, 'True', 'False', 
            function(){
                notie.alert(1, 'Good choiced!', 0.5);
                setTimeout(function(){
                    moveToBasket(name,scoreName);
                },2*1000);
            }, 
            function(){ //-- no 
                notie.alert(3, 'Opps, Wrong answer. No scored!', 0.5);  
                moveOut(name,scoreName);
                //-- tru diem?
            }
        );

    },3*1000);

}

function moveOut(name,scoreName){
    _left = 21;
    _top += 1;

    moveObject(scoreName,_left*grid,_top*grid);

}

function isChess(name){
    var res = false; 
    for(var i=0;i<chess.length;i++){
        if (chess[i] == name){
            res =true;
            break;
        }
    }

    return res;
}

//--- move chess to current cells[]
function randomMove(chessName){
    
    var chess = canvas.getItemByName(chessName);
    if (isChess(chessName) && chess.selectable==true && chessName.indexOf("A")<0){
        
        var i = getRandom(0,4);
        while (cellCoords[i].value<0){
            i = getRandom(0,4); //-- cellCoords.length=4
        }

        _left = cellCoords[i].left*grid;
        _top = cellCoords[i].top*grid;
        
        moveObject(chessName,_left, _top);
        
        chess.left = _left; //-- phai set lai - CHINH XAC
        chess.top = _top;

        updateCells(chess, chess.left/grid, chess.top/grid);
        enableCells(); //-next 
    }
    else {
        log("","Not a chess");
    }
}

function countDownText(text, color, left, top){
    //-- add text 
    var text = new fabric.Text(
        text,
        {
            name: "countdown",
            fill: color,
            left: left, top: top,
            fontSize: 65, fontFamily: "Arial",
            originX: 'center', originY: 'center',
            selectable: false, hasControls: false,
        }
    );
    
    canvas.add(text);
    canvas.bringToFront(text);
}

function getPlayerScore(player){ //-- A B C D
    
    var total = 0;
    for(var i=0;i<gamePlay.length;i++){
        if (gamePlay[i].chess.indexOf(player)>=0){
            total += gamePlay[i].estScore;
        }
    }
    var total2 = getBasketScore(player);

    //-- log(element, msg) -- ".A"
    var elem = 'td.'+player;
    log(elem, total);
    elem = 'td.'+player + ".final";
    log(elem, total2);


}

function getChessScore(chess){ //-- A1 B1 C1 D1
    
    var total = 0;
    for(var i=0;i<gamePlay.length;i++){
        if (gamePlay[i].chess.indexOf(chess)>=0){
            total += gamePlay[i].estScore;
        }
    }

    //-- log(element, msg) -- ".A"
    var elem = 'td.'+chess;
    log(elem, total);
}

function getRandom(min,max){
    return Math.floor((Math.random() * max) + min);
}

function yesNoQuestion(){
    
    var questions = [
        '1+1=2  RIGHT?',
        '2+1=3  RIGHT?',
        '3+1=4  RIGHT?',
        '4+1=5  RIGHT?',
        '5+1=6  RIGHT?',
        '6+1=7  RIGHT?',
    ];

    var soCauHoi =5;
    var r = getRandom(0,soCauHoi);

    return questions[r];
    
}


var basket = [
    {name: 'A', start:0, left: 0, top: 18 }, //-- maxnumber
    {name: 'B', start:0, left: 0, top: 1 },
    {name: 'C', start:13, left: 13, top: 1},
    {name: 'D', start:13, left: 13, top: 18 }
];

var basketValue = [
    // { name: "A", score: "red1", points: 1}
];

function moveToBasket(name, scoreName){

    var obj = canvas.getItemByName(scoreName);
    // log("",scoreName);
    // removeObject("circleX");

    for(var i=0;i<basket.length;i++){  //-- basket.length=4
        if (name.indexOf(basket[i].name)>=0){ //-- chess 'A'1 thi obj ve basket A
            
            moveObject(obj.name, basket[i].left*grid, basket[i].top*grid);
            
            // if (obj.name=="green9")
            //     log("","Game End!");
            //--End Game here 
            if (obj.name=="green9"){ //-obj.name = scoreName moved
                gameEnd();
            }
            
            //-- tinh tong basket
            basketValue.push({name: basket[i].name, score:obj.name, points: obj.value});
            // log("",basketValue);

            //-- tang vi tri cua basket 
            if (basket[i].name=="A") { 
                if (basket[i].left==7){
                    basket[i].left = 0;
                    basket[i].top += 1;                    
                } 
                else { 
                    basket[i].left += 1;
                    basket[i].top += 0;
                }
                return;
            }

            if (basket[i].name=="B") { 
                if (basket[i].left==7){
                    basket[i].left = 0;
                    basket[i].top += 1;                    
                } 
                else { 
                    basket[i].left += 1;
                    basket[i].top += 0;  //- khong tang so voi top cu
                }
                return;
            }

            if (basket[i].name=="C") { 
                if (basket[i].left==19){
                    basket[i].left = 13;
                    basket[i].top += 1;                    
                } 
                else { 
                    basket[i].left += 1;
                    basket[i].top +=0; 
                }
                return;
            }

            if (basket[i].name=="D") { 
                if (basket[i].left==19){
                    basket[i].left = 13;
                    basket[i].top += 1;                    
                } 
                else { 
                    basket[i].left += 1;
                    basket[i].top += 0;
                }

                

                return;
            }

        }

    }

}

function gameEnd(){
    $('#modal2').openModal();
}

//-- basket A=playerA
function getBasketScore(basketName){
    var total = 0;
    for(var i=0;i<basketValue.length;i++){
        if (basketValue[i].name==basketName){
            total+= parseInt(basketValue[i].points);
        }
    }

    return total;
}


//-- get from Score 
function getValueByObject(object){
    var name = object.name; 
    var res = 0;
    res = canvas.getItemByName(name).value;
    return res;
}

function getValueByName(name){
    var res = 0;
    res = canvas.getItemByName(name).value;
    return res;
}

//-- snap to grid for on( object: moving ) 
function snapToGrid(object){
    var activeObject = object;
    activeObject.set({
        left: Math.round(object.left / grid) * grid,
        top: Math.round(object.top / grid) * grid
    });

    //-- gioi han duong bien cho top, left    
    if (activeObject.top <= 0) activeObject.top = 0;
    if (activeObject.left <= 0) activeObject.left = 0;
    if (activeObject.top >= MAX_HEIGHT-grid) activeObject.top = MAX_HEIGHT-grid;
    if (activeObject.left >= MAX_WIDTH-grid) activeObject.left = MAX_WIDTH-grid;

    canvas.renderAll();
}

//------------------------------------------------------------------------------
function unlockChess(name){
    //-- unlockChess va hieu ung
    var obj = canvas.getItemByName(name);
    obj.set({
        selectable: true,
        lockMovementX: false, 
        lockMovementY: false,
    });

    canvas.bringToFront(obj);

    if (CONFIG.sound==1) unlockSound.play();

    unlockEffect(obj.name);
    // if (CONFIG.random ==1)
}


function lockChess(name){
    //-- lockChess va hieu ung
    var obj = canvas.getItemByName(name);
    obj.set({
        selectable: false,
        lockMovementX: true, 
        lockMovementY: true,
    });
}

function unlockEffect(name){
    var obj = canvas.getItemByName(name);
    drawACircle(obj.left-grid/2, obj.top-grid/2, obj.width/2+grid/2);
}

function unlockScore(name){
    //-- unlockChess va hieu ung
    var obj = canvas.getItemByName(name);
    obj.set({
        selectable: true,
        lockMovementX: false, 
        lockMovementY: false,
    });

    canvas.bringToFront(obj);

    if (CONFIG.sound==1) unlockSound.play();
    // if (CONFIG.random ==1)
}


function removeObject(name){
    var obj = canvas.getItemByName(name);
    canvas.remove(obj);
    canvas.renderAll();
}

function drawACircle(left,top, radius){
    removeObject("circleX");

    var circle = new fabric.Circle({ 
        name: "circleX", //custom prop
        left: left,  top: top, 
        radius: radius, //-- grid/2+10, 
        fill: 'rgba(0,0,0,0)', // transperaent
        stroke: "orange", strokeWidth: 3,
        //shadow: 'rgba(0,0,0,0.4) 5px 5px 7px',
        selectable: false, hasControls: false,
        //  originX: "center", originY: "center",
    }); 

    canvas.add(circle);
    canvas.sendBackwards(circle);

    // var opa = 0.2; 
    // blinkObject("circleX", opa);
    return circle;
}



//-------------------------------------------

function moveObject(name, toL, toT){
    var object = canvas.getItemByName(name);
    // object.set({
    //     shadow: '#666 2px 2px 3px',
    // });

    object.animate('left', toL, {
      onChange: canvas.renderAll.bind(canvas),
      duration: 1*1000,
      // easing: fabric.util.ease.easeInBounce
    });

    object.animate('top', toT, {
      onChange: canvas.renderAll.bind(canvas),
      duration: 1*1000,
      // easing: fabric.util.ease.easeInBounce
    });
} 

function blinkObject(name, opa){
    var object = canvas.getItemByName(name);
    // object.set({
    //     // shadow: '#666 2px 2px 3px',
    //     fill: '#fff'
    // });

    object.animate('opacity', opa, {
      onChange: canvas.renderAll.bind(canvas),
      duration: 1*1000,
      // easing: fabric.util.ease.easeOutExpo
    });

    object.animate('opacity', 1, {
      onChange: canvas.renderAll.bind(canvas),
      duration: 1*1000,
      // easing: fabric.util.ease.easeOutExpo
    });

    // object.animate('height', H, {
    //   onChange: canvas.renderAll.bind(canvas),
    //   duration: 2*1000,
    //   easing: fabric.util.ease.easeOutExpo
    // });
    
} 



//--------------------------------------------
/**
 * Item name is unique
 */
fabric.Canvas.prototype.getItemByName = function(name) {
    var object = null,
      objects = this.getObjects();

    for (var i = 0, len = this.size(); i < len; i++) {
        if (objects[i].name && objects[i].name === name) {
          object = objects[i];
          break;
        }
    }

    return object;
};

fabric.Canvas.prototype.getItemByNameInGroup = function(name) {
    // the fun part!
    var objsInCanvas = canvas.getObjects();
    var resObj = canvas.getObjects();
    for (obj in objsInCanvas) {
        // this gives you a group
        if(objsInCanvas[obj].get('type')==='group') {
            // get all the objects in a group
            var groupObjects = objsInCanvas[obj].getObjects();
            // iterate through the group
            for (thing in groupObjects) {
                // grab the text of any 'text' objects
                if(groupObjects[thing].get('type')===('text')) {
                    // 'example text' is logged in console
                    // console.log(groupObjects[thing].getText());
                    resObj = groupObjects[thing];
                }
            };
        }
    };

    return resObj;
};


