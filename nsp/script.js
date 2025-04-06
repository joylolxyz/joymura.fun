document.addEventListener("DOMContentLoaded", () => {
    const playlist = [
      { title: "1 Thing", artist: "Amerie", start: 29, decade: "00s" },
      { title: "Gimme More", artist: "Britney Spears", start: 253, decade: "00s" },
      { title: "Rhythm Of The Night", artist: "Corona", start: 477, decade: "90s" },
      { title: "Glamorous", artist: "Fergie Feat. Ludacris", start: 694, decade: "00s" },
      { title: "Adult Education", artist: "Hall & Oates", start: 932, decade: "80s" },
      { title: "Don't Wanna Fall In Love", artist: "Jane Child", start: 1204, decade: "90s" },
      { title: "Work (Freemason's Mix)", artist: "Kelly Rowland", start: 1415, decade: "00s" },
      { title: "Scandalous", artist: "Mis-Teeq", start: 1609, decade: "00s" },
      { title: "Lady (Hear Me Tonight)", artist: "Modjo", start: 1870, decade: "00s" },
      { title: "Anthem", artist: "N-Joi", start: 2074, decade: "90s" },
      { title: "West End Girls", artist: "Pet Shop Boys", start: 2311, decade: "80s" },
      { title: "Only Girl (In The World)", artist: "Rihanna", start: 2537, decade: "10s" },
      { title: "With Every Heartbeat", artist: "Robyn Feat. Kleerup", start: 2768, decade: "00s" },
      { title: "Music Sounds Better With You", artist: "Stardust", start: 2996, decade: "90s" },
      { title: "Everything She Wants", artist: "Wham!", start: 3036, decade: "80s" },
      { title: "Circle In The Sand", artist: "Belinda Carlisle", start: 3257, decade: "80s" },
      { title: "I Want It That Way", artist: "Backstreet Boys", start: 3505, decade: "90s" },
      { title: "Meet Me Halfway", artist: "Black Eyed Peas", start: 3714, decade: "00s" },
      { title: "On Our Own", artist: "Bobby Brown", start: 3974, decade: "80s" },
      { title: "Smalltown Boy", artist: "Bronski Beat", start: 4252, decade: "80s" },
      { title: "Me & U", artist: "Cassie", start: 4513, decade: "00s" },
      { title: "Days Go By", artist: "Dirty Vegas", start: 4732, decade: "00s" },
      { title: "Wait", artist: "The Blow Monkeys Feat. Kym Mazelle", start: 4732, decade: "80s" },
      { title: "Feel Good Inc.", artist: "Gorillaz", start: 4917, decade: "00s" },
      { title: "New Sensation", artist: "INXS", start: 5148, decade: "80s" },
      { title: "Alright", artist: "Jamiroquai", start: 5400, decade: "90s" },
      { title: "Applause", artist: "Lady Gaga", start: 5620, decade: "10s" },
      { title: "Living In A Box", artist: "Living In A Box", start: 5843, decade: "80s" },
      { title: "Tennis Court", artist: "Lorde", start: 6043, decade: "10s" },
      { title: "Bad Girls", artist: "M.I.A.", start: 6240, decade: "10s" },
      { title: "Midnight City", artist: "M83", start: 6478, decade: "10s" },
      { title: "Cooler Than Me", artist: "Mike Posner", start: 6688, decade: "10s" },
      { title: "The Time Is Now", artist: "Moloko", start: 6913, decade: "00s" },
      { title: "Tape Loop", artist: "Morcheeba", start: 7151, decade: "90s" },
      { title: "Moves Like Jagger", artist: "Maroon 5 Feat. Christina Aguilera", start: 7366, decade: "10s" },
      { title: "Promises Promises", artist: "Naked Eyes", start: 7581, decade: "80s" },
      { title: "Send Me An Angel", artist: "Real Life", start: 7821, decade: "80s" },
      { title: "Kids", artist: "Robbie Williams feat. Kylie Minogue", start: 8066, decade: "00s" },
      { title: "Something Got Me Started (Hurley's 7' House Mix)", artist: "Simply Red", start: 8066, decade: "90s" },
      { title: "Let's Go All The Way", artist: "Sly Fox", start: 8300, decade: "80s" },
      { title: "6 Underground", artist: "Sneaker Pimps", start: 8531, decade: "90s" },
    ]
  
    for (let i = 0; i < playlist.length - 1; i++) {
      playlist[i].duration = playlist[i + 1].start - playlist[i].start
    }
    playlist[playlist.length - 1].duration = 240
  
    const TOTAL_DURATION = 8771
    const audio = new Audio()
    audio.crossOrigin = "anonymous"
    audio.src = "nonstoppop.mp3"
    audio.volume = 1.0
  
    const playBtn = document.getElementById("play")
    const prevBtn = document.getElementById("prev")
    const nextBtn = document.getElementById("next")
    const progressBar = document.getElementById("progress-bar")
    const progress = document.getElementById("progress")
    const currentTimeEl = document.getElementById("current-time")
    const durationEl = document.getElementById("duration")
    const playlistContainer = document.getElementById("playlist")
    const shuffleBtn = document.getElementById("shuffle")
    const shareBtn = document.getElementById("share")
    const visualizer = document.getElementById("visualizer")
    const currentSongDisplay = document.getElementById("current-song-display")
    const volumePercentage = document.querySelector(".volume-percentage")
    const volumeUpBtn = document.getElementById("volume-up")
    const volumeDownBtn = document.getElementById("volume-down")
    const currentSong = document.getElementById("current-song")
    const currentArtist = document.getElementById("current-artist")
    const albumArt = document.querySelector(".album-art")
    const toastNotification = document.getElementById("toast-notification")
    const toastMessage = document.getElementById("toast-message")
    const volumeSliderEl = document.getElementById("volume-slider")
    const playIcon = playBtn.querySelector("svg")
  
    let currentTrackIndex = 0
    let isPlaying = false
    let isShuffling = false
    let audioContext
    let analyser
    let visualizerCtx
    let currentFilter = "all"
    let audioInitialized = false
    let lastUpdateTime = 0
  
    function loadSavedState() {
      try {
        const savedState = localStorage.getItem("nonStopPopState")
        if (savedState) {
          const state = JSON.parse(savedState)
          currentTrackIndex = state.trackIndex || 0
          audio.currentTime = state.currentTime || playlist[currentTrackIndex].start
          isShuffling = state.isShuffling || false
  
          if (isShuffling) {
            shuffleBtn.classList.add("active")
          }
  
          updateCurrentSong()
        } else {
          currentTrackIndex = 0
          audio.currentTime = playlist[currentTrackIndex].start
          updateCurrentSong()
        }
      } catch (e) {
        currentTrackIndex = 0
        audio.currentTime = playlist[currentTrackIndex].start
        updateCurrentSong()
      }
    }
  
    function saveState() {
      try {
        const state = {
          trackIndex: currentTrackIndex,
          currentTime: audio.currentTime,
          isShuffling: isShuffling,
        }
        localStorage.setItem("nonStopPopState", JSON.stringify(state))
      } catch (e) {}
    }
  
    function setupVisualizer() {
      if (!audioContext) {
        try {
          audioContext = new (window.AudioContext || window.webkitAudioContext)()
          analyser = audioContext.createAnalyser()
          const source = audioContext.createMediaElementSource(audio)
  
          source.connect(analyser)
          analyser.connect(audioContext.destination)
  
          analyser.fftSize = 256
  
          visualizerCtx = visualizer.getContext("2d")
          visualizer.width = visualizer.offsetWidth
          visualizer.height = visualizer.offsetHeight
  
          renderVisualizer()
        } catch (e) {}
      }
    }
  
    function renderVisualizer() {
      if (!analyser) return
  
      const bufferLength = analyser.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)
  
      function draw() {
        requestAnimationFrame(draw)
  
        analyser.getByteFrequencyData(dataArray)
  
        visualizerCtx.clearRect(0, 0, visualizer.width, visualizer.height)
  
        const barWidth = (visualizer.width / bufferLength) * 4
        let x = 0
  
        for (let i = 0; i < bufferLength; i++) {
          const barHeight = (dataArray[i] / 255) * visualizer.height * 0.7
  
          const gradient = visualizerCtx.createLinearGradient(0, visualizer.height - barHeight, 0, visualizer.height)
          gradient.addColorStop(0, "#FF2D9E")
          gradient.addColorStop(1, "#00D2FF")
  
          visualizerCtx.fillStyle = gradient
          visualizerCtx.fillRect(x, visualizer.height - barHeight, barWidth - 1, barHeight)
  
          x += barWidth
        }
      }
  
      draw()
    }
  
    function findCurrentTrack() {
      const currentTime = audio.currentTime
  
      for (let i = 0; i < playlist.length; i++) {
        const nextIndex = i + 1
        const endTime = nextIndex < playlist.length ? playlist[nextIndex].start : TOTAL_DURATION
  
        if (currentTime >= playlist[i].start && currentTime < endTime) {
          return i
        }
      }
  
      return 0
    }
  
    function updateCurrentSong() {
      const index = findCurrentTrack()
      if (index !== currentTrackIndex || Date.now() - lastUpdateTime > 1000) {
        lastUpdateTime = Date.now()
        currentTrackIndex = index
  
        const track = playlist[currentTrackIndex]
  
        currentSong.textContent = track.title
        currentArtist.textContent = track.artist
        currentSongDisplay.textContent = `${track.artist} - ${track.title}`
  
        document.title = `${track.artist} - ${track.title} | Non Stop Pop FM`
  
        const playlistItems = document.querySelectorAll(".playlist-item")
        playlistItems.forEach((item) => item.classList.remove("active"))
  
        const activeItem = document.querySelector(`.playlist-item[data-index="${currentTrackIndex}"]`)
        if (activeItem && !isUserScrolling) {
          activeItem.classList.add("active")
          activeItem.scrollIntoView({ behavior: "smooth", block: "nearest" })
        } else if (activeItem) {
          activeItem.classList.add("active")
        }
  
        saveState()
      }
    }
  
    function togglePlay() {
      if (!audioInitialized) {
        setupVisualizer()
        audioInitialized = true
      }
  
      if (isPlaying) {
        audio.pause()
        playIcon.outerHTML =
          '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-play"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>'
        albumArt.classList.remove("playing")
      } else {
        audio.play().catch((e) => {
          showToast("Error playing audio. Please check your connection and try again.")
        })
        playIcon.outerHTML =
          '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pause"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>'
        albumArt.classList.add("playing")
      }
  
      isPlaying = !isPlaying
    }  
    function formatTime(seconds) {
      const hours = Math.floor(seconds / 3600)
      const mins = Math.floor((seconds % 3600) / 60)
      const secs = Math.floor(seconds % 60)
  
      if (hours > 0) {
        return `${hours}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
      } else {
        return `${mins}:${secs.toString().padStart(2, "0")}`
      }
    }
  
    function updateProgress() {
      const percent = (audio.currentTime / TOTAL_DURATION) * 100
      progress.style.width = `${percent}%`
  
      currentTimeEl.textContent = formatTime(audio.currentTime)
      durationEl.textContent = formatTime(TOTAL_DURATION)
  
      updateCurrentSong()
    }
  
    function playPrevious() {
      if (currentTrackIndex > 0) {
        currentTrackIndex--
        audio.currentTime = playlist[currentTrackIndex].start
        updateCurrentSong()
        if (!isPlaying) togglePlay()
      }
    }
  
    function playNext() {
      if (isShuffling) {
        const randomIndex = Math.floor(Math.random() * playlist.length)
        currentTrackIndex = randomIndex
        audio.currentTime = playlist[currentTrackIndex].start
        updateCurrentSong()
        if (!isPlaying) togglePlay()
      } else if (currentTrackIndex < playlist.length - 1) {
        currentTrackIndex++
        audio.currentTime = playlist[currentTrackIndex].start
        updateCurrentSong()
        if (!isPlaying) togglePlay()
      } else {
        currentTrackIndex = 0
        audio.currentTime = playlist[0].start
        updateCurrentSong()
        if (!isPlaying) togglePlay()
      }
    }
  
    function showToast(message) {
      toastMessage.textContent = message
      toastNotification.classList.add("show")
  
      setTimeout(() => {
        toastNotification.classList.remove("show")
      }, 3000)
    }
  
    function toggleShuffle() {
      isShuffling = !isShuffling
      shuffleBtn.classList.toggle("active")
  
      if (isShuffling) {
        showToast("Shuffle mode enabled")
      } else {
        showToast("Shuffle mode disabled")
      }
  
      saveState()
    }
  
    function shareStation() {
      const shareText = `I'm listening to ${playlist[currentTrackIndex].title} by ${playlist[currentTrackIndex].artist} on Non Stop Pop FM! Check it out at https://joymura.fun/nsp!`
  
      try {
        navigator.clipboard.writeText(shareText)
        showToast("Share text copied to clipboard!")
      } catch (err) {
        showToast("Couldn't copy to clipboard. Share manually: " + shareText)
      }
    }
  
    function filterPlaylist(decade) {
      currentFilter = decade
      const items = document.querySelectorAll(".playlist-item")
  
      items.forEach((item) => {
        const index = Number.parseInt(item.dataset.index)
        const itemDecade = playlist[index].decade
  
        if (decade === "all" || itemDecade === decade) {
          item.style.display = "grid"
        } else {
          item.style.display = "none"
        }
      })
  
      document.querySelectorAll(".filter-btn").forEach((btn) => {
        if (btn.dataset.filter === decade) {
          btn.classList.add("active")
        } else {
          btn.classList.remove("active")
        }
      })
    }
  
    function generatePlaylist() {
      playlistContainer.innerHTML = ""
  
      playlist.forEach((track, index) => {
        const item = document.createElement("div")
        item.className = "playlist-item"
        if (index === currentTrackIndex) {
          item.classList.add("active")
        }
        item.dataset.index = index
        item.dataset.decade = track.decade
  
        item.innerHTML = `
          <div class="track-number">${(index + 1).toString().padStart(2, "0")}</div>
          <div class="track-info">
            <div class="track-title">${track.title}</div>
            <div class="track-artist">${track.artist}</div>
          </div>
          <div class="track-duration">${formatTime(track.duration)}</div>
        `
  
        item.addEventListener("click", () => {
          currentTrackIndex = index
          audio.currentTime = track.start
          updateCurrentSong()
          if (!isPlaying) togglePlay()
          item.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
        })
  
        playlistContainer.appendChild(item)
      })
    }  
    
    function updateVolumeDisplay() {
      const volumePercent = Math.round(audio.volume * 100)
      volumePercentage.textContent = `${volumePercent}%`
    }
  
    function checkSongEnd() {
      const currentTime = audio.currentTime
      const nextTrackStart =
        currentTrackIndex < playlist.length - 1 ? playlist[currentTrackIndex + 1].start : TOTAL_DURATION
  
      if (currentTime >= nextTrackStart) {
        if (isShuffling) {
          const randomIndex = Math.floor(Math.random() * playlist.length)
          currentTrackIndex = randomIndex
          audio.currentTime = playlist[currentTrackIndex].start
          updateCurrentSong()
        } else if (currentTrackIndex < playlist.length - 1) {
          currentTrackIndex++
          audio.currentTime = playlist[currentTrackIndex].start
          updateCurrentSong()
        } else {
          currentTrackIndex = 0
          audio.currentTime = playlist[0].start
          updateCurrentSong()
        }
      }
    }
  
    playBtn.addEventListener("click", togglePlay)
    prevBtn.addEventListener("click", playPrevious)
    nextBtn.addEventListener("click", playNext)
    shuffleBtn.addEventListener("click", toggleShuffle)
    shareBtn.addEventListener("click", shareStation)
  
    volumeDownBtn.addEventListener("click", () => {
      audio.volume = Math.max(0, audio.volume - 0.1)
      volumeSliderEl.value = audio.volume
      updateVolumeDisplay()
    })
  
    volumeUpBtn.addEventListener("click", () => {
      audio.volume = Math.min(1, audio.volume + 0.1)
      volumeSliderEl.value = audio.volume
      updateVolumeDisplay()
    })
  
    volumeSliderEl.addEventListener("input", () => {
      audio.volume = volumeSliderEl.value
      updateVolumeDisplay()
    })
  
    document.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        filterPlaylist(btn.dataset.filter)
      })
    })
  
    progressBar.addEventListener("click", (e) => {
      const clickPosition = e.offsetX / progressBar.offsetWidth
      audio.currentTime = clickPosition * TOTAL_DURATION
      updateProgress()
    })
  
    audio.addEventListener("timeupdate", () => {
      updateProgress()
      checkSongEnd()
    })
  
    audio.addEventListener("ended", () => {
      audio.currentTime = 0
      currentTrackIndex = 0
      updateCurrentSong()
      if (isPlaying) audio.play()
    })
  
    window.addEventListener("resize", () => {
      if (visualizer) {
        visualizer.width = visualizer.offsetWidth
        visualizer.height = visualizer.offsetHeight
      }
    })
  
    window.addEventListener("beforeunload", saveState)
  
    loadSavedState()
    generatePlaylist()
    updateVolumeDisplay()
  
    document.addEventListener("keydown", (e) => {
      if (e.code === "Space") {
        e.preventDefault()
        togglePlay()
      } else if (e.code === "ArrowLeft") {
        playPrevious()
      } else if (e.code === "ArrowRight") {
        playNext()
      }
    })
  
    setTimeout(() => {
      showToast("Welcome to Non Stop Pop FM! Press play to start listening.")
    }, 1000)
  })
  
  