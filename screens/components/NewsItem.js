import React, { Component } from 'react';
 
import { StyleSheet, Text, View, Image } from 'react-native';

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

const NewsItem = ({ news, index }) => {
    let number = (index + 1).toString();
 
    return (
        <Button key={index} noDefaultStyles={true} onPress={onPress.bind(this, news)} >
            <View style={styles.newsItem}>
                <View style={styles.newsText}>
                    <View style={styles.newsTextContainer}>
                        { getPretext(news) }
                        <Text style={styles.newsTitle}>{news.title}</Text>
                        <Text>{news.summary}</Text>
                    </View>
                </View>
                <View style={styles.newsImageContainer}>
                    <Image source={news.image} style={styles.newsImage} />
                </View>
            </View>
        </Button>
    );
}

const styles = StyleSheet.create({
    newsItem: {
        flex: 1,
        flexDirection: 'row',
        paddingRight: 20,
        paddingLeft: 20,
        paddingTop: 10,
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
        marginTop: 13,
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

    newsImageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    
    newsImage: {
        width: 120,
        height: 120
    }
});

export default NewsItem;