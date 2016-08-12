var colors = [
    "red","blue","green","orange", // 0 1 2 3  
    "pink", "purple", "light-blue", "cyan", // 4 5 6 7  
    "deep-purple", "indigo", "teal", "lime", // 8 9 10 11
    "light-green", "yellow", "amber", "deep-orange", // 12 13 14 15
    "brown", "grey", "blue-grey", "black"      // 16 17 18 19
];

// colors = ['green', 'deep-purple']

var i = getRandomInteger(0,2);
i = 3;
var COLOR = colors[i].toString();

function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

//-- animate.css
function animationHover(element, animation){
    element = $(element);
    element.hover(
        function() {
            element.addClass('animated ' + animation);        
        },
        function(){
            //wait for animation to finish before removing classes
            window.setTimeout( function(){
                element.removeClass('animated ' + animation);
            }, 2000);         
        });
}

function animationClick(element, animation){
    element = $(element);
    element.click(
        function() {
            element.addClass('animated ' + animation);        
            //wait for animation to finish before removing classes
            window.setTimeout( function(){
                element.removeClass('animated ' + animation);
            }, 2000);         
  
        });
}

function animation(element, animation){
    element.addClass('animated ' + animation);        
    //wait for animation to finish before removing classes
    window.setTimeout( function(){
        element.removeClass('animated ' + animation);
    }, 2000);         

}