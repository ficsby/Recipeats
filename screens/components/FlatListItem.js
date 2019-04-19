import React, {Component} from 'react';
import { View, TouchableOpacity, Alert } from 'react-native';
import { ListItem, Badge, Divider} from 'react-native-elements';
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
                <ListItem key={this.props.rowId} title={this.props.title} rightTitle={this.props.rightTitle} 
                        titleStyle={this.props.titleStyle} rightTitleStyle={this.props.rightTitleStyle}
                        leftIcon={this.props.leftIcon} />
                <Divider />
            </TouchableOpacity>
        )
    }

    render() {
        const swipeSettings =
        {
            autoClose: true,
            onClose: (sectionId, rowId, direction) => {
                    if(this.state.activeRowKey != null)
                    {
                        this.setState({activeRowKey: null});
                    }
            },
            onOpen: (sectionId, rowId, direction) => {
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
                        // Refresh FlatList
                        switch(this.props.sectionId)
                        {
                            case 1: this.props.parentFlatList.state.extendedIngredients.splice(this.props.rowId, 1);
                                    this.props.parentFlatList.setState({extendedIngredients: this.props.flatListData});
                                    break;
                            case 2: this.props.parentFlatList.state.instructions.splice(this.props.rowId, 1);
                                    this.props.parentFlatList.setState({instructions: this.props.flatListData});
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
        <View>
            <Swipeout {...swipeSettings}>
                {this.renderRow()}
            </Swipeout>
        </View>
      );
    }
  }

  export default FlatListItem;