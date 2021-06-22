import Page from "./main.js";

var app=new Page();

app.data.menu=[{name:"login",action:"login"}];
app.methods.login=function(d){
    console.log("Hello login");
    console.log(d);
    app.data.menu=[{name:"home",action:"home"}];
}
//app.render();