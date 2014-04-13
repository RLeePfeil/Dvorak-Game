var stats = {
	startTime: null,
	numChars: 0,
	numCorrectChars: 0,
	numIncorrectChars: 0,
	numWords: 0,
	incorrectChars: {}
}

$(function(){
	addSentence('the quick brown fox jumps over the lazy dog');
	//$('body').on('keypress', handleKeypress);
	
	KeyboardJS.on(alphabet(), onDownCallback, null);
});

function addSentence(sentence) {
	var split = sentence.split(""),
		output = '';
	for (var i=0; i<split.length; i++) {
		output+= '<span class="char">'+split[i]+'</span>';
	}
	
	$('#sentence').append(output).find('.char:first').addClass('current');
}

/*
 * e = event
 * a = array of characters
 * c = character
 */
function onDownCallback(e, a, c) {
	e.preventDefault();
	
	// Start stats timer
	if (stats.startTime == null) {
		stats.startTime = Date.now();
	}
	
	//console.log(e);
	//console.log(a);
	//console.log(c);
	
	var $current = $('span.current', '#sentence');
	if (c == 'backspace') {
		var $prev = $current.prev();
		if ($prev.length) {
			$prev.removeClass('correct incorrect').addClass('current');
			$current.removeClass('correct incorrect current');
			stats.numChars--;
			if ($prev.html() == ' ') {
				stats.numWords--;
			}
		}
		
		return false;
	}
	
	if (a.length>1 && c != a[a.length-1]) {
		return false;
	}
	
	if (compareKeys($current.html(), a, c)) {
		$current.addClass('correct');
		stats.numCorrectChars++;
		
		if (a[a.length-1] == 'spacebar') {
			stats.numWords++;
		}
	} else {
		$current.addClass('incorrect');
		stats.numIncorrectChars++;
	}
	
	stats.numChars ++;
	
	$next = $current.next();
	if ($next.length) {
		$next.addClass('current');
		$current.removeClass('current');
	}
	
	updateStats();
	
	return false;
}

function alphabet() {
	return 'a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,.,\',(,),",comma,backspace,spacebar';
}

function compareKeys(html, array, c) {
	html = html == ' ' ? 'spacebar' : html; // Map spacebar properly
	
	if (html == array[array.length-1]) {
		return true;
	}
	
	return false;
}

function updateStats() {
	var min = ((Date.now() - stats.startTime) / 60000);
	var accuracy = Math.round((stats.numChars - stats.numIncorrectChars) / stats.numChars * 100, 2);
	var wpm = Math.round(stats.numWords / min);
	var cpm = Math.round(stats.numChars / min);
	
	$('#stat-accuracy').html(accuracy+'%');
	$('#stat-wpm').html(wpm);
	$('#stat-cpm').html(cpm);
}