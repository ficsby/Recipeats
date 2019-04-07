import React from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'
import { NavigationActions } from 'react-navigation'

export default class Sidebar extends React.Component {

    render () {
        const { navigation } = this.props

        return (
            <View style={styles.container}>
                <Text
                    onPress={() => 
                        NavigationActions.reset({
                            index: 0,
                            actions: [NavigationActions.navigate({ routeName: ' '})]
                        })

                        // navigation.navigate('')
                    }
                    style={styles.uglyDrawerItem}>
                    Home
                </Text>
                <Text
                    // onPress={() => navigation.navigate('Tabs')}
                    style={styles.uglyDrawerItem}>
                    Bookmarks
                </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({

    container: {
      flex: 1,
      backgroundColor: '#f6f6f6',
      paddingTop: 40,
      paddingHorizontal: 20
    },

    uglyDrawerItem: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#E73536',
      padding: 15,
      margin: 5,
      borderRadius: 2,
      borderColor: '#E73536',
      borderWidth: 1,
      textAlign: 'center'
    }
  })