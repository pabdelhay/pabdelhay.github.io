/*
 * Globals
 */
var SPEED;
var MAX_SPEED = 1.8;
var LEVEL;
var AD_COUNT;
var ad_can_move;
var TIME_LIMIT = 1000 * 40; // microseconds

var startGame = function(){
	var window_height = $(window).height();
	$('.presentation').fadeOut(function(){
		$('.game-bounds').css('height', window_height).show();
		begin();
		setInterval(function(){
			if(ad_can_move){
				var time_to_go = parseInt($('.timer').html());
				time_to_go -= 1;
				$('.timer').html(time_to_go);
				if(time_to_go < 10){
					$('.timer').addClass('red');
				}
			}
			if(time_to_go == 0){
				gameOver();
			}
		}, 1000);
	});
}

$(document).ready(function(){
	$('.js-start').click(function(ev){
		ev.preventDefault();
		startGame();
	});
	
	$(document).on('click', '.target', function(ev){
		ev.preventDefault();
		nextLevel();
	});
	
	// Init.
	
});

function savePlayer(name) {
	//$.post('http://restazero.com/adcatsaver/players', {'name': name}, function(ev){
		
	//});
}

function gameOver() {
	ad_can_move = false;
	$('.ad').css('z-index', 0);
	var msg = "Good try. You saved " + LEVEL + " cats";
	if(LEVEL > 20){
		msg = "Congratsss! You are almost an AdCatSaver and saved " + LEVEL + " cats from the Ads";
	} else if(LEVEL > 30) {
		msg = "WOOOOWWWW! You are a SUPER AdCatSaver and saved " + LEVEL + " cats from the Ads";
	}
	msg += "<br />Enter your name to go into the ranking."
	bootbox.prompt(msg, function(result) {
		if (result === null) {
			
		} else {
			savePlayer(result);
		}
		window.location.href = "thanks.html";
	});
}

function makeNewPosition(){
    
    // Get viewport dimensions (remove the dimension of the div)
    var h = $('.game').height() - 50;
    var w = $('.game').width() - 50;
    
    var nh = Math.floor(Math.random() * h);
    var nw = Math.floor(Math.random() * w);
    
    return [nh,nw];
    
}

function animateDiv(ad_selector){
    var newq = makeNewPosition();
    var oldq = $(ad_selector).offset();
    var speed = calcSpeed([oldq.top, oldq.left], newq);
    
    $(ad_selector).animate({ top: newq[0], left: newq[1] }, speed, function(){
    	if(ad_can_move)
    		animateDiv(ad_selector);
    });
};

function calcSpeed(prev, next) {
    
    var x = Math.abs(prev[1] - next[1]);
    var y = Math.abs(prev[0] - next[0]);
    
    var greatest = x > y ? x : y;
    
    var speedModifier = SPEED;

    var speed = Math.ceil(greatest/speedModifier);

    return speed;
}

function begin() {
	LEVEL = 0;
	SPEED = 0.3;
	AD_COUNT = 1;
	ad_can_move = true;
	$('.ad-1').show();
	
	animateDiv('.ad-1');
	showTarget();
}

function nextLevel() {
	LEVEL++;
	if(SPEED < MAX_SPEED)
		SPEED += 0.2;
	$('.saved-target').html(LEVEL);
	
	if(LEVEL % 8 == 0){
		addAd();
	}
	
	clearTarget();
	showTarget();
}

function addAd() {
	if(AD_COUNT > $('.ad').length)
		return;
	AD_COUNT++;
	var ad_selector = '.ad-' + AD_COUNT;
	$(ad_selector).removeClass('hide-soft');
	animateDiv(ad_selector);
	SPEED = 0.3;
}

function clearTarget() {
	$('.target').remove();
}

function showTarget() {
	var h = $('.game').height() - 200;
    var w = $('.game').width() - 200;
	var top = Math.floor((Math.random() * h) + 1);
	var left = Math.floor((Math.random() * w) + 1);
	var target_number = Math.floor((Math.random() * 17) + 1);
	var target_image = 'img/cat-' + target_number + '.jpg';
	
	var $target = '<img style="top:'+top+'px; left:'+left+'px;" class="target" src="'+ target_image +'" />';
	$('.game').append($target);
}
