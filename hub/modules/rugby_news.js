/**
 * Created by Mecxi on 5/20/2017.
 * big5sports hub - Super Rugby News module v.0.1
 */

/* process rugby news */
function process_rugby_news(result, obj){
    /* initialise the base url */
    var el = $('<div></div>');
    var stories = [];
    el.html(result);
    /* Determine the workflow */
    switch (obj.flow) {
        case 1:
            get_news_stories(el, stories, obj);
            break;
    }
    /* process timestamp */
    if (stories.length > 0){
        process_news_timestamp(stories);
    }

    return (stories.length > 0) ? stories : null;
}

/* get news stories */
function get_news_stories(el, stories, obj){
    console.log('getting news...');
    /* ESPN news */
    if (obj.link.match('kwese') !== null){
        $('.main-content div', el).each(function(){
            var story = {}, image = null, desc = null, title = null, link = null;

            /* check lineup stories */
            if ($(this).attr('class') == 'contentItem__contentWrapper'){
                /* get title */
                title = $(this).find('h1');
                story.title = (title.attr('class').match('contentItem__title') != null) ? title.text().trim() : '';
                /* get desc */
                desc = $(this).find('p');
                if (desc.attr('class') != undefined){
                    story.desc = (desc.attr('class').match('contentItem__subhead') != null) ? desc.text().trim() : '';
                } else {
                    story.desc = '';
                }

                /* get image */
                image = $(this).next();
                story.image = (image.attr('class') == 'img-wrap') ? image.find('img').attr('data-default-src') : ((image.attr('class').match('media-wrapper_image') != null) ? image.attr('data-default-src') : '');
                /* check if content is media */
                if (title.attr('class').match('contentItem__title--media') != null){
                    link = $(this).next().next().next();
                    link.find('ul li a').each(function(){
                        if ($(this).attr('class').match('icon-font-before') != null){
                            story.link = $(this).attr('href');
                        }
                    });
                    story.type = 'media';
                } else {
                    /* get link */
                    link = $(this).prev();
                    story.link = (link.attr('class') == 'contentItem__padding') ? 'http://kwese.espn.com'+ link.attr('href') : '';
                    story.type = 'story';
                }
                /* check if all items has been collected before adding current news */
                if (story.title.length > 0 && story.desc.length > 0){
                    /* create a pub date and the source */
                    story.pub_date = null;
                    story.src = 'kwese.espn.com';
                    stories.push(story);
                }

            }
        });
    }

    /* FOXSPORTS news */
    if (obj.link.match('foxsports') !== null){
        var count = 0;

        $('.main-content-left div.row div.col-xs-16 div.group__content div.row.row-xs--no-margin div.col-xs-16.col-md-16 div.row div.col-xs-16', el).each(function(){

            if (count < 31){
                var story = {'title':null, 'desc':null, 'image':null, 'link':null};
                /* get title */
                $(this).find('.article-snippet__heading-group h1 a').each(function(){
                    story.title = $(this).text().trim().replace(/’/g, '\'');
                });
                story.title = (story.title == null) ? '': story.title;

                /* get link */
                $(this).find('.article-snippet__image-container div a').each(function(){
                    story.link = $(this).attr('href');
                });
                story.link = (story.link == null) ? '': story.link;

                /* get image */
                $(this).find('.article-snippet__image-container div a span img').each(function(){
                    story.image = $(this).attr('src');
                });
                story.image = (story.image == null) ? '': story.image;

                /* get desc */
                $(this).find('p a').each(function(){
                    story.desc = $(this).text().trim().replace(/’/g, '\'');

                });
                story.desc = (story.desc == null) ? '': story.desc;

                /* check if all items has been collected before adding current news */
                if (story.title.length > 0 && story.desc.length > 0){
                    /* create a pub date and source */
                    story.pub_date = null;
                    story.src = 'foxsports.com.au';
                    stories.push(story);
                }

                ++count;
            }
        });
    }

    console.log('done loading stories ... | check result');
    console.log(stories);
}


/* add pub_date timestamp */
function process_news_timestamp(stories){
    var i = stories.length - 1;
    for (; i > -1 ; --i){
        stories[i].pub_date = current_timestamp();
        sleep(1);
    }
}

