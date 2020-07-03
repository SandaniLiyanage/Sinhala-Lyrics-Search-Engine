# Sinhala-Lyrics-Search-Engine
This repository contains the source code for a real-time sinhala lyrics search engine implemented using [ElasticSearch](https://www.elastic.co/), [Node](https://nodejs.org/en/) and [Vue](https://vuejs.org/).

## Getting Started
1. Get all the dependencies using `npm install` command.
2. Download and start [Elasticsearch](https://www.elastic.co/downloads/elasticsearch) locally on port 9200.
3. Create the index and add documents by running `node data.js`.
4. Start node server using `node index.js` command.
5. visit http://localhost:3001/ in a browser.
6. Enter the search query in the search bar.

## Features
### Basic
* Search by a song title.
  * Eg:- ඝන අඳුරේ
* Search by an artist name.
  * Eg:- ක්ලැරන්ස් විජේවර්ධන, ක්ලැරන්ස් විජේවර්ධන ගැයූ
* Search by a song genre.
  * Eg:- පැරණි පොප්ස්
* Search by the lyric writer.
  * Eg:- සුනිල් ආරියරත්න රචිත
* Search by a music producer.
  * Eg:- ක්ලැරන්ස් විජේවර්ධන සංගීතවත් කල
* Search by a lyrics.
  * Eg:- සඳෙන් එහා කඳු මුදුන් ඉමේ
* Range queries
  * Eg:- පැරණි පොප්ස් 5 ක්
  
### Advanced

* Search more complex queries  
  * Eg:- ක්ලැරන්ස් විජේවර්ධන සංගීතමය හොඳම 5</br>
         &nbsp; &nbsp; &nbsp; &nbsp; ටී.එම්.ජයරත්න ගැයූ පැරණි පොප්ස් 10
* Search queries in both sinhala and singlish  

## Data
The Orginal data store in `original_data.json` was scraped from https://sinhalasongbook.com/all-sinhala-song-lyrics-and-chords/ page for educational purposes. Then the orginal data was translated to sinhala using [google-translate](https://www.npmjs.com/package/google-translate) Node.js module. The processed data are stored in the `sinhala_songs.json`.This corpus contains lyrics for 1050 songs.

Each song contains the following metadata.
1. `title` : name of the song (string)
2. `artist` : Singer of the song (string)
3. `genre` : Category of the song (string)
4. `writer` : Lyricist of the song (string)
5. `music` : Music composer of the song (string)
6. `visits` : Number of views for the song in original site (number)
7. `lyrics` : lyric (lines seperated by \r\n) (string)

## Indexing and Querying Techniques

### Use of Bulk API
Official Node.js library for [Elasticsearch](https://www.npmjs.com/package/elasticsearch) was used for indexing data. `bulk` API in Elasticsearch was used to perform many index operations in a single API call. This can greatly increase the indexing speed.Each subrequest is executed independently, so the failure of one sub-request won’t affect the success of the others. If any of the requests fail, the top-level error flag is set to true and the error details will be reported under the relevant request. 

### Use auto-generated ids
When indexing a document that has an explicit id, Elasticsearch needs to check whether a document with the same id already exists within the same shard, which is a costly operation and gets even more costly as the index grows. By using auto-generated ids, Elasticsearch can skip this check, which makes indexing faster.

### Rule Based Classification 
The user search queries were preprocessed with rule based classification to identify how to create queries for the elastic search backend. By analyzing the phrases, user search query were classified into different categories of searches based on the keywords present and relevant rules. 
> Eg: If the user query contains a number, set the size of the search results to the given number. </br>
&nbsp; &nbsp; &nbsp; If the user query contains the phrase 'හොදම', sort the results by number of visits.

### Boosting 
Boosting was used as the main query optimization technique. While querying, specific fields identified using rule based classification was boosted to have more significance in the score calculation.   
> Eg: If the user query contains the phrase 'ගැයූ', boost the artist field.

