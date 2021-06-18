var data={
    user:undefined,
    menu:[{name:"login",action:"login()"}]
}


parseElement=function(element){
    console.log("Parsing : "+element.tagName+" "+element.className);
    var json={tag:element.tagName};
    var attrNames=element.getAttributeNames();
    if (attrNames.length > 0) json.attributes = [];
    attrNames.forEach(n => { json.attributes.push({ name: n, value: element.getAttribute(n) }) });
    if (element.childElementCount > 0) {
        json.children = [];
        for (var i=0;i<element.childElementCount;i++) {
            json.children.push(parseElement(element.children[i]));
        }
    }
    else{
        json.text=element.innerText;
    }
    return json;
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
        $("#loader").hide();
    }
}

const render=function(){
    $("[react]").each((index,element)=>{
        var n=element.attributes["react"].nodeValue;
        var d=data[n];
        if(d instanceof Object){ 
            loader.on();            
            if(d instanceof Object){
                
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


load=function(){
    // Parsing entire document body into json
    var body=parseElement(document.body);
    console.log(body);

    // listen all user events at document level
    var eventTypes=["click"];
    eventTypes.forEach(type=>$(document).on(type,event=>checkEvent(event)));

    
    // Initial Rendering parsed body to html
    render(compare({},data));
}

document.addEventListener("DOMContentLoaded", function(event) {
    load();      
});