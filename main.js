/*
User Story: I can start a 25 minute pomodoro, and the timer will go off once 25 minutes has elapsed.

User Story: I can reset the clock for my next pomodoro.

User Story: I can customize the length of each pomodoro.

*/

$('document').ready(function(){
		 
		

	var startStop = $('#start_stop');
	var reset = $('#reset');
	var timer = $('#time');

	var sessionTime =25; // measured in seconds
	var status = "paused";
	var sessionsCompleted=0;

	var breakTime = 5;
	var onBreak = false;

	var audioCheck = true;

	// default set the next times to what is currently set
	var nextSessionTime = sessionTime;
	var nextBreakTime = breakTime;

	timer.text(secsToMins(sessionTime));
	
	var countdown;

	var currTime = sessionTime;
	var snd = new Audio("http://www.wavsource.com/snds_2016-06-26_4317323406379653/sfx/alarm_beep.wav"); // buffers automatically when created
	snd.volume = 0.2;

	function soundAlarm(){
		snd.play();
		setTimeout(function(){
		snd.pause();
		},600)
	}


	startStop.click(function(){
		console.log("startStop clicked- currTime: "+ currTime);
		
		if(status === "paused"){ // if it is paused start playing
			status ="playing";
			console.log("countdown: " + countdown);
			if(countdown){
				console.log("countdown found : " + countdown);
				clearInterval(countdown);
			}
			decTimer();
			playBtnToggle("play");	
		}else{ // is [playing]
			status="paused";
			playBtnToggle("pause");

		}
	})

	//put a wait = true to see if wait is true before you click
	function decTimer(){
		console.log("decTimer()--- currTime: " + currTime );
		if(status==="paused" ){ 
			console.log("status is paused in dec timer");
		return; } // kill the recurring func if it is pause. If the timer has just been changed you can allow for it to continue
		if(onBreak){updateMug();}else{updateBulb();}

		
		if(currTime!==0){		
			 countdown = setTimeout(function(){
				//	console.log(currTime);
					if(status==="paused"){ 
						
					return; } // kill the function if the button is clicked
					if(onBreak){updateMug();}else{updateBulb();}
					currTime--;
					timer.text(secsToMins(currTime));	
					decTimer();
				},1000);
		
			return;
		}else{
			console.log("finished");
			// need to recognise whether on break or not then reset timer accordingly
			if(onBreak){ 
				onBreak = false;
				resetTimer("session",true);
			}else{
				onBreak = true;
				sessionsCompleted ++;
				resetTimer("break",true);
			}
			if(audioCheck){
				soundAlarm();
			}
			statusDisChange();
			toggleAnimation();
			decTimer();
		}
	}


	function secsToMins(time){
		var minutes = Math.floor(time / 60);
		var seconds = time - minutes * 60;
		if( String(minutes).length ===1 ){
			minutes = "0" + minutes;
		}
		if( String(seconds).length ===1 ){
			seconds = "0" + seconds;
		}
	
		return minutes + ":" +seconds;
	}

	//secsToMins(32);


	reset.click(function(){
		console.log("reset clicked");
	
			resetTimer("session",false);

	

	})
 		
 	// the problem is that when you click the restTimer the previous decTIme cannot catch your changes of the status before creating a new DecTime 	
 	function resetTimer(desiredStatus, autoStart){
 		

 		if(desiredStatus ==="break"){
 			currTime = nextBreakTime;
 			breakTime = nextBreakTime;
 			onBreak=true;
 			statusDisChange();
 			timer.html(secsToMins(currTime));
 		}
 		if(desiredStatus ==="session"){
 			currTime = nextSessionTime;
 			sessionTime = nextSessionTime;
 			onBreak=false;
 			statusDisChange();
 			timer.html(secsToMins(currTime));

 		}
 			toggleAnimation();
 			$('#bulb-mask').css({"height":"" }); // shift the clip from the top
 		//$('#bulb-contents').css({"clip":""}); 	
 		if(autoStart == true){
 			playBtnToggle("play");
 		}else{
 			playBtnToggle("pause");
 		}
 		
		
 	}	

	function playBtnToggle(stateDesired){
		if(stateDesired === "pause"){
			startStop.html("play"); 
			startStop.addClass('play');
			startStop.removeClass('stop');
			status="paused";
		}
		if(stateDesired === "play"){
			startStop.html("pause"); 
			startStop.addClass('stop');
			startStop.removeClass('play');
			status="playing";
		}
	}

	/* BUTTONS FOR THE TIMER SETTINGS */



	$('#minus_break_timer').click(function(){
		console.log("clicked - minus break timer");
		console.log(breakTime);
		if(nextBreakTime>0){
			nextBreakTime --;
			$('#break_timer').html(nextBreakTime);
		}
		
	})


	$('#add_break_timer').click(function(){
		console.log("clicked - add break timer");

		if(nextBreakTime<20){
			console.log(nextBreakTime);
			nextBreakTime ++;
			$('#break_timer').html(nextBreakTime);
		}
	})

	$('#minus_session_timer').click(function(){
		console.log("clicked - minus session timer");
		if(nextSessionTime>5){
			nextSessionTime --;
			$('#session_timer').html(nextSessionTime);
		}
	})


	$('#add_session_timer').click(function(){
		console.log("clicked - add session timer");
		if(nextSessionTime<60){
			nextSessionTime ++;
			$('#session_timer').html(nextSessionTime);
		}
	})
	/*----------------------------------- */

	function statusDisChange(){
		console.log("--statusDisChange()---")
		if(onBreak){
			$('#status-dis').html("on break");
		}
		if(!onBreak){
			$('#status-dis').html("in session no. " + (sessionsCompleted+1));
		}
	}

	$('#audio-check').click(function(){
		
		audioCheck = !audioCheck; //toggle
		console.log(audioCheck);
	})
	
	/*-------- Animations ------------- */

	function toggleAnimation(){
		if(onBreak){
			 $('#bulb').hide();
     		 $('#mug').show();
		}else{
			$('#bulb').show();
     		$('#mug').hide();
		}
	}

	function updateMug(){

		var num1=currTime;
		var num2 = breakTime;
		var fullPercent = 60; // at 60& the mug is full
		var percent = Math.round((num1 / num2) * 100);
		percent = (percent/100)*fullPercent; 
		// you need to divide the 
		$('#mug-contents').css({"height":percent +"%"});
	}

	function updateBulb(){

		var num1=currTime;

		var num2 = sessionTime;
		
		var fullVal = 72;
		var minVal = 20;
		var diff = fullVal-minVal;
		var percent = Math.round((num1 / num2) * 100);

		var amnt = (percent/100)*diff;
		var finalVal = amnt+minVal;

		$('#bulb-mask').css({"height":finalVal + "px" }); // shift the clip from the top
	

	}

	
	

});

	