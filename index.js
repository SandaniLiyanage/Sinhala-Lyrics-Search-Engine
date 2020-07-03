//require the Elasticsearch librray
const elasticsearch = require('elasticsearch');
// instantiate an elasticsearch client
const client = new elasticsearch.Client({
    hosts: ['http://localhost:9200']
});
//require Express
const express = require('express');
// instanciate an instance of express and hold the value in a constant called app
const app = express();
//require the body-parser library. will be used for parsing body requests
const bodyParser = require('body-parser')
//require the path library
const path = require('path');

// ping the client to be sure Elasticsearch is up
client.ping({
    requestTimeout: 30000,
}, function (error) {
    // at this point, eastic search is down, please check the Elasticsearch service
    if (error) {
        console.error('elasticsearch cluster is down!');
    } else {
        console.log('Everything is ok');
    }
});


// use the bodyparser as a middleware  
app.use(bodyParser.json())
// set port for the app to listen on
app.set('port', process.env.PORT || 3001);
// set path to serve static files
app.use(express.static(path.join(__dirname, 'public')));
// enable CORS 
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// defined the base route and return with an HTML file called tempate.html
app.get('/', function (req, res) {
    console.log('sending template...');
    res.sendFile('index.html', {
        root: path.join(__dirname, 'views')
    });
})

// define the /search route that should return elastic search results 
app.get('/search', function (req, res) {

    input_query = req.query.q;
    var keywords = req.query.q.split(' ').map(item => item.trim());

    //  flag order =  [ 0 - is popular, 1 - title, 2 - artist, 3 - genre, 4 - writer, 5 - music, 6 - lyrics, 7 - output_size ]
    flags = [0, 1, 0, 0, 0, 0, 0, -1]

    music_keywords = ['සංගීතමය', 'සංගීතවත්', 'අධ්‍යක්ෂණය', 'සංගීත']
    genre_keywords = ['පැරණි', 'පොප්ස්', 'පොප්', 'පරණ', 'ක්ලැසික්', 'ක්ලැසි', 'ඉල්ලීම', 'චිත්‍රපට', 'නව']
    artist_keywords = ['කීව', 'කී', 'ගායනා කරන', 'ගයන', 'ගායනා', '‌ගේ', 'හඩින්', 'කියනා', 'කිව්ව', 'කිව්', 'කිව', 'ගායනය',
        'ගායනා කළා', 'ගායනා කල', 'ගැයූ']
    writer_keywords = ['ලියා', 'ලියූ', 'ලිව්ව', 'ලිව්', 'රචනා', 'ලියා ඇති', 'රචිත', 'ලියන ලද', 'ලියන', 'හදපු', 'පද',
        'රචනය', 'හැදූ', 'හැදුව', 'ලියන', 'ලියන්න', 'ලීව', 'ලියපු', 'ලියා ඇත', 'ලිඛිත']
    popular_keywords = ['හොඳම', 'හොදම', 'ප්‍රසිද්ධ', 'ප්‍රසිද්ධම', 'ජනප්‍රිය', 'ජනප්‍රියතම', 'ඉස්තරම්', 'ඉස්තරම්ම', 'සුපිරි', 'සුපිරිම', 'පට්ට', 'මරු'];

    new_query = ""
    fields_list = []
    let body = '';

    keywords.forEach(element => {
        //Check for number present in the query
        if (!isNaN(element)) {
            flags[7] = Number(element);
        //check for popular keywords
        }else if(popular_keywords.includes(element)){
            flags[0] = 1;
        //check for artist keywords
        }else if(artist_keywords.includes(element)){
            flags[2] = 1;
        //check for genre keywords
        }else if(genre_keywords.includes(element)){
            flags[3] = 1;
        //check for writer keywords
        }else if(writer_keywords.includes(element)){
            flags[4] = 1;
        //chekc for music keywords
        }else if(music_keywords.includes(element)){
            flags[5] = 1;
        }else{
        //if not in any of the above keyword lists create query
            new_query = new_query + element + " "
        }
    });

    input_query = new_query;

    d_title = "title*"
    d_artist = "artist*"
    d_lyrics = "lyrics*"
    d_writer = "writer*"
    d_music = "music*"
    d_genre = "genre"

    //if writer, artist, music or genre is present disable title
    if (flags[4] == 1 || flags[2] == 1 || flags[5] == 1 || flags[3] == 1){
        flags[1] = 0;
    }
    if (flags[2] == 1){
        if(flags[0] == 1){
            fields_list.push(d_artist);
        }else{
            d_artist += "^4"
        }
    }
    if (flags[3] == 1){
        if(flags[0] == 1){
            fields_list.push(d_genre);
        }else{
            d_genre += "^4"
        }
    }
    if (flags[4] == 1){
        if(flags[0] == 1){
            fields_list.push(d_writer);
        }else{
            d_writer += "^4"
        }
    }
    if (flags[5] == 1){
        if(flags[0] == 1){
            fields_list.push(d_music);
        }else{
            d_music += "^4"
        }
    }
    if (flags[1] == 1){
        if(flags[0] == 1){
            fields_list.push(d_title);
        }else{
            d_title += "^4"
        }
    }

    if (flags[0] == 1){
        if (flags[7] == -1){
            flags[7] = 20
        }

        if (input_query.trim().length == 0){
            body = {
                "sort": [{
                    "visits": {
                        "order": "desc"
                    }
                }],
                "size": flags[7]
            }
        }else{
            body = {
                "query": {
                    "query_string": {
                        "query": input_query,
                        "type": "bool_prefix",
                        "fields": fields_list,
                        "fuzziness": "AUTO",
                        "analyze_wildcard": true
                    }
                },
                "sort": [
                    {
                        "visits": {
                            "order": "desc"
                        }
                    }
                ],
                "size": flags[7]
            }
        }
    }else{
        fields_list = [d_title, d_artist, d_lyrics, d_writer, d_music, d_genre]
        body = {
            "query": {
                "query_string": {
                    "query": input_query,
                    "type": "bool_prefix",
                    "fields": fields_list,
                }
            }
        }
    }
      
    // perform the actual search passing in the index, the search query and the type
    client.search({
        index: 'songs',
        type: 'song',
        body: body
    })
        .then(results => {
            res.send(results.hits.hits);
        })
        .catch(err => {
            console.log(err)
            res.send([]);
        });

})
// listen on the specified port
app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});


