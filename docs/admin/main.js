export default class Page {
    emptyElems = ['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'];
    eventTypes = ["click"];
    body = {};
    data = {};
    methods = {};
    current = {};
    loader = {
        on: function () {
            $("#loader").show();
        },
        off: function () {
            $("#loader").hide();
        }
    }

    isEmptyElement = function (elem) {
        return this.emptyElems.indexOf(elem.tagName.toLowerCase()) !== -1;
    }

    parseElement = function (element) {
        var json = {};
        if (element.nodeType == Node.TEXT_NODE && element.textContent.trim() != "") {
            json.tag = "span";
            json.text = element.textContent.trim();
            return json;
        }
        if (element.nodeType != Node.ELEMENT_NODE) return null;
        console.log("Parsing : " + element.tagName + " " + element.className);
        json.tag = element.tagName.toLowerCase();
        var attrNames = element.getAttributeNames();
        if (attrNames.length > 0) json.attributes = [];
        attrNames.forEach(n => {
            if (n == "react") {
                json.react = element.getAttribute(n);
                json.attributes.push({name:"index",value:"@index"});
            }
            json.attributes.push({ name: n, value: element.getAttribute(n) });
        });
        json.empty = this.isEmptyElement(element);
        if (element.childElementCount > 0) {
            json.children = [];
            for (var i = 0; i < element.childNodes.length; i++) {
                var child = this.parseElement(element.childNodes[i]);
                if (child != null) json.children.push(child);
            }
        }
        else {
            json.text = element.innerText;
        }
        return json;
    }

    compare = function (x, y) {
        if (x!=null && x instanceof Object) {
            if (y==null || !y instanceof Object) return false;
            for (var k in x) {
                if (!this.compare(x[k], y[k])) return false;
            }
        }
        else {
            return x == y;
        }
    }

    render = function () {
        var html = "";
        this.body.children.forEach(n => html += this.generateElement(n));
        document.body.innerHTML = html;
        this.current=JSON.parse(JSON.stringify(this.data));
        this.loader.off();
    }

    generateElement = function (json) {
        var text = "";
        text += "<" + json.tag;
        for (var i in json.attributes) {
            text += " " + json.attributes[i].name + "=\"" + json.attributes[i].value + "\"";
        }
        if (json.empty) text += " />";
        else if (json.children == null || json.children.length == 0) text += ">" + json.text + "</" + json.tag + ">";
        else {
            text += ">\n";
            for (var i in json.children) {
                text += this.generateElement(json.children[i]);
            }
            text += "</" + json.tag + ">";
        }
        if (json.react != null) {
            text = this.processReact(text, json.react);
        }
        return text;
    }

    processReact = function (text, react) {
        if(this.data[react]==null) return text;
        if (this.data[react] instanceof Array) {
            var iterative = "";
            for (var s in this.data[react]) {
                iterative += text;
                for (var x in this.data[react][s]) {
                    iterative = iterative.replaceAll("@index",s);
                    iterative = iterative.replaceAll("@" + react + "." + x, this.data[react][s][x]);
                }
            }
            return iterative;
        }
        else if (this.data[react] instanceof Object) {
            for (var x in this.data[react]) {
                text = text.replaceAll("@" + react + "." + x, this.data[react][x]);
                text = text.replaceAll("index=\"@index\"","");
            }
            return text;
        }
        else {
            return text.replaceAll("@" + react, this.data[react]);
        }
    }

    checkEvent = function (event) {
        console.log(event);
        console.log("Triggered " + event.type + " on ", event.target);
        var element = event.target;
        console.log(element.getAttributeNames());
        if (element.getAttributeNames().filter(a => a == "act").length == 0) {
            console.log("Target Element doesnt have act");
            return;
        }
        console.log("Target Element has act");
        var action = element.getAttribute("act");
        var react = element.getAttribute("react");
        var d=null;
        if(react!=null){
            if(this.data[react]!=null && this.data[react] instanceof Array){
                d=this.data[react][element.getAttribute("index")];
            }else{
                d=this.data[react];
            }
        }
        if(this.methods[action]==null){
            console.error("No Action method "+action+" is defined");
            return;
        }
        console.error("Triggering Action method "+action+" is defined");
        this.methods[action](d);

        this.render();
    }


    load = function (event) {
        this.loader.on();
        // Parsing entire document body into json
        this.body = this.parseElement(document.body);
        console.log(this.body);

        // listen all user events at document level
        this.eventTypes.forEach(type => $(document).on(type, event => this.checkEvent(event)));

        // Emptying document body
        document.body.innerHTML = ""

        // Initial Rendering
        this.render();
    }

    constructor(data) {
        if(data!=null)this.data=data;
        this.load();
        setInterval(function(p){
            if(!p.compare(p.data,p.current))p.render();
        },1000,this)
    }
}