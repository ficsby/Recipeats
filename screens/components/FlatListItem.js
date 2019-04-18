import React, {Component} from 'react';
import { View, TouchableOpacity, Alert } from 'react-native';
import { ListItem, Divider} from 'react-native-elements';
import Swipeout from 'react-native-swipeout';

class FlatListItem extends Component {
    constructor(props){
        super(props);
        this.state = {
            activeRowKey: null
        }
    }

    renderRow = () => {
        return (
            <TouchableOpacity>
                <ListItem key={this.props.id} title={this.props.title} rightTitle={this.props.rightTitle} 
                        titleStyle={this.props.titleStyle} rightTitleStyle={this.props.rightTitleStyle} />
                <Divider />
            </TouchableOpacity>
        )
    }

    render() {
        const swipeSettings =
        {
            autoClose: true,
            onClose: (secId, rowId, direction) => {
                    if(this.state.activeRowKey != null)
                    {
                        this.setState({activeRowKey: null});
                    }
            },
            onOpen: (secId, rowId, direction) => {
                if(this.state.activeRowKey != null)
                {
                    this.setState({activeRowKey: this.props.id});
                }
            },
            right: 
            [
                {
                    onPress: () => { 
                        const deletedRow = this.state.activeRowKey;
                        this.props.parentFlatList.state.extendedIngredients.splice(this.props.id, 1);
                        console.log(this.props.id)
                        // Refresh FlatList
                        this.props.parentFlatList.setState({extendedIngredients: this.props.flatListData});
                    },
                    text: 'Delete',
                    type: 'delete',
                }
            ],
            rowId: this.props.index,
            sectionId: 1,
        }

      return (
        <View>
            <Swipeout {...swipeSettings}>
                {this.renderRow()}
            </Swipeout>
        </View>
      );
    }
  }

  export default FlatListItem;