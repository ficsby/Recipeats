import React, { Component } from 'react'; 
import { StyleSheet, Text, View, WebView, Linking, Image, TouchableOpacity } from 'react-native';
import {widthPercentageToDP as wPercentage, heightPercentageToDP as hPercentage} from 'react-native-responsive-screen';

/* Custom Icons */
import { createIconSetFromFontello } from 'react-native-vector-icons';
import fontelloConfig from './../../config/icon-font.json';
const Icon = createIconSetFromFontello(fontelloConfig, 'fontello');

// Fetch the necessary Components
 import Button from './Button';

 class RecipeListItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            item: this.props.item,
            index: this.props.index,
            type: this.props.type
        }
    }

    onPressItem() {
        alert("Item Pressed");
    };

    renderCreateRecipeButton() {
        return(
            <TouchableOpacity style={styles.createRecipeButton}>
                <Icon name='plus-circled' size={50} color='rgba(100, 92, 92, 0.8)' />
            </TouchableOpacity>
        );
    };

    render() {
        let number = (this.state.index + 1).toString();
        let itemContent;
    
        {this.renderCreateRecipeButton()}

        // if (this.state.type==1) // Type 1:  Trivia tab
        // {
        //     {this.renderCreateRecipeButton()}
        // } 
        // else if (this.state.type==2) // Type 2: Popular tab (Articles are listed here)
        // {
        //     // NewsContent is set as an image
        //     itemContent = 'bookmarked recipes';
        // }
        // console.log(itemContent);
    
        return (
            <Button
                key={this.state.index}
                noDefaultStyles={true}
                onPress={this.onPressItem}
            >
                <View style={styles.itemContainer}>
                    <View style={styles.itemText}>
                        <View style={styles.number}>
                            <Text style={styles.number}>{number}.</Text>
                        </View>
                        <View style={styles.detailsContainer}>
                            {/* { getPretext(item) } */}
                            <Text style={styles.title}>{this.state.item.title}</Text>
                            <Text>{this.state.item.servings + "   " + this.state.item.readyInMinutes}</Text>
                        </View>
                    </View>
                    <View style={styles.photoContainer}>
                        <Image source={{uri:this.state.item.image}} style={styles.photo}/>
                        {console.log(this.state.item.image)}
                    </View>
                </View>
            </Button>
        );

    }

}


const styles = StyleSheet.create({
    itemContainer: {
        flex: 1,
        flexDirection: 'row',
        paddingRight: 15,
        paddingLeft: 15,
        paddingTop: 10,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E4E4E4'
    },
    itemText: {
        flex: 2,
        flexDirection: 'row',
        padding: 10
    },
    number: {
        flex: 0.5,
    },
    detailsContainer: {
        flex: 3
    },
    pretext: {
        color: '#3F3F3F',
        fontSize: 20
    },
    title: {
        width: wPercentage('50%'),
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        fontFamily: 'georgia'
    },
    photoContainer: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center'
    },
    photo: {
        width: 50,
        height: 50
    },

    createRecipeButton: {
        flex: 5,
        alignSelf: 'flex-end',
        position: 'absolute',
        right: 100,
        bottom: 60
    }
     
});

export default RecipeListItem;