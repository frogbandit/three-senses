// This executes when the extension icon is clicked
console.log('Icon clicked');

document.addEventListener('DOMContentLoaded', function () {
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

								const lyrics = generateLyrics(title)
								const cleanedLyrics = lyrics.substring(1, lyrics.indexOf("***"));
								document.getElementById("div-lyrics").innerHTML = cleanedLyrics;

								const gif_url = generateGif(title);
								console.log(gif_url);
								document.getElementById("gif").innerHTML = `<img src=${gif_url}>`
            }
          }
      } else {
        return 'Sorry we currently only support Youtube videos.'
      };
  });
});

// API call to MusixMatch
function generateLyrics(songTitle) {
	console.log(songTitle);
	const theUrl = `https://api.musixmatch.com/ws/1.1/matcher.lyrics.get?q_track=${songTitle}&apikey=8155f760c67aff660b8e04d67fd000ac`

	const xmlHttp = new XMLHttpRequest();
	xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
	xmlHttp.send( null );
	const response = JSON.parse(xmlHttp.responseText);

	console.log(response.message);
	if (!response.message.body.lyrics.lyrics_body) {
		return "Cannot find song lyrics"
	}
	return JSON.stringify(response.message.body.lyrics.lyrics_body.replace(/\n/g,"<br>"));
}

// API call to GIPHY
function generateGif(songTitle) {
	console.log(songTitle);
	const theUrl = `http://api.giphy.com/v1/gifs/search?q=${songTitle}&api_key=ba8eae2c8b764449ac17a7554a835d06`

	const xmlHttp = new XMLHttpRequest();
	xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
	xmlHttp.send( null );
	const response = JSON.parse(xmlHttp.responseText);

	const randomGifIndex = Math.floor(Math.random()*25);
	if (!response.data[randomGifIndex]) {
		return "Cannot find GIF"
	}
	return JSON.stringify(response.data[randomGifIndex].images.fixed_height.url);
}

function isYoutube(url) {
  return url.indexOf('youtube.com');
}
