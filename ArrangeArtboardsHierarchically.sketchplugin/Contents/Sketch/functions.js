function DrawArtboards(artboards,x,y){
    var incrementY = 0;

    for(var i=0;i<artboards.length;i++){
        if(alreadyProcessed.indexOf(artboards[i])<0)
        {
        
        //console.log(who+": Allocating "+artboards[i].name()+" to ("+x+","+(y+incrementY)+")"); 

        var yAcc=0;
        var descendants=[];
        var brothers=[];
        var hadChildren=false;
        var hadBrothers=false; 
        
        artboards[i].frame().x = x;
        artboards[i].frame().y = y+incrementY;


        var nodes = artboards[i].name().split("/");
        var prefix = "";
        var fullPrefix="";
        for(var j=0;j<nodes.length;j++){
            if(j<nodes.length-1)
            prefix += nodes[j]+"/";
            
            fullPrefix += nodes[j]+"/";
        }

        descendants = getDescendants(fullPrefix);
        brothers = getBrothers(prefix);


        alreadyProcessed.push(artboards[i]);

        var yDescendants = DrawArtboards(descendants, x+artboards[i].frame().width()+horizontalGutter, y+incrementY);

        if(yDescendants > artboards[i].frame().height())
            incrementY += yDescendants;
        else
            incrementY += artboards[i].frame().height();
        

        if(i<(artboards.length-1))
            incrementY += verticalGutter;

        
        var yBrothers = DrawArtboards(brothers, x, y+incrementY);
        incrementY += yBrothers
        if(i<(artboards.length-1) && (brothers.length>0))
            incrementY += verticalGutter;
        
        }
    }

    return incrementY;
}

function DrawArtboardsRows(artboards,x,y){
    var incrementX = 0;

    for(var i=0;i<artboards.length;i++){
        if(alreadyProcessed.indexOf(artboards[i])<0)
        {
        
        //console.log(who+": Allocating "+artboards[i].name()+" to ("+x+","+(y+incrementY)+")"); 

        var xAcc=0;
        var descendants=[];
        var brothers=[];
        var hadChildren=false;
        var hadBrothers=false; 
        
        artboards[i].frame().x = x+incrementX;
        artboards[i].frame().y = y;


        var nodes = artboards[i].name().split("/");
        var prefix = "";
        var fullPrefix="";
        for(var j=0;j<nodes.length;j++){
            if(j<nodes.length-1)
            prefix += nodes[j]+"/";
            
            fullPrefix += nodes[j]+"/";
        }

        descendants = getDescendants(fullPrefix);
        brothers = getBrothers(prefix);


        alreadyProcessed.push(artboards[i]);

        var xDescendants = DrawArtboardsRows(descendants, x+incrementX, y+artboards[i].frame().height()+verticalGutter);

        if(xDescendants > artboards[i].frame().width())
            incrementX += xDescendants;
        else
            incrementX += artboards[i].frame().width();
        

        if(i<(artboards.length-1))
            incrementX += horizontalGutter;

        
        var xBrothers = DrawArtboardsRows(brothers, x+incrementX, y);
        incrementX += xBrothers
        if(i<(artboards.length-1) && (brothers.length>0))
            incrementX += horizontalGutter;
        
        }
    }

    return incrementX;
}


function getDescendants(nodeName){
    var descendants = [];

    artboardList.forEach(function(artboard)
    {
        var startsbythis = artboard.name().startsWith(nodeName);
        if(startsbythis)
        {
            descendants.push(artboard);
        }
    });

    descendants.sort(sortArtboardsFunction);

    //console.log("Descendants of: "+nodeName);
    //descendants.forEach(function(artboard){ console.log("  "+artboard.name()); });
    return descendants;
}

function getBrothers(nodeName){
    var brothers = [];
    var slashCount =  nodeName.split("/").length;  
    artboardList.forEach(function(artboard)
    {
        var startsbythis = artboard.name().startsWith(nodeName);
        if(startsbythis &&  artboard.name().split("/").length == slashCount)
        {
            brothers.push(artboard);
        }
    });

    brothers.sort(sortArtboardsFunction);
    //console.log("Brothers of: "+nodeName);
    //brothers.forEach(function(artboard){ console.log("  "+artboard.name()); });
    return brothers;
}

function sortArtboardsFunction(a, b) {
    if (a.name() === b.name()) {
        return 0;
    }
    else {
        return (a.name() < b.name()) ? -1 : 1;
    }
}

function getFullArtboardList(context){
    var page = context.document.currentPage();
    var doc = context.document;
    var artboardList = page.artboards();
    artboardList.sort(sortArtboardsFunction);
    return artboardList;
}

function zoomToView(context)
{
    var view;
    if (MSApplicationMetadata.metadata().appVersion < 48) {
        view = context.document.currentView();
    } else {
        view = context.document.contentDrawView();
    }

    view.centerLayersInCanvas();
}

function ShowConfirmation(context, message)
{
    context.document.showMessage(message);
}