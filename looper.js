/*
* @Author: benjaminkalish
* @Date:   2020-04-24 16:10:18
* @Last Modified by:   benjaminkalish
* @Last Modified time: 2020-04-24 19:11:26
*/
 
inlets = 3;
outlets = 1;
var incrementMultiplier = 1;

logger("looper ran");

function logger(msg){
	post(msg);
	post("\n");
}

function signal(x){
	logger("signal ran with signal: " + x);
}

function transition(){return;}
	
function msg_float(inputMsg){
	logger("inside float with message: " + inputMsg);
}

function msg_int(inputMsg){
	// inputMsg will be MIDI clock signal if inlet 0, else number of beats to start transition
	if(inlet === 0){
		transition();
		return;
	}
	
	else if(inlet === 1){ // set key change amount and direction
		incrementMultiplier = inputMsg;
		logger("Key Change set to: " + inputMsg);
		return;
	}
	
	else{ // must be inlet 2, start transition
		logger("initializing transition");
	
		var maxTime = inputMsg * 24; // beats * 24
		var timeElapsed = 0;
		var incrementsNeeded = 100; // semitones up * 100
		var incrementsSent = 0;
		
		logger("maxTime = " + maxTime);

		var reset_transition = function(){
			transition = function(){return;};
			logger("transition reset");
		}

		transition = function(){
			timeElapsed++;
			
			if(timeElapsed > maxTime){
				reset_transition();
				return;
			}
			
			var progress = timeElapsed / maxTime;
			var expectedIncrementProgress = progress * incrementsNeeded;
			//could use mod here for more acc
			var currentIncrement = Math.floor(expectedIncrementProgress - incrementsSent);
			
			logger("increment = " + currentIncrement);
			
			outlet(0, 64 + (currentIncrement * incrementMultiplier));
			
			incrementsSent += currentIncrement;
			
			logger("time elapsed = " + timeElapsed);
			logger( (100 * progress) + "% done");
		}
	}

}

