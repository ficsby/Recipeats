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
            parent: this.props.parent,
            item: this.props.item,
            rowId: this.props.rowId,
            sectionId: this.props.sectionId
        }
        this.onPressDelete = this.onPressDelete.bind(this);
    }

    onPressItem() {
        alert("Item Pressed");
    };

    onPressDelete() {
        const parent = this.state.parent;
        console.log('item id');
        console.log(this.state.item.id);
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
                        var temp = [];
                        console.log("rowid: ", this.props.rowId);
                        switch (this.state.sectionId) {
                            case 1: temp = [...this.props.parent.state.customRecipes];
                                    console.log("BEFORE\n", temp);
                                    temp.splice(this.props.rowId, 1);
                                    this.props.parent.setState({ customRecipes: temp });
                                    break;
                            case 2: temp = [...this.props.parent.state.bookmarkedRecipes];
                                    temp.splice(this.props.rowId, 1);
                                    this.props.parent.setState({ bookmarkedRecipes: temp });
                                    break;
                        }
                        console.log("AFTER\n", temp);
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
            style={{backgroundColor:'white'}}
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
            <Swipeout  {...swipeSettings} style={{backgroundColor:'rgb(247, 247, 247)'}}>
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
        paddingBottom: hPercentage('5%'),
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