import React, { Component } from 'react'; 
import { StyleSheet, Text, View, WebView, Linking, Image, Alert, TouchableOpacity } from 'react-native';
import Swipeout from 'react-native-swipeout';
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
            listData: this.props.listData,
            item: this.props.item,
            rowId: this.props.rowId,
            sectionId: this.props.sectionId
        }
    }

    onPressItem() {
        alert("Item Pressed");
    };

    onPressDelete() {
		const parent = this.state.parent;

		Alert.alert(
			"Warning",
			"Are you sure you want to remove " +
			this.state.item.title +
			" from your recipe list?",
			[
				{
					text: "Cancel",
					onPress: () => console.log("Cancel Pressed"),
					style: "cancel"
				},
				{
					text: "Yes",
					onPress: () => {
                        switch (this.props.sectionId) {
                            case 1: this.props.parent.setState({
                                        customRecipes: this.state.listData.filter(
                                            item => item.id != this.state.item.id
                                        )
                                    });
                                    break;
                            case 2: this.props.parent.setState({
                                        bookmarkedRecipes: this.state.listData.filter(
                                            item => item.id != this.state.item.id
                                        )
                                    });
                                    // Set bookmark to false for the recipe
                                    break;
                        }
                    }
				}
			],
			{ cancelable: false }
		);
    };

    renderRecipes(){
        let number = (this.state.rowId + 1).toString();
        return (
            <Button
            key={this.state.rowId}
            noDefaultStyles={true}
            onPress={this.onPressItem}
            >
                <View style={styles.itemContainer}>
                    <View style={styles.ItemDescription}>
                        <View style={styles.number}>
                            <Text style={styles.number}>{number}.</Text>
                        </View>
                        <View style={styles.detailsContainer}>
                            {/* { getPretext(item) } */}
                            <Text style={styles.title}>{this.state.item.title}</Text>
                            <View style={{flexDirection:'row'}}>
                                <Text>{this.state.item.servings}</Text> 
                                <Text style={{marginLeft: wPercentage('1%'), marginRight: wPercentage('2%')}}>servings</Text>
                                <Text>{this.state.item.readyInMinutes}</Text> 
                                <Text style={{marginLeft: wPercentage('1%'), marginRight: wPercentage('1%')}}>mins</Text> 
                            </View>
                        </View>
                    </View>
                    <View style={styles.photoContainer}>
                        <Image source={require('./../../assets/images/ramen-noodle-coleslaw.jpg')} style={styles.photo}/>
                        {console.log(this.state.item.image)}
                    </View>
                </View>
            </Button>
        );
    }

    render() {        
        const swipeSettings =
        {
            noDefaultStyles: true,
            autoClose: true,
            right:
                [
                    {
                        onPress: () => {this.onPressDelete()},
                        text: 'Delete',
                        type: 'delete',
                    }
                ],
            rowId: this.props.rowId,
            sectionId: this.props.sectionId,
        }
        return (
            <Swipeout  {...swipeSettings}>
                {this.renderRecipes()}
            </Swipeout>
        );

    }

}


const styles = StyleSheet.create({
    itemContainer: {
        flex: 1,
        flexDirection: 'row',
        // marginRight:  wPercentage('10%'),
        // marginLeft:  wPercentage('10%'),
        paddingTop: hPercentage('2%'),
        paddingBottom: hPercentage('2%'),
        borderBottomWidth: 1,
        borderBottomColor: '#E4E4E4',
    },
    ItemDescription: {
        flex: 2,
        flexDirection: 'row',
        paddingTop: hPercentage('1%'),
        paddinBottom: hPercentage('5%'),
        marginLeft: wPercentage('7%'),
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
        // fontFamily: 'georgia'
    },
    photoContainer: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center'
        marginRight: wPercentage('15%'),

    },
    photo: {
        width: wPercentage('35%'),
        height: hPercentage('10%'),
    },
});

export default RecipeListItem;