/**
 * Created by Mecxi on 5/21/2017.
 * big5sports hub - Super Rugby lineups module v.0.1
 */

/* process rugby lineups */
function process_rugby_lineups(result, obj){
    /* initialise the base url */
    var el = $('<div></div>');
    var stories = [];
    el.html(result);

    /* Determine the workflow */
    switch (obj.flow) {
        case 1:
            /* process round_lineup */
            process_round_lineups(el, stories);
            /* check if round lineups data is collected */
            if (stories.length > 0) {
                return render_output_result(stories);
            }
            break;
    }
    return null;
}


/* process current matches round lineups */
function process_round_lineups(el, round_lineups){
    var obj_fixtures = {'data':[]};
    var track_team = 0;
    var track_data = 0;
    var team_found = '';
    /* check current link */

    $('#article-body', el).children().each(function(){
        /* escape undesired paragraph */
        if ($(this).html().match('kick-offs time') == null){
            /* find kick-offs time and fixture */
            if ($(this).find('strong > span').attr('style')){

                /* add obj_fixtures to round_lineups only if not empty */
                if (obj_fixtures.data.length !== 0 && track_data == 0){
                    var obj_cloned = clone(obj_fixtures);
                    round_lineups.push(obj_cloned);
                    /* clear data to prepare for the next lineups collection */
                    console.log(round_lineups);
                    //alert('DATA PUSHED TO ROUND');
                    obj_fixtures.data = [];
                    track_team = 0;
                    track_data = 1;
                }

                var span = $('<div></div>'); span.html($(this).html());

                if ($('span', span).text().match(' v ') !=null){
                    obj_fixtures.fixtures = $('span', span).text();
                    track_data = 0;
                } else {
                    obj_fixtures.kickoffs = $('span', span).text();
                }
            }

            var current_node = $(this).find('strong').contents();
            //alert('Current node: '+ current_node.eq(0).text().length);

            /* find current context team */
            if ($(this).find('strong > br').attr('type') || (current_node.eq(0).text().length > 0 && current_node.eq(0).text().length < 11 && current_node.eq(0).text().length !== 0)){
                //console.log(obj_fixtures);
                //console.log(round_lineups);
                //alert('CHECK FIXTURES CONTEXT');
                var team_p = $('<div></div>'); team_p.html($(this).html());
                var team_l = $('strong', team_p).contents();
                team_found = team_l.eq(0).text();
                obj_fixtures.data.push([{'team': team_found, 'lineups': []}]);
                ++track_team;
                //console.log(obj_fixtures);
                //alert('CHECK obj_fixtures in this context ' + $(this).html());

                /*** resolve temp_file missing ****/
                //if (team_found == 'Kings') {
                //    populate_list(tem_file.split(','), obj_fixtures.data, track_team);
                //}
                /*** testing collecting team approaches 2 ***/
                /* check next paragraph contains a substituted list mixed */
                if ($(this).next().html().match(':') != null){
                    var mix_up_l =  ($(this).next().html().match('&nbsp;') !=null) ?
                        (
                            ($(this).next().text().match('Substitutes') != null) ?
                                $(this).next().html().replace(/&nbsp;/g, ' ').replace('Substitutes', '') :
                                (($(this).next().text().match('Substititues') != null) ? $(this).next().html().replace('Substititues', '').replace('&nbsp;', ' ') : '')
                        ):

                        (
                            ($(this).next().text().match('Substitutes') != null) ?
                                $(this).next().text().replace('Substitutes', '') :
                                (($(this).next().text().match('Substititues') != null) ? $(this).next().text().replace('Substititues', '') : '')
                        );
                    populate_list(mix_up_l.split(','), obj_fixtures.data, track_team);
                } else {

                    /* get players list */
                    var p_list = ($(this).next().html().match('&nbsp;') != null) ? $(this).next().html().replace(/&nbsp;/g, ' ') : $(this).next().text();
                    populate_list(p_list.split(','), obj_fixtures.data, track_team);

                    /* push current players list */
                    var subs_l = ($(this).next().next().html().match('&nbsp;') != null) ?
                        (
                            ($(this).next().next().text().match('Substitutes') != null) ?
                                $(this).next().next().html().replace(/&nbsp;/g, ' ').replace('Substitutes: ', '') :
                                (($(this).next().next().text().match('Substititues') != null) ? $(this).next().next().html().replace(/&nbsp;/g, ' ').replace('Substititues: ', '') : '')
                        ):

                        (
                            ($(this).next().next().text().match('Substitutes') != null) ?
                                $(this).next().next().text().replace('Substitutes: ', '') : (($(this).next().next().text().match('Substititues: ') != null) ? $(this).next().next().replace('Substititues: ', '') : '')
                        );

                    populate_list(subs_l.split(','), obj_fixtures.data, track_team);
                }
            }

            /* reach final paragraph */
            if ($(this).attr('class') == 'bannerads'){
                /* add obj_fixtures to round_lineups only if not empty */
                if (obj_fixtures.data.length !== 0 && track_data == 0){
                    var obj_cloned_last = clone(obj_fixtures);
                    round_lineups.push(obj_cloned_last);
                    /* clear data to prepare for the next lineups collection */
                    console.log(round_lineups);
                    //alert('DATA PUSHED TO ROUND');
                    obj_fixtures.data = [];
                    track_team = 0;
                    track_data = 1;
                }
            }
        }
    });

}

/* render the output result */
function render_output_result(lineup) {
    var output = '';
    for (var i = 0; i < lineup.length; ++i) {
        /* format fixture */
        var fix_l = lineup[i].fixtures.split(',');
        var fix_l_p = fix_l.slice(-1).pop().split(' - ');

        var fixtures = '<h2>' + fix_l[0] + '</h2>';
        /*** resolve wrong time being passed */
        //lineup[i].kickoffs = (lineup[i].kickoffs == 'FRIDAY, JUNE') ? lineup[i].kickoffs + ' 30' : lineup[i].kickoffs;
        var kickoffs = '<p>' + return_date_format(lineup[i].kickoffs + ' '+ (new Date().getFullYear()) + ' '+ fix_l_p[1]) + '</p>';
        var collection = lineup[i].data;
        var p_list = '';
        for (var j = 0; j < collection.length; ++j) {
            if (j < 3) {
                p_list += '<p><strong>' + collection[j][0].team + '</strong><br />';
                var team_list = collection[j][0].lineups;
                for (t = 0; t < team_list.length; ++t) {
                    /* check if to TBA present */
                    if (team_list[t][1] == undefined && t < 1){
                        p_list += 'To be confirmed<br /><strong>Subs: </strong>To be confirmed</p>';
                        break;
                    } else {
                        p_list += (t < 15) ? (team_list[t].join(' ').trim() + ((t < 14 ) ? ', ' : '<br />')) :
                            ((t == 15) ? '<strong>Subs: </strong>'+team_list[t].join(' ').trim()+', '  :
                                (team_list[t].join(' ').trim() + (((t+1) != team_list.length ) ? ', ' : '</p>')));
                    }

                }
            }
        }
        output += fixtures + kickoffs + p_list;
    }
    return (output.length > 0) ? output : null;
}

/* get roundlineup format from the server */
function return_date_format(str){
    var date = new Date(str);

    function getMonthFormat(mm){
        var l = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        for(var i=0; i < l.length; ++i){
            if (mm == i){
                return l[i];
            }
        }
        return 0;
    }

    function getWeekDay(mm){
        var l = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        for(var i=0; i < l.length; ++i){
            if (mm == i){
                return l[i];
            }
        }
        return 0;
    }

    return getWeekDay(date.getDay()) + ' '+ ((date.getDate() < 10) ? '0'+date.getDate() : date.getDate()) + ' '+ getMonthFormat(date.getMonth())+' - '+date.getHours()+':'+( (date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes()) );
}

function populate_list(players_l, obj_data, track_team, recursion){

    if (typeof players_l == 'object'){
        for (var i=0; i < players_l.length; ++i){
            /* do a recursion for list containing more than one player */
            if (players_l[i].match(':') != null){
                //alert('mixup player found');
                populate_list(players_l[i].split(':'), obj_data, track_team, true);
            } else if (has_mixed_players(players_l[i])){
                //alert('FOUND MIXED PLAYER | '+ players_l[i]);
                var mix = resolve_mixed_players(players_l[i]);
                populate_list(mix.split(' , '), obj_data, track_team, true);
            } else {
                /* remove html tag */
                var rm_tag = $('<div></di>'); rm_tag.html('<span>'+players_l[i]+'</span>');
                var sl = $('span', rm_tag).text();
                //alert('\''+sl+'\'');

                var current_p =  sl.replace(/^(\v)|(\b<strong>)|(\b\.)|(\b<br \/>)|(\b<br>)|(\b<\/strong>)/g, " ").split(' '); //pos, firstname, lastname, extra_names(if applicable), captain(c) (if applicable)
                /* clear empty array */
                for (var j= current_p.length; j--;){
                    if (current_p[j].length == 0){
                        current_p.splice(j, 1);
                    }
                }
                //alert('\''+ current_p+'\'');
                /* collect long last names but not if there's a captain */
                if ( i > 0 && current_p.length > 3){
                    for (var n=0; n < current_p.length; ++n){
                        if (n > 2){
                            if (is_captain(current_p[n])){
                                current_p[2] += ''
                            } else {
                                if (has_co_captain(current_p[n])){
                                    current_p[2] += ''
                                } else {
                                    current_p[2] += ' '+current_p[n];
                                }
                            }
                        }
                    }
                } else {
                    if (current_p.length > 3){
                        for (var s=0; s < current_p.length; ++s){
                            if (s > 3){
                                if (is_captain(current_p[s])){
                                    current_p[3] += ''
                                } else {
                                    if (has_co_captain(current_p[s])){
                                        current_p[3] += ''
                                    } else {
                                        current_p[3] += ' '+current_p[s];
                                    }
                                }
                            }
                        }
                    }
                }

                /* find there's a captain */
                var captain = 0;
                var co_captain = 0;
                for (var c=0; c < current_p.length; ++c){

                    if (is_captain(current_p[c])){
                        captain = true;
                    }

                    if (has_co_captain(current_p[c])){
                        co_captain = true;
                    }
                }


                if (i > 0 ){
                    if (track_team < 2){
                        obj_data[0][0].lineups.push([current_p[0], current_p[1], current_p[2], (captain === true) ? '(c)': ((co_captain === true) ? '(c-o)': '') ]);
                    } else {
                        obj_data[1][0].lineups.push([current_p[0], current_p[1], current_p[2], (captain === true) ? '(c)': ((co_captain === true) ? '(c-o)': '') ]);
                    }

                } else {
                    /* on recursion process start at index 0 */
                    if (recursion == undefined){
                        if (track_team < 2){
                            obj_data[0][0].lineups.push([current_p[1], current_p[2], current_p[3], (captain === true) ? '(c)': ((co_captain === true) ? '(c-o)': '') ]);
                        } else {
                            obj_data[1][0].lineups.push([current_p[1], current_p[2], current_p[3], (captain === true) ? '(c)': ((co_captain === true) ? '(c-o)': '') ]);
                        }
                    } else {
                        //alert('ON recursion - check index 3 length: Name: '+ current_p[1]+' | index 3 ='+ current_p[3].length);
                        if (track_team < 2){
                            obj_data[0][0].lineups.push([current_p[0], current_p[1], current_p[2], (captain === true) ? '(c)': ((co_captain === true) ? '(c-o)': '') ]);
                        } else {
                            obj_data[1][0].lineups.push([current_p[0], current_p[1], current_p[2], (captain === true) ? '(c)': ((co_captain === true) ? '(c-o)': '') ]);
                        }
                    }
                }
            }
        }
    }
}

/* resolve players mixed into one */
function has_mixed_players(pl){
    var current_p = pl.replace(/^(\v)|(\b<strong>)/g, " ").split(' ');
    /* clear empty array */
    for (var j= current_p.length; j--;){
        if (current_p[j].length == 0){
            current_p.splice(j, 1);
        }
    }
    var found = 0;
    for (var i=0; i < current_p.length; ++i){
        var int_v = parseInt(current_p[i].trim());
        if (!isNaN(int_v)){
            ++found;
        }
    }
    return (found > 1);
}

/* resolve mixed player */
function resolve_mixed_players(pl){
    //alert('\''+pl+'\'');
    var current_p = pl.replace(/\v/g, " ").split(' ');
    /* clear empty array */
    for (var j= current_p.length; j--;){
        if (current_p[j].length == 0){
            current_p.splice(j, 1);
        }
    }
    //alert('\''+current_p+'\'');

    var collected = '';
    var found = 0;
    for (var i=0; i < current_p.length; ++i){
        var int_v = parseInt(current_p[i].trim());
        //alert('E:'+current_p[i].trim()+' | L:'+current_p[i].trim().length);
        if (current_p[i].trim().length > 0){
            if (!isNaN(int_v)){
                collected += (found > 0) ? ', ': '';
                ++found;
            }
            collected += current_p[i].trim() + (((i+1) == current_p.length) ? '' : ' ');
        }
    }
    //alert('Collected VAL:'+ collected);

    return collected;
}

function has_co_captain(ref){
    return (ref.match('co-captain') != null);
}

function is_captain(ref){
    return (ref.match('captain') != null);
}

/* check if the obj is empty */
function isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }

    return JSON.stringify(obj) === JSON.stringify({});
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


