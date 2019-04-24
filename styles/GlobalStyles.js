import {StyleSheet} from 'react-native';
import {
    widthPercentageToDP as wPercentage,
    heightPercentageToDP as hPercentage
} from "react-native-responsive-screen";

export const Styles = StyleSheet.create({

    // droidSafeArea: {
    //     flex: 1,
    //     backgroundColor: 'white',
    //     marginTop: Platform.OS === 'android' ? StatusBar.currentHeight: 0
    // },

  /*------------------------------------------------------------------------
      General Styles
  ------------------------------------------------------------------------*/
	screenContainer: {
		marginHorizontal: wPercentage('5%'),
		marginVertical: hPercentage('2%')
	},

	background: {
		flex: 1,
		backgroundColor: 'rgba(249, 248, 248, 1)',
	},

	row: {
		flex: 1,
		flexDirection: 'row',
		width: '100%',
	},

	collapsibleBar: {
		backgroundColor: 'rgba(255,255,255,1)',
		borderTopColor: 'rgba(0,0,0,0.3)',
		borderBottomColor: 'rgba(0,0,0,0.3)',
		borderTopWidth: 1,
		borderBottomWidth: 1,
	},

	collapsibleTitle: {
		marginLeft: 15,
		color: 'rgba(0,0,0,0.9)',
		fontSize: 18,
	},

	recipeRow: {
		flex: 1,
		flexDirection: 'row',
		width: '100%',
		textAlign: 'center',
		justifyContent: 'center', // Used to set Text Component Vertically Center
		alignItems: 'center', // Used to set Text Component Horizontally Center
	},

	contents: {
		marginTop: 5,
		marginBottom: 15,
		backgroundColor: 'rgba(0, 0, 0, 0.05)',
	},

/*------------------------------------------------------------------------
	Top Section
------------------------------------------------------------------------*/
	topContainer: {
		width: '100%',
		height: 80,
		paddingTop: 30,
		paddingBottom: 10,
		backgroundColor: 'rgba(244, 238, 238, 0.5)',
		borderBottomColor: 'rgba(225, 218, 218, 0.7)',
		borderBottomWidth: 2.1,
	},


/*------------------------------------------------------------------------
	Autocomplete Section
------------------------------------------------------------------------*/
	
	searchContainer: {
		alignSelf: 'center',
		width: '74%',
		marginTop: 10,
		flex: 1,
		top: 17,
		zIndex: 1,
		position: 'absolute',
	},

	searchInputContainer: {
		alignSelf: 'center',
		width: '94%',
		paddingLeft: 10,
		backgroundColor: 'rgba(255,255,255,1)',
		// marginTop: -5,
	},

	searchInput: {
		width: '100%',
		fontSize: 15,
		paddingLeft: 10,
	},

	searchResultsContainer: {
		flex: 1,
		width: '100%',
		marginLeft: 10,
		marginRight: 10,
		marginBottom: 5,
	},

	searchResult: {
		width: '100%',
	},


/*------------------------------------------------------------------------
	Recipe Info Section
------------------------------------------------------------------------*/

	recipeContainer: {
		backgroundColor: 'rgba(0, 0, 0, 0.05)',
	},

	image: {
		//position: 'relative',
		width: '100%',
		height: 300,
	},

	titleContainer: {
		marginTop: -5,
		paddingTop: 5,
		backgroundColor: 'rgba(255,255,255,1)',
	},

	title: {
		marginLeft: 13,
		marginRight: 13,
		fontSize: 28,
		fontWeight: '500',
		color: 'rgba(181, 83, 102, 1)', // Medium Pink
	},

	stats: {
		fontSize: 16,
		color: 'rgba(0,0,0, 0.5)',
		marginLeft: 5,
	},
	
	statsIcon: {
		marginTop: 3,
		marginLeft: 20,
		fontSize: 15,
		color: 'rgba(0,0,0, 0.5)',
	},

			
/*-----------------------
	Description
-------------------------*/

	descriptionContainer: {
		paddingBottom: 5,
		backgroundColor: 'rgba(255,255,255,1)',
		// borderBottomWidth: 1,
		// borderBottomColor: 'rgba(0,0,0,0.3)',
	},

	description: {
		marginTop: 8,
		marginBottom: 15,
		marginLeft: 17,
		marginRight: 17,
		fontSize: 14,
		color: 'rgba(0,0,0, 0.8)',
	},

/*-----------------------
	Macros
-------------------------*/

	macrosContainer: {
		paddingTop: 20,
		marginBottom: 15,
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-evenly',
		width: '100%',
		height: 80,
		backgroundColor: 'rgba(255,255,255,1)',
		borderTopWidth: 1,
		borderBottomWidth: 1,
		borderTopColor: 'rgba(0,0,0,0.2)',
		borderBottomColor: 'rgba(0,0,0,0.15)',
	},

	macrosLabel: {
		textAlign: 'center',
		fontSize: 12,
		fontWeight: '400',
	},

	macrosData: {
		textAlign: 'center',
		fontSize: 15,
	},

		
/*-----------------------
	Recipe Sections
-------------------------*/

	sectionTitle: {
		marginTop: 10,
		marginBottom: 5,
		marginLeft: 20,
		fontSize: 20,
		fontWeight: '600',
	},

/*-----------------------
	Ingredients
-------------------------*/

	ingredientText: {
		width: '80%',
		fontSize: 14,
		marginLeft: 20,
		marginBottom: -15,
	},

	quantityText: {
		width: '100%',
		fontStyle: 'italic',
		marginRight: 20,
		marginBottom: -15,
	},


/*-----------------------
	Instructions
-------------------------*/

	instructionStepContainer: {
		marginRight: 35,
		marginLeft: '-100%', 
		justifyContent: 'flex-start',
	},

	instructionStep: {
		width: '100%',
		fontSize: 16,
	},

	numberContainer: {
		marginLeft: 10,
		marginRight: 15,
	},

	numberBadge: {
		backgroundColor: 'rgba(68, 72, 76, 0.6)',
		borderRadius: 100,
		width: 30,
		height: 30,
	},

	instructionNumber: {
		width: '100%',
		fontSize: 15,
		fontWeight: '500',
		textAlign: 'center',
	},

/*------------------------------------------------------------------------
	Bottom Menu Section
------------------------------------------------------------------------*/
		
	menubarRow: {
		flex: 1,
		flexDirection: 'row',
		width: '100%',
		height: 50,
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: 90,
	},

	menuBar: {
		width: '20%',
		height: 100, 
		backgroundColor: 'rgba(246, 238, 238, 1)',
		borderTopColor: 'rgba(225, 218, 218, 0.7)',
		borderTopWidth: 2.1,
	},
		
	//Temporary ctrl c + ctrl v
	selectDate: {
		// marginBottom: hPercentage("5%"),
		marginRight: 40,
		paddingLeft: 40,
		// paddingTop: 10,
		fontSize: 15,
		color: "rgba(91, 88, 88, 0.9)"
	},

	choiceContainer: {
		backgroundColor: "rgba(244, 238, 238, 0.7)",
		height: 40,
		marginTop: 7,
		marginLeft: 40,
		marginRight: 40
	},

	choiceRow: {
		flex: 1,
		flexDirection: "row",
		marginTop: 7,
		marginBottom: 10,
		marginLeft: 5,
		height: 40
	},
});
