/**
 * Created by Mecxi on 5/19/2017.
 * big5sports
 */

/* initialise the gif_loader */
var gif_loader = $('#loader');

/* get current page */
var current_page = window.location.pathname.replace('#', '');
/* remove the base url */
current_page = current_page.replace('/big5sports/hub/','');

/* determine which module to work on */
var app_module = null;
if (current_page.match('rugby') !== null){
    app_module = 'rugby';
} else if (current_page.match('soccer') !== null){
    app_module = 'soccer';
} else if (current_page.match('nba') !== null){
    app_module = 'nba';
} else {
    app_module = 'all';
}

//show_notify('Loading contents ...');
//alert(current_page);
/* initialise current page viewed */
var viewed_page = check_viewed_page(current_page);
//alert(viewed_page.section);
/* initialise links aggregators */
var links_aggregators = (typeof viewed_page == 'object') ? viewed_page.links : viewed_page;

/* retrieve cache data on page-load */
var section = null;
switch (app_module){
    case 'all':
        section = (typeof viewed_page == 'object') ? viewed_page.section : viewed_page;
        //section = ['rugby_foxnews'];
        for(var i=0; i < section.length; ++i){
            retrieve_cache_module(app_module, 0, section[i]);
        }
        break;
    case 'rugby':
        section = (typeof viewed_page == 'object') ? viewed_page.section : viewed_page;
        //section = ['expert_says_3'];
        for(var r=0; r < section.length; ++r){
            /* for news retrieve in all cache repo */
            retrieve_cache_module(is_section_news(section[r]) === true ? 'all' : app_module, 0, section[r]);
        }
        break;
}


/* initialise the stories refresher every 30min */
var refresh_settings_push = setInterval( function () {
    prepare_news_links(links_aggregators, app_module);
}, 1800000 );   // default 30 min

/* update internal cache upon page load in the next 10s */
setTimeout(function(){
    prepare_news_links(links_aggregators, app_module);
}, 10000);

/** prepare news links **/
function prepare_news_links(url, module){
    //alert(url);
    /* initialise targeted category sports links */
    var urls_obj = {rugby : [], soccer : [], nba : [], all : []};

    /* check if multiple links is required */
    if (url.match(',') !== null){
        var urls = url.split(',');
        for (var j=0; j < urls.length; ++j){
            if (module == 'rugby'){
                urls_obj.rugby.push({link: urls[j].trim(), flow: 1});
            } else if (module == 'soccer') {
                urls_obj.soccer.push({link: urls[j].trim(), flow: 1});
            } else if (module == 'nba') {
                urls_obj.nba.push({link: urls[j].trim(), flow: 1});
            } else {
                urls_obj.all.push({link: urls[j].trim(), flow: 1});
            }
        }
    } else {
        if (module == 'rugby'){
            urls_obj.rugby.push({link: url.trim(), flow: 1});
        } else if (module == 'soccer') {
            urls_obj.soccer.push({link: url.trim(), flow: 1});
        } else if (module == 'nba') {
            urls_obj.nba.push({link: url.trim(), flow: 1});
        } else {
            urls_obj.all.push({link: url.trim(), flow: 1});
        }
    }
    intialise_news_links(urls_obj, module);
}

/* initialise news links */
function intialise_news_links(urls_obj, module){
    console.log('Starting initialising urls ...');
    /* process rugby links */
    if (module == 'rugby'){
        for (var r=0; r < urls_obj.rugby.length; ++r){
            process_news_link(urls_obj.rugby[r], r, module);
        }
    }

    if (module == 'soccer'){
        for (var s=0; s < urls_obj.soccer.length; ++s){
            process_news_link(urls_obj.soccer[s], s, module);
        }
    }

    if (module == 'nba'){
        for (var n=0; n < urls_obj.nba.length; ++n){
            process_news_link(urls_obj.nba[n], n, module);
        }
    }

    if (module == 'all'){
        for (var i=0; i < urls_obj.all.length; ++i){
            process_news_link(urls_obj.all[i], i, module);
        }
    }
}

/* process link request */
function process_news_link(obj, timer, module){
    console.log('Starting reading process ...');
    setTimeout(function(){
        $.ajax({
            url: server + '/big5sports/reader.php',
            data: JSON.stringify({
                link: obj.link
            }),
            type: 'POST',
            beforeSend: function() {
                gif_loader.show();
            },
            success: function (result) {
                task_aggregating_result(result, obj, module);
            },
            error: function () {
                console.log('Error connecting to the server');
                /* hide the loader */
                gif_loader.hide();
                show_notify('Error connecting to the server. Please check your internet connection');
            }
        });

    }, (timer == undefined) ? 1000 : (20000 * timer));
}

/* task aggregating result from the reader */
function task_aggregating_result(result, obj, module){
    console.log('Starting aggregating process ...');
    /* allocate all result to module all */
    if (module == 'all'){
        /* super rugby news espn */
        if (obj.link.match('kwese') !== null && obj.link.match('super-rugby') !== null){
            console.log('find super rugby ESPN news');
            $.getScript(base_uri+ '/modules/rugby_news.js', function() {
                var data = process_rugby_news(result, obj);
                if (data !== null){
                    /* save data into the target section  */
                    cache_data_module(data, module, 'rugby_espnnews');
                }
            });
        }

        /* super rugby news fox */
        if (obj.link.match('foxsports') !== null && obj.link.match('super-rugby') !== null){
            console.log('find super rugby FOXSPORTS news');
            $.getScript(base_uri+ '/modules/rugby_news.js', function() {
                var data = process_rugby_news(result, obj);
                if (data !== null){
                    /* save data into the target section  */
                    cache_data_module(data, module, 'rugby_foxnews');
                }
            });
        }

        /* super rugby lineups */
        if (obj.link.match('sport24') !== null && obj.link.match('super-rugby-weekend-teams') != null){
            console.log('find super rugby lineups');
            $.getScript(base_uri+ '/modules/rugby_lineups.js', function() {
                var data = process_rugby_lineups(result, obj);
                if (data !== null){
                    /* save data into the target section  */
                    cache_data_module(data, module, 'lineups');
                }
            });
        }
        /* fixtures */
        if (obj.link.match('ultimatedreamteams') != null && obj.link.match('fixtures') != null){
            console.log('find super rugby fixtures ');
            $.getScript(base_uri+ '/modules/rugby_fixtures.js', function() {
                var data = process_rugby_fixtures(result, obj);
                if (data !== null){
                    /* save data into the target section  */
                    cache_data_module(data, module, 'fixtures');
                }
            });
        }
        /* logs */
        if (obj.link.match('rugby365') != null && obj.link.match('logs') != null){
            console.log('find super rugby standings ');
            $.getScript(base_uri+ '/modules/rugby_logs.js', function() {
                var data = process_rugby_logs(result, obj);
                if (data !== null){
                    /* save data into the target section  */
                    cache_data_module(data, module, 'logs');
                }
            });
        }

    }

    /* allocate all result to module rugby */
    if (module == 'rugby'){
        /* super rugby news espn */
        if (obj.link.match('kwese') !== null && obj.link.match('super-rugby') !== null){
            console.log('find super rugby ESPN news');
            $.getScript(base_uri+ '/modules/rugby_news.js', function() {
                var data = process_rugby_news(result, obj);
                if (data !== null){
                    /* save data into the target section  */
                    cache_data_module(data, 'all', 'rugby_espnnews');
                }
            });
        }

        /* super rugby news fox */
        if (obj.link.match('foxsports') !== null && obj.link.match('super-rugby') !== null){
            console.log('find super rugby FOXSPORTS news');
            $.getScript(base_uri+ '/modules/rugby_news.js', function() {
                var data = process_rugby_news(result, obj);
                if (data !== null){
                    /* save data into the target section  */
                    cache_data_module(data, 'all', 'rugby_foxnews');
                }
            });
        }

        /* lineups */
        if (obj.link.match('sport24') !== null && obj.link.match('super-rugby-weekend-teams') != null){
            console.log('find super rugby lineups');
            $.getScript(base_uri+ '/modules/rugby_lineups.js', function() {
                var data = process_rugby_lineups(result, obj);
                if (data !== null){
                    /* save data into the target section  */
                    cache_data_module(data, module, 'lineups');
                }
            });
        }

        /* fixtures */
        if (obj.link.match('ultimatedreamteams') != null && obj.link.match('fixtures') != null){
            console.log('find super rugby fixtures ');
            $.getScript(base_uri+ '/modules/rugby_fixtures.js', function() {
                var data = process_rugby_fixtures(result, obj);
                if (data !== null){
                    /* save data into the target section  */
                    cache_data_module(data, module, 'fixtures');
                }
            });
        }
        /* logs */
        if (obj.link.match('rugby365') != null && obj.link.match('logs') != null){
            console.log('find super rugby standings ');
            $.getScript(base_uri+ '/modules/rugby_logs.js', function() {
                var data = process_rugby_logs(result, obj);
                if (data !== null){
                    /* save data into the target section  */
                    cache_data_module(data, module, 'logs');
                }
            });
        }
        /* experts says 1 */
        if (obj.link.match('smh') != null && obj.link.match('expert-tips') != null){
            console.log('find super rugby experts says | SMH');
            $.getScript(base_uri+ '/modules/rugby_expert_says.js', function() {
                var data = process_rugby_experts(result, obj);
                if (data !== null){
                    if (data[0].flow != undefined && data[0].flow == 0){
                        /* send notify to the screen */
                        show_notify(data[0].msg);
                    }
                    /* save data into the target section  */
                    cache_data_module(data, module, 'expert_says_1');
                }
            });
        }
        /* experts says 2 */
        if (obj.link.match('sarugbymag') != null){
            console.log('find super rugby experts says | SARUGBYMAG');
            $.getScript(base_uri+ '/modules/rugby_expert_says.js', function() {
                var data = process_rugby_experts(result, obj);
                //alert(JSON.stringify(data));
                if (data !== null){
                    if (data[0].flow != undefined && data[0].flow == 0){
                        /* send notify to the screen */
                        show_notify(data[0].msg);
                    }
                    /* save data into the target section  */
                    cache_data_module(data, module, 'expert_says_2');
                }
            });
        }
        /* experts says 3 */
        if (obj.link.match('rugby365') != null && obj.link.match('preview-round') != null){
            console.log('find super rugby experts says | rugby365');
            $.getScript(base_uri+ '/modules/rugby_expert_says.js', function() {
                var data = process_rugby_experts(result, obj);
                //alert(JSON.stringify(data));
                if (data !== null){
                    if (data[0].flow != undefined && data[0].flow == 0){
                        /* send notify to the screen */
                        show_notify(data[0].msg);
                    }
                    /* save data into the target section  */
                    cache_data_module(data, module, 'expert_says_3');
                }
            });
        }

        /* result */
        if (obj.link.match('rugby365') != null && obj.link.match('results') != null){
            console.log('find super rugby results ');
            $.getScript(base_uri+ '/modules/rugby_results.js', function() {
                var data = process_rugby_results(result, obj);
                if (data !== null){
                    /* save data into the target section  */
                    cache_data_module(data, module, 'results');
                }
            });
        }
    }

}

/* saved data result
* @m_base: if module is all, section is required
* */
function cache_data_module(data, module, section){

    $.ajax({
        url: server + '/big5sports/cache.php',
        data: JSON.stringify({
            module: module,
            rendered : data,
            sections: (section == undefined) ? null : section
        }),
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (response) {
            if (response.result == true){
                console.log('Saving repo for module : '+ module + ' | ' + section + ' '+ response.message);
                /* render data in view */
                (is_retreived_required(section) === true) ? retrieve_cache_module(module, 0, section) : render_page_views(data, module, section);
            } else {
                console.log('Enable to save repo for module : '+ module + ' | ' + section + ' '+ response.message);
                gif_loader.hide();
            }
        },
        error: function () {
            console.log('Saving repo for module : '+ module + ' | ' + section + ' '+ 'Error connecting to the server');
        }
    });
}

/* check retrieve after caching is required */
function is_retreived_required(section){
    var list = ['fixtures', 'results', 'rugby_espnnews', 'rugby_foxnews'];
    for(var i=0; i < list.length; ++i){
        if (list[i] == section){
            return true;
        }
    }
    return false;
}

/* check if the section is news */
function is_section_news(section){
    var list = ['rugby_espnnews', 'rugby_foxnews'];
    for(var i=0; i < list.length; ++i){
        if (list[i] == section){
            return true;
        }
    }
    return false;
}

/* retrieve cache data */
function retrieve_cache_module(module, rollback, section){

    $.ajax({
        url: server + '/big5sports/cache.php',
        data: JSON.stringify({
            module: module,
            rollback: rollback,
            sections: (section == undefined) ? null : section
        }),
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        async : false,
        beforeSend: function() {
            gif_loader.show();
        },
        success: function (response) {
            if (response.result == false){
                console.log('Enable to retrieve repo for module : '+ module + ' | '+response.message);
                /* hide the loader */
                gif_loader.hide();
            } else {
                console.log('Successfully retrieving repo for module : '+ module+ ' | '+ section );
                render_page_views(response, module, section);
            }
        },
        error: function () {
            console.log('retrieving repo for module : '+ module + ' | ' + section + ' '+ 'Error connecting to the server');
            /* hide the loader */
            gif_loader.hide();
            show_notify('Error connecting to the server. Please check your internet connection');
        }
    });
}


/* render story as related to its section */
function render_page_views(data, module, section){

    /* render news post for all | rugby */
    var post = (section == 'rugby_foxnews' || section == 'rugby_espnnews') ? render_news_post(data, module) : '';

    /* render experts says */
    var expert_data = (section == 'expert_says_2' || section == 'expert_says_3') ? render_experts_say(data) : '';

    /* initialise view ids */
    var news_hub = $('#news_hub').find('div');
    var lineup_box = $('#lineups').find('div.content');
    var fixture_box = $('#fixtures').find('div.table-wrapper');
    var logs_box = $('#logs').find('div.table-wrapper');
    var experts = $('#experts');
    var result = $('#results').find('div.table-wrapper');

    window.setTimeout(function(){
        switch (module){
            case 'all':
                switch (section){
                    case 'rugby_foxnews':
                    case 'rugby_espnnews':
                        if (post.length > 0){
                            news_hub.html(post);
                            /* initialise referral link to a new tab */
                            $('div.referral').each(function(){
                                $(this).on('click', function(){
                                   window.open($(this).find('a').attr('href'));
                                });
                            });
                        }
                        break;
                    case 'lineups':
                        lineup_box.html(data);
                        break;
                    case 'logs':
                        logs_box.html(data);
                        break;
                }
                break;
            default :
                switch (section){
                    case 'rugby_foxnews':
                    case 'rugby_espnnews':
                        if (post.length > 0){
                            news_hub.html(post);
                            /* initialise referral link to a new tab */
                            $('div.referral').each(function(){
                                $(this).on('click', function(){
                                    window.open($(this).find('a').attr('href'));
                                });
                            });
                        }
                        break;
                    case 'lineups':
                        lineup_box.html(data);
                        break;
                    case 'fixtures':
                        fixture_box.html(data);
                        break;
                    case 'logs':
                        logs_box.html(data);
                        break;
                    case 'expert_says_2':
                    case 'expert_says_3':
                        if (expert_data != null){
                            /* check if append is needed */
                            if (has_appended_required(expert_data, section) === true){
                                experts.append(expert_data);
                            }
                        } else {
                            show_notify(data[0].msg);
                        }
                        break;
                    case 'results':
                        result.html(data);
                        break;
                }
                break;
        }
        /* hide the loader */
        gif_loader.hide();
    }, 2000);
}

/* render experts_says */
function render_experts_say(data){
    var render = (data[0].flow == undefined) ? '<span><i>'+ data[0].title +'</i></span>\
                   <div class="row">' : '';
    if (data[0].flow == undefined){
        for(var i=0; i < data.length; ++i){
            render += '<div class="col-md-4 col-xs-12">\
                        <div class="box">\
                            <p><b>'+ data[i].fixture + '</b><br>'+ data[i].details +'</p>\
                        </div>\
                    </div>';
        }
    }

    return (render.length > 0 ) ? render + '</div><hr class="major" />' : null;
}


/* render post news */
function render_news_post(data, module){
    var l = (module == 'all') ? 100 : 200;
    var post = '';
    for (var i=0; i < data.length; ++i){
        if (i < l){
            post += '<article>\
                        <div class="referral">\
                            <a target="_blank" href="'+ data[i].link+'" class="image left"><img src="'+ data[i].image +'" alt="" /></a>\
                            <div class="news_header">\
                                <span>'+ data[i].title +'</span><br>\
                                <span>'+data[i].src+'</span> - <span>'+data[i].pub_date+'</span>\
                            </div>\
                            <div class="news_desc">'+ data[i].desc +'</div>\
                        </div>\
                     </article>';
        }
    }
    return post;
}

/* display notification */
function show_notify(msg){
    $.notify(
        {
            message : msg
        },
        {
            allow_dismiss: false,
            placement: {
                from: 'bottom',
                align:'right'
            },
            animate : {
                enter: 'animated fadeInRight',
                exit: 'animated fadeOutRight'
            },
            type: 'pastel-warning',
            delay: 5000,
            template : '<div data-notify="container" class="col-xs-10 col-sm-3 alert alert-{0}" role="alert">\
                            <span data-notify="title">{1}</span>\
                            <span data-notify="message">{2}</span>\
                        </div>'
        }
    );
}

/* check viewed page */
function check_viewed_page(current_page){
    if (app_module == 'all'){
        return  {
                    links : 'http://www.foxsports.com.au/rugby/super-rugby/latest-news, '+
                            'http://kwese.espn.com/rugby/super-rugby/, '+
                            'http://www.rugby365.com/tournament/11-super-rugby/logs',
                    section: ['rugby_foxnews', 'rugby_espnnews', 'logs']
        }
    } else {
        if (current_page.match('news') != null){
            return (app_module == 'rugby') ?
            {
                links : 'http://www.foxsports.com.au/rugby/super-rugby/latest-news, '+
                        'http://kwese.espn.com/rugby/super-rugby/',
                section: ['rugby_foxnews', 'rugby_espnnews']
            } : '';
        } else if (current_page.match('lineups') != null){
            return (app_module == 'rugby') ?
            {
                links : 'http://www.sport24.co.za/Rugby/SuperRugby/super-rugby-weekend-teams-20160222',
                section : ['lineups']
            } : '';
        } else if (current_page.match('fixtures') != null){
            return (app_module == 'rugby') ?
            {
                links: 'http://rugby.ultimatedreamteams.com/superrugby/page/fixtures.html',
                section : ['fixtures']
            } : '';
        } else if (current_page.match('logs') != null){
            return (app_module == 'rugby') ?
            {
                links: 'http://www.rugby365.com/tournament/11-super-rugby/logs',
                section : ['logs']
            } : '';
        } else if (current_page.match('predictions') != null){
            return (app_module == 'rugby') ?
            {
                links:  'http://www.smh.com.au/rugby-union/super-rugby/expert-tips, '+
                        'http://www.sarugbymag.co.za/, '+
                        'http://www.rugby365.com/tournaments/super-rugby/79016-sr-preview-round-12-part-two',
                section : ['expert_says_1', 'expert_says_2', 'expert_says_3']
            } : '';
        } else if (current_page.match('results') != null){
            return (app_module == 'rugby') ?
            {
                links : 'http://www.rugby365.com/tournament/11-super-rugby/results',
                section : ['results']
            } : '';
        } else {
            return false;
        }
    }

}


/* check expert holder if data is completed */
function has_appended_required(data, section){
    var displayed = [], rendered = [], target = 0, target_l = 0;
    /* collect current displayed */
    $('#experts').children().each(function(){
        var obj = {title:null, html:null}, target = 0;
        if ($(this).prop('tagName') == 'DIV'){
            obj.title = $(this).prev().html();
            var div = $('<div></div>'); div.html($(this));
            $('div.col-md-4', div).each(function(){
                //alert($(this).html());
                if (target == 0){
                    obj.html = $(this).html();
                    var tmp = clone(obj);
                    displayed.push(tmp);
                }
                ++target;
            });
        }
    });

    /* rendered received data */
    var data_l = $('<div></div>'); data_l.html(data);
    $('div', data_l).each(function(){
        var obj = {title:null, html:null};
        if ($(this).prop('tagName') == 'DIV'){
            obj.title = $(this).prev().html();
            var div = $('<div></div>'); div.html($(this));
            $('div.col-md-4', div).each(function(){
                //alert($(this).html());
                if (target_l == 0){
                    obj.html = $(this).html();
                    var tmp = clone(obj);
                    rendered.push(tmp);
                }
                ++target_l;
            });
        }
    });

    /* compare if append is required */
    var comparable = null;

    /* find the comparable */
    for (var i=0; i < displayed.length; ++i){
        if (displayed[i].title.length == rendered[0].title.length){
            comparable = i;
        }
    }

    //alert(comparable);
    /* check data */
    if (comparable != null){
        if (displayed[comparable].html == rendered[0].html){
            return null;
        } else {
            remove_experts_target(comparable);
            return true;
        }
    } else {
        return true;
    }

    //alert(JSON.stringify(displayed) + ' =|= '+ JSON.stringify(rendered));
}

/* remove experts html */
function remove_experts_target(n){
    //alert('remove_experts called '+ n);
    var target = 0;
    $('#experts').children().each(function(){
        if (target == n){
            if ($(this).prop('tagName') == 'DIV'){
                $(this).prev().remove();
                $(this).remove();
            }
        }
        ++target;
    });
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

/* return current_timestamp */
function current_timestamp(){
    var today = new Date();
    var Y = today.getFullYear();
    var M = today.getMonth() + 1;
    var D = today.getDate();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    var ml = today.getMilliseconds();
    return Y+'-'+M+'-'+D+' '+h+':'+m+':'+s+':'+ml;
}

/* pause current process for a given milliseconds */
function sleep(milliseconds){
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
            break;
        }
    }
}




