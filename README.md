# Sinhala-Lyrics-Search-Engine
This repository contains the source code for a real-time sinhala lyrics search engine implemented using ElasticSearch, Node and Vue.

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
Orginal data is scraped from https://sinhalasongbook.com/all-sinhala-song-lyrics-and-chords/ page for educational purposes.

Each song contains the following metadata.
1. `title` : name of the song (string)
2. `artist` : Singer of the song (string)
3. `genre` : Category of the song (string)
4. `writer` : Lyricist of the song (string)
5. `music` : Music composer of the song (string)
6. `visits` : Number of views for the song in original site (number)
7. `lyrics` : lyric (lines seperated by \r\n) (string)



