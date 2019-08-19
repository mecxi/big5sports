/**
 * Created by Mecxi on 5/21/2017.
 * big5sports hub - Super Rugby fixtures module v.0.1
 */

/* process espn rugby news */
function process_rugby_fixtures(result, obj){
    /* initialise the base url */
    var el = $('<div></div>');

    el.html(result);

    /* Determine the workflow */
    switch (obj.flow) {
        case 1:
            /* process round_lineup */
            return process_round_fixtures(el);
            break;
    }
    return null;
}

function process_round_fixtures(el){
    var table = null;
    $('#main table tr#content td div.-bpanel div.bpanel div.div_border table.list thead tr td table.rounded_corners', el).each(function(){
        table = '<table class="alt">' + $(this).html() + '</table>';
    });
    return table;
}