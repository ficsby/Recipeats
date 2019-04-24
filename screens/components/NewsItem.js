import React, { Component } from 'react'; 
import { StyleSheet, Text, View, WebView, Linking, Image } from 'react-native';
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

    if (type==1) // Type 1:  Trivia tab
    {
        newsContent = <Text>hi 1</Text>;
    } 
    else if (type==2) // Type 2: Popular tab (Articles are listed here)
    {
        // NewsContent is set as an image
        newsContent = <Image source={{uri:news.image}} style={styles.articleImage}/>; 
    }
    else if (type==3) // Type 3: Videos tab
    {
        newsContent =  <WebView style= { {flex : 1} }
                        mediaPlaybackRequiresUserAction = {false}
                        domStorageEnabled={true}
                        source={{ uri: "https://www.youtube.com/embed/" + news.videoId }}
                        style={styles.video}
                        />;
    }
    return (
        <Button key={index} noDefaultStyles={true} style = {{ flex: 1 }} >
            <View style={styles.newsItem}>
                <View style={styles.newsText}>
                    <View style={styles.newsTextContainer}>
                        { getPretext(news) }
                        <Text style={styles.newsTitle}>{news.title}</Text>
                        {/* <Text>{news.summary}</Text> */}
                    </View>
                </View>
                {/* if type==1,  newContent renders food trivia  (not done yet) 
                    if type==2,  newsContent renders food articles  (in progress) 
                    if type==3,  newsContent renders food videos  (finished)      */}
                {newsContent} 
            </View>
        </Button>
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
        color: 'rgba(94, 89, 89, 1)',
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