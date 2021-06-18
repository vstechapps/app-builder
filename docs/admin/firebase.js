var firebaseConfig = {
    apiKey: "AIzaSyAwo-lJvaCI-66unophxOBGUt34j7FjplM",
    authDomain: "vvsk-appbuilder.firebaseapp.com",
    projectId: "vvsk-appbuilder",
    storageBucket: "vvsk-appbuilder.appspot.com",
    messagingSenderId: "590651475648",
    appId: "1:590651475648:web:6c53f269a995c3b3b80f25",
    measurementId: "G-LHVLC70KL6"
};
firebase.initializeApp(firebaseConfig);
firebase.analytics();

var auth = firebase.auth();

login=function(){
var provider = new firebase.auth.GoogleAuthProvider();
provider.addScope('profile');
provider.addScope('email');
auth.signInWithPopup(provider).then(function(result) {
 // This gives you a Google Access Token.
 var token = result.credential.accessToken;
 // The signed-in user info.
 var user = result.user;
 console.log(user);
 data.user=user;
});
}