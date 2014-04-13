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
	
	console.log(e);
	console.log(a);
	console.log(c);
	
	var $current = $('span.current', '#sentence');
	if (c == 'backspace') {
		var $prev = $current.prev();
		if ($prev.length) {
			$prev.removeClass('correct incorrect').addClass('current');
			$current.removeClass('correct incorrect current');
		}
		
		return false;
	}
	
	if (a.length>1 && c != a[a.length-1]) {
		return false;
	}
	
	if (compareKeys($current.html(), a, c)) {
		$current.addClass('correct');
	} else {
		$current.addClass('incorrect');
	}
	
	$next = $current.next();
	if ($next.length) {
		$next.addClass('current');
		$current.removeClass('current');
	}
	
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