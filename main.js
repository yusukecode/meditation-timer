let startTime;
let TimeDistance;
let distanceTotal;
let hournum = document.getElementById('hournum');
let minutenum = document.getElementById('minutenum');
let secondnum = document.getElementById('secondnum');
let timeView = document.getElementById('timeView');
let startBtn = document.getElementById('startBtn');

let hourPrev = document.querySelector('.hourArea .prev');
let hourNext = document.querySelector('.hourArea .next');
let minutePrev = document.querySelector('.minuteArea .prev');
let minuteNext = document.querySelector('.minuteArea .next');
let secondPrev = document.querySelector('.secondArea .prev');
let secondNext = document.querySelector('.secondArea .next');

//キャンバス
let gage = document.getElementById('gage');
let context = gage.getContext('2d');
let subtraction = 0;

let bellBGM = document.getElementById('bellBGM');
let wildbirdBGM = document.getElementById('wildbirdBGM');

//ラジオボタン
let bgmon = document.getElementById('bgmon');
let nobgm = document.getElementById('nobgm');
let bgmon_flg = false;

hournum.onchange = beforeTimeView;
minutenum.onchange = beforeTimeView;
secondnum.onchange = beforeTimeView;

const defaultData = {
    bgmcheck: '0',
    hournum: '0',
    minutenum: '0',
    secondnum: '0',
  };

// localStorage該当item取得
const storageData = JSON.parse(localStorage.getItem('sample')) ?? defaultData;

hournum.selectedIndex = storageData.hournum;
minutenum.selectedIndex = storageData.minutenum;
secondnum.selectedIndex = storageData.secondnum;

(storageData.bgmcheck == 0)?bgmon.checked = true:nobgm.checked = true;


DrawArc();

startBtn.addEventListener('click',function(){
    if(startTime == null){
        showTimer();
    }
},false);

hourPrev.addEventListener('click',function(){
    if(hournum.selectedIndex === 0){
        hournum.selectedIndex = 23;
    } else {
        hournum.selectedIndex--;
    }
    
    beforeTimeView();
    
},false);

hourNext.addEventListener('click',function(){
    if(hournum.selectedIndex === 23){
        hournum.selectedIndex = 0;
    } else {
        hournum.selectedIndex++;
    }
    
    beforeTimeView();
    
},false);

minutePrev.addEventListener('click',function(){
    if(minutenum.selectedIndex === 0){
        minutenum.selectedIndex = 59;
    } else {
        minutenum.selectedIndex--;
    }
    
    beforeTimeView();
    
},false);

minuteNext.addEventListener('click',function(){
    if(minutenum.selectedIndex === 59){
        minutenum.selectedIndex = 0;
    } else {
        minutenum.selectedIndex++;
    }
    
    beforeTimeView();
    
},false);

secondPrev.addEventListener('click',function(){
    if(secondnum.selectedIndex === 0){
        secondnum.selectedIndex = 59;
    } else {
        secondnum.selectedIndex--;
    }

    beforeTimeView();

},false);

secondNext.addEventListener('click',function(){
    if(secondnum.selectedIndex === 59){
        secondnum.selectedIndex = 0;
    } else {
        secondnum.selectedIndex++;
    }

    beforeTimeView();
},false);

//スタート前の設定時の時間表示
function beforeTimeView()
{
    if(startTime == null){
        let hourdistance = hournum.options[hournum.selectedIndex].value;
        let minutedistance = minutenum.options[minutenum.selectedIndex].value;
        let seconddistance = secondnum.options[secondnum.selectedIndex].value;
        let hourView = (hourdistance<10)?"0" + hourdistance: hourdistance ;
        let minuteView = (minutedistance<10)?"0" + minutedistance: minutedistance ;
        let secondView = (seconddistance<10)?"0" + seconddistance:seconddistance ; 
        timeView.textContent = hourView + ":" + minuteView + ":" + secondView;
    }

}

//タイマーの円を描画する関数
function DrawArc()
{
    context.clearRect(0, 0, gage.width, gage.height);
    context.beginPath();
    context.arc(125,100,75,-90 * Math.PI / 180,(270 - subtraction) * Math.PI / 180,false);
    context.strokeStyle = "#4ac6e8"; //カラー青緑
    context.lineWidth = 4;
    context.stroke();
}

//タイマーの関数
function showTimer()
{
    let hourdistance = hournum.options[hournum.selectedIndex].value;
    let minutedistance = minutenum.options[minutenum.selectedIndex].value;
    let seconddistance = minutenum.options[secondnum.selectedIndex].value;

    if(startTime==null&&hourdistance==0&&minutedistance==0){
        alert("１分以上の時間が設定されていません。");
        return;
    }
    if(startTime == null)
    {
        startTime = new Date().getTime();
        let hourdistance = hournum.options[hournum.selectedIndex].value;
        let minutedistance = minutenum.options[minutenum.selectedIndex].value;
        let seconddistance = secondnum.options[secondnum.selectedIndex].value;
        distanceTotal = (hourdistance * 60 * 60 * 1000) + (minutedistance * 60 * 1000) + (seconddistance * 1000);
        TimeDistance = startTime + distanceTotal;
        bellBGM.load();
        bellBGM.currentTime = 0;
        bellBGM.play();
        if(bgmon.checked == true)
        {
            wildbirdBGM.load();
            wildbirdBGM.currentTime = 0;
            wildbirdBGM.play();
            bgmon_flg = true;
        }

        

        

        const testArray = {
            bgmcheck: 1,
            hournum: hournum.selectedIndex,
            minutenum: minutenum.selectedIndex,
            secondnum: secondnum.selectedIndex,
          };

        if(bgmon_flg === true){
            testArray.bgmcheck = '0';
        }

        console.log(storageData);
        Object.entries(storageData).forEach(e => storageData[e[0]] = testArray[e[0]]);
        console.log(storageData.minutenum);
        localStorage.setItem('sample', JSON.stringify(storageData));
    }
    
    //最新の時間をマイナスして残り時間を割り出す
    let currentTime = new Date().getTime();
    let elapsedTime = TimeDistance - currentTime;

    //タイマー残り時間計算用
    subtraction = 360 - (360 * (elapsedTime / distanceTotal));

    DrawArc(); //タイマーの円を描画

    if(elapsedTime <= 0)
    {
        if(bgmon_flg == true){
            wildbirdBGM.pause();          // 一時停止
            wildbirdBGM.currentTime = 0;  // 次は最初（先頭）から再生する
        }

        bellBGM.load();
        bellBGM.currentTime = 0;
        bellBGM.play();
        timeView.textContent = "00:00:00";
        startTime = null;
    } else 
    {
        let hour = Math.floor(elapsedTime / 3600000);
        let minute = Math.floor(elapsedTime % 3600000 / 60000);
        let second = Math.floor(elapsedTime % 60000 / 1000)
        let hourView = (hour<10)?"0" + hour: hour ;
        let minuteView = (minute<10)?"0" + minute: minute ;
        let secondView = (second<10)?"0" + second: second ;    
        timeView.textContent = hourView + ":" + minuteView + ":" + secondView;
        setTimeout(showTimer,10);
    }
}

window.onload = function()
{
// 取得データの画面上への反映例
const setElements = () => {
    console.log(storageData.minutenum.selectedIndex);
    Object.entries(storageData).forEach(e => document.getElementById(e[0])= e[1]);
  };
  setElements();

    //BGMの読み込み
    bellBGM.muted = true;
    wildbirdBGM.muted = true;
    bellBGM.play();
    wildbirdBGM.play();
    bellBGM.pause();
    wildbirdBGM.pause();
    bellBGM.currentTime = 0;
    wildbirdBGM.currentTime = 0;
    bellBGM.muted = false;
    wildbirdBGM.muted = false;
}

function LoadCheck(arr,val){        //セーブデータの有無のチェック
    for(let i = 0;i<arr.length;i++){
        if(arr[i][0] == val){
            return true;
        }
    }
    return false;
}

function SaveLoad(arr,val){        //セーブデータのロード
    for(let i = 0;i<arr.length;i++){
        if(arr[i][0] == val){
            return arr[i][1];
        }
    }
    return null;
}