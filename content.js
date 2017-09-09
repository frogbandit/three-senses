// Retrieves URL of youTube link and fetches the corresponding lyrics and gif
document.addEventListener('DOMContentLoaded', function () {
	chrome.tabs.getSelected(null,function(tab) {
      const youtubeURL = tab.url;
			if (youtubeURL === undefined) {
				document.getElementById('loading').innerHTML = 'Sorry we currently only support YouTube videos.';
			} else {
	      if (isYoutube(youtubeURL) !== -1) {
	        const xhr = new XMLHttpRequest();
	        xhr.open('GET', youtubeURL, true);
	        xhr.send(null);
	        xhr.onreadystatechange = function() {
	            if (xhr.readyState == XMLHttpRequest.DONE) {
	                const rawResponse = xhr.responseText;
	              	const titleEnd = rawResponse.substring(rawResponse.indexOf('document.title = "'))
	              	const title = titleEnd.substring(titleEnd.indexOf('"'), titleEnd.indexOf('YouTube'));

									const lyrics = generateLyrics(title)
									if (lyrics !== 'No available lyrics for this song :(') {
										const cleanedLyrics = lyrics.substring(1, lyrics.indexOf("***"));
										const gif_url = generateGif(title);
										document.getElementById("div-lyrics").innerHTML = cleanedLyrics;
										document.getElementById("gif").innerHTML = `<img src=${gif_url}>`
									} else {
										const gif_url = generateGif("sad crying");
										document.getElementById("div-lyrics").innerHTML = 'No available lyrics for this song :(';
										document.getElementById("gif").innerHTML = `<img src=${gif_url}>`
									}

									$('#loading').hide();
	            }
	          }
	      } else {
					document.getElementById('loading').innerHTML = 'Sorry we currently only support YouTube videos.';
	      };
			}
  });
});

// API call to MusixMatch
function generateLyrics(songTitle) {
	const theUrl = `https://api.musixmatch.com/ws/1.1/matcher.lyrics.get?q_track=${songTitle}&apikey=8155f760c67aff660b8e04d67fd000ac`

	const xmlHttp = new XMLHttpRequest();
	xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
	xmlHttp.send( null );
	const response = JSON.parse(xmlHttp.responseText);
	console.log(response.message.body.length)

	if (response.message.body.length === 0 || !response.message.body.lyrics.lyrics_body) {
		return 'No available lyrics for this song :('
	}
	return JSON.stringify(response.message.body.lyrics.lyrics_body.replace(/\n/g,"<br>"));
}

// API call to GIPHY
function generateGif(songTitle) {
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

// Checks for valid youTube URL
function isYoutube(url) {
  return url.indexOf('youtube.com');
}
