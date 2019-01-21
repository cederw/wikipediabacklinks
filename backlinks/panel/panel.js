var myWindowId;
const linksList = document.querySelector("#linksList");

/*
Update the sidebar's content.
1) Get the active tab in this sidebar's window.
2) Get page title from the url
3) Use backlinks api to get links
4) Create the List
*/

function updateContent() {
    browser.tabs.query({windowId: myWindowId, active: true})
      .then((tabs) => {
          
          var url = tabs[0].url;
          var myNode = document.getElementById("linksList");
            while (myNode.firstChild) {
                myNode.removeChild(myNode.firstChild);
            }
          if(!url.includes('wikipedia')){           
              return null;
          } else {
            var node = document.createElement("LI");
            var linkText = document.createTextNode('loading...');
            node.appendChild(linkText);
            document.getElementById("linksList").appendChild(node); 
          }
            if(!url.includes('curid')){
            var re = /\wiki\/([\w%]+)/g
            var title = url.match(re)[0].substring(5);
            var xhr = new XMLHttpRequest();
            xhr.open("GET", "https://en.wikipedia.org/w/api.php?action=query&format=json&bllimit=100&list=backlinks&bltitle=" + title, false);
            xhr.send();
            return JSON.parse(xhr.response);
          } else{
            var re2 = /curid=([\w%]+)/g
            var pageid = url.match(re2)[0].substring(6);
            var xhr2 = new XMLHttpRequest();
            xhr2.open("GET", "https://en.wikipedia.org/w/api.php?action=query&format=json&bllimit=100&list=backlinks&blpageid=" + pageid, false);
            xhr2.send();
            return JSON.parse(xhr2.response);
          }

          
          
      })
      .then((backlinks) => {
        // remove loading message
        var myNode = document.getElementById("linksList");
            while (myNode.firstChild) {
                myNode.removeChild(myNode.firstChild);
            }
          
        if(!!backlinks ){
            
            var list = backlinks.query.backlinks;
            var i;
            for (i = 0; i < list.length; i++) {
                var node = document.createElement("LI");
                var x = document.createElement("a");
                var linkText = document.createTextNode(list[i].title);
                x.appendChild(linkText);
                x.href = 'https://en.wikipedia.org/?curid=' + list[i].pageid;
                x.title = list[i].title;
                node.appendChild(x); 
                document.getElementById("linksList").appendChild(node); 
            } 
        }
        
      });
  }

browser.tabs.onActivated.addListener(updateContent);
browser.tabs.onUpdated.addListener(updateContent);
browser.windows.getCurrent({populate: true}).then((windowInfo) => {
  myWindowId = windowInfo.id;
  updateContent();
});