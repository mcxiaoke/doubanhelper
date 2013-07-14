/**
 * User: mcxiaoke
 * Date: 13-7-13
 * Time: 下午2:46
 */

//API Key 06fd45e1d2ad245a14f7d1a578076d0e
//Secret b29538157b254bd1

function read(key){
    return localStorage.getItem(key);
}

function save(key,value){
    localStorage.setItem(key,value);
}

function remove(key){
   localStorage.removeItem(key);
}

function show(id){
    var element=document.getElementById(id);
    if(element){
        element.style.display ='block';
    }
}

function hide(id){
    var element=document.getElementById(id);
    if(element){
        element.style.display ='none';
    }
}

function getById(id){
    return document.getElementById(id);
}

function showStatus(text){
    show("status");
    updateStatus(text);
}

function updateStatus(text){
    var status=getById("status");
    status.innerHTML=text;
}

function hideStatus(){
    hide("status");
}

// Restores select box state to saved value from localStorage.
function restore_options() {
    var keyElement=getById("api_key");
    var secretElement=getById("secret");
    var tokenElement=getById("token");
    var key=read("api_key");
    var secret=read("secret");
    var token=read("token");
    console.log("restore_options() key="+key+" secret="+secret+" token="+token);
    if(key){
       keyElement.value=key;
    }
    if(secret){
        secretElement.value=secret;
    }
    if(token){
        tokenElement.value=token;
    }
    showStatus("Options Restored!");
}

function getAuthUrl(config) {
    return ('https://www.douban.com/service/auth2/auth?' +
        'client_id={{CLIENT_ID}}&' +
        'scope={{API_SCOPE}}&'  + 'response_type=token&'+
    'redirect_uri={{REDIRECT_URI}}').replace('{{CLIENT_ID}}', config.clientId)
        .replace('{{API_SCOPE}}', config.apiScope)
        .replace('{{REDIRECT_URI}}', config.redirectURL);
}

function getApiScope(){
    return "douban_basic_common,shuo_basic_r,shuo_basic_w," +
        "community_basic_note,community_basic_user," +
        "community_basic_photo,movie_basic,movie_basic_r,book_basic_r,music_basic_r";
}

function handleCallback(){
    var url = decodeURIComponent(window.location.href);
    console.log("url is "+url);
    console.log("url type is "+typeof url);
    if(url.indexOf("callback")!=-1){
        var tokenExp=new RegExp(/access_token=(\w+)&/);
        var token=url.match(tokenExp);
        if(token && token.length>1){
            console.log("token is "+token[1]);
        }
    }
}

// Saves options to localStorage.
function onSaveClick(){
    var key=getById("api_key").value;
    var secret=getById("secret").value;
    var token=getById("token").value;
    save("api_key",key);
    save("secret",secret);
    save("token",token);
    console.log("onSaveClick() key="+key+" secret="+secret+" token="+token);

    var config=new Object();
    config.clientId=key;
    config.apiScope= getApiScope();
    config.redirectURL="http://www.douban.com/robots.txt";
    var authUrl=getAuthUrl(config);

    var oauth=getById("oauth");
    var text="<p>点击地址进行验证，验证完后填写AccessToken，然后点保存：<br /><a href=\""+authUrl+"\">Click Me</a></p>";
    oauth.innerHTML=text;
    show("oauth");
//    showStatus("Options Saved!");

}

function onClearClick(){
    remove("api_key");
    remove("secret");
    remove("token");
    var keyElement=getById("api_key");
    var secretElement=getById("secret");
    var tokenElement=getById("token");
    keyElement.value="";
    secretElement.value="";
    tokenElement.value="";
    showStatus("Options Cleared!");
}

function addListeners(){
    document.addEventListener('DOMContentLoaded', restore_options);
    document.querySelector("#save").addEventListener('click', onSaveClick);
    document.querySelector("#clear").addEventListener('click', onClearClick);
}

addEventListener();
handleCallback();
