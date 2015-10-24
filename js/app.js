$(function(){

	// array that will hold object for each corresponding tweet.  
	var tweets = [];   

	// console.log(tweets);
	// var tweetsString = JSON.stringify(tweets);
	// console.log(tweetsString);
	// console.log(typeof tweetsString);
	// tweets.push({tweetName: 'something'});
	// tweets.push({tweetName: 'something2'});
	// console.log(tweets);
	// console.log(Array.isArray(tweets));


// initializing bootstrap tooltips
	$('[data-toggle="tooltip"]').tooltip();

	// trying to limit number of jQuery searches $(''), read somewhere
	var $dashboard = $('#dashboard');
	var $mainContent = $('#main');
	var username = $dashboard.find('p.username').text();
	var $writeTweet = $dashboard.find('textarea.tweet-compose');
	var $charCount = $dashboard.find('#char-count');
	var $tweetBtn = $dashboard.find('#tweet-submit');
	var $yourPic = $dashboard.find('img');
	// console.log($yourPic);
	var $tweetBlueprint = $mainContent.find('div.tweet:first');







	// check first to see if local storage exists, for data persisting
	// checkLocalStorage();
	if(typeof localStorage.tweets!=='undefined'){
		console.log('local storage exists');
		tweets = JSON.parse(localStorage.tweets);
		console.log(tweets);
		// attaches them to DOM
		for(var i=0; i<tweets.length; i++){
			var currTweet = tweets[i];
			var $tweetClone = $tweetBlueprint.clone();
			$tweetClone.find('.tweet-text').text(currTweet.text);
			$tweetClone.find('.time span').attr('data-livestamp', currTweet.time);
			$mainContent.find('#stream').prepend($tweetClone);
		}
	}


	


	



	$writeTweet.on('focus', function(){
		$(this).parent().addClass('active');
		$(this).next().css('opacity', 1);
	});
	$writeTweet.on('blur', function(){
		// if you remove class active, it wont' display button at all
		// so when you click button, it can't fire a click event
		// the instant textarea blurs, it removes
		// must be better way than this..
		$(this).next().css('opacity', 0);
	});
	

	//____________________________typing event____________________________

	$writeTweet.on('keyup', function(){
		var tweetLength = $writeTweet.val().length;

		if(tweetLength>=130){
			$charCount.addClass('longTweet');
		}
		else{
			$charCount.removeClass('longTweet');
		}

		// also have maxlength attribute of textarea set to 200
		// to see alternative way
		if(tweetLength>140){
			$charCount.text(0);
			$tweetBtn.prop('disabled', true);
		}
		else{
			$charCount.text(140-tweetLength);
			$tweetBtn.prop('disabled', false);
		}
	});

	//___________________________Posting Tweet event__________________________

	function postTweet(e){
		console.log('post tweet');
		// console.log(e.timeStamp);
		// console.log(e);
		// alert('what');
		e.preventDefault();
		// get newTweet text from text in textarea
		var newTweetText = $writeTweet.val();
		// then clear text area, reset charcount
		$writeTweet.val('');
		$charCount.text(140);
		// copy tweet blueprint, to create new tweet
		var $newTweet = $tweetBlueprint.clone();
		// overwrite blueprint new Tweet with tweet text, name, f
		$newTweet.find('.tweet-text').text(newTweetText);
		$newTweet.find('.fullname').text(username);
		// adding timestap to work with live timestamp
		var tweetTimeSec = e.timeStamp/1000;
		$newTweet.find('.time span').attr('data-livestamp', tweetTimeSec);
		// potential to replace 2 pictures on tweet div
		$yourPicClone = $yourPic.clone();
		// console.log($yourPicClone);
		$newTweet.find('.avatar').replaceWith($yourPicClone);
		// add new tweet, right at start of stream
		$mainContent.find('#stream').prepend($newTweet);
		// makes stats visible for 10 seconds, then slide toggles
		$newTweet.find('.statsreply-wrapper').toggle().delay(10*1000).slideToggle();
		$newTweet.hide().fadeIn(500);

		// trying to use closures to have updateLocalStorage know scope of newTweetText

		// updateLocalStorage(newTweetText, tweetTimeSec);

		// updating local storage, tried to do with separate function , but didnt' work..

		var newTweetObj = {
			text: newTweetText,
			time: tweetTimeSec
		};

		tweets.push(newTweetObj);  // adds to big array of tweets
		console.log(tweets);
		localStorage.tweets = JSON.stringify(tweets); // pushes big array of tweets to local storage, overriding past ones










	}

	function updateLocalStorage(tweetText, tweetTime){
		var newTweet = {};
		console.log(tweetText);
		console.log(tweetTime);
		// newTweet.text = tweetText;
		// newTweet.time = tweetTime;
		// tweets.push(newTweet);
		// console.log('new tweet is '+newTweet);
		// console.log(Array.isArray(newTweet));
		// console.log('tweets array is currently' +tweets);
		// tweets.push(newTweet);
		// console.log(tweets);
		// console.log('helo world');
		// console.log('local storage is '+localStorage);
		// console.log(Array.isArray(localStorage.tweets));
		// var oldContent = JSON.parse(localStorage.tweets);  // tweets is array of objects
		// console.log('old content is ' +oldContent);
		// var newContent = oldContent.push(newTweet);
		// console.log('new content is '+newContent);
		// localStorage.tweets = (JSON.stringify(newContent));
		// return 'return value';
	}

	

	// updateLocalStorage();



	$tweetBtn.on('click', postTweet);

	// enter button should submit tweet as well

	$('body').on('keypress', function(e){
		if(e.keyCode===13 && $writeTweet.is(':focus')){
			postTweet(e);
			// console.log('enter pressed');
		}
	});


	//__________________________Clicking Tweet event__________________________

	$('#stream').on('click', '.tweet', function(e){
		e.preventDefault();
		$(this).find('.statsreply-wrapper').slideToggle(500);
	}).on('click', '.tweet-actions, .reply, .stats', function(e){
		e.stopPropagation();
	});





	// $('#stream').on('click', '.tweet-actions', function(e){

	// });































});

