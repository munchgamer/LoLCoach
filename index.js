/*******************************************************************************



*******************************************************************************/



var lolcoach = {
	constants : {
		THROTTLE : 1500,
		API_URI : "https://prod.api.pvp.net/"
	},
	profiles : {}, // a map of profiles entered and saved in the localstorage.  
	currentProfile : {}, // a pointer to the profile currently being viewed and worked with.
	queue : [], // the processing queue.  We use a queue here to respect the call limits of the riot API.
	
	init : function(){
		var profiles = localStorage.getItem('lolcoach.profiles')
		if(profiles){
			lolcoach.u.showSection('selectProfile');
			lolcoach.profiles = profiles;
		} else {
			lolcoach.u.showSection('setupProfile');
		}
	},
	u : {
		showSection : function(section){
			$('.bodySection').hide();
			$('#'+section).show();
		},
		showLoading : function(){
			$('#loader').show();
		},
		hideLoading : function(){
			$('#loader').hide();
		},
		createProfile : function(summonerName, apiKey, region){
			var profileId = summonerName+"|"+region;
			if(lolcoach.profiles[profileId]){
				alert('That profile already exists!');
			} else {
				lolcoach.profiles[profileId] = {
					summonerName : summonerName,
					apiKey : apiKey,
					region : region
				}
				lolcoach.u.selectProfile(profileId);
			}
		},
		selectProfile : function(profileId){
			if(lolcoach.profiles[profileId]){
				lolcoach.currentProfile = lolcoach.profiles[profileId];
				lolcoach.u.showSection('displayProfile');
			} else {
				alert('That profile does not exist');
			}
		}
	},
	calls : {
		champion : {
			champion : function(freeToPlay){
				
			}
		},
		game : {
			recent : function(summonerId){
			
			}
		},
		league : {
			challenger : function(){},
			entry : function(summonerId){},
			league : function(summonerId){}
		},
		staticData : {
			//ALL PARAMS FOR THESE CALLS ARE OPTIONAL.  NOT INCLUDING THE Id WILL RETURN A LIST OF ALL OF THE SPECIFIED TYPE (champion, item, rune, etc...)
			champion : function(id){},
			item : function(id){},
			mastery : function(id){},
			realm : function(){},
			rune : function(id){},
			summonerSpell : function(id){}
		},
		stats : {
			summary : function(summonerId){},
			ranked : function(summonerId){}
		},
		summoner : {
			masteries : function(summonerIds){},
			runes : function(summonerIds){},
			summonerByName : function(summonerNames){},
			summonerName : function(summonerIds){},
			summoner : function(summonerIds){}
		},
		team : {
			teamBySummoner : function(summonerId){},
			team : function(teamIds){}
		}
	},
	
	
}