/**
 * Created by Mecxi on 5/21/2017.
 * big5sports hub - Super Rugby results module v.0.1
 */

/* process espn rugby news */
function process_rugby_logs(result, obj){
    /* initialise the base url */
    var el = $('<div></div>');
    el.html(result);
    /* Determine the workflow */
    switch (obj.flow) {
        case 1:
            /* process round_lineup */
            return process_round_logs(el);
            break;
    }
    return null;
}

function process_round_logs(el){
    var table = '';
    $('#main.inner-wrap div.row div.large-12.columns div.row div.large-8.columns table', el).each(function(){
        //alert($(this).html());
        table += '<table class="alt">' + $(this).html() + '</table>';
    });
    //alert(table);
    return (table.length > 0) ? table : null;
}