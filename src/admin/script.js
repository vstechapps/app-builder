const emptyElems = ['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'];
const eventTypes=["click"];
var body={};


var data={
    user:undefined,
    menu:[{name:"login",action:"login()"}]
}

const isEmptyElement=function(elem) {
    return emptyElems.indexOf( elem.tagName.toLowerCase() ) !== -1;
}

const parseElement=function(element){
    var json={};
    if(element.nodeType==Node.TEXT_NODE && element.textContent.trim()!=""){
        json.tag="span";
        json.text=element.textContent.trim();
        return json;
    }
    if(element.nodeType!=Node.ELEMENT_NODE)return null;
    console.log("Parsing : "+element.tagName+" "+element.className);
    json.tag=element.tagName.toLowerCase();
    var attrNames=element.getAttributeNames();
    if (attrNames.length > 0) json.attributes = [];
    attrNames.forEach(n => { json.attributes.push({ name: n, value: element.getAttribute(n) }) });
    json.empty=isEmptyElement(element);
    if (element.childElementCount > 0) {
        json.children = [];
        for (var i=0;i<element.childNodes.length;i++) {
            var child=parseElement(element.childNodes[i]);
            if(child!=null)json.children.push(child);
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
    var html="";
    body.children.forEach(n=>html+=generateElement(n));
    document.body.innerHTML=html;
    loader.off();
}

const generateElement=function(json){
    var text="";
    var react=null;
    text+="<"+json.tag;
    for(var i in json.attributes){
        if(json.attributes[i].name=="react")react=json.attributes[i].value;
        text+=" "+json.attributes[i].name+"=\""+json.attributes[i].value+"\"";
    }
    if (json.empty) text += " />";
    else if (json.children == null || json.children.length == 0) text + ">" + json.text + "</" + json.tag + ">";
    else {
        text += ">\n";
        for (var i in json.children) {
            text += generateElement(json.children[i]);
        }
        text+="</"+json.tag+">";
    }
    return text;
}

const checkEvent=function(event){
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
    loader.on();
    // Parsing entire document body into json
    body=parseElement(document.body);
    console.log(body);

    // listen all user events at document level
    eventTypes.forEach(type=>$(document).on(type,event=>checkEvent(event)));

    // Emptying document body
    document.body.innerHTML=""
    
    // Initial Rendering
    render();
}

document.addEventListener("DOMContentLoaded", function(event) {
    load();      
});