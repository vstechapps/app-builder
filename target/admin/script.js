var data={
    user:undefined,
    menu:[{name:"login",action:"login()"}]
}

const compare=function(x,y){
    if(x instanceof Object){
        if(! y instanceof Object) return false;
        for(k in x){
            if(!compare(x[k],y[k]))return false;
        }
    }
    else{
        return x==y;
    }
}

const loader={
    on:function(){
        $("#loader").show();
    },
    off:function(){
        $("#loader").show();
    }
}

const render=function(changes){
    $("[react]").each((index,element)=>{
        var change=data[element.attributes["react"].nodeValue];
        if(change!=null){
            console.log("Data changes occured on "+change);
            loader.on();
            alert("changing");
            if(data[change] instanceof Object){
                var parent=element.parentNode;
                var html=parent.innerHTML;
                $(parent).empty();
                for(i in data[change]){
                    parent.appendChild(html.replace("menu","login"));
                }
            }
            loader.off();
        }
    });
}

checkEvent=function(event){
    console.log(event);
    console.log("Triggered "+event.type+" on ",event.target);
    var element=event.target;
    if(element.attributes.filter(a=>{a=="act"})==0){
        console.log("Target Element doesnt have act");
        return;
    }
    console.log("Target Element has act");
    var action=element.attributes["act"];
    var current=JSON.parse(JSON.stringify(data));
    eval(action);
    var changes=compare(current,data);
    render(changes);
}

// Code to listen all user events at document level
var eventTypes=["click"];
eventTypes.forEach(type=>$(document).on(type,event=>checkEvent(event)));

// Initial Rendering
render(compare({},data));