/*
 * Globals
 */
var SPEED;
var MAX_SPEED = 1.8;
var LEVEL;
var AD_COUNT;
var ad_can_move;

var startGame = function(){
	var window_height = $(window).height();
	$('.presentation').fadeOut(function(){
		$('.game-bounds').css('height', window_height).show();
		begin();
	});
}

$(document).ready(function(){
	$('.js-start').click(function(ev){
		ev.preventDefault();
		startGame();
	});
	
	$('object').each(function(i, object){
		$(object).find('[name="wmode"]').remove();
		$(object).prepend('<param name="wmode" value="transparent" />');
	});
	$(document).on('click', '.ad, iframe, .ads-container', function(ev){
		gameOver(); 
	});
	$(document).on('click', '.target', function(ev){
		ev.preventDefault();
		nextLevel();
	});
	
	// Init.
	
});

function savePlayer(name) {
	$.post('http://restazero.com/adcatsaver/players', {'name': name}, function(ev){
		
	});
}

function gameOver() {
	ad_can_move = false;
	$('.ad').css('z-index', 0);
	bootbox.prompt("Shame on you. You let your cat been caught.<br />Leave your name to enter the ranking", function(result) {
		if (result === null) {
			//
		} else {
			savePlayer(result);
		}
		//window.location.reload();
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
	
	if(LEVEL % 10 == 0){
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
