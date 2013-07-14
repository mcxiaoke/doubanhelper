var DOUBAN_API_HOST="https://api.douban.com/v2";
var DOUBAN_API_SHUO_HOST="https://api.douban.com/shuo/v2"

createStatusMenu();
createUserMenu();
chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.executeScript(null,
        {code:"document.body.bgColor='red'"});
});


function createStatusMenu(){
    var context="link";
    var title=chrome.i18n.getMessage("menu_status_api");
    var targetUrlPatterns=["http://www.douban.com/people/*/status/*"];
    var id=chrome.contextMenus.create({"title":title, "contexts":[context],"onclick":onStatus,
//        "documentUrlPatterns":["http://www.douban.com/update*","http://www.douban.com/people/*"],
        "targetUrlPatterns":targetUrlPatterns});
    console.log("createStatusMenu() '" + context + "' item:" + id);

}

function createUserMenu(){
    var context="link";
    var titleProfile=chrome.i18n.getMessage("menu_profile_api");
    var titleTimeline=chrome.i18n.getMessage("menu_timeline_api");
    var targetUrlPatterns= ["http://www.douban.com/people/*","http://www.douban.com/people/*/status/*"];
    var id1=chrome.contextMenus.create({"title":titleProfile, "contexts":[context],"onclick":onUserProfile,
        "targetUrlPatterns":targetUrlPatterns});
    var id2=chrome.contextMenus.create({"title":titleTimeline, "contexts":[context],"onclick":onUserTimeline,
        "targetUrlPatterns":targetUrlPatterns});
    console.log("createUserMenu() '" + context + "' item:" + id1);
    console.log("createUserMenu() '" + context + "' item:" + id2);
}

function openStatusApiUrl(statusId){
//    window.open(DOUBAN_API_SHUO_HOST+"/statuses/"+statusId);
    openPopupWindow(DOUBAN_API_SHUO_HOST+"/statuses/"+statusId);
}

function openUserProfileApiUrl(userId){
//    window.open(DOUBAN_API_SHUO_HOST+"/users/"+userId);
    openPopupWindow(DOUBAN_API_SHUO_HOST+"/users/"+userId);
}

function openUserTimelineApiUrl(userId){
    window.open(DOUBAN_API_SHUO_HOST+"/statuses/user_timeline/"+userId);
}

function openPopupWindow(url){
    chrome.windows.create(
        {
            url:url,
            width: 640,
            height: 640,
            type:"popup"
        }
    );
}

// A generic onclick callback function.
function genericOnClick(info, tab) {
    console.log("item " + info.menuItemId + " was clicked");
    console.log("info: " + JSON.stringify(info));
    console.log("tab: " + JSON.stringify(tab));
}

function onStatus(info, tab) {
//    console.log("onStatusClick() item " + info.menuItemId + " was clicked");
    console.log("onStatus() info: " + JSON.stringify(info));
//    console.log("onStatusClick() tab: " + JSON.stringify(tab));
    if(info.linkUrl){
        var text=info.linkUrl;
        var statusRegExp=new RegExp(/http:\/\/www.douban.com\/people\/\S+\/status\/(\d+)\/?/);
        var statusMatches=text.match(statusRegExp);
        if(statusMatches){
            console.log("statusMatches is "+ statusMatches);
            if(statusMatches.length>1){
                var statusId=statusMatches[1];
                openStatusApiUrl(statusId);
            }
        }
    }
}

function onUserClick(info, tab, timeline) {
//    console.log("onUserProfileClick() item " + info.menuItemId + " was clicked");
    console.log("onUserProfileClick() tab: " + JSON.stringify(tab));
    console.log("onUserClick() info: " + JSON.stringify(info)+" timeline: "+timeline);
    if(info.linkUrl){
        var text=info.linkUrl;
        var peopleRegExp=new RegExp(/http:\/\/www.douban.com\/people\/(\w+|\d+)\/?(?:status\/(\d+))?/);
        var peopleMatches=text.match(peopleRegExp);
        if(peopleMatches){
            console.log("peopleMatches is "+ peopleMatches);
            if(peopleMatches.length>1){
                var userId=peopleMatches[1];
                if(peopleMatches.length>2){
                    var statusId=peopleMatches[2];
                }
                if(timeline){
                    openUserTimelineApiUrl(userId);
                }else{
                    openUserProfileApiUrl(userId);
                }
            }
        }
    }
}

function onUserProfile(info,tab){
    onUserClick(info,tab,false);
}

function onUserTimeline(info,tab){
    onUserClick(info,tab,true);
}

function onTabChanged(tabId, changeInfo, tab){
    if(tag.g){}
    chrome.pageAction.show(tabId);
}



