import React, { Component } from 'react'; 
import { StyleSheet, Text, View, WebView, Linking } from 'react-native';
import YouTube from 'react-native-youtube';

// Fetch the necessary Components
 import Button from './Button';
 
function getPretext(news) {
    if(news.pretext){
        return (
            <Text style={styles.newsPretext}>{news.pretext}</Text>
        );
    }
};

function onPress(news) {
    alert(news.title);
};

const NewsItem = ({ news, index, type }) => {
    let number = (index + 1).toString();
    let newsContent;

    if (type==1)  // Type 1:  Trivia tab
    {
        newsContent = <Text>hi 1</Text>; // Test
    } 
    else if (type==2) // Type 2: Popular tab (Articles are listed here)
    { 
        newsContent = <Text>hi 2</Text>; // Test

        // NewsContent is set as an image (NOT WORKING)
        // newsContent = <Image source={news.image} style={styles.articleImage}/> 
    }
    else if (type==3) // Type 3: Videos tab
    {
        // NewsContent is set as a video
        newsContent =  <WebView style= { {flex : 1} }
                        mediaPlaybackRequiresUserAction = {false}
                        domStorageEnabled={true}
                        source={{ uri: "https://www.youtube.com/embed/" + news.videoId }}
                        style={styles.video}
                        />;
    }
    return (
        <View style={styles.newsItem}>
            <View style={styles.newsText}>
                <View style={styles.newsTextContainer}>
                    <Text style={styles.newsTitle}>{news.title}</Text>
                </View>
            </View>
            {newsContent}   {/* if type==1,  newContent renders food trivia  (not done yet) 
                                if type==2,  newsContent renders food articles  (in progress) 
                                if type==3,  newsContent renders food videos  (finished)      */}
        </View>
    );
}

const styles = StyleSheet.create({
    newsItem: {
        flex: 1,
        // flexDirection: 'row',
        // paddingRight: 20,
        // paddingLeft: 20,
        // paddingTop: 10,
        paddingBottom: 30,
        backgroundColor: 'white',
        marginBottom: 13,
    },

    newsText: {
        flex: 2,
        flexDirection: 'row',
        padding: 10,
    },

    newsTextContainer: {
        flex: 3,
    },
     
    newsPretext: {
        color: '#3F3F3F',
        fontSize: 20
    },

    newsTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
        // fontFamily: 'georgia'
    },

    articleImageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    articleImage: {
        width: 400,
        height: 200,
    },

    video: {
        width: 400,
        height: 200
    }
});

export default NewsItem;