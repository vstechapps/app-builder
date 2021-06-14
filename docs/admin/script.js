var actions=["click"];
performAction=function(event){
    console.log(event);
    console.log("Triggered "+event.type+" on ",event.target);
    var element=event.target;
}
actions.forEach(action=>{
    $(document).on(action,event=>performAction(event));
});



