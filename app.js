const data=(window.VISHNU_PRACTICE_DATA||[]).map((x,i)=>({...x,end:x.end||(i+1<window.VISHNU_PRACTICE_DATA.length?window.VISHNU_PRACTICE_DATA[i+1].start:2482)}));
const SECTIONS=data.length;

let player,playerReady=false,current=0,played=new Set(JSON.parse(localStorage.getItem("vishnuPlayed")||"[]"));
const $=s=>document.querySelector(s);
const list=$('#slokaList');

function render(){
  list.innerHTML=data.map(x=>`<button class="sloka-row ${x.id-1===current?'active':''}" data-index="${x.id-1}"><span class="sloka-number">${String(x.id).padStart(2,'0')}</span><span><strong>${x.title}</strong><small>${formatTime(x.start)} – ${formatTime(x.end)}</small></span><span class="check">${played.has(x.id)?'✓':''}</span></button>`).join('');
  $('#progressText').textContent=`${played.size} / ${SECTIONS} played`;
  $('#sectionLabel').textContent=`SECTION ${current+1} OF ${SECTIONS}`;
  $('#nowTitle').textContent=data[current].title;
  $('#nowText').textContent=data[current].text ? `Auto transcription: ${data[current].text}` : "Listen, repeat, and learn this passage.";
  document.querySelectorAll('.sloka-row').forEach(b=>b.onclick=()=>select(+b.dataset.index,true));
}
function formatTime(s){const m=Math.floor(s/60),r=Math.floor(s%60);return `${m}:${String(r).padStart(2,'0')}`}
function select(i,play=false){current=(i+SECTIONS)%SECTIONS;render();if(player&&player.seekTo){player.seekTo(data[current].start,true);if(play)player.playVideo()}}
function play(){if(!playerReady||typeof player.getPlayerState!=="function")return;if(player.getPlayerState()===1)player.pauseVideo();else player.playVideo()}

window.onYouTubeIframeAPIReady=()=>{player=new YT.Player('player',{videoId:'W2gNg8-XQRg',playerVars:{rel:0,playsinline:1,origin:location.origin},events:{onReady:()=>{playerReady=true;player.seekTo(0,true)},onStateChange:e=>{if(e.data===0||e.data===2)return;if(e.data===1&&typeof player.getCurrentTime==="function"){markPlayed();if(player.getCurrentTime()>data[current].end-.5){player.seekTo(data[current].start,true)}}}}})};
function markPlayed(){played.add(data[current].id);localStorage.setItem("vishnuPlayed",JSON.stringify([...played]));render()}
setInterval(()=>{if(playerReady&&typeof player.getPlayerState==="function"&&player.getPlayerState()===1){const t=player.getCurrentTime();if(t>=data[current].end){if($('#repeatToggle').checked)player.seekTo(data[current].start,true);else select(current+1,true)}}},500);
$('#playButton').onclick=play;$('#prevButton').onclick=()=>select(current-1,true);$('#nextButton').onclick=()=>select(current+1,true);
$('#speedOptions').onclick=e=>{const b=e.target.closest('button');if(!b)return;document.querySelectorAll('#speedOptions button').forEach(x=>x.classList.remove('active'));b.classList.add('active');if(player)player.setPlaybackRate(+b.dataset.speed)};
$('#themeButton').onclick=()=>document.body.classList.toggle('dark');
render();
