import React from "react";
import {
	Modal,
	StyleSheet,
	Text,
	TouchableHighlight,
	TouchableOpacity,
	View,
	Image
} from "react-native";
import {
	widthPercentageToDP as wPercentage,
	heightPercentageToDP as hPercentage
} from "react-native-responsive-screen";
import { ListItem, Divider } from 'react-native-elements';
import Swipeout from 'react-native-swipeout';


import Button from "./Button";
import {
	modifyFoodStock,
	logPurchaseDate,
	getFoodList,
	removeFromFoodStock
} from "../../utils/FoodListUtils";
import * as firebase from "firebase";
import { Alert } from "react-native";
import FoodItemForm from './FoodItemForm';
import AddFoodItemModal from "./AddFoodItemModal";

export default class FoodItem extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			activeRowKey: null,
			itemModalVisible: false,
			id: this.props.id,
			name: this.props.name,
			price: this.props.price,
			parent: this.props.parent,
			datePurchased: this.props.datePurchased,
			quantity: this.props.quantity,
			unit: this.props.unit,
			tableData: this.props.tableData
		};

		this.toggleIngrModalVisibility = this.toggleIngrModalVisibility.bind(this);
	}

	async componentDidMount() {
		this._ismounted = true; // set boolean to true, then for each setState call have a condition that checks if _ismounted is true
	}
	/**
	 * Function to set whether the add item modal is visible or not
	 * @param {*} visible - boolean value to set
	 */
	toggleIngrModalVisibility() {
		this.setState({ itemModalVisible: !this.state.itemModalVisible });
	}

	renderFoodItem() {
		return (	
			<TouchableOpacity onPress = {() => this.toggleIngrModalVisibility()}>
				<ListItem key={this.props.rowId} title={this.state.name} rightTitle={this.state.quantity + "  " + this.state.unit} />
				<Divider />
			</TouchableOpacity>
		);
	}

	onPressItem() {
		//alert(this.state.name + " was pressed.");
		this.toggleIngrModalVisibility;
	}

	onPressDelete() {
		const parent = this.state.parent;

		Alert.alert(
			"Warning",
			"Are you sure you want to delete " +
			this.state.name +
			" from your inventory?",
			[
				{
					text: "Cancel",
					onPress: () => console.log("Cancel Pressed"),
					style: "cancel"
				},
				{
					text: "Yes",
					onPress: () => {
						removeFromFoodStock(
							firebase.auth().currentUser.uid,
							this.state.name,
							this.state.id
						);

						//update the parent's foodlist to keep it synced with firebase
						parent.setState({
							externalFoodList: parent.state.externalFoodList.filter(
								foodItem => foodItem.name != this.state.name
							)
						});
					}
				}
			],
			{ cancelable: false }
		);
	}

	render() {
		const swipeSettings =
        {
            autoClose: true,
            // onClose: (sectionId, rowId, direction) => {
            //     if (this.state.activeRowKey != null) {
            //         this.setState({ activeRowKey: null });
            //     }
            // },
            // onOpen: (sectionId, rowId, direction) => {
            //     if (this.state.activeRowKey != null) {
            //         this.setState({ activeRowKey: this.state.id });
            //     }
            // },
            right:
                [
                    {
                        onPress: () => {
                            const deletedRow = this.state.activeRowKey;
							this.onPressDelete()  // Delete item and update the list
                        },
                        text: 'Delete',
                        type: 'delete',
                    }
                ],
        }
		return (
			<View>

				<AddFoodItemModal
					isModalVisible={this.state.itemModalVisible}
					title={"Edit Ingredient"}
					showPriceInput={true}
					showDatePicker={true}
					datePurchased={this.state.datePurchased}
					id={this.state.id}
					name={this.state.name}
					parent={this}
					price={this.state.price}
					quantity={this.state.quantity}
					unit={this.state.unit}
					tableData={this.state.tableData}
				/>

				<Button
					key={this.props.index}
					noDefaultStyles={true}
					onPress={() => this.toggleIngrModalVisibility()}
				>
				<Swipeout {...swipeSettings}>
					{this.renderFoodItem()}
				</Swipeout>

				</Button>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	foodItemContainer: {
		marginLeft: wPercentage('10%'),
		marginRight: wPercentage('10%'),
		marginTop: wPercentage('5%'),
		marginBottom: wPercentage('5%'),
		backgroundColor: "rgba(244, 238, 238, 0.9)",
	},

	foodButton: {
		marginLeft: wPercentage("10%")
	}
});
