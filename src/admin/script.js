import Page from "./main.js";

var app = new Page();

app.data.menu = [{ name: "login", action: "login" }];
app.methods.login = function (d) {
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    firebase.auth().signInWithPopup(provider).then(function (result) {
        // This gives you a Google Access Token.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        console.log("User Logged In : ",user);
        data.user = user;
    });
}
