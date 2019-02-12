import { songsList } from '../data/songs.js'
import PlayInfo from '../modules/play-info.js';
import TrackBar from './track-bar.js';

const Playlist = (_ => {
  //date or state
  let songs = songsList;
  let currentPlayingIndex = 0;
  let currentSong = new Audio(songs[currentPlayingIndex].url);
  let isPlaying = false;

  currentSong.currentTime = 100;
  //cache the DOM
  const playlistEl = document.querySelector(".playlist");
  const playerImgEl = document.querySelector(".player__img");

  const init = _ => {
    render();
    listeners();
    PlayInfo.setState({
      songsList: songs.length,
      isPlaying: !currentSong.paused
    })
  }

  const flip = _ =>{
    togglePlayPause();
    render();
  }

  const changeAudiSrc = _ => {
    currentSong.src = songs[currentPlayingIndex].url;
  }

  const togglePlayPause = _ => {
    return currentSong.paused ? currentSong.play() : currentSong.pause();
  }
  const mainPlay = clickedIndex => {
    if (currentPlayingIndex === clickedIndex) {
      togglePlayPause();
      // toggle play or pause
    } else {
      currentPlayingIndex = clickedIndex;
      changeAudiSrc();
      togglePlayPause();
    }
    PlayInfo.setState({
      songsList: songs.length,
      isPlaying: !currentSong.paused
    })

  }

  const playNext = _ => {
    if (songs[currentPlayingIndex + 1]) {
      currentPlayingIndex++;
      changeAudiSrc();
      togglePlayPause();
      render();
    } else {
      currentPlayingIndex = 0;
      changeAudiSrc();
      togglePlayPause();
      render();
    }
  }

  const listeners = _ => {
    // get the index of whats clicked li tag
    // change the currentplayingindex to indx of the li tag
    // play or pause
    // if its not the same song then change the source to that new song after changing the currentplaying index
    playlistEl.addEventListener("click", event => {
      if (event.target && event.target.matches(".fa")) {
        const listElem = event.target.parentNode.parentNode;
        const listElemIndex = [...listElem.parentElement.children].indexOf(listElem);
        mainPlay(listElemIndex);
        render();

        if (listElemIndex === 0) {
          playerImgEl.src = "../../img/smug-hat-kid.jpg"
          // console.log(playerImgEl);
        } else if (listElemIndex === 1) {
          playerImgEl.src = "../../img/castlevania-sotn.jpg"
        }
      }

    })

    currentSong.addEventListener("ended", _ => {
      // play next
      playNext();
    })

    currentSong.addEventListener("timeupdate", _ => {
      TrackBar.setState(currentSong);
    })
  }

  const render = _ => {
    let markup = '';

    const toggleIcon = itemIndex => {
      if (currentPlayingIndex === itemIndex) {
        return currentSong.paused ? 'fa-play' : 'fa-pause';
      } else {
        return 'fa-play';
      }
    }

    let counter = -1;

    songs.forEach((songObj, index) => {
      //let counter = 0
      markup += `
      <li class="playlist__song ${index===currentPlayingIndex ? 'playlist__song--active' : ''}">
      <div class="play-pause">
        <i class="fa ${toggleIcon(index)} pp-icon"></i>
      </div>
      <div class="playlist__song-details">
        <span class="playlist__song-name">${songObj.title} </span>
        <br>
        <span class="playlist__song-artist" >${songObj.artist} </span>
      </div>
      <div class="playlist__song-duration">
        ${songObj.time}
      </div>
    </li>
      `;
    })

    playlistEl.innerHTML = markup;
  }


  return {
    init,
    flip
  }
})();

export default Playlist;