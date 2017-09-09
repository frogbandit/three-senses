// This executes when the extension icon is clicked
console.log('Icon clicked');

document.addEventListener('DOMContentLoaded', function () {
	const lyrics = generateLyrics("One Dance Drake");
	document.getElementById("div-lyrics").innerHTML = lyrics;
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
	return response.message.body.lyrics.lyrics_body;
}
