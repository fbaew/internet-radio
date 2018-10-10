var playing = false
var hidden = true
var player = null
var nowPlaying = null
var listenerElement = null
var statusPollInterval = 5000; //Milliseconds between status page queries

function main() {
    nowPlaying = document.getElementById('now-playing');
    listenerElement = document.getElementById('listeners');
    pollStatistics()
}

if (document.readyState!='loading') main();
else if (document.addEventListener) document.addEventListener('DOMContentLoaded', main);
else document.attachEvent('onreadystatechange', function() { if (document.readyState=='complete') main(); });


function togglePlay() {
    player = document.getElementById('player')
    var button = document.getElementById('play-toggle')

    if (playing) {
        player.pause()
        button.innerHTML = 'PAUSED'
    } else {
        player.play()
        button.innerHTML = 'PLAYING'
    }
    playing = !playing
}

function toggleInfo() {
    var hiddenContent = document.getElementById('content');
    var spectrum = document.getElementById('spectrum');
    if (hidden) {
    //    hiddenContent.style.display = 'inline';
        spectrum.style.position = 'fixed';
        spectrum.style.top = 0;
        spectrum.style.left = 0;
        spectrum.style.height = "100%";
        spectrum.style.zIndex = "1";
        spectrum.style.backgroundColor = '#fff';
        enlargeHeader()
    }
    else {
        spectrum.style.position = '';
        spectrum.style.top = null;
        spectrum.style.left = null;
        spectrum.style.height = "";
        spectrum.style.zIndex = "-1";
        spectrum.style.backgroundColor = '';
        reduceHeader()
     //    hiddenContent.style.display = 'none';
    }

    hidden = !hidden

}

function enlargeHeader() {
    dataDisplay = document.getElementById('status');
    dataDisplay.style.zIndex="2";
    dataDisplay.style.position = 'absolute';
    dataDisplay.style.margin = 'auto';
    dataDisplay.style.top = '45%';
    dataDisplay.style.left = '0';
    dataDisplay.style.width = '100%';
    dataDisplay.style.color = '#000';
    dataDisplay.style.textAlign = 'center';
    dataDisplay.style.fontSize = '72pt';
    dataDisplay.style.textTransform = 'uppercase';
}

function reduceHeader() {
    dataDisplay = document.getElementById('status');
    dataDisplay.style.zIndex=null;
    dataDisplay.style.position = null;
    dataDisplay.style.top = null;
    dataDisplay.style.width = null;
    dataDisplay.style.color = null;
    dataDisplay.style.textAlign = null;
    dataDisplay.style.left = null;
    dataDisplay.style.fontSize = null; 
    dataDisplay.style.textTransform = 'uppercase';
}

function pollStatistics() {
    fetch('https://radio.humanpowered.ca/json')
        .then((resp) => resp.json())
        .then(function(data) {
            nowPlaying.innerHTML = data.icestats.source.title;
            listenerElement.innerHTML = data.icestats.source.listeners;
            setTimeout(pollStatistics, statusPollInterval);
        })
        .catch(function(error) {
            console.log('Encountered exception: ' + error);
            setTimeout(pollStatistics, 1000);
        });
}

function setVolume() {
    var slider = document.getElementById('volume');
    var newVolume = parseInt(slider.value)/100;
    
    player.volume = newVolume;
}
