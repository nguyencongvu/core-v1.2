// JavaScript Document
$.fn.preloader = function(options)
{
    /*
        we declare and precache the variables that
        we will be using in the rest of the plugin.
    */
    var defaults = 
    {
        delay:200,
        preload_parent:"a",
        check_timer:300,
        ondone:function(){ },
        oneachload:function(image){  },
        fadein:500 
    };
    
    // variables declaration and precaching images and parent container
    var options = $.extend(defaults, options),
    root = $(this) , images = root.find("img").css({"visibility":"hidden",opacity:0}) ,  timer ,  counter = 0, i=0 , checkFlag = [] , delaySum = options.delay ,
     
    init = function()
    {
        timer = setInterval(function()
        {
            if(counter>=checkFlag.length)
            {
                clearInterval(timer);
                options.ondone();
                return;
            }
        
            for(i=0;i<images.length;i++)
            {
                if(images[i].complete === true)
                {
                    if(checkFlag[i] === false)
                    {
                        checkFlag[i] = true;
                        options.oneachload(images[i]);
                        counter++;
                        
                        delaySum = delaySum + options.delay;
                    }
                    
                    $(images[i]).css("visibility","visible").delay(delaySum).animate({opacity:1},options.fadein,function()
                    {
                        $(this).parent().removeClass("preloader");
          });
                }
            }
        
        },options.check_timer) 
    } ;
    
    /*
        We now will iterate over each image element,
        and check if its parent is the one mentioned in the option.
        If so,
        we add our preloader class to it;
        else,
        we wrap the image within an anchor tag with a class of preloader.
    */
    
    images.each(function()
    {
        if($(this).parent(options.preload_parent).length === 0)
            $(this).wrap("<a class='preloader' />");
        else
            $(this).parent().addClass("preloader");

        checkFlag[i++] = false;
    });

    images = $.makeArray(images);
    
    var icon = jQuery("<img />",{
        id : 'loadingicon' ,
        src : 'css/i/89.gif'        
    }).hide().appendTo("body");
    
    timer = setInterval(function()
    {
        if(icon[0].complete === true)
        {
            clearInterval(timer);
            init();
      icon.remove();
            return;
        }
    },100);
    
}