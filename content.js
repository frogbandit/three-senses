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
					// logic to get Spotify current song

					// app id: kneidnmcnefjaglbfdmpppnjfnadjcok

					const authURL = `https://accounts.spotify.com/authorize/?client_id=1378cddb03a4471db8923d3f86c2573f&response_type=code&redirect_uri=https://kbcbkhedpppdgakadaampcdhglgbjjal.chromiumapp.org/spotify&scope=user-read-currently-playing`
					chrome.identity.launchWebAuthFlow(
						{'url': authURL, 'interactive': true},
						function(redirect_url) { 
							// error handling
							if (!redirect_url) {
								document.getElementById('loading').innerHTML = 'Sorry we currently only support YouTube videos.';
							}
							else {
								// get code from Spotify
								const code = redirect_url.split('code=')[1];

								// do POST to get access token from Spotify
								const xmlHttp = new XMLHttpRequest(); 
								xmlHttp.open( "POST", "https://accounts.spotify.com/api/token", false ); // false for synchronous request
								xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");							
								xmlHttp.send(`grant_type=authorization_code&code=${code}&redirect_uri=https://kbcbkhedpppdgakadaampcdhglgbjjal.chromiumapp.org/spotify&client_id=1378cddb03a4471db8923d3f86c2573f&client_secret=c67320ae6ce1445692714233a375daf7`);
								const response = JSON.parse(xmlHttp.responseText);
								const access_token = response.access_token;

								const title = getSpotify(access_token);
								if (title !== 'Error in getting current song from Spotify. Please make sure Spotify is running!') {
									const lyrics = generateLyrics(title);
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
								}
								else {
									const gif_url = generateGif("sad crying");
									document.getElementById("div-lyrics").innerHTML = 'Error in getting current song from Spotify. Please make sure Spotify is running!';
									document.getElementById("gif").innerHTML = `<img src=${gif_url}>`
								}
								$('#loading').hide();
							}
						}
					);

					
	      };
			}
  });
});

// API call to Spotify to get currently playing song
function getSpotify(access_token) { 
	try {
		const xmlHttp = new XMLHttpRequest();
		xmlHttp.open( "GET", "https://api.spotify.com/v1/me/player/currently-playing", false ); // false for synchronous request
		xmlHttp.setRequestHeader("Authorization", `Bearer ${access_token}`);
		xmlHttp.send( null );
		const response = JSON.parse(xmlHttp.responseText);
		return response.item.name + " " + response.item.artists[0].name;
	}
	catch (e) {
		return "Error in getting current song from Spotify. Please make sure Spotify is running!"
	}
}

// API call to MusixMatch
function generateLyrics(songTitle) {
	const theUrl = `https://api.musixmatch.com/ws/1.1/matcher.lyrics.get?q_track=${songTitle}&apikey=8155f760c67aff660b8e04d67fd000ac`

	const xmlHttp = new XMLHttpRequest();
	xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
	xmlHttp.send( null );
	const response = JSON.parse(xmlHttp.responseText);

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
