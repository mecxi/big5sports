/**
 * Created by Mecxi on 5/24/2017.
 * big5sports hub expert says module v.0.1
 */

/* process rugby news experts says */
function process_rugby_experts(result, obj){
    /* initialise the base url */
    var el = $('<div></div>');
    el.html(result);
    var stories = [];
    /* Determine the workflow */
    switch (obj.flow) {
        case 1:
            /* process round_experts */
            process_round_experts(el, obj, stories);
            break;
        case 2:
            /* process round_experts */
            process_round_experts(el, obj, stories);
            break;
    }
    return (stories.length > 0) ? stories : null ;
}

function process_round_experts(el, obj, stories){
    /* initialise obj container */
    var result = {};
    /* http://www.smh.com.au/rugby-union/super-rugby/expert-tips */
    if (obj.link.match('smh') != null && obj.link.match('expert-tips') != null){
        $.ajax({
            url: 'http://spreadsheets.google.com/feeds/list/14JtvgZpRWRtgP85FdWvbPUYm2VrjYpQp-ZraTUTC-2I/od6/public/values?alt=json',
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            async: false,
            success: function(result){
                /* render data */
                rendered_data_tips(result, stories);
            },
            error: function(){
                console.log("error connecting to www.smh.com.au to get experts tips");
                stories.push({flow:0, msg: 'SMH Tips predictions coming soon ...'});
            }
        });

    }

    /*'http://www.rugby365.com/tournaments/super-rugby/79016-sr-preview-round-12-part-two' */
    if (obj.link.match('rugby365') != null && obj.link.match('preview-round') != null){
        result.title = 'SuperRugby 365 teams:';
        $('div.row.wrapper div.off-canvas-wrap div.row div.large-12.columns div.row div.large-8 p', el).each(function(){

                $(this).children().each(function(){
                    /*check fixture */
                    if($(this).prop('tagName') == 'U'){
                        result.fixture = $(this).find('strong').text().trim();
                        //alert($(this).find('strong').text().trim());
                    }

                    if ($(this).prop('tagName') == 'STRONG'){
                        if ($(this).text().match('Prediction:') != null){
                            var str = $(this).parent().text().trim().split('.');
                            //alert(str.slice(-2, -1).pop().replace(/\n/, ''));
                            result.details = str.slice(-2, -1).pop().replace(/\n/, '').trim();
                            /* add stories */
                            var temp = clone(result);
                            stories.push(temp);
                        }
                    }

                    //alert(JSON.stringify(result) + ' | '+ JSON.stringify(stories));
                });
        });

        if (stories.length == 0){
            stories.push({flow:0, msg: 'SuperRugby 365 teams predictions coming soon ...'});
        }
    }


    if (obj.flow == 1){
        if (obj.link.match('sarugbymag') != null){
            $('div#wallpaper div.container div.one-third.column div.left-col div.news-items', el).each(function(){
                var links = $('<div></div>'); links.html($(this));
                /* find Superbru link */
                $('h3', links).each(function(){
                    var link = $(this).find('a').attr('href');
                   if (link.match('SuperBru') != null){
                       obj.link = link;
                       obj.flow = 2;
                       /* create a second flow recursively */
                       process_news_link(obj, undefined, 'rugby');
                   }
                });
            });

            /* check flow 2 couldn't be initialised */
            if (obj.flow == 1){
                console.log('SARUGBYMAG NO SUPERBRU PREDICTIONS FOUND');
                stories.push({flow:0, msg: 'SA Rugby magazine predictions coming soon ...'});
            }
        }
    } else {
        /* flow 2:: http://www.sarugbymag.co.za/blog/details/SuperBru-Sharks-to-win-by-7-12 */
        //alert('REACH FLOW 2 LINK = '+ obj.link);
        if (obj.link.match('sarugbymag') != null){
            /* set title */
            result.title = 'SA Rugby magazine teams:';
            $('#tcontent p', el).each(function(){
                var skip = true;
                /*check fixture */
                $(this).children().each(function(){
                    if($(this).prop('tagName') == 'U'){
                        result.fixture = $(this).find('strong').text().trim();
                    }

                    if ($(this).first().prop('tagName') == 'STRONG'){
                        skip = false;
                    }
                });
                /* check details */
                if (skip === false){
                    result.details = $(this).html().trim();
                    /* add stories */
                    var temp = clone(result);
                    stories.push(temp);
                }
                //alert(JSON.stringify(result));
            });

            if (stories.length == 0){
                stories.push({flow:0, msg: 'SA Rugby magazine predictions coming soon ...'});
            }
        }
    }

}

/* process rugby union experts tips */
function rendered_data_tips(data, stories){
    var dt = data.feed.entry;

    console.log(dt);

    for (var i = 0; i < dt.length; i++) {

        var id = dt[i].gsx$id.$t;
        var FIRSTNAME = dt[i].gsx$firstname.$t;
        var SURNANE = dt[i].gsx$surname.$t;
        var PICKSCORE= Number(dt[i].gsx$pickscore.$t);
        var round= dt[i].gsx$round.$t;

        var TEAM1 = dt[i].gsx$team1.$t;
        var TEAM2 = dt[i].gsx$team2.$t;
        var TEAM3 = dt[i].gsx$team3.$t;
        var TEAM4 = dt[i].gsx$team4.$t;
        var TEAM5 = dt[i].gsx$team5.$t;
        var TEAM6 = dt[i].gsx$team6.$t;
        var TEAM7 = dt[i].gsx$team7.$t;
        var TEAM8 = dt[i].gsx$team8.$t;

        obj = {
            "id": id,
            "FIRSTNAME": FIRSTNAME,
            "SURNAME": SURNANE,
            "PICKSCORE": PICKSCORE,
            "round": round,
            "TEAM1": TEAM1,
            "TEAM2": TEAM2,
            "TEAM3": TEAM3,
            "TEAM4": TEAM4,
            "TEAM5": TEAM5,
            "TEAM6": TEAM6,
            "TEAM7": TEAM7,
            "TEAM8": TEAM8
        };

        stories.push(obj);
    }
}

/* clone object to prevent being referenced in global variable */
function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}