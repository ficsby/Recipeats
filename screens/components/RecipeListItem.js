import React, { Component } from 'react'; 
import { StyleSheet, Text, View, WebView, Linking, Image, TouchableOpacity } from 'react-native';
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
            item: this.props.item,
            index: this.props.index,
            type: this.props.type
        }
    }

    
	onPressDelete() {
		const parent = this.state.parent;

		Alert.alert(
			"Warning",
			"Are you sure you want to delete " +
			this.state.title +
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
						// removeFromFoodStock(
						// 	firebase.auth().currentUser.uid,
						// 	this.state.name,
						// 	this.state.id
						// );

						//update the parent's foodlist to keep it synced with firebase
						parent.setState({
							customRecipes: parent.state.customRecipes.filter(
								recipe => recipe.title != this.state.name
							)
						});
					}
				}
			],
			{ cancelable: false }
		);
	}

    onPressItem() {
        alert("Item Pressed");
    };

    render() {
        let number = (this.state.index + 1).toString();
        
        const swipeSettings =
        {
            autoClose: true,
            onClose: (sectionId, rowId, direction) => {
                if (this.state.activeRowKey != null) {
                    this.setState({ activeRowKey: null });
                }
            },
            onOpen: (sectionId, rowId, direction) => {
                if (this.state.activeRowKey != null) {
                    this.setState({ activeRowKey: this.props.id });
                }
            },
            right:
                [
                    {
                        onPress: () => {
                            const deletedRow = this.state.activeRowKey;
                            // Refresh FlatList
                            switch (this.props.sectionId) {
                                case 1: this.props.parentFlatList.state.customRecipes.splice(this.props.rowId, 1);
                                    this.props.parentFlatList.setState({ tempIngredients: this.props.flatListData });
                                    break;
                                case 2: this.props.parentFlatList.state.tempInstructions.splice(this.props.rowId, 1);
                                    this.props.parentFlatList.setState({ tempInstructions: this.props.flatListData });
                                    break;
                            }

                        },
                        text: 'Delete',
                        type: 'delete',
                    }
                ],
            rowId: this.props.index,
            sectionId: this.props.sectionId,
        }
        return (
            <Button
                key={this.state.index}
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