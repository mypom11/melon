//json 받아오기
function loadSongs(){
    return fetch('data/data.json')
    .then((response) => response.json())
    .then((json) => json.songs);
}
loadSongs().then((songs) => {
    displayList(songs)
    ArtistDisplay(songs)
    gerneSelect()
    dataDisplay(songs)
    chartBig(songs)
})

let nav = document.querySelectorAll('.main_menu li')
let menu_bg = document.querySelector('.menu_bg')
let main_music;
let main_video;
let sub_video;

function liBgMake(target, url, type){
    for(i = 0; i < target.length; i++){
        target[i].style.background = `url(img/${url + i}.${type}) center center / cover no-repeat`
    }
}
//서브메뉴 활성화 이벤트
//현재 탑좌표 받아와서 클릭하는 애들 top값 바꿔주기
//클릭 시 나머지 애들 zindex낮추기
let current_sct = 0;
let subMenus = document.querySelectorAll('.sub_menu');
function sub_top(index){
    for(let i = 1; i < subMenus.length; i++ ){
        subMenus[i].style.top = `${index*100}vh`;
    }    
}
function menu_Bg(num){
    menu_bg.style.top = (num * 31) + 74 + (num * 3) +'px'
}
function classOn(targetGroup,target){
    targetGroup.forEach(function(item){
        item.classList.remove('on');
    })
    target.classList.add('on')
}

for(let i = 0; i < nav.length; i++){
    nav[i].addEventListener('click',function(){
        classOn(nav,nav[i])
        if(subMenus[i].getAttribute('class') == 'sub_menu on'){
            subMenus.forEach(function(item){
                item.style.zIndex = '5'
                item.classList.remove('on')
            })
            main_video_stop()
            menu_Bg(0)
            classOn(nav,nav[0])
        }else{
            subMenus[i].classList.add('on')
            if(subMenus[i] == subMenus[4]){
                main_video_play()
                subMenus.forEach(function(item){
                    item.style.zIndex = '5'
                })
                subMenus[i].style.zIndex='6'
                menu_Bg(i)
                setTimeout(function(){
                classOn(subMenus,subMenus[i])
                },1000)
            }else{
                main_video_stop()
                podcastOn()
                subMenus.forEach(function(item){
                    item.style.zIndex = '5'
                })
                subMenus[i].style.zIndex='6'
                menu_Bg(i)
                setTimeout(function(){
                classOn(subMenus,subMenus[i])
                },1000)
            }
        }
    })
}


//검색창 포커스 이벤트
document.querySelector('.search_bar input').addEventListener('focus',function(){
    document.querySelector('.search_bar').style.opacity = 1;
})
document.querySelector('.search_bar input').addEventListener('blur',function(){
    document.querySelector('.search_bar').style.opacity = 0.3;
})

// aside player 이벤트
let audio = new Audio()
let play_btn; 
let stop_btn;
let statusBar;
let status;
let width = 0;
let timer; 

audio.src='music/iu_lilac.mp3'

function statusEvent(){
    let statusBar = document.querySelector('.status_bar')
    let status = document.querySelector('.status_bar div');
    audio.addEventListener('timeupdate',AudiohandleProgress);
    function ascrub(e) { 
        let ascrubTime = (e.offsetX / statusBar.offsetWidth) * audio.duration; 
        audio.currentTime = ascrubTime; 
    } 
    function AudiohandleProgress(){
        let apercent = (audio.currentTime / audio.duration) *100;    
        status.style.width = `${apercent}%`
    }
    let amousedown = false; 
    statusBar.addEventListener('click', ascrub); 
    statusBar.addEventListener('mousemove', (e) => amousedown && ascrub(e)); 
    statusBar.addEventListener('mousedown', () => amousedown = true); 
    statusBar.addEventListener('mouseup', () => amousedown = false);    
}
statusEvent()
function player_clicker(){
    play_btn = document.querySelector('.start_btn');
    stop_btn = document.querySelector('.stop_btn');
    play_btn.addEventListener('click',function(){
        audioPlay()
    })
    stop_btn.addEventListener('click', function(){
        audiostop() 
    })
}
player_clicker()
function audioPlay(){
    play_btn = document.querySelector('.start_btn');
    stop_btn = document.querySelector('.stop_btn');
    audio.play()
    audio.volume = 0.6
    audio.loop = true
    play_btn.style.display = 'none'
    stop_btn.style.display = 'block'
    main_music = true;
}
function audiostop(){
    play_btn = document.querySelector('.start_btn');
    stop_btn = document.querySelector('.stop_btn');
    audio.pause()
    main_music = false;
    play_btn.style.display = 'block'
    stop_btn.style.display = 'none'
}

//페이지 토글 이벤트
let sections = document.querySelectorAll('section');
let toggle = document.querySelector('.page_toggle');
let current_section = 0;
let current_magazine = 0;
toggle.addEventListener('click',function(event){
    let direction = event.target.getAttribute('class')
    if(direction == 'top'){
        if(current_magazine == 0){
            current_section--
            moveSection(current_section);
            toggle_status(current_section);
            sub_top(current_section)
        }else if(current_section >= sections.length -1){
            current_magazine--
            magazine_slider(current_magazine)
        }  
    }else{
        if(current_section >= sections.length -1){
            current_magazine++
            magazine_slider(current_magazine)
        }else if(current_magazine == 0){
            current_section++
            moveSection(current_section);
            toggle_status(current_section)
            sub_top(current_section)
        }
    }
})
//home 눌렀을 경우

nav[0].addEventListener('click',function(){
    current_section = 0;
    current_magazine = 0;
    moveSection(current_section);
    toggle_status(current_section)
    sub_top(current_section)
})
function toggle_status(index){
    if(index == 0){
        document.querySelector('.top').style.display='none'
        document.querySelector('.bottom').style.display='block'
    }else{
        document.querySelector('.top').style.display='block'
        document.querySelector('.bottom').style.display='block'
    }
}
function moveSection(index){
    window.scrollTo({
        top: sections[index].offsetTop, 
        left: sections[index].offsetLeft, 
        behavior:'smooth'
    })
    index = current_section
}


//비쥬얼 섹션
//서브 타이틀 클릭시 메인 뒷배경 젼환
let visualGroup = document.querySelectorAll('.visual_group li');
let current = 0;
let subGroup = document.querySelector('.sub_visual')
let subGroupLi = document.querySelectorAll('.sub_visual li')
function visual(index){
    for(let i = 0; i < visualGroup.length; i++){
        visualGroup[i].style.opacity = '0'
    };
    visualGroup[index].style.opacity = '1'
}

subGroup.addEventListener('click',function(event){
    current = event.target.dataset.num
    if(current <= visualGroup.length && current >= 0){
        visual(current)
        classOn(subGroupLi, event.path[1])
    }
})
//앨범섹션
let albumSlide = document.querySelector('.new_albums');
let albums = document.querySelectorAll('.new_albums li');
let album_btn = document.querySelector('.toggle_btn');
let albumArtSlide = document.querySelector('.album_slide ul');
let albumArts = document.querySelectorAll('.album_slide li')
albumArtSlide.style.width = (albums.length) * 480 +'px';
let current_album = 0;
//버튼 누를시 배경 슬라이드
function moveSlide(index){
    albumArtSlide.style.left = `${(index * -390)-(index*90)}px`;
    setTimeout(function(){
        albumArts.forEach(function(item){
            item.classList.replace('on','off')
        })
        albumArts[index].classList.replace('off','on')
    },200)
    current_album = index;
    albums.forEach(function(item){
        item.classList.remove('on')
    })
    albums[index].classList.add('on')
}
album_btn.addEventListener('click',function(event){
    let direction = event.target.dataset.direction;
    if(direction == 'left'){
        if(current_album < albums.length -1)
        current_album++;
        moveSlide(current_album)
    }else{
        if(current_album > 0)
        current_album--;
        moveSlide(current_album)
    }
})

let nowPlayingChange = document.querySelectorAll('.album_play')
let nowPlaying = document.querySelector('.now_playing')
nowPlayingChange.forEach(function(item){
    item.addEventListener('click',function(event){
        loadSongs().then((songs) => {
            let albumSong = event.path[1].dataset.album;
            let result = songs.find(song => song.title === albumSong)
            nowPlaying.innerHTML = nowPlayingDisplay(result)
            albumArtChange(result)
            AudioChange(result)
        })  
    })
})

function AudioChange(item){
    audiostop()
    audio.src = item.song
    audioPlay()
    statusEvent()
    player_clicker()
}
function albumArtChange(item){
    document.querySelector('.player_bg').style.backgroundImage = `url(${item.albumart})`
}


function nowPlayingDisplay(item){
    return `<div class="player_bg"></div>
                <div class="player">
                <h5>Now Playing</h5>
                <div class="album_art"><img src="${item.albumart}" alt=""></div>
                <p class="song_title">${item.title}</p>
                <p class="song_artist">${item.artist}</p>
                <p class="song_album">${item.album}</p>
                <div class="play_btn">
                    <div class="prev_btn"><img src="img/icons/btn_prev.png"></div>
                    <div class="start_btn"><img src="img/icons/btn_play.png"></div>
                    <div class="stop_btn"><img src="img/icons/btn_stop.png"></div>
                    <div class="next_btn"><img src="img/icons/btn_next.png"></div>
                </div>
                <div class="status_bar">
                    <div></div>
                </div>
            </div>`
                
}


//아티스트 섹션오면 애니메이션 불러오기
let artist_img = document.querySelector('.artist_img');
let artist_text = document.querySelector('.artist_text');
let artist_list = document.querySelector('.artist_list');
let artist_section = document.querySelector('.artist');
addEventListener('scroll',function(){
    let current_scroll = document.documentElement.scrollTop;
    if(current_scroll >= artist_section.offsetTop - 900 && current_scroll <artist_section.offsetTop + 900){
        artist_section.classList.add('on');
    }else{
        artist_section.classList.remove('on');
    }
})

function displayArtistList(songs){
    let artistList = document.querySelector('.popular_song_list')
    artistList.innerHTML = (songs.map(song => createArtistList(song)).join(''))
}
let songArr = []
function ArtistDisplay(songs){
    let filterd = songs.filter(song => song.artist == '아이유')
    trendSonglength = filterd.length
    for(let i = 0; i < 8; i++){
        let ranSongs = Math.floor(Math.random()*trendSonglength)
        let ranSong = filterd[ranSongs]
        songArr.push(ranSong) 
    }
    displayArtistList(songArr) 
}
function createArtistList(song){
    return`<li>
                <div class="popular_song_songs">
                    <div><img src="${song.albumart}"></div>
                    <p>${song.title}<br><span>${song.artist}</span></p>
                </div>
                <div class="popular_song_btn">
                    <img src="img/icons/play_artist.png">
                    <img src="img/icons/more_artist.png">
                </div>
            </li>`
}


//magazine
let magazine_section = document.querySelector('.magazine');
let magazine_slide = document.querySelector('.magazine_img ul');
let magazine_text = document.querySelectorAll('.magazine_index li');
let magazine_scrollbar = document.querySelector('.scroll_bar div');
function magazine_slider(magazine_index){
    if(magazine_index == magazine_text.length -1){
        magazine_slide.style.top = `${magazine_index*-100}vh`
        magazine_text.forEach(function(item){
            item.style.opacity = 0;
        })
        magazine_text[magazine_index].style.opacity = 1;
        magazine_scrollbar.style.height = (magazine_index+1)*25+'%';
        current_magazine = magazine_index;
        document.querySelector('.bottom').style.display='none'
    }else{
        magazine_slide.style.top = `${magazine_index*-100}vh`
        magazine_text.forEach(function(item){
        item.style.opacity = 0;
        })
        magazine_text[magazine_index].style.opacity = 1;
        magazine_scrollbar.style.height = (magazine_index+1)*25+'%';
        current_magazine = magazine_index;
        document.querySelector('.bottom').style.display='block'
    }
}

//chart page

function displayList(songs){
    let chart_lists = document.querySelector('.chart_list_list')
    chart_lists.innerHTML = (songs.map(song => createList(song)).join(''))
    chartLi = document.querySelectorAll('.chart_lists');
}
function createList(song){
    return `<li class="chart_lists" data-rank="${song.rank}">
        <ul>
        ${updownD()}
        <li class="rank" data-rank="${song.rank}">${song.rank}</li>
        <li class="chart_art" data-rank="${song.rank}"><img src="${song.albumart}" alt=""></li>
        <li class="chart_songs" data-rank="${song.rank}">${song.title}</li>
        <li class="chart_artist" data-rank="${song.rank}">${song.artist}</li>
        <li class="chart_album" data-rank="${song.rank}">${song.album}</li>
            <ul class="play_icon">
                <li><img src="img/icons/chart_play.png" alt=""></li>
                <li><img src="img/icons/chart_plus.png" alt=""></li>
                <li><img src="img/icons/chart_more.png" alt=""></li>
            </ul>
        </ul>
    </li>`
}


//li 마우스 엔터 아웃
//li 랭크 받아서 만약 01일 경우 원본
//li 받아서 01이 아닐경우 long값에 updown
function chartBig(songs){
    let chartLi = document.querySelectorAll('.chart_lists');
    chartLi.forEach(function(item){
    item.addEventListener('click',function(event){
        loadSongs().then((songs) => {
            let no1 = document.querySelector('.no1')
            let bigChart = event.target.dataset.rank
            let choose = songs.find(song => song.rank == bigChart)
            no1.innerHTML = createNo1(choose)
            let no1Title = document.querySelector('.no1_title_text')
            if(no1Title.innerHTML.length > 14){
                no1Title.style.fontSize = '30px'
            }
            dateCreate()
        }) 
    })
})
}
function dateCreate(){
    let date = document.querySelector('.date')
    let today = new Date;
    date.innerHTML = `${today.getFullYear()}. ${today.getMonth()+1}. ${today.getDate()}. <b>${today.getHours()}:00</b>`    
}
dateCreate()
function createNo1(song){
    return `<div class="no1">
    <div class="no1_art"><img src="${song.albumart}" alt=""></div>
    <div class="no1_title"><span class="number">${song.rank} -</span><br>
      <span class="no1_title_text">${song.title}</span>
    </div>
    <div class="no1_artist">
      ${song.artist}<br> 
      <span>${song.album}</span>
    </div>
    <div class="no1_box">
      <div>
        <p class="date"></p>
        <p class="long"></p>
      </div>
      <div>
        <div><span><img src="img/icons/icon_7.png" alt=""></span>${Math.floor(Math.random()*10000)}</div>
        <ul class="play_icon">
          <li><img src="img/icons/chart_play.png" alt=""></li>
          <li><img src="img/icons/chart_plus.png" alt=""></li>
          <li><img src="img/icons/chart_more.png" alt=""></li>
        </ul>
      </div>`
}


function updownD(){
    let updown = Math.floor(Math.random()*3 +1);
    if(updown == 1){
        return `
        <li class="updown up"><img src="img/icons/chart_up.png">${Math.floor(Math.random()*3 + 1)}</li>`
    }else if(updown == 2){
        return `
        <li class="updown down"><img src="img/icons/chart_down.png">${Math.floor(Math.random()*3 + 1)}</li>`
    }else{
        return `
        <li class="updown normal"><img src="img/icons/chart_normal.png"></li>`
    }
}



//trend page
//main slide
let trendSlide = document.querySelector('.trend_slide');
let trendimg = document.querySelectorAll('.trend_imgs li');
let slide_btn = document.querySelectorAll('.trend_main .toggle_btn span');
let gerne;
let trendCurrent0 = 0;
let trendCurrent1 = 1;
let trendCurrent2 = 2;
liBgMake(trendimg, 'trend', 'jpg');

function gerneSelect(){
    gerne  = document.querySelector('.trend_0').dataset.gerne; 
}
function trendNum0(){
    if(trendCurrent0 == -1){
        trendCurrent0 = 2
    }else if(trendCurrent0 == 3){
        trendCurrent0 = 0
    }
}
function trendNum1(){
    if(trendCurrent1 == -1){
        trendCurrent1 = 2
    }else if(trendCurrent1 == 3){
        trendCurrent1 = 0
    }
}
function trendNum2(){
    if(trendCurrent2 == -1){
        trendCurrent2 = 2
    }else if(trendCurrent2 == 3){
        trendCurrent2 = 0
    }
}
function slideTrend(){
    trendNum0()
    trendNum1()
    trendNum2()
    for(i=0; i<trendimg.length; i++){    
        trendimg[i].classList.remove('trend_0')
        trendimg[i].classList.remove('trend_1')
        trendimg[i].classList.remove('trend_2')
        trendimg[0].classList.add(`trend_${trendCurrent0}`)
        trendimg[1].classList.add(`trend_${trendCurrent1}`)
        trendimg[2].classList.add(`trend_${trendCurrent2}`)
    }
    document.querySelector('.trend_0').style.zIndex = '3'
    document.querySelector('.trend_2').style.zIndex = '1'
    document.querySelector('.trend_1').style.zIndex = '2'
        
}
let Timer;
function trendTimer(){
    Timer = setInterval(function(){
            trendCurrent0++
            trendCurrent1++
            trendCurrent2++
            slideTrend()
        }, 10000);
};
trendTimer()
slide_btn.forEach(function(item){
    item.addEventListener('mouseleave',function(){
        trendTimer() 
    })
    item.addEventListener('mouseenter',function(){
        clearInterval(Timer)
    })
})
slide_btn.forEach(function(item){
    item.addEventListener('click',function(event){   
        let direction = event.target.getAttribute('class')
        if( direction == 'left'){
            trendCurrent0--
            trendCurrent1--
            trendCurrent2--
            slideTrend()
            loadSongs().then((songs) => {
                gerneSelect()
                dataDisplay(songs)
            })
        }else{
            trendCurrent0++
            trendCurrent1++
            trendCurrent2++
            slideTrend()
            document.querySelector('.trend_0').style.zIndex = '3'
            document.querySelector('.trend_2').style.zIndex = '2'
            document.querySelector('.trend_1').style.zIndex = '1'
            loadSongs().then((songs) => {
                gerneSelect()
                dataDisplay(songs)
            })
        }   
    })
})

//수록곡 만들기
let trendSongs = document.querySelector('.trend_songs_list')
let trendSongBtn = document.querySelectorAll('.trend_songs .toggle_btn span')
let trendSonglength;
function displayTrendList(songs){
    trendSongs.style.transition = '0s'
    trendSongCurrent = 0;
    trendSongs.innerHTML = (songs.map(song => createTrendList(song)).join(''))
    trendSongSlide(0);
}

function dataDisplay(songs){
    let filterd = songs.filter(song => song.gerne == gerne)
    displayTrendList(filterd)
    trendSonglength = filterd.length
    trendSongs.style.width = trendSonglength * 180 + 'px'
}
function createTrendList(song){
    return`<li>
        <div class="trend_songs_art">
        <img src="${song.albumart}" alt="">
        <div class="black_bg">
            <div class="btn"><img src="img/icons/btn_play.png" alt=""></div>
        </div>
        </div>
        <div class="trend_songs_text">
        <h6>${song.title}</h6>
        <p>${song.artist}</p>
        </div>
    </li>`
}

let trendSongCurrent = 0;
function trendSongSlide(index){
    trendSongs.style.left = -(180 * index) + 'px' 
}

trendSongBtn.forEach(function(item){
    item.addEventListener('click',function(event){   
        let direction = event.target.getAttribute('class')
        if( direction == 'left'){
            if(trendSongCurrent < trendSonglength - 8){
                trendSongs.style.transition = '1s'
                trendSongCurrent++
                trendSongSlide(trendSongCurrent)
            }     
        }else{
            if(trendSongCurrent > 0){
                trendSongs.style.transition = '1s'
                trendSongCurrent--
                trendSongSlide(trendSongCurrent)
            }
            
        }   
    })
})


//podcast page
let podcastToggle = document.querySelectorAll('#wrap_podcast .page_toggle')
let podcastPage = document.querySelector('.podcast')
let podcast = document.querySelectorAll('.podcast > li')
let podcastCurrent=0
podcastToggle.forEach(function(item){
    item.addEventListener('click',function(event){
        if(event.target.getAttribute('class') == "page_toggle left"){
            podcastCurrent++
            slidePodcast(podcastCurrent)
            classOn(podcastToggle,podcastToggle[0])
            classOn(podcast,podcast[0])
    
        }else{
            podcastCurrent--
            slidePodcast(podcastCurrent)
            classOn(podcastToggle,podcastToggle[1])
            classOn(podcast,podcast[1])
        }
    })
})
function slidePodcast(index){
    podcastPage.style.left = (index * 1680) + 'px'
    podcastCurrent = index
}
let pororo = document.querySelectorAll('.podcast02 .contents li')
let bts = document.querySelectorAll('.podcast01 .contents li')
for(i = 0; i < pororo.length; i++){
    pororo[i].children[0].style.background = `url(img/podcast_li_pororo${+ i}.jpg) center center / cover no-repeat`
    bts[i].children[0].style.background = `url(img/podcast_li_bts${+ i}.jpg) center center / cover no-repeat`
}
function podcastOn(){
    if(subMenus[3].getAttribute('class') == 'sub_menu on'){
        podcast[0].classList.add('on')
    }else{
        podcast[0].classList.remove('on')
    }
}

//video 페이지
//video 재생바
let video = document.querySelector('.musicvideo_main video')
let progressBar = document.querySelector('.movie_underbar')
let progress =document.querySelector('.movie_controler')
function handleProgress(){
    let percent = (video.currentTime / video.duration) *100;    
    progressBar.style.width = `${percent}%`
}

video.addEventListener('timeupdate',handleProgress);

function scrub(e) { 
    let scrubTime = (e.offsetX / progress.offsetWidth) * video.duration; 
    video.currentTime = scrubTime; 
} 
let mousedown = false; 
progress.addEventListener('click', scrub); 
progress.addEventListener('mousemove', (e) => mousedown && scrub(e)); 
progress.addEventListener('mousedown', () => mousedown = true); 
progress.addEventListener('mouseup', () => mousedown = false);


//video 정지
let video_play_btn = document.querySelector('.video_play_btn')
let video_stop_btn = document.querySelector('.video_stop_btn')
let video_mute_btn = document.querySelector('.mute_btn');
let video_muteX_btn = document.querySelector('.muteX_btn');
video_stop_btn.addEventListener('click',function(){
    main_video_stop()
})
video_play_btn.addEventListener('click',function(){
    main_video_play()
})
function main_video_stop(){
    video.pause()
    video_stop_btn.style.display = 'none'
    video_play_btn.style.display = 'block'
}
function main_video_play(){
    video.play()
    video_stop_btn.style.display = 'block'
    video_play_btn.style.display = 'none'
}
video_mute_btn.addEventListener('click', function(){
    main_video = true;
    main_video_muteX()
    audiostop()
})
video_muteX_btn.addEventListener('click', function(){
    main_video_mute()
    main_video = false;
    if(main_music == true){
        audioPlay()
    }
})
function main_video_mute(){
    video_muteX_btn.style.display = 'none'
    video_mute_btn.style.display = 'block'
    video.muted = true;
}
function main_video_muteX(){
    video_mute_btn.style.display = 'none'
    video_muteX_btn.style.display = 'block'
    video.muted = false;
}

let povideo = document.querySelector('.popular_video video')
let videos = document.querySelectorAll('.videos')
videos.forEach(function(item){
    item.addEventListener('mouseenter',function(event){
        event.target.children[0].children[0].play()
        event.target.children[0].children[1].style.display='none'
    })
    item.addEventListener('mouseleave',function(event){
        event.target.children[0].children[0].pause()
        event.target.children[0].children[1].style.display='block'
    })
    item.addEventListener('click',function(event){
        let mainVideo = document.querySelector('.main_video')
        let videoUrl = event.target.getAttribute('src')
        let videoKey = event.target.getAttribute('data-key')
        let mainKey = document.querySelector('.main_video').getAttribute('data-key')
        let subText = event.path[2].children[1]
        let mainText = document.querySelector('.musicvideo_text')
        event.target.setAttribute('src', mainVideo.getAttribute('src'));
        mainVideo.setAttribute('src', videoUrl)
        event.target.setAttribute('data-key', mainKey);
        mainVideo.setAttribute('data-key', videoKey);
        loadSongs().then((songs) => {
            let result = songs.find(song => song.title === videoKey)
            let result2 = songs.find(song => song.title === mainKey)
            createMainDisplay(mainText, result)
            createSubDisplay(subText, result2)
        })  
    })
})

function createSubDisplay(index, song){
    index.innerHTML = createSubText(song)
}
function createSubText(song){
    return` <h6>${song.title}</h6>
            <p>${song.artist}</p>`
}
function createMainDisplay(index, song){
    index.innerHTML = createMainText(song)
    let mainArt = document.querySelector('.musicvideo_albumart img')
        mainArt.setAttribute('src', song.albumart)
}
function createMainText(song){
    return` <h2>${song.title}</h2>
    <p>${song.artist}</p>
    <p>${song.album}</p>`
}
//dj 페이지
let djList = document.querySelectorAll('.dj_lists')

djList.forEach(function(item){
    item.addEventListener('mouseenter',function(event){
        classOn(djList, event.target);
    })
})
liBgMake(djList,'dj_','jpg')
