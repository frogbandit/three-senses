// This function scrapes the title of a youtube url
function youtubeTitleScraper() {
  chrome.tabs.getSelected(null,function(tab) {
      const youtubeURL = tab.url;
      if (isYoutube(youtubeURL) !== -1) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', youtubeURL, true);
        xhr.send(null);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                const rawResponse = xhr.responseText;
              	const titleEnd = rawResponse.substring(rawResponse.indexOf('document.title = "'))
              	const title = titleEnd.substring(titleEnd.indexOf('"'), titleEnd.indexOf(';'));
                return title
            }
          }
      } else {
        return 'Sorry we currently only support Youtube videos.'
      };
  });
};

function isYoutube(url) {
  return url.indexOf('youtube.com');
}


youtubeTitleScraper()
