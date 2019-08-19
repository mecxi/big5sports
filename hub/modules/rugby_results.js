/**
 * Created by Mecxi on 5/26/2017.
 * big5sports hub - super rugby result v.0.1
 */

/* process espn rugby news */
function process_rugby_results(result, obj){
    /* initialise the base url */
    var el = $('<div></div>');
    el.html(result);
    var stories = '';
    /* Determine the workflow */
    switch (obj.flow) {
        case 1:
            /* process round_lineup */
            stories = process_round_results(el);
            break;
    }
    return (stories.length > 0) ? stories : null;
}

var current_round = null; // allow only 2 rounds down below

function process_round_results(el){
    var table = '', round = 0;
    $('#main.inner-wrap div.row div.large-12.columns div.row div.large-8.columns table', el).each(function(){
        var count = 0;
       /* collect target round */
        var tr = $(this);
        var td = $('<div></div>'); td.html(tr.html());
        /* filter 2017 */
        if($('caption', td).text().match('2017') != null){
            $('tr td:nth-child(4)', td).each(function(){
                /* get top round on the list */
                if (round == 0){
                    current_round = $(this).text().trim();
                }

                if (has_round($(this).text().trim(), current_round) == true && count == 0){
                    count = 1;
                    table += '<table class="alt">' + tr.html() + '</table>';
                }
            });
        }

        ++round;
    });
    return table;
}
/* filter 2 rounds below */
function has_round(ls, current_round){

    var round = (current_round !== null) ? current_round.split(' ') : null;

    if (round != null){
        var round_compare = ['Round '+round[1], 'Round '+ (--round[1])];

        for(var i=0; i < round_compare.length; ++i){
            //alert(round_compare[i]);
            if (ls == round_compare[i]){
                return true;
            }
        }
    }

    return false;
}


