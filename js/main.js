// Converts QWERTY to DVORAK
var converter = {'spacebar':'spacebar','"':'_',"'":'-','+':'}','-':'[',',':'w','/':'z','.':'v',';':'s',':':'S','=':']','<':'W','?':'Z','>':'V','C':'J','B':'X','E':'>','D':'E','G':'I','F':'U','I':'C','H':'D','K':'T','J':'H','L':'N','O':'R','N':'B','Q':'"','P':'L','S':'O','R':'P','U':'G','T':'Y','W':'<','V':'K','Y':'F','X':'Q','[':'/','Z':':',']':'=','_':'{','c':'j','b':'x','e':'.','d':'e','g':'i','f':'u','i':'c','h':'d','k':'t','j':'h','l':'n','o':'r','n':'b','q':"'",'p':'l','s':'o','r':'p','u':'g','t':'y','w':',','v':'k','y':'f','x':'q','{':'?','z':';','}':'+'};

var stats = {
	startTime: null,
	numChars: 0,
	numCorrectChars: 0,
	numIncorrectChars: 0,
	numWords: 0,
	incorrectChars: {}
}

var options = {
	convertQWERTY: true
}

$(function(){
	addSentence('the quick brown fox jumps over the lazy dog');
	//$('body').on('keypress', handleKeypress);
	
	KeyboardJS.on(alphabet(), onDownCallback, null);
	
	$('#switch-convert-qwerty').on('click', toggleConvertQWERTY);
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
	// Test that alt, ctrl and cmd aren't down - if they are, ignore
	if (!(e.altKey || e.ctrlKey || e.metaKey)) {
		e.preventDefault();
		
		// Start stats timer
		if (stats.startTime == null) {
			stats.startTime = Date.now();
		}
		
		console.log(e);
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
	return true; // So my editor wouldn't give me the "doesn't always return a value" error
}

function toggleConvertQWERTY() {
	console.log('click');
	if (options.convertQWERTY) {
		// Toggle off
		options.convertQWERTY = false;
		$('#switch-convert-qwerty').addClass('off');
		console.log('off');
	} else {
		// Toggle on
		options.convertQWERTY = true;
		$('#switch-convert-qwerty').removeClass('off');
		console.log('on');
	}
}

function alphabet() {
	return 'a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,.,\',(,),",comma,backspace,spacebar';
}

function compareKeys(html, array, c) {
	html = html == ' ' ? 'spacebar' : html; // Map spacebar properly
	var key = array[array.length-1];
	
	if (options.convertQWERTY) {
		key = converter[key];
	}
	
	if (html == key) {
		return true;
	}
	
	return false;
}

function updateStats() {
	var min = ((Date.now() - stats.startTime) / 60000);
	var accuracy = Math.round(100 - (stats.numIncorrectChars / (stats.numCorrectChars + stats.numIncorrectChars)) * 100, 2);
	var wpm = Math.round(stats.numWords / min);
	var cpm = Math.round(stats.numChars / min);
	
	$('#stat-accuracy').html(accuracy+'%');
	$('#stat-wpm').html(wpm);
	$('#stat-cpm').html(cpm);
}