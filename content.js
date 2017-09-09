// This executes when the extension icon is clicked
console.log('Icon clicked');

document.addEventListener('DOMContentLoaded', function () {
	// const lyrics = generateLyrics("Baby Justin Bieber");
	// console.log(lyrics);
	const lyrics = `"Baby, I like your style<br><br>Grips on your waist<br>Front way, back way<br>You know that I don't play<br>Streets not safe<br>But I never run away<br>Even when I'm away<br>Oti, oti, there's never much love when we go OT<br>I pray to make it back in one piece<br>I pray, I pray<br><br>That's why I need a one dance<br>Got a Hennessy in my hand<br>One more time 'fore I go<br>Higher powers taking a hold on me<br>I need a one dance<br>Got a Hennessy in my hand<br>One more time 'fore I go<br>Higher powers taking a hold on me<br><br>Baby, I like your style<br><br>Strength and guidance<br>All that I'm wishing for my friends<br>...<br><br>******* This Lyrics is NOT for Commercial use *******"`
	const cleanedLyrics = lyrics.substring(1, lyrics.indexOf("***"));
	document.getElementById("div-lyrics").innerHTML = cleanedLyrics;

	const gif_url = generateGif("One Dance Drake");
	console.log(gif_url);
	document.getElementById("gif").innerHTML = `<img src=${gif_url}>`
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
