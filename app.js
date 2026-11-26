const data=(window.VISHNU_PRACTICE_DATA||[]).map((x,i)=>({...x,title:`Shloka ${x.id}`,end:x.end||(i+1<window.VISHNU_PRACTICE_DATA.length?window.VISHNU_PRACTICE_DATA[i+1].start:2482)}));
const SECTIONS=data.length;

let player,playerReady=false,current=0,played=new Set(JSON.parse(localStorage.getItem("vishnuPlayedScenes")||"[]"));
let selected=new Set(),playbackQueue=null,queuePosition=-1;
const $=s=>document.querySelector(s);
const list=$('#slokaList');

function render(){
  list.innerHTML=data.map((x,i)=>`<div class="sloka-row ${i===current?'active':''}"><input class="sloka-checkbox" type="checkbox" aria-label="Select Shloka ${x.id}" data-index="${i}" ${selected.has(i)?'checked':''}><span class="sloka-number">${String(x.id).padStart(2,'0')}</span><button class="sloka-open" type="button" data-index="${i}"><strong>Shloka ${x.id}</strong><small>${formatTime(x.start)} – ${formatTime(x.end)}</small></button><span class="check">${played.has(x.id)?'✓':''}</span></div>`).join('');
  $('#progressText').textContent=`${played.size} / ${SECTIONS} played`;
  $('#sectionLabel').textContent=`SHLOKA ${data[current].id} OF ${SECTIONS}`;
  $('#nowTitle').textContent=`Shloka ${data[current].id}`;
  $('#nowText').textContent="One scene from the source recording.";
  $('#selectionCount').textContent=`${selected.size} selected`;
  $('#playSelectedButton').disabled=selected.size===0;
  list.querySelectorAll('.sloka-checkbox').forEach(input=>input.onchange=()=>{
    const index=+input.dataset.index;
    if(input.checked)selected.add(index);else selected.delete(index);
    render();
  });
  list.querySelectorAll('.sloka-open').forEach(button=>button.onclick=()=>select(+button.dataset.index,true));
}
function formatTime(s){const m=Math.floor(s/60),r=Math.floor(s%60);return `${m}:${String(r).padStart(2,'0')}`}
function select(i,play=false){playbackQueue=null;queuePosition=-1;current=(i+SECTIONS)%SECTIONS;render();if(playerReady&&player.seekTo){player.seekTo(data[current].start,true);if(play)player.playVideo()}}
function startSelectedQueue(){
  playbackQueue=[...selected].sort((a,b)=>a-b);
  if(!playbackQueue.length)return;
  queuePosition=0;
  playQueueItem();
}
function playQueueItem(){
  current=playbackQueue[queuePosition];
  render();
  if(playerReady){player.seekTo(data[current].start,true);player.playVideo()}
}
function moveQueue(direction){
  if(!playbackQueue)return select(current+direction,true);
  queuePosition=(queuePosition+direction+playbackQueue.length)%playbackQueue.length;
  playQueueItem();
}
function play(){if(!playerReady||typeof player.getPlayerState!=="function")return;if(player.getPlayerState()===1)player.pauseVideo();else player.playVideo()}

window.onYouTubeIframeAPIReady=()=>{player=new YT.Player('player',{videoId:'W2gNg8-XQRg',playerVars:{rel:0,playsinline:1,origin:location.origin},events:{onReady:()=>{playerReady=true;player.seekTo(data[0].start,true)},onStateChange:e=>{if(e.data===0||e.data===2)return;if(e.data===1&&typeof player.getCurrentTime==="function"){markPlayed();if(player.getCurrentTime()>data[current].end-.5){player.seekTo(data[current].start,true)}}}}})};
function markPlayed(){played.add(data[current].id);localStorage.setItem("vishnuPlayedScenes",JSON.stringify([...played]));render()}
setInterval(()=>{if(playerReady&&typeof player.getPlayerState==="function"&&player.getPlayerState()===1){const t=player.getCurrentTime();if(t>=data[current].end){if(playbackQueue){if(queuePosition+1<playbackQueue.length){queuePosition++;playQueueItem()}else if($('#repeatToggle').checked){queuePosition=0;playQueueItem()}else{playbackQueue=null;queuePosition=-1;player.pauseVideo()}}else if($('#repeatToggle').checked)player.seekTo(data[current].start,true);else select(current+1,true)}}},500);
$('#playButton').onclick=play;$('#prevButton').onclick=()=>moveQueue(-1);$('#nextButton').onclick=()=>moveQueue(1);
$('#speedOptions').onclick=e=>{const b=e.target.closest('button');if(!b)return;document.querySelectorAll('#speedOptions button').forEach(x=>x.classList.remove('active'));b.classList.add('active');if(player)player.setPlaybackRate(+b.dataset.speed)};
$('#themeButton').onclick=()=>document.body.classList.toggle('dark');
$('#selectAllButton').onclick=()=>{selected=new Set(data.map((_,i)=>i));render()};
$('#clearSelectionButton').onclick=()=>{selected.clear();render()};
$('#playSelectedButton').onclick=startSelectedQueue;
render();
